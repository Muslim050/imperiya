/**
 * Order payload contract between the calculator (client) and /api/order
 * (server), plus the Russian-language Telegram message builder.
 *
 * The client is untrusted: it may be an outdated cached bundle or a hand-made
 * request. So the server never takes prices or labels from the payload — it
 * normalizes every field against the catalog in `data/calculator` and
 * recomputes the estimate with the same `estimateItem` the UI uses.
 */
import ru from "@/i18n/locales/ru";
import { CONTACTS } from "@/data/catalog";
import { formatPrice } from "@/lib/utils";
import { escapeHtml } from "@/lib/telegram";
import {
  COLOR_SWATCHES,
  COMPONENTS,
  DEFAULT_VARIANT,
  FRAMES_BY_PRODUCT,
  FRAME_SIZE_LIMITS,
  GLASS_OPTIONS,
  MAX_ITEMS,
  PRODUCTS,
  VARIANTS,
  estimateItem,
  findSerial,
  findVariant,
  getMaterialTypesFor,
  getSerials,
  type Frame,
  type GlassOption,
  type MaterialType,
  type Product,
  type ProductConfig,
} from "@/data/calculator";

export const ORDER_LANGS = ["ru", "uz", "en"] as const;
export type OrderLang = (typeof ORDER_LANGS)[number];

/** What the calculator POSTs to /api/order. */
export interface OrderRequestBody {
  items: unknown;
  name: unknown;
  phone: unknown;
  email: unknown;
  address: unknown;
  comment: unknown;
  lang: unknown;
}

export interface OrderContacts {
  name: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
}

export type OrderFieldError = "name" | "phone" | "email" | "items";

/* ----------------------------------------------------------- primitives */

const LIMITS = {
  name: 120,
  phone: 32,
  email: 160,
  address: 300,
  comment: 1500,
} as const;

/** Single-line text: control characters collapse so a crafted payload can't
 * fake the message structure the managers read. */
function asText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

/** Same, but real line breaks survive (the comment field). */
function asMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const num = Math.round(Number(value));
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

function pick<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

/* --------------------------------------------------------- normalizing */

/**
 * Rebuilds one cart item as a valid `ProductConfig`. Unknown enum values fall
 * back to a coherent default instead of failing the request — a stale client
 * bundle must never cost a real lead.
 */
function normalizeItem(raw: unknown): ProductConfig {
  const source = (raw ?? {}) as Partial<ProductConfig>;

  const product = pick<Product>(source.product, PRODUCTS, "window");
  const materialTypes = getMaterialTypesFor(product);
  const materialType = pick<MaterialType>(
    source.materialType,
    materialTypes,
    materialTypes[0],
  );
  const frames = FRAMES_BY_PRODUCT[product];
  const frame = pick<Frame>(source.frame, frames, frames[0]);
  const variantIds = VARIANTS[frame].map((v) => v.id);
  const variantId = pick(source.variantId, variantIds, DEFAULT_VARIANT[frame]);
  const glass = pick<GlassOption>(source.glass, GLASS_OPTIONS, "double32");

  const serials = getSerials(product, materialType);
  const serial = serials.some((s) => s.id === source.serial)
    ? String(source.serial)
    : (serials[0]?.id ?? "");

  const limits = FRAME_SIZE_LIMITS[frame];
  const width = clampInt(source.width, limits.minW, limits.maxW, limits.minW);
  const height = clampInt(source.height, limits.minH, limits.maxH, limits.minH);
  const quantity = clampInt(source.quantity, 1, 100, 1);

  const rawComponents = (source.components ?? {}) as Partial<
    ProductConfig["components"]
  >;
  const components = COMPONENTS.reduce(
    (acc, key) => {
      const component = rawComponents[key];
      acc[key] = {
        enabled: component?.enabled === true,
        width: clampInt(component?.width, 0, 4000, width),
      };
      return acc;
    },
    {} as ProductConfig["components"],
  );

  return {
    id: asText(source.id, 16) || "item",
    product,
    materialType,
    serial,
    frame,
    variantId,
    lamination: asText(source.lamination, 40),
    fittingBrand: asText(source.fittingBrand, 40),
    fittingColor: asText(source.fittingColor, 40),
    glass,
    width,
    height,
    quantity,
    components,
  };
}

export interface NormalizedOrder {
  items: ProductConfig[];
  contacts: OrderContacts;
  lang: OrderLang;
  total: number;
}

/**
 * Validates the actionable part of the lead (name + phone, e-mail if given)
 * and normalizes everything else. Mirrors the client-side rules in
 * `Calculator.submit` so a valid form never gets rejected here.
 */
export function normalizeOrder(
  body: OrderRequestBody,
):
  | { ok: true; order: NormalizedOrder }
  | { ok: false; field: OrderFieldError } {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return { ok: false, field: "items" };
  }

  const name = asText(body.name, LIMITS.name);
  if (name.length < 2) return { ok: false, field: "name" };

  const phoneDigits = asText(body.phone, LIMITS.phone).replace(/\D/g, "");
  if (!/^998\d{9}$/.test(phoneDigits)) return { ok: false, field: "phone" };

  const email = asText(body.email, LIMITS.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, field: "email" };
  }

  const items = body.items.slice(0, MAX_ITEMS).map(normalizeItem);

  return {
    ok: true,
    order: {
      items,
      contacts: {
        name,
        phone: formatUzPhone(phoneDigits),
        email,
        address: asText(body.address, LIMITS.address),
        comment: asMultiline(body.comment, LIMITS.comment),
      },
      lang: pick<OrderLang>(body.lang, ORDER_LANGS, "ru"),
      total: items.reduce((sum, item) => sum + estimateItem(item), 0),
    },
  };
}

/** `998901234567` → `+998 90 123 45 67`. */
function formatUzPhone(digits: string): string {
  const local = digits.slice(3);
  return `+998 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
}

/* ------------------------------------------------------ request number */

const TASHKENT_TZ = "Asia/Tashkent";

/** `IMP-20260725-4F2A` — dated in Tashkent time, where the managers work. */
export function createRequestNumber(now = new Date()): string {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: TASHKENT_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/-/g, "");
  const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();
  return `IMP-${date}-${suffix}`;
}

function formatTashkentTime(now: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: TASHKENT_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
}

/* -------------------------------------------------------- message text */

const calc = ru.calc;

function colorName(id: string): string {
  return COLOR_SWATCHES[id]?.name ?? id;
}

function describeItem(item: ProductConfig, index: number): string {
  const variant = findVariant(item.variantId);
  const serial = findSerial(item.product, item.materialType, item.serial);
  const fitting = serial?.fittings.find((f) => f.id === item.fittingBrand);

  const extras = COMPONENTS.filter((key) => item.components[key].enabled).map(
    (key) => `${calc.componentNames[key]} ${item.components[key].width} мм`,
  );

  const lines = [
    `<b>${index + 1}) ${escapeHtml(calc.products[item.product])}</b> · ${escapeHtml(calc.frames[item.frame])}`,
    `Створки: ${escapeHtml(variant?.name.ru ?? item.variantId)}`,
    `Серия: ${escapeHtml(serial?.name ?? (item.serial || "—"))} (${escapeHtml(calc.materials[item.materialType])})`,
    `Размер: ${item.width}×${item.height} мм · ${item.quantity} шт`,
    `Стеклопакет: ${escapeHtml(ru.glass.names[item.glass])}`,
  ];

  if (item.lamination) {
    lines.push(`Ламинация: ${escapeHtml(colorName(item.lamination))}`);
  }
  if (item.fittingBrand) {
    const brand = fitting?.name ?? item.fittingBrand;
    const color = item.fittingColor ? ` · ${colorName(item.fittingColor)}` : "";
    lines.push(`Фурнитура: ${escapeHtml(brand + color)}`);
  }
  if (extras.length) {
    lines.push(`Доп.: ${escapeHtml(extras.join(", "))}`);
  }
  lines.push(`Стоимость: <b>${formatPrice(estimateItem(item), "ru")} UZS</b>`);

  return lines.join("\n");
}

/**
 * Builds the manager-facing Telegram message (HTML parse mode, Russian — the
 * language the sales team works in, whatever locale the visitor used).
 */
export function buildOrderMessage(
  order: NormalizedOrder,
  meta: { requestNumber: string; now?: Date; source?: string },
): string {
  const now = meta.now ?? new Date();
  const { contacts } = order;

  const head = [
    "🪟 <b>Новая заявка с сайта</b>",
    `№ <code>${escapeHtml(meta.requestNumber)}</code> · ${formatTashkentTime(now)} (Ташкент)`,
    "",
    "<b>Клиент</b>",
    `Имя: ${escapeHtml(contacts.name)}`,
    `Телефон: ${escapeHtml(contacts.phone)}`,
  ];

  if (contacts.email) head.push(`Email: ${escapeHtml(contacts.email)}`);
  if (contacts.address) head.push(`Адрес: ${escapeHtml(contacts.address)}`);
  if (contacts.comment) {
    head.push(`Комментарий: ${escapeHtml(contacts.comment)}`);
  }
  head.push(`Язык сайта: ${order.lang.toUpperCase()}`);
  if (meta.source) head.push(`Страница: ${escapeHtml(meta.source)}`);

  const body = [
    "",
    `<b>Позиции (${order.items.length})</b>`,
    ...order.items.map((item, index) => `\n${describeItem(item, index)}`),
    "",
    `<b>Итого предварительно: ${formatPrice(order.total, "ru")} UZS</b>`,
    "<i>Итоговая цена уточняется после замера.</i>",
    "",
    `☎️ ${escapeHtml(CONTACTS.phone)}`,
  ];

  return [...head, ...body].join("\n");
}

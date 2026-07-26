import { NextResponse, type NextRequest } from "next/server";
import {
  buildOrderMessage,
  createRequestNumber,
  normalizeOrder,
  type OrderRequestBody,
} from "@/lib/order";
import { getTelegramConfig, sendTelegramMessage } from "@/lib/telegram";

/** Node runtime: the bot token stays server-side and we need `crypto.randomUUID`. */
export const runtime = "nodejs";

/* ------------------------------------------------------- rate limiting */
/**
 * Cheap in-memory throttle — enough to stop a bored visitor from spamming the
 * managers' chat. Per-instance only (Vercel may run several), which is fine:
 * the goal is damping, not a security boundary.
 */
const RATE_LIMIT = { max: 8, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (time) => now - time < RATE_LIMIT.windowMs,
  );
  recent.push(now);
  hits.set(key, recent);

  // Drop stale buckets so the map can't grow without bound.
  if (hits.size > 500) {
    for (const [ip, times] of hits) {
      if (times.every((time) => now - time >= RATE_LIMIT.windowMs)) {
        hits.delete(ip);
      }
    }
  }

  return recent.length > RATE_LIMIT.max;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/* ---------------------------------------------------------------- POST */

export async function POST(request: NextRequest) {
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: OrderRequestBody;
  try {
    body = (await request.json()) as OrderRequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const normalized = normalizeOrder(body);
  if (!normalized.ok) {
    return NextResponse.json(
      { ok: false, error: "validation", field: normalized.field },
      { status: 400 },
    );
  }

  const requestNumber = createRequestNumber();
  const message = buildOrderMessage(normalized.order, {
    requestNumber,
    source: request.headers.get("referer") ?? undefined,
  });

  // Not configured yet: never swallow a lead silently — log the full message so
  // it stays recoverable from the server logs, and fail loudly in production so
  // a missing env var can't go unnoticed.
  if (!getTelegramConfig().configured) {
    console.warn(
      `[order] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set — lead not delivered:\n${message}`,
    );
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "not_configured" },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, requestNumber, delivered: false });
  }

  try {
    await sendTelegramMessage(message);
  } catch (error) {
    console.error(`[order] ${requestNumber} delivery failed`, error);
    console.error(`[order] ${requestNumber} payload:\n${message}`);
    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, requestNumber, delivered: true });
}

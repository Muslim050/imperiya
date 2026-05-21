export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: number, locale: string): string {
  const loc = locale === "uz" ? "uz-UZ" : locale === "en" ? "en-US" : "ru-RU";
  return new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(value);
}

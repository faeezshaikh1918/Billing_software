import { brand } from "./brand";

export function formatMoney(value: number, compact = false): string {
  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency: brand.currency,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(brand.locale).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(brand.locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat(brand.locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

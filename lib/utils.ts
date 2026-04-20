import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUAH(kopecks: number) {
  const grn = kopecks / 100;
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(grn);
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).slice(-5).toUpperCase();
  const rnd = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .padStart(3, "0")
    .toUpperCase();
  return `TB-001-${ts}${rnd}`;
}

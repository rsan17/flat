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
  const n = Math.floor(1000 + Math.random() * 9000);
  return `TB-001-${String(n).padStart(4, "0")}`;
}

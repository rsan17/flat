import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ⚠️ style: "currency" тут використовувати НЕ можна: Node ICU віддає «799 ₴»,
 * а Chrome — «799 грн». Через це React лаявся на hydration mismatch і ціна
 * стрибала після гідратації. Форматуємо число, символ дописуємо самі.
 */
export function formatUAH(kopecks: number) {
  const grn = Math.round(kopecks / 100);
  return `${new Intl.NumberFormat("uk-UA").format(grn)} ₴`;
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).slice(-5).toUpperCase();
  const rnd = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .padStart(3, "0")
    .toUpperCase();
  return `TB-001-${ts}${rnd}`;
}

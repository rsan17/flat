"use client";

import { formatUAH } from "@/lib/utils";
import type { Product, ProductVariant } from "@/lib/products";

type Props = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  onQuantityChange: (q: number) => void;
};

export function OrderSummary({ product, variant, quantity, onQuantityChange }: Props) {
  const subtotal = variant.priceKopecks * quantity;
  const total = subtotal;

  return (
    <aside className="card shadow-brut p-6">
      <p className="caps text-xs">замовлення</p>
      <h3 className="font-display mt-1 text-3xl">{product.title}</h3>

      <div className="mt-6 flex items-start gap-4 border-t-2 border-ink pt-6">
        <div className="relative h-24 w-24 flex-shrink-0 border-2 border-ink bg-lilac">
          <div className="absolute inset-2 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const dark = (row + col) % 2 === 1;
              return (
                <div
                  key={i}
                  className={dark ? "bg-ink" : "bg-paper"}
                  aria-hidden
                />
              );
            })}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-display text-xl leading-tight">{variant.name}</div>
          <div className="text-xs opacity-70">{variant.description}</div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="h-8 w-8 border-2 border-ink font-display text-lg"
              aria-label="Менше"
            >
              −
            </button>
            <span className="font-display text-lg w-5 text-center">{quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(5, quantity + 1))}
              className="h-8 w-8 border-2 border-ink font-display text-lg"
              aria-label="Більше"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <dl className="mt-6 space-y-2 border-t-2 border-ink pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Підсумок</dt>
          <dd>{formatUAH(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Доставка</dt>
          <dd className="caps text-xs">за тарифами нп</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-end justify-between border-t-2 border-ink pt-4">
        <span className="caps text-xs">до оплати</span>
        <span className="font-display text-4xl">{formatUAH(total)}</span>
      </div>
      <p className="mt-4 rounded-sm bg-lilac px-3 py-2 text-xs">
        Виготовлення до <b>2 тижнів</b>. Після цього — відправка Новою поштою.
      </p>
    </aside>
  );
}

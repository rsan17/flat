"use client";

import Link from "next/link";
import { useState } from "react";
import { BOARD_001 } from "@/lib/products";
import { formatUAH } from "@/lib/utils";

export function Product() {
  const [variantSku, setVariantSku] = useState(BOARD_001.variants[0].sku);
  const variant =
    BOARD_001.variants.find((v) => v.sku === variantSku) ??
    BOARD_001.variants[0];

  return (
    <section id="product" className="border-b-2 border-ink bg-bone">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            <div className="shadow-brut relative aspect-square border-2 border-ink bg-paper">
              <Placeholder tag="01 · TOP" />
            </div>
            <div className="shadow-brut relative aspect-square border-2 border-ink bg-lilac">
              <Placeholder tag="02 · PIECES" dark />
            </div>
            <div className="shadow-brut relative aspect-square border-2 border-ink bg-ink">
              <Placeholder tag="03 · ANGLE" invert />
            </div>
            <div className="shadow-brut relative aspect-square border-2 border-ink bg-paper">
              <Placeholder tag="04 · DETAIL" />
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <p className="caps text-xs">002 — PRODUCT</p>
          <h2 className="font-display mt-4 text-5xl md:text-6xl">
            {BOARD_001.title}
          </h2>
          <p className="mt-4 text-lg">{BOARD_001.tagline}</p>

          <div className="mt-8">
            <div className="caps mb-3 text-xs">розмір</div>
            <div className="grid gap-3">
              {BOARD_001.variants.map((v) => {
                const active = v.sku === variantSku;
                return (
                  <button
                    key={v.sku}
                    type="button"
                    onClick={() => setVariantSku(v.sku)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between border-2 border-ink px-4 py-3 text-left transition ${
                      active
                        ? "bg-ink text-lilac shadow-brut"
                        : "bg-paper text-ink hover:-translate-y-0.5"
                    }`}
                  >
                    <div>
                      <div className="font-display text-xl">{v.name}</div>
                      <div className="text-xs opacity-80">{v.description}</div>
                    </div>
                    <div className="font-display text-2xl">
                      {formatUAH(v.priceKopecks)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/checkout?product=${BOARD_001.sku}&variant=${variant.sku}`}
              className="btn btn-lilac"
            >
              додати в замовлення
            </Link>
            <span className="caps text-xs opacity-70">
              доставка нп · оплата mono
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Placeholder({
  tag,
  dark,
  invert,
}: {
  tag: string;
  dark?: boolean;
  invert?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-end p-3">
      <span
        className={`caps px-2 py-1 text-[10px] ${
          invert
            ? "bg-lilac text-ink"
            : dark
              ? "bg-ink text-lilac"
              : "bg-ink text-lilac"
        }`}
      >
        {tag} · фото скоро
      </span>
    </div>
  );
}

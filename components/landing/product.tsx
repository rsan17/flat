"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BOARD_001, ENGRAVING_FEE_KOPECKS } from "@/lib/products";
import { formatUAH } from "@/lib/utils";

const GALLERY = [
  {
    src: "/board-01.jpg",
    alt: "THE BOARD — складена дошка з фігурами на траві",
    tag: "01 · TOP",
    bg: "bg-paper",
  },
  {
    src: "/img/product_2.png",
    alt: "THE BOARD — фігури, 3D-друк крупним планом",
    tag: "02 · PIECES",
    bg: "bg-lilac",
  },
  {
    src: "/img/product_3.png",
    alt: "THE BOARD — ракурс збоку, магнітна фіксація",
    tag: "03 · ANGLE",
    bg: "bg-ink",
  },
  {
    src: "/img/product_4.png",
    alt: "THE BOARD — деталь поверхні та розмітка",
    tag: "04 · DETAIL",
    bg: "bg-paper",
  },
] as const;

export function Product() {
  const [variantSku, setVariantSku] = useState(BOARD_001.variants[0].sku);
  const [engraving, setEngraving] = useState(false);
  const [nickname, setNickname] = useState("");
  const variant =
    BOARD_001.variants.find((v) => v.sku === variantSku) ??
    BOARD_001.variants[0];

  const nicknameTrim = nickname.trim();
  const canSubmit = !engraving || nicknameTrim.length >= 2;
  const totalKopecks =
    variant.priceKopecks + (engraving ? ENGRAVING_FEE_KOPECKS : 0);

  const params = new URLSearchParams({
    product: BOARD_001.sku,
    variant: variant.sku,
  });
  if (engraving && nicknameTrim) {
    params.set("engraving", "1");
    params.set("nickname", nicknameTrim);
  }
  const checkoutHref = `/checkout?${params.toString()}`;

  return (
    <section id="product" className="border-b-2 border-ink bg-bone">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            {GALLERY.map((shot) => (
              <div
                key={shot.tag}
                className={`shadow-brut relative aspect-square overflow-hidden border-2 border-ink ${shot.bg}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 50vw"
                  className="object-cover"
                />
                <span className="caps absolute bottom-3 left-3 bg-ink px-2 py-1 text-[10px] text-lilac">
                  {shot.tag}
                </span>
              </div>
            ))}
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

          <div className="mt-6 border-2 border-ink bg-paper p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 border-2 border-ink accent-ink"
                checked={engraving}
                onChange={(e) => setEngraving(e.target.checked)}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="caps text-xs font-bold">
                    гравіювання нікнейма · f5 club
                  </span>
                  <span className="font-display text-lg">
                    +{formatUAH(ENGRAVING_FEE_KOPECKS)}
                  </span>
                </div>
                <p className="mt-1 text-xs opacity-70">
                  Персоналізація для учасників F5 Chess Club — твій нікнейм
                  лазером на дошці.
                </p>
              </div>
            </label>
            {engraving && (
              <div className="mt-4">
                <label className="caps block text-[11px] opacity-70">
                  нікнейм для гравіювання
                </label>
                <input
                  type="text"
                  className="input mt-1"
                  placeholder="Напр. tester"
                  maxLength={40}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                {!canSubmit && (
                  <p className="caps mt-1 text-[11px] text-red-600">
                    Мінімум 2 символи
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {canSubmit ? (
              <Link href={checkoutHref} className="btn btn-lilac">
                додати в замовлення · {formatUAH(totalKopecks)}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="btn btn-lilac opacity-60"
                aria-disabled
              >
                додати в замовлення · {formatUAH(totalKopecks)}
              </button>
            )}
            <span className="caps text-xs opacity-70">
              доставка нп · оплата mono
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

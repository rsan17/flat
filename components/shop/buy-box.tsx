"use client";

import { useState } from "react";
import { formatUAH } from "@/lib/utils";
import { trackEngravingToggle } from "@/lib/analytics";
import { TrackedLink } from "@/components/analytics/tracked-link";
import type { CtaLocation } from "@/lib/analytics";
import type { Product } from "@/lib/products";

/**
 * Вибір варіанта + персоналізація + перехід у чекаут.
 * Для товарів зі status !== "available" показує статус замість кнопки.
 */
export function BuyBox({
  product,
  location = "pdp",
}: {
  product: Product;
  location?: CtaLocation;
}) {
  const [variantSku, setVariantSku] = useState(product.variants[0].sku);
  const [engraving, setEngraving] = useState(false);
  const [nickname, setNickname] = useState("");

  const variant =
    product.variants.find((v) => v.sku === variantSku) ?? product.variants[0];
  const engravingOption = product.engraving;

  const nicknameTrim = nickname.trim();
  const canSubmit = !engraving || nicknameTrim.length >= 2;
  const totalKopecks =
    variant.priceKopecks +
    (engraving && engravingOption ? engravingOption.priceKopecks : 0);

  const params = new URLSearchParams({
    product: product.sku,
    variant: variant.sku,
  });
  if (engraving && nicknameTrim) {
    params.set("engraving", "1");
    params.set("nickname", nicknameTrim);
  }
  const checkoutHref = `/checkout?${params.toString()}`;

  const purchasable = product.status === "available";
  const showVariants = product.variants.length > 1;

  return (
    <div>
      {showVariants && (
        <div className="mt-8">
          <div className="caps mb-3 text-xs">{product.variantLabel}</div>
          <div className="grid gap-3">
            {product.variants.map((v) => {
              const active = v.sku === variantSku;
              return (
                <button
                  key={v.sku}
                  type="button"
                  onClick={() => setVariantSku(v.sku)}
                  aria-pressed={active}
                  disabled={v.soldOut}
                  className={`flex w-full items-center justify-between gap-4 border-2 border-ink px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    active
                      ? "bg-ink text-paper shadow-brut"
                      : "bg-cream text-ink hover:-translate-y-0.5"
                  }`}
                >
                  <div>
                    <div className="font-display text-xl">{v.name}</div>
                    <div className="text-xs opacity-80">{v.description}</div>
                  </div>
                  <div className="font-display shrink-0 text-2xl">
                    {formatUAH(v.priceKopecks)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!showVariants && (
        <div className="mt-8 flex items-baseline gap-3">
          <span className="font-display text-5xl">
            {formatUAH(variant.priceKopecks)}
          </span>
          <span className="caps text-xs opacity-70">{variant.description}</span>
        </div>
      )}

      {engravingOption && purchasable && (
        <div className="mt-6 border-2 border-ink bg-cream p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="chk mt-1"
              checked={engraving}
              onChange={(e) => {
                setEngraving(e.target.checked);
                trackEngravingToggle(e.target.checked);
              }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="caps text-xs">{engravingOption.label}</span>
                <span className="font-display text-lg">
                  +{formatUAH(engravingOption.priceKopecks)}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-70">{engravingOption.hint}</p>
            </div>
          </label>

          {engraving && (
            <div className="mt-4">
              <label
                className="caps block text-[11px] opacity-70"
                htmlFor="engraving-nickname"
              >
                нікнейм · великими літерами · макс. {engravingOption.maxLength}
              </label>
              <input
                id="engraving-nickname"
                type="text"
                className="input mt-1 uppercase placeholder:normal-case"
                maxLength={engravingOption.maxLength}
                placeholder={engravingOption.placeholder}
                value={nickname}
                onChange={(e) => setNickname(e.target.value.toUpperCase())}
                aria-invalid={!canSubmit}
              />
              {!canSubmit && (
                <p className="err caps mt-1 text-[11px]">Мінімум 2 символи</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {!purchasable ? (
          <>
            <span className="btn btn-lilac cursor-default opacity-80">
              {product.status === "soon" ? "скоро в продажу" : "розібрали"}
            </span>
            <span className="caps text-xs opacity-70">
              напиши в інстаграм — скажемо, щойно з&apos;явиться
            </span>
          </>
        ) : canSubmit ? (
          // Умови доставки й оплати — нижче в характеристиках, тут не дублюємо.
          <TrackedLink
            event="cta_click"
            location={location}
            href={checkoutHref}
            className="btn btn-lilac"
          >
            замовити · {formatUAH(totalKopecks)}
          </TrackedLink>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled
            className="btn btn-lilac opacity-60"
          >
            замовити · {formatUAH(totalKopecks)}
          </button>
        )}
      </div>
    </div>
  );
}

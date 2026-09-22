import type { Metadata } from "next";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Marquee } from "@/components/landing/marquee";
import { ProductGrid } from "@/components/shop/product-grid";
import { ShopFaq } from "@/components/shop/shop-faq";
import { PRODUCT_LIST } from "@/lib/products";
import { PLACE } from "@/lib/place";

export const metadata: Metadata = {
  title: "Магазин",
  description:
    "Мерч FLAT5: шахові дошки F5 BOARD, футболки, стікери й подарункові бокси. Доставка Новою поштою або самовивіз із площі Ринок, 39.",
};

export default function ShopPage() {
  const available = PRODUCT_LIST.filter((p) => p.status === "available");
  const upcoming = PRODUCT_LIST.filter((p) => p.status !== "available");

  return (
    <>
      <SiteNav />
      <Marquee items={["МАГАЗИН", "F5·BOARD", "МЕРЧ", "UA MADE", "FLAT5"]} />

      <main>
        <section className="grain relative border-b-2 border-ink bg-lilac">
          <div className="relative z-[2] mx-auto max-w-[1400px] px-6 py-16 md:py-24">
            <p className="caps text-xs">магазин · flat5</p>
            <h1 className="font-display mt-4 text-[16vw] leading-[0.82] md:text-[9rem]">
              ЗАБРАТИ
              <br />
              <span className="hl-paper">З СОБОЮ</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg">
              Речі, які ми зробили для себе, а потім зрозуміли, що їх хочуть і
              інші.
            </p>
            <p className="caps mt-6 text-xs">
              самовивіз із {PLACE.addressShort} · доставка новою поштою
            </p>
          </div>
        </section>

        <section className="border-b-2 border-ink bg-paper">
          <div className="mx-auto max-w-[1400px] px-6 py-16">
            <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-4">
              <h2 className="font-display text-4xl md:text-6xl">В НАЯВНОСТІ</h2>
              <span className="caps text-xs opacity-70">
                {available.length} позиції
              </span>
            </div>
            <ProductGrid products={available} />
          </div>
        </section>

        {upcoming.length > 0 && (
          <section className="border-b-2 border-ink bg-cream">
            <div className="mx-auto max-w-[1400px] px-6 py-16">
              <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-4">
                <h2 className="font-display text-4xl md:text-6xl">
                  СКОРО В ПРОДАЖУ
                </h2>
                <span className="caps text-xs opacity-70">
                  стежити в інстаграмі
                </span>
              </div>
              <ProductGrid products={upcoming} />
            </div>
          </section>
        )}

        <ShopFaq />
      </main>

      <SiteFooter />
    </>
  );
}

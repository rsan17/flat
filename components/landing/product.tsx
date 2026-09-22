import { BuyBox } from "@/components/shop/buy-box";
import { ProductShot } from "@/components/shop/product-shot";
import { BOARD_001 } from "@/lib/products";

export function Product() {
  return (
    <section id="product" className="border-b-2 border-ink bg-cream">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            {BOARD_001.media.map((shot) => (
              <div
                key={shot.tag}
                className="shadow-brut relative aspect-square border-2 border-ink"
              >
                <ProductShot
                  media={shot}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 50vw"
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <p className="caps text-xs">002 — ДОШКА</p>
          <h2 className="font-display mt-4 text-5xl md:text-6xl">
            {BOARD_001.title}
          </h2>
          <p className="mt-4 text-lg">{BOARD_001.tagline}</p>

          <BuyBox product={BOARD_001} location="product" />

          <a
            href={`/shop/${BOARD_001.sku}`}
            className="caps mt-6 inline-block text-xs underline underline-offset-4"
          >
            уся інформація про дошку →
          </a>
        </div>
      </div>
    </section>
  );
}

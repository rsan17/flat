import { ProductShot } from "@/components/shop/product-shot";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { formatUAH } from "@/lib/utils";
import { priceFromKopecks, type Product } from "@/lib/products";

/**
 * Блок товару на головній: тільки суть і перехід на PDP.
 * Вибір розміру, гравіювання і кнопка «замовити» живуть на PDP.
 */
export function ProductSection({
  product,
  index,
  reversed = false,
  background = "paper",
}: {
  product: Product;
  /** Порядковий номер для рубрикатора «001 —» */
  index: string;
  reversed?: boolean;
  background?: "paper" | "cream";
}) {
  const price = priceFromKopecks(product);
  const multiPrice =
    new Set(product.variants.map((v) => v.priceKopecks)).size > 1;
  const purchasable = product.status === "available";
  const href = `/product/${product.sku}`;

  return (
    <section
      id={product.sku}
      className={`scroll-mt-16 border-b-2 border-ink ${
        background === "cream" ? "bg-cream" : "bg-paper"
      }`}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-12 md:py-20">
        <div
          className={`md:col-span-6 ${
            reversed ? "md:order-2 md:col-start-7" : ""
          }`}
        >
          <div className="shadow-brut relative aspect-[4/3] border-2 border-ink">
            <ProductShot
              media={product.media[0]}
              sizes="(min-width: 768px) 48vw, 100vw"
                className="h-full w-full"
            />
          </div>
        </div>

        <div className={`md:col-span-5 ${reversed ? "md:order-1" : "md:col-start-8"}`}>
          <p className="caps text-xs">
            {index} — {product.category === "board" ? "ДОШКА" : "МЕРЧ"}
          </p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-6xl">
            {product.title}
          </h2>
          <p className="mt-4 text-lg">{product.tagline}</p>

          <dl className="mt-8 border-t-2 border-ink">
            {product.specs.slice(0, 3).map((s) => (
              <div
                key={s.label}
                className="flex justify-between gap-6 border-b border-ink/15 py-2.5"
              >
                <dt className="caps shrink-0 text-[11px] opacity-70">
                  {s.label}
                </dt>
                <dd className="text-right text-sm">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <TrackedLink
              event="cta_click"
              location="catalog"
              href={href}
              className="btn btn-lilac"
            >
              {purchasable ? "дивитись і купити" : "дивитись"}
            </TrackedLink>
            <div className="font-display text-3xl">
              {multiPrice && (
                <span className="caps mr-1 align-middle text-xs opacity-60">
                  від
                </span>
              )}
              {formatUAH(price)}
            </div>
            {!purchasable && (
              <span className="tag tag-lilac">
                {product.status === "soon" ? "скоро" : "розібрали"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

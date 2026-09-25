import Link from "next/link";
import { ProductShot } from "@/components/shop/product-shot";
import { formatUAH } from "@/lib/utils";
import { priceFromKopecks, type Product } from "@/lib/products";

const STATUS_LABEL: Record<Product["status"], string | null> = {
  available: null,
  soon: "скоро",
  "sold-out": "розібрали",
};

export function ProductCard({ product }: { product: Product }) {
  const from = priceFromKopecks(product);
  const multiPrice = new Set(product.variants.map((v) => v.priceKopecks)).size > 1;
  const statusLabel = STATUS_LABEL[product.status];

  return (
    <article className="product-card">
      <Link
        href={`/product/${product.sku}`}
        className="group block focus:outline-none"
      >
        <div className="relative aspect-square border-b-2 border-ink">
          <ProductShot
            media={product.media[0]}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="h-full w-full"
          />
          {statusLabel && (
            <span className="tag tag-lilac absolute right-3 top-3">
              {statusLabel}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-3xl group-hover:underline">
            {product.title}
          </h3>
          <p className="mt-2 text-sm leading-snug opacity-80">
            {product.cardDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <span key={b} className="tag tag-paper border-2 border-ink">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3 border-t-2 border-ink pt-4">
            <div className="font-display text-3xl">
              {multiPrice && (
                <span className="caps mr-1 align-middle text-xs opacity-60">
                  від
                </span>
              )}
              {formatUAH(from)}
            </div>
            <span className="caps text-xs underline-offset-4 group-hover:underline">
              {product.status === "available" ? "купити →" : "дивитись →"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

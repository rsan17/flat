import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-grid";
import { PRODUCT_LIST } from "@/lib/products";

/**
 * Вітрина решти товарів на головній. Дошка вже показана вище окремим блоком,
 * тому тут — усе, крім неї.
 */
export function Catalog() {
  const rest = PRODUCT_LIST.filter((p) => p.sku !== "board-001");
  if (rest.length === 0) return null;

  return (
    <section id="shop" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="caps text-xs">003 — МАГАЗИН</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-7xl">
              НЕ ТІЛЬКИ
              <br />
              <span className="hl">ДОШКА</span>.
            </h2>
            <p className="mt-6 max-w-xl text-lg">
              Мерч, який ми носимо самі: футболка кольору нашого лілаку, стікери
              з лодонькою «дай п&apos;ять» і бокс, який приємно комусь вручити.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link href="/shop" className="btn btn-outline">
              весь магазин
            </Link>
          </div>
        </div>

        <ProductGrid products={rest} />
      </div>
    </section>
  );
}

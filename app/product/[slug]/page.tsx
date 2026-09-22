import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { ProductShot } from "@/components/shop/product-shot";
import { ProductGrid } from "@/components/shop/product-grid";
import { BuyBox } from "@/components/shop/buy-box";
import { ShopFaq } from "@/components/shop/shop-faq";
import { getProduct, PRODUCT_LIST } from "@/lib/products";
import { PLACE } from "@/lib/place";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCT_LIST.map((p) => ({ slug: p.sku }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Товар не знайдено" };
  return {
    title: product.title,
    description: product.cardDescription,
    openGraph: {
      title: `${product.title} · FLAT5`,
      description: product.cardDescription,
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const others = PRODUCT_LIST.filter((p) => p.sku !== product.sku).slice(0, 3);
  const [hero, ...rest] = product.media;

  return (
    <>
      <SiteNav />

      <main>
        <nav
          aria-label="Хлібні крихти"
          className="border-b-2 border-ink bg-paper"
        >
          <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-3 text-xs">
            <Link href="/" className="caps hover:underline">
              flat5
            </Link>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <span className="caps opacity-60">{product.title}</span>
          </div>
        </nav>

        <section className="border-b-2 border-ink bg-paper">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-12 md:grid-cols-12 md:py-16">
            {/* Галерея */}
            <div className="md:col-span-7">
              <div className="shadow-brut relative aspect-square border-2 border-ink">
                <ProductShot
                  media={hero}
                  priority
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="h-full w-full"
                />
              </div>

              {rest.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {rest.map((m) => (
                    <div
                      key={m.tag}
                      className="relative aspect-square border-2 border-ink"
                    >
                      <ProductShot
                        media={m}
                        sizes="(min-width: 768px) 18vw, 30vw"
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Купівельний блок */}
            <div className="md:col-span-5">
              <div className="flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <span key={b} className="tag tag-lilac">
                    {b}
                  </span>
                ))}
              </div>

              <h1 className="font-display mt-4 text-5xl md:text-6xl">
                {product.title}
              </h1>
              <p className="mt-4 text-lg">{product.tagline}</p>

              <BuyBox product={product} />

              <dl className="mt-10 border-t-2 border-ink pt-6">
                {product.specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-6 border-b border-ink/15 py-3"
                  >
                    <dt className="caps shrink-0 text-[11px] opacity-70">
                      {s.label}
                    </dt>
                    <dd className="text-right text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Опис */}
        <section className="border-b-2 border-ink bg-cream">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="caps text-xs">про річ</p>
              <h2 className="font-display mt-4 text-4xl md:text-5xl">
                ЩО ЦЕ
                <br />І НАВІЩО.
              </h2>
            </div>
            <div className="space-y-5 text-lg md:col-span-7 md:col-start-6">
              {product.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p className="caps border-l-4 border-lilac pl-4 text-xs opacity-80">
                самовивіз із {PLACE.addressShort} · доставка новою поштою ·
                оплата mono
              </p>
            </div>
          </div>
        </section>

        {/* Інші товари */}
        {others.length > 0 && (
          <section className="border-b-2 border-ink bg-paper">
            <div className="mx-auto max-w-[1400px] px-6 py-16">
              <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-4">
                <h2 className="font-display text-4xl md:text-5xl">
                  ЩЕ В НАС Є
                </h2>
                <Link href="/#board-001" className="caps text-xs hover:underline">
                  усі товари →
                </Link>
              </div>
              <ProductGrid products={others} />
            </div>
          </section>
        )}

        <ShopFaq />
      </main>

      <SiteFooter />
    </>
  );
}

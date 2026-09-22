import { ChessClub } from "@/components/landing/chess-club";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { PlaceTeaser } from "@/components/landing/place-teaser";
import { ProductSection } from "@/components/landing/product-section";
import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";
import { PRODUCT_LIST } from "@/lib/products";

/**
 * Головна — вітрина, а не лонгрід: по секції на товар, деталі на PDP.
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <Marquee />
      <main>
        <Hero />

        {PRODUCT_LIST.map((product, i) => (
          <ProductSection
            key={product.sku}
            product={product}
            index={String(i + 1).padStart(3, "0")}
            reversed={i % 2 === 1}
            background={i % 2 === 1 ? "cream" : "paper"}
          />
        ))}

        <PlaceTeaser />
        <ChessClub />
      </main>
      <SiteFooter />
    </>
  );
}

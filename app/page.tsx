import { About } from "@/components/landing/about";
import { Catalog } from "@/components/landing/catalog";
import { ChessClub } from "@/components/landing/chess-club";
import { CTA } from "@/components/landing/cta";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { PlaceTeaser } from "@/components/landing/place-teaser";
import { Product } from "@/components/landing/product";
import { SiteFooter } from "@/components/site/footer";
import { SiteNav } from "@/components/site/nav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <Marquee />
      <main>
        <Hero />
        <About />
        <Marquee
          items={["DROP·001", "55/55", "UA MADE", "3D·PRINT", "CASTLE"]}
          variant="lilac"
        />
        <Product />
        <Catalog />
        <PlaceTeaser />
        <CTA />
        <ChessClub />
      </main>
      <SiteFooter />
    </>
  );
}

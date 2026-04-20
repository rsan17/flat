import { About } from "@/components/landing/about";
import { ChessClub } from "@/components/landing/chess-club";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Nav } from "@/components/landing/nav";
import { Product } from "@/components/landing/product";

export default function Home() {
  return (
    <>
      <Nav />
      <Marquee />
      <main>
        <Hero />
        <About />
        <Marquee
          items={["DROP·001", "55/55", "UA MADE", "3D·PRINT", "FUTURA"]}
          variant="lilac"
        />
        <Product />
        <CTA />
        <ChessClub />
      </main>
      <Footer />
    </>
  );
}

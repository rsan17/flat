import { About } from "@/components/landing/about";
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
          items={["DROP·001", "12/12", "UA MADE", "OAK·WALNUT", "FUTURA"]}
          variant="lilac"
        />
        <Product />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

import { BoardCTA } from "@/components/flat5/board-cta";
import { Feeling } from "@/components/flat5/feeling";
import { Footer } from "@/components/flat5/footer";
import { Hero } from "@/components/flat5/hero";
import { Nav } from "@/components/flat5/nav";
import { Place } from "@/components/flat5/place";
import { Secret } from "@/components/flat5/secret";
import { Marquee } from "@/components/landing/marquee";

export default function Home() {
  return (
    <>
      <Nav />
      <Marquee
        items={[
          "FLAT5",
          "ПЛОЩА РИНОК 39",
          "БЕЗ ВИВІСКИ",
          "НАТИСНИ 5",
          "ЛЬВІВ",
        ]}
      />
      <main>
        <Hero />
        <Marquee
          items={["МІСЦЕ СВОЇХ", "ТИХО", "ЗАТИШНО", "FLAT·5", "UA"]}
          variant="lilac"
        />
        <Place />
        <Secret />
        <Feeling />
        <BoardCTA />
      </main>
      <Footer />
    </>
  );
}

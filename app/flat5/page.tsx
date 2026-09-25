import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Marquee } from "@/components/landing/marquee";
import { Hero } from "@/components/flat5/hero";
import { Place } from "@/components/flat5/place";
import { Secret } from "@/components/flat5/secret";
import { Highlights } from "@/components/flat5/highlights";
import { Feeling } from "@/components/flat5/feeling";
import { PLACE } from "@/lib/place";

export const metadata: Metadata = {
  title: "Заклад",
  description:
    "FLAT5 — кав'ярня і простір своїх у центрі Львова, навпроти ратуші. Площа Ринок, 39, без вивіски: тицяй «5» на домофоні. Кухня, дворик, шаховий клуб, квартирники.",
};

export default function Flat5Page() {
  return (
    <>
      <SiteNav />
      <Marquee
        items={[
          "МІСЦЕ СВОЇХ",
          PLACE.addressShort.toUpperCase(),
          "БЕЗ ВИВІСКИ",
          "11–21",
          "FLAT5",
        ]}
        variant="lilac"
      />

      <main>
        <Hero />
        <Place />
        <Secret />
        <Highlights />
        <Feeling />

        <section className="grain relative border-b-2 border-ink bg-lilac">
          <div className="relative z-[2] mx-auto max-w-[1400px] px-6 py-20">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div>
                <p className="caps text-xs">005 — ЗАБРАТИ З СОБОЮ</p>
                <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-7xl">
                  ЧАСТИНКА FLAT5
                  <br />
                  <span className="hl-paper">ДОДОМУ</span>.
                </h2>
                <p className="mt-6 max-w-xl text-lg">
                  Шахова дошка з нашого клубу і футболка, в якій тут грають.
                  Усе, що можна винести за двері.
                </p>
              </div>
              <Link href="/#board-001" className="btn btn-paper">
                до товарів
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

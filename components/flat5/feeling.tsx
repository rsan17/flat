import Image from "next/image";
import { Sofa } from "@/components/brand/marks";

export function Feeling() {
  return (
    <section id="feeling" className="border-b-2 border-ink bg-cream">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="shadow-brut relative aspect-[4/5] overflow-hidden border-2 border-ink bg-paper">
            <Image
              src="/img/place/inside-club.webp"
              alt="Всередині FLAT5: дзеркальна куля, вивіска шахового клубу, повний зал"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:self-center">
          <p className="caps text-xs">004 — ВІДЧУТТЯ</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-7xl">
            FLAT5 — <br />
            <span className="hl">НЕ ПРОСТО</span>
            <br />
            МІСЦЕ.
          </h2>
          <p className="mt-8 max-w-lg text-lg md:text-xl">
            Це відчуття, в яке хочеться повертатись. Простір, куди приходять як
            додому: заходиш — і розчиняєшся в затишку з чашкою кави.
          </p>
          <Sofa className="mt-8 w-56 md:w-72" />
        </div>
      </div>
    </section>
  );
}

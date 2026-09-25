import Image from "next/image";

export function Place() {
  return (
    <section id="place" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="caps text-xs">001 — МІСЦЕ</p>
          <h2 className="font-display mt-4 text-5xl md:text-7xl">
            ПРЯМО
            <br />В ЦЕНТРІ.
          </h2>
        </div>
        <div className="space-y-6 text-lg md:col-span-7 md:col-start-6">
          <p>
            ми прямо в центрі — навпроти Львівська ратуша,{" "}
            <span className="font-display text-2xl">площа ринок, 39</span>.
          </p>
          <p>
            але всередині — ніби інший ритм: тихо, затишно і без міського шуму.
          </p>
          <ul className="mt-6 grid gap-3 text-base">
            <li className="border-l-4 border-lilac pl-4">
              <span className="caps text-[11px] opacity-70">адреса</span>
              <div>площа ринок, 39 · львів</div>
            </li>
            <li className="border-l-4 border-lilac pl-4">
              <span className="caps text-[11px] opacity-70">навпроти</span>
              <div>львівська ратуша</div>
            </li>
            <li className="border-l-4 border-lilac pl-4">
              <span className="caps text-[11px] opacity-70">всередині</span>
              <div>тихо · затишно · без шуму</div>
            </li>
          </ul>
        </div>

        <div className="md:col-span-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="shadow-brut relative aspect-square overflow-hidden border-2 border-ink bg-cream">
              <Image
                src="/img/place/yard-day.webp"
                alt="Дворик FLAT5 удень: столики, парасолі й гірлянда з прапорців"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/FR3B8nWqyTe6Suff7"
              target="_blank"
              rel="noopener noreferrer"
              className="shadow-brut relative block aspect-square overflow-hidden border-2 border-ink bg-cream"
            >
              <iframe
                src="https://maps.google.com/maps?q=площа+Ринок+39+Львів+Україна&hl=uk&z=17&output=embed"
                className="pointer-events-none h-full w-full"
                loading="lazy"
                title="FLAT5 на карті"
              />
              <span className="caps absolute bottom-3 left-3 bg-ink px-2 py-1 text-[10px] text-lilac">
                відкрити на карті ↗
              </span>
            </a>
            <div className="shadow-brut relative aspect-square overflow-hidden border-2 border-ink bg-cream">
              <Image
                src="/img/place/inside-garlands.webp"
                alt="Всередині FLAT5: паперові гірлянди під стелею й таблиця рейтингу шахового клубу"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

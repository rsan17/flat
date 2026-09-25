import Image from "next/image";
import { HOW_TO_FIND } from "@/lib/place";

export function Secret() {
  return (
    <section
      id="how-to-find"
      className="grain relative border-b-2 border-ink bg-ink text-paper"
    >
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="caps text-xs text-lilac">002 — ЯК ЗНАЙТИ</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-8xl">
            БЕЗ
            <br />
            <span className="text-lilac">ВИВІСКИ.</span>
          </h2>
          <p className="mt-8 max-w-md text-lg text-paper/90">
            у нас немає вивіски. є лише маленький секрет.
          </p>

          <div className="shadow-brut relative mt-10 aspect-[3/4] overflow-hidden border-2 border-lilac">
            <Image
              src="/img/place/entrance.webp"
              alt="Вхід у FLAT5: скляні двері з літерами FLAT і гірлянда з прапорців над столиками"
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <ol className="space-y-6 md:col-span-7 md:col-start-6">
          {HOW_TO_FIND.map((s) => (
            <li
              key={s.num}
              className="flex gap-6 border-b border-lilac/40 pb-6"
            >
              <div className="font-display text-5xl text-lilac md:text-6xl">
                {s.num}
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl">
                  {s.title}
                </div>
                <div className="mt-2 text-paper/80">{s.body}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

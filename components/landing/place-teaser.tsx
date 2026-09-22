import Image from "next/image";
import Link from "next/link";
import { PLACE } from "@/lib/place";

/**
 * Коротко про заклад. Повна версія — на /flat5.
 */
export function PlaceTeaser() {
  return (
    <section id="place" className="grain relative border-b-2 border-ink bg-lilac">
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="caps text-xs">003 — ЗАКЛАД</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.88] md:text-7xl">
            ВСЕ ЦЕ
            <br />
            <span className="hl-paper">З КВАРТИРИ</span>.
          </h2>
          <p className="mt-6 max-w-xl text-lg">
            FLAT5 — кав&apos;ярня і простір своїх у центрі Львова, {PLACE.landmark}.
            Тут з&apos;явилась ця дошка, футболка і все інше.
          </p>

          <dl className="caps mt-8 grid grid-cols-2 gap-6 text-xs">
            <div>
              <dt className="opacity-70">адреса</dt>
              <dd className="mt-1 text-sm normal-case">{PLACE.address}</dd>
            </div>
            <div>
              <dt className="opacity-70">працюємо</dt>
              <dd className="mt-1 text-sm normal-case">
                {PLACE.hoursLabel} · {PLACE.hours}
              </dd>
            </div>
          </dl>

          <Link href="/flat5" className="btn btn-paper mt-8">
            про заклад
          </Link>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="shadow-brut relative aspect-[4/3] overflow-hidden border-2 border-ink bg-cream">
            <Image
              src="/img/main_1.jpg"
              alt="FLAT5 — дворик закладу"
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

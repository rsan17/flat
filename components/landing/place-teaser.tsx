import Image from "next/image";
import Link from "next/link";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { PLACE, PLACE_HIGHLIGHTS } from "@/lib/place";

/**
 * Блок про заклад на головній. Повна версія — на /flat5.
 */
export function PlaceTeaser() {
  return (
    <section id="place" className="grain relative border-b-2 border-ink bg-lilac">
      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="caps text-xs">004 — ЗАКЛАД</p>
            <h2 className="font-display mt-4 text-5xl leading-[0.88] md:text-7xl">
              ДОШКА ПРИЇХАЛА
              <br />
              <span className="hl-paper">З КВАРТИРИ</span>.
            </h2>
            <p className="mt-6 max-w-xl text-lg">
              FLAT5 — кав&apos;ярня і простір своїх у центрі Львова, {PLACE.landmark}.
              Кухня від сніданків до вечора, схований дворик, шаховий клуб і
              квартирники. Тут з&apos;явилась ця дошка — і решта мерчу теж.
            </p>
            <p className="font-hand mt-6 text-3xl">
              дай п&apos;ять і ще одну каву
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/flat5" className="btn btn-paper">
                про заклад
              </Link>
              <TrackedLink
                event="outbound_click"
                target="other"
                external
                href={PLACE.menuUrl}
                className="btn btn-outline"
              >
                меню кухні ↗
              </TrackedLink>
            </div>

            <dl className="caps mt-10 grid grid-cols-2 gap-6 text-xs">
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
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="shadow-brut relative aspect-[4/3] overflow-hidden border-2 border-ink bg-cream">
              <Image
                src="/img/main_1.jpg"
                alt="FLAT5 — інтер'єр закладу"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <ul className="mt-6 grid gap-3">
              {PLACE_HIGHLIGHTS.slice(0, 3).map((h) => (
                <li
                  key={h.tag}
                  className="border-2 border-ink bg-paper px-4 py-3"
                >
                  <span className="caps text-[11px] opacity-70">{h.tag}</span>
                  <div className="font-display text-xl">{h.title}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

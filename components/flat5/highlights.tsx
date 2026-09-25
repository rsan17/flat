import { TrackedLink } from "@/components/analytics/tracked-link";
import { PLACE, PLACE_HIGHLIGHTS } from "@/lib/place";

export function Highlights() {
  return (
    <section id="inside" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="caps text-xs">003 — ВСЕРЕДИНІ</p>
            <h2 className="font-display mt-4 text-5xl md:text-7xl">
              ЩО ТУТ
              <br />
              <span className="hl">ВІДБУВАЄТЬСЯ</span>.
            </h2>
            <p className="mt-6 text-lg">{PLACE.serviceNote}</p>
            <TrackedLink
              event="outbound_click"
              target="other"
              external
              href={PLACE.menuUrl}
              className="btn btn-lilac mt-6"
            >
              подивитись меню ↗
            </TrackedLink>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <ul className="grid gap-4 sm:grid-cols-2">
              {PLACE_HIGHLIGHTS.map((h) => (
                <li
                  key={h.tag}
                  className="border-2 border-ink bg-cream p-5 transition hover:-translate-y-1 hover:shadow-brut-sm"
                >
                  <span className="tag tag-lilac">{h.tag}</span>
                  <h3 className="font-display mt-3 text-2xl">{h.title}</h3>
                  <p className="mt-2 text-sm leading-snug opacity-80">
                    {h.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

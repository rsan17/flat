import Link from "next/link";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { PLACE } from "@/lib/place";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-6xl md:text-8xl">FLAT5</div>
            <p className="font-hand mt-3 text-2xl text-lilac">
              дай п&apos;ять і ще одну каву
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="caps text-xs text-lilac">де ми</p>
            <address className="mt-3 not-italic leading-relaxed">
              {PLACE.address}
              <br />
              {PLACE.doorHint}
            </address>
            <TrackedLink
              event="outbound_click"
              target="maps"
              external
              href={PLACE.mapsUrl}
              className="caps mt-3 inline-block text-xs underline underline-offset-4"
            >
              відкрити на карті ↗
            </TrackedLink>
          </div>

          <div className="md:col-span-2">
            <p className="caps text-xs text-lilac">коли</p>
            <p className="mt-3 leading-relaxed">
              {PLACE.hoursLabel}
              <br />
              {PLACE.hours}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="caps text-xs text-lilac">сторінки</p>
            <ul className="mt-3 grid gap-2 text-sm">
              <li>
                <Link href="/shop" className="hover:underline">
                  магазин
                </Link>
              </li>
              <li>
                <Link href="/flat5" className="hover:underline">
                  про заклад
                </Link>
              </li>
              <li>
                <Link href="/#club" className="hover:underline">
                  chess club
                </Link>
              </li>
              <li>
                <TrackedLink
                  event="outbound_click"
                  target="other"
                  external
                  href={PLACE.menuUrl}
                  className="hover:underline"
                >
                  меню кухні ↗
                </TrackedLink>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  умови сервісу
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t-2 border-lilac/40 pt-6 text-xs md:flex-row md:items-center md:justify-between">
          <p className="opacity-70">
            © {new Date().getFullYear()} · FLAT5 · ФОП · Львів, Україна
          </p>
          <div className="caps flex flex-wrap gap-6">
            <TrackedLink
              event="outbound_click"
              target="instagram_flat5"
              external
              href={PLACE.instagramUrl}
              className="hover:underline"
            >
              instagram
            </TrackedLink>
            <TrackedLink
              event="outbound_click"
              target="telegram_f5chess"
              external
              href={PLACE.telegramUrl}
              className="hover:underline"
            >
              telegram
            </TrackedLink>
            <TrackedLink
              event="outbound_click"
              target="instagram_17dots"
              external
              href="https://www.instagram.com/17dots.agency?igsh=MWtyd2o1eDVnMzdwaw%3D%3D&utm_source=qr"
              className="hover:underline"
            >
              created with love by 17
            </TrackedLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

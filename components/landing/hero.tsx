import { PLACE } from "@/lib/place";

/**
 * Hero магазину — коротка «вивіска»: назва, одне речення, рядок про каву.
 * Без картинки і без списку товарів, щоб висота не росла з асортиментом
 * і перший товар було видно одразу під ним.
 */
export function Hero() {
  return (
    <section id="shop" className="grain relative border-b-2 border-ink bg-paper">
      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 py-10 md:py-16">
        <p className="caps mb-5 text-xs">
          FLAT5 · ЛЬВІВ · {PLACE.addressShort.toUpperCase()}
        </p>
        <h1 className="font-display text-[15vw] leading-[0.9] md:text-[9vw] lg:text-[9rem]">
          FLAT5 <span className="hl">SHOP.</span>
        </h1>
        <div className="mt-6 flex flex-col gap-4 md:mt-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <p className="max-w-xl text-lg md:text-xl">
            Речі з квартири №5. Ми зробили їх для себе — і залишили трохи для
            своїх.
          </p>
          <p className="font-hand shrink-0 text-3xl">
            дай п&apos;ять і ще одну каву
          </p>
        </div>
      </div>
    </section>
  );
}

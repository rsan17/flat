import Image from "next/image";
import { PLACE } from "@/lib/place";

export function Hero() {
  return (
    <section className="grain relative border-b-2 border-ink bg-paper">
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="caps mb-6 text-xs">
            FLAT5 · ЛЬВІВ · {PLACE.addressShort.toUpperCase()}
          </p>
          <h1 className="font-display text-[15vw] leading-[0.82] md:text-[10vw] lg:text-[9.5rem]">
            МІСЦЕ
            <br />
            <span className="hl">СВОЇХ</span>.
          </h1>
          <p className="mt-8 max-w-xl text-lg md:text-xl">
            тих, хто любить атмосферу, розмови і випадкові знайомства, які
            стають не випадковими.
          </p>
          <p className="font-hand mt-6 text-3xl">
            дай п&apos;ять і ще одну каву
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#inside" className="btn btn-lilac">
              що тут є
            </a>
            <a href="#how-to-find" className="btn btn-outline">
              як нас знайти
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="shadow-brut relative aspect-[4/5] overflow-hidden border-2 border-ink bg-lilac">
            <Image
              src="/img/main_1.jpg"
              alt="FLAT5 — інтер'єр"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

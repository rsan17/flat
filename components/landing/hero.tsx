import Image from "next/image";
import { PLACE } from "@/lib/place";

export function Hero() {
  return (
    <section className="grain relative border-b-2 border-ink bg-paper">
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-6">
          <p className="caps mb-6 text-xs">
            FLAT5 · ЛЬВІВ · {PLACE.addressShort.toUpperCase()}
          </p>
          <h1 className="font-display text-[13vw] leading-[0.82] md:text-[8.5vw] lg:text-[8rem]">
            РЕЧІ З
            <br />
            <span className="hl">КВАРТИРИ</span> №5.
          </h1>
          <p className="mt-8 max-w-lg text-lg md:text-xl">
            Ми зробили їх для себе — і залишили трохи для своїх.
          </p>
          <p className="font-hand mt-6 text-3xl">
            дай п&apos;ять і ще одну каву
          </p>
        </div>

        <div className="md:col-span-6">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[-18%] left-[28%] right-0 top-[55%] -z-0 rounded-[50%] bg-ink/30 blur-2xl md:blur-3xl"
            />
            <Image
              src="/hero-board.webp"
              alt="F5 BOARD — 3D-друкована шахова дошка F5 CHESS CLUB, вид збоку"
              width={3024}
              height={1599}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="relative h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

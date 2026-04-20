import Link from "next/link";

export function BoardCTA() {
  return (
    <section className="grain relative border-b-2 border-ink bg-lilac text-ink">
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="caps text-xs">004 — F5·BOARD</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-8xl">
            У НАС Є
            <br />
            <span className="inline-block bg-ink px-3 py-1 text-lilac">
              ДОШКА.
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lg md:text-xl">
            F5·BOARD — обмежена серія шахових дошок ручної роботи. зроблено у
            львові для тих, хто любить робити хід не як у всіх.
          </p>
        </div>

        <div className="md:col-span-5 md:self-end">
          <div className="shadow-brut relative aspect-square border-2 border-ink bg-paper">
            <div className="absolute inset-6 grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const dark = (row + col) % 2 === 1;
                return (
                  <div
                    key={i}
                    className={dark ? "bg-ink" : "bg-paper"}
                    aria-hidden
                  />
                );
              })}
            </div>
            <span className="caps absolute right-3 top-3 bg-ink px-2 py-1 text-[10px] text-lilac">
              DROP·001 · 12/12
            </span>
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="flex flex-wrap items-center justify-between gap-6 border-t-2 border-ink pt-10">
            <div className="font-display text-4xl md:text-6xl">
              ЗАЗИРНИ НА ДОШКУ →
            </div>
            <Link href="/team-onboarding" className="btn">
              відкрити the·board
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

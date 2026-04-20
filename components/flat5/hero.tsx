export function Hero() {
  return (
    <section className="grain relative border-b-2 border-ink bg-paper">
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12 md:py-24">
        <div className="md:col-span-7">
          <p className="caps mb-6 text-xs">FLAT5 · ЛЬВІВ · ПЛОЩА РИНОК 39</p>
          <h1 className="font-display text-[13vw] leading-[0.82] md:text-[10vw] lg:text-[9.5rem]">
            МІСЦЕ
            <br />
            <span className="inline-block bg-lilac px-3 py-1">СВОЇХ</span>.
          </h1>
          <p className="mt-8 max-w-xl text-lg md:text-xl">
            тих, хто любить атмосферу, розмови і випадкові знайомства, які
            стають не випадковими.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#place" className="btn btn-lilac">
              що це
            </a>
            <a href="#how-to-find" className="btn btn-outline">
              як нас знайти
            </a>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="shadow-brut relative aspect-[4/5] overflow-hidden border-2 border-ink bg-lilac">
            <PlaceholderTag tag="01 · HERO" />
            <span className="caps absolute right-3 top-3 bg-ink px-2 py-1 text-[10px] text-lilac">
              FLAT · 5
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaceholderTag({ tag }: { tag: string }) {
  return (
    <span className="caps absolute bottom-3 left-3 bg-ink px-2 py-1 text-[10px] text-lilac">
      {tag} · фото скоро
    </span>
  );
}

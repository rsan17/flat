export function Feeling() {
  return (
    <section id="feeling" className="border-b-2 border-ink bg-bone">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-24 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="shadow-brut relative aspect-[4/5] overflow-hidden border-2 border-ink bg-paper">
            <span className="caps absolute bottom-3 left-3 bg-ink px-2 py-1 text-[10px] text-lilac">
              07 · MOOD · фото скоро
            </span>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 md:self-center">
          <p className="caps text-xs">003 — ВІДЧУТТЯ</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-7xl">
            FLAT5 — <br />
            <span className="inline-block bg-lilac px-3 py-1">НЕ ПРОСТО</span>
            <br />
            МІСЦЕ.
          </h2>
          <p className="mt-8 max-w-lg text-lg md:text-xl">
            це відчуття, в яке хочеться повертатись.
          </p>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export function Hero() {
  return (
    <section className="grain relative border-b-2 border-ink bg-paper">
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <p className="caps mb-6 text-xs">DROP 001 · UA · HANDMADE</p>
          <h1 className="font-display text-[13vw] leading-[0.82] md:text-[10vw] lg:text-[9.5rem]">
            ШАХИ
            <br />
            <span className="inline-block bg-lilac px-3 py-1">НЕ ЯК</span>{" "}
            У ВСІХ.
          </h1>
          <p className="mt-8 max-w-xl text-lg md:text-xl">
            Кастомні дошки ручної роботи. Масив дуба, горіха, бука. Маркування
            лазером. Обмежена серія — 12 штук на дроп.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/checkout?product=board-001&variant=pro"
              className="btn btn-lilac"
            >
              купити · 1 890 ₴
            </Link>
            <a href="#product" className="btn btn-outline">
              дивитись дошку
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-display text-3xl">12</div>
              <div className="caps text-[10px] opacity-70">штук на дроп</div>
            </div>
            <div>
              <div className="font-display text-3xl">2 тиж</div>
              <div className="caps text-[10px] opacity-70">виготовлення</div>
            </div>
            <div>
              <div className="font-display text-3xl">UA</div>
              <div className="caps text-[10px] opacity-70">львів · київ</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="shadow-brut relative aspect-[4/5] border-2 border-ink bg-lilac">
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
            <div className="caps absolute bottom-3 left-3 bg-paper px-2 py-1 text-[10px]">
              фото скоро
            </div>
            <div className="caps absolute right-3 top-3 bg-ink px-2 py-1 text-[10px] text-lilac">
              001/012
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

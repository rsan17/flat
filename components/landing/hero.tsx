import Image from "next/image";
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
            Кастомні дошки ручної роботи, створені за допомогою 3D-друку нового
            покоління. Продумана вага кожної фігури, магнітна фіксація та
            компактність — для ідеального відчуття гри.
            <span className="mt-3 block text-sm opacity-80 md:text-base">
              Обмежена серія — лише 55 штук на дроп.
            </span>
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/checkout?product=board-001&variant=standard"
              className="btn btn-lilac"
            >
              купити · 799 ₴
            </Link>
            <a href="#product" className="btn btn-outline">
              дивитись дошку
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-display text-3xl">55</div>
              <div className="caps text-[10px] opacity-70">штук на дроп</div>
            </div>
            <div>
              <div className="font-display text-3xl">5–7 днів</div>
              <div className="caps text-[10px] opacity-70">виготовлення</div>
            </div>
            <div>
              <div className="font-display text-3xl">UA</div>
              <div className="caps text-[10px] opacity-70">львів · київ</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="shadow-brut relative aspect-[5/4] overflow-hidden border-2 border-ink bg-ink">
            <Image
              src="/hero-board.png"
              alt="THE BOARD — 3D-друкована шахова дошка F5 CHESS CLUB, вид збоку"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="caps absolute right-3 top-3 bg-ink px-2 py-1 text-[10px] text-lilac">
              001/055
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

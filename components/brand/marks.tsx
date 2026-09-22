import Image from "next/image";

/**
 * Бренд-елементи з брендбуку — реальна векторна графіка дизайнера,
 * витягнута з FLAT5.pdf у /public/brand.
 *
 * Правило використання: не більше одного елемента на екран.
 * Це акценти, а не патерн — вони працюють, поки їх помічаєш не одразу.
 */

/** Гірлянда з дворика. Тонкий роздільник між секціями. */
export function Garland({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex items-center justify-center px-6 ${className}`}
    >
      <Image
        src="/brand/garland.svg"
        alt=""
        width={837}
        height={210}
        unoptimized
        className={`h-auto w-full max-w-[900px] ${flip ? "-scale-x-100" : ""}`}
      />
    </div>
  );
}

/** Лодонька «дай п'ять та ще одну каву». */
export function Hand({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/hand.svg"
      alt="Лодонька FLAT5: дай п'ять та ще одну каву"
      width={324}
      height={424}
      unoptimized
      className={className}
    />
  );
}

/** Диван з кавою — «простір, куди приходять як додому». */
export function Sofa({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/sofa.svg"
      alt=""
      aria-hidden
      width={494}
      height={460}
      unoptimized
      className={className}
    />
  );
}

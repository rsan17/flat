import Image from "next/image";

/**
 * Бренд-елементи з брендбуку — реальна векторна графіка дизайнера,
 * витягнута з FLAT5.pdf у /public/brand.
 *
 * Правило використання: не більше одного елемента на екран.
 * Це акценти, а не патерн — вони працюють, поки їх помічаєш не одразу.
 *
 * Гірлянда (`/public/brand/garland.svg`) лежить готова, але свідомо не
 * використовується: як роздільник між секціями вона виглядала чужорідно.
 */

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

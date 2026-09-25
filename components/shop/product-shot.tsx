import Image from "next/image";
import type { ProductMedia } from "@/lib/products";

const BG: Record<NonNullable<ProductMedia["bg"]>, string> = {
  beam: "bg-paper",
  lilac: "bg-lilac",
  ink: "bg-ink",
  cream: "bg-cream",
};

/**
 * Один кадр товару. Для позицій без фото — фірмова заглушка,
 * щоб каталог не розсипався до появи зйомки.
 */
export function ProductShot({
  media,
  sizes,
  priority,
  className = "",
}: {
  media?: ProductMedia;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!media) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-lilac ${className}`}
      >
        <span
          className="font-display select-none text-[22vw] leading-none text-paper md:text-[8rem]"
          aria-hidden
        >
          F5
        </span>
        <span className="caps absolute bottom-3 left-3 bg-ink px-2 py-1 text-[10px] text-paper">
          фото скоро
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${BG[media.bg ?? "cream"]} ${className}`}
    >
      {media.video ? (
        <video
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          aria-label={media.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      )}
    </div>
  );
}

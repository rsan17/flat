import { TrackedLink } from "@/components/analytics/tracked-link";

export function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <div className="font-display text-3xl">F5·BOARD</div>
          <p className="mt-1 text-xs opacity-70">
            © {new Date().getFullYear()} · ФОП · Львів, Україна
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs caps">
          <TrackedLink
            event="outbound_click"
            target="instagram_flat5"
            external
            href="https://www.instagram.com/flat5.lviv?igsh=MXY5cGc1cXB5aHZkeg=="
            className="hover:underline"
          >
            instagram
          </TrackedLink>
          <TrackedLink
            event="outbound_click"
            target="telegram_f5chess"
            external
            href="https://t.me/f5chess"
            className="hover:underline"
          >
            telegram
          </TrackedLink>
          <TrackedLink
            event="outbound_click"
            target="instagram_17dots"
            external
            href="https://www.instagram.com/17dots.agency?igsh=MWtyd2o1eDVnMzdwaw%3D%3D&utm_source=qr"
            className="hover:underline"
          >
            Created with love by 17
          </TrackedLink>
        </div>
      </div>
    </footer>
  );
}

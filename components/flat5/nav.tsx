import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <Link href="/" className="font-display text-2xl tracking-tightest">
          FLAT5
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#place" className="caps text-xs hover:underline">
            місце
          </a>
          <a href="#how-to-find" className="caps text-xs hover:underline">
            як знайти
          </a>
          <a href="#feeling" className="caps text-xs hover:underline">
            відчуття
          </a>
        </nav>
        <Link href="/team-onboarding" className="btn btn-lilac text-xs">
          the·board
        </Link>
      </div>
    </header>
  );
}

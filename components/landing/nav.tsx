import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-display text-2xl tracking-tightest"
          >
            F5·BOARD
          </Link>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#about" className="caps text-xs hover:underline">
            про дроп
          </a>
          <a href="#product" className="caps text-xs hover:underline">
            дошка
          </a>
          <a href="#faq" className="caps text-xs hover:underline">
            faq
          </a>
          <a href="#club" className="caps text-xs hover:underline">
            клуб
          </a>
        </nav>
        <Link
          href="/checkout?product=board-001&variant=standard"
          className="btn btn-lilac text-xs"
        >
          купити
        </Link>
      </div>
    </header>
  );
}

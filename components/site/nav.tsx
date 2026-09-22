"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/shop", label: "магазин" },
  { href: "/flat5", label: "заклад" },
  { href: "/#club", label: "клуб" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="font-display shrink-0 text-3xl"
          onClick={() => setOpen(false)}
        >
          FLAT5
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="caps text-xs hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/shop" className="btn btn-lilac btn-sm hidden sm:inline-flex">
            купити
          </Link>
          <button
            type="button"
            className="border-2 border-ink px-3 py-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="caps text-xs">{open ? "×" : "меню"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t-2 border-ink bg-paper px-6 py-4 md:hidden"
        >
          <ul className="grid gap-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="caps block py-1 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                className="btn btn-lilac mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                купити
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

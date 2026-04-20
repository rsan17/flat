export function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div>
          <div className="font-display text-3xl">FLAT5</div>
          <p className="mt-1 text-xs opacity-70">
            © {new Date().getFullYear()} · площа ринок, 39 · львів
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs caps">
          <a href="mailto:hello@flat5.local" className="hover:underline">
            hello@flat5.local
          </a>
          <a href="https://instagram.com" className="hover:underline">
            instagram
          </a>
          <a href="https://t.me" className="hover:underline">
            telegram
          </a>
        </div>
      </div>
    </footer>
  );
}

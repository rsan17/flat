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
          <a
            href="https://www.instagram.com/flat5.lviv?igsh=MXY5cGc1cXB5aHZkeg=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            instagram
          </a>
          <a href="https://t.me/f5chess" className="hover:underline">
            telegram
          </a>
          <a
            href="https://www.instagram.com/17dots.agency?igsh=MWtyd2o1eDVnMzdwaw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Created with love by 17
          </a>
        </div>
      </div>
    </footer>
  );
}

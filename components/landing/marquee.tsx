export function Marquee({
  items = ["HANDMADE", "LIMITED", "UKRAINE", "THE·BOARD", "CHESS", "DROP·001"],
  variant = "ink",
}: {
  items?: string[];
  variant?: "ink" | "lilac";
}) {
  const bg = variant === "ink" ? "bg-ink text-lilac" : "bg-lilac text-ink";
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`overflow-hidden border-y-2 border-ink py-3 ${bg}`}>
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="font-display text-4xl md:text-5xl tracking-tightest"
          >
            {t}
            <span className="mx-8 inline-block align-middle text-2xl opacity-80">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

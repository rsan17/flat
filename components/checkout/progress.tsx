export function CheckoutProgress({ step = 2 }: { step?: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Кошик" },
    { n: 2, label: "Доставка" },
    { n: 3, label: "Оплата" },
  ];
  return (
    <ol className="mx-auto flex max-w-[1400px] items-center gap-3 px-6 py-4">
      {steps.map((s, i) => {
        const active = s.n === step;
        const done = s.n < step;
        return (
          <li
            key={s.n}
            className="flex flex-1 items-center gap-3"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center border-2 border-ink font-display text-lg ${
                active ? "bg-lilac" : done ? "bg-ink text-lilac" : "bg-paper"
              }`}
            >
              {s.n}
            </span>
            <span
              className={`caps text-xs ${active ? "text-ink" : "text-ink/60"}`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span
                className={`ml-1 h-0.5 flex-1 ${done ? "bg-ink" : "bg-ink/20"}`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

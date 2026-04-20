import Link from "next/link";

export function CTA() {
  return (
    <section
      id="faq"
      className="grain relative border-b-2 border-ink bg-ink text-paper"
    >
      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="caps text-xs text-lilac">003 — FAQ</p>
            <h2 className="font-display mt-4 text-6xl leading-[0.9] md:text-8xl">
              ЗАМОВ ДО <span className="text-lilac">ДРОП·002</span>.
              <br />
              ВІДПРАВКА — 2 ТИЖНІ.
            </h2>
          </div>
          <dl className="space-y-8 text-base md:col-span-5 md:col-start-8">
            <FAQItem
              q="Як швидко я отримаю дошку?"
              a="Виготовлення — до 14 днів. Потім відправка Новою поштою на відділення або поштомат."
            />
            <FAQItem
              q="Чи можна повернути?"
              a="Так, протягом 14 днів, якщо дошка не була у використанні. Кастомне гравіювання — без повернення."
            />
            <FAQItem
              q="Як я плачу?"
              a="Онлайн через monobank-еквайринг. Apple Pay, Google Pay, картка."
            />
            <FAQItem
              q="Фігури окремо?"
              a="Поки що тільки в комплекті. Окремий дроп фігур — восени."
            />
          </dl>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t-2 border-lilac pt-10">
          <div className="font-display text-4xl md:text-6xl">
            ГОТОВІ РОБИТИ ХІД?
          </div>
          <Link href="/checkout?product=board-001&variant=pro" className="btn btn-lilac">
            замовити · дроп 001
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-lilac/40 pb-6">
      <dt className="caps text-xs text-lilac">{q}</dt>
      <dd className="mt-2 text-paper/90">{a}</dd>
    </div>
  );
}

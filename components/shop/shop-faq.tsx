import { PLACE } from "@/lib/place";

const ITEMS = [
  {
    q: "Як швидко я отримаю замовлення?",
    a: "Дошку виготовляємо 5–7 днів. Далі — самовивіз із FLAT5 або доставка Новою поштою: відділення чи поштомат.",
  },
  {
    q: "Чи можна забрати самому?",
    a: `Так. Самовивіз із ${PLACE.address} — ${PLACE.hoursLabel}, ${PLACE.hours}. Вивіски немає: ${PLACE.doorHint}.`,
  },
  {
    q: "Чи можна повернути?",
    a: "Так, протягом 14 днів, якщо річ не була у використанні. Дошки з кастомним гравіюванням поверненню не підлягають.",
  },
  {
    q: "Як я плачу?",
    a: "Онлайн через monobank-еквайринг: Apple Pay, Google Pay або картка.",
  },
];

export function ShopFaq() {
  return (
    <section
      id="faq"
      className="grain relative border-b-2 border-ink bg-ink text-paper"
    >
      <div className="relative z-[2] mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="caps text-xs text-lilac">FAQ</p>
          <h2 className="font-display mt-4 text-5xl leading-[0.9] md:text-7xl">
            ДОСТАВКА
            <br />
            <span className="text-lilac">І ОПЛАТА.</span>
          </h2>
        </div>

        <dl className="space-y-8 text-base md:col-span-6 md:col-start-7">
          {ITEMS.map((item) => (
            <div key={item.q} className="border-b border-lilac/40 pb-6">
              <dt className="caps text-xs text-lilac">{item.q}</dt>
              <dd className="mt-2 text-paper/90">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

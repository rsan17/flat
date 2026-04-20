import Link from "next/link";

export const metadata = {
  title: "Умови сервісу — F5 BOARD",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[820px] px-6 py-20">
      <Link href="/" className="caps text-xs opacity-70 hover:opacity-100">
        ← на головну
      </Link>
      <h1 className="font-display mt-8 text-6xl">УМОВИ СЕРВІСУ</h1>
      <div className="prose-custom mt-10 space-y-6 text-base leading-relaxed">
        <section>
          <h2 className="caps text-sm opacity-70">1 · продавець</h2>
          <p>
            ФОП [ПІБ], ЄДРПОУ [номер]. Адреса: Львів, вул. Шевченка 1.
            Email: [контакт]. Telegram: [@handle].
          </p>
        </section>
        <section>
          <h2 className="caps text-sm opacity-70">2 · замовлення</h2>
          <p>
            Оформлення замовлення на сайті = згода з цими умовами. Після
            оплати ми готуємо виріб протягом 14 робочих днів.
          </p>
        </section>
        <section>
          <h2 className="caps text-sm opacity-70">3 · доставка</h2>
          <p>
            Відправка Новою поштою (відділення або поштомат) або
            самовивіз зі Львова. Вартість доставки сплачує покупець при
            отриманні.
          </p>
        </section>
        <section>
          <h2 className="caps text-sm opacity-70">4 · повернення</h2>
          <p>
            Повернення можливе протягом 14 днів з моменту отримання, якщо
            виріб не був у використанні та зберіг товарний вигляд. Кастомне
            гравіювання поверненню не підлягає.
          </p>
        </section>
        <section>
          <h2 className="caps text-sm opacity-70">5 · персональні дані</h2>
          <p>
            Ми обробляємо ваші ПІБ, телефон, email і адресу доставки
            виключно для виконання замовлення. Не передаємо третім особам,
            окрім служби доставки.
          </p>
        </section>
        <p className="caps text-xs opacity-50">
          [чернетка — замінити на юридично вивірений текст]
        </p>
      </div>
    </main>
  );
}

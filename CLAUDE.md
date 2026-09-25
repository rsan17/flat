# F5 BOARD — робочий контекст для Claude Code

Цей файл для себе: фіксуємо конвенції проекту, відомі проблеми та бек-лог. Не плутати з README (той — для публіки).

## Стек (скорочено)

- Next.js 15 App Router · TypeScript · Tailwind v4 через `@theme` в `app/globals.css`
- shadcn-стиль utility-компоненти в `components/*`, без radix поки
- RHF + Zod `discriminatedUnion` по `deliveryType` у чекауті
- Monobank Acquiring + Nova Poshta proxy + Supabase + Resend
- Деплой: Vercel (Next.js preset, `vercel.json` у репо), репо: https://github.com/rsan17/flat

## Дизайн-система (брендбук FLAT5)

- **Палітра:** `--color-lilac` `#CBB5DB` (LILAC ASH) · `--color-beam` `#FEF8D3`
  (MELLOW BEAM, **тільки дрібні акценти — не тло**) · `--color-paper` `#fff`
  (основне тло) · `--color-cream` `#F6F4F0` (чергування секцій) ·
  `--color-ink` `#16131A`.
- **Шрифти:** брендбук вимагає **Grind** (заголовки) + **Figma Hand** (рукописні
  акценти). Ліцензійних вебфонтів ще немає, тому тимчасово:
  `Roboto Condensed 900` (єдиний важкий вузький з кирилицею на Google Fonts) і
  `Caveat`. Коли будуть файли Grind — `@font-face` + один рядок у `--font-display`.
  ⚠️ Anton / Archivo Black / Bebas Neue **не мають кирилиці** — не пропонувати.
- **⚠️ Кастомні класи тільки в `@layer components` / `@layer base`.** Незашарені
  стилі в CSS-каскаді б'ють Tailwind-утиліти: `.btn` перебивав `hidden`, і
  кнопка не ховалась на мобільному.
- **Фірмові елементи:** гірлянда з прапорців, лодонька «дай п'ять і ще одну каву»,
  стікери F5 (5 і 3 см). Джерело — `FLAT5.pdf` від дизайнера.

## Структура сайту

```
/                 головна-вітрина: hero → по секції на кожен товар →
                  блок про заклад → chess club
/product/[slug]   PDP кожного товару (SSG) + FAQ доставки й оплати
/flat5            заклад: місце, як знайти, що всередині, відчуття
/checkout         чекаут (bound to ?product=&variant=)
/order/[id]       сторінка успіху
```

Окремої сторінки каталогу **немає навмисно**: товарів мало, головна і є
каталогом. Посилання «товари» ведуть на `/#<sku>` — якір секції на головній.

**На PDP немає блоку-опису.** Характеристики товару і умови отримання
(самовивіз / доставка / оплата) — одним списком під кнопкою. `product.description`
лишився в даних, але не рендериться.

**Головна нічого не продає.** Секції товарів (`ProductSection`) дають назву,
3 характеристики, ціну і перехід на PDP — без вибору розміру, гравіювання і
кнопки «замовити». Це навмисно: одна точка купівлі — PDP. Секції генеруються
з `PRODUCT_LIST`, тож новий товар зʼявляється на головній сам.

- `components/site/` — спільні `SiteNav` / `SiteFooter` для всіх сторінок.
- `components/shop/` — `ProductCard`, `ProductGrid`, `ProductShot`, `BuyBox`.
  `BuyBox` один і той самий на PDP і в блоці дошки на головній.
- `lib/place.ts` — єдине джерело фактів про заклад (адреса, години, меню).
  Факти звірені з flat5.choiceqr.com і @flat5.lviv; **описові тексти — чернетка**.

## Конвенції

- **i18n:** весь вміст українською. Без english-плейсхолдерів.
- **API-ключі:** зовнішні API (Mono, NP, Resend) — тільки через route handlers у `app/api/**`. Жодних `NEXT_PUBLIC_` для секретів.
- **`lib/order-store.ts`:** in-memory fallback ТІЛЬКИ для локального dev. У serverless-проді (Vercel) `globalThis.__ORDERS__` не виживає між запитами — обов'язково Supabase.
- **`lib/products.ts`:** одне джерело цін і варіантів. SKU = slug у `/shop/[slug]`.
  `status: "available" | "soon" | "sold-out"` — усе, крім `available`, не
  потрапляє в чекаут (гард у `/checkout` і в `/api/order/create`).
  Гравіювання — опція конкретного товару (`product.engraving`), не глобальна.
- **Ціни:** все в копійках (int), формат для UI — `formatUAH(kopecks)` у `lib/utils.ts`.
  ⚠️ Не повертати туди `Intl` зі `style: "currency"`: Node ICU дає «799 ₴», а
  Chrome — «799 грн» → hydration mismatch і стрибок ціни після гідратації.
- **Доставка:** `warehouse` | `postomat` | `pickup` (самовивіз зі Львова, адреса в `PICKUP_ADDRESS`).
- **Order number формат:** `TB-001-XXXX` (дроп `001`, 4 цифри). ⚠️ Див. «Відомі проблеми».
- **Telegram / IG / email:** плейсхолдери. Замінити на реальні перед продом.
- **Бренд-елементи:** `/public/brand/*.svg` — це справжня векторна графіка
  дизайнера, витягнута з `FLAT5.pdf` (гірлянда, лодонька, диван).
  Правило з `components/brand/marks.tsx`: **не більше одного елемента на екран**.
  Зараз використовуються лише лодонька (футер) і диван (`/flat5`); гірлянда
  лежить у `/public/brand`, але як роздільник між секціями виглядала чужорідно.
- **Фото закладу:** `/public/img/place/*` (дворик, вхід, інтер'єр),
  `/public/img/club/*` (шахові столи), `/public/img/tee/*` (футболка).
  Оригінали — з телефону власників, сконвертовані в webp q82.
  ⚠️ Серед надісланих фото були чужа контактна картка з номером телефону і
  фото собаки вдома — не публікуємо, у репо їх немає.
- **Жодних підписів на фото.** Ярлики «01 · TOP», «04 · VIBE» прибрані:
  нумерувати кадри — зайвий шум. Лишається тільки «фото скоро» на заглушках.
- **Telegram-бот** (`lib/telegram.ts`): замовлення описується масивом
  `items[]`, хоча чекаут кладе туди рівно одну позицію. Коли зʼявиться кошик —
  міняється лише той, хто збирає масив. У повідомленні є артикул
  (`sku / variant`), щоб на складі не плутати розміри.

### 7. F5 Chess Club · одноразові Telegram-інвайти
Зараз `/api/club/join` віддає статичний інвайт із `F5_TG_INVITE_URL` (env)
або fallback-плейсхолдер. Апгрейд: викликати Telegram Bot API
`createChatInviteLink` з `member_limit: 1` і `expire_date ≈ 24h`.
Потрібні `F5_TG_BOT_TOKEN` + `F5_TG_CHAT_ID`, бот має бути адміном групи.

### 8. F5 Chess Club · Supabase
Замінити in-memory `lib/club-store.ts` на таблицю `club_members`
(`id uuid, full_name, phone unique, nickname, chess_handle, birthday date,
created_at`). Додати поле "день народження" у форму як опціональне.

### 9. F5 Chess Club · cashback
Після реєстрації — нараховувати 5% замість 2% для замовлень з тим же
phone. Звʼязок club_members ↔ orders по телефону.

## Поточний стан

- Dev: `npm run dev` → http://localhost:3000
- Без env — UI + in-memory замовлення
- Vercel prod задеплоєно, але **НЕ робочий без Supabase** (див. нижче)

---

## 🚨 Відомі проблеми (виявлено під час code review)

Згруповано за тяжкістю. Фіксити згори вниз.

### Critical — блокують прод

**C1. Mono webhook без верифікації підпису**
`app/api/mono/webhook/route.ts:13` — TODO коментар, ніякої перевірки `X-Sign`. Атакувальник може POST-нути `{invoiceId, status: "success"}` і тригернути email "оплачено" + apm update. Потрібна перевірка через `/api/merchant/pubkey` + ECDSA verify.

**C2. In-memory store ≠ serverless**
`lib/order-store.ts` — `globalThis.__ORDERS__` не виживає між Vercel function invocations. Без Supabase: замовлення створюється → клієнт летить на `/order/[id]` → 404. На Vercel прод **непрацюючий без Supabase env-вар**.

**C3. Supabase insert failure → `ok: true`**
`app/api/order/create/route.ts:95-108` — при помилці insert (duplicate key, network) лог у консоль, але клієнту повертаємо `ok: true`. Клієнт оплачує, webhook не знаходить order для update → статус висить `pending` назавжди.

### High

**H1. Order number колізії**
`lib/utils.ts:17-19` — `Math.random() * 9000` → 9000 можливих значень. DB має `unique`, але через C3 помилка ковтається. Fix: suffix з `Date.now() % 10000` або nanoid.

**H2. Phone input баг при paste**
`components/checkout/checkout-form.tsx:50-55` — якщо вставити `050 123 45 67` (без `+380`), логіка `"380" + v.replace(/^380/, "")` при slice до 12 символів обрізає останню цифру. Fix: нормалізувати до 9 останніх digits після `380`.

**H3. NP endpoints HTTP 200 на помилку**
`app/api/nova-poshta/cities/route.ts:17-20`, `warehouses/route.ts:22-28` — повертають 200 з `error` полем. Клієнт не бачить різниці між "нема результатів" і "API лежить". Fix: 502 на fail.

### Medium

**M1. Email from `orders@theboard.local` — невалідний**
`lib/email.ts:29,57` — `.local` не TLD, Resend відхилить. Потрібен верифікований домен (theboard.com.ua / .store).

**M2. Warehouse input без debounce**
`components/checkout/nova-poshta-picker.tsx:98-111` — місто має 300мс debounce, відділення — ні. Кожен keystroke → HTTP. Fix: обернути `warehouseQuery` у debounced state.

**M3. RLS не увімкнено на `orders`**
`supabase/migrations/0001_orders.sql` — працює через service_role, ок. Але defence-in-depth: `alter table orders enable row level security;` + deny-all policy, щоб anon key точно нічого не бачив.

**M4. Success-сторінка = публічна по UUID**
`app/order/[id]/page.tsx` — UUID v4 неможливо вгадати, але URL містить PII (phone, email, адреса). Якщо лінк витече (share, копія) — витік. Fix: signed cookie або короткий токен у URL.

**M5. Немає security headers**
`next.config.ts` порожній. Додати CSP, X-Frame-Options, Referrer-Policy через `headers()` конфіг.

### Low

**L1. `lucide-react@1.8.0` — dead dep**
`package.json:19` — встановлено, ніде не імпортується. Версія `1.8.0` реальна, але з 2021 року. Видалити або апгрейднути до `^0.400.0`.

**L2. `href="#"` на "умови сервісу"**
`components/checkout/checkout-form.tsx:228` — замінити на реальну сторінку `/terms`.

---

## Бек-лог — наступні ітерації

### 1. Лендинг · блок CTA → секція про Chess Club
`components/landing/cta.tsx` зараз = FAQ + дубль кнопки "купити". Замінити на секцію про шаховий клуб Ані (F5 BOARD Chess Club):

- інфо про клуб (коли збираються, де, для кого)
- як долучитись (форма або Telegram)
- чому власники дошки → члени клубу отримують бонуси
- прибрати повторну ціну і кнопку "купити"

Кнопка "купити" залишається тільки в hero і блоці product.

### 2. Admin v2
- Список замовлень із фільтрами (status, date range, search по order_number/phone)
- Ручне проставляння статусу `shipped` + введення ТТН
- Auth через Supabase (magic link на `ADMIN_EMAIL`)

### 3. Mono webhook signature (= C1)
Перевірка `X-Sign` через публічний ключ з `GET /api/merchant/pubkey`. ECDSA P-256 + SHA-256.

### 4. Email → React Email
Винести inline HTML з `lib/email.ts` у React Email компоненти. Зараз шаблони копіпастяться.

### 5. Inventory (12/12 хардкод)
Після Supabase — тягнути `stock_remaining` з БД, блокувати "купити" при 0. Декремент у транзакції при створенні `paid` ордера.

### 6. Club member discount
`clubMemberName` заповнено → `is_club_member=true` у записі. Пізніше — знижка за промокодом або перевіркою по whitelist.

### 7. Автоматичне створення ТТН
Після `shipped` у адмінці → виклик `InternetDocument.save` у NP API → зберігати `ttn` поле.

### 8. Мультитоварний каталог
`PRODUCTS` зараз Record у коді. Перенести в Supabase (products, variants, inventory).

### 9. i18n (EN)
`next-intl` або роутинг-based. UA залишається дефолтом.

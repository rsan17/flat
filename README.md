# F5 BOARD — кастомні шахові дошки

Лендинг + чекаут для ФОП-магазину: Monobank-еквайринг, доставка Новою поштою, самовивіз зі Львова, сповіщення про замовлення в Telegram.

## Стек

- **Next.js 15** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** (`@theme` у `app/globals.css`, без конфіг-файла)
- **React Hook Form + Zod** (`discriminatedUnion` по `deliveryType`)
- **Neon** (Postgres, таблиця `orders`, `DATABASE_URL` server-only)
- **Monobank Acquiring API** (`/merchant/invoice/create` + webhook)
- **Nova Poshta API** (пошук міст і відділень через server-side proxy)
- **Telegram Bot API** (сповіщення про нове замовлення й про оплату)

## Локальний запуск

```bash
npm install
cp .env.example .env.local   # або залиш порожнім — dev-режим без зовнішніх API
npm run dev
```

Відкрий http://localhost:3000.

## Режими роботи

| Env         | Поведінка                                                                             |
| ----------- | ------------------------------------------------------------------------------------- |
| порожні     | UI працює. Замовлення — в in-memory Map (тільки dev, `globalThis.__ORDERS__`).        |
| `MONO_*`    | Створюється реальний інвойс, клієнта редиректить на `pageUrl` Mono для оплати.        |
| `DATABASE_URL` | Замовлення пишуться в таблицю `orders`. В проді — обов'язково.                     |
| `TELEGRAM_*`| Сповіщення про нове замовлення і про зміну статусу оплати.                            |
| `NP_*`      | Реальний пошук міст/відділень. Без ключа ендпоінти повертають порожні списки.         |

⚠️ **In-memory store несумісний із serverless (Vercel).** Без `DATABASE_URL` замовлення не виживе між запитами — success-сторінка поверне 404. Для продакшена Neon обов'язковий.

## Структура

```
app/
  page.tsx                    лендинг (hero → about → product → CTA/FAQ → footer)
  checkout/page.tsx           чекаут (bound to ?product=&variant=)
  order/[id]/page.tsx         сторінка успіху (server-rendered, читає Supabase/local)
  api/
    nova-poshta/cities/       GET ?q= → пошук міст
    nova-poshta/warehouses/   GET ?cityRef=&type=warehouse|postomat
    mono/create-invoice/      (опційно, нині інвойс створюється в order/create)
    mono/webhook/             POST від Mono після оплати → update status + email
    order/create/             POST чекаут → створює інвойс + record
components/
  landing/    hero, about, product, cta, marquee, nav, footer
  checkout/   checkout-form, nova-poshta-picker, order-summary, progress
lib/
  products       одне джерело правди: SKU, варіанти, ціни в копійках
  validators     zod-схема, phone regex, PICKUP_ADDRESS
  nova-poshta    API обгортка (searchCities, getWarehouses)
  mono           createMonoInvoice + verifyMonoSignature (ECDSA P-256)
  telegram       сповіщення про замовлення й оплату
  db             Neon: insertOrder, getOrderById, updateOrderByInvoice
  order-store    in-memory Map для dev
  utils          cn, formatUAH, generateOrderNumber
supabase/migrations/
  0001_orders.sql             таблиця orders + індекси
```

## Деплой на Vercel

1. **Імпортуй репо** у Vercel → Next.js preset автоматично підхопиться (`vercel.json` уже в репо).
2. **Заповни Environment Variables** (Production + Preview):
   ```
   MONO_API_TOKEN            X-Token з https://web.monobank.ua/api
   NOVA_POSHTA_API_KEY       з developers.novaposhta.ua
   DATABASE_URL              з Neon (інтеграція Vercel ставить автоматично)
   TELEGRAM_BOT_TOKEN        токен бота
   TELEGRAM_CHAT_ID          куди слати сповіщення (можна кілька через кому)
   NEXT_PUBLIC_SITE_URL      https://<your-domain>  ← без нього webHookUrl
                             збирається з хоста запиту
   ```
3. **Застосуй SQL міграцію** у Supabase → SQL editor:
   ```sql
   -- copy-paste supabase/migrations/0001_orders.sql
   ```
4. **Deploy.** Після першої оплати перевір, що webhook від Mono прилетів у logs.

## Mono webhook

Endpoint: `POST /api/mono/webhook`. Mono шле його автоматично після зміни статусу інвойсу. URL береться з `NEXT_PUBLIC_SITE_URL` під час створення інвойсу в `order/create/route.ts:56`.

**Локальна розробка з реальним Mono:**
```bash
ngrok http 3000
# скопіюй https-URL у NEXT_PUBLIC_SITE_URL=.env.local
npm run dev
```

⚠️ **Підпис webhook не перевіряється** (див. [Відомі проблеми](#відомі-проблеми)). Перед продом — обов'язково додати.

## Відомі проблеми (tech debt)

- **Листів немає взагалі** — клієнт після оплати бачить тільки сторінку замовлення. Сповіщення йдуть у Telegram.
- **Order number `TB-001-XXXX` — 9000 варіантів** → ризик колізій при зростанні обсягу.
- **Nova Poshta proxy повертає HTTP 200 на помилки** → клієнт не бачить різниці між "нема даних" і "API лежить".

Повний список — у `CLAUDE.md`.

## Що далі (roadmap)

- Admin v2 (список замовлень, ручний shipped + ТТН)
- Автоматичне створення ТТН через НП
- Chess Club — секція на лендингу замість дублю CTA
- Мультитоварний каталог (`PRODUCTS` → Supabase)
- i18n (EN версія)
- React Email замість inline HTML

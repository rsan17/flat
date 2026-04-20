# THE BOARD — кастомні шахові дашки

Лендинг + чекаут для ФОП-магазину з Моно-еквайрингом і доставкою Новою поштою.

## Стек

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4 (`@theme` у `app/globals.css`)
- React Hook Form + Zod
- Supabase (Postgres)
- Monobank Acquiring API
- Nova Poshta API
- Resend для email

## Локальний запуск

```bash
npm install
cp .env.example .env.local   # або залиш пустими — буде dev-режим з in-memory store
npm run dev
```

Відкрий http://localhost:3000.

## Режими

- **Без `.env.local`** — працює все UI (лендинг + чекаут). Замовлення зберігаються в пам'яті процесу.
- **З `MONO_API_TOKEN`** — створюється реальний інвойс, редірект на `pageUrl`.
- **З Supabase** — замовлення пишуться в таблицю `orders` замість in-memory.

## Структура

```
app/
  page.tsx              лендинг
  checkout/page.tsx     чекаут
  order/[id]/page.tsx   успіх
  api/
    nova-poshta/{cities,warehouses}/route.ts
    mono/{create-invoice,webhook}/route.ts
    order/create/route.ts
components/
  landing/    hero, about, product, cta, marquee, nav, footer
  checkout/   checkout-form, nova-poshta-picker, order-summary, progress
lib/
  products, validators, nova-poshta, mono, email, supabase, order-store, utils
supabase/migrations/
  0001_orders.sql
```

## SQL міграція

`supabase/migrations/0001_orders.sql` — застосуй у Supabase Dashboard → SQL editor.

## Mono webhook

Вебхук летить на `POST /api/mono/webhook`. Для локалки — `ngrok http 3000` і
`NEXT_PUBLIC_SITE_URL=https://<ngrok>.ngrok.io` у `.env.local`.

TODO: перевірка підпису `X-Sign` через публічний ключ Mono (`/api/merchant/pubkey`).

## Що далі

- Адмінка (v2)
- Автоматичне створення ТТН через НП
- Мультитоварний каталог
- i18n

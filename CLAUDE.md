# THE BOARD — робочий контекст для Claude Code

Цей файл для себе: фіксуємо короткі конвенції та бек-лог фіч, які
домовились зробити пізніше. Не плутати з README (той — для людей).

## Стек (лок)

- Next.js 15 App Router · TypeScript · Tailwind v4 через `@theme`
- shadcn-стиль utility-компоненти в `components/*`, не залежимо на radix поки
- RHF + Zod у чекауті
- Monobank Acquiring + Nova Poshta proxy + Supabase + Resend

## Конвенції

- Весь i18n — українською. Вміст без english-плейсхолдерів.
- Усі зовнішні API (Mono, NP) — тільки через route handlers у `app/api/**`.
  Ключі не потрапляють на клієнт.
- `lib/order-store.ts` — in-memory fallback для dev, коли Supabase не
  підключений. У проді завжди пишемо у Supabase.
- `lib/products.ts` — одне джерело цін і варіантів. Не дублювати в UI.
- Доставка: `warehouse` | `postomat` | `pickup` (самовивіз зі Львова).
- Telegram / IG / email — плейсхолдери, замінити на справжні перед продом.

## Бек-лог — зробити в наступних ітераціях

### 1. Лендинг · блок CTA → секція про Chess Club
Зараз `components/landing/cta.tsx` — великий блок "готові робити хід?"
з повторною кнопкою "купити" і ціною. Замінити на секцію про шаховий
клуб Ані (THE BOARD Chess Club):
- інфо про клуб (коли збираються, де, для кого)
- як долучитись (форма або телега)
- чому власники дошки → члени клубу отримують бонуси
- прибрати повторну ціну й кнопку "купити"
Кнопка "купити" залишається тільки в hero і блоці product.

### 2. Admin v2
- Список замовлень із фільтрами
- Ручне проставляння статусу shipped + ТТН

### 3. Mono webhook signature
Перевіряти `X-Sign` через публічний ключ Mono (`/api/merchant/pubkey`).
Зараз вебхук приймає будь-який POST — критично для продакшена.

### 4. Email templates
Винести HTML з `lib/email.ts` у React Email компоненти.
Показати у customer + admin email інфо про гравіювання (`engraving`,
`club_member_name`, `engraving_fee`) якщо активовано.

### 5. Inventory
12/12 зараз хардкод. Після підключення Supabase — тягнути лишок з БД і
блокувати "купити" коли 0.

### 6. Club member discount
Якщо у чекауті заповнено `clubMemberName`, позначати `is_club_member=true`
в записі замовлення. Пізніше — знижка за промокодом/перевіркою.

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

- Локальний dev: `npm run dev` → http://localhost:3000
- Без env вар працює все UI + in-memory замовлення.
- Формат order number: `TB-001-XXXX`.
- Telegram-канал, клубні матеріали, реальні фото — TODO.

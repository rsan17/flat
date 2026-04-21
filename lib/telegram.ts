import { formatUAH } from "@/lib/utils";

type OrderNotificationData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryType: "warehouse" | "postomat" | "pickup";
  city: string;
  warehouse: string;
  productTitle: string;
  variantName: string;
  quantity: number;
  totalKopecks: number;
  engraving: boolean;
  engravingFee: number;
  clubMemberName?: string | null;
  comment?: string | null;
};

const DELIVERY_LABEL: Record<OrderNotificationData["deliveryType"], string> = {
  warehouse: "Відділення Нової Пошти",
  postomat: "Поштомат Нової Пошти",
  pickup: "Самовивіз (Львів)",
};

function escape(text: string): string {
  return text.replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"
  );
}

async function dispatchTelegram(
  text: string,
  chatIdsEnv: string | undefined,
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatIdsEnv) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN/CHAT_ID не налаштовані" };
  }
  const chatIds = chatIdsEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (chatIds.length === 0) {
    return { ok: false, error: "CHAT_ID порожній" };
  }

  const errors: string[] = [];
  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          },
        );
        if (!res.ok) {
          const body = await res.text();
          errors.push(`chat ${chatId}: ${res.status} ${body}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown";
        errors.push(`chat ${chatId}: ${message}`);
      }
    }),
  );
  if (errors.length === chatIds.length) {
    return { ok: false, error: errors.join("; ") };
  }
  if (errors.length > 0) {
    return { ok: true, error: `partial: ${errors.join("; ")}` };
  }
  return { ok: true };
}

type ClubJoinNotificationData = {
  fullName: string;
  phone: string;
  nickname: string;
  chessHandle?: string | null;
  alreadyMember: boolean;
};

export async function sendClubJoinTelegramNotification(
  data: ClubJoinNotificationData,
): Promise<{ ok: boolean; error?: string }> {
  const lines: string[] = [];
  lines.push(
    data.alreadyMember
      ? `♻️ <b>Повторна реєстрація в F5 Chess Club</b>`
      : `♟️ <b>Нова реєстрація в F5 Chess Club</b>`,
  );
  lines.push("");
  lines.push(`<b>Ім'я:</b> ${escape(data.fullName)}`);
  lines.push(`<b>Нікнейм:</b> ${escape(data.nickname)}`);
  lines.push(`<b>Телефон:</b> ${escape(data.phone)}`);
  if (data.chessHandle) {
    lines.push(`<b>chess.com / lichess:</b> ${escape(data.chessHandle)}`);
  }
  return dispatchTelegram(lines.join("\n"), process.env.TELEGRAM_CLUB_CHAT_ID);
}

export async function sendOrderTelegramNotification(
  data: OrderNotificationData,
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsRaw = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatIdsRaw) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN/CHAT_ID не налаштовані" };
  }
  const chatIds = chatIdsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (chatIds.length === 0) {
    return { ok: false, error: "TELEGRAM_CHAT_ID порожній" };
  }

  const lines: string[] = [];
  lines.push(`🛒 <b>Нове замовлення ${escape(data.orderNumber)}</b>`);
  lines.push("");
  lines.push(`<b>Клієнт:</b> ${escape(data.firstName)} ${escape(data.lastName)}`);
  lines.push(`<b>Телефон:</b> ${escape(data.phone)}`);
  lines.push(`<b>Email:</b> ${escape(data.email)}`);
  lines.push("");
  lines.push(`<b>Товар:</b> ${escape(data.productTitle)} — ${escape(data.variantName)}`);
  lines.push(`<b>Кількість:</b> ${data.quantity}`);
  lines.push(`<b>Сума:</b> ${formatUAH(data.totalKopecks)}`);

  if (data.engraving) {
    lines.push("");
    lines.push(`✍️ <b>Гравіювання:</b> так (+${formatUAH(data.engravingFee)})`);
    if (data.clubMemberName) {
      lines.push(`<b>Нікнейм для гравіювання:</b> ${escape(data.clubMemberName)}`);
    }
  }

  lines.push("");
  lines.push(`<b>Доставка:</b> ${DELIVERY_LABEL[data.deliveryType]}`);
  if (data.deliveryType !== "pickup") {
    if (data.city) lines.push(`<b>Місто:</b> ${escape(data.city)}`);
    if (data.warehouse) lines.push(`<b>Відділення:</b> ${escape(data.warehouse)}`);
  }

  if (data.comment) {
    lines.push("");
    lines.push(`<b>Коментар:</b> ${escape(data.comment)}`);
  }

  const text = lines.join("\n");

  const errors: string[] = [];
  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML",
              disable_web_page_preview: true,
            }),
          },
        );
        if (!res.ok) {
          const body = await res.text();
          errors.push(`chat ${chatId}: ${res.status} ${body}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown";
        errors.push(`chat ${chatId}: ${message}`);
      }
    }),
  );
  if (errors.length === chatIds.length) {
    return { ok: false, error: errors.join("; ") };
  }
  if (errors.length > 0) {
    return { ok: true, error: `partial: ${errors.join("; ")}` };
  }
  return { ok: true };
}

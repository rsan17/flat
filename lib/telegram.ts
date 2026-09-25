import { formatUAH } from "@/lib/utils";

/**
 * Сповіщення в Telegram.
 *
 * Замовлення описується списком позицій, хоча чекаут поки кладе туди рівно
 * одну. Коли зʼявиться кошик — міняється тільки той, хто збирає масив,
 * а формат повідомлення вже готовий до кількох товарів.
 */

export type OrderItemNotification = {
  productSku: string;
  productTitle: string;
  variantSku: string;
  variantName: string;
  quantity: number;
  unitPriceKopecks: number;
  /** Нікнейм на гравіювання, якщо товар його підтримує і клієнт замовив */
  engravingText?: string | null;
  engravingFeeKopecks?: number;
};

type DeliveryType = "warehouse" | "postomat" | "pickup";

type OrderNotificationData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryType: DeliveryType;
  city: string;
  warehouse: string;
  items: OrderItemNotification[];
  totalKopecks: number;
  comment?: string | null;
  /** Посилання на сторінку замовлення в адмінці/на сайті */
  orderUrl?: string | null;
};

type PaymentStatusData = {
  orderNumber: string;
  status: "paid" | "cancelled";
  totalKopecks: number;
  firstName: string;
  lastName: string;
  phone: string;
  monoStatus?: string;
  /** Для «оплачено» — що саме пакувати */
  items?: OrderItemNotification[];
};

const DELIVERY_LABEL: Record<DeliveryType, string> = {
  warehouse: "Відділення Нової Пошти",
  postomat: "Поштомат Нової Пошти",
  pickup: "Самовивіз (Львів)",
};

function escape(text: string): string {
  return text.replace(/[&<>]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"
  );
}

/** Один рядок позиції: назва, артикул, кількість, ціна, гравіювання. */
function renderItem(item: OrderItemNotification, index: number, total: number): string[] {
  const lines: string[] = [];
  const prefix = total > 1 ? `${index + 1}. ` : "• ";
  // В одязі варіант зветься «FLAT5 TEE — M»: не повторюємо назву двічі.
  const variantLabel = item.variantName
    .startsWith(item.productTitle)
    ? item.variantName.slice(item.productTitle.length).replace(/^[\s—–-]+/, "")
    : item.variantName;
  lines.push(
    `${prefix}<b>${escape(item.productTitle)}</b>` +
      (variantLabel ? ` — ${escape(variantLabel)}` : "")
  );
  lines.push(
    `   <code>${escape(item.productSku)} / ${escape(item.variantSku)}</code> · ` +
      `${item.quantity} × ${formatUAH(item.unitPriceKopecks)}`
  );
  if (item.engravingText) {
    const fee = item.engravingFeeKopecks
      ? ` (+${formatUAH(item.engravingFeeKopecks)})`
      : "";
    lines.push(`   ✍️ гравіювання «${escape(item.engravingText)}»${fee}`);
  }
  return lines;
}

async function send(text: string): Promise<{ ok: boolean; error?: string }> {
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
          }
        );
        if (!res.ok) {
          const body = await res.text();
          errors.push(`chat ${chatId}: ${res.status} ${body}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown";
        errors.push(`chat ${chatId}: ${message}`);
      }
    })
  );

  if (errors.length === chatIds.length) {
    return { ok: false, error: errors.join("; ") };
  }
  if (errors.length > 0) {
    return { ok: true, error: `partial: ${errors.join("; ")}` };
  }
  return { ok: true };
}

export async function sendOrderTelegramNotification(
  data: OrderNotificationData
): Promise<{ ok: boolean; error?: string }> {
  const lines: string[] = [];
  lines.push(
    `⏳ <b>Нове замовлення ${escape(data.orderNumber)}</b> — очікує оплати`
  );
  lines.push("");
  lines.push(`👤 ${escape(data.firstName)} ${escape(data.lastName)}`);
  lines.push(`📞 ${escape(data.phone)}`);
  lines.push(`✉️ ${escape(data.email)}`);

  lines.push("");
  const count = data.items.reduce((sum, i) => sum + i.quantity, 0);
  lines.push(`🛒 <b>Замовлення</b> (позицій: ${data.items.length}, штук: ${count}):`);
  data.items.forEach((item, i) => {
    lines.push(...renderItem(item, i, data.items.length));
  });
  lines.push(`<b>Разом: ${formatUAH(data.totalKopecks)}</b>`);

  lines.push("");
  lines.push(`🚚 ${DELIVERY_LABEL[data.deliveryType]}`);
  if (data.deliveryType !== "pickup") {
    if (data.city) lines.push(`📍 ${escape(data.city)}`);
    if (data.warehouse) lines.push(`🏤 ${escape(data.warehouse)}`);
  }

  if (data.comment) {
    lines.push("");
    lines.push(`💬 ${escape(data.comment)}`);
  }
  if (data.orderUrl) {
    lines.push("");
    lines.push(`🔗 ${escape(data.orderUrl)}`);
  }

  return send(lines.join("\n"));
}

export async function sendPaymentStatusTelegramNotification(
  data: PaymentStatusData
): Promise<{ ok: boolean; error?: string }> {
  const icon = data.status === "paid" ? "✅" : "❌";
  const title =
    data.status === "paid" ? "Оплачено" : "Оплату скасовано / не пройшла";

  const lines: string[] = [];
  lines.push(`${icon} <b>${title}: ${escape(data.orderNumber)}</b>`);
  lines.push("");
  lines.push(`👤 ${escape(data.firstName)} ${escape(data.lastName)}`);
  lines.push(`📞 ${escape(data.phone)}`);
  lines.push(`💰 ${formatUAH(data.totalKopecks)}`);

  if (data.status === "paid" && data.items?.length) {
    lines.push("");
    lines.push("📦 <b>Пакувати:</b>");
    data.items.forEach((item, i) => {
      lines.push(...renderItem(item, i, data.items!.length));
    });
  }

  if (data.monoStatus && data.status === "cancelled") {
    lines.push(`<b>Mono статус:</b> ${escape(data.monoStatus)}`);
  }

  return send(lines.join("\n"));
}

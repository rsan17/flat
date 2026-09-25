import { NextResponse } from "next/server";
import { dbConfigured, updateOrderByInvoice } from "@/lib/db";
import { updateOrderByInvoiceLocal } from "@/lib/order-store";
import { sendPaymentStatusTelegramNotification } from "@/lib/telegram";
import { verifyMonoSignature } from "@/lib/mono";

export const runtime = "nodejs";

/**
 * Вебхук Mono.
 *
 * Тут навмисно багато логів: це єдине місце, де замовлення стає оплаченим,
 * а помилка не видно ніде — клієнт уже заплатив і пішов. Раніше вебхук
 * мовчки відповідав 200 навіть коли не знаходив замовлення в базі.
 */

type MonoWebhookBody = {
  invoiceId: string;
  status:
    | "created"
    | "processing"
    | "hold"
    | "success"
    | "failure"
    | "reversed"
    | "expired";
  reference?: string;
  amount?: number;
  ccy?: number;
  modifiedDate?: string;
};

const LOG = "[mono-webhook]";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sign");

  if (process.env.MONO_API_TOKEN) {
    if (!signature) {
      console.warn(`${LOG} відхилено: немає заголовка X-Sign`);
      return NextResponse.json(
        { ok: false, error: "Missing X-Sign" },
        { status: 401 },
      );
    }

    const check = await verifyMonoSignature(rawBody, signature);

    if (check.status === "unavailable") {
      // Не змогли дістати ключ Mono — це наша проблема, не підробка.
      // Віддаємо 503, щоб Mono повторив спробу, а не вважав вебхук доставленим.
      console.error(`${LOG} не вдалось перевірити підпис: ${check.reason}`);
      return NextResponse.json(
        { ok: false, error: "Signature check unavailable" },
        { status: 503 },
      );
    }
    if (check.status === "invalid") {
      console.warn(`${LOG} відхилено: підпис не збігається`);
      return NextResponse.json(
        { ok: false, error: "Invalid signature" },
        { status: 401 },
      );
    }
  }

  let body: MonoWebhookBody;
  try {
    body = JSON.parse(rawBody) as MonoWebhookBody;
  } catch {
    console.error(`${LOG} невалідний JSON у тілі`);
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }
  if (!body?.invoiceId) {
    console.error(`${LOG} у тілі немає invoiceId`);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const newStatus: "paid" | "cancelled" | "pending" =
    body.status === "success"
      ? "paid"
      : ["failure", "reversed", "expired"].includes(body.status)
        ? "cancelled"
        : "pending";

  console.info(
    `${LOG} отримано invoiceId=${body.invoiceId} mono=${body.status} -> ${newStatus}`,
  );

  const paidAt = body.status === "success" ? new Date().toISOString() : null;

  let updated:
    | {
        order_number: string;
        customer_first_name: string;
        customer_last_name: string;
        customer_phone: string;
        np_delivery_type: "warehouse" | "postomat" | "pickup";
        total_amount: number;
      }
    | null = null;

  if (dbConfigured()) {
    try {
      const row = await updateOrderByInvoice(body.invoiceId, {
        status: newStatus,
        paid_at: paidAt,
      });
      if (row) updated = row;
    } catch (err) {
      // Замовлення лишиться в pending, хоча гроші пройшли. Це треба бачити,
      // тому 500: Mono повторить спробу.
      console.error(`${LOG} помилка оновлення в Neon:`, err);
      return NextResponse.json(
        { ok: false, error: "DB update failed" },
        { status: 500 },
      );
    }
  } else {
    const local = updateOrderByInvoiceLocal(body.invoiceId, {
      status: newStatus,
      paid_at: paidAt,
    });
    if (local) updated = local;
  }

  if (!updated) {
    // Раніше тут був мовчазний 200: Mono вважав вебхук доставленим, а
    // замовлення так і лишалось неоплаченим. Тепер це видно в логах.
    console.error(
      `${LOG} замовлення за invoiceId=${body.invoiceId} не знайдено — статус не оновлено`,
    );
    return NextResponse.json(
      { ok: false, error: "Order not found" },
      { status: 404 },
    );
  }

  console.info(
    `${LOG} ${updated.order_number}: статус -> ${newStatus}`,
  );

  if (newStatus === "paid" || newStatus === "cancelled") {
    const tg = await sendPaymentStatusTelegramNotification({
      orderNumber: updated.order_number,
      status: newStatus,
      totalKopecks: updated.total_amount,
      firstName: updated.customer_first_name,
      lastName: updated.customer_last_name,
      phone: updated.customer_phone,
      monoStatus: body.status,
    });
    if (!tg.ok) {
      console.error(`${LOG} телеграм не надіслався:`, tg.error);
    }
  }

  return NextResponse.json({ ok: true });
}

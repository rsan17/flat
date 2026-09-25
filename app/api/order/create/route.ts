import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { checkoutSchema } from "@/lib/validators";
import { findVariant, isPurchasable } from "@/lib/products";
import { generateOrderNumber } from "@/lib/utils";
import { createMonoInvoice } from "@/lib/mono";
import { dbConfigured, insertOrder } from "@/lib/db";
import { saveOrderLocal, type OrderRecord } from "@/lib/order-store";
import { sendOrderTelegramNotification } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некоректний JSON" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Невалідні дані", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  if (data.engraving === true && (data.clubMemberName ?? "").trim().length < 2) {
    return NextResponse.json(
      {
        ok: false,
        error: "Для гравіювання потрібен нікнейм (мінімум 2 символи)",
      },
      { status: 400 },
    );
  }

  const found = findVariant(data.productSku, data.variantSku);
  if (!found) {
    return NextResponse.json(
      { ok: false, error: "Товар не знайдено" },
      { status: 400 },
    );
  }

  if (!isPurchasable(found.product) || found.variant.soldOut) {
    return NextResponse.json(
      { ok: false, error: "Товар зараз недоступний до замовлення" },
      { status: 400 },
    );
  }

  const engraving = data.engraving === true;

  if (engraving && !found.product.engraving) {
    return NextResponse.json(
      { ok: false, error: "Для цього товару гравіювання недоступне" },
      { status: 400 },
    );
  }
  // Гравіювання — тільки великими літерами. Нормалізуємо на випадок прямого API-виклику.
  const clubMemberNameRaw = data.clubMemberName?.trim() || "";
  const clubMemberName = clubMemberNameRaw
    ? engraving
      ? clubMemberNameRaw.toUpperCase()
      : clubMemberNameRaw
    : null;
  const engravingFee = engraving ? (found.product.engraving?.priceKopecks ?? 0) : 0;
  const total = found.variant.priceKopecks * data.quantity + engravingFee;
  const id = randomUUID();
  const orderNumber = generateOrderNumber();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  // Attempt to create Mono invoice (optional in dev)
  let invoiceId: string | null = null;
  let pageUrl: string | null = null;
  if (process.env.MONO_API_TOKEN) {
    try {
      const mono = await createMonoInvoice({
        amount: total,
        reference: orderNumber,
        destination: `Оплата замовлення ${orderNumber} — ${found.product.title}`,
        redirectUrl: `${siteUrl}/order/${id}`,
        webHookUrl: `${siteUrl}/api/mono/webhook`,
      });
      invoiceId = mono.invoiceId;
      pageUrl = mono.pageUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Mono error";
      return NextResponse.json(
        { ok: false, error: `Не вдалося створити платіж: ${message}` },
        { status: 502 },
      );
    }
  }

  const isPickup = data.deliveryType === "pickup";
  const record: OrderRecord = {
    id,
    order_number: orderNumber,
    status: "pending",
    customer_first_name: data.firstName,
    customer_last_name: data.lastName,
    customer_phone: data.phone,
    customer_email: data.email,
    np_city: isPickup ? "" : data.city ?? "",
    np_city_ref: isPickup ? "" : data.cityRef ?? "",
    np_warehouse: isPickup ? "" : data.warehouse ?? "",
    np_warehouse_ref: isPickup ? "" : data.warehouseRef ?? "",
    np_delivery_type: data.deliveryType,
    club_member_name: clubMemberName,
    engraving,
    engraving_fee: engravingFee,
    product_sku: data.productSku,
    product_variant: data.variantSku,
    quantity: data.quantity,
    total_amount: total,
    mono_invoice_id: invoiceId,
    comment: data.comment || null,
    created_at: new Date().toISOString(),
    paid_at: null,
  };

  if (dbConfigured()) {
    try {
      await insertOrder(record);
    } catch (err) {
      const message = err instanceof Error ? err.message : "DB error";
      console.error("Neon insert failed:", message);
      return NextResponse.json(
        { ok: false, error: "Не вдалося зберегти замовлення. Спробуйте ще раз." },
        { status: 500 },
      );
    }
  } else {
    saveOrderLocal(record);
  }

  const tg = await sendOrderTelegramNotification({
    orderNumber,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    email: data.email,
    deliveryType: data.deliveryType,
    city: isPickup ? "" : data.city ?? "",
    warehouse: isPickup ? "" : data.warehouse ?? "",
    // Поки одна позиція, але формат уже готовий до кошика.
    items: [
      {
        productSku: found.product.sku,
        productTitle: found.product.title,
        variantSku: found.variant.sku,
        variantName: found.variant.name,
        quantity: data.quantity,
        unitPriceKopecks: found.variant.priceKopecks,
        engravingText: engraving ? clubMemberName : null,
        engravingFeeKopecks: engravingFee,
      },
    ],
    totalKopecks: total,
    comment: data.comment || null,
    orderUrl: `${siteUrl}/order/${id}`,
  });
  if (!tg.ok) {
    console.error("Telegram notification failed:", tg.error);
  }

  return NextResponse.json({
    ok: true,
    orderId: id,
    orderNumber,
    pageUrl,
  });
}

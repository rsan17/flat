import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { checkoutSchema } from "@/lib/validators";
import { findVariant, ENGRAVING_FEE_KOPECKS } from "@/lib/products";
import { generateOrderNumber } from "@/lib/utils";
import { createMonoInvoice } from "@/lib/mono";
import { getDb, dbConfigured, describeDbError } from "@/lib/db";
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

  const engraving = data.engraving === true;
  const engravingFee = engraving ? ENGRAVING_FEE_KOPECKS : 0;
  const total = found.variant.priceKopecks * data.quantity + engravingFee;
  const id = randomUUID();
  const orderNumber = generateOrderNumber();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

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
    club_member_name: data.clubMemberName?.trim() || null,
    engraving,
    engraving_fee: engravingFee,
    product_sku: data.productSku,
    product_variant: data.variantSku,
    quantity: data.quantity,
    total_amount: total,
    mono_invoice_id: null,
    comment: data.comment || null,
    created_at: new Date().toISOString(),
    paid_at: null,
  };

  if (dbConfigured()) {
    try {
      const sql = getDb();
      await sql`
        INSERT INTO orders (
          id, order_number, status,
          customer_first_name, customer_last_name, customer_phone, customer_email,
          np_city, np_city_ref, np_warehouse, np_warehouse_ref, np_delivery_type,
          club_member_name, engraving, engraving_fee,
          product_sku, product_variant, quantity, total_amount,
          mono_invoice_id, comment, created_at, paid_at
        ) VALUES (
          ${record.id}, ${record.order_number}, ${record.status},
          ${record.customer_first_name}, ${record.customer_last_name},
          ${record.customer_phone}, ${record.customer_email},
          ${record.np_city}, ${record.np_city_ref}, ${record.np_warehouse},
          ${record.np_warehouse_ref}, ${record.np_delivery_type},
          ${record.club_member_name}, ${record.engraving}, ${record.engraving_fee},
          ${record.product_sku}, ${record.product_variant}, ${record.quantity},
          ${record.total_amount}, ${record.mono_invoice_id}, ${record.comment},
          ${record.created_at}, ${record.paid_at}
        )
      `;
    } catch (err) {
      console.error("DB insert failed:", describeDbError(err));
      return NextResponse.json(
        { ok: false, error: "Не вдалося зберегти замовлення. Спробуйте ще раз." },
        { status: 500 },
      );
    }
  } else {
    saveOrderLocal(record);
  }

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

    if (dbConfigured()) {
      try {
        const sql = getDb();
        await sql`UPDATE orders SET mono_invoice_id = ${invoiceId} WHERE id = ${id}`;
      } catch (err) {
        console.error("DB invoice link failed:", describeDbError(err));
      }
    } else {
      saveOrderLocal({ ...record, mono_invoice_id: invoiceId });
    }
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
    productTitle: found.product.title,
    variantName: found.variant.name,
    quantity: data.quantity,
    totalKopecks: total,
    engraving,
    engravingFee,
    clubMemberName: data.clubMemberName?.trim() || null,
    comment: data.comment || null,
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

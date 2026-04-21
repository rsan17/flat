import { NextResponse } from "next/server";
import {
  createServerSupabase,
  supabaseConfigured,
} from "@/lib/supabase";
import { updateOrderByInvoiceLocal } from "@/lib/order-store";
import { sendAdminNotification, sendCustomerConfirmation } from "@/lib/email";
import { sendPaymentStatusTelegramNotification } from "@/lib/telegram";
import { findVariant } from "@/lib/products";
import { formatUAH } from "@/lib/utils";
import { verifyMonoSignature } from "@/lib/mono";
import { track as serverTrack } from "@vercel/analytics/server";

export const runtime = "nodejs";

type MonoWebhookBody = {
  invoiceId: string;
  status: "created" | "processing" | "hold" | "success" | "failure" | "reversed" | "expired";
  reference?: string;
  amount?: number;
  ccy?: number;
  modifiedDate?: string;
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sign");

  if (process.env.MONO_API_TOKEN) {
    if (!signature) {
      return NextResponse.json({ ok: false, error: "Missing X-Sign" }, { status: 401 });
    }
    const valid = await verifyMonoSignature(rawBody, signature);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }
  }

  let body: MonoWebhookBody;
  try {
    body = JSON.parse(rawBody) as MonoWebhookBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body?.invoiceId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const newStatus: "paid" | "cancelled" | "pending" =
    body.status === "success"
      ? "paid"
      : ["failure", "reversed", "expired"].includes(body.status)
        ? "cancelled"
        : "pending";

  const paidAt = body.status === "success" ? new Date().toISOString() : null;

  let updated:
    | {
        order_number: string;
        customer_first_name: string;
        customer_last_name: string;
        customer_phone: string;
        customer_email: string;
        np_city: string;
        np_warehouse: string;
        np_delivery_type: "warehouse" | "postomat" | "pickup";
        club_member_name: string | null;
        product_sku: string;
        product_variant: string;
        quantity: number;
        total_amount: number;
        comment: string | null;
      }
    | null = null;

  if (supabaseConfigured()) {
    try {
      const sb = createServerSupabase();
      const { data } = await sb
        .from("orders")
        .update({ status: newStatus, paid_at: paidAt })
        .eq("mono_invoice_id", body.invoiceId)
        .select()
        .maybeSingle();
      if (data) updated = data as typeof updated;
    } catch (err) {
      console.error("Supabase webhook update failed:", err);
    }
  } else {
    const local = updateOrderByInvoiceLocal(body.invoiceId, {
      status: newStatus,
      paid_at: paidAt,
    });
    if (local) updated = local;
  }

  if (updated && newStatus === "paid") {
    const variant = findVariant(updated.product_sku, updated.product_variant);
    try {
      await Promise.all([
        sendCustomerConfirmation({
          orderNumber: updated.order_number,
          firstName: updated.customer_first_name,
          lastName: updated.customer_last_name,
          phone: updated.customer_phone,
          email: updated.customer_email,
          city: updated.np_city,
          warehouse: updated.np_warehouse,
          deliveryType: updated.np_delivery_type,
          productTitle: variant?.product.title ?? updated.product_sku,
          variantName: variant?.variant.name ?? updated.product_variant,
          quantity: updated.quantity,
          totalUAH: formatUAH(updated.total_amount),
          comment: updated.comment,
          clubMemberName: updated.club_member_name,
        }),
        sendAdminNotification({
          orderNumber: updated.order_number,
          firstName: updated.customer_first_name,
          lastName: updated.customer_last_name,
          phone: updated.customer_phone,
          email: updated.customer_email,
          city: updated.np_city,
          warehouse: updated.np_warehouse,
          deliveryType: updated.np_delivery_type,
          productTitle: variant?.product.title ?? updated.product_sku,
          variantName: variant?.variant.name ?? updated.product_variant,
          quantity: updated.quantity,
          totalUAH: formatUAH(updated.total_amount),
          comment: updated.comment,
          clubMemberName: updated.club_member_name,
        }),
      ]);
    } catch (err) {
      console.error("Email send failed:", err);
    }
  }

  if (updated && (newStatus === "paid" || newStatus === "cancelled")) {
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
      console.error("Telegram payment notification failed:", tg.error);
    }

    try {
      await serverTrack(
        newStatus === "paid" ? "payment_success" : "payment_failed",
        {
          total_uah: Math.round(updated.total_amount / 100),
          delivery_type: updated.np_delivery_type,
          mono_status: body.status,
        },
        { headers: req.headers },
      );
    } catch (err) {
      console.error("Analytics track failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}

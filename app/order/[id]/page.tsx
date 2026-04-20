import Link from "next/link";
import { notFound } from "next/navigation";
import { Marquee } from "@/components/landing/marquee";
import { getOrderLocal } from "@/lib/order-store";
import { supabaseConfigured, createServerSupabase } from "@/lib/supabase";
import { formatUAH } from "@/lib/utils";
import { findVariant } from "@/lib/products";
import { PICKUP_ADDRESS } from "@/lib/validators";

async function loadOrder(id: string) {
  if (supabaseConfigured()) {
    try {
      const sb = createServerSupabase();
      const { data } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
      if (data) return data as ReturnType<typeof getOrderLocal>;
    } catch {
      // fall through
    }
  }
  return getOrderLocal(id);
}

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await loadOrder(id);
  if (!order) notFound();

  const found = findVariant(order.product_sku, order.product_variant);
  const productTitle = found?.product.title ?? order.product_sku;
  const variantName = found?.variant.name ?? order.product_variant;

  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          <Link href="/" className="font-display text-2xl">
            THE·BOARD
          </Link>
        </div>
      </header>
      <Marquee
        items={["THX", "YOU·MADE·A·MOVE", "DROP·001", "HANDMADE"]}
        variant="lilac"
      />
      <main className="mx-auto max-w-[900px] px-6 py-20">
        <p className="caps text-xs">успіх</p>
        <h1 className="font-display mt-4 text-6xl md:text-8xl">
          ДЯКУЄМО,
          <br />
          <span className="bg-lilac px-2">{order.customer_first_name.toUpperCase()}!</span>
        </h1>
        <p className="mt-6 text-lg">
          Замовлення прийнято. Ми вже починаємо робити вашу дошку.
        </p>

        <div className="card shadow-brut mt-10 divide-y-2 divide-ink">
          <Row k="номер" v={order.order_number} big />
          <Row k="статус" v={order.status === "paid" ? "оплачено" : order.status === "pending" ? "очікує оплати" : order.status} />
          <Row k="товар" v={`${productTitle} · ${variantName} × ${order.quantity}`} />
          <Row k="до сплати" v={formatUAH(order.total_amount)} />
          <Row
            k="куди"
            v={
              order.np_delivery_type === "pickup"
                ? `Самовивіз · ${PICKUP_ADDRESS}`
                : `${order.np_city}, ${order.np_warehouse} (${order.np_delivery_type === "postomat" ? "поштомат" : "відділення"})`
            }
          />
          {order.club_member_name && (
            <Row k="клуб" v={`Учасник: ${order.club_member_name}`} />
          )}
          <Row k="контакти" v={`${order.customer_phone} · ${order.customer_email}`} />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/" className="btn btn-lilac">
            на головну
          </Link>
          <span className="caps text-xs opacity-70">
            термін виготовлення — 5-7 днів
          </span>
        </div>
      </main>
    </>
  );
}

function Row({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <span className="caps text-xs opacity-70">{k}</span>
      <span className={big ? "font-display text-3xl" : "text-base font-semibold"}>
        {v}
      </span>
    </div>
  );
}

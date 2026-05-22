import { neon } from "@neondatabase/serverless";
import type { OrderRecord } from "@/lib/order-store";

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function insertOrder(record: OrderRecord) {
  const sql = getSql();
  await sql`
    insert into orders (
      id, order_number, status,
      customer_first_name, customer_last_name, customer_phone, customer_email,
      np_city, np_city_ref, np_warehouse, np_warehouse_ref, np_delivery_type,
      club_member_name, engraving, engraving_fee,
      product_sku, product_variant, quantity, total_amount,
      mono_invoice_id, comment, created_at, paid_at
    ) values (
      ${record.id}, ${record.order_number}, ${record.status},
      ${record.customer_first_name}, ${record.customer_last_name}, ${record.customer_phone}, ${record.customer_email},
      ${record.np_city}, ${record.np_city_ref}, ${record.np_warehouse}, ${record.np_warehouse_ref}, ${record.np_delivery_type},
      ${record.club_member_name}, ${record.engraving}, ${record.engraving_fee},
      ${record.product_sku}, ${record.product_variant}, ${record.quantity}, ${record.total_amount},
      ${record.mono_invoice_id}, ${record.comment}, ${record.created_at}, ${record.paid_at}
    )
  `;
}

export async function getOrderById(id: string): Promise<OrderRecord | null> {
  const sql = getSql();
  const rows = (await sql`select * from orders where id = ${id} limit 1`) as OrderRecord[];
  return rows[0] ?? null;
}

export async function updateOrderByInvoice(
  invoiceId: string,
  patch: { status: OrderRecord["status"]; paid_at: string | null },
): Promise<OrderRecord | null> {
  const sql = getSql();
  const rows = (await sql`
    update orders
       set status = ${patch.status},
           paid_at = ${patch.paid_at}
     where mono_invoice_id = ${invoiceId}
    returning *
  `) as OrderRecord[];
  return rows[0] ?? null;
}

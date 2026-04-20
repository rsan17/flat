// In-memory order store for local dev when Supabase is not configured.
// Replaced by Supabase queries in production (see /lib/supabase.ts).

export type OrderRecord = {
  id: string;
  order_number: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email: string;
  np_city: string;
  np_city_ref: string;
  np_warehouse: string;
  np_warehouse_ref: string;
  np_delivery_type: "warehouse" | "postomat" | "pickup";
  club_member_name: string | null;
  product_sku: string;
  product_variant: string;
  quantity: number;
  total_amount: number; // kopecks
  mono_invoice_id: string | null;
  comment: string | null;
  created_at: string;
  paid_at: string | null;
};

declare global {
  var __ORDERS__: Map<string, OrderRecord> | undefined;
}

function store() {
  if (!globalThis.__ORDERS__) globalThis.__ORDERS__ = new Map();
  return globalThis.__ORDERS__;
}

export function saveOrderLocal(order: OrderRecord) {
  store().set(order.id, order);
}

export function getOrderLocal(id: string): OrderRecord | null {
  return store().get(id) ?? null;
}

export function updateOrderByInvoiceLocal(
  invoiceId: string,
  patch: Partial<OrderRecord>,
) {
  for (const o of store().values()) {
    if (o.mono_invoice_id === invoiceId) {
      Object.assign(o, patch);
      return o;
    }
  }
  return null;
}

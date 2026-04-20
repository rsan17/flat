type OrderEmailData = {
  orderNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  warehouse: string;
  deliveryType: "warehouse" | "postomat" | "pickup";
  productTitle: string;
  variantName: string;
  quantity: number;
  totalUAH: string;
  comment?: string | null;
  clubMemberName?: string | null;
};

export async function sendCustomerConfirmation(data: OrderEmailData) {
  void data;
  return { skipped: true };
}

export async function sendAdminNotification(data: OrderEmailData) {
  void data;
  return { skipped: true };
}

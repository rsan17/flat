import { Resend } from "resend";

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

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendCustomerConfirmation(data: OrderEmailData) {
  const resend = getResend();
  if (!resend) return { skipped: true };
  const from = "THE BOARD <orders@theboard.local>";
  return resend.emails.send({
    from,
    to: data.email,
    subject: `Дякуємо за замовлення #${data.orderNumber}`,
    html: `
      <div style="font-family:Futura,Avenir Next,sans-serif;color:#0a0a0a;">
        <h1 style="text-transform:uppercase;letter-spacing:-0.02em;">Дякуємо, ${data.firstName}!</h1>
        <p>Ваше замовлення <b>#${data.orderNumber}</b> прийнято в обробку.</p>
        <p><b>${data.productTitle}</b> — ${data.variantName}, ${data.quantity} шт.</p>
        <p>Сума: <b>${data.totalUAH}</b></p>
        <p>Доставка: ${
          data.deliveryType === "pickup"
            ? "Самовивіз зі Львова"
            : `${data.city}, ${data.warehouse}`
        }</p>
        ${data.clubMemberName ? `<p>Учасник клубу: ${data.clubMemberName}</p>` : ""}
        <p style="margin-top:24px;">Термін виготовлення — до 2 тижнів. Щойно замовлення виїде до вас, ми надішлемо ТТН.</p>
        <p>— THE BOARD</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(data: OrderEmailData) {
  const resend = getResend();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) return { skipped: true };
  const from = "THE BOARD <orders@theboard.local>";
  return resend.emails.send({
    from,
    to: adminEmail,
    subject: `Нове замовлення #${data.orderNumber}`,
    html: `
      <div style="font-family:Futura,sans-serif;color:#0a0a0a;">
        <h2>Нове замовлення #${data.orderNumber}</h2>
        <p><b>Клієнт:</b> ${data.firstName} ${data.lastName}</p>
        <p><b>Телефон:</b> ${data.phone}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Товар:</b> ${data.productTitle} — ${data.variantName} × ${data.quantity}</p>
        <p><b>Сума:</b> ${data.totalUAH}</p>
        <p><b>Доставка:</b> ${
          data.deliveryType === "pickup"
            ? "Самовивіз зі Львова"
            : `${data.city}, ${data.warehouse} (${data.deliveryType})`
        }</p>
        ${data.clubMemberName ? `<p><b>Клуб:</b> ${data.clubMemberName}</p>` : ""}
        ${data.comment ? `<p><b>Коментар:</b> ${data.comment}</p>` : ""}
      </div>
    `,
  });
}

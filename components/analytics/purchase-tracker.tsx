"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Подія успішної оплати.
 *
 * Раніше вона слалась із вебхука Mono через @vercel/analytics/server — і за
 * пів року не записалась жодного разу, хоча оплати були (телеграм-сповіщення
 * приходили). Клієнтські події пишуться справно, тому рахуємо тут: на
 * сторінці замовлення, куди Mono повертає покупця після оплати.
 *
 * Сторінку можна перезавантажити чи відкрити з історії, тому на кожне
 * замовлення подія шлеться один раз за сесію.
 */
export function PurchaseTracker({
  orderId,
  status,
  totalKopecks,
  deliveryType,
}: {
  orderId: string;
  status: string;
  totalKopecks: number;
  deliveryType: "warehouse" | "postomat" | "pickup";
}) {
  useEffect(() => {
    if (status !== "paid") return;

    const key = `f5:purchase-tracked:${orderId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Приватний режим або заблоковане сховище — краще порахувати двічі,
      // ніж не порахувати взагалі.
    }

    track("payment_success", {
      total_uah: Math.round(totalKopecks / 100),
      delivery_type: deliveryType,
    });
  }, [orderId, status, totalKopecks, deliveryType]);

  return null;
}

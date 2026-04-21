"use client";

import { track } from "@vercel/analytics";

export type CtaLocation =
  | "hero"
  | "nav"
  | "product"
  | "cta_section"
  | "club_section";

export type DeliveryType = "warehouse" | "postomat" | "pickup";

export type OutboundTarget =
  | "telegram_f5chess"
  | "instagram_flat5"
  | "instagram_17dots"
  | "telegram_other"
  | "maps"
  | "other";

export function trackCtaClick(location: CtaLocation) {
  track("cta_click", { location });
}

export function trackCheckoutOpen() {
  track("checkout_open");
}

export function trackCheckoutSubmit(data: {
  total_uah: number;
  has_engraving: boolean;
  delivery_type: DeliveryType;
}) {
  track("checkout_submit", data);
}

export function trackEngravingToggle(enabled: boolean) {
  track("engraving_toggle", { enabled });
}

export function trackDeliverySelect(type: DeliveryType) {
  track("delivery_select", { type });
}

export function trackOutboundClick(target: OutboundTarget) {
  track("outbound_click", { target });
}

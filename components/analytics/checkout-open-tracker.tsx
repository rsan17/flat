"use client";

import { useEffect } from "react";
import { trackCheckoutOpen } from "@/lib/analytics";

export function CheckoutOpenTracker() {
  useEffect(() => {
    trackCheckoutOpen();
  }, []);
  return null;
}

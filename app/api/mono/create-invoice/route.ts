import { NextResponse } from "next/server";
import { createMonoInvoice } from "@/lib/mono";

export const runtime = "nodejs";

// Manual endpoint for re-creating invoices (e.g. "pay again" flow).
// Primary invoice creation happens inside /api/order/create.
export async function POST(req: Request) {
  const body = (await req.json()) as {
    amount?: number;
    reference?: string;
    destination?: string;
    redirectUrl?: string;
    webHookUrl?: string;
  };

  if (!body.amount || !body.reference) {
    return NextResponse.json(
      { ok: false, error: "amount і reference обов'язкові" },
      { status: 400 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  try {
    const inv = await createMonoInvoice({
      amount: body.amount,
      reference: body.reference,
      destination: body.destination || `Оплата ${body.reference}`,
      redirectUrl: body.redirectUrl || `${siteUrl}/`,
      webHookUrl: body.webHookUrl || `${siteUrl}/api/mono/webhook`,
    });
    return NextResponse.json({ ok: true, ...inv });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Mono error";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}

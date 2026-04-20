const MONO_INVOICE_URL = "https://api.monobank.ua/api/merchant/invoice/create";

export type MonoInvoiceRequest = {
  amount: number;
  reference: string;
  destination: string;
  redirectUrl: string;
  webHookUrl: string;
};

export type MonoInvoiceResponse = {
  invoiceId: string;
  pageUrl: string;
};

export async function createMonoInvoice(req: MonoInvoiceRequest): Promise<MonoInvoiceResponse> {
  const token = process.env.MONO_API_TOKEN;
  if (!token) throw new Error("MONO_API_TOKEN is not set");

  const res = await fetch(MONO_INVOICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": token,
    },
    body: JSON.stringify({
      amount: req.amount,
      ccy: 980,
      merchantPaymInfo: {
        reference: req.reference,
        destination: req.destination,
      },
      redirectUrl: req.redirectUrl,
      webHookUrl: req.webHookUrl,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mono invoice HTTP ${res.status}: ${body}`);
  }
  return (await res.json()) as MonoInvoiceResponse;
}

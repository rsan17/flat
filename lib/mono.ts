import crypto from "node:crypto";

const MONO_INVOICE_URL = "https://api.monobank.ua/api/merchant/invoice/create";
const MONO_PUBKEY_URL = "https://api.monobank.ua/api/merchant/pubkey";

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

type PubkeyCache = { pem: string; fetchedAt: number };
let pubkeyCache: PubkeyCache | null = null;
const PUBKEY_TTL_MS = 60 * 60 * 1000;

async function getMonoPubkey(): Promise<string> {
  const now = Date.now();
  if (pubkeyCache && now - pubkeyCache.fetchedAt < PUBKEY_TTL_MS) {
    return pubkeyCache.pem;
  }
  const token = process.env.MONO_API_TOKEN;
  if (!token) throw new Error("MONO_API_TOKEN is not set");
  const res = await fetch(MONO_PUBKEY_URL, {
    headers: { "X-Token": token },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Mono pubkey HTTP ${res.status}`);
  const json = (await res.json()) as { key: string };
  const pem = Buffer.from(json.key, "base64").toString("utf-8");
  pubkeyCache = { pem, fetchedAt: now };
  return pem;
}

export async function verifyMonoSignature(
  rawBody: string,
  signatureBase64: string,
): Promise<boolean> {
  try {
    const pem = await getMonoPubkey();
    const publicKey = crypto.createPublicKey(pem);
    const verify = crypto.createVerify("SHA256");
    verify.update(rawBody);
    verify.end();
    return verify.verify(publicKey, signatureBase64, "base64");
  } catch {
    return false;
  }
}

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

async function getMonoPubkey(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && pubkeyCache && now - pubkeyCache.fetchedAt < PUBKEY_TTL_MS) {
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

/**
 * Результат перевірки підпису вебхука.
 *
 * «Не змогли перевірити» і «підпис не збігається» — це різні речі:
 * перше означає, що в нас проблема (не дістали ключ Mono), і відповідати
 * на такий вебхук 401 не можна, бо Mono перестане повторювати спробу,
 * а замовлення назавжди зависне в pending.
 */
export type MonoSignatureCheck =
  | { status: "valid" }
  | { status: "invalid" }
  | { status: "unavailable"; reason: string };

function verifyWithPem(pem: string, rawBody: string, signatureBase64: string): boolean {
  const publicKey = crypto.createPublicKey(pem);
  const verify = crypto.createVerify("SHA256");
  verify.update(rawBody);
  verify.end();
  // Mono підписує ECDSA P-256 + SHA-256, підпис у DER — це дефолт для EC-ключа.
  return verify.verify(publicKey, signatureBase64, "base64");
}

export async function verifyMonoSignature(
  rawBody: string,
  signatureBase64: string,
): Promise<MonoSignatureCheck> {
  let pem: string;
  try {
    pem = await getMonoPubkey();
  } catch (err) {
    return {
      status: "unavailable",
      reason: err instanceof Error ? err.message : "pubkey fetch failed",
    };
  }

  try {
    if (verifyWithPem(pem, rawBody, signatureBase64)) return { status: "valid" };
  } catch {
    // Зіпсований підпис або ключ — пробуємо ще раз зі свіжим ключем нижче.
  }

  // Ключ міг змінитись, а в нас лежить закешований. Оновлюємо й пробуємо востаннє.
  try {
    const freshPem = await getMonoPubkey(true);
    if (freshPem !== pem && verifyWithPem(freshPem, rawBody, signatureBase64)) {
      return { status: "valid" };
    }
  } catch (err) {
    return {
      status: "unavailable",
      reason: err instanceof Error ? err.message : "pubkey refresh failed",
    };
  }

  return { status: "invalid" };
}

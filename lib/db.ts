import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function describeDbError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const e = err as { message?: unknown; code?: unknown; detail?: unknown; hint?: unknown };
    const parts = [e.message, e.code, e.detail, e.hint].filter(
      (v) => typeof v === "string" && v.length > 0,
    );
    if (parts.length) return parts.join(" · ");
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

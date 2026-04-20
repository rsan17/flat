import { NextResponse } from "next/server";
import { getWarehouses } from "@/lib/nova-poshta";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cityRef = url.searchParams.get("cityRef") || "";
  const q = url.searchParams.get("q") || "";
  const type = (url.searchParams.get("type") || "warehouse") as
    | "warehouse"
    | "postomat";
  if (!cityRef) return NextResponse.json({ warehouses: [] });

  try {
    const all = await getWarehouses(cityRef, q, 50);
    const filtered = all.filter((w) => {
      const isPostomat = w.CategoryOfWarehouse === "Postomat";
      return type === "postomat" ? isPostomat : !isPostomat;
    });
    return NextResponse.json({ warehouses: filtered });
  } catch (err) {
    const message = err instanceof Error ? err.message : "NP error";
    return NextResponse.json(
      { warehouses: [], error: message },
      { status: 200 },
    );
  }
}

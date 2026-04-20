import { NextResponse } from "next/server";
import { searchCities } from "@/lib/nova-poshta";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || "";
  if (!q || q.length < 2) {
    return NextResponse.json({ cities: [] });
  }
  try {
    const cities = await searchCities(q, 10);
    return NextResponse.json({ cities });
  } catch (err) {
    const message = err instanceof Error ? err.message : "NP error";
    return NextResponse.json(
      { cities: [], error: message },
      { status: 200 },
    );
  }
}

const NP_URL = "https://api.novaposhta.ua/v2.0/json/";

export type NPCity = {
  Ref: string;
  Description: string;
  AreaDescription: string;
  SettlementTypeDescription: string;
};

export type NPWarehouse = {
  Ref: string;
  Description: string;
  Number: string;
  CategoryOfWarehouse: string;
  CityRef: string;
};

async function npCall<T>(modelName: string, calledMethod: string, methodProperties: Record<string, unknown>): Promise<T[]> {
  const apiKey = process.env.NOVA_POSHTA_API_KEY || "";
  const res = await fetch(NP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, modelName, calledMethod, methodProperties }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`NP HTTP ${res.status}`);
  const json = (await res.json()) as { success: boolean; data: T[]; errors?: string[] };
  if (!json.success) throw new Error((json.errors || []).join(", ") || "NP error");
  return json.data;
}

export async function searchCities(query: string, limit = 10): Promise<NPCity[]> {
  if (!query || query.length < 2) return [];
  return npCall<NPCity>("AddressGeneral", "getCities", {
    FindByString: query,
    Limit: String(limit),
  });
}

export async function getWarehouses(cityRef: string, query = "", limit = 50): Promise<NPWarehouse[]> {
  if (!cityRef) return [];
  const props: Record<string, unknown> = {
    CityRef: cityRef,
    Limit: String(limit),
  };
  if (query) props.FindByString = query;
  return npCall<NPWarehouse>("AddressGeneral", "getWarehouses", props);
}

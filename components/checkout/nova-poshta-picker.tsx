"use client";

import { useEffect, useRef, useState } from "react";
import type { NPCity, NPWarehouse } from "@/lib/nova-poshta";

import { PICKUP_ADDRESS, type DeliveryType } from "@/lib/validators";

type Props = {
  city: string;
  cityRef: string;
  warehouse: string;
  warehouseRef: string;
  deliveryType: DeliveryType;
  onChange: (patch: {
    city?: string;
    cityRef?: string;
    warehouse?: string;
    warehouseRef?: string;
    deliveryType?: DeliveryType;
  }) => void;
  errors?: Partial<Record<"city" | "warehouse", string | undefined>>;
};

export function NovaPoshtaPicker({
  city,
  cityRef,
  warehouse,
  warehouseRef,
  deliveryType,
  onChange,
  errors,
}: Props) {
  const [cityQuery, setCityQuery] = useState(city);
  const [cityResults, setCityResults] = useState<NPCity[]>([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const [warehouseQuery, setWarehouseQuery] = useState(warehouse);
  const [warehouseQueryDebounced, setWarehouseQueryDebounced] = useState(warehouse);
  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([]);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [loadingWh, setLoadingWh] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWarehouseQueryDebounced(warehouseQuery), 300);
    return () => clearTimeout(t);
  }, [warehouseQuery]);

  const cityBoxRef = useRef<HTMLDivElement | null>(null);
  const whBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
      if (whBoxRef.current && !whBoxRef.current.contains(e.target as Node)) {
        setWarehouseOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced city search
  useEffect(() => {
    if (!cityQuery || cityQuery.length < 2) {
      setCityResults([]);
      return;
    }
    if (cityQuery === city && cityRef) return;
    setLoadingCities(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/nova-poshta/cities?q=${encodeURIComponent(cityQuery)}`,
        );
        const data = (await r.json()) as { cities: NPCity[] };
        setCityResults(data.cities || []);
        setCityOpen(true);
      } catch {
        setCityResults([]);
      } finally {
        setLoadingCities(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [cityQuery, city, cityRef]);

  // Load warehouses when city or filters change
  useEffect(() => {
    if (!cityRef) {
      setWarehouses([]);
      return;
    }
    let cancelled = false;
    setLoadingWh(true);
    (async () => {
      try {
        const params = new URLSearchParams({
          cityRef,
          type: deliveryType,
        });
        if (warehouseQueryDebounced) params.set("q", warehouseQueryDebounced);
        const r = await fetch(`/api/nova-poshta/warehouses?${params}`);
        const data = (await r.json()) as { warehouses: NPWarehouse[] };
        if (!cancelled) setWarehouses(data.warehouses || []);
      } catch {
        if (!cancelled) setWarehouses([]);
      } finally {
        if (!cancelled) setLoadingWh(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cityRef, deliveryType, warehouseQueryDebounced]);

  function pickCity(c: NPCity) {
    const label = `${c.Description}, ${c.AreaDescription} обл.`;
    setCityQuery(label);
    setCityOpen(false);
    onChange({
      city: label,
      cityRef: c.Ref,
      warehouse: "",
      warehouseRef: "",
    });
    setWarehouseQuery("");
  }

  function pickWarehouse(w: NPWarehouse) {
    setWarehouseQuery(w.Description);
    setWarehouseOpen(false);
    onChange({ warehouse: w.Description, warehouseRef: w.Ref });
  }

  const isPickup = deliveryType === "pickup";

  return (
    <div className="space-y-4">
      <div className="seg flex-wrap">
        <button
          type="button"
          aria-pressed={deliveryType === "warehouse"}
          onClick={() =>
            onChange({
              deliveryType: "warehouse",
              warehouse: "",
              warehouseRef: "",
            })
          }
        >
          Відділення НП
        </button>
        <button
          type="button"
          aria-pressed={deliveryType === "postomat"}
          onClick={() =>
            onChange({
              deliveryType: "postomat",
              warehouse: "",
              warehouseRef: "",
            })
          }
        >
          Поштомат НП
        </button>
        <button
          type="button"
          aria-pressed={deliveryType === "pickup"}
          onClick={() =>
            onChange({
              deliveryType: "pickup",
              city: "",
              cityRef: "",
              warehouse: "",
              warehouseRef: "",
            })
          }
        >
          Самовивіз
        </button>
      </div>

      {isPickup ? (
        <div className="card p-4 text-sm">
          <div className="caps text-xs opacity-70">точка самовивозу</div>
          <div className="font-display mt-1 text-xl">{PICKUP_ADDRESS}</div>
          <p className="mt-2 text-xs opacity-80">
            Після виготовлення ми напишемо у Telegram / email, щоб домовитись
            про день і час. Оплата онлайн, без комісії на місці.
          </p>
        </div>
      ) : (
        <>
      <div className="field" ref={cityBoxRef}>
        <label>Місто</label>
        <div className="relative">
          <input
            className="input"
            placeholder="Почніть вводити: Львів, Київ…"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              if (cityRef) onChange({ city: e.target.value, cityRef: "", warehouse: "", warehouseRef: "" });
            }}
            onFocus={() => cityResults.length > 0 && setCityOpen(true)}
            aria-invalid={!!errors?.city}
            autoComplete="off"
          />
          {cityOpen && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-auto border-2 border-ink bg-paper shadow-brut">
              {loadingCities && (
                <li className="caps px-3 py-2 text-xs opacity-60">
                  пошук…
                </li>
              )}
              {!loadingCities && cityResults.length === 0 && (
                <li className="caps px-3 py-2 text-xs opacity-60">
                  нічого не знайдено
                </li>
              )}
              {cityResults.map((c) => (
                <li key={c.Ref}>
                  <button
                    type="button"
                    onClick={() => pickCity(c)}
                    className="flex w-full items-center justify-between border-b border-ink/10 px-3 py-2 text-left text-sm hover:bg-lilac"
                  >
                    <span>{c.Description}</span>
                    <span className="caps text-[10px] opacity-60">
                      {c.AreaDescription} обл.
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors?.city && <div className="err">{errors.city}</div>}
      </div>

      <div className="field" ref={whBoxRef}>
        <label>
          {deliveryType === "postomat" ? "Поштомат" : "Відділення"}
        </label>
        <div className="relative">
          <input
            className="input"
            placeholder={cityRef ? "Номер або адреса" : "Спершу оберіть місто"}
            disabled={!cityRef}
            value={warehouseQuery}
            onChange={(e) => {
              setWarehouseQuery(e.target.value);
              if (warehouseRef) onChange({ warehouse: e.target.value, warehouseRef: "" });
            }}
            onFocus={() => cityRef && setWarehouseOpen(true)}
            aria-invalid={!!errors?.warehouse}
            autoComplete="off"
          />
          {warehouseOpen && cityRef && (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-auto border-2 border-ink bg-paper shadow-brut">
              {loadingWh && (
                <li className="caps px-3 py-2 text-xs opacity-60">пошук…</li>
              )}
              {!loadingWh && warehouses.length === 0 && (
                <li className="caps px-3 py-2 text-xs opacity-60">
                  немає відділень
                </li>
              )}
              {warehouses.map((w) => (
                <li key={w.Ref}>
                  <button
                    type="button"
                    onClick={() => pickWarehouse(w)}
                    className="block w-full border-b border-ink/10 px-3 py-2 text-left text-sm hover:bg-lilac"
                  >
                    {w.Description}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors?.warehouse && <div className="err">{errors.warehouse}</div>}
      </div>
        </>
      )}
    </div>
  );
}

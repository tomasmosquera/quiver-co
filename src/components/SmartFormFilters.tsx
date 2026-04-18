"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type TextFilterKey = "referencia" | "tamanio" | "anio" | "largoLineas";

const YEARS = Array.from(
  { length: new Date().getFullYear() - 2014 },
  (_, i) => String(new Date().getFullYear() - i)
);
const LINE_LENGTHS = ["18m", "20m", "22m", "24m", "27m", "Mixtas"];

interface Props {
  activeFilters: TextFilterKey[];
  ciudad: string;
  referencia: string;
  tamanio: string;
  anio: string;
  largoLineas: string;
  baseParams: Record<string, string>;
  tamanioLabel?: string;
}

export default function SmartFormFilters({
  activeFilters,
  ciudad,
  referencia,
  tamanio,
  anio,
  largoLineas,
  baseParams,
  tamanioLabel = "Tamaño",
}: Props) {
  const router = useRouter();
  const [vals, setVals] = useState({ ciudad, referencia, tamanio, anio, largoLineas });

  function apply() {
    const params = new URLSearchParams(baseParams);
    if (vals.ciudad) params.set("ciudad", vals.ciudad); else params.delete("ciudad");
    if (vals.referencia && activeFilters.includes("referencia")) params.set("referencia", vals.referencia); else params.delete("referencia");
    if (vals.tamanio && activeFilters.includes("tamanio")) params.set("tamanio", vals.tamanio); else params.delete("tamanio");
    if (vals.anio && activeFilters.includes("anio")) params.set("anio", vals.anio); else params.delete("anio");
    if (vals.largoLineas && activeFilters.includes("largoLineas")) params.set("largoLineas", vals.largoLineas); else params.delete("largoLineas");
    router.push(`/equipos?${params.toString()}`);
  }

  const hasValues = vals.ciudad || vals.referencia || vals.tamanio || vals.anio || vals.largoLineas;

  return (
    <div className="space-y-4">

      {/* Ciudad — siempre visible */}
      <div>
        <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Ciudad</h3>
        <input
          type="text"
          value={vals.ciudad}
          onChange={e => setVals(v => ({ ...v, ciudad: e.target.value }))}
          onKeyDown={e => e.key === "Enter" && apply()}
          placeholder="Ej: Cartagena..."
          className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
        />
      </div>

      {/* Referencia */}
      {activeFilters.includes("referencia") && (
        <div>
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Referencia</h3>
          <input
            type="text"
            value={vals.referencia}
            onChange={e => setVals(v => ({ ...v, referencia: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && apply()}
            placeholder="Ej: Vegas, Naim..."
            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      )}

      {/* Tamaño / Talla */}
      {activeFilters.includes("tamanio") && (
        <div>
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">{tamanioLabel}</h3>
          <input
            type="text"
            value={vals.tamanio}
            onChange={e => setVals(v => ({ ...v, tamanio: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && apply()}
            placeholder="Ej: 12, 54cm, M..."
            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
          />
        </div>
      )}

      {/* Año */}
      {activeFilters.includes("anio") && (
        <div>
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Año</h3>
          <select
            value={vals.anio}
            onChange={e => setVals(v => ({ ...v, anio: e.target.value }))}
            className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6] bg-white"
          >
            <option value="">Cualquier año</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      {/* Largo de líneas */}
      {activeFilters.includes("largoLineas") && (
        <div>
          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Largo de líneas</h3>
          <div className="flex flex-wrap gap-1.5">
            {LINE_LENGTHS.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setVals(v => ({ ...v, largoLineas: v.largoLineas === l ? "" : l }))}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  vals.largoLineas === l
                    ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                    : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      {hasValues && (
        <button
          type="button"
          onClick={apply}
          className="w-full py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors font-medium"
        >
          Aplicar
        </button>
      )}
    </div>
  );
}

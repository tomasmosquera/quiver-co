"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type TextFilterKey = "largoLineas";

const LINE_LENGTHS = ["18m", "20m", "22m", "24m", "27m", "Mixtas"];

interface Props {
  activeFilters: TextFilterKey[];
  largoLineas: string;
  baseParams: Record<string, string>;
}

export default function SmartFormFilters({
  activeFilters,
  largoLineas,
  baseParams,
}: Props) {
  const router = useRouter();
  const [vals, setVals] = useState({ largoLineas });

  function apply() {
    const params = new URLSearchParams(baseParams);
    if (vals.largoLineas && activeFilters.includes("largoLineas")) params.set("largoLineas", vals.largoLineas); else params.delete("largoLineas");
    router.push(`/equipos?${params.toString()}`);
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="space-y-4">

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

      {vals.largoLineas && (
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

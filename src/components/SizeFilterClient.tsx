"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Ruler, X } from "lucide-react";

export interface SizeItem {
  name: string;
  count: number;
  href: string;
}

interface Props {
  top10Sizes: SizeItem[];
  allSizes: SizeItem[];
  currentTamanio: string;
  clearTamanioHref: string;
}

export default function SizeFilterClient({
  top10Sizes,
  allSizes,
  currentTamanio,
  clearTamanioHref,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  // Si el tamaño activo no está en el top 10, expandir automáticamente
  useEffect(() => {
    if (currentTamanio && !top10Sizes.find(s => s.name === currentTamanio)) {
      setExpanded(true);
    }
  }, [currentTamanio, top10Sizes]);

  if (allSizes.length === 0) return null;

  const visibleSizes = expanded ? allSizes : top10Sizes;

  return (
    <div>
      <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Ruler className="w-3.5 h-3.5 text-[#3B82F6]" /> Tamaño
      </h3>
      <div className="space-y-1">
        {currentTamanio && (
          <Link
            href={clearTamanioHref}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <X className="w-3 h-3" /> Todos los tamaños
          </Link>
        )}

        {visibleSizes.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              currentTamanio === s.name
                ? "bg-[#3B82F6] text-white font-semibold"
                : "text-[#374151] hover:bg-[#F9FAFB]"
            }`}
          >
            <span>{s.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              currentTamanio === s.name
                ? "bg-white/20 text-white"
                : "bg-[#EFF6FF] text-[#3B82F6]"
            }`}>
              {s.count}
            </span>
          </Link>
        ))}

        {allSizes.length > 10 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors mt-1"
          >
            {expanded ? "Ver menos ↑" : `Ver todos (${allSizes.length}) →`}
          </button>
        )}
      </div>
    </div>
  );
}

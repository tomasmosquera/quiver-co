"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, X } from "lucide-react";

export interface YearItem {
  name: string;
  count: number;
  href: string;
}

interface Props {
  top10Years: YearItem[];
  allYears: YearItem[];
  currentAnio: string;
  clearAnioHref: string;
}

export default function YearFilterClient({
  top10Years,
  allYears,
  currentAnio,
  clearAnioHref,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (currentAnio && !top10Years.find(y => y.name === currentAnio)) {
      setExpanded(true);
    }
  }, [currentAnio, top10Years]);

  if (allYears.length === 0) return null;

  const visibleYears = expanded ? allYears : top10Years;

  return (
    <div>
      <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" /> Año
      </h3>
      <div className="space-y-1">
        {currentAnio && (
          <Link
            href={clearAnioHref}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <X className="w-3 h-3" /> Todos los años
          </Link>
        )}

        {visibleYears.map((y) => (
          <Link
            key={y.name}
            href={y.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              currentAnio === y.name
                ? "bg-[#3B82F6] text-white font-semibold"
                : "text-[#374151] hover:bg-[#F9FAFB]"
            }`}
          >
            <span>{y.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              currentAnio === y.name
                ? "bg-white/20 text-white"
                : "bg-[#EFF6FF] text-[#3B82F6]"
            }`}>
              {y.count}
            </span>
          </Link>
        ))}

        {allYears.length > 10 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors mt-1"
          >
            {expanded ? "Ver menos ↑" : `Ver todos (${allYears.length}) →`}
          </button>
        )}
      </div>
    </div>
  );
}

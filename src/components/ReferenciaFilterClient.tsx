"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tag, X, Search } from "lucide-react";

export interface ReferenciaItem {
  name: string;
  count: number;
  href: string;
}

interface Props {
  top5: ReferenciaItem[];
  all: ReferenciaItem[];
  currentReferencia: string;
  clearHref: string;
}

export default function ReferenciaFilterClient({
  top5,
  all,
  currentReferencia,
  clearHref,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = all.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  if (all.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-[#3B82F6]" /> Referencia
      </h3>
      <div className="space-y-1">
        {currentReferencia && (
          <Link
            href={clearHref}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <X className="w-3 h-3" /> Todas
          </Link>
        )}

        {top5.map((r) => (
          <Link
            key={r.name}
            href={r.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              currentReferencia === r.name
                ? "bg-[#3B82F6] text-white font-semibold"
                : "text-[#374151] hover:bg-[#F9FAFB]"
            }`}
          >
            <span>{r.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              currentReferencia === r.name
                ? "bg-white/20 text-white"
                : "bg-[#EFF6FF] text-[#3B82F6]"
            }`}>{r.count}</span>
          </Link>
        ))}

        {all.length > 5 && (
          <button
            onClick={() => setModalOpen(true)}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors mt-1"
          >
            Ver todas →
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">

            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#3B82F6]" /> Todas las referencias
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar referencia..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-[#6B7280] text-sm">
                  No se encontraron referencias.
                </div>
              ) : (
                filtered.map((r) => (
                  <Link
                    key={r.name}
                    href={r.href}
                    onClick={() => setModalOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                      currentReferencia === r.name
                        ? "bg-[#3B82F6] text-white font-semibold"
                        : "text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <span>{r.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      currentReferencia === r.name
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-[#3B82F6]"
                    }`}>{r.count}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

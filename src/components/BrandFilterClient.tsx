"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tag, X, Search } from "lucide-react";

export interface BrandItem {
  name: string;
  slug: string;
  count: number;
  href: string;
}

interface BrandFilterClientProps {
  top5Brands: BrandItem[];
  alphabeticalBrands: BrandItem[];
  currentMarca: string;
  clearMarcaHref: string;
}

export default function BrandFilterClient({
  top5Brands,
  alphabeticalBrands,
  currentMarca,
  clearMarcaHref,
}: BrandFilterClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredModalBrands = alphabeticalBrands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <div>
      <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-[#3B82F6]" /> Marca
      </h3>
      <div className="space-y-1">
        <Link
          href={clearMarcaHref}
          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
            !currentMarca
              ? "bg-[#3B82F6] text-white font-semibold"
              : "text-[#374151] hover:bg-[#F9FAFB]"
          }`}
        >
          Todas las marcas
        </Link>
        {top5Brands.map((b) => (
          <Link
            key={b.slug}
            href={b.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              currentMarca === b.slug
                ? "bg-[#3B82F6] text-white font-semibold"
                : "text-[#374151] hover:bg-[#F9FAFB]"
            }`}
          >
            <span>{b.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              currentMarca === b.slug
                ? "bg-white/20 text-white"
                : "bg-[#EFF6FF] text-[#3B82F6]"
            }`}>{b.count}</span>
          </Link>
        ))}

        {alphabeticalBrands.length > 10 && (
          <button
            onClick={() => setModalOpen(true)}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors mt-2"
          >
            Ver todas las marcas &rarr;
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#3B82F6]" /> Todas las marcas
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Búsqueda dentro del modal */}
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar marca..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            {/* Lista de marcas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredModalBrands.length === 0 ? (
                <div className="py-10 text-center text-[#6B7280] text-sm">
                  No se encontraron marcas.
                </div>
              ) : (
                filteredModalBrands.map((b) => (
                  <Link
                    key={b.slug}
                    href={b.href}
                    onClick={() => setModalOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                      currentMarca === b.slug
                        ? "bg-[#3B82F6] text-white font-semibold"
                        : "text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        currentMarca === b.slug
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-[#3B82F6] font-medium"
                      }`}
                    >
                      {b.count}
                    </span>
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

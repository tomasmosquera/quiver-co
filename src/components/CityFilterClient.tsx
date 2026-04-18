"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, X, Search } from "lucide-react";

export interface CityItem {
  name: string;
  count: number;
  href: string;
}

interface Props {
  top5Cities: CityItem[];
  allCities: CityItem[];
  currentCiudad: string;
  clearCiudadHref: string;
}

export default function CityFilterClient({
  top5Cities,
  allCities,
  currentCiudad,
  clearCiudadHref,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCities = allCities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  return (
    <div>
      <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" /> Ciudad
      </h3>
      <div className="space-y-1">
        <Link
          href={clearCiudadHref}
          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
            !currentCiudad
              ? "bg-[#3B82F6] text-white font-semibold"
              : "text-[#374151] hover:bg-[#F9FAFB]"
          }`}
        >
          Todas las ciudades
        </Link>

        {top5Cities.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              currentCiudad.toLowerCase() === c.name.toLowerCase()
                ? "bg-[#3B82F6] text-white font-semibold"
                : "text-[#374151] hover:bg-[#F9FAFB]"
            }`}
          >
            {c.name} ({c.count})
          </Link>
        ))}

        {allCities.length > 5 && (
          <button
            onClick={() => setModalOpen(true)}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#3B82F6] hover:bg-[#F9FAFB] transition-colors mt-2"
          >
            Ver todas las ciudades &rarr;
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#3B82F6]" /> Todas las ciudades
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Búsqueda */}
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar ciudad..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D1D5DB] text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {filteredCities.length === 0 ? (
                <div className="py-10 text-center text-[#6B7280] text-sm">
                  No se encontraron ciudades.
                </div>
              ) : (
                filteredCities.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    onClick={() => setModalOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                      currentCiudad.toLowerCase() === c.name.toLowerCase()
                        ? "bg-[#3B82F6] text-white font-semibold"
                        : "text-[#374151] hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        currentCiudad.toLowerCase() === c.name.toLowerCase()
                          ? "bg-white/20 text-white"
                          : "bg-blue-50 text-[#3B82F6] font-medium"
                      }`}
                    >
                      {c.count}
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

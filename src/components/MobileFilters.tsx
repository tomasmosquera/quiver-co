"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterOption { value: string; label: string; href: string; }
interface BrandOption  { name: string; slug: string; href: string; count: number; }

interface Props {
  disciplines:    FilterOption[];
  equipmentTypes: FilterOption[];
  conditions:     FilterOption[];
  top10Brands:    BrandOption[];
  currentDisciplina: string;
  currentTipo:       string;
  currentCondicion:  string;
  currentMarca:      string;
  clearHref:         string;
  precioMinHref:     string; // base url para precio (sin precioMin/Max)
  precioMin:         string;
  precioMax:         string;
  activeCount:       number;
}

export default function MobileFilters({
  disciplines, equipmentTypes, conditions, top10Brands,
  currentDisciplina, currentTipo, currentCondicion, currentMarca,
  clearHref, activeCount, precioMin, precioMax,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:border-[#D1D5DB] transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {activeCount > 0 && (
          <span className="bg-[#3B82F6] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="relative mt-auto bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-[#111827]">Filtros</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6]">
                <X className="w-5 h-5 text-[#374151]" />
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

              {/* Disciplina */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Disciplina</h3>
                <div className="flex flex-wrap gap-2">
                  {disciplines.map((d) => (
                    <Link
                      key={d.value}
                      href={d.href}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        currentDisciplina === d.value
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#374151] border-[#E5E7EB]"
                      }`}
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tipo */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Tipo de equipo</h3>
                <div className="flex flex-wrap gap-2">
                  {equipmentTypes.map((t) => (
                    <Link
                      key={t.value}
                      href={t.href}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        currentTipo === t.value
                          ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                          : "bg-white text-[#374151] border-[#E5E7EB]"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Marca */}
              {top10Brands.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Marca</h3>
                  <div className="flex flex-wrap gap-2">
                    {top10Brands.map((b) => (
                      <Link
                        key={b.slug}
                        href={b.href}
                        onClick={() => setOpen(false)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          currentMarca === b.slug
                            ? "bg-[#111827] text-white border-[#111827]"
                            : "bg-white text-[#374151] border-[#E5E7EB]"
                        }`}
                      >
                        {b.name} {b.count > 0 && <span className="opacity-60">({b.count})</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Estado</h3>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((c) => (
                    <Link
                      key={c.value}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        currentCondicion === c.value
                          ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                          : "bg-white text-[#374151] border-[#E5E7EB]"
                      }`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Precio (COP)</h3>
                <form method="GET" action="/equipos" className="flex gap-2">
                  <input
                    name="precioMin"
                    type="number"
                    defaultValue={precioMin}
                    placeholder="Mínimo"
                    className="flex-1 px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                  <input
                    name="precioMax"
                    type="number"
                    defaultValue={precioMax}
                    placeholder="Máximo"
                    className="flex-1 px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-[#111827] text-white rounded-lg text-sm font-medium"
                  >
                    OK
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#F3F4F6] flex gap-3">
              {activeCount > 0 && (
                <Link
                  href={clearHref}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-red-500 text-center"
                >
                  Limpiar filtros
                </Link>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 bg-[#111827] text-white rounded-xl text-sm font-bold"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterOption { value: string; label: string; }
interface BrandOption  { name: string; slug: string; count: number; }

interface Props {
  disciplines:    FilterOption[];
  equipmentTypes: FilterOption[];
  conditions:     FilterOption[];
  top5Brands:    BrandOption[];
  currentDisciplina: string;
  currentTipo:       string;
  currentCondicion:  string;
  currentMarca:      string;
  currentCiudad:     string;
  precioMin:         string;
  precioMax:         string;
  activeCount:       number;
  baseParams:        Record<string, string>; // params que no son filtros (q, orden)
}

export default function MobileFilters({
  disciplines, equipmentTypes, conditions, top5Brands,
  currentDisciplina, currentTipo, currentCondicion, currentMarca,
  currentCiudad, precioMin, precioMax, activeCount, baseParams,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Estado local — empieza con los filtros actuales
  const [disc,    setDisc]    = useState(currentDisciplina);
  const [tipo,    setTipo]    = useState(currentTipo);
  const [cond,    setCond]    = useState(currentCondicion);
  const [marca,   setMarca]   = useState(currentMarca);
  const [ciudad,  setCiudad]  = useState(currentCiudad);
  const [pMin,    setPMin]    = useState(precioMin);
  const [pMax,    setPMax]    = useState(precioMax);

  const pendingCount = [disc, tipo, cond, marca, ciudad, pMin, pMax].filter(Boolean).length;

  function openModal() {
    // Sincronizar con los filtros actuales al abrir
    setDisc(currentDisciplina);
    setTipo(currentTipo);
    setCond(currentCondicion);
    setMarca(currentMarca);
    setCiudad(currentCiudad);
    setPMin(precioMin);
    setPMax(precioMax);
    setOpen(true);
  }

  function applyFilters() {
    const params = new URLSearchParams(baseParams);
    if (disc)   params.set("seccion", disc);
    if (tipo)   params.set("tipo", tipo);
    if (cond)   params.set("condicion", cond);
    if (marca)  params.set("marca", marca);
    if (ciudad) params.set("ciudad", ciudad);
    if (pMin)   params.set("precioMin", pMin);
    if (pMax)   params.set("precioMax", pMax);
    router.push(`/equipos?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    setDisc(""); setTipo(""); setCond(""); setMarca(""); setCiudad(""); setPMin(""); setPMax("");
  }

  function toggle(current: string, value: string, setter: (v: string) => void) {
    setter(current === value ? "" : value);
  }

  const chipBase = "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors";
  const chipActive = "bg-[#111827] text-white border-[#111827]";
  const chipInactive = "bg-white text-[#374151] border-[#E5E7EB]";
  const chipBlueActive = "bg-[#3B82F6] text-white border-[#3B82F6]";

  return (
    <>
      <button
        onClick={openModal}
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

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          <div className="relative mt-auto bg-white rounded-t-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-[#111827]">Filtros</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6]">
                <X className="w-5 h-5 text-[#374151]" />
              </button>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

              {/* Disciplina */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Disciplina</h3>
                <div className="flex flex-wrap gap-2">
                  {disciplines.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => toggle(disc, d.value, setDisc)}
                      className={`${chipBase} ${disc === d.value ? chipActive : chipInactive}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Tipo de equipo</h3>
                <div className="flex flex-wrap gap-2">
                  {equipmentTypes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => toggle(tipo, t.value, setTipo)}
                      className={`${chipBase} ${tipo === t.value ? chipBlueActive : chipInactive}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marca */}
              {top5Brands.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Marca</h3>
                  <div className="flex flex-wrap gap-2">
                    {top5Brands.map((b) => (
                      <button
                        key={b.slug}
                        onClick={() => toggle(marca, b.slug, setMarca)}
                        className={`${chipBase} ${marca === b.slug ? chipActive : chipInactive}`}
                      >
                        {b.name}{b.count > 0 && <span className="opacity-60 ml-1">({b.count})</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Estado */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Estado</h3>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => toggle(cond, c.value, setCond)}
                      className={`${chipBase} ${cond === c.value ? chipBlueActive : chipInactive}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Ciudad</h3>
                <input
                  type="text"
                  value={ciudad}
                  onChange={e => setCiudad(e.target.value)}
                  placeholder="Ej: Cartagena, Santa Marta..."
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* Precio */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Precio (COP)</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pMin}
                    onChange={(e) => setPMin(e.target.value)}
                    placeholder="Mínimo"
                    className="w-0 flex-1 min-w-0 px-2 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                  <input
                    type="number"
                    value={pMax}
                    onChange={(e) => setPMax(e.target.value)}
                    placeholder="Máximo"
                    className="w-0 flex-1 min-w-0 px-2 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#F3F4F6] flex gap-3">
              {pendingCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-red-500"
                >
                  Limpiar
                </button>
              )}
              <button
                onClick={applyFilters}
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

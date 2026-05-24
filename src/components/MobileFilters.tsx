"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Shield } from "lucide-react";

interface FilterOption { value: string; label: string; }
interface BrandOption  { name: string; slug: string; count: number; }
interface CountOption  { name: string; count: number; }

type SmartLinkFilter =
  | { kind: "subtipo"; label: string; metaKey: string; options: { value: string; label: string }[] }
  | { kind: "toggle";  key: string;  label: string;   onLabel: string };

interface SmartConfig {
  linkFilters: SmartLinkFilter[];
  textFilters: string[];
}

interface Props {
  disciplines:      FilterOption[];
  equipmentTypes:   FilterOption[];
  conditions:       FilterOption[];
  top5Brands:       BrandOption[];
  top5Cities:       CountOption[];
  top10Years:       CountOption[];
  top10Sizes:       CountOption[];
  top5Referencias:  CountOption[];
  smartConfig:      SmartConfig | undefined;
  isKiteCometa:     boolean;
  currentDisciplina:      string;
  currentTipo:            string;
  currentCondicion:       string;
  currentMarca:           string;
  currentCiudad:          string;
  currentSubtipo:         string;
  currentAnio:            string;
  currentTamanio:         string;
  currentReferencia:      string;
  currentLargoLineas:     string;
  currentIncluyeBarra:    string;
  currentIncluyeMaleta:   string;
  currentIncluyeLeash:    string;
  currentSinReparaciones: string;
  currentConPeritaje:     string;
  precioMin:   string;
  precioMax:   string;
  activeCount: number;
  baseParams:  Record<string, string>;
}

export default function MobileFilters({
  disciplines, equipmentTypes, conditions, top5Brands,
  top5Cities, top10Years, top10Sizes, top5Referencias,
  smartConfig, isKiteCometa,
  currentDisciplina, currentTipo, currentCondicion, currentMarca,
  currentCiudad, currentSubtipo, currentAnio, currentTamanio,
  currentReferencia, currentLargoLineas,
  currentIncluyeBarra, currentIncluyeMaleta, currentIncluyeLeash,
  currentSinReparaciones, currentConPeritaje,
  precioMin, precioMax, activeCount, baseParams,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [disc,            setDisc]            = useState(currentDisciplina);
  const [tipo,            setTipo]            = useState(currentTipo);
  const [cond,            setCond]            = useState(currentCondicion);
  const [marca,           setMarca]           = useState(currentMarca);
  const [ciudad,          setCiudad]          = useState(currentCiudad);
  const [subtipo,         setSubtipo]         = useState(currentSubtipo);
  const [anio,            setAnio]            = useState(currentAnio);
  const [tamanio,         setTamanio]         = useState(currentTamanio);
  const [referencia,      setReferencia]      = useState(currentReferencia);
  const [largoLineas,     setLargoLineas]     = useState(currentLargoLineas);
  const [incluyeBarra,    setIncluyeBarra]    = useState(currentIncluyeBarra);
  const [incluyeMaleta,   setIncluyeMaleta]   = useState(currentIncluyeMaleta);
  const [incluyeLeash,    setIncluyeLeash]    = useState(currentIncluyeLeash);
  const [sinReparaciones, setSinReparaciones] = useState(currentSinReparaciones);
  const [conPeritaje,     setConPeritaje]     = useState(currentConPeritaje);
  const [pMin,            setPMin]            = useState(precioMin);
  const [pMax,            setPMax]            = useState(precioMax);

  const pendingCount = [
    disc, tipo, cond, marca, ciudad, subtipo, anio, tamanio, referencia,
    largoLineas, incluyeBarra, incluyeMaleta, incluyeLeash, sinReparaciones,
    conPeritaje, pMin, pMax,
  ].filter(Boolean).length;

  function openModal() {
    setDisc(currentDisciplina);
    setTipo(currentTipo);
    setCond(currentCondicion);
    setMarca(currentMarca);
    setCiudad(currentCiudad);
    setSubtipo(currentSubtipo);
    setAnio(currentAnio);
    setTamanio(currentTamanio);
    setReferencia(currentReferencia);
    setLargoLineas(currentLargoLineas);
    setIncluyeBarra(currentIncluyeBarra);
    setIncluyeMaleta(currentIncluyeMaleta);
    setIncluyeLeash(currentIncluyeLeash);
    setSinReparaciones(currentSinReparaciones);
    setConPeritaje(currentConPeritaje);
    setPMin(precioMin);
    setPMax(precioMax);
    setOpen(true);
  }

  function applyFilters() {
    const params = new URLSearchParams(baseParams);
    if (disc)            params.set("seccion",         disc);
    if (tipo)            params.set("tipo",            tipo);
    if (cond)            params.set("condicion",       cond);
    if (marca)           params.set("marca",           marca);
    if (ciudad)          params.set("ciudad",          ciudad);
    if (subtipo)         params.set("subtipo",         subtipo);
    if (anio)            params.set("anio",            anio);
    if (tamanio)         params.set("tamanio",         tamanio);
    if (referencia)      params.set("referencia",      referencia);
    if (largoLineas)     params.set("largoLineas",     largoLineas);
    if (incluyeBarra)    params.set("incluyeBarra",    incluyeBarra);
    if (incluyeMaleta)   params.set("incluyeMaleta",   incluyeMaleta);
    if (incluyeLeash)    params.set("incluyeLeash",    incluyeLeash);
    if (sinReparaciones) params.set("sinReparaciones", sinReparaciones);
    if (conPeritaje)     params.set("conPeritaje",     conPeritaje);
    if (pMin)            params.set("precioMin",       pMin);
    if (pMax)            params.set("precioMax",       pMax);
    router.push(`/equipos?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    setDisc(""); setTipo(""); setCond(""); setMarca(""); setCiudad("");
    setSubtipo(""); setAnio(""); setTamanio(""); setReferencia(""); setLargoLineas("");
    setIncluyeBarra(""); setIncluyeMaleta(""); setIncluyeLeash("");
    setSinReparaciones(""); setConPeritaje("");
    setPMin(""); setPMax("");
  }

  function toggle(current: string, value: string, setter: (v: string) => void) {
    setter(current === value ? "" : value);
  }

  function getToggleState(key: string): string {
    if (key === "incluyeBarra")    return incluyeBarra;
    if (key === "incluyeMaleta")   return incluyeMaleta;
    if (key === "incluyeLeash")    return incluyeLeash;
    if (key === "sinReparaciones") return sinReparaciones;
    return "";
  }

  function setToggleState(key: string, value: string) {
    if (key === "incluyeBarra")         setIncluyeBarra(value);
    else if (key === "incluyeMaleta")   setIncluyeMaleta(value);
    else if (key === "incluyeLeash")    setIncluyeLeash(value);
    else if (key === "sinReparaciones") setSinReparaciones(value);
  }

  function getOffLabel(key: string) {
    if (key === "sinReparaciones") return "Con reparaciones";
    if (key === "incluyeBarra")    return "Sin barra";
    if (key === "incluyeMaleta")   return "Sin maleta";
    if (key === "incluyeLeash")    return "Sin leash";
    return "No";
  }

  const subtipoFilter = smartConfig?.linkFilters.find(f => f.kind === "subtipo") as
    | { kind: "subtipo"; label: string; options: { value: string; label: string }[] }
    | undefined;
  const toggleFilters = (smartConfig?.linkFilters.filter(f => f.kind === "toggle") ?? []) as
    { kind: "toggle"; key: string; label: string; onLabel: string }[];
  const hasLargoLineas = smartConfig?.textFilters.includes("largoLineas") ?? false;

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

              {/* Subtipo (filtro inteligente) */}
              {subtipoFilter && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">{subtipoFilter.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {subtipoFilter.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => toggle(subtipo, opt.value, setSubtipo)}
                        className={`${chipBase} ${subtipo === opt.value ? chipBlueActive : chipInactive}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Peritaje */}
              {isKiteCometa && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#3B82F6]" /> Peritaje
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(["", "si", "no"] as const).map((val) => (
                      <button
                        key={val}
                        onClick={() => setConPeritaje(val)}
                        className={`${chipBase} ${conPeritaje === val ? chipBlueActive : chipInactive}`}
                      >
                        {val === "" ? "Todas" : val === "si" ? "Con peritaje" : "Sin peritaje"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggles inteligentes (barra, maleta, leash, reparaciones) */}
              {toggleFilters.map((f) => {
                const val = getToggleState(f.key);
                return (
                  <div key={f.key}>
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">{f.label}</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "",    label: "Todas" },
                        { value: "si",  label: f.onLabel },
                        { value: "no",  label: getOffLabel(f.key) },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setToggleState(f.key, opt.value)}
                          className={`${chipBase} ${val === opt.value ? chipBlueActive : chipInactive}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Año */}
              {top10Years.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Año</h3>
                  <div className="flex flex-wrap gap-2">
                    {top10Years.map((y) => (
                      <button
                        key={y.name}
                        onClick={() => toggle(anio, y.name, setAnio)}
                        className={`${chipBase} ${anio === y.name ? chipBlueActive : chipInactive}`}
                      >
                        {y.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tamaño */}
              {top10Sizes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Tamaño</h3>
                  <div className="flex flex-wrap gap-2">
                    {top10Sizes.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => toggle(tamanio, s.name, setTamanio)}
                        className={`${chipBase} ${tamanio === s.name ? chipBlueActive : chipInactive}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Referencia */}
              {top5Referencias.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Referencia</h3>
                  <div className="flex flex-wrap gap-2">
                    {top5Referencias.map((r) => (
                      <button
                        key={r.name}
                        onClick={() => toggle(referencia, r.name, setReferencia)}
                        className={`${chipBase} ${referencia === r.name ? chipBlueActive : chipInactive}`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Largo de líneas */}
              {hasLargoLineas && (
                <div>
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Largo de líneas (m)</h3>
                  <input
                    type="number"
                    value={largoLineas}
                    onChange={(e) => setLargoLineas(e.target.value)}
                    placeholder="Ej: 24"
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              )}

              {/* Ciudad */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Ciudad</h3>
                {top5Cities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {top5Cities.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => toggle(ciudad, c.name, setCiudad)}
                        className={`${chipBase} ${ciudad === c.name ? chipActive : chipInactive}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Otra ciudad..."
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

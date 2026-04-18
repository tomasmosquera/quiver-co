"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";

/* ─── Tipos ─── */

export interface Repair {
  description: string;
  imageUrl?: string;
}

export interface KiteMetadata {
  reference?: string;
  complement?: string;
  year?: string;
  color?: string;
  includesBar?: boolean;
  barBrand?: string;
  barReference?: string;
  barYear?: string;
  lineLength?: string;
  includesBag?: boolean;
  hasRepairs?: boolean;
  repairs?: Repair[];
}

/* ─── Constantes ─── */

const KITE_BRANDS = [
  "Airush", "Cabrinha", "Core", "Duotone", "Eleveight",
  "F-One", "Flysurfer", "Harlem Kitesurfing", "Naish", "North Kiteboarding",
  "Ocean Rodeo", "Ozone", "Reedin", "Slingshot", "Switch Kites",
];

const WING_BRANDS = [
  "Airush", "Cabrinha", "Core", "Duotone", "F-One",
  "Flysurfer", "Naish", "North", "Ozone", "Reedin", "Slingshot",
];

const KITE_SIZES = [
  "4", "5", "6", "7", "8", "9", "10", "11", "12",
  "13", "14", "15", "16", "17", "18",
];

const WING_SIZES = [
  "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8",
];

// Cometas de kitefoil: rangos amplios, se usan cometas grandes en viento ligero
const KITEFOIL_SIZES = [
  "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "21",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2000 + 1 }, (_, i) => String(CURRENT_YEAR - i));

const COLORS: { label: string; hex: string }[] = [
  { label: "Blanco",    hex: "#FFFFFF" },
  { label: "Negro",     hex: "#111111" },
  { label: "Gris",      hex: "#9CA3AF" },
  { label: "Rojo",      hex: "#EF4444" },
  { label: "Naranja",   hex: "#F97316" },
  { label: "Amarillo",  hex: "#EAB308" },
  { label: "Verde",     hex: "#22C55E" },
  { label: "Azul",      hex: "#3B82F6" },
  { label: "Azul marino",hex: "#1E3A8A" },
  { label: "Morado",    hex: "#A855F7" },
  { label: "Rosa",      hex: "#EC4899" },
  { label: "Turquesa",  hex: "#06B6D4" },
  { label: "Marrón",    hex: "#92400E" },
  { label: "Dorado",    hex: "#CA8A04" },
  { label: "Multicolor",hex: "multicolor" },
];

interface Props {
  brand: string;
  size: string;
  meta: KiteMetadata;
  onBrandChange: (v: string) => void;
  onSizeChange: (v: string) => void;
  onMetaChange: (m: KiteMetadata) => void;
  mode?: "kite" | "wing" | "kitefoil";
}

/* ─── Color Picker custom ─── */

function ColorDot({ hex, size = 5 }: { hex: string; size?: number }) {
  return (
    <span
      className={`inline-block w-${size} h-${size} rounded-full border border-[#D1D5DB] shrink-0`}
      style={
        hex === "multicolor"
          ? { background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }
          : { backgroundColor: hex }
      }
    />
  );
}

function ColorPicker({
  value, onChange, colorRef, open, setOpen,
}: {
  value?: string;
  onChange: (v: string) => void;
  colorRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const selected = COLORS.find(c => c.label === value);
  return (
    <div ref={colorRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm bg-white hover:border-[#3B82F6] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-colors"
      >
        {selected
          ? <><ColorDot hex={selected.hex} /><span className="text-[#111827]">{selected.label}</span></>
          : <span className="text-[#9CA3AF]">Seleccionar color</span>
        }
        <svg className="ml-auto w-4 h-4 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-52 overflow-y-auto py-1">
            {value && (
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#9CA3AF] hover:bg-[#F9FAFB]"
              >
                — Sin color seleccionado
              </button>
            )}
            {COLORS.map(c => (
              <button
                key={c.label}
                type="button"
                onClick={() => { onChange(c.label); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  value === c.label ? "bg-blue-50 text-[#3B82F6] font-semibold" : "text-[#374151] hover:bg-[#F9FAFB]"
                }`}
              >
                <ColorDot hex={c.hex} />
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KiteFields({
  brand, size, meta, onBrandChange, onSizeChange, onMetaChange, mode = "kite",
}: Props) {
  const isWing     = mode === "wing";
  const isKitefoil = mode === "kitefoil";
  const BRANDS = isWing ? WING_BRANDS : KITE_BRANDS;
  const SIZES  = isWing ? WING_SIZES : isKitefoil ? KITEFOIL_SIZES : KITE_SIZES;
  const [customSize, setCustomSize] = useState(
    size && !SIZES.includes(size.replace("m", "")) ? size : ""
  );
  const [useCustomSize, setUseCustomSize] = useState(
    !!size && !SIZES.includes(size.replace("m", ""))
  );
  const [uploadingRepairImg, setUploadingRepairImg] = useState<number | null>(null);
  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function setMeta(patch: Partial<KiteMetadata>) {
    onMetaChange({ ...meta, ...patch });
  }

  function handleSizeSelect(val: string) {
    if (val === "otro") {
      setUseCustomSize(true);
      onSizeChange(customSize ? `${customSize}m` : "");
    } else {
      setUseCustomSize(false);
      onSizeChange(`${val}m`);
    }
  }

  function handleCustomSize(val: string) {
    setCustomSize(val);
    onSizeChange(val ? `${val}m` : "");
  }

  function selectedSize() {
    if (useCustomSize) return "otro";
    const num = size?.replace("m", "");
    return SIZES.includes(num) ? num : "";
  }

  /* Reparaciones */
  function addRepair() {
    const repairs = [...(meta.repairs ?? []), { description: "", imageUrl: undefined }];
    setMeta({ repairs });
  }

  function updateRepair(i: number, patch: Partial<Repair>) {
    const repairs = (meta.repairs ?? []).map((r, idx) => idx === i ? { ...r, ...patch } : r);
    setMeta({ repairs });
  }

  function removeRepair(i: number) {
    const repairs = (meta.repairs ?? []).filter((_, idx) => idx !== i);
    setMeta({ repairs });
  }

  async function uploadRepairImage(i: number, file: File) {
    setUploadingRepairImg(i);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) updateRepair(i, { imageUrl: data.url });
    setUploadingRepairImg(null);
  }

  return (
    <div className="space-y-5 pt-1">

      {/* Marca */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Marca *</label>
        <select
          value={BRANDS.includes(brand) ? brand : (brand ? "otra" : "")}
          onChange={e => {
            if (e.target.value === "otra") onBrandChange("__otra__");
            else onBrandChange(e.target.value);
          }}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        >
          <option value="">Seleccionar marca</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          <option value="otra">Otra marca...</option>
        </select>
        {!BRANDS.includes(brand) && brand && (
          <input
            type="text"
            value={brand === "__otra__" ? "" : brand}
            onChange={e => onBrandChange(e.target.value)}
            placeholder="Escribe la marca"
            className="mt-2 w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
            autoFocus
          />
        )}
      </div>

      {/* Referencia / modelo */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Referencia / Modelo <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
        <input
          type="text"
          value={meta.reference ?? ""}
          onChange={e => setMeta({ reference: e.target.value })}
          placeholder={isWing ? "Ej: Mojo, Slick, Freeride..." : isKitefoil ? "Ej: Vegas, Naim, Enduro, Soul..." : "Ej: Switchblade, Bandit, Enduro..."}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        />
      </div>

      {/* Complemento */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Complemento <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
        <input
          type="text"
          value={meta.complement ?? ""}
          onChange={e => setMeta({ complement: e.target.value })}
          placeholder={isWing ? "Ej: Boom, Handle, Window..." : "Ej: V1, V2, Alula..."}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        />
      </div>

      {/* Tamaño */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Tamaño *</label>
        <select
          value={useCustomSize ? "otro" : (selectedSize() || "")}
          onChange={e => handleSizeSelect(e.target.value)}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        >
          <option value="">Seleccionar tamaño</option>
          {SIZES.map(s => (
            <option key={s} value={s}>{s}{isWing ? "m²" : "m"}</option>
          ))}
          <option value="otro">Otro tamaño...</option>
        </select>
        {useCustomSize && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              value={customSize}
              onChange={e => handleCustomSize(e.target.value)}
              placeholder="Ej: 19"
              min={1}
              max={30}
              className="w-32 px-4 py-2 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
            />
            <span className="text-sm text-[#6B7280]">metros</span>
          </div>
        )}
      </div>

      {/* Año */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Año *</label>
        <select
          value={meta.year ?? ""}
          onChange={e => setMeta({ year: e.target.value || undefined })}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        >
          <option value="">Seleccionar año</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Color principal <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
        <ColorPicker
          value={meta.color}
          onChange={v => setMeta({ color: v || undefined })}
          colorRef={colorRef}
          open={colorOpen}
          setOpen={setColorOpen}
        />
      </div>

      <div className="border-t border-[#F3F4F6] pt-5 space-y-4">

        {/* ¿Incluye barra y líneas? / ¿Incluye leash? */}
        <div>
          <p className="text-sm font-semibold text-[#374151] mb-2">
            {isWing ? "¿Incluye leash?" : "¿Incluye barra y líneas?"} *
          </p>
          <div className="flex gap-2">
            {[{ label: "Sí", value: true }, { label: "No", value: false }].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setMeta({ includesBar: opt.value, ...(!opt.value ? { barBrand: "", barReference: "", lineLength: "" } : {}) })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  meta.includesBar === opt.value
                    ? "border-[#3B82F6] bg-blue-50 text-[#3B82F6]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {meta.includesBar && (
          <div className="ml-8 space-y-3 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            {isWing ? (
              /* Leash details for wingfoil */
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Marca del leash <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                  <input
                    type="text"
                    value={meta.barBrand ?? ""}
                    onChange={e => setMeta({ barBrand: e.target.value })}
                    placeholder="Ej: ION, Dakine, Prolimit..."
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Tipo de leash <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                  <select
                    value={meta.lineLength ?? ""}
                    onChange={e => setMeta({ lineLength: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6] bg-white"
                  >
                    <option value="">Seleccionar</option>
                    <option value="muñeca">De muñeca</option>
                    <option value="antebrazo">De antebrazo</option>
                    <option value="arnes">De arnés</option>
                  </select>
                </div>
              </div>
            ) : (
              /* Bar + lines details for kitesurf/kitefoil */
              <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Marca de la barra <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                <input
                  type="text"
                  value={meta.barBrand ?? ""}
                  onChange={e => setMeta({ barBrand: e.target.value })}
                  placeholder="Ej: Cabrinha, Duotone..."
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Referencia / Modelo <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                <input
                  type="text"
                  value={meta.barReference ?? ""}
                  onChange={e => setMeta({ barReference: e.target.value })}
                  placeholder="Ej: Fireball, Click Bar..."
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Año de la barra <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                <select
                  value={meta.barYear ?? ""}
                  onChange={e => setMeta({ barYear: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6] bg-white"
                >
                  <option value="">Seleccionar</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Largo de las líneas <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                <select
                  value={meta.lineLength ?? ""}
                  onChange={e => setMeta({ lineLength: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6] bg-white"
                >
                  <option value="">Seleccionar</option>
                  {["18m", "20m", "22m", "24m", "26m", "27m", "Mixtas", "Otro"].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* ¿Incluye maleta? — no aplica para wing */}
        {!isWing && <div>
          <p className="text-sm font-semibold text-[#374151] mb-2">¿Incluye maleta? *</p>
          <div className="flex gap-2">
            {[{ label: "Sí", value: true }, { label: "No", value: false }].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setMeta({ includesBag: opt.value })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  meta.includesBag === opt.value
                    ? "border-[#3B82F6] bg-blue-50 text-[#3B82F6]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>}

        {/* ¿Tiene reparaciones? */}
        <div>
          <p className="text-sm font-semibold text-[#374151] mb-2">¿Tiene reparaciones? *</p>
          <div className="flex gap-2">
            {[{ label: "Sí", value: true }, { label: "No", value: false }].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setMeta({
                  hasRepairs: opt.value,
                  ...(opt.value ? { repairs: meta.repairs?.length ? meta.repairs : [{ description: "" }] } : { repairs: [] }),
                })}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  meta.hasRepairs === opt.value
                    ? "border-[#3B82F6] bg-blue-50 text-[#3B82F6]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {meta.hasRepairs && (
          <div className="ml-8 space-y-3">
            {(meta.repairs ?? []).map((repair, i) => (
              <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700">Reparación {i + 1}</span>
                  {(meta.repairs ?? []).length > 1 && (
                    <button type="button" onClick={() => removeRepair(i)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={repair.description}
                  onChange={e => updateRepair(i, { description: e.target.value })}
                  placeholder="Describe la reparación (zona, tipo de daño, cómo fue reparada...)"
                  rows={2}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-white resize-none"
                />
                {/* Foto de la reparación */}
                {repair.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-amber-200">
                    <img src={repair.imageUrl} alt="Reparación" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => updateRepair(i, { imageUrl: undefined })}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 text-xs text-amber-600 cursor-pointer hover:text-amber-800 w-fit">
                    {uploadingRepairImg === i
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <ImagePlus className="w-4 h-4" />
                    }
                    {uploadingRepairImg === i ? "Subiendo..." : "Agregar foto (opcional)"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && uploadRepairImage(i, e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addRepair}
              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              <Plus className="w-4 h-4" /> Agregar otra reparación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

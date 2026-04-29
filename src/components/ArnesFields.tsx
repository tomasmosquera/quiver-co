"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X, Loader2, ImagePlus } from "lucide-react";
import { isUploadCancelledError, uploadAsset } from "@/lib/clientUpload";

/* ─── Tipos ─── */

export interface Repair {
  description: string;
  imageUrl?: string;
}

export interface ArnesMetadata {
  arnesType?: string;
  reference?: string;
  complement?: string;
  year?: string;
  color?: string;
  hasRepairs?: boolean;
  repairs?: Repair[];
}

/* ─── Constantes ─── */

export const ARNES_TYPES = [
  { value: "cintura", label: "Cintura" },
  { value: "asiento", label: "Asiento" },
];

const ARNES_BRANDS = [
  "Airush", "Brunotti", "Cabrinha", "Dakine", "Duotone", "ION",
  "Manera", "Mystic", "Naish", "North Kiteboarding",
  "Ozone", "Prolimit", "Ride Engine", "Slingshot", "Watery",
];

const KITEFOIL_ARNES_BRANDS = [
  "Cabrinha", "Dakine", "Duotone", "ION",
  "Manera", "Mystic", "North", "Prolimit", "Ride Engine",
];

const WINGFOIL_ARNES_BRANDS = [
  "Dakine", "Duotone", "ION", "Manera", "Mystic", "North", "Prolimit", "Ride Engine",
];

const ARNES_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KITEFOIL_ARNES_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WINGFOIL_ARNES_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2000 + 1 }, (_, i) => String(CURRENT_YEAR - i));

const COLORS: { label: string; hex: string }[] = [
  { label: "Blanco",     hex: "#FFFFFF" },
  { label: "Negro",      hex: "#111111" },
  { label: "Gris",       hex: "#9CA3AF" },
  { label: "Rojo",       hex: "#EF4444" },
  { label: "Naranja",    hex: "#F97316" },
  { label: "Amarillo",   hex: "#EAB308" },
  { label: "Verde",      hex: "#22C55E" },
  { label: "Azul",       hex: "#3B82F6" },
  { label: "Azul marino",hex: "#1E3A8A" },
  { label: "Morado",     hex: "#A855F7" },
  { label: "Rosa",       hex: "#EC4899" },
  { label: "Turquesa",   hex: "#06B6D4" },
  { label: "Marrón",     hex: "#92400E" },
  { label: "Dorado",     hex: "#CA8A04" },
  { label: "Multicolor", hex: "multicolor" },
];

interface Props {
  brand: string;
  size: string;
  meta: ArnesMetadata;
  onBrandChange: (v: string) => void;
  onSizeChange: (v: string) => void;
  onMetaChange: (m: ArnesMetadata) => void;
  discipline?: string;
}

/* ─── Color Picker ─── */

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
              <button type="button" onClick={() => { onChange(""); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#9CA3AF] hover:bg-[#F9FAFB]">
                — Sin color seleccionado
              </button>
            )}
            {COLORS.map(c => (
              <button key={c.label} type="button" onClick={() => { onChange(c.label); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${value === c.label ? "bg-blue-50 text-[#3B82F6] font-semibold" : "text-[#374151] hover:bg-[#F9FAFB]"}`}>
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

export default function ArnesFields({
  brand, size, meta, onBrandChange, onSizeChange, onMetaChange, discipline,
}: Props) {
  const isKitefoil = discipline === "KITEFOIL";
  const isWingfoil = discipline === "WINGFOIL";
  const BRANDS = isKitefoil ? KITEFOIL_ARNES_BRANDS : isWingfoil ? WINGFOIL_ARNES_BRANDS : ARNES_BRANDS;
  const SIZES  = isKitefoil ? KITEFOIL_ARNES_SIZES  : isWingfoil ? WINGFOIL_ARNES_SIZES  : ARNES_SIZES;
  const refPlaceholder = isKitefoil
    ? "Ej: Warrior Foil, Apex, C2..."
    : isWingfoil
    ? "Ej: Sonic, Apex, Radar, Vega..."
    : "Ej: Warrior, Razor, Roam...";
  const [uploadingRepairImg, setUploadingRepairImg] = useState<number | null>(null);
  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const repairUploadControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => () => repairUploadControllerRef.current?.abort(), []);

  function setMeta(patch: Partial<ArnesMetadata>) {
    onMetaChange({ ...meta, ...patch });
  }

  function addRepair() {
    setMeta({ repairs: [...(meta.repairs ?? []), { description: "" }] });
  }
  function updateRepair(i: number, patch: Partial<Repair>) {
    setMeta({ repairs: (meta.repairs ?? []).map((r, idx) => idx === i ? { ...r, ...patch } : r) });
  }
  function removeRepair(i: number) {
    setMeta({ repairs: (meta.repairs ?? []).filter((_, idx) => idx !== i) });
  }
  async function uploadRepairImage(i: number, file: File) {
    const controller = new AbortController();
    repairUploadControllerRef.current = controller;
    setUploadingRepairImg(i);
    try {
      const url = await uploadAsset(file, {
        profile: "repair",
        signal: controller.signal,
      });
      updateRepair(i, { imageUrl: url });
    } catch (error) {
      if (!isUploadCancelledError(error)) {
        console.error(error);
      }
    } finally {
      if (repairUploadControllerRef.current === controller) {
        repairUploadControllerRef.current = null;
      }
      setUploadingRepairImg(null);
    }
  }

  function cancelRepairUpload() {
    repairUploadControllerRef.current?.abort();
  }

  return (
    <div className="space-y-5 pt-1">

      {/* Tipo */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Tipo *</label>
        <select
          value={meta.arnesType ?? ""}
          onChange={e => setMeta({ arnesType: e.target.value || undefined })}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        >
          <option value="">Seleccionar tipo</option>
          {ARNES_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

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

      {/* Referencia / Modelo */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Referencia / Modelo <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
        <input
          type="text"
          value={meta.reference ?? ""}
          onChange={e => setMeta({ reference: e.target.value })}
          placeholder={refPlaceholder}
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
          placeholder="Ej: con spreader bar, sin gancho..."
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        />
      </div>

      {/* Talla */}
      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Talla *</label>
        <select
          value={size}
          onChange={e => onSizeChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
        >
          <option value="">Seleccionar talla</option>
          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
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
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
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
          <div className="space-y-3">
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
                  placeholder="Describe la reparación..."
                  rows={2}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-white resize-none"
                />
                {repair.imageUrl ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-amber-200">
                    <img src={repair.imageUrl} alt="Reparación" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => updateRepair(i, { imageUrl: undefined })}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : uploadingRepairImg === i ? (
                  <button
                    type="button"
                    onClick={cancelRepairUpload}
                    className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelar subida
                  </button>
                ) : (
                  <label className={`flex items-center gap-2 text-xs w-fit ${uploadingRepairImg !== null ? "cursor-not-allowed text-amber-400" : "cursor-pointer text-amber-600 hover:text-amber-800"}`}>
                    <ImagePlus className="w-4 h-4" />
                    Agregar foto (opcional)
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingRepairImg !== null}
                      onChange={(e) => {
                        if (e.target.files?.[0]) uploadRepairImage(i, e.target.files[0]);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            ))}
            <button type="button" onClick={addRepair}
              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-800 font-medium">
              <Plus className="w-4 h-4" /> Agregar otra reparación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

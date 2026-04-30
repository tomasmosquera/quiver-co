"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Loader2, Trash2 } from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import KiteFields, { KiteMetadata } from "@/components/KiteFields";
import BoardFields, { BoardMetadata, BOARD_TYPES } from "@/components/BoardFields";
import BarraFields, { BarraMetadata } from "@/components/BarraFields";
import ArnesFields, { ArnesMetadata, ARNES_TYPES } from "@/components/ArnesFields";
import CityPicker from "@/components/CityPicker";
import { uploadFiles } from "@/lib/clientUpload";

const COMING_SOON = ["WINDSURF", "WAKEBOARD", "PADDLE"];

const DISCIPLINES = [
  { value: "KITESURF",  label: "Kitesurf",   emoji: "🪁" },
  { value: "KITEFOIL",  label: "Kitefoil",   emoji: "🚀" },
  { value: "WINGFOIL",  label: "Wingfoil",   emoji: "🪽" },
  { value: "WATERWEAR", label: "Accesorios", emoji: "🎒" },
  { value: "WINDSURF",  label: "Windsurf",   emoji: "⛵" },
  { value: "WAKEBOARD", label: "Wakeboard",  emoji: "🚤" },
  { value: "PADDLE",    label: "Paddle",     emoji: "🧘" },
];

const EQUIPMENT_TYPES_BY_DISCIPLINE: Record<string, { value: string; label: string }[]> = {
  KITESURF: [
    { value: "COMETA",       label: "Cometa" },
    { value: "TABLA",        label: "Tabla" },
    { value: "BARRA_LINEAS", label: "Barra & Líneas" },
    { value: "ARNES",        label: "Arnés" },
  ],
  KITEFOIL: [
    { value: "COMETA",       label: "Cometa" },
    { value: "TABLA",        label: "Tabla" },
    { value: "BARRA_LINEAS", label: "Barra & Líneas" },
    { value: "ARNES",        label: "Arnés" },
  ],
  WINGFOIL: [
    { value: "WING",  label: "Wing" },
    { value: "TABLA", label: "Tabla" },
    { value: "LEASH", label: "Leash" },
    { value: "ARNES", label: "Arnés" },
  ],
  WATERWEAR: [
    { value: "ACC_COMETA", label: "Accesorios de cometa" },
    { value: "ACC_WING",   label: "Accesorios de wing" },
    { value: "ACC_BARRA",  label: "Accesorios de barra" },
    { value: "ACC_TABLA",  label: "Accesorios de tabla" },
    { value: "ACC_ARNES",  label: "Accesorios de arnés" },
    { value: "BOMBAS",     label: "Bombas" },
    { value: "MALETAS",    label: "Maletas y bolsas" },
    { value: "WETSUIT",    label: "Wetsuits" },
    { value: "PONCHO",     label: "Ponchos y Toallas" },
    { value: "PROTECCION", label: "Protección" },
    { value: "TECNOLOGIA", label: "Tecnología" },
    { value: "OTROS",      label: "Otros" },
  ],
  _DEFAULT: [
    { value: "COMETA",       label: "Cometa" },
    { value: "TABLA",        label: "Tabla" },
    { value: "BARRA_LINEAS", label: "Barra & Líneas" },
    { value: "FOIL",         label: "Foil" },
    { value: "ARNES",        label: "Arnés" },
    { value: "TRAJE",        label: "Traje" },
    { value: "ACCESORIO",    label: "Accesorio" },
    { value: "COMBO",        label: "Combo completo" },
  ],
};

const CONDITIONS = [
  { value: "NUEVO",     label: "Nuevo",      desc: "Sin uso, con etiquetas o caja original" },
  { value: "COMO_NUEVO",label: "Como nuevo", desc: "Usado pocas veces, sin daños visibles" },
  { value: "USADO",     label: "Usado",      desc: "Uso normal, puede tener marcas de uso" },
];

const WATERWEAR_BRAND_PLACEHOLDERS: Record<string, string> = {
  ACC_COMETA: "Ej: Cabrinha, Ozone, Duotone...",
  ACC_WING:   "Ej: Duotone, ION, F-One...",
  ACC_BARRA:  "Ej: Duotone, North, Cabrinha...",
  ACC_TABLA:  "Ej: Cabrinha, Slingshot, Hulu...",
  ACC_ARNES:  "Ej: Ride Engine, Mystic, Dakine...",
  BOMBAS:     "Ej: Cabrinha, Duotone, Ozone...",
  MALETAS:    "Ej: Cogua, Duotone, Cabrinha...",
  WETSUIT:    "Ej: ION, Manera, Prolimit, Mystic...",
  PONCHO:     "Ej: Prolimit, Mystic, ION...",
  PROTECCION: "Ej: Mystic, ION, Prolimit...",
  TECNOLOGIA: "Ej: Woo, Weatherflow, GoPro...",
  OTROS:      "Ej: Cabrinha, Airush, Duotone...",
};

interface InitialData {
  discipline: string;
  equipmentType: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: string;
  currency: string;
  description: string;
  city: string;
  images: string[];
  metadata: KiteMetadata & BoardMetadata & BarraMetadata & ArnesMetadata & { accesorioType?: string };
}

interface Props {
  listingId: string;
  initial: InitialData;
}

export default function EditForm({ listingId, initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [department, setDepartment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const uploadControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => uploadControllerRef.current?.abort(), []);

  const KITE_DISCIPLINES = ["KITESURF", "KITEFOIL", "WINDSURF"];
  const isWing        = form.discipline === "WINGFOIL" && form.equipmentType === "WING";
  const isLeash       = form.discipline === "WINGFOIL" && form.equipmentType === "LEASH";
  const isKiteCometa  = KITE_DISCIPLINES.includes(form.discipline) && form.equipmentType === "COMETA";
  const isKiteTabla   = (KITE_DISCIPLINES.includes(form.discipline) || form.discipline === "WINGFOIL") && form.equipmentType === "TABLA";
  const isKiteBarra   = KITE_DISCIPLINES.includes(form.discipline) && form.equipmentType === "BARRA_LINEAS";
  const isKiteArnes   = (KITE_DISCIPLINES.includes(form.discipline) || form.discipline === "WINGFOIL") && form.equipmentType === "ARNES";
  const hasSpecialFields = isKiteCometa || isWing || isLeash || isKiteTabla || isKiteBarra || isKiteArnes;

  const equipmentTypes = EQUIPMENT_TYPES_BY_DISCIPLINE[form.discipline] ?? EQUIPMENT_TYPES_BY_DISCIPLINE._DEFAULT;

  const autoTitle = isWing
    ? [
        form.brand,
        form.metadata.reference,
        form.metadata.complement,
        form.metadata.year,
        form.size,
        form.metadata.includesBag ? "Con maleta" : "",
        form.metadata.hasRepairs !== undefined
          ? (form.metadata.hasRepairs ? "Con reparaciones" : "Sin reparaciones")
          : "",
      ].filter(Boolean).join(" ")
    : isKiteCometa
    ? [
        form.brand,
        form.metadata.reference,
        form.metadata.complement,
        form.metadata.year,
        form.size,
        form.metadata.includesBar ? "Con barra" : "",
        form.metadata.hasRepairs !== undefined
          ? (form.metadata.hasRepairs ? "Con reparaciones" : "Sin reparaciones")
          : "",
      ].filter(Boolean).join(" ")
    : isKiteTabla
    ? [
        BOARD_TYPES.find(t => t.value === form.metadata.boardType)?.label,
        form.brand,
        form.metadata.reference,
        form.metadata.complement,
        form.metadata.year,
        form.size,
      ].filter(Boolean).join(" ")
    : isKiteBarra
    ? [
        "Barra",
        form.brand,
        form.metadata.reference,
        form.metadata.complement,
        form.size,
        form.metadata.lineLength,
        form.metadata.year,
      ].filter(Boolean).join(" ")
    : isKiteArnes
    ? [
        ARNES_TYPES.find(t => t.value === form.metadata.arnesType)?.label,
        "Arnés",
        form.brand,
        form.metadata.reference,
        form.size,
        form.metadata.year,
      ].filter(Boolean).join(" ")
    : null;

  function set(key: keyof InitialData, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError("");
  }

  async function uploadImages(files: FileList) {
    const controller = new AbortController();
    uploadControllerRef.current = controller;
    setUploading(true);
    setError("");
    try {
      const { urls } = await uploadFiles(Array.from(files), {
        profile: "listing",
        signal: controller.signal,
      });
      if (urls.length > 0) {
        set("images", [...form.images, ...urls]);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudieron subir las fotos");
    } finally {
      if (uploadControllerRef.current === controller) {
        uploadControllerRef.current = null;
      }
      setUploading(false);
    }
  }

  function cancelImageUpload() {
    uploadControllerRef.current?.abort();
  }

  function validate() {
    if (!form.discipline)    return "Selecciona una disciplina";
    if (!form.equipmentType) return "Selecciona el tipo de equipo";
    if (isKiteCometa) {
      if (!form.brand.trim())                       return "Escribe la marca de la cometa";
      if (!form.size)                               return "Selecciona el tamaño";
      if (!form.metadata.year)                      return "Selecciona el año";
      if (form.metadata.includesBar === undefined)   return "Indica si incluye barra y líneas";
      if (form.metadata.includesBag === undefined)   return "Indica si incluye maleta";
      if (form.metadata.hasRepairs === undefined)    return "Indica si tiene reparaciones";
    }
    if (isWing) {
      if (!form.brand.trim())                       return "Escribe la marca del wing";
      if (!form.size)                               return "Selecciona el tamaño";
      if (!form.metadata.year)                      return "Selecciona el año";
      if (form.metadata.includesBag === undefined)   return "Indica si incluye maleta";
      if (form.metadata.hasRepairs === undefined)    return "Indica si tiene reparaciones";
    }
    if (isKiteTabla) {
      if (!form.metadata.boardType)                 return "Selecciona el tipo de tabla";
      if (!form.brand.trim())                       return "Escribe la marca de la tabla";
      if (!form.size)                               return "Selecciona el tamaño";
      if (!form.metadata.year)                      return "Selecciona el año";
      if (form.metadata.hasRepairs === undefined)    return "Indica si tiene reparaciones";
    }
    if (isLeash) {
      if (!form.brand.trim())                      return "Selecciona la marca del leash";
      if (!form.metadata.lineLength)               return "Selecciona el tipo de leash";
      if (form.metadata.hasRepairs === undefined)   return "Indica si tiene reparaciones";
    }
    if (isKiteBarra) {
      if (!form.brand.trim())                      return "Selecciona la marca de la barra";
      if (!form.size)                              return "Selecciona el tamaño de la barra";
      if (!form.metadata.year)                     return "Selecciona el año";
      if (!form.metadata.lineLength)               return "Selecciona el largo de las líneas";
      if (form.metadata.hasRepairs === undefined)   return "Indica si tiene reparaciones";
    }
    if (isKiteArnes) {
      if (!form.metadata.arnesType)                return "Selecciona el tipo de arnés";
      if (!form.brand.trim())                      return "Selecciona la marca del arnés";
      if (!form.metadata.reference?.trim())         return "Escribe la referencia / modelo";
      if (!form.size)                              return "Selecciona la talla";
      if (!form.metadata.year)                     return "Selecciona el año";
      if (form.metadata.hasRepairs === undefined)   return "Indica si tiene reparaciones";
    }
    if (!hasSpecialFields && !form.title.trim()) return "Escribe un título";
    if (!form.condition)    return "Selecciona el estado";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return "Escribe un precio válido";
    if (!form.description.trim()) return "Escribe una descripción";
    if (!form.city)         return "Selecciona tu ciudad";
    if (form.images.length === 0) return "Agrega al menos una foto";
    return "";
  }

  async function save() {
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: hasSpecialFields ? autoTitle : form.title,
          metadata: hasSpecialFields ? form.metadata : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      router.push(`/equipo/${listingId}`);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
      setSaving(false);
    }
  }

  async function deleteListing() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      router.push("/equipos");
      router.refresh();
    } catch {
      setError("No se pudo eliminar el anuncio");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/equipo/${listingId}`}
            className="text-sm text-[#6B7280] hover:text-[#111827] flex items-center gap-1 mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Volver al anuncio
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">Editar anuncio</h1>
              <p className="text-[#6B7280] text-sm mt-1">Modifica los datos de tu equipo</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
            >
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          </div>
        </div>

        {/* Modal confirmación borrar */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="font-bold text-[#111827] text-lg mb-2">¿Eliminar anuncio?</h3>
              <p className="text-sm text-[#6B7280] mb-6">
                Esta acción no se puede deshacer. El anuncio dejará de ser visible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={deleteListing}
                  disabled={deleting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6">

          {/* Disciplina */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-3">Disciplina *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DISCIPLINES.map((d) => {
                const soon = COMING_SOON.includes(d.value);
                return (
                  <button
                    key={d.value}
                    onClick={() => {
                      if (soon) return;
                      setForm(prev => ({ ...prev, discipline: d.value, equipmentType: "", metadata: {} }));
                    }}
                    disabled={soon}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      soon
                        ? "border-[#E5E7EB] bg-[#F9FAFB] cursor-not-allowed opacity-60"
                        : form.discipline === d.value
                        ? "border-[#3B82F6] bg-blue-50"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <span className={`text-xs font-semibold ${form.discipline === d.value && !soon ? "text-[#3B82F6]" : "text-[#374151]"}`}>
                      {d.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipo de equipo */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">Tipo de equipo *</label>
            <div className="grid grid-cols-2 gap-2">
              {equipmentTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => { set("equipmentType", t.value); setForm(prev => ({ ...prev, metadata: {} })); }}
                  className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                    form.equipmentType === t.value
                      ? "border-[#3B82F6] bg-blue-50 text-[#3B82F6] font-semibold"
                      : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resto de campos — solo si ya eligió tipo de equipo */}
          {form.equipmentType && <>

          {/* Cometa */}
          {isKiteCometa && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos de la cometa</p>
              <KiteFields
                brand={form.brand}
                size={form.size}
                meta={form.metadata}
                onBrandChange={v => set("brand", v)}
                onSizeChange={v => set("size", v)}
                onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                mode={form.discipline === "KITEFOIL" ? "kitefoil" : "kite"}
              />
            </div>
          )}

          {/* Wing */}
          {isWing && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos del wing</p>
              <KiteFields
                brand={form.brand}
                size={form.size}
                meta={form.metadata}
                onBrandChange={v => set("brand", v)}
                onSizeChange={v => set("size", v)}
                onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                mode="wing"
              />
            </div>
          )}

          {/* Tabla */}
          {isKiteTabla && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos de la tabla</p>
              <BoardFields
                brand={form.brand}
                size={form.size}
                meta={form.metadata}
                onBrandChange={v => set("brand", v)}
                onSizeChange={v => set("size", v)}
                onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                allowedTypes={form.discipline === "KITEFOIL" || form.discipline === "WINGFOIL" ? ["foilboard"] : undefined}
                discipline={form.discipline}
              />
            </div>
          )}

          {/* Barra & Líneas */}
          {isKiteBarra && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos de la barra</p>
              <BarraFields
                brand={form.brand}
                size={form.size}
                meta={form.metadata}
                onBrandChange={v => set("brand", v)}
                onSizeChange={v => set("size", v)}
                onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                discipline={form.discipline}
              />
            </div>
          )}

          {/* Leash */}
          {isLeash && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos del leash</p>
              <BarraFields
                brand={form.brand}
                size={form.size}
                meta={form.metadata}
                onBrandChange={v => set("brand", v)}
                onSizeChange={v => set("size", v)}
                onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                discipline="WINGFOIL"
              />
            </div>
          )}

          {/* Arnés */}
          {isKiteArnes && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos del arnés</p>
              <ArnesFields
                brand={form.brand}
                size={form.size}
                meta={form.metadata}
                onBrandChange={v => set("brand", v)}
                onSizeChange={v => set("size", v)}
                onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                discipline={form.discipline}
              />
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1">Título *</label>
            {hasSpecialFields ? (
              <div className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-[#F9FAFB] text-[#374151] min-h-[42px]">
                {autoTitle || <span className="text-[#9CA3AF]">Se genera automáticamente con los datos del equipo</span>}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
                <p className="text-xs text-[#9CA3AF] mt-1">{form.title.length}/100</p>
              </>
            )}
          </div>

          {/* Marca y talla (solo si NO tiene campos especiales) */}
          {!hasSpecialFields && (
            form.discipline === "WATERWEAR" ? (
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Marca <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={e => set("brand", e.target.value)}
                  placeholder={form.equipmentType ? WATERWEAR_BRAND_PLACEHOLDERS[form.equipmentType] ?? "Ej: Cabrinha, ION, Dakine..." : "Ej: Cabrinha, ION, Dakine..."}
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1">Marca</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={e => set("brand", e.target.value)}
                    placeholder="Ej: Cabrinha, Duotone..."
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#374151] mb-1">Talla / Tamaño</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={e => set("size", e.target.value)}
                    placeholder="Ej: 12m, 142cm, M..."
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  />
                </div>
              </div>
            )
          )}

          {/* Estado */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">Estado *</label>
            <div className="space-y-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => set("condition", c.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    form.condition === c.value
                      ? "border-[#3B82F6] bg-blue-50"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                    form.condition === c.value ? "border-[#3B82F6] bg-[#3B82F6]" : "border-[#D1D5DB]"
                  }`} />
                  <div>
                    <p className={`text-sm font-semibold ${form.condition === c.value ? "text-[#3B82F6]" : "text-[#111827]"}`}>
                      {c.label}
                    </p>
                    <p className="text-xs text-[#6B7280]">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1">Precio *</label>
            <div className="flex gap-2">
              <div className="flex rounded-xl border border-[#D1D5DB] overflow-hidden shrink-0">
                {["COP", "USD"].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("currency", c)}
                    className={`px-4 py-2.5 text-sm font-semibold transition-colors ${form.currency === c ? "bg-[#111827] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">$</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => set("price", e.target.value)}
                  onWheel={e => (e.target as HTMLInputElement).blur()}
                  min={0}
                  className="w-full pl-8 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
            {form.currency === "USD" && (
              <p className="text-xs text-blue-600 mt-1.5">El precio en USD se mostrará con el equivalente aproximado en COP según la TRM del día.</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1">Descripción *</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] resize-none"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">{form.description.length}/1000</p>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1">Ciudad *</label>
            <CityPicker
              city={form.city}
              department={department}
              onCityChange={v => set("city", v)}
              onDepartmentChange={setDepartment}
            />
          </div>

          {/* Fotos */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">
              Fotos * <span className="text-[#9CA3AF] font-normal">— La primera es la foto principal. Arrastra para reordenar.</span>
            </label>
            <PhotoUploader
              images={form.images}
              onChange={urls => set("images", urls)}
              uploading={uploading}
              onUpload={uploadImages}
              onCancelUpload={cancelImageUpload}
            />
          </div>

          </>}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Link
              href={`/equipo/${listingId}`}
              className="px-5 py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancelar
            </Link>
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Guardar cambios</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

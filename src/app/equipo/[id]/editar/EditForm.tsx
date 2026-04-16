"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Loader2, Trash2 } from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import KiteFields, { KiteMetadata } from "@/components/KiteFields";

const DISCIPLINES = [
  { value: "KITESURF",  label: "Kitesurf",  emoji: "🪁" },
  { value: "WINGFOIL",  label: "Wingfoil",  emoji: "🪽" },
  { value: "WINDSURF",  label: "Windsurf",  emoji: "⛵" },
  { value: "FOILBOARD", label: "Foilboard", emoji: "🏄" },
  { value: "KITEFOIL",  label: "Kitefoil",  emoji: "🚀" },
  { value: "WAKEBOARD", label: "Wakeboard", emoji: "🚤" },
  { value: "PADDLE",    label: "Paddle",    emoji: "🧘" },
];

const EQUIPMENT_TYPES_BY_DISCIPLINE: Record<string, { value: string; label: string }[]> = {
  KITESURF: [
    { value: "COMETA_WING", label: "Cometa" },
    { value: "TABLA",       label: "Tabla" },
    { value: "BARRA_LINEAS",label: "Barra & Líneas" },
    { value: "ARNES",       label: "Arnés" },
    { value: "ACCESORIO",   label: "Accesorios" },
    { value: "COMBO",       label: "Equipo Completo" },
  ],
  _DEFAULT: [
    { value: "COMETA_WING", label: "Cometa" },
    { value: "TABLA",       label: "Tabla" },
    { value: "BARRA_LINEAS",label: "Barra & Líneas" },
    { value: "FOIL",        label: "Foil" },
    { value: "ARNES",       label: "Arnés" },
    { value: "TRAJE",       label: "Traje" },
    { value: "ACCESORIO",   label: "Accesorio" },
    { value: "COMBO",       label: "Combo completo" },
  ],
};

const CONDITIONS = [
  { value: "NUEVO",     label: "Nuevo",      desc: "Sin uso, con etiquetas o caja original" },
  { value: "COMO_NUEVO",label: "Como nuevo", desc: "Usado pocas veces, sin daños visibles" },
  { value: "USADO",     label: "Usado",      desc: "Uso normal, puede tener marcas de uso" },
];

const CITIES = [
  "Cartagena", "Santa Marta", "Barranquilla", "Bogotá", "Medellín",
  "Cali", "San Andrés", "Coveñas", "Tolú", "Buenaventura", "Otra",
];

interface InitialData {
  discipline: string;
  equipmentType: string;
  title: string;
  brand: string;
  size: string;
  condition: string;
  price: string;
  description: string;
  city: string;
  images: string[];
  metadata: KiteMetadata;
}

interface Props {
  listingId: string;
  initial: InitialData;
}

export default function EditForm({ listingId, initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isKiteCometa = form.discipline === "KITESURF" && form.equipmentType === "COMETA_WING";
  const equipmentTypes = EQUIPMENT_TYPES_BY_DISCIPLINE[form.discipline] ?? EQUIPMENT_TYPES_BY_DISCIPLINE._DEFAULT;

  function set(key: keyof InitialData, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError("");
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    set("images", [...form.images, ...urls]);
    setUploading(false);
  }

  function validate() {
    if (!form.discipline)   return "Selecciona una disciplina";
    if (!form.equipmentType) return "Selecciona el tipo de equipo";
    if (!form.title.trim()) return "Escribe un título";
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
          metadata: isKiteCometa ? form.metadata : undefined,
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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {DISCIPLINES.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setForm(prev => ({ ...prev, discipline: d.value, equipmentType: "", metadata: {} }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    form.discipline === d.value
                      ? "border-[#3B82F6] bg-blue-50"
                      : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                  }`}
                >
                  <span className={`text-xs font-semibold ${form.discipline === d.value ? "text-[#3B82F6]" : "text-[#374151]"}`}>
                    {d.label}
                  </span>
                </button>
              ))}
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

          {/* Campos específicos de kite+cometa */}
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
              />
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-1">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              maxLength={100}
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">{form.title.length}/100</p>
          </div>

          {/* Marca y talla (solo si NO es kite+cometa) */}
          {!isKiteCometa && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Marca</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={e => set("brand", e.target.value)}
                  placeholder="Ej: Cabrinha..."
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Talla / Tamaño</label>
                <input
                  type="text"
                  value={form.size}
                  onChange={e => set("size", e.target.value)}
                  placeholder="Ej: 12m, 142cm..."
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
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
            <label className="block text-sm font-semibold text-[#374151] mb-1">Precio (COP) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">$</span>
              <input
                type="number"
                value={form.price}
                onChange={e => set("price", e.target.value)}
                min={0}
                className="w-full pl-8 pr-16 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs">COP</span>
            </div>
            {form.price && !isNaN(Number(form.price)) && (
              <p className="text-xs text-[#6B7280] mt-1">${Number(form.price).toLocaleString("es-CO")} COP</p>
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
            <select
              value={form.city}
              onChange={e => set("city", e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] bg-white"
            >
              <option value="">Selecciona tu ciudad</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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

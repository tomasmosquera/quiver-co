"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wind, ChevronRight, ChevronLeft,
  CheckCircle, Loader2,
} from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import KiteFields, { KiteMetadata } from "@/components/KiteFields";

/* ─── Constantes ─── */

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

const STEPS = ["Disciplina", "Detalles", "Fotos", "Confirmar"];

/* ─── Tipos ─── */

interface FormData {
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

const EMPTY: FormData = {
  discipline: "", equipmentType: "", title: "", brand: "",
  size: "", condition: "", price: "", description: "", city: "", images: [],
  metadata: {},
};

/* ─── Componente ─── */

export default function VenderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return null;

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Wind className="w-10 h-10 text-[#3B82F6]" />
        <h1 className="text-2xl font-bold text-[#111827]">Inicia sesión para publicar</h1>
        <p className="text-[#6B7280]">Necesitas una cuenta para vender en Quiver Co.</p>
        <Link href="/login" className="px-6 py-3 bg-[#111827] text-white rounded-xl font-semibold hover:bg-[#374151] transition-colors">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const isKiteCometa = form.discipline === "KITESURF" && form.equipmentType === "COMETA_WING";
  const equipmentTypes = EQUIPMENT_TYPES_BY_DISCIPLINE[form.discipline] ?? EQUIPMENT_TYPES_BY_DISCIPLINE._DEFAULT;

  const autoTitle = isKiteCometa
    ? [
        form.brand,
        form.metadata.reference,
        form.metadata.year,
        form.size,
        form.metadata.hasRepairs !== undefined
          ? (form.metadata.hasRepairs ? "Con reparaciones" : "Sin reparaciones")
          : "",
      ].filter(Boolean).join(" ")
    : null;

  function set(key: keyof FormData, value: string | string[]) {
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

  function validateStep() {
    if (step === 0 && !form.discipline) return "Selecciona una disciplina";
    if (step === 1) {
      if (!form.equipmentType) return "Selecciona el tipo de equipo";
      if (isKiteCometa) {
        if (!form.brand.trim())             return "Escribe la marca de la cometa";
        if (!form.metadata.reference?.trim()) return "Escribe la referencia / modelo";
        if (!form.size)                     return "Selecciona el tamaño";
      }
      if (!isKiteCometa && !form.title.trim()) return "Escribe un título";
      if (!form.condition)     return "Selecciona el estado del equipo";
      if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return "Escribe un precio válido";
      if (!form.description.trim()) return "Escribe una descripción";
      if (!form.city)          return "Selecciona tu ciudad";
    }
    if (step === 2 && form.images.length === 0) return "Agrega al menos una foto";
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setStep(s => s + 1);
    setError("");
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          title: isKiteCometa ? autoTitle : form.title,
          metadata: isKiteCometa ? form.metadata : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al publicar");
      router.push(`/equipo/${data.listing.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al publicar");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-[#6B7280] hover:text-[#111827] flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Publicar equipo</h1>
          <p className="text-[#6B7280] text-sm mt-1">Completa los datos de tu equipo para publicarlo</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i < step ? "bg-[#3B82F6] text-white" :
                i === step ? "bg-[#111827] text-white" :
                "bg-[#E5E7EB] text-[#9CA3AF]"
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? "text-[#111827] font-semibold" : "text-[#9CA3AF]"}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[#E5E7EB]" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">

          {/* ── Paso 0: Disciplina ── */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">¿Qué disciplina?</h2>
              <p className="text-sm text-[#6B7280] mb-6">Selecciona el deporte al que pertenece el equipo</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DISCIPLINES.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setForm(prev => ({ ...prev, discipline: d.value, equipmentType: "", metadata: {} }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      form.discipline === d.value
                        ? "border-[#3B82F6] bg-blue-50"
                        : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }`}
                  >
                    <span className={`text-sm font-semibold ${form.discipline === d.value ? "text-[#3B82F6]" : "text-[#374151]"}`}>
                      {d.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Paso 1: Detalles ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#111827] mb-1">Detalles del equipo</h2>
                <p className="text-sm text-[#6B7280]">Cuéntanos más sobre lo que vendes</p>
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

              {/* Campos específicos de Kite+Cometa */}
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
                <label className="block text-sm font-semibold text-[#374151] mb-1">Título del anuncio</label>
                {isKiteCometa ? (
                  <div className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-[#F9FAFB] text-[#374151] min-h-[42px]">
                    {autoTitle || <span className="text-[#9CA3AF]">Se genera automáticamente con los datos de la cometa</span>}
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => set("title", e.target.value)}
                      placeholder="Ej: Tabla Wakeboard Liquid Force 142"
                      maxLength={100}
                      className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                    />
                    <p className="text-xs text-[#9CA3AF] mt-1">{form.title.length}/100</p>
                  </>
                )}
              </div>

              {/* Marca y talla (solo si NO es kite+cometa, que ya las tiene arriba) */}
              {!isKiteCometa && (
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
                      placeholder="Ej: 142cm, M, 7.0m²..."
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
                    placeholder="0"
                    min={0}
                    className="w-full pl-8 pr-16 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-xs">COP</span>
                </div>
                {form.price && !isNaN(Number(form.price)) && (
                  <p className="text-xs text-[#6B7280] mt-1">
                    ${Number(form.price).toLocaleString("es-CO")} COP
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Descripción *</label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe el estado del equipo, uso que ha tenido, accesorios incluidos, razón de venta..."
                  rows={4}
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

              </>}
            </div>
          )}

          {/* ── Paso 2: Fotos ── */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">Fotos del equipo</h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Agrega entre 1 y 8 fotos. La primera será la foto principal. Arrastra para reordenar.
              </p>
              <PhotoUploader
                images={form.images}
                onChange={urls => set("images", urls)}
                uploading={uploading}
                onUpload={uploadImages}
              />
            </div>
          )}

          {/* ── Paso 3: Confirmar ── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">Confirma tu anuncio</h2>
              <p className="text-sm text-[#6B7280] mb-6">Revisa los datos antes de publicar</p>

              {/* Preview */}
              {form.images[0] && (
                <div className="aspect-video rounded-xl overflow-hidden mb-5 bg-[#F9FAFB]">
                  <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-3">
                {[
                  ["Disciplina", DISCIPLINES.find(d => d.value === form.discipline)?.label],
                  ["Tipo",       equipmentTypes.find(t => t.value === form.equipmentType)?.label],
                  ["Título",     isKiteCometa ? autoTitle : form.title],
                  ["Marca",      form.brand || "—"],
                  ["Talla",      form.size  || "—"],
                  ["Estado",     CONDITIONS.find(c => c.value === form.condition)?.label],
                  ["Precio",     `$${Number(form.price).toLocaleString("es-CO")} COP`],
                  ["Ciudad",     form.city],
                  ["Fotos",      `${form.images.length} foto(s)`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-[#F3F4F6] text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#111827]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#374151]">
                Al publicar, aceptas nuestros{" "}
                <Link href="/terminos" className="text-[#3B82F6] underline">Términos y condiciones</Link>.
                Tu anuncio quedará visible inmediatamente.
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Navegación */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            <button
              onClick={step < 3 ? next : submit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</>
              ) : step < 3 ? (
                <>Continuar <ChevronRight className="w-4 h-4" /></>
              ) : (
                <>Publicar anuncio <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

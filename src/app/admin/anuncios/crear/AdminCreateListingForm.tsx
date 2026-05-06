"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, CheckCircle,
  Loader2, Search, X, User,
} from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import KiteFields, { KiteMetadata } from "@/components/KiteFields";
import BoardFields, { BoardMetadata, BOARD_TYPES } from "@/components/BoardFields";
import BarraFields, { BarraMetadata } from "@/components/BarraFields";
import ArnesFields, { ArnesMetadata, ARNES_TYPES } from "@/components/ArnesFields";
import CityPicker from "@/components/CityPicker";
import { uploadFiles } from "@/lib/clientUpload";

/* ─── Constantes (igual que /vender) ─── */

const COMING_SOON = ["WINDSURF", "WAKEBOARD", "PADDLE"];

const DISCIPLINES = [
  { value: "KITESURF",  label: "Kitesurf"  },
  { value: "KITEFOIL",  label: "Kitefoil"  },
  { value: "WINGFOIL",  label: "Wingfoil"  },
  { value: "WATERWEAR", label: "Accesorios"},
  { value: "WINDSURF",  label: "Windsurf"  },
  { value: "WAKEBOARD", label: "Wakeboard" },
  { value: "PADDLE",    label: "Paddle"    },
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
    { value: "ARNES",        label: "Arnés" },
  ],
};

const CONDITIONS = [
  { value: "NUEVO",      label: "Nuevo",      desc: "Sin uso, con etiquetas o caja original" },
  { value: "COMO_NUEVO", label: "Como nuevo", desc: "Usado pocas veces, sin daños visibles" },
  { value: "USADO",      label: "Usado",      desc: "Uso normal, puede tener marcas de uso" },
];

const STEPS = ["Vendedor", "Sección", "Detalles", "Fotos", "Confirmar"];

/* ─── Tipos ─── */

interface UserOption { id: string; name: string | null; email: string }

interface FormData {
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

const EMPTY: FormData = {
  discipline: "", equipmentType: "", title: "", brand: "",
  size: "", condition: "", price: "", currency: "COP",
  description: "", city: "", images: [], metadata: {},
};

/* ─── Componente ─── */

export default function AdminCreateListingForm({ users }: { users: UserOption[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [department, setDepartment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Selector de usuario
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const userSearchRef = useRef<HTMLDivElement>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => uploadControllerRef.current?.abort(), []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userSearchRef.current && !userSearchRef.current.contains(e.target as Node)) {
        setShowUserList(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase();
    return (
      (u.name ?? "").toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }).slice(0, 12);

  const KITE_DISCIPLINES = ["KITESURF", "KITEFOIL", "WINDSURF"];
  const isWing          = form.discipline === "WINGFOIL" && form.equipmentType === "WING";
  const isLeash         = form.discipline === "WINGFOIL" && form.equipmentType === "LEASH";
  const isKiteCometa    = KITE_DISCIPLINES.includes(form.discipline) && form.equipmentType === "COMETA";
  const isKiteTabla     = (KITE_DISCIPLINES.includes(form.discipline) || form.discipline === "WINGFOIL") && form.equipmentType === "TABLA";
  const isKiteBarra     = KITE_DISCIPLINES.includes(form.discipline) && form.equipmentType === "BARRA_LINEAS";
  const isKiteArnes     = (KITE_DISCIPLINES.includes(form.discipline) || form.discipline === "WINGFOIL") && form.equipmentType === "ARNES";
  const hasSpecialFields = isKiteCometa || isWing || isLeash || isKiteTabla || isKiteBarra || isKiteArnes;

  const equipmentTypes = EQUIPMENT_TYPES_BY_DISCIPLINE[form.discipline] ?? EQUIPMENT_TYPES_BY_DISCIPLINE._DEFAULT;

  const autoTitle = isKiteCometa
    ? [form.brand, form.metadata.reference, form.metadata.complement, form.metadata.year, form.size,
       form.metadata.includesBar ? "Con barra" : "", form.metadata.hasRepairs ? "Con reparaciones" : form.metadata.hasRepairs === false ? "Sin reparaciones" : ""]
       .filter(Boolean).join(" ")
    : isWing
    ? [form.brand, form.metadata.reference, form.metadata.complement, form.metadata.year, form.size,
       form.metadata.includesBag ? "Con maleta" : ""]
       .filter(Boolean).join(" ")
    : isKiteTabla
    ? [BOARD_TYPES.find(t => t.value === form.metadata.boardType)?.label, form.brand, form.metadata.reference, form.metadata.complement, form.metadata.year, form.size]
       .filter(Boolean).join(" ")
    : isKiteBarra
    ? ["Barra", form.brand, form.metadata.reference, form.metadata.complement, form.size, form.metadata.lineLength, form.metadata.year]
       .filter(Boolean).join(" ")
    : isKiteArnes
    ? [ARNES_TYPES.find(t => t.value === form.metadata.arnesType)?.label, "Arnés", form.brand, form.metadata.reference, form.size, form.metadata.year]
       .filter(Boolean).join(" ")
    : null;

  function set(key: keyof FormData, value: string | string[]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError("");
  }

  async function uploadImages(files: FileList) {
    const controller = new AbortController();
    uploadControllerRef.current = controller;
    setUploading(true);
    setError("");
    try {
      const { urls } = await uploadFiles(Array.from(files), { profile: "listing", signal: controller.signal });
      if (urls.length > 0) set("images", [...form.images, ...urls]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudieron subir las fotos");
    } finally {
      if (uploadControllerRef.current === controller) uploadControllerRef.current = null;
      setUploading(false);
    }
  }

  function validateStep() {
    if (step === 0 && !selectedUser) return "Selecciona el usuario al que se le asignará el anuncio";
    if (step === 1 && !form.discipline) return "Selecciona una disciplina";
    if (step === 2) {
      if (!form.equipmentType) return "Selecciona el tipo de equipo";
      if (isKiteCometa) {
        if (!form.brand.trim())                     return "Escribe la marca de la cometa";
        if (!form.size)                             return "Selecciona el tamaño";
        if (!form.metadata.year)                    return "Selecciona el año";
        if (form.metadata.includesBar === undefined) return "Indica si incluye barra y líneas";
        if (form.metadata.includesBag === undefined) return "Indica si incluye maleta";
        if (form.metadata.hasRepairs === undefined)  return "Indica si tiene reparaciones";
      }
      if (!hasSpecialFields && !form.title.trim()) return "Escribe un título";
      if (!form.condition)     return "Selecciona el estado del equipo";
      if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return "Escribe un precio válido";
      if (!form.description.trim()) return "Escribe una descripción";
      if (!form.city)          return "Selecciona la ciudad";
    }
    if (step === 3 && form.images.length === 0) return "Agrega al menos una foto";
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
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: selectedUser!.id,
          ...form,
          title: hasSpecialFields ? autoTitle : form.title,
          metadata: hasSpecialFields ? form.metadata : undefined,
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
          <Link href="/admin/anuncios" className="text-sm text-[#6B7280] hover:text-[#111827] flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Volver a anuncios
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Crear anuncio</h1>
          <p className="text-sm text-[#6B7280] mt-1">Asigna el anuncio a un usuario existente</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => { if (i < step) setStep(i); }}
                disabled={i >= step}
                className={`flex items-center gap-2 min-w-0 ${i < step ? "cursor-pointer group" : "cursor-default"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  i < step ? "bg-[#3B82F6] text-white group-hover:bg-blue-700" :
                  i === step ? "bg-[#111827] text-white" : "bg-[#E5E7EB] text-[#9CA3AF]"
                }`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${
                  i < step ? "text-[#3B82F6]" :
                  i === step ? "text-[#111827] font-semibold" : "text-[#9CA3AF]"
                }`}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-[#E5E7EB]" />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">

          {/* ── Paso 0: Seleccionar usuario ── */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">Asignar a usuario</h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Busca y selecciona el usuario al que pertenecerá este anuncio.
              </p>

              {selectedUser ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-[#3B82F6] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold shrink-0">
                    {selectedUser.name?.[0] ?? selectedUser.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#111827]">{selectedUser.name ?? "Sin nombre"}</p>
                    <p className="text-xs text-[#6B7280] truncate">{selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedUser(null); setUserSearch(""); }}
                    className="p-1.5 rounded-lg hover:bg-blue-100 text-[#6B7280] hover:text-[#374151] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div ref={userSearchRef} className="relative">
                  <div className="flex items-center gap-2 px-4 py-3 border border-[#D1D5DB] rounded-xl focus-within:border-[#3B82F6] focus-within:ring-1 focus-within:ring-[#3B82F6] bg-white">
                    <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o email..."
                      value={userSearch}
                      onChange={e => { setUserSearch(e.target.value); setShowUserList(true); }}
                      onFocus={() => setShowUserList(true)}
                      className="flex-1 text-sm outline-none bg-transparent"
                    />
                  </div>
                  {showUserList && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
                      {filteredUsers.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-[#9CA3AF]">Sin resultados</p>
                      ) : (
                        filteredUsers.map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => { setSelectedUser(u); setUserSearch(""); setShowUserList(false); setError(""); }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.name?.[0] ?? u.email[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#111827] truncate">{u.name ?? "Sin nombre"}</p>
                              <p className="text-xs text-[#9CA3AF] truncate">{u.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Paso 1: Disciplina ── */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">¿Qué sección o disciplina?</h2>
              <p className="text-sm text-[#6B7280] mb-6">Selecciona el deporte al que pertenece el equipo</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DISCIPLINES.map((d) => {
                  const soon = COMING_SOON.includes(d.value);
                  return (
                    <button
                      key={d.value}
                      onClick={() => { if (soon) return; setForm(prev => ({ ...prev, discipline: d.value, equipmentType: "", metadata: {} })); setStep(2); }}
                      disabled={soon}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        soon ? "border-[#E5E7EB] bg-[#F9FAFB] cursor-not-allowed opacity-60" :
                        form.discipline === d.value ? "border-[#3B82F6] bg-blue-50" :
                        "border-[#E5E7EB] hover:border-[#D1D5DB]"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${form.discipline === d.value && !soon ? "text-[#3B82F6]" : "text-[#374151]"}`}>
                        {d.label}
                      </span>
                      {soon && <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">Próximamente</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Paso 2: Detalles ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#111827] mb-1">Detalles del equipo</h2>
                <p className="text-sm text-[#6B7280]">Anuncio para: <strong>{selectedUser?.name ?? selectedUser?.email}</strong></p>
              </div>

              {/* Tipo de equipo */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Tipo de equipo *</label>
                <div className="grid grid-cols-2 gap-2">
                  {equipmentTypes.map((t) => (
                    <button key={t.value}
                      onClick={() => { set("equipmentType", t.value); setForm(prev => ({ ...prev, metadata: {} })); }}
                      className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                        form.equipmentType === t.value ? "border-[#3B82F6] bg-blue-50 text-[#3B82F6] font-semibold" : "border-[#E5E7EB] text-[#374151] hover:border-[#D1D5DB]"
                      }`}
                    >{t.label}</button>
                  ))}
                </div>
              </div>

              {form.equipmentType && <>
              {/* Campos especiales por tipo */}
              {isKiteCometa && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos de la cometa</p>
                  <KiteFields brand={form.brand} size={form.size} meta={form.metadata}
                    onBrandChange={v => set("brand", v)} onSizeChange={v => set("size", v)}
                    onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                    mode={form.discipline === "KITEFOIL" ? "kitefoil" : "kite"} />
                </div>
              )}
              {isWing && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos del wing</p>
                  <KiteFields brand={form.brand} size={form.size} meta={form.metadata}
                    onBrandChange={v => set("brand", v)} onSizeChange={v => set("size", v)}
                    onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))} mode="wing" />
                </div>
              )}
              {isKiteTabla && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos de la tabla</p>
                  <BoardFields brand={form.brand} size={form.size} meta={form.metadata}
                    onBrandChange={v => set("brand", v)} onSizeChange={v => set("size", v)}
                    onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))}
                    allowedTypes={form.discipline === "KITEFOIL" || form.discipline === "WINGFOIL" ? ["foilboard"] : undefined}
                    discipline={form.discipline} />
                </div>
              )}
              {isKiteBarra && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos de la barra</p>
                  <BarraFields brand={form.brand} size={form.size} meta={form.metadata}
                    onBrandChange={v => set("brand", v)} onSizeChange={v => set("size", v)}
                    onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))} discipline={form.discipline} />
                </div>
              )}
              {isLeash && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos del leash</p>
                  <BarraFields brand={form.brand} size={form.size} meta={form.metadata}
                    onBrandChange={v => set("brand", v)} onSizeChange={v => set("size", v)}
                    onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))} discipline="WINGFOIL" />
                </div>
              )}
              {isKiteArnes && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-wider mb-4">Datos del arnés</p>
                  <ArnesFields brand={form.brand} size={form.size} meta={form.metadata}
                    onBrandChange={v => set("brand", v)} onSizeChange={v => set("size", v)}
                    onMetaChange={m => setForm(prev => ({ ...prev, metadata: m }))} discipline={form.discipline} />
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Título del anuncio *</label>
                {hasSpecialFields ? (
                  <div className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-[#F9FAFB] text-[#374151] min-h-[42px]">
                    {autoTitle || <span className="text-[#9CA3AF]">Se genera automáticamente</span>}
                  </div>
                ) : (
                  <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                    placeholder="Ej: Tabla Wakeboard Liquid Force 142" maxLength={100}
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" />
                )}
              </div>

              {/* Marca y talla (si no tiene campos especiales) */}
              {!hasSpecialFields && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1">Marca</label>
                    <input type="text" value={form.brand} onChange={e => set("brand", e.target.value)}
                      placeholder="Ej: Cabrinha..." className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-1">Talla / Tamaño</label>
                    <input type="text" value={form.size} onChange={e => set("size", e.target.value)}
                      placeholder="Ej: 12m, 142cm..." className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                </div>
              )}

              {/* Estado */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2">Estado *</label>
                <div className="space-y-2">
                  {CONDITIONS.map((c) => (
                    <button key={c.value} onClick={() => set("condition", c.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        form.condition === c.value ? "border-[#3B82F6] bg-blue-50" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                      }`}>
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${form.condition === c.value ? "border-[#3B82F6] bg-[#3B82F6]" : "border-[#D1D5DB]"}`} />
                      <div>
                        <p className={`text-sm font-semibold ${form.condition === c.value ? "text-[#3B82F6]" : "text-[#111827]"}`}>{c.label}</p>
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
                      <button key={c} type="button" onClick={() => set("currency", c)}
                        className={`px-4 py-2.5 text-sm font-semibold transition-colors ${form.currency === c ? "bg-[#111827] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">$</span>
                    <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                      onWheel={e => (e.target as HTMLInputElement).blur()} placeholder="0" min={0}
                      className="w-full pl-8 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]" />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Descripción *</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)}
                  placeholder="Describe el estado, uso, accesorios incluidos..." rows={4} maxLength={1000}
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] resize-none" />
                <p className="text-xs text-[#9CA3AF] mt-1">{form.description.length}/1000</p>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-1">Ciudad *</label>
                <CityPicker city={form.city} department={department}
                  onCityChange={v => set("city", v)} onDepartmentChange={setDepartment} />
              </div>
              </>}
            </div>
          )}

          {/* ── Paso 3: Fotos ── */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">Fotos del equipo</h2>
              <p className="text-sm text-[#6B7280] mb-6">Agrega entre 1 y 8 fotos. La primera será la foto principal.</p>
              <PhotoUploader images={form.images} onChange={urls => set("images", urls)}
                uploading={uploading} onUpload={uploadImages} onCancelUpload={() => uploadControllerRef.current?.abort()} />
            </div>
          )}

          {/* ── Paso 4: Confirmar ── */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-[#111827] mb-1">Confirmar anuncio</h2>
              <p className="text-sm text-[#6B7280] mb-6">Revisa antes de publicar</p>

              {/* Usuario asignado */}
              <div className="mb-5 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <User className="w-5 h-5 text-[#3B82F6] shrink-0" />
                <div>
                  <p className="text-xs text-[#6B7280]">Anuncio asignado a</p>
                  <p className="font-semibold text-[#111827] text-sm">{selectedUser?.name ?? "Sin nombre"}</p>
                  <p className="text-xs text-[#9CA3AF]">{selectedUser?.email}</p>
                </div>
              </div>

              {form.images[0] && (
                <div className="aspect-video rounded-xl overflow-hidden mb-5 bg-[#F9FAFB]">
                  <img src={form.images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="space-y-3">
                {[
                  ["Título",     hasSpecialFields ? autoTitle : form.title],
                  ["Disciplina", DISCIPLINES.find(d => d.value === form.discipline)?.label],
                  ["Tipo",       equipmentTypes.find(t => t.value === form.equipmentType)?.label],
                  ["Marca",      form.brand || "—"],
                  ["Talla",      form.size  || "—"],
                  ["Estado",     CONDITIONS.find(c => c.value === form.condition)?.label],
                  ["Precio",     form.currency === "USD" ? `USD $${Number(form.price).toLocaleString("en-US")}` : `$${Number(form.price).toLocaleString("es-CO")} COP`],
                  ["Ciudad",     form.city],
                  ["Fotos",      `${form.images.length} foto(s)`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-[#F3F4F6] text-sm">
                    <span className="text-[#6B7280]">{label}</span>
                    <span className="font-semibold text-[#111827]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Navegación */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            )}
            <button
              onClick={step < STEPS.length - 1 ? next : submit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</>
              ) : step < STEPS.length - 1 ? (
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

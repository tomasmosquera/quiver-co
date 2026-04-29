"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ImagePlus,
  Loader2,
  ShieldCheck,
  Trash2,
  Wind,
  XCircle,
} from "lucide-react";
import CityPicker from "@/components/CityPicker";
import PhotoUploader from "@/components/PhotoUploader";
import {
  calculateKiteInspection,
  KITE_INSPECTION_CHECKS,
  KITE_INSPECTION_VERSION,
  type InspectionAnswer,
} from "@/lib/kiteInspection";

type Answers = Record<string, InspectionAnswer | undefined>;
type InspectionPhotos = Record<string, string[] | undefined>;

interface ListingForm {
  brand: string;
  customBrand: string;
  reference: string;
  size: string;
  year: string;
  condition: string;
  price: string;
  currency: "COP" | "USD";
  description: string;
  city: string;
  includesBar?: boolean;
  includesBag?: boolean;
}

const BRANDS = [
  "Airush","Cabrinha","Core","Duotone","Eleveight",
  "F-One","Flysurfer","Naish","North","Ocean Rodeo",
  "Ozone","Reedin","Slingshot","Otra",
];

const SIZES = ["4m","5m","6m","7m","8m","9m","10m","11m","12m","13m","14m","15m","16m","17m","18m"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2000 + 1 }, (_, i) => String(CURRENT_YEAR - i));

const CONDITIONS = [
  { value: "NUEVO",      label: "Nuevo" },
  { value: "COMO_NUEVO", label: "Como nuevo" },
  { value: "USADO",      label: "Usado" },
];

const STEPS = ["Anuncio","Fotos","Aire","Válvulas","Estructura","Tela","Bridas","Reparaciones","Resumen"];

const PHOTO_LABELS: Record<string, string> = {
  inflated_identity: "Cometa inflada completa",
  pressure_final:    "Foto final de presión",
  main_valve:        "Válvula principal",
  one_pump:          "One pump / mangueras",
  leading_edge:      "Leading edge",
  trailing_edge:     "Trailing edge",
  bridles_left:      "Bridas lado izquierdo",
  bridles_right:     "Bridas lado derecho",
  repairs:           "Reparaciones o daños",
};

const PHOTO_HELP: Record<string, string> = {
  inflated_identity: "La cometa debe verse completa, inflada, con marca/modelo/tamaño visibles.",
  pressure_final:    "Toma otra foto después de 15-20 minutos. Debe verse firme y con forma similar.",
  main_valve:        "Acércate a la válvula. Debe verse enfocada, cerrada y sin partes despegadas.",
  one_pump:          "Muestra mangueras y conectores. Evita sombras fuertes sobre la zona.",
  leading_edge:      "Captura el borde frontal completo o la sección más representativa.",
  trailing_edge:     "Muestra el borde trasero extendido, sin cortar las puntas importantes.",
  bridles_left:      "Muestra bridas, pigtails y puntos de conexión del lado izquierdo.",
  bridles_right:     "Muestra bridas, pigtails y puntos de conexión del lado derecho.",
  repairs:           "Foto cercana, bien enfocada, de cada reparación, daño o modificación.",
};

const EXAMPLE_VARIANTS: Record<string, "kite" | "detail" | "lines" | "edge"> = {
  inflated_identity: "kite",
  pressure_final:    "kite",
  main_valve:        "detail",
  one_pump:          "detail",
  leading_edge:      "edge",
  trailing_edge:     "edge",
  bridles_left:      "lines",
  bridles_right:     "lines",
  repairs:           "detail",
};

const INITIAL_ANSWERS: Answers = {
  identity_match: undefined, inflates_shape: undefined, holds_pressure: undefined,
  main_valve_ok: undefined,  one_pump_ok: undefined,    leading_edge_ok: undefined,
  struts_ok: undefined,      canopy_no_tears: undefined, canopy_no_severe_wear: undefined,
  trailing_edge_ok: undefined, bridles_ok: undefined,   pigtails_ok: undefined,
  pulleys_ok: undefined,     repairs_declared: undefined,
};

const INITIAL_FORM: ListingForm = {
  brand: "", customBrand: "", reference: "", size: "", year: "",
  condition: "USADO", price: "", currency: "COP",
  description: "", city: "", includesBar: undefined, includesBag: undefined,
};

function getCheck(id: string) {
  const check = KITE_INSPECTION_CHECKS.find(c => c.id === id);
  if (!check) throw new Error(`Missing check: ${id}`);
  return check;
}

function selectedBrand(form: ListingForm) {
  return form.brand === "Otra" ? form.customBrand.trim() : form.brand;
}

function buildTitle(form: ListingForm) {
  return [selectedBrand(form), form.reference.trim(), form.year, form.size].filter(Boolean).join(" ");
}

function labelForAnswer(answer?: InspectionAnswer) {
  if (answer === "pass") return "Aprobado";
  if (answer === "fail") return "No aprobado";
  if (answer === "na")   return "No aplica";
  return "Pendiente";
}

function answerClass(answer?: InspectionAnswer) {
  if (answer === "pass" || answer === "na") return "bg-emerald-50 text-emerald-700";
  if (answer === "fail") return "bg-red-50 text-red-700";
  return "bg-[#F3F4F6] text-[#9CA3AF]";
}

function scoreColor(score: number) {
  if (score >= 90) return "text-emerald-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-amber-600";
  if (score >= 60) return "text-orange-600";
  return "text-red-600";
}

function scoreBg(score: number) {
  if (score >= 90) return "bg-emerald-50 border-emerald-200";
  if (score >= 80) return "bg-blue-50 border-blue-200";
  if (score >= 70) return "bg-amber-50 border-amber-200";
  if (score >= 60) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

/* ─── PhotoExample ─── */
function PhotoExample({ type }: { type: "kite" | "detail" | "lines" | "edge" }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="absolute inset-2 rounded-lg border border-dashed border-[#D1D5DB]" />
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#6B7280]">
        <Camera className="h-3 w-3" /> Ejemplo
      </div>
      {type === "kite" && (
        <>
          <div className="absolute left-[12%] top-[22%] h-[48%] w-[76%] rounded-t-full border-[10px] border-[#111827]" />
          <div className="absolute left-[20%] top-[34%] h-[28%] w-[60%] rounded-t-full border-t-8 border-[#3B82F6]" />
          <div className="absolute bottom-5 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-[#D1D5DB]" />
        </>
      )}
      {type === "edge" && (
        <>
          <div className="absolute left-[9%] top-[28%] h-7 w-[82%] rounded-full bg-[#111827]" />
          <div className="absolute left-[12%] top-[48%] h-2 w-[76%] rounded-full bg-[#3B82F6]" />
          <div className="absolute left-[18%] top-[60%] h-2 w-[64%] rounded-full bg-[#D1D5DB]" />
        </>
      )}
      {type === "detail" && (
        <>
          <div className="absolute left-[32%] top-[20%] h-[54%] w-[36%] rounded-xl border-8 border-[#111827] bg-[#F9FAFB]" />
          <div className="absolute left-[42%] top-[36%] h-10 w-10 rounded-full border-4 border-[#3B82F6] bg-white" />
        </>
      )}
      {type === "lines" && (
        <>
          <div className="absolute left-[18%] top-[20%] h-3 w-[64%] rounded-full bg-[#111827]" />
          <div className="absolute left-[22%] top-[36%] h-px w-[56%] rotate-12 bg-[#3B82F6]" />
          <div className="absolute left-[22%] top-[48%] h-px w-[56%] -rotate-12 bg-[#3B82F6]" />
          <div className="absolute left-[22%] top-[60%] h-px w-[56%] bg-[#3B82F6]" />
          <div className="absolute bottom-4 left-[28%] h-7 w-7 rounded-full border-4 border-[#111827]" />
          <div className="absolute bottom-4 right-[28%] h-7 w-7 rounded-full border-4 border-[#111827]" />
        </>
      )}
    </div>
  );
}

/* ─── AnswerButtons ─── */
function AnswerButtons({ checkId, value, onChange }: {
  checkId: string; value?: InspectionAnswer; onChange: (v: InspectionAnswer) => void;
}) {
  const check = getCheck(checkId);
  const options: { value: InspectionAnswer; label: string; icon: React.ElementType }[] = [
    { value: "pass", label: "Aprobado",    icon: CheckCircle },
    { value: "fail", label: "No aprobado", icon: XCircle },
    ...(check.allowNa ? [{ value: "na" as const, label: "No aplica", icon: CheckCircle }] : []),
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="border-b border-[#F3F4F6] px-4 py-3">
        <p className="text-sm font-semibold text-[#111827] leading-snug">{check.label}</p>
        <p className="mt-0.5 text-xs text-[#9CA3AF]">{check.weight} puntos</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-[#F3F4F6]" style={{ gridTemplateColumns: check.allowNa ? "1fr 1fr 1fr" : "1fr 1fr" }}>
        {options.map((opt) => {
          const active = value === opt.value;
          const isPass = opt.value === "pass" || opt.value === "na";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex flex-col items-center justify-center gap-1.5 py-4 text-xs font-bold transition-colors ${
                active
                  ? isPass
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                  : "text-[#9CA3AF] hover:bg-[#F9FAFB]"
              }`}
            >
              <opt.icon className={`h-5 w-5 ${active ? (isPass ? "text-emerald-500" : "text-red-400") : "text-[#D1D5DB]"}`} />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── UploadBox ─── */
function UploadBox({ photoId, photos, uploading, onUpload, onRemove }: {
  photoId: string; photos: string[]; uploading: boolean;
  onUpload: (id: string, files: FileList) => void;
  onRemove: (id: string, url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#F3F4F6] px-4 py-3">
        <div>
          <p className="text-sm font-bold text-[#111827]">{PHOTO_LABELS[photoId]}</p>
          <p className="mt-0.5 text-xs text-[#6B7280] leading-relaxed">{PHOTO_HELP[photoId]}</p>
        </div>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#374151] disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span className="hidden sm:inline">Subir foto</span>
          <span className="sm:hidden">Subir</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Ejemplo */}
          <PhotoExample type={EXAMPLE_VARIANTS[photoId] ?? "detail"} />

          {/* Fotos subidas o drop zone */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-2">
              {photos.map((url) => (
                <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-[#E5E7EB]">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemove(photoId, url)}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => ref.current?.click()}
                className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
            >
              <Camera className="h-6 w-6" />
              <span className="text-sm font-semibold">Toca para agregar foto</span>
            </button>
          )}
        </div>
      </div>

      <input ref={ref} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => { if (e.target.files) onUpload(photoId, e.target.files); e.currentTarget.value = ""; }} />
    </div>
  );
}

/* ─── ScoreBadge ─── */
function ScoreBadge({ score, label, compact = false }: { score: number; label: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${scoreBg(score)}`}>
      <div className="flex items-end gap-2">
        <span className={`font-bold tabular-nums leading-none ${compact ? "text-3xl" : "text-5xl"} ${scoreColor(score)}`}>
          {score}
        </span>
        <span className={`mb-1 text-sm font-medium ${scoreColor(score)} opacity-70`}>/100</span>
      </div>
      <p className={`mt-1 font-bold ${compact ? "text-sm" : "text-base"} ${scoreColor(score)}`}>{label}</p>
    </div>
  );
}

/* ─── Main component ─── */
export default function KiteStandardListingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ListingForm>(INITIAL_FORM);
  const [department, setDepartment] = useState("");
  const [commercialPhotos, setCommercialPhotos] = useState<string[]>([]);
  const [inspectionPhotos, setInspectionPhotos] = useState<InspectionPhotos>({});
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [repairNotes, setRepairNotes] = useState("");
  const [hasInspectionRepairs, setHasInspectionRepairs] = useState<boolean | undefined>(undefined);
  const [uploadingCommercial, setUploadingCommercial] = useState(false);
  const [uploadingPhotoId, setUploadingPhotoId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timerStartedAt, setTimerStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  const result = useMemo(() => calculateKiteInspection(answers, inspectionPhotos), [answers, inspectionPhotos]);
  const title = buildTitle(form);
  const timerSeconds = timerStartedAt ? Math.max(0, 20 * 60 - Math.floor((now - timerStartedAt) / 1000)) : 20 * 60;

  useEffect(() => {
    if (!timerStartedAt || timerSeconds <= 0) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [timerStartedAt, timerSeconds]);

  function updateForm(patch: Partial<ListingForm>) { setForm(c => ({ ...c, ...patch })); setError(""); }
  function updateAnswer(id: string, value: InspectionAnswer) { setAnswers(c => ({ ...c, [id]: value })); setError(""); }

  async function uploadFile(file: File) {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo subir la foto");
    return data.url as string | undefined;
  }

  async function uploadCommercialImages(files: FileList) {
    setUploadingCommercial(true);
    try {
      const urls = (await Promise.all(Array.from(files).map(uploadFile))).filter(Boolean) as string[];
      setCommercialPhotos(c => [...c, ...urls].slice(0, 8));
    } finally { setUploadingCommercial(false); }
  }

  async function uploadInspectionImages(photoId: string, files: FileList) {
    setUploadingPhotoId(photoId);
    try {
      const urls = (await Promise.all(Array.from(files).map(uploadFile))).filter(Boolean) as string[];
      setInspectionPhotos(c => ({ ...c, [photoId]: [...(c[photoId] ?? []), ...urls] }));
    } finally { setUploadingPhotoId(null); }
  }

  function removeInspectionPhoto(photoId: string, url: string) {
    setInspectionPhotos(c => ({ ...c, [photoId]: (c[photoId] ?? []).filter(u => u !== url) }));
  }

  function formatTimer(s: number) {
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  function validateStep(s = step) {
    if (s === 0) {
      if (!selectedBrand(form)) return "Selecciona o escribe la marca.";
      if (!form.size)           return "Selecciona el tamaño.";
      if (!form.year)           return "Selecciona el año.";
      if (!form.condition)      return "Selecciona el estado.";
      if (!form.price || Number(form.price) <= 0) return "Escribe un precio válido.";
      if (!form.city)           return "Selecciona la ciudad.";
      if (form.includesBar === undefined) return "Indica si incluye barra y líneas.";
      if (form.includesBag === undefined) return "Indica si incluye maleta.";
      if (!form.description.trim()) return "Escribe una descripción.";
    }
    if (s === 1 && commercialPhotos.length === 0) return "Agrega al menos una foto comercial.";
    if (s === 2) {
      if (!inspectionPhotos.inflated_identity?.length) return "Sube la foto de la cometa inflada.";
      if (!answers.identity_match || !answers.inflates_shape) return "Responde los checks de identificación y aire.";
    }
    if (s === 3) {
      if (!inspectionPhotos.main_valve?.length || !inspectionPhotos.one_pump?.length) return "Sube las fotos de válvula y one pump.";
      if (!answers.main_valve_ok || !answers.one_pump_ok) return "Responde todos los checks de válvulas.";
    }
    if (s === 4) {
      if (!inspectionPhotos.leading_edge?.length) return "Sube la foto del leading edge.";
      if (!answers.leading_edge_ok || !answers.struts_ok) return "Responde todos los checks de estructura.";
    }
    if (s === 5) {
      if (!inspectionPhotos.trailing_edge?.length) return "Sube la foto del trailing edge.";
      if (!answers.canopy_no_tears || !answers.canopy_no_severe_wear || !answers.trailing_edge_ok) return "Responde todos los checks de tela.";
    }
    if (s === 6) {
      if (!inspectionPhotos.bridles_left?.length || !inspectionPhotos.bridles_right?.length) return "Sube fotos de bridas en ambos lados.";
      if (!answers.bridles_ok || !answers.pigtails_ok || !answers.pulleys_ok) return "Responde todos los checks de bridas.";
    }
    if (s === 7) {
      if (hasInspectionRepairs === undefined) return "Indica si hay reparaciones, daños o modificaciones.";
      if (!answers.repairs_declared) return "Responde el check de reparaciones declaradas.";
      if (hasInspectionRepairs && !repairNotes.trim()) return "Describe la reparación o daño.";
      if (hasInspectionRepairs && !inspectionPhotos.repairs?.length) return "Sube al menos una foto de la reparación.";
    }
    if (s === 8) {
      if (!inspectionPhotos.pressure_final?.length) return "Sube la foto final de la prueba de presión.";
      if (!answers.holds_pressure) return "Responde si la cometa mantuvo presión.";
    }
    return "";
  }

  function next() {
    const err = validateStep(); if (err) { setError(err); return; }
    setStep(c => Math.min(c + 1, STEPS.length - 1)); setError("");
  }
  function back() { setStep(c => Math.max(c - 1, 0)); setError(""); }

  async function submit() {
    const errs = STEPS.map((_, i) => validateStep(i)).filter(Boolean);
    if (errs.length) { setError(errs[0]); return; }
    setSubmitting(true); setError("");
    try {
      const metadata = {
        reference: form.reference.trim() || undefined,
        year: form.year, includesBar: form.includesBar, includesBag: form.includesBag,
        hasRepairs: hasInspectionRepairs ?? false,
        repairs: hasInspectionRepairs
          ? [{ description: repairNotes.trim(), imageUrl: inspectionPhotos.repairs?.[0] }] : [],
        standardInspection: {
          version: KITE_INSPECTION_VERSION, source: "seller-admin-prototype",
          completedAt: new Date().toISOString(),
          score: result.score, rawScore: result.rawScore, label: result.label,
          alerts: result.alerts, answers, photos: inspectionPhotos,
          repairNotes: repairNotes.trim() || undefined,
        },
      };
      const res = await fetch("/api/listings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description: form.description.trim(), price: form.price,
          currency: form.currency, discipline: "KITESURF", equipmentType: "COMETA",
          condition: form.condition, brand: selectedBrand(form),
          size: form.size, city: form.city, images: commercialPhotos, metadata,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al publicar");
      router.push(`/equipo/${data.listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar");
      setSubmitting(false);
    }
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin" className="mb-2 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827]">
            <ChevronLeft className="h-4 w-4" /> Volver al admin
          </Link>
          <h1 className="text-xl font-bold text-[#111827] sm:text-2xl">Peritaje Estándar — Cometa</h1>
          <p className="mt-0.5 text-sm text-[#6B7280]">14 checks · 8 fotos base · puntaje automático</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-[#1D4ED8]">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span className="font-bold">Peritaje Estándar v1</span>
        </div>
      </div>

      {/* ── Score flotante en móvil ── */}
      <div className="block xl:hidden">
        <div className={`rounded-2xl border p-4 ${scoreBg(result.score)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wind className={`h-5 w-5 ${scoreColor(result.score)}`} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Puntaje actual</p>
                <p className={`text-2xl font-bold tabular-nums ${scoreColor(result.score)}`}>
                  {result.score}<span className="text-sm font-medium opacity-60">/100</span>
                </p>
              </div>
            </div>
            <p className={`text-lg font-bold ${scoreColor(result.score)}`}>{result.label}</p>
          </div>
        </div>
      </div>

      {/* ── Step nav ── */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white px-4 pb-4 pt-3">
        {/* Progress bar + label */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[#9CA3AF]">Paso {step + 1} de {STEPS.length}</span>
          <span className="text-xs font-bold text-[#111827]">{STEPS[step]}</span>
        </div>
        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
          <div
            className="h-full rounded-full bg-[#3B82F6] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {/* Scrollable pills */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => { if (i < step) setStep(i); }}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                i === step   ? "bg-[#111827] text-white" :
                i < step    ? "bg-blue-50 text-[#2563EB] hover:bg-blue-100" :
                               "bg-[#F3F4F6] text-[#9CA3AF]"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">

        {/* Main */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 sm:p-6">

          {/* STEP 0: Anuncio */}
          {step === 0 && (
            <div className="space-y-5">
              <StepHeader title="Datos del anuncio" description="Completa la información básica de la cometa." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Marca">
                  <select value={form.brand} onChange={e => updateForm({ brand: e.target.value })} className="input">
                    <option value="">Seleccionar marca</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                {form.brand === "Otra" && (
                  <Field label="Otra marca">
                    <input value={form.customBrand} onChange={e => updateForm({ customBrand: e.target.value })} className="input" placeholder="Escribe la marca" />
                  </Field>
                )}
                <Field label="Modelo / referencia">
                  <input value={form.reference} onChange={e => updateForm({ reference: e.target.value })} className="input" placeholder="Ej: Switchblade, Bandit, Pivot" />
                </Field>
                <Field label="Tamaño">
                  <select value={form.size} onChange={e => updateForm({ size: e.target.value })} className="input">
                    <option value="">Seleccionar tamaño</option>
                    {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Año">
                  <select value={form.year} onChange={e => updateForm({ year: e.target.value })} className="input">
                    <option value="">Seleccionar año</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </Field>
                <Field label="Estado">
                  <select value={form.condition} onChange={e => updateForm({ condition: e.target.value })} className="input">
                    {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </Field>
                <Field label="Precio">
                  <div className="flex gap-2">
                    <select value={form.currency} onChange={e => updateForm({ currency: e.target.value as "COP" | "USD" })} className="w-24 rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30">
                      <option value="COP">COP</option>
                      <option value="USD">USD</option>
                    </select>
                    <input value={form.price} onChange={e => updateForm({ price: e.target.value })} className="input" type="number" min={0} placeholder="0" onWheel={e => (e.target as HTMLInputElement).blur()} />
                  </div>
                </Field>
                <Field label="Ciudad">
                  <CityPicker city={form.city} department={department} onCityChange={city => updateForm({ city })} onDepartmentChange={setDepartment} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ToggleField label="¿Incluye barra y líneas?" value={form.includesBar} onChange={v => updateForm({ includesBar: v })} />
                <ToggleField label="¿Incluye maleta?" value={form.includesBag} onChange={v => updateForm({ includesBag: v })} />
              </div>
              <Field label="Descripción">
                <textarea value={form.description} onChange={e => updateForm({ description: e.target.value })} rows={4} maxLength={1000} className="input resize-none" placeholder="Describe el estado general, uso, accesorios incluidos y razón de venta." />
              </Field>
              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Título generado automáticamente</p>
                <p className="mt-1 font-bold text-[#111827]">{title || <span className="text-[#9CA3AF] font-normal">Completa marca, modelo, año y tamaño</span>}</p>
              </div>
            </div>
          )}

          {/* STEP 1: Fotos comerciales */}
          {step === 1 && (
            <div>
              <StepHeader title="Fotos comerciales" description="Estas son las fotos del anuncio. El peritaje tendrá sus propias fotos técnicas separadas." />
              <PhotoUploader images={commercialPhotos} onChange={setCommercialPhotos} uploading={uploadingCommercial} onUpload={uploadCommercialImages} />
            </div>
          )}

          {/* STEP 2: Aire */}
          {step === 2 && (
            <div className="space-y-5">
              <StepHeader title="Identificación y prueba de aire" description="Infla la cometa y toma la primera foto. El timer te ayuda a saber cuándo hacer la foto final de presión." />
              {/* Timer */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB]">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">Timer de presión</p>
                      <p className="text-xs text-[#6B7280]">Deja la cometa inflada y continúa con los otros pasos.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-2xl font-bold tabular-nums text-[#111827]">{formatTimer(timerSeconds)}</span>
                    <button type="button" onClick={() => { setTimerStartedAt(Date.now()); setNow(Date.now()); }}
                      className="rounded-xl bg-[#111827] px-3 py-2 text-xs font-bold text-white hover:bg-[#374151]">
                      {timerStartedAt ? "Reiniciar" : "Iniciar"}
                    </button>
                  </div>
                </div>
              </div>
              <UploadBox photoId="inflated_identity" photos={inspectionPhotos.inflated_identity ?? []} uploading={uploadingPhotoId === "inflated_identity"} onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} />
              <AnswerButtons checkId="identity_match" value={answers.identity_match} onChange={v => updateAnswer("identity_match", v)} />
              <AnswerButtons checkId="inflates_shape" value={answers.inflates_shape} onChange={v => updateAnswer("inflates_shape", v)} />
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                💡 La foto final de presión se pedirá en el último paso. Deja la cometa inflada y continúa con el resto del peritaje.
              </div>
            </div>
          )}

          {/* STEP 3–6: Secciones de inspección */}
          {step === 3 && (
            <InspectionSection title="Válvulas y one pump" description="Revisa cierre, fugas visibles, conectores y mangueras."
              photoIds={["main_valve","one_pump"]} checkIds={["main_valve_ok","one_pump_ok"]}
              photos={inspectionPhotos} answers={answers} uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} onAnswer={updateAnswer} />
          )}
          {step === 4 && (
            <InspectionSection title="Estructura inflable" description="Revisa leading edge y costillas. Busca cortes, deformaciones y costuras abiertas."
              photoIds={["leading_edge"]} checkIds={["leading_edge_ok","struts_ok"]}
              photos={inspectionPhotos} answers={answers} uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} onAnswer={updateAnswer} />
          )}
          {step === 5 && (
            <InspectionSection title="Tela y borde de fuga" description="Revisa canopy, desgaste fuerte, moho, zonas quebradizas y trailing edge."
              photoIds={["trailing_edge"]} checkIds={["canopy_no_tears","canopy_no_severe_wear","trailing_edge_ok"]}
              photos={inspectionPhotos} answers={answers} uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} onAnswer={updateAnswer} />
          )}
          {step === 6 && (
            <InspectionSection title="Bridas, pigtails y poleas" description="Revisa simetría, cortes, desgaste, puntos de conexión y movimiento de poleas."
              photoIds={["bridles_left","bridles_right"]} checkIds={["bridles_ok","pigtails_ok","pulleys_ok"]}
              photos={inspectionPhotos} answers={answers} uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} onAnswer={updateAnswer} />
          )}

          {/* STEP 7: Reparaciones */}
          {step === 7 && (
            <div className="space-y-5">
              <StepHeader title="Reparaciones y declaración" description="Una reparación declarada no es mala. Ocultarla sí reduce la confianza del comprador." />
              <ToggleField label="¿Hay reparaciones, daños o modificaciones?" value={hasInspectionRepairs}
                onChange={v => { setHasInspectionRepairs(v); updateAnswer("repairs_declared", v ? "pass" : "na"); }} />
              {hasInspectionRepairs && (
                <>
                  <Field label="Descripción de la reparación o daño">
                    <textarea value={repairNotes} onChange={e => setRepairNotes(e.target.value)} rows={4} className="input resize-none"
                      placeholder="Zona, tipo de daño, cómo fue reparado y cualquier detalle relevante." />
                  </Field>
                  <UploadBox photoId="repairs" photos={inspectionPhotos.repairs ?? []} uploading={uploadingPhotoId === "repairs"} onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} />
                </>
              )}
              <AnswerButtons checkId="repairs_declared" value={answers.repairs_declared} onChange={v => updateAnswer("repairs_declared", v)} />
            </div>
          )}

          {/* STEP 8: Resumen */}
          {step === 8 && (
            <div className="space-y-5">
              <StepHeader title="Cierre y resumen" description="Toma la foto final de presión, confirma si mantuvo aire y revisa el puntaje antes de publicar." />
              {/* Timer final */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB]">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">Prueba de presión final</p>
                      <p className="text-xs text-[#6B7280]">¿Ya pasaron 15-20 minutos? Toma la foto y responde el check.</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-[#111827] shrink-0">{formatTimer(timerSeconds)}</span>
                </div>
              </div>
              <UploadBox photoId="pressure_final" photos={inspectionPhotos.pressure_final ?? []} uploading={uploadingPhotoId === "pressure_final"} onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} />
              <AnswerButtons checkId="holds_pressure" value={answers.holds_pressure} onChange={v => updateAnswer("holds_pressure", v)} />

              {/* Score cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <ScoreBadge score={result.score} label={result.label} />
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">Anuncio</p>
                  <p className="mt-2 font-bold text-[#111827] leading-snug">{title}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">{form.currency} ${Number(form.price || 0).toLocaleString("es-CO")} · {form.city}</p>
                </div>
              </div>

              {/* Alertas */}
              {result.alerts.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-3 flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="h-4 w-4" /> Alertas del peritaje
                  </div>
                  <div className="space-y-2">
                    {result.alerts.map(a => <p key={a} className="text-sm text-amber-800">• {a}</p>)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-sm font-semibold text-emerald-700">Sin alertas críticas en el peritaje.</p>
                </div>
              )}

              {/* Checks resumen */}
              <div className="rounded-2xl border border-[#E5E7EB] p-4">
                <p className="mb-3 text-sm font-bold text-[#111827]">Resumen de checks</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {KITE_INSPECTION_CHECKS.map(check => (
                    <div key={check.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] px-3 py-2.5">
                      <span className="text-xs text-[#374151] leading-snug">{check.label}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${answerClass(answers[check.id])}`}>
                        {labelForAnswer(answers[check.id])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={back}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-5 py-3 text-sm font-bold text-[#374151] hover:bg-[#F9FAFB] transition-colors">
                <ChevronLeft className="h-4 w-4" /> Atrás
              </button>
            )}
            <button type="button" onClick={step === STEPS.length - 1 ? submit : next}
              disabled={submitting || !!uploadingPhotoId || uploadingCommercial}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white hover:bg-[#374151] disabled:opacity-60 transition-colors">
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Publicando...</>
              ) : step === STEPS.length - 1 ? (
                <><CheckCircle className="h-4 w-4" /> Publicar anuncio</>
              ) : (
                <>Continuar <ChevronRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </section>

        {/* ── Sidebar (solo desktop) ── */}
        <aside className="hidden xl:flex flex-col gap-4">
          {/* Score vivo */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827]">Peritaje vivo</p>
                <p className="text-xs text-[#6B7280]">Se actualiza con cada respuesta.</p>
              </div>
            </div>
            <ScoreBadge score={result.score} label={result.label} />
            <div className="mt-4 space-y-1.5 text-xs text-[#9CA3AF]">
              <p>Raw score: <span className="font-medium text-[#6B7280]">{result.rawScore}/100</span></p>
              <p>Fotos peritaje: <span className="font-medium text-[#6B7280]">{Object.values(inspectionPhotos).reduce((s, l) => s + (l?.length ?? 0), 0)}</span></p>
              <p>Versión: <span className="font-medium text-[#6B7280]">{KITE_INSPECTION_VERSION}</span></p>
            </div>
          </div>

          {/* Vista previa */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <p className="mb-3 text-sm font-bold text-[#111827]">Así se verá en el anuncio</p>
            <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Peritaje del vendedor</p>
              <p className={`mt-2 text-3xl font-bold tabular-nums ${scoreColor(result.score)}`}>{result.score}/100</p>
              <p className={`text-sm font-bold ${scoreColor(result.score)}`}>{result.label}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#9CA3AF]">
                Este peritaje fue realizado por el vendedor siguiendo la guía de Quiver Co. No reemplaza una revisión profesional independiente.
              </p>
            </div>
          </div>

          {/* Alertas en vivo */}
          {result.alerts.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" /> Alertas activas
              </div>
              <div className="space-y-1.5">
                {result.alerts.map(a => (
                  <p key={a} className="text-xs text-amber-800">• {a}</p>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5 border-b border-[#F3F4F6] pb-4">
      <h2 className="text-lg font-bold text-[#111827]">{title}</h2>
      <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-[#374151]">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value?: boolean; onChange: (v: boolean) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-[#374151]">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {[{ label: "Sí", value: true }, { label: "No", value: false }].map(opt => (
          <button key={String(opt.value)} type="button" onClick={() => onChange(opt.value)}
            className={`rounded-xl border-2 py-3 text-sm font-bold transition-colors ${
              value === opt.value
                ? "border-[#3B82F6] bg-blue-50 text-[#2563EB]"
                : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
            }`}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InspectionSection({ title, description, photoIds, checkIds, photos, answers, uploadingPhotoId, onUpload, onRemove, onAnswer }: {
  title: string; description: string; photoIds: string[]; checkIds: string[];
  photos: InspectionPhotos; answers: Answers; uploadingPhotoId: string | null;
  onUpload: (id: string, files: FileList) => void;
  onRemove: (id: string, url: string) => void;
  onAnswer: (id: string, v: InspectionAnswer) => void;
}) {
  return (
    <div className="space-y-5">
      <StepHeader title={title} description={description} />
      {photoIds.map(id => (
        <UploadBox key={id} photoId={id} photos={photos[id] ?? []} uploading={uploadingPhotoId === id} onUpload={onUpload} onRemove={onRemove} />
      ))}
      {checkIds.map(id => (
        <AnswerButtons key={id} checkId={id} value={answers[id]} onChange={v => onAnswer(id, v)} />
      ))}
    </div>
  );
}

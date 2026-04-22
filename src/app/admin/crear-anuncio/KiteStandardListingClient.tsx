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
  "Airush",
  "Cabrinha",
  "Core",
  "Duotone",
  "Eleveight",
  "F-One",
  "Flysurfer",
  "Naish",
  "North",
  "Ocean Rodeo",
  "Ozone",
  "Reedin",
  "Slingshot",
  "Otra",
];

const SIZES = ["4m", "5m", "6m", "7m", "8m", "9m", "10m", "11m", "12m", "13m", "14m", "15m", "16m", "17m", "18m"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2000 + 1 }, (_, index) => String(CURRENT_YEAR - index));

const CONDITIONS = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "COMO_NUEVO", label: "Como nuevo" },
  { value: "USADO", label: "Usado" },
];

const STEPS = [
  "Anuncio",
  "Fotos",
  "Aire",
  "Valvulas",
  "Estructura",
  "Tela",
  "Bridas",
  "Reparaciones",
  "Resumen",
];

const PHOTO_LABELS: Record<string, string> = {
  inflated_identity: "Cometa inflada completa",
  pressure_final: "Foto final de presion",
  main_valve: "Valvula principal",
  one_pump: "One pump / mangueras",
  leading_edge: "Leading edge",
  trailing_edge: "Trailing edge",
  bridles_left: "Bridas lado izquierdo",
  bridles_right: "Bridas lado derecho",
  repairs: "Reparaciones o danos",
};

const PHOTO_HELP: Record<string, string> = {
  inflated_identity: "La cometa debe verse completa, inflada, con marca/modelo/tamano visibles si es posible.",
  pressure_final: "Toma otra foto despues de 15-20 minutos. Debe verse firme y con forma similar.",
  main_valve: "Acercate a la valvula. Debe verse enfocada, cerrada y sin partes despegadas.",
  one_pump: "Muestra mangueras y conectores. Evita sombras fuertes sobre la zona.",
  leading_edge: "Captura el borde frontal completo o la seccion mas representativa.",
  trailing_edge: "Muestra el borde trasero extendido, sin cortar las puntas importantes.",
  bridles_left: "Muestra bridas, pigtails y puntos de conexion del lado izquierdo.",
  bridles_right: "Muestra bridas, pigtails y puntos de conexion del lado derecho.",
  repairs: "Foto cercana, bien enfocada, de cada reparacion, dano o modificacion declarada.",
};

const EXAMPLE_VARIANTS: Record<string, "kite" | "detail" | "lines" | "edge"> = {
  inflated_identity: "kite",
  pressure_final: "kite",
  main_valve: "detail",
  one_pump: "detail",
  leading_edge: "edge",
  trailing_edge: "edge",
  bridles_left: "lines",
  bridles_right: "lines",
  repairs: "detail",
};

const INITIAL_ANSWERS: Answers = {
  identity_match: undefined,
  inflates_shape: undefined,
  holds_pressure: undefined,
  main_valve_ok: undefined,
  one_pump_ok: undefined,
  leading_edge_ok: undefined,
  struts_ok: undefined,
  canopy_no_tears: undefined,
  canopy_no_severe_wear: undefined,
  trailing_edge_ok: undefined,
  bridles_ok: undefined,
  pigtails_ok: undefined,
  pulleys_ok: undefined,
  repairs_declared: undefined,
};

const INITIAL_FORM: ListingForm = {
  brand: "",
  customBrand: "",
  reference: "",
  size: "",
  year: "",
  condition: "USADO",
  price: "",
  currency: "COP",
  description: "",
  city: "",
  includesBar: undefined,
  includesBag: undefined,
};

function getCheck(id: string) {
  const check = KITE_INSPECTION_CHECKS.find((item) => item.id === id);
  if (!check) throw new Error(`Missing inspection check: ${id}`);
  return check;
}

function selectedBrand(form: ListingForm) {
  return form.brand === "Otra" ? form.customBrand.trim() : form.brand;
}

function buildTitle(form: ListingForm) {
  return [selectedBrand(form), form.reference.trim(), form.year, form.size]
    .filter(Boolean)
    .join(" ");
}

function labelForAnswer(answer?: InspectionAnswer) {
  if (answer === "pass") return "Aprobado";
  if (answer === "fail") return "No aprobado";
  if (answer === "na") return "No aplica";
  return "Pendiente";
}

function answerClass(answer?: InspectionAnswer) {
  if (answer === "pass" || answer === "na") return "bg-emerald-50 text-emerald-700";
  if (answer === "fail") return "bg-red-50 text-red-700";
  return "bg-[#F3F4F6] text-[#6B7280]";
}

function PhotoExample({ type, label }: { type: "kite" | "detail" | "lines" | "edge"; label: string }) {
  return (
    <div className="rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Ejemplo buena foto</span>
        <Camera className="h-4 w-4 text-[#9CA3AF]" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        <div className="absolute inset-3 rounded-md border border-dashed border-[#CBD5E1]" />
        {type === "kite" && (
          <>
            <div className="absolute left-[12%] top-[22%] h-[48%] w-[76%] rounded-t-full border-[10px] border-[#111827]" />
            <div className="absolute left-[20%] top-[34%] h-[28%] w-[60%] rounded-t-full border-t-8 border-[#3B82F6]" />
            <div className="absolute bottom-5 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-[#D1D5DB]" />
          </>
        )}
        {type === "edge" && (
          <>
            <div className="absolute left-[9%] top-[24%] h-8 w-[82%] rounded-full bg-[#111827]" />
            <div className="absolute left-[12%] top-[45%] h-2 w-[76%] rounded-full bg-[#3B82F6]" />
            <div className="absolute left-[18%] top-[58%] h-2 w-[64%] rounded-full bg-[#D1D5DB]" />
          </>
        )}
        {type === "detail" && (
          <>
            <div className="absolute left-[32%] top-[20%] h-[54%] w-[36%] rounded-xl border-8 border-[#111827] bg-[#F9FAFB]" />
            <div className="absolute left-[42%] top-[36%] h-12 w-12 rounded-full border-4 border-[#3B82F6] bg-white" />
            <div className="absolute bottom-5 left-1/2 h-2 w-20 -translate-x-1/2 rounded-full bg-[#D1D5DB]" />
          </>
        )}
        {type === "lines" && (
          <>
            <div className="absolute left-[18%] top-[18%] h-3 w-[64%] rounded-full bg-[#111827]" />
            <div className="absolute left-[22%] top-[34%] h-[1px] w-[56%] rotate-12 bg-[#3B82F6]" />
            <div className="absolute left-[22%] top-[46%] h-[1px] w-[56%] -rotate-12 bg-[#3B82F6]" />
            <div className="absolute left-[22%] top-[58%] h-[1px] w-[56%] bg-[#3B82F6]" />
            <div className="absolute bottom-5 left-[28%] h-8 w-8 rounded-full border-4 border-[#111827]" />
            <div className="absolute bottom-5 right-[28%] h-8 w-8 rounded-full border-4 border-[#111827]" />
          </>
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-[#374151]">{label}</p>
    </div>
  );
}

function AnswerButtons({
  checkId,
  value,
  onChange,
}: {
  checkId: string;
  value?: InspectionAnswer;
  onChange: (value: InspectionAnswer) => void;
}) {
  const check = getCheck(checkId);
  const options: { value: InspectionAnswer; label: string }[] = [
    { value: "pass", label: "Aprobado" },
    { value: "fail", label: "No aprobado" },
    ...(check.allowNa ? [{ value: "na" as const, label: "No aplica" }] : []),
  ];

  return (
    <div className="rounded-xl border border-[#E5E7EB] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111827]">{check.label}</p>
          <p className="mt-1 text-xs text-[#6B7280]">{check.weight} puntos</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                value === option.value
                  ? option.value === "fail"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UploadBox({
  photoId,
  photos,
  uploading,
  onUpload,
  onRemove,
}: {
  photoId: string;
  photos: string[];
  uploading: boolean;
  onUpload: (photoId: string, files: FileList) => void;
  onRemove: (photoId: string, url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <PhotoExample type={EXAMPLE_VARIANTS[photoId] ?? "detail"} label={PHOTO_LABELS[photoId]} />
      <div className="rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#111827]">{PHOTO_LABELS[photoId]}</p>
            <p className="mt-1 text-xs leading-relaxed text-[#6B7280]">{PHOTO_HELP[photoId]}</p>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={uploading}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold text-white hover:bg-[#374151] disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            Subir
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {photos.map((url) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB]">
                <img src={url} alt={PHOTO_LABELS[photoId]} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(photoId, url)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                  aria-label="Eliminar foto"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="mt-4 flex min-h-28 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] text-[#9CA3AF] hover:border-[#3B82F6] hover:text-[#3B82F6]"
          >
            <Camera className="mb-2 h-5 w-5" />
            <span className="text-sm font-semibold">Agregar foto de peritaje</span>
          </button>
        )}

        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) onUpload(photoId, event.target.files);
            event.currentTarget.value = "";
          }}
        />
      </div>
    </div>
  );
}

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

  function updateForm(patch: Partial<ListingForm>) {
    setForm((current) => ({ ...current, ...patch }));
    setError("");
  }

  function updateAnswer(checkId: string, value: InspectionAnswer) {
    setAnswers((current) => ({ ...current, [checkId]: value }));
    setError("");
  }

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo subir la foto");
    return data.url as string | undefined;
  }

  async function uploadCommercialImages(files: FileList) {
    setUploadingCommercial(true);
    try {
      const uploads = await Promise.all(Array.from(files).map(uploadFile));
      const urls = uploads.filter((url): url is string => Boolean(url));
      setCommercialPhotos((current) => [...current, ...urls].slice(0, 8));
    } finally {
      setUploadingCommercial(false);
    }
  }

  async function uploadInspectionImages(photoId: string, files: FileList) {
    setUploadingPhotoId(photoId);
    try {
      const uploads = await Promise.all(Array.from(files).map(uploadFile));
      const urls = uploads.filter((url): url is string => Boolean(url));
      setInspectionPhotos((current) => ({
        ...current,
        [photoId]: [...(current[photoId] ?? []), ...urls],
      }));
    } finally {
      setUploadingPhotoId(null);
    }
  }

  function removeInspectionPhoto(photoId: string, url: string) {
    setInspectionPhotos((current) => ({
      ...current,
      [photoId]: (current[photoId] ?? []).filter((item) => item !== url),
    }));
  }

  function formatTimer(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }

  function validateStep(currentStep = step) {
    if (currentStep === 0) {
      if (!selectedBrand(form)) return "Selecciona o escribe la marca.";
      if (!form.size) return "Selecciona el tamano.";
      if (!form.year) return "Selecciona el ano.";
      if (!form.condition) return "Selecciona el estado.";
      if (!form.price || Number(form.price) <= 0) return "Escribe un precio valido.";
      if (!form.city) return "Selecciona la ciudad.";
      if (form.includesBar === undefined) return "Indica si incluye barra y lineas.";
      if (form.includesBag === undefined) return "Indica si incluye maleta.";
      if (!form.description.trim()) return "Escribe una descripcion.";
    }
    if (currentStep === 1 && commercialPhotos.length === 0) return "Agrega al menos una foto comercial.";
    if (currentStep === 2) {
      if (!inspectionPhotos.inflated_identity?.length) return "Sube la foto de la cometa inflada completa.";
      if (!answers.identity_match || !answers.inflates_shape) return "Responde los checks iniciales de aire e identificacion.";
    }
    if (currentStep === 3) {
      if (!inspectionPhotos.main_valve?.length || !inspectionPhotos.one_pump?.length) return "Sube las fotos de valvula y one pump.";
      if (!answers.main_valve_ok || !answers.one_pump_ok) return "Responde todos los checks de valvulas.";
    }
    if (currentStep === 4) {
      if (!inspectionPhotos.leading_edge?.length) return "Sube la foto del leading edge.";
      if (!answers.leading_edge_ok || !answers.struts_ok) return "Responde todos los checks de estructura.";
    }
    if (currentStep === 5) {
      if (!inspectionPhotos.trailing_edge?.length) return "Sube la foto del trailing edge.";
      if (!answers.canopy_no_tears || !answers.canopy_no_severe_wear || !answers.trailing_edge_ok) return "Responde todos los checks de tela.";
    }
    if (currentStep === 6) {
      if (!inspectionPhotos.bridles_left?.length || !inspectionPhotos.bridles_right?.length) return "Sube fotos de bridas en ambos lados.";
      if (!answers.bridles_ok || !answers.pigtails_ok || !answers.pulleys_ok) return "Responde todos los checks de bridas.";
    }
    if (currentStep === 7) {
      if (hasInspectionRepairs === undefined) return "Indica si hay reparaciones, danos o modificaciones.";
      if (!answers.repairs_declared) return "Responde el check de reparaciones declaradas.";
      if (hasInspectionRepairs && !repairNotes.trim()) return "Describe la reparacion, dano o modificacion.";
      if (hasInspectionRepairs && !inspectionPhotos.repairs?.length) return "Sube al menos una foto de la reparacion o dano.";
    }
    if (currentStep === 8) {
      if (!inspectionPhotos.pressure_final?.length) return "Sube la foto final de la prueba de presion.";
      if (!answers.holds_pressure) return "Responde si la cometa mantuvo presion despues de la prueba.";
    }
    return "";
  }

  function next() {
    const validation = validateStep();
    if (validation) {
      setError(validation);
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    setError("");
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
    setError("");
  }

  async function submit() {
    const validations = STEPS.map((_, index) => validateStep(index)).filter(Boolean);
    if (validations.length) {
      setError(validations[0]);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const metadata = {
        reference: form.reference.trim() || undefined,
        year: form.year,
        includesBar: form.includesBar,
        includesBag: form.includesBag,
        hasRepairs: hasInspectionRepairs ?? false,
        repairs: hasInspectionRepairs
          ? [{ description: repairNotes.trim(), imageUrl: inspectionPhotos.repairs?.[0] }]
          : [],
        standardInspection: {
          version: KITE_INSPECTION_VERSION,
          source: "seller-admin-prototype",
          completedAt: new Date().toISOString(),
          score: result.score,
          rawScore: result.rawScore,
          label: result.label,
          alerts: result.alerts,
          answers,
          photos: inspectionPhotos,
          repairNotes: repairNotes.trim() || undefined,
        },
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: form.description.trim(),
          price: form.price,
          currency: form.currency,
          discipline: "KITESURF",
          equipmentType: "COMETA",
          condition: form.condition,
          brand: selectedBrand(form),
          size: form.size,
          city: form.city,
          images: commercialPhotos,
          metadata,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link href="/admin" className="mb-3 inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827]">
            <ChevronLeft className="h-4 w-4" />
            Volver al admin
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Crear anuncio con peritaje</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Flujo oculto para probar el Peritaje Estandar de cometa.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-[#1D4ED8]">
          <div className="flex items-center gap-2 font-bold">
            <ShieldCheck className="h-4 w-4" />
            Peritaje Estandar
          </div>
          <p className="mt-1 text-xs">14 checks, 8 fotos base y evidencia separada del anuncio.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="grid gap-2 md:grid-cols-9">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (index < step) setStep(index);
              }}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                index === step
                  ? "bg-[#111827] text-white"
                  : index < step
                    ? "bg-blue-50 text-[#2563EB] hover:bg-blue-100"
                    : "bg-[#F3F4F6] text-[#9CA3AF]"
              }`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
          {step === 0 && (
            <div className="space-y-5">
              <StepHeader title="Datos del anuncio" description="Este prototipo crea una cometa de kitesurf con peritaje estandar." />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Marca">
                  <select value={form.brand} onChange={(e) => updateForm({ brand: e.target.value })} className="input">
                    <option value="">Seleccionar marca</option>
                    {BRANDS.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                  </select>
                </Field>
                {form.brand === "Otra" && (
                  <Field label="Otra marca">
                    <input value={form.customBrand} onChange={(e) => updateForm({ customBrand: e.target.value })} className="input" placeholder="Escribe la marca" />
                  </Field>
                )}
                <Field label="Modelo / referencia">
                  <input value={form.reference} onChange={(e) => updateForm({ reference: e.target.value })} className="input" placeholder="Ej: Switchblade, Bandit, Pivot" />
                </Field>
                <Field label="Tamano">
                  <select value={form.size} onChange={(e) => updateForm({ size: e.target.value })} className="input">
                    <option value="">Seleccionar tamano</option>
                    {SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </Field>
                <Field label="Ano">
                  <select value={form.year} onChange={(e) => updateForm({ year: e.target.value })} className="input">
                    <option value="">Seleccionar ano</option>
                    {YEARS.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </Field>
                <Field label="Estado">
                  <select value={form.condition} onChange={(e) => updateForm({ condition: e.target.value })} className="input">
                    {CONDITIONS.map((condition) => <option key={condition.value} value={condition.value}>{condition.label}</option>)}
                  </select>
                </Field>
                <Field label="Precio">
                  <div className="flex gap-2">
                    <select value={form.currency} onChange={(e) => updateForm({ currency: e.target.value as "COP" | "USD" })} className="w-28 rounded-xl border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm">
                      <option value="COP">COP</option>
                      <option value="USD">USD</option>
                    </select>
                    <input value={form.price} onChange={(e) => updateForm({ price: e.target.value })} className="input" type="number" min={0} placeholder="0" />
                  </div>
                </Field>
                <Field label="Ciudad">
                  <CityPicker city={form.city} department={department} onCityChange={(city) => updateForm({ city })} onDepartmentChange={setDepartment} />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ToggleField label="Incluye barra y lineas" value={form.includesBar} onChange={(value) => updateForm({ includesBar: value })} />
                <ToggleField label="Incluye maleta" value={form.includesBag} onChange={(value) => updateForm({ includesBag: value })} />
              </div>

              <Field label="Descripcion">
                <textarea value={form.description} onChange={(e) => updateForm({ description: e.target.value })} rows={4} maxLength={1000} className="input resize-none" placeholder="Describe uso, estado general, accesorios incluidos y razon de venta." />
              </Field>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Titulo generado</p>
                <p className="mt-1 text-sm font-bold text-[#111827]">{title || "Completa marca, modelo, ano y tamano"}</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <StepHeader title="Fotos comerciales" description="Estas son las fotos bonitas del anuncio. El peritaje tendra sus propias fotos tecnicas." />
              <PhotoUploader images={commercialPhotos} onChange={setCommercialPhotos} uploading={uploadingCommercial} onUpload={uploadCommercialImages} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <StepHeader title="Identificacion y prueba de aire" description="La identificacion se hace con la cometa inflada. No pedimos foto desinflada en el piso." />
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2563EB]">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">Timer de presion</p>
                      <p className="text-xs text-[#6B7280]">Puedes seguir revisando mientras la cometa queda inflada.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold tabular-nums text-[#111827]">{formatTimer(timerSeconds)}</span>
                    <button type="button" onClick={() => { setTimerStartedAt(Date.now()); setNow(Date.now()); }} className="rounded-xl bg-[#111827] px-4 py-2 text-xs font-bold text-white hover:bg-[#374151]">
                      {timerStartedAt ? "Reiniciar" : "Iniciar"}
                    </button>
                  </div>
                </div>
              </div>
              <UploadBox photoId="inflated_identity" photos={inspectionPhotos.inflated_identity ?? []} uploading={uploadingPhotoId === "inflated_identity"} onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} />
              <AnswerButtons checkId="identity_match" value={answers.identity_match} onChange={(value) => updateAnswer("identity_match", value)} />
              <AnswerButtons checkId="inflates_shape" value={answers.inflates_shape} onChange={(value) => updateAnswer("inflates_shape", value)} />
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                La foto final de presion se pedira al final del peritaje. Deja la cometa inflada y continua con valvulas, estructura, tela y bridas.
              </div>
            </div>
          )}

          {step === 3 && (
            <InspectionSection
              title="Valvulas y one pump"
              description="Revisa cierre, fugas visibles, conectores y mangueras."
              photoIds={["main_valve", "one_pump"]}
              checkIds={["main_valve_ok", "one_pump_ok"]}
              photos={inspectionPhotos}
              answers={answers}
              uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages}
              onRemove={removeInspectionPhoto}
              onAnswer={updateAnswer}
            />
          )}

          {step === 4 && (
            <InspectionSection
              title="Estructura inflable"
              description="Revisa leading edge y costillas. Busca cortes, deformaciones y costuras abiertas."
              photoIds={["leading_edge"]}
              checkIds={["leading_edge_ok", "struts_ok"]}
              photos={inspectionPhotos}
              answers={answers}
              uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages}
              onRemove={removeInspectionPhoto}
              onAnswer={updateAnswer}
            />
          )}

          {step === 5 && (
            <InspectionSection
              title="Tela y borde de fuga"
              description="Revisa canopy, desgaste fuerte, moho, zonas quebradizas y trailing edge."
              photoIds={["trailing_edge"]}
              checkIds={["canopy_no_tears", "canopy_no_severe_wear", "trailing_edge_ok"]}
              photos={inspectionPhotos}
              answers={answers}
              uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages}
              onRemove={removeInspectionPhoto}
              onAnswer={updateAnswer}
            />
          )}

          {step === 6 && (
            <InspectionSection
              title="Bridas, pigtails y poleas"
              description="Revisa simetria, cortes, desgaste, puntos de conexion y movimiento de poleas."
              photoIds={["bridles_left", "bridles_right"]}
              checkIds={["bridles_ok", "pigtails_ok", "pulleys_ok"]}
              photos={inspectionPhotos}
              answers={answers}
              uploadingPhotoId={uploadingPhotoId}
              onUpload={uploadInspectionImages}
              onRemove={removeInspectionPhoto}
              onAnswer={updateAnswer}
            />
          )}

          {step === 7 && (
            <div className="space-y-6">
              <StepHeader title="Reparaciones y declaracion" description="Una reparacion declarada no necesariamente es mala. Ocultarla si reduce confianza." />
              <ToggleField
                label="Hay reparaciones, danos o modificaciones"
                value={hasInspectionRepairs}
                onChange={(value) => {
                  setHasInspectionRepairs(value);
                  updateAnswer("repairs_declared", value ? "pass" : "na");
                }}
              />
              {hasInspectionRepairs && (
                <>
                  <Field label="Descripcion de la reparacion o dano">
                    <textarea value={repairNotes} onChange={(e) => setRepairNotes(e.target.value)} rows={4} className="input resize-none" placeholder="Zona, tipo de dano, como fue reparado y cualquier detalle relevante." />
                  </Field>
                  <UploadBox photoId="repairs" photos={inspectionPhotos.repairs ?? []} uploading={uploadingPhotoId === "repairs"} onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} />
                </>
              )}
              <AnswerButtons checkId="repairs_declared" value={answers.repairs_declared} onChange={(value) => updateAnswer("repairs_declared", value)} />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <StepHeader title="Cierre y resumen" description="Toma la foto final de presion, confirma si mantuvo aire y revisa el puntaje antes de publicar." />
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2563EB]">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827]">Prueba de presion final</p>
                      <p className="text-xs text-[#6B7280]">Si ya pasaron 15-20 minutos, toma la foto final y responde el check.</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-[#111827]">{formatTimer(timerSeconds)}</span>
                </div>
              </div>
              <UploadBox photoId="pressure_final" photos={inspectionPhotos.pressure_final ?? []} uploading={uploadingPhotoId === "pressure_final"} onUpload={uploadInspectionImages} onRemove={removeInspectionPhoto} />
              <AnswerButtons checkId="holds_pressure" value={answers.holds_pressure} onChange={(value) => updateAnswer("holds_pressure", value)} />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Puntaje</p>
                  <p className="mt-2 text-4xl font-bold text-[#111827]">{result.score}/100</p>
                  <p className="mt-1 text-sm font-semibold text-[#2563EB]">{result.label}</p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Anuncio</p>
                  <p className="mt-2 text-lg font-bold text-[#111827]">{title}</p>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {form.currency} ${Number(form.price || 0).toLocaleString("es-CO")} · {form.city}
                  </p>
                </div>
              </div>

              {result.alerts.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="mb-3 flex items-center gap-2 font-bold text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    Alertas del peritaje
                  </div>
                  <div className="space-y-2">
                    {result.alerts.map((alert) => (
                      <p key={alert} className="text-sm text-amber-800">{alert}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  Sin alertas criticas en el peritaje.
                </div>
              )}

              <div className="rounded-2xl border border-[#E5E7EB] p-4">
                <p className="mb-3 text-sm font-bold text-[#111827]">Checks</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {KITE_INSPECTION_CHECKS.map((check) => (
                    <div key={check.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] px-3 py-2 text-xs">
                      <span className="text-[#374151]">{check.label}</span>
                      <span className={`shrink-0 rounded-full px-2 py-1 font-bold ${answerClass(answers[check.id])}`}>
                        {labelForAnswer(answers[check.id])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-5 py-2.5 text-sm font-bold text-[#374151] hover:bg-[#F9FAFB]">
                <ChevronLeft className="h-4 w-4" />
                Atras
              </button>
            )}
            <button
              type="button"
              onClick={step === STEPS.length - 1 ? submit : next}
              disabled={submitting || !!uploadingPhotoId || uploadingCommercial}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#374151] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : step === STEPS.length - 1 ? (
                <>
                  Publicar anuncio
                  <CheckCircle className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continuar
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Wind className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827]">Peritaje vivo</p>
                <p className="text-xs text-[#6B7280]">Se calcula con cada respuesta.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#111827] p-5 text-white">
              <p className="text-xs text-white/60">Puntaje actual</p>
              <p className="mt-1 text-4xl font-bold">{result.score}</p>
              <p className="text-sm font-semibold text-blue-200">{result.label}</p>
            </div>
            <div className="mt-4 space-y-2 text-xs text-[#6B7280]">
              <p>Raw score: {result.rawScore}/100</p>
              <p>Fotos de peritaje: {Object.values(inspectionPhotos).reduce((sum, list) => sum + (list?.length ?? 0), 0)}</p>
              <p>Version: {KITE_INSPECTION_VERSION}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <p className="text-sm font-bold text-[#111827]">Como se vera</p>
            <div className="mt-3 rounded-xl border border-[#E5E7EB] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Peritaje del vendedor</p>
              <p className="mt-2 text-2xl font-bold text-[#111827]">{result.score}/100</p>
              <p className="text-sm font-semibold text-[#2563EB]">{result.label}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">
                Este peritaje fue realizado por el vendedor siguiendo una guia de Quiver. No reemplaza una revision profesional.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-[#111827]">{title}</h2>
      <p className="mt-1 text-sm text-[#6B7280]">{description}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-[#374151]">{label}</span>
      {children}
    </label>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-[#374151]">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Si", value: true },
          { label: "No", value: false },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl border-2 py-2 text-sm font-bold transition-colors ${
              value === option.value
                ? "border-[#3B82F6] bg-blue-50 text-[#2563EB]"
                : "border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InspectionSection({
  title,
  description,
  photoIds,
  checkIds,
  photos,
  answers,
  uploadingPhotoId,
  onUpload,
  onRemove,
  onAnswer,
}: {
  title: string;
  description: string;
  photoIds: string[];
  checkIds: string[];
  photos: InspectionPhotos;
  answers: Answers;
  uploadingPhotoId: string | null;
  onUpload: (photoId: string, files: FileList) => void;
  onRemove: (photoId: string, url: string) => void;
  onAnswer: (checkId: string, value: InspectionAnswer) => void;
}) {
  return (
    <div className="space-y-6">
      <StepHeader title={title} description={description} />
      {photoIds.map((photoId) => (
        <UploadBox
          key={photoId}
          photoId={photoId}
          photos={photos[photoId] ?? []}
          uploading={uploadingPhotoId === photoId}
          onUpload={onUpload}
          onRemove={onRemove}
        />
      ))}
      {checkIds.map((checkId) => (
        <AnswerButtons
          key={checkId}
          checkId={checkId}
          value={answers[checkId]}
          onChange={(value) => onAnswer(checkId, value)}
        />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, ShieldX, ShieldAlert, Loader2, Upload, X } from "lucide-react";
import { isUploadCancelledError, uploadAsset } from "@/lib/clientUpload";

interface Props {
  status: string; // NONE | PENDING | APPROVED | REJECTED
  idUrl: string | null;
}

export default function VerificationRequest({ status, idUrl }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => uploadControllerRef.current?.abort(), []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const controller = new AbortController();
    uploadControllerRef.current = controller;
    setError(null);
    setUploading(true);
    setUploadedUrl(null);
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadAsset(file, {
        profile: "document",
        signal: controller.signal,
      });
      setUploadedUrl(url);
    } catch (uploadError) {
      if (!isUploadCancelledError(uploadError)) {
        setError("Error al subir la imagen");
      }
    } finally {
      if (uploadControllerRef.current === controller) {
        uploadControllerRef.current = null;
      }
      setUploading(false);
    }
  }

  function cancelUpload() {
    uploadControllerRef.current?.abort();
    uploadControllerRef.current = null;
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    setUploading(false);
  }

  async function handleSubmit() {
    if (!uploadedUrl) return;
    setSubmitting(true);
    const res = await fetch("/api/user/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationIdUrl: uploadedUrl }),
    });
    setSubmitting(false);
    if (res.ok) router.refresh();
    else { const d = await res.json(); setError(d.error ?? "Error al enviar"); }
  }

  if (status === "APPROVED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-sm font-bold text-emerald-800">Vendedor verificado</p>
          <p className="text-xs text-emerald-600 mt-0.5">Tu identidad fue confirmada por Quiver Co.</p>
        </div>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-800">Verificación en revisión</p>
          <p className="text-xs text-amber-700 mt-0.5">Recibimos tu cédula. Te notificaremos cuando la revisemos (24–48h).</p>
        </div>
        {idUrl ? (
          <a href={idUrl} target="_blank" rel="noopener noreferrer" className="ml-auto shrink-0">
            <img src={idUrl} alt="Cédula" className="w-12 h-12 object-cover rounded-lg border border-amber-200" />
          </a>
        ) : null}
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
          <ShieldX className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800">Verificación rechazada</p>
            <p className="text-xs text-red-600 mt-0.5">La imagen no fue válida. Sube una foto clara de tu cédula e inténtalo de nuevo.</p>
          </div>
        </div>
        <UploadArea inputRef={inputRef} preview={preview} uploading={uploading} uploadedUrl={uploadedUrl} error={error} onFile={handleFile} onCancelUpload={cancelUpload} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    );
  }

  // NONE
  return (
    <div className="p-5 bg-white border border-[#E5E7EB] rounded-2xl space-y-4">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#111827]">Solicitar verificación de identidad</p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Sube una foto de tu cédula de ciudadanía. Una vez verificado, aparecerá el badge ✓ en tus anuncios y generarás más confianza a los compradores.
          </p>
        </div>
      </div>
      <UploadArea inputRef={inputRef} preview={preview} uploading={uploading} uploadedUrl={uploadedUrl} error={error} onFile={handleFile} onCancelUpload={cancelUpload} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

function UploadArea({ inputRef, preview, uploading, uploadedUrl, error, onFile, onCancelUpload, onSubmit, submitting }: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  uploading: boolean;
  uploadedUrl: string | null;
  error: string | null;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelUpload: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onFile(e);
          e.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E7EB] hover:border-[#3B82F6] rounded-xl py-6 transition-colors disabled:opacity-60"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Vista previa" className="h-24 object-contain rounded-lg" />
        ) : (
          <>
            <Upload className="w-6 h-6 text-[#9CA3AF]" />
            <span className="text-sm text-[#6B7280]">Toca para subir foto de cédula</span>
          </>
        )}
        {uploading && <Loader2 className="w-4 h-4 animate-spin text-[#3B82F6]" />}
      </button>
      {uploading && (
        <button
          type="button"
          onClick={onCancelUpload}
          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancelar subida
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={!uploadedUrl || submitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Enviar para revisión
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, X, Truck, Upload, XCircle } from "lucide-react";
import { uploadAsset } from "@/lib/clientUpload";

interface Props {
  orderId: string;
  status: string;
  role: "buyer" | "seller";
  hasReview: boolean;
}

// ── Ship Modal ────────────────────────────────────────────────────────────────

function ShipModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (proofUrl: string) => void;
  onCancel: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  async function handleFile(file: File) {
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadAsset(file);
      setProofUrl(url);
      setPreview(URL.createObjectURL(file));
    } catch {
      setUploadError("Error subiendo la imagen, intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleConfirm() {
    if (!proofUrl) { setUploadError("Debes subir la prueba de envío."); return; }
    setConfirming(true);
    await onConfirm(proofUrl);
    setConfirming(false);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151]">
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Truck className="w-5 h-5 text-[#3B82F6]" />
        </div>

        <div>
          <h3 className="text-base font-bold text-[#111827] mb-1">Confirmar envío</h3>
          <p className="text-sm text-[#6B7280]">
            Sube una foto de la guía o recibo de envío como comprobante. El comprador tendrá 15 días para confirmar la entrega.
          </p>
        </div>

        {/* Upload area */}
        <div>
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB]">
              <img src={preview} alt="Prueba de envío" className="w-full h-40 object-cover" />
              <button
                onClick={() => { setProofUrl(null); setPreview(null); }}
                className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow"
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full h-32 border-2 border-dashed border-[#E5E7EB] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#3B82F6] hover:bg-blue-50 transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#9CA3AF]" />
                  <span className="text-sm text-[#6B7280]">Toca para subir foto o documento</span>
                  <span className="text-xs text-[#9CA3AF]">JPG, PNG, PDF</span>
                </>
              )}
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm border border-[#E5E7EB] rounded-xl text-[#374151] hover:bg-[#F9FAFB] font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!proofUrl || confirming}
            className="flex-1 py-2.5 text-sm bg-[#111827] hover:bg-[#374151] text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmar envío
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Cancel Modal ──────────────────────────────────────────────────────────────

function CancelModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151]">
          <X className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#111827] mb-1">¿Cancelar esta orden?</h3>
          <p className="text-sm text-[#6B7280]">
            El artículo volverá a estar disponible en el marketplace. Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm border border-[#E5E7EB] rounded-xl text-[#374151] hover:bg-[#F9FAFB] font-medium transition-colors"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill={(hovered || value) >= star ? "#F59E0B" : "none"}
            stroke={(hovered || value) >= star ? "#F59E0B" : "#D1D5DB"}
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OrderActions({ orderId, status, role, hasReview }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [extendedMsg, setExtendedMsg] = useState(false);

  // Review state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");

  async function callApi(path: string, method = "PATCH", body?: object) {
    setLoading(true);
    await fetch(`/api/orders/${orderId}/${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    setLoading(false);
    router.refresh();
  }

  async function handleShipConfirm(proofUrl: string) {
    setShowShipModal(false);
    await callApi("ship", "PATCH", { shippingProofUrl: proofUrl });
  }

  async function handleCancel() {
    setLoading(true);
    await fetch(`/api/orders/${orderId}/cancel`, { method: "PATCH" });
    setLoading(false);
    setShowCancelModal(false);
    router.refresh();
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setReviewError("Selecciona una calificación"); return; }
    setLoading(true);
    setReviewError("");
    const res = await fetch(`/api/orders/${orderId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    setLoading(false);
    if (res.ok) {
      setReviewSubmitted(true);
      router.refresh();
    } else {
      const data = await res.json();
      setReviewError(data.error || "Error al enviar la reseña");
    }
  }

  // Who can cancel?
  const canCancel =
    (role === "buyer" && status === "PENDING") ||
    (role === "seller" && (status === "PENDING" || status === "PAID"));

  return (
    <>
      <div className="mt-4 space-y-3">

        {/* Seller + PAID: mark as shipped */}
        {role === "seller" && status === "PAID" && (
          <button
            onClick={() => setShowShipModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Truck className="w-4 h-4" />
            Marcar como enviado
          </button>
        )}

        {/* Buyer + SHIPPED: confirm or extend */}
        {role === "buyer" && status === "SHIPPED" && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => callApi("deliver")}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirmar recepción
            </button>
            <button
              onClick={async () => {
                setLoading(true);
                await fetch(`/api/orders/${orderId}/extend`, { method: "PATCH" });
                setLoading(false);
                setExtendedMsg(true);
                router.refresh();
              }}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              Todavía no ha llegado
            </button>
          </div>
        )}

        {extendedMsg && (
          <p className="text-sm text-emerald-700 font-medium">Plazo extendido 15 días más.</p>
        )}

        {/* Buyer + DELIVERED + no review yet */}
        {role === "buyer" && status === "DELIVERED" && !hasReview && !reviewSubmitted && (
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#111827]">¿Cómo fue tu experiencia con el vendedor?</h4>
            <form onSubmit={submitReview} className="space-y-3">
              <StarRating value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos cómo fue la transacción (opcional)"
                rows={3}
                className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#111827] placeholder-[#9CA3AF] resize-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              />
              {reviewError && <p className="text-xs text-red-600">{reviewError}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Enviar reseña
              </button>
            </form>
          </div>
        )}

        {(reviewSubmitted || (role === "buyer" && status === "DELIVERED" && hasReview)) && (
          <p className="text-sm text-[#6B7280]">Ya dejaste tu reseña para este vendedor.</p>
        )}

        {/* Cancel button */}
        {canCancel && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
          >
            Cancelar orden
          </button>
        )}
      </div>

      {showShipModal && (
        <ShipModal
          onConfirm={handleShipConfirm}
          onCancel={() => setShowShipModal(false)}
        />
      )}

      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onCancel={() => setShowCancelModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}

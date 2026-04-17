"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Eye, Pencil, PauseCircle, PlayCircle,
  CheckCircle, Loader2, X,
} from "lucide-react";
import Link from "next/link";

interface Props {
  listingId: string;
  currentStatus: string;
}

function SoldModal({ onConfirm, onCancel, loading }: { onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151]">
          <X className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
          <CheckCircle className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-base font-bold text-[#111827] mb-1">¿Marcar como vendido?</h3>
        <p className="text-sm text-[#6B7280] mb-5">El anuncio dejará de aparecer en el catálogo. Podrás reactivarlo si lo necesitas.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm border border-[#E5E7EB] rounded-xl text-[#374151] hover:bg-[#F9FAFB] font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ListingActions({ listingId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);

  async function changeStatus(status: string) {
    setLoading(status);
    setShowSoldConfirm(false);
    await fetch(`/api/listings/${listingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);
    router.refresh();
  }

  const isPaused = currentStatus === "PAUSED";
  const isActive = currentStatus === "ACTIVE";
  const isSold   = currentStatus === "SOLD";

  return (
    <>
      <div className="flex items-center gap-2 mt-1 flex-wrap">

        <Link
          href={`/equipo/${listingId}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Ver
        </Link>

        {!isSold && (
          <Link
            href={`/equipo/${listingId}/editar`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Editar
          </Link>
        )}

        {(isActive || isPaused) && (
          <button
            onClick={() => changeStatus(isActive ? "PAUSED" : "ACTIVE")}
            disabled={!!loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors disabled:opacity-50 ${
              isActive
                ? "text-amber-600 border-amber-200 hover:bg-amber-50"
                : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {loading === (isActive ? "PAUSED" : "ACTIVE")
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : isActive ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />
            }
            {isActive ? "Pausar" : "Reactivar"}
          </button>
        )}

        {(isActive || isPaused) && (
          <button
            onClick={() => setShowSoldConfirm(true)}
            disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Vendido
          </button>
        )}

        {isSold && (
          <button
            onClick={() => changeStatus("ACTIVE")}
            disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
          >
            {loading === "ACTIVE" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
            Reactivar
          </button>
        )}
      </div>

      {showSoldConfirm && (
        <SoldModal
          onConfirm={() => changeStatus("SOLD")}
          onCancel={() => setShowSoldConfirm(false)}
          loading={loading === "SOLD"}
        />
      )}
    </>
  );
}

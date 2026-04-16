"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye, Pencil, PauseCircle, PlayCircle,
  CheckCircle, Loader2, ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface Props {
  listingId: string;
  currentStatus: string;
}

export default function ListingActions({ listingId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function changeStatus(status: string) {
    setLoading(status);
    setShowSoldConfirm(false);
    setMenuOpen(false);
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
    <div className="flex items-center gap-2 mt-1 flex-wrap">

      {/* Ver anuncio */}
      <Link
        href={`/equipo/${listingId}`}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
      >
        <Eye className="w-3.5 h-3.5" /> Ver
      </Link>

      {/* Editar */}
      {!isSold && (
        <Link
          href={`/equipo/${listingId}/editar`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Editar
        </Link>
      )}

      {/* Pausar / Reactivar */}
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
            : isActive
              ? <PauseCircle className="w-3.5 h-3.5" />
              : <PlayCircle  className="w-3.5 h-3.5" />
          }
          {isActive ? "Pausar" : "Reactivar"}
        </button>
      )}

      {/* Marcar como vendido — con confirmación */}
      {(isActive || isPaused) && (
        <div className="relative">
          <button
            onClick={() => setShowSoldConfirm(!showSoldConfirm)}
            disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
          >
            {loading === "SOLD"
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <CheckCircle className="w-3.5 h-3.5" />
            }
            Vendido
            <ChevronDown className={`w-3 h-3 transition-transform ${showSoldConfirm ? "rotate-180" : ""}`} />
          </button>

          {showSoldConfirm && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-3 z-10">
              <p className="text-xs text-[#374151] font-medium mb-1">¿Marcar como vendido?</p>
              <p className="text-xs text-[#9CA3AF] mb-3">El anuncio dejará de aparecer en el catálogo.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSoldConfirm(false)}
                  className="flex-1 py-1.5 text-xs border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => changeStatus("SOLD")}
                  className="flex-1 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deshacer vendido */}
      {isSold && (
        <button
          onClick={() => changeStatus("ACTIVE")}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          {loading === "ACTIVE"
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <PlayCircle className="w-3.5 h-3.5" />
          }
          Reactivar
        </button>
      )}
    </div>
  );
}

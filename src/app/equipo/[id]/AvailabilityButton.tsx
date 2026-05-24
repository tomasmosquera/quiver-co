"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, XCircle, ShoppingBag } from "lucide-react";

type BuyerStatus = "NONE" | "PENDING" | "CONFIRMED" | "REJECTED";

interface Props {
  listingId: string;
  isGloballyConfirmed: boolean;
  confirmedUntil: string | null;      // ISO string, solo si isGloballyConfirmed
  buyerStatus: BuyerStatus;
  isLoggedIn: boolean;
}

export default function AvailabilityButton({
  listingId,
  isGloballyConfirmed,
  confirmedUntil,
  buyerStatus,
  isLoggedIn,
}: Props) {
  const [status, setStatus] = useState<BuyerStatus>(buyerStatus);
  const [loading, setLoading] = useState(false);

  // Si el anuncio tiene confirmación global vigente, mostrar "Comprar" directamente
  if (isGloballyConfirmed) {
    const until = confirmedUntil
      ? new Date(confirmedUntil).toLocaleDateString("es-CO", { day: "numeric", month: "long" })
      : null;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl text-xs font-semibold">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Disponibilidad confirmada{until ? ` hasta el ${until}` : ""}
        </div>
        <Link
          href={`/checkout/${listingId}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#111827] hover:bg-[#374151] text-white font-bold rounded-xl transition-colors text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Comprar
        </Link>
      </div>
    );
  }

  async function requestAvailability() {
    if (!isLoggedIn) {
      window.location.href = `/login?callbackUrl=/equipo/${listingId}`;
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) setStatus("PENDING");
    } finally {
      setLoading(false);
    }
  }

  if (status === "CONFIRMED") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl text-xs font-semibold">
          <CheckCircle className="w-4 h-4 shrink-0" />
          El vendedor confirmó que está disponible
        </div>
        <Link
          href={`/checkout/${listingId}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#111827] hover:bg-[#374151] text-white font-bold rounded-xl transition-colors text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Comprar
        </Link>
      </div>
    );
  }

  if (status === "PENDING") {
    return (
      <div className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-50 text-amber-700 font-semibold rounded-xl text-sm cursor-default">
        <Clock className="w-4 h-4 shrink-0" />
        Esperando confirmación del vendedor...
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="space-y-2">
        <div className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 font-semibold rounded-xl text-sm cursor-default">
          <XCircle className="w-4 h-4 shrink-0" />
          El vendedor indicó que ya no está disponible
        </div>
        <button
          onClick={requestAvailability}
          disabled={loading}
          className="w-full text-xs text-[#6B7280] hover:text-[#111827] underline transition-colors"
        >
          Volver a consultar disponibilidad
        </button>
      </div>
    );
  }

  // NONE
  return (
    <button
      onClick={requestAvailability}
      disabled={loading}
      className="w-full flex items-center justify-center py-3.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
    >
      {loading ? "Enviando solicitud..." : "Confirmar disponibilidad"}
    </button>
  );
}

"use client";

import Link from "next/link";
import type { MetaConsentState } from "@/lib/meta/consent";

export default function CookieConsentBanner({
  open,
  consent,
  onAccept,
  onReject,
  onClose,
}: {
  open: boolean;
  consent: MetaConsentState;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const canClose = consent !== "unknown";

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#1F2937] bg-[#111827] p-4 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-white">Cookies de marketing</p>
            <p className="mt-1 text-sm leading-relaxed text-[#D1D5DB]">
              Usamos cookies necesarias para operar la plataforma. Con tu permiso,
              activamos Meta para medir visitas, registros y compras. Puedes aceptar
              o rechazar y cambiar esta decision luego desde el footer.
            </p>
            <p className="mt-2 text-xs text-[#9CA3AF]">
              Mas informacion en la{" "}
              <Link href="/privacidad" className="text-[#93C5FD] hover:text-white underline">
                Politica de privacidad
              </Link>
              .
            </p>
          </div>

          {canClose ? (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-[#374151] px-3 py-1 text-xs font-semibold text-[#D1D5DB] transition-colors hover:border-[#4B5563] hover:text-white"
            >
              Cerrar
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onReject}
            className="rounded-2xl border border-[#374151] px-4 py-2.5 text-sm font-semibold text-[#D1D5DB] transition-colors hover:border-[#4B5563] hover:text-white"
          >
            {consent === "denied" ? "Mantener rechazadas" : "Rechazar marketing"}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-2xl bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            {consent === "granted" ? "Mantener activadas" : "Aceptar marketing"}
          </button>
        </div>
      </div>
    </div>
  );
}

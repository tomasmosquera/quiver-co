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
      <div className="mx-auto max-w-4xl rounded-3xl border border-[#1F2937] bg-[#111827] p-5 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-wide text-[#BFDBFE]">
              Preferencias de cookies
            </p>
            <h2 className="mt-1 text-xl font-bold">
              Elige si quieres activar medición publicitaria de Meta
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#D1D5DB]">
              Usamos cookies necesarias para autenticación y funcionamiento. Con tu permiso,
              también activamos Meta Pixel y Conversions API para medir búsquedas, registros,
              contactos, favoritos, checkouts y compras asociadas a campañas de Facebook e
              Instagram.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#9CA3AF]">
              Puedes cambiar esta decisión cuando quieras desde el footer o revisar más detalle
              en la{" "}
              <Link href="/privacidad" className="text-[#93C5FD] hover:text-white underline">
                Política de privacidad
              </Link>.
            </p>
          </div>

          {canClose ? (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-[#374151] px-3 py-1 text-xs font-semibold text-[#D1D5DB] hover:border-[#4B5563] hover:text-white transition-colors"
            >
              Cerrar
            </button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl bg-[#0F172A] p-4 text-sm text-[#D1D5DB] sm:grid-cols-2">
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4">
            <p className="font-semibold text-white">Necesarias</p>
            <p className="mt-1 text-[#9CA3AF]">
              Siempre activas para inicio de sesión, seguridad y operación de la plataforma.
            </p>
          </div>
          <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-4">
            <p className="font-semibold text-white">Marketing y medición</p>
            <p className="mt-1 text-[#9CA3AF]">
              Meta Pixel + CAPI para atribución publicitaria y audiencias de anuncios.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onReject}
            className="rounded-2xl border border-[#374151] px-5 py-3 text-sm font-semibold text-[#D1D5DB] hover:border-[#4B5563] hover:text-white transition-colors"
          >
            {consent === "denied" ? "Mantener rechazadas" : "Rechazar marketing"}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-2xl bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            {consent === "granted" ? "Mantener activadas" : "Aceptar marketing"}
          </button>
        </div>
      </div>
    </div>
  );
}

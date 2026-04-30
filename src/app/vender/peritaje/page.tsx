"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wind, Loader2 } from "lucide-react";
import KiteStandardListingClient, { PeritajePrefill } from "@/app/admin/crear-anuncio/KiteStandardListingClient";

export default function VenderPeritajePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prefill, setPrefill] = useState<PeritajePrefill | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("quiver-vender-draft");
    if (!raw) {
      // No draft — redirect back to /vender
      router.replace("/vender");
      return;
    }
    try {
      const parsed = JSON.parse(raw) as PeritajePrefill;
      setPrefill(parsed);
    } catch {
      router.replace("/vender");
      return;
    }
    setReady(true);
  }, [router]);

  if (status === "loading" || !ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#9CA3AF]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <Wind className="w-10 h-10 text-[#3B82F6]" />
        <h1 className="text-2xl font-bold text-[#111827]">Inicia sesión para publicar</h1>
        <p className="text-[#6B7280]">Necesitas una cuenta para vender en Quiver Co.</p>
        <Link
          href="/login"
          className="px-6 py-3 bg-[#111827] text-white rounded-xl font-semibold hover:bg-[#374151] transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <KiteStandardListingClient
          backHref="/vender"
          backLabel="Volver"
          initialStep={2}
          prefillData={prefill ?? undefined}
        />
      </div>
    </div>
  );
}

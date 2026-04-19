"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerificationActions({ userId, idUrl }: { userId: string; idUrl: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function act(action: "approve" | "reject") {
    setLoading(action);
    await fetch(`/api/admin/users/${userId}/verification`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <a href={idUrl} target="_blank" rel="noopener noreferrer">
        <img src={idUrl} alt="Cédula" className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB] hover:opacity-80 transition-opacity" />
      </a>
      <button
        onClick={() => act("approve")}
        disabled={!!loading}
        title="Aprobar"
        className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading === "approve" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
        Aprobar
      </button>
      <button
        onClick={() => act("reject")}
        disabled={!!loading}
        title="Rechazar"
        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading === "reject" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
        Rechazar
      </button>
    </div>
  );
}

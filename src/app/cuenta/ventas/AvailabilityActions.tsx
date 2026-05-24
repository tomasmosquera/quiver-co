"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export default function AvailabilityActions({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"confirm" | "reject" | null>(null);

  async function act(action: "confirm" | "reject") {
    setLoading(action);
    await fetch(`/api/availability/${requestId}/${action}`, { method: "PATCH" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => act("confirm")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Disponible
      </button>
      <button
        onClick={() => act("reject")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 disabled:opacity-50 text-red-600 border border-red-200 text-xs font-semibold rounded-xl transition-colors"
      >
        <XCircle className="w-3.5 h-3.5" />
        No disponible
      </button>
    </div>
  );
}

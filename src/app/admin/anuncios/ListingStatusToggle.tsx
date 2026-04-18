"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ListingStatusToggle({
  listingId,
  currentStatus,
}: {
  listingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const OPTIONS = [
    { value: "ACTIVE",  label: "Activar" },
    { value: "PAUSED",  label: "Pausar" },
    { value: "REMOVED", label: "Eliminar" },
  ].filter(o => o.value !== currentStatus);

  async function changeStatus(status: string) {
    setLoading(true);
    await fetch(`/api/listings/${listingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  if (loading) return <Loader2 className="w-4 h-4 animate-spin text-[#6B7280]" />;

  return (
    <select
      onChange={(e) => { if (e.target.value) changeStatus(e.target.value); }}
      defaultValue=""
      className="text-xs border border-[#E5E7EB] rounded-lg px-2 py-1 text-[#374151] bg-white cursor-pointer"
    >
      <option value="" disabled>Cambiar...</option>
      {OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

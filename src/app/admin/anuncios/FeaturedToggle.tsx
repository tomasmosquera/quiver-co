"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";

export default function FeaturedToggle({
  listingId,
  featured,
}: {
  listingId: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    setLoading(false);
    router.refresh();
  }

  if (loading) return <Loader2 className="w-4 h-4 animate-spin text-[#6B7280]" />;

  return (
    <button
      onClick={toggle}
      title={featured ? "Quitar destacado" : "Marcar como destacado"}
      className={`p-1 rounded-lg transition-colors ${
        featured
          ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
          : "text-[#D1D5DB] hover:text-amber-400 hover:bg-amber-50"
      }`}
    >
      <Star className={`w-4 h-4 ${featured ? "fill-amber-500" : ""}`} />
    </button>
  );
}

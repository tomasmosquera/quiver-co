"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import {
  generateMetaEventId,
  getCurrentMetaSourceUrl,
  trackMetaEvent,
} from "@/lib/meta/browser";

export default function FavoriteButton({ 
  listingId, 
  initiallySaved,
  variant = "icon"
}: { 
  listingId: string; 
  initiallySaved: boolean;
  variant?: "icon" | "button";
}) {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const previous = isSaved;
    const action = previous ? "REMOVE" : "ADD";
    const metaEventId = action === "ADD" ? generateMetaEventId("add-to-wishlist") : undefined;
    setIsSaved(!isSaved);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          action,
          metaEventId,
          metaSourceUrl: getCurrentMetaSourceUrl(),
        }),
      });
      if (!res.ok) {
        setIsSaved(previous);
      } else if (action === "ADD" && metaEventId) {
        trackMetaEvent(
          "AddToWishlist",
          {
            content_ids: [listingId],
            content_type: "product",
          },
          { eventId: metaEventId },
        );
      }
    } catch {
      setIsSaved(previous);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button 
        onClick={toggleFavorite}
        className={`flex-1 py-2.5 border rounded-xl transition-colors flex items-center justify-center gap-1.5 text-sm ${
          isSaved 
            ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" 
            : "border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151]"
        }`}
      >
        <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} /> {isSaved ? "Guardado" : "Guardar"}
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`rounded-full p-2 transition-colors border ${
        isSaved 
          ? "bg-red-50 border-red-100 text-red-500" 
          : "bg-white/80 border-transparent text-gray-400 hover:text-red-500 hover:bg-white"
      }`}
    >
      <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
    </button>
  );
}

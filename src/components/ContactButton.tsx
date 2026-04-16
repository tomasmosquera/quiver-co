"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";

export default function ContactButton({ listingId, isLoggedIn }: { listingId: string; isLoggedIn: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleContact() {
    if (!isLoggedIn) { router.push("/login"); return; }
    setLoading(true);
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    const data = await res.json();
    if (res.ok) router.push(`/mensajes/${data.conversationId}`);
    else setLoading(false);
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="w-full py-3 bg-[#3B82F6] hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
      Contactar vendedor
    </button>
  );
}

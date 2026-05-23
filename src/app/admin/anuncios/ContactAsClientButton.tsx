"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X } from "lucide-react";

interface Props {
  listingId: string;
  listingTitle: string;
}

export default function ContactAsClientButton({ listingId, listingTitle }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fakeName, setFakeName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setError(null);
    if (!fakeName.trim() || !message.trim()) {
      setError("Completa el nombre y el mensaje.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ghost-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, fakeName, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al enviar");
        return;
      }
      setOpen(false);
      setFakeName("");
      setMessage("");
      router.push(`/admin/mensajes/${data.conversationId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] hover:underline font-medium"
        title="Contactar como cliente"
      >
        Contactar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#111827]">Contactar como cliente</h2>
                <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{listingTitle}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Nombre del cliente (falso)
                </label>
                <input
                  value={fakeName}
                  onChange={(e) => setFakeName(e.target.value)}
                  placeholder="ej. Carlos Rueda"
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">Mensaje</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="ej. Hola, me interesa tu equipo, ¿sigue disponible?"
                  rows={4}
                  maxLength={1000}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] resize-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </div>

            <p className="text-[10px] text-[#9CA3AF] text-center">
              El vendedor recibirá el mensaje como si viniera de un cliente real.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

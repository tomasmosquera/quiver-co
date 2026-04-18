"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, X } from "lucide-react";

export default function DeleteListingButton({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      setShowModal(false);
      router.refresh();
    }
  }

  const modal = showModal && mounted && createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#374151]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>

        <div>
          <h3 className="text-base font-bold text-[#111827] mb-1">Eliminar definitivamente</h3>
          <p className="text-sm text-[#6B7280]">
            ¿Seguro que quieres borrar <span className="font-semibold text-[#111827]">"{listingTitle}"</span>?
            Esto eliminará el anuncio, sus imágenes en Cloudinary, órdenes y conversaciones.
            <span className="block mt-1 font-semibold text-red-600">Esta acción es irreversible.</span>
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 py-2.5 text-sm border border-[#E5E7EB] rounded-xl text-[#374151] hover:bg-[#F9FAFB] font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
        title="Eliminar definitivamente"
      >
        Eliminar
      </button>
      {modal}
    </>
  );
}

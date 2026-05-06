"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, X, Check } from "lucide-react";

export default function EditCreatedAtButton({
  listingId,
  createdAt,
}: {
  listingId: string;
  createdAt: Date;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(
    new Date(createdAt).toISOString().slice(0, 16)
  );

  async function save() {
    setLoading(true);
    await fetch(`/api/admin/listings/${listingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ createdAt: value }),
    });
    setLoading(false);
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        title="Editar fecha"
        className="flex items-center gap-1 text-[#6B7280] hover:text-[#111827] transition-colors group"
      >
        <span className="text-xs tabular-nums">
          {new Date(createdAt).toLocaleDateString("es-CO", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>
        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-xs border border-[#D1D5DB] rounded-lg px-2 py-1 focus:outline-none focus:border-[#3B82F6]"
      />
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#6B7280]" />
      ) : (
        <>
          <button
            onClick={save}
            className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="Guardar"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditing(false)}
            className="p-1 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

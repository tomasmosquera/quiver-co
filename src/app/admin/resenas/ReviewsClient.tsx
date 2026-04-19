"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pencil, Trash2, X, Check, Loader2, Search } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  reviewer: { name: string | null; email: string };
  subject: { name: string | null; email: string };
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
        >
          <Star className={`w-5 h-5 ${s <= (hover || value) ? "text-amber-400 fill-amber-400" : "text-[#D1D5DB]"}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment ?? "");

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    setSaving(false);
    if (res.ok) { setEditing(false); router.refresh(); }
    else { const d = await res.json(); alert(d.error ?? "Error al guardar"); }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar esta reseña permanentemente?")) return;
    setDeleting(true);
    await fetch(`/api/admin/reviews/${review.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-xs text-[#9CA3AF]">
            <span className="font-semibold text-[#374151]">{review.reviewer.name ?? review.reviewer.email}</span>
            {" → "}
            <span className="font-semibold text-[#374151]">{review.subject.name ?? review.subject.email}</span>
          </p>
          <p className="text-xs text-[#9CA3AF]">{new Date(review.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button onClick={handleDelete} disabled={deleting} className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-600 transition-colors disabled:opacity-50">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 pt-2 border-t border-[#F3F4F6]">
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            rows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comentario (opcional)"
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Guardar
            </button>
            <button onClick={() => { setEditing(false); setRating(review.rating); setComment(review.comment ?? ""); }} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold rounded-lg transition-colors">
              <X className="w-3.5 h-3.5" /> Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-amber-400 fill-amber-400" : "text-[#D1D5DB]"}`} />
            ))}
          </div>
          {review.comment && <p className="text-sm text-[#374151] leading-relaxed">{review.comment}</p>}
        </div>
      )}
    </div>
  );
}

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [search, setSearch] = useState("");

  const q = search.toLowerCase().trim();
  const filtered = reviews.filter(r => {
    if (!q) return true;
    return (
      (r.reviewer.name ?? "").toLowerCase().includes(q) ||
      r.reviewer.email.toLowerCase().includes(q) ||
      (r.subject.name ?? "").toLowerCase().includes(q) ||
      r.subject.email.toLowerCase().includes(q) ||
      (r.comment ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Buscar por usuario o comentario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center text-[#6B7280]">
          {q ? `Sin resultados para "${search}"` : "No hay reseñas todavía."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => <ReviewRow key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}

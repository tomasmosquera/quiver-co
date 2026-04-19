"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    department: string | null;
    address: string | null;
    bio: string | null;
    verified: boolean;
    verificationStatus: string;
  };
}

export default function EditUserForm({ user }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name:               user.name               ?? "",
    email:              user.email              ?? "",
    phone:              user.phone              ?? "",
    city:               user.city               ?? "",
    department:         user.department         ?? "",
    address:            user.address            ?? "",
    bio:                user.bio                ?? "",
    verified:           user.verified,
    verificationStatus: user.verificationStatus ?? "NONE",
  });

  function set(field: keyof typeof form, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al guardar");
    }
  }

  const inputClass = "w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111827]">Información personal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Nombre</label>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Teléfono</label>
            <input type="text" value={form.phone} onChange={e => set("phone", e.target.value)} className={inputClass} placeholder="300 000 0000" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Ciudad</label>
            <input type="text" value={form.city} onChange={e => set("city", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Departamento</label>
            <input type="text" value={form.department} onChange={e => set("department", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Dirección</label>
            <input type="text" value={form.address} onChange={e => set("address", e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[#374151] block mb-1">Bio</label>
            <textarea rows={3} value={form.bio} onChange={e => set("bio", e.target.value)} className={inputClass + " resize-none"} />
          </div>
        </div>
      </section>

      <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#111827]">Verificación de identidad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1">Estado de verificación</label>
            <select value={form.verificationStatus} onChange={e => set("verificationStatus", e.target.value)} className={inputClass}>
              <option value="NONE">Sin solicitud</option>
              <option value="PENDING">Pendiente</option>
              <option value="APPROVED">Aprobado</option>
              <option value="REJECTED">Rechazado</option>
            </select>
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.verified}
                  onChange={e => set("verified", e.target.checked)}
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.verified ? "bg-emerald-500" : "bg-[#D1D5DB]"}`} />
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.verified ? "translate-x-5" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-medium text-[#374151]">Badge verificado visible</span>
            </label>
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600 font-medium">Cambios guardados correctamente.</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar cambios
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-sm font-semibold rounded-xl transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

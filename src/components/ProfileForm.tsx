"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import CityPicker from "@/components/CityPicker";

interface Props {
  initial: {
    name: string;
    phone: string;
    address: string;
    city: string;
    department: string;
    bio: string;
  };
}

export default function ProfileForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setSaved(true);
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">Nombre completo</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">Teléfono / WhatsApp</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            placeholder="Ej: 3001234567"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
          <p className="text-xs text-[#9CA3AF] mt-1">Se usa para coordinar envíos y compras</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Departamento y ciudad</label>
        <CityPicker
          department={form.department}
          city={form.city}
          onDepartmentChange={v => set("department", v)}
          onCityChange={v => set("city", v)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Dirección de envío</label>
        <input
          type="text"
          value={form.address}
          onChange={e => set("address", e.target.value)}
          placeholder="Ej: Cra 15 #93-40, Apto 801"
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">Se autocompleta al momento de comprar</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">Bio <span className="font-normal text-[#9CA3AF]">(opcional)</span></label>
        <textarea
          value={form.bio}
          onChange={e => set("bio", e.target.value)}
          placeholder="Cuéntanos un poco sobre ti: años practicando, disciplinas, spots favoritos..."
          rows={3}
          maxLength={300}
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] resize-none"
        />
        <p className="text-xs text-[#9CA3AF] mt-1">{form.bio.length}/300</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
        ) : saved ? (
          <><CheckCircle className="w-4 h-4" /> Guardado</>
        ) : (
          "Guardar cambios"
        )}
      </button>
    </form>
  );
}

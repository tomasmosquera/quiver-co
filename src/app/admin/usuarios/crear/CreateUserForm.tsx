"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function CreateUserForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name:       "",
    email:      "",
    phone:      "",
    city:       "",
    department: "",
    address:    "",
    password:   "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Error al crear el usuario");
      return;
    }

    router.push(`/admin/usuarios/${data.user.id}/editar`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">
            Nombre <span className="text-[#9CA3AF] font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">
            Email <span className="text-[#9CA3AF] font-normal">(opcional — se autogenera si se deja vacío)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            placeholder="usuario@ejemplo.com"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">
            Teléfono <span className="text-[#9CA3AF] font-normal">(opcional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            placeholder="Ej: 3001234567"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">
            Ciudad <span className="text-[#9CA3AF] font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.city}
            onChange={e => set("city", e.target.value)}
            placeholder="Ej: Bogotá"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">
            Departamento <span className="text-[#9CA3AF] font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.department}
            onChange={e => set("department", e.target.value)}
            placeholder="Ej: Cundinamarca"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#374151] mb-1">
            Dirección <span className="text-[#9CA3AF] font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={e => set("address", e.target.value)}
            placeholder="Ej: Calle 80 #45-10"
            className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#374151] mb-1">
          Contraseña <span className="text-[#9CA3AF] font-normal">(opcional — permite al usuario iniciar sesión)</span>
        </label>
        <input
          type="password"
          value={form.password}
          onChange={e => set("password", e.target.value)}
          placeholder="Dejar vacío si no necesita acceso"
          className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/admin/usuarios"
          className="px-5 py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>
          ) : (
            <><UserPlus className="w-4 h-4" /> Crear usuario</>
          )}
        </button>
      </div>
    </form>
  );
}

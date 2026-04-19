"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, ChevronDown } from "lucide-react";

const COLOMBIAN_BANKS = [
  "Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA Colombia",
  "Banco Popular", "Banco de Occidente", "Scotiabank Colpatria",
  "Banco Agrario", "Banco Caja Social", "Nequi", "Daviplata",
  "Nubank", "Lulo Bank", "Banco Falabella", "Banco Pichincha", "Otro",
];

interface Props {
  initial: {
    name: string;
    phone: string;
    department: string;
    city: string;
    address: string;
    bankName: string;
    bankAccountType: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
    bankIdDoc: string;
  };
}

export default function SellerProfileForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/user/seller-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
    }
  }

  if (success) return null;

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-semibold text-[#374151] mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#3B82F6] transition-colors"
      />
    </div>
  );

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Completa tu perfil de vendedor</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Necesitamos estos datos para enviarte el pago una vez confirmada la entrega.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Datos personales */}
        <div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Datos personales</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field("Nombre completo", "name", "text", "Como aparece en tu cédula")}
            {field("Teléfono / WhatsApp", "phone", "tel", "3001234567")}
            {field("Departamento", "department", "text", "Ej: Atlántico")}
            {field("Ciudad", "city", "text", "Ej: Barranquilla")}
          </div>
          <div className="mt-3">
            {field("Dirección", "address", "text", "Calle, carrera, barrio...")}
          </div>
        </div>

        {/* Datos bancarios */}
        <div>
          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Datos bancarios (para recibir el pago)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Banco</label>
              <div className="relative">
                <select
                  value={form.bankName}
                  onChange={e => set("bankName", e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none bg-white"
                >
                  <option value="">Seleccionar banco...</option>
                  {COLOMBIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Tipo de cuenta</label>
              <div className="relative">
                <select
                  value={form.bankAccountType}
                  onChange={e => set("bankAccountType", e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#3B82F6] transition-colors appearance-none bg-white"
                >
                  <option value="">Seleccionar tipo...</option>
                  <option value="ahorros">Cuenta de ahorros</option>
                  <option value="corriente">Cuenta corriente</option>
                  <option value="nequi">Nequi</option>
                  <option value="daviplata">Daviplata</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>
            {field("Número de cuenta", "bankAccountNumber", "text", "Ej: 123456789")}
            {field("Nombre del titular", "bankAccountHolder", "text", "Como aparece en el banco")}
            {field("Cédula del titular", "bankIdDoc", "text", "Ej: 1234567890")}
          </div>
        </div>

        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Guardar información
        </button>
      </form>
    </div>
  );
}

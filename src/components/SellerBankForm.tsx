"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark, Loader2 } from "lucide-react";

const BANKS = [
  "Bancolombia","Davivienda","BBVA","Banco de Bogotá","Nequi","Daviplata",
  "Banco Popular","Banco de Occidente","Colpatria","Itaú","Scotiabank Colpatria",
  "Banco AV Villas","Banco Agrario","Banco Falabella","Lulo Bank","Nu Colombia","Otro",
];

interface Props {
  orderId: string;
  listingTitle: string;
}

export default function SellerBankForm({ orderId, listingTitle }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    sellerBankName: "",
    sellerBankAccountType: "",
    sellerBankAccountNumber: "",
    sellerBankAccountHolder: "",
    sellerBankIdDoc: "",
  });

  function set(field: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const res = await fetch(`/api/orders/${orderId}/bank-info`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Error al guardar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-4">
      <div className="flex items-start gap-3">
        <Landmark className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900">Ingresa tus datos bancarios</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Para recibir el pago por <span className="font-semibold">"{listingTitle}"</span>, necesitamos los datos de la cuenta donde quieres recibir la transferencia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#374151] block mb-1">Banco</label>
          <select
            required
            value={form.sellerBankName}
            onChange={e => set("sellerBankName", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          >
            <option value="">Seleccionar banco</option>
            {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#374151] block mb-1">Tipo de cuenta</label>
          <select
            required
            value={form.sellerBankAccountType}
            onChange={e => set("sellerBankAccountType", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          >
            <option value="">Seleccionar tipo</option>
            <option value="ahorros">Ahorros</option>
            <option value="corriente">Corriente</option>
            <option value="nequi">Nequi</option>
            <option value="daviplata">Daviplata</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#374151] block mb-1">Número de cuenta / celular</label>
          <input
            required
            type="text"
            placeholder="Ej. 123456789"
            value={form.sellerBankAccountNumber}
            onChange={e => set("sellerBankAccountNumber", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#374151] block mb-1">Titular de la cuenta</label>
          <input
            required
            type="text"
            placeholder="Nombre completo del titular"
            value={form.sellerBankAccountHolder}
            onChange={e => set("sellerBankAccountHolder", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-[#374151] block mb-1">Cédula del titular</label>
          <input
            required
            type="text"
            placeholder="Número de cédula"
            value={form.sellerBankIdDoc}
            onChange={e => set("sellerBankIdDoc", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Guardar datos bancarios
      </button>
    </form>
  );
}

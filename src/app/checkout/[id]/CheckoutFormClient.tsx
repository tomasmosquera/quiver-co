"use client";

import { useState } from "react";
import { CheckCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { COLOMBIA, DEPARTMENTS } from "@/lib/colombia";
import WompiWidget from "@/components/WompiWidget";

interface Buyer {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
}

interface WompiData {
  reference: string;
  signature: string;
  amountInCents: number;
  currency: string;
}

export default function CheckoutFormClient({
  listingId,
  listingTitle,
  subtotal,
  sellerId,
  buyer,
  wompiPublicKey,
}: {
  listingId: string;
  listingTitle: string;
  subtotal: number;
  sellerId: string;
  buyer: Buyer | null;
  wompiPublicKey: string;
}) {
  const [loading, setLoading] = useState(false);
  const [wompiData, setWompiData] = useState<WompiData | null>(null);
  const router = useRouter();

  const [department, setDepartment] = useState(buyer?.department ?? "");
  const [city, setCity] = useState(buyer?.city ?? "");

  function getFormData(form: HTMLFormElement) {
    const formData = new FormData(form);
    const neighborhood = formData.get("buyerNeighborhood");
    const fullAddress = neighborhood
      ? `${formData.get("buyerAddress")} - Barrio: ${neighborhood}`
      : `${formData.get("buyerAddress")}`;
    const fullCity = `${city}, ${department}`;

    return {
      buyerName: formData.get("buyerName") as string,
      buyerIdDoc: formData.get("buyerIdDoc") as string,
      buyerPhone: formData.get("buyerPhone") as string,
      buyerCity: fullCity,
      buyerAddress: fullAddress,
      listingId,
      sellerId,
      amount: subtotal,
    };
  }

  async function handleManual(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = getFormData(e.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Ocurrió un error");

      const adminNumber = "573164780276";
      const waText = `Hola Quiver! Acabo de hacer la transferencia por $${subtotal.toLocaleString("es-CO")} para comprar el artículo: "${listingTitle}" (ID: ${listingId}). Aquí adjunto mi comprobante:`;
      window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(waText)}`, "_blank");

      router.push("/cuenta/compras");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Hubo un error al procesar tu orden. Intenta nuevamente.");
      setLoading(false);
    }
  }

  async function handleWompi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const data = getFormData(e.currentTarget);

    try {
      const res = await fetch("/api/wompi/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Ocurrió un error");
      setWompiData(result);
    } catch (err: any) {
      alert(err.message || "Error al preparar el pago.");
    } finally {
      setLoading(false);
    }
  }

  const shippingFields = (
    <div className="pt-4 border-t border-[#E5E7EB]">
      <h3 className="font-bold text-[#111827] mb-4 text-lg">Datos de envío</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">Nombre Completo</label>
          <input required type="text" name="buyerName" defaultValue={buyer?.name || ""} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="Juan Pérez" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Cédula</label>
            <input required type="text" name="buyerIdDoc" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="123456789" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Celular</label>
            <input required type="text" name="buyerPhone" defaultValue={buyer?.phone || ""} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="300 000 0000" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Departamento</label>
            <select required value={department} onChange={e => { setDepartment(e.target.value); setCity(""); }} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none bg-white">
              <option value="" disabled>Seleccione...</option>
              {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Ciudad / Municipio</label>
            <select required value={city} onChange={e => setCity(e.target.value)} disabled={!department} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400">
              <option value="" disabled>Seleccione...</option>
              {department && COLOMBIA[department]?.sort().map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">Dirección completa</label>
          <input required type="text" name="buyerAddress" defaultValue={buyer?.address ?? ""} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="Calle 123 #45-67 Apto 801" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1">Barrio <span className="text-[#9CA3AF] font-normal">(Opcional)</span></label>
          <input type="text" name="buyerNeighborhood" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="El Laguito" />
        </div>
      </div>
    </div>
  );

  // Una vez preparado el pago Wompi, mostrar el widget
  if (wompiData) {
    return (
      <div className="space-y-4 px-6 pb-6 md:px-8 md:pb-8 bg-[#F9FAFB] pt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <p className="font-semibold mb-1">Tu orden está lista</p>
          <p className="text-xs text-blue-600">Completa el pago con Wompi. Puedes usar tarjeta, PSE o Nequi.</p>
        </div>
        <WompiWidget
          publicKey={wompiPublicKey}
          reference={wompiData.reference}
          amountInCents={wompiData.amountInCents}
          signature={wompiData.signature}
          redirectUrl={`${process.env.NEXT_PUBLIC_BASE_URL ?? "https://quiverkite.com"}/cuenta/compras`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 px-6 pb-6 md:px-8 md:pb-8 bg-[#F9FAFB]">
      {/* Opción 1: Wompi */}
      <form onSubmit={handleWompi} className="space-y-5">
        {shippingFields}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <CreditCard className="w-5 h-5" />
          {loading ? "Preparando pago..." : "Pagar con tarjeta / PSE / Nequi"}
        </button>
        <p className="text-center text-xs text-[#9CA3AF]">Procesado de forma segura por Wompi.</p>
      </form>

      {/* Separador */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-xs text-[#9CA3AF]">o si prefieres transferencia manual</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* Opción 2: Manual */}
      <form onSubmit={handleManual}>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1DA851] disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <CheckCircle className="w-5 h-5" />
          {loading ? "Procesando..." : "Ya transferí, enviar comprobante"}
        </button>
        <p className="text-center text-xs text-[#9CA3AF] mt-2">Serás redirigido a WhatsApp para enviar el pantallazo.</p>
      </form>
    </div>
  );
}

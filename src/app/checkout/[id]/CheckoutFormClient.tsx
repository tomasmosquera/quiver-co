"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutFormClient({ 
  listingId, 
  listingTitle, 
  subtotal,
  sellerId 
}: { 
  listingId: string; 
  listingTitle: string; 
  subtotal: number;
  sellerId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      buyerName: formData.get("buyerName"),
      buyerIdDoc: formData.get("buyerIdDoc"),
      buyerPhone: formData.get("buyerPhone"),
      buyerCity: formData.get("buyerCity"),
      buyerAddress: formData.get("buyerAddress"),
      listingId,
      sellerId,
      amount: subtotal
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || "Ocurrió un error");

      // Abrir Whatsapp con el voucher
      const adminNumber = "573164780276";
      const waText = `Hola Quiver! Acabo de hacer la transferencia por $${subtotal.toLocaleString("es-CO")} para comprar el artículo: "${listingTitle}" (ID: ${listingId}). Aquí adjunto mi comprobante:`;
      window.open(`https://wa.me/${adminNumber}?text=${encodeURIComponent(waText)}`, "_blank");
      
      // Redirect internally
      router.push("/cuenta/compras");
      router.refresh(); // para que se refresque el estado activo
      
    } catch(err: any) {
      alert(err.message || "Hubo un error al procesar tu orden. Intenta nuevamente.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 md:px-8 md:pb-8 bg-[#F9FAFB]">
      
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h3 className="font-bold text-[#111827] mb-4 text-lg">Datos de envío</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Nombre Completo</label>
            <input required type="text" name="buyerName" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="Juan Pérez" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Cédula</label>
              <input required type="text" name="buyerIdDoc" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="123456789" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Celular</label>
              <input required type="text" name="buyerPhone" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="300 000 0000" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Ciudad / Municipio</label>
            <input required type="text" name="buyerCity" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="Cartagena, Bolívar" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Dirección completa</label>
            <input required type="text" name="buyerAddress" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="Calle 123 #45-67 Apto 801, Edificio Mar" />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1DA851] disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm"
      >
        <CheckCircle className="w-5 h-5" />
        {loading ? "Procesando..." : "Ya transferí, enviar comprobante"}
      </button>
      <p className="text-center text-xs text-[#9CA3AF] mt-3">Serás redirigido a WhatsApp para enviar el pantallazo.</p>
    </form>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { COLOMBIA, DEPARTMENTS } from "@/lib/colombia";

export default function CheckoutFormClient({ 
  listingId, 
  listingTitle, 
  subtotal,
  sellerId,
  buyer
}: { 
  listingId: string; 
  listingTitle: string; 
  subtotal: number;
  sellerId: string;
  buyer: any;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // States for dynamic dropdowns
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Concatenar el barrio a la dirección (opcional)
    const neighborhood = formData.get("buyerNeighborhood");
    const fullAddress = neighborhood 
      ? `${formData.get("buyerAddress")} - Barrio: ${neighborhood}`
      : `${formData.get("buyerAddress")}`;
      
    const fullCity = `${city}, ${department}`; // ej: "Cali, Valle del Cauca"

    const data = {
      buyerName: formData.get("buyerName"),
      buyerIdDoc: formData.get("buyerIdDoc"),
      buyerPhone: formData.get("buyerPhone"),
      buyerCity: fullCity,
      buyerAddress: fullAddress,
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
      router.refresh();
      
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
          
          {/* Departamentos y Ciudades */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Departamento</label>
              <select 
                required 
                value={department} 
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCity(""); // reset city when dept changes
                }}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none bg-white"
              >
                <option value="" disabled>Seleccione...</option>
                {DEPARTMENTS.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Ciudad / Municipio</label>
              <select 
                required 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                disabled={!department}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="" disabled>Seleccione...</option>
                {department && COLOMBIA[department]?.sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Dirección completa</label>
            <input required type="text" name="buyerAddress" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="Calle 123 #45-67 Apto 801, Edificio Mar" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Barrio <span className="text-[#9CA3AF] font-normal">(Opcional)</span></label>
            <input type="text" name="buyerNeighborhood" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none" placeholder="El Laguito" />
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

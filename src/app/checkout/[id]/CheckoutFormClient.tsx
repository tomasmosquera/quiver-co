"use client";

import { useRef, useState } from "react";
import { CheckCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { COLOMBIA, DEPARTMENTS } from "@/lib/colombia";
import {
  generateMetaEventId,
  getCurrentMetaSourceUrl,
  trackMetaEvent,
} from "@/lib/meta/browser";

interface Buyer {
  name?: string | null;
  phone?: string | null;
  idDoc?: string | null;
  city?: string | null;
  department?: string | null;
  address?: string | null;
}

export default function CheckoutFormClient({
  listingId,
  listingTitle,
  subtotal,
  sellerId,
  buyer,
}: {
  listingId: string;
  listingTitle: string;
  subtotal: number;
  sellerId: string;
  buyer: Buyer | null;
}) {
  const [loading, setLoading] = useState(false);
  const [initPoint, setInitPoint] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "manual" | null>(null);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [department, setDepartment] = useState(buyer?.department ?? "");
  const [city, setCity] = useState(buyer?.city ?? "");

  function getFormData() {
    if (!formRef.current) return null;

    const formData = new FormData(formRef.current);
    const neighborhood = formData.get("buyerNeighborhood") as string;
    const address = formData.get("buyerAddress") as string;
    const fullAddress = neighborhood
      ? `${address} - Barrio: ${neighborhood}`
      : address;
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

  function initiateCheckoutPayload() {
    return {
      content_ids: [listingId],
      content_name: listingTitle,
      content_type: "product",
      currency: "COP",
      value: subtotal,
      num_items: 1,
    };
  }

  async function handleManual() {
    const data = getFormData();
    if (!data) return;

    setLoading(true);
    const metaEventId = generateMetaEventId("initiate-checkout");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          metaEventId,
          metaSourceUrl: getCurrentMetaSourceUrl(),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Ocurrio un error");

      trackMetaEvent("InitiateCheckout", initiateCheckoutPayload(), {
        eventId: metaEventId,
      });

      const adminNumber = "573164780276";
      const waText = `Hola Quiver! Acabo de hacer la transferencia por $${subtotal.toLocaleString("es-CO")} para comprar el artículo: "${listingTitle}" (ID: ${listingId}). Aquí adjunto mi comprobante:`;
      window.open(
        `https://wa.me/${adminNumber}?text=${encodeURIComponent(waText)}`,
        "_blank",
      );

      router.push("/cuenta/compras");
      router.refresh();
    } catch (error: unknown) {
      alert(
        error instanceof Error
          ? error.message
          : "Hubo un error al procesar tu orden. Intenta nuevamente.",
      );
      setLoading(false);
    }
  }

  async function handleMercadoPago() {
    const data = getFormData();
    if (!data) return;

    setLoading(true);
    const metaEventId = generateMetaEventId("initiate-checkout");

    try {
      const res = await fetch("/api/mercadopago/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          metaEventId,
          metaSourceUrl: getCurrentMetaSourceUrl(),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Ocurrio un error");

      trackMetaEvent("InitiateCheckout", initiateCheckoutPayload(), {
        eventId: metaEventId,
      });

      setInitPoint(result.initPoint);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Error al preparar el pago.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paymentMethod === "manual") await handleManual();
    else if (paymentMethod === "mercadopago") await handleMercadoPago();
  }

  if (initPoint) {
    return (
      <div className="space-y-4 px-6 pb-6 md:px-8 md:pb-8 bg-[#F9FAFB] pt-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <p className="font-semibold mb-1">Tu orden está lista</p>
          <p className="text-xs text-blue-600">
            Completa el pago con Mercado Pago. Puedes usar tarjeta, PSE o Efecty.
          </p>
        </div>
        <a
          href={initPoint}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#111827] hover:bg-[#374151] text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <CreditCard className="w-5 h-5" />
          Ir a pagar con Mercado Pago
        </a>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-5 px-6 pb-6 md:px-8 md:pb-8 bg-[#F9FAFB]"
    >
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h3 className="font-bold text-[#111827] mb-4 text-lg">Datos de envío</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Nombre Completo
            </label>
            <input
              required
              type="text"
              name="buyerName"
              defaultValue={buyer?.name || ""}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
              placeholder="Juan Pérez"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Cédula
              </label>
              <input
                required
                type="text"
                name="buyerIdDoc"
                defaultValue={buyer?.idDoc ?? ""}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
                placeholder="123456789"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Celular
              </label>
              <input
                required
                type="text"
                name="buyerPhone"
                defaultValue={buyer?.phone || ""}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
                placeholder="300 000 0000"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Departamento
              </label>
              <select
                required
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setCity("");
                }}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none bg-white"
              >
                <option value="" disabled>
                  Seleccione...
                </option>
                {DEPARTMENTS.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Ciudad / Municipio
              </label>
              <select
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!department}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="" disabled>
                  Seleccione...
                </option>
                {department &&
                  COLOMBIA[department]?.sort().map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Dirección completa
            </label>
            <input
              required
              type="text"
              name="buyerAddress"
              defaultValue={buyer?.address ?? ""}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
              placeholder="Calle 123 #45-67 Apto 801"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Barrio <span className="text-[#9CA3AF] font-normal">(Opcional)</span>
            </label>
            <input
              type="text"
              name="buyerNeighborhood"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
              placeholder="El Laguito"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          onClick={() => setPaymentMethod("manual")}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1DA851] disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <CheckCircle className="w-5 h-5" />
          {loading && paymentMethod === "manual"
            ? "Procesando..."
            : "Ya transferi, enviar comprobante"}
        </button>
        <p className="text-center text-xs text-[#9CA3AF]">
          Serás redirigido a WhatsApp para enviar el pantallazo.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-xs text-[#9CA3AF]">o paga en linea con Mercado Pago</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        <button
          type="submit"
          disabled={loading}
          onClick={() => setPaymentMethod("mercadopago")}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#111827] hover:bg-[#374151] disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <CreditCard className="w-5 h-5" />
          {loading && paymentMethod === "mercadopago"
            ? "Preparando pago..."
            : "Pagar con tarjeta / PSE / Efecty"}
        </button>
        <p className="text-center text-xs text-[#9CA3AF]">
          Procesado de forma segura por Mercado Pago.
        </p>
      </div>
    </form>
  );
}

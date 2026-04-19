import Link from "next/link";
import { Scale, AlertTriangle, MessageCircle, Clock, CheckCircle } from "lucide-react";

export const metadata = { title: "Política de disputas | Quiver Co." };

const steps = [
  {
    icon: AlertTriangle,
    title: "1. Detén la confirmación",
    description:
      "Si el equipo llegó con daños, diferencias respecto al anuncio, o simplemente no llegó, NO confirmes la entrega. Tienes 15 días desde el aviso de envío para hacerlo.",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: MessageCircle,
    title: "2. Contáctanos de inmediato",
    description:
      "Escríbenos por WhatsApp explicando el problema. Adjunta fotos del equipo recibido (o la ausencia de él), el número de orden y cualquier conversación relevante con el vendedor.",
    color: "bg-blue-50 text-[#3B82F6]",
  },
  {
    icon: Scale,
    title: "3. Revisamos el caso",
    description:
      "Nuestro equipo analiza la evidencia de ambas partes (comprador y vendedor) y determina si el reclamo es válido. Este proceso toma máximo 5 días hábiles.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: CheckCircle,
    title: "4. Resolución",
    description:
      "Si el reclamo es válido, coordinamos la devolución del equipo al vendedor y el reembolso al comprador. Si no lo es, liberamos el dinero al vendedor normalmente.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const buyerRights = [
  "El equipo no llega dentro del plazo acordado",
  "El equipo llega con daños no mencionados en el anuncio",
  "El equipo es materialmente diferente a lo descrito (modelo, talla, estado)",
  "El vendedor no despacha tras confirmar el pago",
];

const sellerRights = [
  "El comprador alega daños inexistentes o infla el estado del equipo",
  "El comprador no recoge el equipo en el punto de entrega acordado",
  "El comprador causa daños tras recibir el equipo y los atribuye al envío",
];

const notCovered = [
  "Desgaste normal descrito en el anuncio",
  "Cambios de opinión del comprador sin causa objetiva",
  "Daños ocasionados por mal uso después de la entrega confirmada",
  "Diferencias menores de color o estética no relevantes al funcionamiento",
];

export default function DisputasPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-[#1F2937] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-7 h-7 text-[#3B82F6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Política de disputas</h1>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto leading-relaxed">
            Cuando algo no sale como esperabas, estamos aquí para mediar y encontrar una solución justa para ambas partes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-14">

        {/* Process */}
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-6">¿Cómo abrir una disputa?</h2>
          <div className="space-y-4">
            {steps.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="flex gap-5 bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] mb-1">{title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plazos */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <Clock className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-xl font-bold text-[#111827]">Plazos importantes</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Para confirmar recepción del equipo",         value: "15 días desde el aviso de envío" },
              { label: "Para abrir una disputa",                      value: "Antes de confirmar la entrega" },
              { label: "Para resolver el caso desde que lo recibimos", value: "Máximo 5 días hábiles" },
              { label: "Para reembolso si el reclamo es válido",       value: "1–3 días hábiles tras resolución" },
              { label: "Entrega automática si no confirmas",           value: "15 días tras el aviso de envío" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4 py-3 border-b border-[#F3F4F6] last:border-0">
                <span className="text-sm text-[#6B7280]">{label}</span>
                <span className="text-sm font-semibold text-[#111827] text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What's covered */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <h3 className="font-bold text-[#111827] mb-3 text-sm">Comprador tiene razón cuando...</h3>
            <ul className="space-y-2">
              {buyerRights.map(i => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <h3 className="font-bold text-[#111827] mb-3 text-sm">Vendedor tiene razón cuando...</h3>
            <ul className="space-y-2">
              {sellerRights.map(i => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <h3 className="font-bold text-[#111827] mb-3 text-sm">No aplica disputa cuando...</h3>
            <ul className="space-y-2">
              {notCovered.map(i => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-1 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#111827] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold">¿Necesitas abrir una disputa?</p>
            <p className="text-sm text-[#9CA3AF] mt-0.5">Escríbenos por WhatsApp con tu número de orden.</p>
          </div>
          <a
            href="https://wa.me/573164780276?text=Hola%20Quiver!%20Quiero%20abrir%20una%20disputa%20sobre%20mi%20orden."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Abrir disputa por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

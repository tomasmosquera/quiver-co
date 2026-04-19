import Link from "next/link";
import { ShieldCheck, Lock, AlertTriangle, MessageCircle, ChevronRight } from "lucide-react";

export const metadata = { title: "Protección al comprador | Quiver Co." };

const guarantees = [
  {
    icon: Lock,
    title: "Pago en Escrow",
    description:
      "Tu dinero nunca va directamente al vendedor. Lo retenemos de forma segura en nuestra cuenta hasta que confirmes que el equipo llegó tal como fue descrito. Si algo no está bien, el dinero no se libera.",
    color: "bg-blue-50 text-[#3B82F6]",
  },
  {
    icon: ShieldCheck,
    title: "Verificación del vendedor",
    description:
      "Todos los vendedores deben registrarse con datos reales. El sistema de calificaciones de la comunidad te muestra el historial de cada vendedor — cuántas ventas ha completado y qué tan bien ha sido calificado.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: AlertTriangle,
    title: "Mediación en disputas",
    description:
      "Si el equipo llega en condiciones diferentes a las anunciadas, contáctanos antes de confirmar la entrega. Investigamos el caso y gestionamos la devolución del dinero si el reclamo es válido.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: MessageCircle,
    title: "Soporte por WhatsApp",
    description:
      "Nuestro equipo está disponible por WhatsApp para ayudarte en cualquier etapa del proceso: desde antes de comprar hasta después de recibir el equipo.",
    color: "bg-purple-50 text-purple-600",
  },
];

const steps = [
  {
    label: "Pagas a Quiver",
    detail: "Transferes el dinero a nuestra cuenta. El vendedor no recibe nada aún.",
  },
  {
    label: "Vendedor envía el equipo",
    detail: "El vendedor despacha y sube el comprobante de envío. Tú recibes una notificación.",
  },
  {
    label: "Inspeccionas el equipo",
    detail: "Tienes 15 días para revisar que el equipo llegó en las condiciones prometidas.",
  },
  {
    label: "Confirmas o reclamas",
    detail: "Si todo está bien, confirmas la entrega y el vendedor recibe su dinero. Si no, nos contactas para gestionar el caso.",
  },
];

const covered = [
  "El equipo no llega dentro del plazo establecido",
  "El equipo llega con daños no descritos en el anuncio",
  "El equipo es significativamente diferente a la descripción",
  "El vendedor no envía el equipo tras confirmar el pago",
];

const notCovered = [
  "El desgaste normal de uso ya mencionado en el anuncio",
  "Daños ocurridos después de que confirmas la entrega",
  "Insatisfacción personal con el equipo (si la descripción era precisa)",
  "Problemas causados por el transporte (requiere seguro de envío aparte)",
];

export default function ProteccionCompradorPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">
            Protección al comprador
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto leading-relaxed">
            Compramos con confianza. Tu dinero está protegido en todo momento hasta que confirmes que el equipo llegó perfecto.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Guarantees */}
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-6">Cómo te protegemos</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {guarantees.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#111827] mb-6">El flujo de una compra segura</h2>
          <div className="space-y-6">
            {steps.map(({ label, detail }, i) => (
              <div key={label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-[#E5E7EB] my-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-[#111827]">{label}</p>
                  <p className="text-sm text-[#6B7280] mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Covered / not covered */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span>
              Cubierto por la protección
            </h2>
            <ul className="space-y-2.5">
              {covered.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xs font-bold">✕</span>
              No cubierto
            </h2>
            <ul className="space-y-2.5">
              {notCovered.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#111827] text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">¿Tuviste un problema con tu compra?</h2>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Contáctanos por WhatsApp antes de confirmar la entrega. Nuestro equipo revisa el caso y te da una respuesta en menos de 24 horas.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="https://wa.me/573164780276?text=Hola%20Quiver!%20Tengo%20un%20problema%20con%20mi%20compra."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar por WhatsApp
            </a>
            <Link
              href="/como-funciona"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1F2937] hover:bg-[#374151] text-white text-sm font-medium rounded-xl border border-[#374151] transition-colors"
            >
              Ver cómo funciona <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

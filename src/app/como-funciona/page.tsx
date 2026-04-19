import Link from "next/link";
import { Search, ShieldCheck, Truck, Star, ChevronRight, Wind } from "lucide-react";

export const metadata = { title: "Cómo funciona | Quiver Co." };

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Encuentra tu equipo",
    description:
      "Navega por cientos de anuncios de kitesurf, wingfoil y más. Filtra por tipo de equipo, disciplina, condición y precio. Cada anuncio incluye fotos reales, descripción detallada y la calificación del vendedor.",
    color: "bg-blue-50 text-[#3B82F6]",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Compra con seguridad (Escrow)",
    description:
      "Cuando encuentras el equipo ideal, haces la transferencia a Quiver Co. — no directamente al vendedor. Retenemos el dinero de forma segura hasta que confirmes que el equipo llegó en perfectas condiciones. Así ambas partes están protegidas.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Truck,
    step: "03",
    title: "El vendedor envía el equipo",
    description:
      "Una vez confirmado tu pago, el vendedor tiene un plazo para despachar el equipo y subir el comprobante de envío. Tú recibes una notificación con el seguimiento y tienes 15 días para confirmar la recepción.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Star,
    step: "04",
    title: "Confirma y califica",
    description:
      "Cuando el equipo llega en perfectas condiciones, confirmas la entrega y dejamos ir el dinero al vendedor (menos la comisión del 5%). Luego puedes calificar al vendedor para ayudar a la comunidad.",
    color: "bg-purple-50 text-purple-600",
  },
];

const faqs = [
  {
    q: "¿Puedo comprar si no tengo cuenta?",
    a: "No. Necesitas crear una cuenta gratuita para comprar o vender. Así garantizamos que cada transacción esté vinculada a un usuario verificable.",
  },
  {
    q: "¿Qué pasa si el equipo no llega o llega en mal estado?",
    a: "Tienes 15 días para confirmar la recepción. Si hay un problema, contáctanos por WhatsApp antes de confirmar. Investigamos el caso y gestionamos la devolución si aplica.",
  },
  {
    q: "¿Quién paga el envío?",
    a: "El costo del envío lo paga el comprador y se acuerda directamente con el vendedor antes de cerrar la compra. El precio del anuncio no incluye el envío.",
  },
  {
    q: "¿Cuánto tarda en llegar mi dinero como vendedor?",
    a: "Una vez que el comprador confirma la recepción, transferimos el pago (menos el 5% de comisión) dentro de las siguientes 24 horas hábiles.",
  },
  {
    q: "¿Puedo cancelar una compra?",
    a: "Sí, puedes cancelar mientras la orden está en estado 'Validando pago'. Una vez confirmado el pago, debes contactarnos para gestionar la cancelación.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#1F2937] px-3 py-1.5 rounded-full text-xs font-semibold text-[#3B82F6] mb-6">
            <Wind className="w-3.5 h-3.5" /> Simple, seguro y 100% enfocado en la comunidad
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Cómo funciona<br />
            <span className="text-[#3B82F6]">Quiver Co.</span>
          </h1>
          <p className="text-[#9CA3AF] text-lg leading-relaxed max-w-xl mx-auto">
            Comprar y vender equipo de kitesurf nunca fue tan fácil ni tan seguro. Te explicamos el proceso paso a paso.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

        {/* Steps */}
        <div className="space-y-8">
          {steps.map(({ icon: Icon, step, title, description, color }) => (
            <div key={step} className="flex gap-6 items-start bg-white border border-[#E5E7EB] rounded-2xl p-6 md:p-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#9CA3AF] mb-1 tracking-widest">PASO {step}</p>
                <h2 className="text-lg font-bold text-[#111827] mb-2">{title}</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#111827] rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">¿Listo para empezar?</h2>
          <p className="text-[#9CA3AF] mb-8 max-w-md mx-auto">
            Únete a la comunidad de kitesurfistas que ya compran y venden su equipo de forma segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/equipos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
            >
              Ver equipos en venta <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/vender"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1F2937] hover:bg-[#374151] text-white font-semibold rounded-xl border border-[#374151] transition-colors"
            >
              Publicar mi equipo
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <h3 className="font-semibold text-[#111827] mb-2">{q}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

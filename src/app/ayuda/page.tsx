import Link from "next/link";
import { HelpCircle, ShoppingBag, TrendingUp, Truck, MessageCircle, Shield, ChevronRight } from "lucide-react";

export const metadata = { title: "Centro de ayuda | Quiver Co." };

const sections = [
  {
    icon: ShoppingBag,
    title: "Comprar en Quiver",
    color: "bg-blue-50 text-[#3B82F6]",
    faqs: [
      {
        q: "¿Cómo hago una compra?",
        a: "Encuentra el equipo que te interesa, haz clic en 'Comprar', transfiere el dinero a la cuenta de Quiver y envía el comprobante por WhatsApp. Nosotros gestionamos todo lo demás.",
      },
      {
        q: "¿Puedo hablar con el vendedor antes de comprar?",
        a: "Sí. Desde el anuncio puedes iniciar una conversación directa con el vendedor para hacer preguntas sobre el equipo antes de decidirte.",
      },
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos transferencias bancarias a Bancolombia (ahorros) y pagos por Nequi / Bre-B. Los datos de transferencia aparecen en el proceso de compra.",
      },
      {
        q: "¿Quién paga el envío?",
        a: "El comprador paga el envío. El costo se acuerda directamente con el vendedor antes de cerrar la compra. El precio del anuncio no lo incluye.",
      },
      {
        q: "¿Puedo cancelar una compra?",
        a: "Puedes cancelar mientras la orden está en estado 'Validando pago'. Una vez que confirmamos tu pago, contáctanos por WhatsApp para gestionar la cancelación.",
      },
    ],
  },
  {
    icon: TrendingUp,
    title: "Vender en Quiver",
    color: "bg-emerald-50 text-emerald-600",
    faqs: [
      {
        q: "¿Cómo publico un anuncio?",
        a: "Ve a 'Vender mi equipo', completa el formulario con fotos, descripción y precio, y publica. Es completamente gratis publicar.",
      },
      {
        q: "¿Cuánto cobra Quiver por venta?",
        a: "Cobramos una comisión del 5% sobre el precio de venta, descontada al momento de transferirte el dinero. Si no vendes, no pagas nada.",
      },
      {
        q: "¿Cuándo recibo el dinero?",
        a: "Una vez que el comprador confirma la recepción del equipo, te transferimos el dinero (menos el 5% de comisión) dentro de las siguientes 24 horas hábiles.",
      },
      {
        q: "¿Qué pasa si el comprador no confirma la entrega?",
        a: "El comprador tiene 15 días para confirmar la entrega. Si no lo hace, el sistema confirma la entrega automáticamente y recibes tu dinero.",
      },
      {
        q: "¿Puedo editar o eliminar mi anuncio?",
        a: "Sí. Desde 'Mis anuncios' en tu cuenta puedes editar la descripción, el precio y las fotos, o eliminar el anuncio en cualquier momento.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Envíos y entregas",
    color: "bg-amber-50 text-amber-600",
    faqs: [
      {
        q: "¿Cómo se coordina el envío?",
        a: "Una vez confirmado el pago, el vendedor y el comprador coordinan el envío directamente por mensajes dentro de la plataforma o por teléfono.",
      },
      {
        q: "¿Cuánto tiempo tiene el vendedor para enviar?",
        a: "El vendedor debe despachar el equipo y subir el comprobante de envío dentro de un plazo razonable. Si hay demoras, contáctanos.",
      },
      {
        q: "¿Qué hago si el equipo llega dañado?",
        a: "No confirmes la entrega. Contáctanos de inmediato por WhatsApp con fotos del daño. Investigamos el caso y gestionamos la devolución si aplica.",
      },
      {
        q: "¿Puedo extender el plazo de entrega?",
        a: "Sí. Desde tu panel de compras puedes indicar 'Todavía no ha llegado' para extender el plazo 15 días adicionales.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Seguridad y protección",
    color: "bg-purple-50 text-purple-600",
    faqs: [
      {
        q: "¿Cómo me protege Quiver?",
        a: "Usamos un sistema de Escrow: tu dinero queda retenido en nuestra cuenta hasta que confirmes que el equipo llegó en las condiciones prometidas. El vendedor nunca recibe el dinero antes de eso.",
      },
      {
        q: "¿Qué pasa si el vendedor no envía el equipo?",
        a: "Si el vendedor no envía el equipo dentro del plazo, gestionamos la devolución completa de tu dinero.",
      },
      {
        q: "¿Cómo sé si un vendedor es confiable?",
        a: "Cada vendedor tiene un perfil con su calificación promedio y reseñas de compradores anteriores. Te recomendamos revisar el historial antes de comprar.",
      },
    ],
  },
];

export default function AyudaPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-[#1F2937] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-7 h-7 text-[#3B82F6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Centro de ayuda</h1>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre comprar y vender en Quiver.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">

        {sections.map(({ icon: Icon, title, color, faqs }) => (
          <div key={title}>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
            </div>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-semibold text-[#111827] text-sm select-none">
                    {q}
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-[#6B7280] leading-relaxed border-t border-[#F3F4F6] pt-3">
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Contact CTA */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#111827]">¿No encontraste lo que buscabas?</p>
            <p className="text-sm text-[#6B7280] mt-0.5">Escríbenos por WhatsApp y te ayudamos.</p>
          </div>
          <a
            href="https://wa.me/573164780276"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

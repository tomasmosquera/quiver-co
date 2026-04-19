import { MessageCircle, Mail, Clock, MapPin } from "lucide-react";

export const metadata = { title: "Contáctanos | Quiver Co." };

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "La forma más rápida de contactarnos. Respondemos en menos de 2 horas en horario hábil.",
    action: "Escribir por WhatsApp",
    href: "https://wa.me/573164780276",
    color: "bg-emerald-50 text-emerald-600",
    highlight: true,
  },
  {
    icon: Mail,
    title: "Correo electrónico",
    description: "Para consultas formales o que requieran documentación adjunta.",
    action: "hola@quiver.co",
    href: "mailto:hola@quiver.co",
    color: "bg-blue-50 text-[#3B82F6]",
    highlight: false,
  },
];

const topics = [
  { emoji: "🛒", label: "Tengo un problema con mi compra" },
  { emoji: "📦", label: "Quiero abrir una disputa" },
  { emoji: "📝", label: "Tengo una pregunta sobre un anuncio" },
  { emoji: "💳", label: "Tengo un problema con un pago" },
  { emoji: "🔐", label: "Problemas con mi cuenta" },
  { emoji: "💡", label: "Sugerencia o comentario" },
];

export default function ContactoPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-[#1F2937] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-7 h-7 text-[#3B82F6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Contáctanos</h1>
          <p className="text-[#9CA3AF] text-lg max-w-md mx-auto">
            Estamos aquí para ayudarte con cualquier duda o problema que tengas.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-10">

        {/* Channels */}
        <div className="grid sm:grid-cols-2 gap-5">
          {channels.map(({ icon: Icon, title, description, action, href, color, highlight }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block bg-white border rounded-2xl p-6 hover:shadow-md transition-shadow ${highlight ? "border-emerald-200" : "border-[#E5E7EB]"}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-[#111827] mb-1">{title}</h2>
              <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">{description}</p>
              <span className={`text-sm font-semibold ${highlight ? "text-emerald-600" : "text-[#3B82F6]"}`}>
                {action} →
              </span>
            </a>
          ))}
        </div>

        {/* Hours */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
          <div className="flex items-start gap-3 flex-1">
            <Clock className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-[#111827] mb-2">Horario de atención</h3>
              <div className="space-y-1 text-sm text-[#6B7280]">
                <p>Lunes a viernes: <span className="font-medium text-[#374151]">9:00 am – 7:00 pm</span></p>
                <p>Sábados: <span className="font-medium text-[#374151]">10:00 am – 3:00 pm</span></p>
                <p>Domingos y festivos: <span className="font-medium text-[#374151]">Cerrado</span></p>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 flex-1">
            <MapPin className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-[#111827] mb-2">Ubicación</h3>
              <p className="text-sm text-[#6B7280]">
                Bogotá, Colombia<br />
                <span className="text-xs">Operamos 100% de forma digital.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
          <h2 className="font-bold text-[#111827] mb-4">¿Sobre qué necesitas ayuda?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {topics.map(({ emoji, label }) => (
              <a
                key={label}
                href={`https://wa.me/573164780276?text=${encodeURIComponent(`Hola Quiver! ${label}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 border border-[#E5E7EB] rounded-xl hover:border-[#3B82F6] hover:bg-blue-50 transition-colors text-sm text-[#374151] font-medium"
              >
                <span className="text-lg">{emoji}</span>
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

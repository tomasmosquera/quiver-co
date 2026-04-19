import Link from "next/link";
import { Percent, CheckCircle, XCircle, Calculator } from "lucide-react";

export const metadata = { title: "Tarifas y comisiones | Quiver Co." };

const included = [
  "Publicación del anuncio con fotos y descripción",
  "Mensajería directa con compradores",
  "Sistema de pago seguro Escrow",
  "Protección y mediación en disputas",
  "Calificaciones y reseñas de la comunidad",
  "Visibilidad en búsquedas del marketplace",
];

const notIncluded = [
  "Costo del envío (acordado entre comprador y vendedor)",
  "Seguro adicional del equipo en tránsito",
];

const examples = [
  { price: 500_000,   net: Math.round(500_000 * 0.95) },
  { price: 1_500_000, net: Math.round(1_500_000 * 0.95) },
  { price: 3_000_000, net: Math.round(3_000_000 * 0.95) },
  { price: 5_000_000, net: Math.round(5_000_000 * 0.95) },
  { price: 8_000_000, net: Math.round(8_000_000 * 0.95) },
];

function fmt(n: number) {
  return n.toLocaleString("es-CO");
}

export default function TarifasPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-[#1F2937] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Percent className="w-7 h-7 text-[#3B82F6]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">
            Tarifas y comisiones
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto leading-relaxed">
            Transparencia total. Sin sorpresas. Solo pagas cuando vendes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">

        {/* Main commission card */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-12 text-center">
          <p className="text-sm font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">Comisión por venta</p>
          <div className="text-7xl font-black text-[#111827] mb-2">5<span className="text-[#3B82F6]">%</span></div>
          <p className="text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            Solo cobramos cuando tu venta se completa con éxito. Publicar es gratis. Hablar con compradores es gratis.
          </p>
        </div>

        {/* What's included */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Incluido en la comisión
            </h2>
            <ul className="space-y-2.5">
              {included.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
            <h2 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-[#9CA3AF]" /> No incluido
            </h2>
            <ul className="space-y-2.5">
              {notIncluded.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D1D5DB] mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Calculator examples */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F3F4F6] flex items-center gap-3">
            <Calculator className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="font-bold text-[#111827]">Ejemplos de lo que recibirías</h2>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            <div className="grid grid-cols-3 px-6 py-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              <span>Precio de venta</span>
              <span className="text-center">Comisión (5%)</span>
              <span className="text-right">Tú recibes</span>
            </div>
            {examples.map(({ price, net }) => (
              <div key={price} className="grid grid-cols-3 px-6 py-4 text-sm">
                <span className="text-[#374151] font-medium">${fmt(price)}</span>
                <span className="text-center text-red-500">−${fmt(price - net)}</span>
                <span className="text-right font-bold text-[#111827]">${fmt(net)}</span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#F3F4F6]">
            <p className="text-xs text-[#9CA3AF]">
              Todos los valores en COP. La comisión se descuenta del total transferido al vendedor al confirmar la entrega.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#111827]">¿Listo para vender tu equipo?</p>
            <p className="text-sm text-[#6B7280] mt-0.5">Publicar es gratis. Solo pagas cuando vendes.</p>
          </div>
          <Link
            href="/vender"
            className="shrink-0 px-5 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Publicar mi equipo
          </Link>
        </div>

      </div>
    </div>
  );
}

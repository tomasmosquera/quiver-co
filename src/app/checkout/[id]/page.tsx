import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ChevronLeft, Shield, Banknote, Smartphone, CheckCircle, Copy } from "lucide-react";
import CopyToClipboardButton from "@/components/CopyToClipboardButton";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  // Opcional: forzar login para comprar
  // if (!session?.user?.id) return redirect(`/login?callbackUrl=/checkout/${id}`);

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      seller: { select: { name: true } },
    },
  });

  if (!listing || listing.status !== "ACTIVE") {
    notFound();
  }

  // Costos
  const subtotal = listing.price;
  const adminNumber = "573000000000"; // TODO: Poner el número de Whatsapp real admin de Quiver

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/equipo/${listing.id}`} className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al equipo
          </Link>
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" /> Compra Segura Quiver
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#111827] mb-8">Completar compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Columna Izquierda: Instrucciones */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#111827] mb-4">¿Cómo funciona?</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#3B82F6] font-bold text-sm flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-[#111827]">Transfiere el dinero a Quiver</h3>
                    <p className="text-sm text-[#6B7280] mt-1">Utiliza los datos bancarios mostrados abajo para hacer la transferencia. Retendremos tu dinero de forma segura (Escrow).</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#3B82F6] font-bold text-sm flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-[#111827]">Envía tu comprobante</h3>
                    <p className="text-sm text-[#6B7280] mt-1">Dale clic al botón de "Ya transferí" para contactarnos por WhatsApp y pasarnos la foto del recibo.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#3B82F6] font-bold text-sm flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-[#111827]">Despacho y verificación</h3>
                    <p className="text-sm text-[#6B7280] mt-1">Haremos que el vendedor te envíe el equipo. Solo le entregaremos los fondos cuando confirmes que el artículo llegó perfecto.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#111827] mb-6">Datos de transferencia</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:border-[#3B82F6] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Bancolombia - Ahorros</p>
                      <p className="font-bold text-[#111827]">123-456789-00</p>
                    </div>
                  </div>
                  <CopyToClipboardButton text="12345678900" />
                </div>

                <div className="p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:border-[#3B82F6] transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Nequi / Bre-B</p>
                      <p className="font-bold text-[#111827]">300 000 0000</p>
                    </div>
                  </div>
                  <CopyToClipboardButton text="3000000000" />
                </div>

                <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                  <p className="text-xs text-[#6B7280]">A nombre de:</p>
                  <p className="text-sm font-semibold text-[#111827]">Tomás Mosquera (C.C. 1.234.567.890)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen de orden */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden">
              <div className="p-6 md:p-8 border-b border-[#F3F4F6]">
                <h2 className="text-xl font-bold text-[#111827] mb-6">Resumen del pedido</h2>
                
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-[#F9FAFB] rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
                    {listing.images[0]?.url ? (
                      <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#9CA3AF]">Sin foto</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111827] line-clamp-2 leading-snug">{listing.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-1">Vendido por: {listing.seller.name}</p>
                    {listing.discipline && (
                      <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#3B82F6]">
                        {listing.discipline}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-[#F9FAFB] space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Precio del equipo</span>
                  <span className="font-medium text-[#111827]">${subtotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Protección de compra (Escrow)</span>
                  <span className="font-medium text-emerald-600">Gratis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Envío</span>
                  <span className="font-medium text-[#111827]">Por acordar / Paga el comprador</span>
                </div>
                
                <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center">
                  <span className="font-bold text-[#111827]">Total a transferir</span>
                  <p className="text-2xl font-bold text-[#111827]">
                    ${subtotal.toLocaleString("es-CO")}
                    <span className="text-sm font-normal text-[#9CA3AF] ml-1">COP</span>
                  </p>
                </div>

                <a 
                  href={`https://wa.me/${adminNumber}?text=${encodeURIComponent(`Hola Quiver! Acabo de hacer la transferencia por $${subtotal.toLocaleString("es-CO")} para comprar el artículo: "${listing.title}" (ID: ${listing.id}). Aquí adjunto mi comprobante:`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  <CheckCircle className="w-5 h-5" />
                  Ya transferí, enviar comprobante
                </a>
                <p className="text-center text-xs text-[#9CA3AF] mt-3">Serás redirigido a WhatsApp para enviar el pantallazo con seguridad.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

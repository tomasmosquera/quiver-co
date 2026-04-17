import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ShoppingBag, Home, Heart, Settings, Shield, ChevronRight, Package, MapPin, Phone } from "lucide-react";

export default async function VentasPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const orders = await prisma.order.findMany({
    where: { sellerId: session.user.id },
    include: {
      listing: {
        include: { images: { orderBy: { order: "asc" }, take: 1 } }
      },
      buyer: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Mi Cuenta */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <Link href="/cuenta/anuncios" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            <Home className="w-5 h-5 text-[#9CA3AF]" /> Mis Anuncios
          </Link>
          <Link href="/cuenta/ventas" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#111827] text-white transition-colors">
            <Package className="w-5 h-5 text-[#3B82F6] fill-current" /> Mis Ventas
          </Link>
          <Link href="/cuenta/compras" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            <ShoppingBag className="w-5 h-5 text-[#9CA3AF]" /> Mis Compras
          </Link>
          <Link href="/cuenta/favoritos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            <Heart className="w-5 h-5 text-[#9CA3AF]" /> Favoritos
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors cursor-not-allowed opacity-60">
            <Settings className="w-5 h-5 text-[#9CA3AF]" /> Ajustes
          </button>
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#111827]">Mis Ventas</h1>
            <p className="text-sm text-[#6B7280] mt-1">Órdenes de compra y seguimiento de despachos.</p>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const isPending = order.status === "PENDING";
                return (
                  <div key={order.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
                    {/* Header: Equipo e info general */}
                    <div className="p-6 flex flex-col md:flex-row gap-6 border-b border-[#F3F4F6]">
                      <div className="w-20 h-20 bg-[#F9FAFB] rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
                        {order.listing.images[0]?.url ? (
                          <img src={order.listing.images[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[#9CA3AF]">Sin foto</div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1 text-xs">
                              <span className="text-[#6B7280]">{new Date(order.createdAt).toLocaleDateString("es-CO")}</span>
                              <span className="text-[#E5E7EB]">|</span>
                              <span className={`font-semibold px-2 py-0.5 rounded-full ${isPending ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {isPending ? "Esperando validación de Admin" : "Por despachar"}
                              </span>
                            </div>
                            <h3 className="font-bold text-[#111827] text-lg leading-snug">
                              {order.listing.title}
                            </h3>
                            <p className="text-sm font-medium text-[#111827] mt-1">
                              ${order.amount.toLocaleString("es-CO")} COP <span className="text-xs text-[#6B7280]">(Menos tarifa Escrow)</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Info del comprador para envío */}
                    <div className="p-6 bg-[#F9FAFB]">
                      <h4 className="text-sm font-bold text-[#111827] mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#3B82F6]" /> Información de Envío (Comprador)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <p className="text-xs text-[#9CA3AF] mb-1">Nombre y Cédula</p>
                          <p className="text-sm font-semibold text-[#111827]">{order.buyerName}</p>
                          <p className="text-xs text-[#374151]">C.C. {order.buyerIdDoc}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF] mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Contacto</p>
                          <p className="text-sm font-semibold text-[#111827]">{order.buyerPhone}</p>
                          <p className="text-xs text-[#374151]">{order.buyer.email}</p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1 border-t sm:border-t-0 sm:border-l lg:border-l border-[#E5E7EB] pt-4 sm:pt-0 sm:pl-6 lg:pl-6">
                          <p className="text-xs text-[#9CA3AF] mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Dirección de despacho</p>
                          <p className="text-sm font-semibold text-[#111827]">{order.buyerCity}</p>
                          <p className="text-xs text-[#374151] leading-relaxed mt-0.5">{order.buyerAddress}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="text-xs text-[#374151]">
                          <p className="font-semibold text-blue-800 mb-0.5">¿Ya enviaste el equipo?</p>
                          <p>Contacta a la administración para actualizar el estado del envío y acelerar el desembolso.</p>
                        </div>
                        <a 
                          href={`https://wa.me/573164780276?text=${encodeURIComponent(`Hola Quiver! Soy el vendedor de la orden ID: ${order.id}. Ya despaché el equipo "${order.listing.title}", aquí te envío la guía:`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#111827] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                        >
                          Reportar Envío
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-[#3B82F6] rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Aún no has vendido artículos</h3>
              <p className="text-[#6B7280] max-w-sm mb-6">
                Cuando alguien compre tus artículos publicados utilizando el Escrow Seguro de Quiver, aparecerán aquí junto con los datos de envíos.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

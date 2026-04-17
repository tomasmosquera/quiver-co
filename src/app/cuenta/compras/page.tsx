import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ShoppingBag, Home, Heart, Settings, Shield, ChevronRight, Package, Truck, CheckCircle } from "lucide-react";

export default async function ComprasPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      listing: {
        include: { images: { orderBy: { order: "asc" }, take: 1 } }
      },
      seller: { select: { name: true, phone: true } }
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
          <Link href="/cuenta/ventas" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            <Package className="w-5 h-5 text-[#9CA3AF]" /> Mis Ventas
          </Link>
          <Link href="/cuenta/compras" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#111827] text-white transition-colors">
            <ShoppingBag className="w-5 h-5 text-[#3B82F6] fill-current" /> Mis Compras
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
            <h1 className="text-2xl font-bold text-[#111827]">Mis Compras</h1>
            <p className="text-sm text-[#6B7280] mt-1">Historial de artículos comprados en Quiver.</p>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-5">
              {orders.map((order) => {
                const isPending = order.status === "PENDING";
                return (
                  <div key={order.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    
                    <div className="w-20 h-20 bg-[#F9FAFB] rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
                      {order.listing.images[0]?.url ? (
                        <img src={order.listing.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#9CA3AF]">Sin foto</div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <span className="text-[#6B7280]">{new Date(order.createdAt).toLocaleDateString("es-CO")}</span>
                        <span className="text-[#E5E7EB]">|</span>
                        <span className={`font-semibold px-2 py-0.5 rounded-full ${isPending ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {isPending ? "Validando Pago" : "Pagado y en proceso"}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#111827] text-lg leading-snug">
                        {order.listing.title}
                      </h3>
                      <p className="text-sm font-medium text-[#111827] mt-1">
                        ${order.amount.toLocaleString("es-CO")} COP
                      </p>
                      
                      <div className="mt-3 flex gap-4 text-xs text-[#6B7280]">
                        <p>Vendedor: <span className="font-medium text-[#374151]">{order.seller.name}</span></p>
                        <p>Destino: <span className="font-medium text-[#374151]">{order.buyerCity}</span></p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto shrink-0 space-y-2">
                       <Link 
                        href={`/equipo/${order.listingId}`}
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] text-sm font-semibold rounded-xl transition-colors"
                      >
                        Ver artículo <ChevronRight className="w-4 h-4" />
                      </Link>
                      
                      {/* Opcional: Chat o contacto al Admin para agilizar la compra */}
                      <a 
                        href={`https://wa.me/573164780276?text=${encodeURIComponent(`Hola Quiver! Tengo una duda sobre la compra del artículo: "${order.listing.title}" (Orden ID: ${order.id}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-5 py-2 text-[#3B82F6] hover:bg-blue-50 text-sm font-semibold rounded-xl transition-colors"
                      >
                        Ayuda con este pedido
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-[#3B82F6] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">Aún no has comprado nada</h3>
              <p className="text-[#6B7280] max-w-sm mb-6">
                Tus compras seguras aparecerán aquí. ¡Explora el catálogo y encuentra los mejores equipos!
              </p>
              <Link href="/equipos" className="px-5 py-2.5 bg-[#111827] text-white font-medium rounded-xl hover:bg-[#374151] transition-colors">
                Ver equipos en venta
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

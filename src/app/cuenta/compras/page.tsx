import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import OrderActions from "@/components/OrderActions";

export default async function ComprasPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const availabilityRequests = await prisma.availabilityRequest.findMany({
    where: { buyerId: session.user.id },
    include: {
      listing: { select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      listing: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      seller: { select: { name: true, phone: true, email: true } },
      review: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusLabel: Record<string, string> = {
    PENDING:   "Validando pago",
    PAID:      "Pago confirmado",
    SHIPPED:   "En camino",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  };
  const statusColor: Record<string, string> = {
    PENDING:   "bg-amber-50 text-amber-600",
    PAID:      "bg-emerald-50 text-emerald-600",
    SHIPPED:   "bg-blue-50 text-blue-600",
    DELIVERED: "bg-purple-50 text-purple-600",
    CANCELLED: "bg-red-50 text-red-500",
  };

  const availStatusConfig = {
    PENDING:   { label: "Esperando al vendedor", color: "bg-amber-50 text-amber-700 border-amber-200",     Icon: Clock },
    CONFIRMED: { label: "Disponible — puedes comprar", color: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle },
    REJECTED:  { label: "No disponible",          color: "bg-red-50 text-red-600 border-red-200",          Icon: XCircle },
  } as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Mis compras</h1>
        <p className="text-sm text-[#6B7280] mt-1">Historial de equipos que has comprado en Quiver.</p>
      </div>

      {/* Solicitudes de disponibilidad */}
      {availabilityRequests.length > 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <h2 className="text-sm font-bold text-[#111827]">Solicitudes de disponibilidad</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Equipos que consultaste antes de comprar.</p>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {availabilityRequests.map((req) => {
              const thumb = req.listing.images[0]?.url;
              const cfg = availStatusConfig[req.status];
              const Icon = cfg.Icon;
              return (
                <div key={req.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
                    {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111827] truncate">{req.listing.title}</p>
                    <span className={`inline-flex items-center gap-1 mt-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                  {req.status === "CONFIRMED" && (
                    <Link
                      href={`/equipo/${req.listing.id}`}
                      className="shrink-0 flex items-center gap-1 px-3 py-2 bg-[#111827] hover:bg-[#374151] text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Comprar <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: typeof orders[number]) => {
            const hasReview = order.review !== null;
            return (
              <div key={order.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center border-b border-[#F3F4F6]">
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
                      <span className={`font-semibold px-2 py-0.5 rounded-full ${statusColor[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {statusLabel[order.status] ?? order.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#111827] leading-snug">{order.listing.title}</h3>
                    <p className="text-sm font-medium text-[#111827] mt-1">${order.amount.toLocaleString("es-CO")} COP</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B7280]">
                      <p>Vendedor: <span className="font-medium text-[#374151]">{order.seller.name}</span></p>
                      <p>Destino: <span className="font-medium text-[#374151]">{order.buyerCity}</span></p>
                      {["PAID","SHIPPED","DELIVERED"].includes(order.status) && order.seller.phone && (
                        <p>Contacto vendedor: <span className="font-medium text-[#374151]">{order.seller.phone}</span></p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/equipo/${order.listingId}`}
                    className="flex items-center justify-center gap-1 px-4 py-2 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] text-sm font-semibold rounded-xl transition-colors shrink-0"
                  >
                    Ver artículo <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-5 bg-[#F9FAFB] space-y-4">
                  <OrderTimeline
                    orderId={order.id}
                    status={order.status}
                    role="buyer"
                    shippedAt={order.shippedAt?.toISOString() ?? null}
                    deliveredAt={order.deliveredAt?.toISOString() ?? null}
                    deliveryDeadline={order.deliveryDeadline?.toISOString() ?? null}
                    listingTitle={order.listing.title}
                  />

                  <OrderActions
                    orderId={order.id}
                    status={order.status}
                    role="buyer"
                    hasReview={hasReview}
                  />

                  <a
                    href={`https://wa.me/573164780276?text=${encodeURIComponent(`Hola Quiver! Tengo una duda sobre la compra del artículo: "${order.listing.title}" (Orden ID: ${order.id}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 text-[#3B82F6] hover:bg-blue-50 text-sm font-semibold rounded-xl transition-colors"
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
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-[#3B82F6]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827] mb-2">Aún no has comprado nada</h3>
          <p className="text-[#6B7280] max-w-sm mb-6">Explora el catálogo y encuentra los mejores equipos.</p>
          <Link href="/equipos" className="px-5 py-2.5 bg-[#111827] text-white font-medium rounded-xl hover:bg-[#374151] transition-colors">
            Ver equipos en venta
          </Link>
        </div>
      )}
    </div>
  );
}

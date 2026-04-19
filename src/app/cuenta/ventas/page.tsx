import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, MapPin, Phone, ChevronRight } from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import OrderActions from "@/components/OrderActions";
import SellerProfileForm from "@/components/SellerProfileForm";

export default async function VentasPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const [orders, seller] = await Promise.all([
    prisma.order.findMany({
      where: { sellerId: session.user.id },
      include: {
        listing: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
        buyer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true, phone: true, department: true, city: true, address: true,
        bankName: true, bankAccountType: true, bankAccountNumber: true,
        bankAccountHolder: true, bankIdDoc: true,
      },
    }),
  ]);

  const hasActiveOrders = orders.some(o => o.status !== "CANCELLED");
  const sellerProfileComplete = !!(
    seller?.name && seller?.phone && seller?.department && seller?.city &&
    seller?.address && seller?.bankName && seller?.bankAccountType &&
    seller?.bankAccountNumber && seller?.bankAccountHolder && seller?.bankIdDoc
  );

  const statusLabel: Record<string, string> = {
    PENDING:   "Esperando validación",
    PAID:      "Pago confirmado",
    SHIPPED:   "Enviado",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Mis ventas</h1>
        <p className="text-sm text-[#6B7280] mt-1">Órdenes de compra y seguimiento de despachos.</p>
      </div>

      {hasActiveOrders && !sellerProfileComplete && (
        <SellerProfileForm initial={{
          name: seller?.name ?? "",
          phone: seller?.phone ?? "",
          department: seller?.department ?? "",
          city: seller?.city ?? "",
          address: seller?.address ?? "",
          bankName: seller?.bankName ?? "",
          bankAccountType: seller?.bankAccountType ?? "",
          bankAccountNumber: seller?.bankAccountNumber ?? "",
          bankAccountHolder: seller?.bankAccountHolder ?? "",
          bankIdDoc: seller?.bankIdDoc ?? "",
        }} />
      )}

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: typeof orders[number]) => {
            return (
              <div key={order.id} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

                {/* Header */}
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
                    <p className="text-sm font-medium text-[#111827] mt-1">
                      ${order.amount.toLocaleString("es-CO")} COP
                      <span className="text-xs text-[#9CA3AF] ml-1">(menos tarifa escrow)</span>
                    </p>
                  </div>

                  <Link
                    href={`/equipo/${order.listingId}`}
                    className="flex items-center gap-1 px-4 py-2 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] text-sm font-semibold rounded-xl transition-colors shrink-0"
                  >
                    Ver artículo <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Info envío */}
                <div className="p-5 bg-[#F9FAFB] space-y-4">
                  <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#3B82F6]" /> Datos de envío del comprador
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#9CA3AF] mb-0.5">Nombre y cédula</p>
                      <p className="text-sm font-semibold text-[#111827]">{order.buyerName}</p>
                      <p className="text-xs text-[#374151]">C.C. {order.buyerIdDoc}</p>
                    </div>
                    {order.status === "PENDING" ? (
                      <div className="sm:col-span-2 flex items-center">
                        <p className="text-xs text-[#9CA3AF] italic">Los datos de contacto y dirección estarán disponibles una vez confirmemos el pago.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs text-[#9CA3AF] mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Contacto</p>
                          <p className="text-sm font-semibold text-[#111827]">{order.buyerPhone}</p>
                          <p className="text-xs text-[#374151]">{order.buyer.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF] mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Dirección</p>
                          <p className="text-sm font-semibold text-[#111827]">{order.buyerCity}</p>
                          <p className="text-xs text-[#374151] leading-relaxed">{order.buyerAddress}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <OrderTimeline
                    orderId={order.id}
                    status={order.status}
                    role="seller"
                    shippedAt={order.shippedAt?.toISOString() ?? null}
                    deliveredAt={order.deliveredAt?.toISOString() ?? null}
                    deliveryDeadline={order.deliveryDeadline?.toISOString() ?? null}
                    listingTitle={order.listing.title}
                  />

                  <OrderActions
                    orderId={order.id}
                    status={order.status}
                    role="seller"
                    hasReview={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-[#3B82F6]" />
          </div>
          <h3 className="text-lg font-bold text-[#111827] mb-2">Aún no has vendido artículos</h3>
          <p className="text-[#6B7280] max-w-sm mb-6">
            Cuando alguien compre tus equipos, aparecerán aquí junto con los datos de envío.
          </p>
        </div>
      )}
    </div>
  );
}

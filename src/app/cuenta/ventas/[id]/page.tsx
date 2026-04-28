import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Package, MapPin, Phone } from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import OrderActions from "@/components/OrderActions";
import SellerBankForm from "@/components/SellerBankForm";

const STATUS_LABEL: Record<string, string> = {
  PENDING:   "Esperando validación",
  PAID:      "Pago confirmado",
  SHIPPED:   "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-600",
  PAID:      "bg-emerald-50 text-emerald-600",
  SHIPPED:   "bg-blue-50 text-blue-600",
  DELIVERED: "bg-purple-50 text-purple-600",
  CANCELLED: "bg-red-50 text-red-500",
};

export default async function VentaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      listing: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      buyer: { select: { name: true, email: true } },
    },
  });

  if (!order || order.sellerId !== session.user.id) return notFound();

  const needsBankInfo = order.status !== "CANCELLED" && !order.sellerBankAccountNumber;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/cuenta/ventas"
          className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Mis ventas
        </Link>
      </div>

      <div>
        <h1 className="text-xl font-bold text-[#111827]">Detalle de venta</h1>
        <p className="text-xs text-[#9CA3AF] mt-1">Orden #{order.id}</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
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
              <span className={`font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                {STATUS_LABEL[order.status] ?? order.status}
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

        {/* Info envío y acciones */}
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

          {needsBankInfo ? (
            <SellerBankForm orderId={order.id} listingTitle={order.listing.title} />
          ) : order.sellerBankAccountNumber ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-xs font-bold text-emerald-800 mb-2">Datos bancarios para esta venta</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-emerald-900">
                <div><span className="text-emerald-600">Banco:</span> {order.sellerBankName}</div>
                <div><span className="text-emerald-600">Tipo:</span> {order.sellerBankAccountType}</div>
                <div><span className="text-emerald-600">Cuenta:</span> {order.sellerBankAccountNumber}</div>
                <div><span className="text-emerald-600">Titular:</span> {order.sellerBankAccountHolder}</div>
                <div><span className="text-emerald-600">Cédula:</span> {order.sellerBankIdDoc}</div>
              </div>
            </div>
          ) : null}

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
    </div>
  );
}

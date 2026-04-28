import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Package, MapPin, Phone,
  User, Store, CreditCard, Truck, MessageCircle,
} from "lucide-react";
import OrderTimeline from "@/components/OrderTimeline";
import AdminOrderActions from "./AdminOrderActions";

const STATUS_LABEL: Record<string, string> = {
  PENDING:   "Esperando validación",
  PAID:      "Pago confirmado",
  SHIPPED:   "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
  PAID:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  SHIPPED:   "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERED: "bg-purple-50 text-purple-700 border-purple-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

function waLink(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  const num = clean.startsWith("57") ? clean : `57${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F3F4F6] flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#3B82F6]" />
        <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default async function AdminOrdenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      listing: { include: { images: { orderBy: { order: "asc" }, take: 1 } } },
      buyer:   { select: { name: true, email: true, phone: true } },
      seller:  { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) return notFound();

  const buyerPhone = order.buyerPhone || order.buyer.phone || "";

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <Link href="/admin/ordenes" className="flex items-center gap-1 hover:text-[#111827] transition-colors">
          <ChevronLeft className="w-4 h-4" /> Órdenes
        </Link>
        <span>/</span>
        <span className="text-[#111827] font-medium truncate">{order.listing.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-20 h-20 bg-[#F9FAFB] rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
            {order.listing.images[0]?.url ? (
              <img src={order.listing.images[0].url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#9CA3AF]">Sin foto</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status]}`}>
                {STATUS_LABEL[order.status]}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h1 className="font-bold text-[#111827] text-lg leading-snug truncate">{order.listing.title}</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">Orden <span className="font-mono text-xs">{order.id}</span></p>
            <p className="text-xl font-bold text-[#111827] mt-1">${order.amount.toLocaleString("es-CO")} COP</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/equipo/${order.listingId}`}
              target="_blank"
              className="flex items-center gap-1 px-3 py-2 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#111827] text-sm font-semibold rounded-xl transition-colors"
            >
              Ver anuncio <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Comprador */}
        <Section title="Comprador" icon={User}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Nombre</p>
              <p className="font-semibold text-[#111827]">{order.buyerName}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Cédula</p>
              <p className="text-sm text-[#374151]">{order.buyerIdDoc}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono</p>
              <p className="text-sm text-[#374151]">{order.buyerPhone}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Email</p>
              <p className="text-sm text-[#374151]">{order.buyer.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Dirección de envío</p>
              <p className="text-sm font-semibold text-[#111827]">{order.buyerCity}</p>
              <p className="text-sm text-[#374151]">{order.buyerAddress}</p>
            </div>
            {buyerPhone && (
              <a
                href={waLink(buyerPhone, `Hola ${order.buyerName}, soy Quiver Co. Te contacto sobre tu orden de "${order.listing.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp comprador
              </a>
            )}
          </div>
        </Section>

        {/* Vendedor */}
        <Section title="Vendedor" icon={Store}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Nombre</p>
              <p className="font-semibold text-[#111827]">{order.seller.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Email</p>
              <p className="text-sm text-[#374151]">{order.seller.email}</p>
            </div>
            {order.seller.phone && (
              <div>
                <p className="text-xs text-[#9CA3AF] mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Teléfono</p>
                <p className="text-sm text-[#374151]">{order.seller.phone}</p>
              </div>
            )}
            {order.shippedAt && (
              <div>
                <p className="text-xs text-[#9CA3AF] mb-0.5 flex items-center gap-1"><Truck className="w-3 h-3" /> Enviado</p>
                <p className="text-sm text-[#374151]">{new Date(order.shippedAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            )}
            {order.seller.phone && (
              <a
                href={waLink(order.seller.phone, `Hola ${order.seller.name}, soy Quiver Co. Te contacto sobre la venta de "${order.listing.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp vendedor
              </a>
            )}
          </div>
        </Section>

        {/* Datos bancarios */}
        <Section title="Datos bancarios del vendedor" icon={CreditCard}>
          {order.sellerBankAccountNumber ? (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-xs text-[#9CA3AF]">Banco</p>
                  <p className="font-medium text-[#111827]">{order.sellerBankName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Tipo</p>
                  <p className="font-medium text-[#111827]">{order.sellerBankAccountType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Número de cuenta</p>
                  <p className="font-medium text-[#111827]">{order.sellerBankAccountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Titular</p>
                  <p className="font-medium text-[#111827]">{order.sellerBankAccountHolder}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Cédula</p>
                  <p className="font-medium text-[#111827]">{order.sellerBankIdDoc}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-amber-600 font-medium">El vendedor aún no ha ingresado sus datos bancarios.</p>
          )}
        </Section>

        {/* Prueba de envío */}
        <Section title="Prueba de envío" icon={Package}>
          {order.shippingProofUrl ? (
            <a href={order.shippingProofUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={order.shippingProofUrl}
                alt="Prueba de envío"
                className="w-full max-h-48 object-contain rounded-xl border border-[#E5E7EB] hover:opacity-90 transition-opacity"
              />
            </a>
          ) : (
            <p className="text-sm text-[#9CA3AF]">El vendedor aún no ha subido el comprobante de envío.</p>
          )}
        </Section>

      </div>

      {/* Timeline */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
        <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider mb-4">Estado de la orden</h2>
        <OrderTimeline
          orderId={order.id}
          status={order.status}
          role="seller"
          shippedAt={order.shippedAt?.toISOString() ?? null}
          deliveredAt={order.deliveredAt?.toISOString() ?? null}
          deliveryDeadline={order.deliveryDeadline?.toISOString() ?? null}
          listingTitle={order.listing.title}
        />
      </div>

      {/* Acciones admin */}
      <AdminOrderActions
        orderId={order.id}
        status={order.status}
        buyerName={order.buyerName}
        buyerPhone={buyerPhone}
        sellerName={order.seller.name ?? ""}
        sellerPhone={order.seller.phone ?? ""}
        listingTitle={order.listing.title}
      />

    </div>
  );
}

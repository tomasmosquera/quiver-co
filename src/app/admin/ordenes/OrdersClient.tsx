"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Truck, XCircle, ChevronDown, Search, MessageCircle } from "lucide-react";

type Order = {
  id: string;
  status: string;
  amount: number;
  createdAt: Date;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  shippingProofUrl: string | null;
  buyerName: string;
  buyerPhone: string;
  buyerCity: string;
  buyerAddress: string;
  buyerIdDoc: string;
  sellerBankName: string | null;
  sellerBankAccountType: string | null;
  sellerBankAccountNumber: string | null;
  sellerBankAccountHolder: string | null;
  sellerBankIdDoc: string | null;
  listing: { title: string; id: string };
  buyer: { name: string | null; email: string; phone: string | null };
  seller: { name: string | null; email: string; phone: string | null };
};

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

const NEXT_ACTIONS: Record<string, { label: string; status: string; icon: React.ElementType; style: string }[]> = {
  PENDING: [
    { label: "Confirmar pago", status: "PAID",      icon: CheckCircle, style: "bg-emerald-600 hover:bg-emerald-700 text-white" },
    { label: "Cancelar",       status: "CANCELLED",  icon: XCircle,     style: "bg-red-100 hover:bg-red-200 text-red-700" },
  ],
  PAID: [
    { label: "Marcar enviado", status: "SHIPPED",    icon: Truck,       style: "bg-blue-600 hover:bg-blue-700 text-white" },
    { label: "Cancelar",       status: "CANCELLED",  icon: XCircle,     style: "bg-red-100 hover:bg-red-200 text-red-700" },
  ],
  SHIPPED: [
    { label: "Confirmar entrega", status: "DELIVERED", icon: CheckCircle, style: "bg-purple-600 hover:bg-purple-700 text-white" },
    { label: "Cancelar",          status: "CANCELLED",  icon: XCircle,     style: "bg-red-100 hover:bg-red-200 text-red-700" },
  ],
};

// Genera mensajes de WhatsApp predefinidos por evento
function waLink(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  const num = clean.startsWith("57") ? clean : `57${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

function notifyLinks(order: Order, newStatus: string) {
  const title = order.listing.title;
  const links: { label: string; href: string }[] = [];

  if (newStatus === "PAID") {
    const buyerPhone = order.buyerPhone || order.buyer.phone;
    const sellerPhone = order.seller.phone;
    if (buyerPhone) {
      links.push({
        label: "Notificar comprador",
        href: waLink(buyerPhone, `Hola ${order.buyerName}! 👋 Confirmamos tu pago por "${title}". El vendedor ya sabe que debe preparar el envío. Te avisaremos cuando esté en camino. — Quiver Co.`),
      });
    }
    if (sellerPhone) {
      links.push({
        label: "Notificar vendedor",
        href: waLink(sellerPhone, `Hola ${order.seller.name}! 👋 El pago de "${title}" fue confirmado. Por favor prepara el envío al comprador lo antes posible y márcalo como enviado en quiver-co.vercel.app/cuenta/ventas — Quiver Co.`),
      });
    }
  }

  if (newStatus === "CANCELLED") {
    const buyerPhone = order.buyerPhone || order.buyer.phone;
    if (buyerPhone) {
      links.push({
        label: "Notificar comprador",
        href: waLink(buyerPhone, `Hola ${order.buyerName}, lamentamos informarte que tu orden de "${title}" fue cancelada. Si tienes dudas contáctanos. — Quiver Co.`),
      });
    }
  }

  return links;
}

function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [pendingNotify, setPendingNotify] = useState<{ label: string; href: string }[]>([]);

  async function changeStatus(newStatus: string) {
    setLoading(newStatus);
    const res = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);
    if (res.ok) {
      const links = notifyLinks(order, newStatus);
      if (links.length > 0) setPendingNotify(links);
    }
    router.refresh();
  }

  const actions = NEXT_ACTIONS[order.status] ?? [];
  const buyerWa = order.buyerPhone || order.buyer.phone;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
            <span suppressHydrationWarning className="text-xs text-[#9CA3AF]">
              {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="font-bold text-[#111827] truncate">{order.listing.title}</p>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Comprador: <span className="font-medium text-[#374151]">{order.buyer.name}</span>
            <span className="mx-1.5">·</span>
            Vendedor: <span className="font-medium text-[#374151]">{order.seller.name}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-base font-bold text-[#111827]">${order.amount.toLocaleString("es-CO")} COP</p>
            {buyerWa && (
              <a
                href={waLink(buyerWa, `Hola ${order.buyerName}, soy Quiver Co. Te contacto sobre tu orden de "${order.listing.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp comprador"
                className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Comprador {order.buyerPhone}
              </a>
            )}
            {order.seller.phone && (
              <a
                href={waLink(order.seller.phone, `Hola ${order.seller.name}, soy Quiver Co. Te contacto sobre la venta de "${order.listing.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp vendedor"
                className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Vendedor {order.seller.phone}
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {actions.map(({ label, status, icon: Icon, style }) => (
            <button
              key={status}
              onClick={() => changeStatus(status)}
              disabled={!!loading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${style}`}
            >
              {loading === status
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Icon className="w-4 h-4" />
              }
              {label}
            </button>
          ))}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] transition-colors"
          >
            Detalles <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notificaciones pendientes tras cambio de estado */}
      {pendingNotify.length > 0 && (
        <div className="mx-5 mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold text-emerald-800 flex-1">
            Estado actualizado. Notifica a las partes por WhatsApp:
          </p>
          {pendingNotify.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPendingNotify(prev => prev.filter(l => l.href !== href))}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" /> {label}
            </a>
          ))}
          <button
            onClick={() => setPendingNotify([])}
            className="text-xs text-emerald-600 hover:text-emerald-800 underline"
          >
            Descartar
          </button>
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#F3F4F6] p-5 bg-[#F9FAFB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <div>
            <p className="text-xs text-[#9CA3AF] mb-1">Comprador</p>
            <p className="font-semibold text-[#111827]">{order.buyerName}</p>
            <p className="text-[#374151]">C.C. {order.buyerIdDoc}</p>
            <p className="text-[#374151]">{order.buyerPhone}</p>
            <p className="text-[#374151]">{order.buyer.email}</p>
            {buyerWa && (
              <a
                href={waLink(buyerWa, `Hola ${order.buyerName}, soy Quiver Co. Te contacto sobre tu orden de "${order.listing.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3 h-3" /> Abrir WhatsApp
              </a>
            )}
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] mb-1">Dirección de envío</p>
            <p className="font-semibold text-[#111827]">{order.buyerCity}</p>
            <p className="text-[#374151] leading-relaxed">{order.buyerAddress}</p>
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] mb-1">Vendedor</p>
            <p className="font-semibold text-[#111827]">{order.seller.name}</p>
            <p className="text-[#374151]">{order.seller.email}</p>
            {order.seller.phone && (
              <a
                href={waLink(order.seller.phone, `Hola ${order.seller.name}, soy Quiver Co. Te contacto sobre la venta de "${order.listing.title}".`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3 h-3" /> {order.seller.phone}
              </a>
            )}
            {order.shippedAt && (
              <p className="text-[#374151] mt-2">Enviado: {new Date(order.shippedAt).toLocaleDateString("es-CO")}</p>
            )}
            {order.deliveredAt && (
              <p className="text-[#374151]">Entregado: {new Date(order.deliveredAt).toLocaleDateString("es-CO")}</p>
            )}
          </div>
          {order.sellerBankAccountNumber ? (
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs text-[#9CA3AF] mb-1">Datos bancarios del vendedor</p>
              <div className="space-y-0.5 text-sm">
                <p className="font-semibold text-[#111827]">{order.sellerBankName} · {order.sellerBankAccountType}</p>
                <p className="text-[#374151]">Cuenta: <span className="font-medium">{order.sellerBankAccountNumber}</span></p>
                <p className="text-[#374151]">Titular: {order.sellerBankAccountHolder}</p>
                <p className="text-[#374151]">C.C. {order.sellerBankIdDoc}</p>
              </div>
            </div>
          ) : (
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-xs text-[#9CA3AF] mb-1">Datos bancarios del vendedor</p>
              <p className="text-xs text-amber-600 font-medium">Pendiente — el vendedor aún no los ha ingresado.</p>
            </div>
          )}
          {order.shippingProofUrl && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-xs text-[#9CA3AF] mb-2">Prueba de envío</p>
              <a href={order.shippingProofUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={order.shippingProofUrl}
                  alt="Prueba de envío"
                  className="h-32 object-cover rounded-xl border border-[#E5E7EB] hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const FILTERS = [
    { value: "ALL",       label: "Todas" },
    { value: "PENDING",   label: "Pendientes" },
    { value: "PAID",      label: "Pagadas" },
    { value: "SHIPPED",   label: "Enviadas" },
    { value: "DELIVERED", label: "Entregadas" },
    { value: "CANCELLED", label: "Canceladas" },
  ];

  const q = search.toLowerCase().trim();

  const filtered = orders
    .filter(o => filter === "ALL" || o.status === filter)
    .filter(o => {
      if (!q) return true;
      return (
        o.listing.title.toLowerCase().includes(q) ||
        (o.buyer.name ?? "").toLowerCase().includes(q) ||
        o.buyer.email.toLowerCase().includes(q) ||
        o.buyerName.toLowerCase().includes(q) ||
        o.buyerPhone.includes(q) ||
        (o.seller.name ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Buscar por artículo, comprador, vendedor o teléfono..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(({ value, label }) => {
            const count = value === "ALL" ? orders.length : orders.filter(o => o.status === value).length;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === value
                    ? "bg-[#111827] text-white"
                    : "bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                }`}
              >
                {label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <p className="text-[#6B7280]">{q ? `Sin resultados para "${search}"` : "No hay órdenes en este estado."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => <OrderRow key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Truck, XCircle, ChevronDown } from "lucide-react";

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
  listing: { title: string; id: string };
  buyer: { name: string | null; email: string };
  seller: { name: string | null; email: string };
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

function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function changeStatus(newStatus: string) {
    setLoading(newStatus);
    await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);
    router.refresh();
  }

  const actions = NEXT_ACTIONS[order.status] ?? [];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
            <span className="text-xs text-[#9CA3AF]">
              {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <p className="font-bold text-[#111827] truncate">{order.listing.title}</p>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Comprador: <span className="font-medium text-[#374151]">{order.buyer.name}</span>
            <span className="mx-1.5">·</span>
            Vendedor: <span className="font-medium text-[#374151]">{order.seller.name}</span>
          </p>
          <p className="text-base font-bold text-[#111827] mt-1">${order.amount.toLocaleString("es-CO")} COP</p>
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

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-[#F3F4F6] p-5 bg-[#F9FAFB] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <div>
            <p className="text-xs text-[#9CA3AF] mb-1">Comprador</p>
            <p className="font-semibold text-[#111827]">{order.buyerName}</p>
            <p className="text-[#374151]">C.C. {order.buyerIdDoc}</p>
            <p className="text-[#374151]">{order.buyerPhone}</p>
            <p className="text-[#374151]">{order.buyer.email}</p>
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
            {order.shippedAt && (
              <p className="text-[#374151] mt-1">
                Enviado: {new Date(order.shippedAt).toLocaleDateString("es-CO")}
              </p>
            )}
            {order.deliveredAt && (
              <p className="text-[#374151]">
                Entregado: {new Date(order.deliveredAt).toLocaleDateString("es-CO")}
              </p>
            )}
          </div>
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

  const FILTERS = [
    { value: "ALL",       label: "Todas" },
    { value: "PENDING",   label: "Pendientes" },
    { value: "PAID",      label: "Pagadas" },
    { value: "SHIPPED",   label: "Enviadas" },
    { value: "DELIVERED", label: "Entregadas" },
    { value: "CANCELLED", label: "Canceladas" },
  ];

  const filtered = filter === "ALL" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => {
          const count = value === "ALL" ? orders.length : orders.filter(o => o.status === value).length;
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <p className="text-[#6B7280]">No hay órdenes en este estado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => <OrderRow key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}

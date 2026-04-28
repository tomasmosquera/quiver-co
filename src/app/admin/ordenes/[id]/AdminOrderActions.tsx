"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Truck, XCircle, Loader2, MessageCircle } from "lucide-react";

const NEXT_ACTIONS: Record<string, { label: string; status: string; icon: React.ElementType; style: string }[]> = {
  PENDING: [
    { label: "Confirmar pago",   status: "PAID",      icon: CheckCircle, style: "bg-emerald-600 hover:bg-emerald-700 text-white" },
    { label: "Cancelar orden",   status: "CANCELLED",  icon: XCircle,     style: "bg-red-100 hover:bg-red-200 text-red-700" },
  ],
  PAID: [
    { label: "Marcar como enviado", status: "SHIPPED",   icon: Truck,       style: "bg-blue-600 hover:bg-blue-700 text-white" },
    { label: "Cancelar orden",      status: "CANCELLED",  icon: XCircle,     style: "bg-red-100 hover:bg-red-200 text-red-700" },
  ],
  SHIPPED: [
    { label: "Confirmar entrega", status: "DELIVERED", icon: CheckCircle, style: "bg-purple-600 hover:bg-purple-700 text-white" },
    { label: "Cancelar orden",    status: "CANCELLED",  icon: XCircle,     style: "bg-red-100 hover:bg-red-200 text-red-700" },
  ],
};

function waLink(phone: string, message: string) {
  const clean = phone.replace(/\D/g, "");
  const num = clean.startsWith("57") ? clean : `57${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

interface Props {
  orderId: string;
  status: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
  listingTitle: string;
}

export default function AdminOrderActions({
  orderId, status, buyerName, buyerPhone, sellerName, sellerPhone, listingTitle,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [pendingNotify, setPendingNotify] = useState<{ label: string; href: string }[]>([]);

  const actions = NEXT_ACTIONS[status] ?? [];

  async function changeStatus(newStatus: string) {
    setLoading(newStatus);
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);

    const notify: { label: string; href: string }[] = [];
    if (newStatus === "PAID") {
      if (buyerPhone) notify.push({ label: "Notificar comprador", href: waLink(buyerPhone, `Hola ${buyerName}! 👋 Confirmamos tu pago por "${listingTitle}". El vendedor ya sabe que debe preparar el envío. — Quiver Co.`) });
      if (sellerPhone) notify.push({ label: "Notificar vendedor", href: waLink(sellerPhone, `Hola ${sellerName}! 👋 El pago de "${listingTitle}" fue confirmado. Prepara el envío y márcalo como enviado en quiverkite.com/cuenta/ventas — Quiver Co.`) });
    }
    if (newStatus === "CANCELLED") {
      if (buyerPhone) notify.push({ label: "Notificar comprador", href: waLink(buyerPhone, `Hola ${buyerName}, tu orden de "${listingTitle}" fue cancelada. Si tienes dudas contáctanos. — Quiver Co.`) });
    }
    if (notify.length > 0) setPendingNotify(notify);

    router.refresh();
  }

  if (actions.length === 0) return null;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Acciones de admin</h2>

      <div className="flex flex-wrap gap-3">
        {actions.map(({ label, status: newStatus, icon: Icon, style }) => (
          <button
            key={newStatus}
            onClick={() => changeStatus(newStatus)}
            disabled={!!loading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${style}`}
          >
            {loading === newStatus
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Icon className="w-4 h-4" />
            }
            {label}
          </button>
        ))}
      </div>

      {pendingNotify.length > 0 && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center gap-3">
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
    </div>
  );
}

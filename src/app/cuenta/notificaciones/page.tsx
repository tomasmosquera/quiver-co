"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, MessageCircle, TrendingUp, ShoppingBag, ShieldAlert } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "sale" | "purchase" | "admin";
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "message") return <MessageCircle className="w-5 h-5 text-[#3B82F6]" />;
  if (type === "sale")    return <TrendingUp className="w-5 h-5 text-emerald-500" />;
  if (type === "admin")   return <ShieldAlert className="w-5 h-5 text-violet-500" />;
  return <ShoppingBag className="w-5 h-5 text-amber-500" />;
}

function NotifBg({ type }: { type: Notification["type"] }) {
  if (type === "message") return "bg-blue-50";
  if (type === "sale")    return "bg-emerald-50";
  if (type === "admin")   return "bg-violet-50";
  return "bg-amber-50";
}

function timeAgo(dateStr: string) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Ahora mismo";
  if (mins < 60)  return `Hace ${mins} min`;
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${days} día${days !== 1 ? "s" : ""}`;
}

export default function CuentaNotificacionesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications ?? []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Notificaciones</h1>
        <p className="text-sm text-[#6B7280] mt-1">Todas tus alertas y actualizaciones.</p>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-16 flex flex-col items-center text-center">
          <Bell className="w-12 h-12 text-[#D1D5DB] mb-4" />
          <p className="font-semibold text-[#374151] text-lg">Todo al día</p>
          <p className="text-sm text-[#9CA3AF] mt-1">No tienes notificaciones pendientes.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden divide-y divide-[#F3F4F6]">
          {notifications.map(n => (
            <Link
              key={n.id}
              href={n.href}
              className="flex items-start gap-4 px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${NotifBg({ type: n.type })}`}>
                <NotifIcon type={n.type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-[#111827] leading-snug">{n.title}</p>
                  {n.type === "admin" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6B7280] mt-0.5 leading-relaxed">{n.body}</p>
              </div>
              <span className="text-xs text-[#9CA3AF] shrink-0 mt-1">{timeAgo(n.createdAt)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

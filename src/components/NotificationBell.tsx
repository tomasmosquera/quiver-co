"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageCircle, TrendingUp, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "message" | "sale" | "purchase";
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "message")  return <MessageCircle className="w-4 h-4 text-[#3B82F6]" />;
  if (type === "sale")     return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  return <ShoppingBag className="w-4 h-4 text-amber-500" />;
}

function NotifBg({ type }: { type: Notification["type"] }) {
  if (type === "message")  return "bg-blue-50";
  if (type === "sale")     return "bg-emerald-50";
  return "bg-amber-50";
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function fetchNotifications() {
      fetch("/api/notifications")
        .then(r => r.json())
        .then(d => { setNotifications(d.notifications ?? []); setLoaded(true); })
        .catch(() => setLoaded(true));
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const count = notifications.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-[#F9FAFB] text-[#374151] relative flex"
      >
        <Bell className="w-5 h-5" />
        {loaded && count > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-[9px] font-bold px-1">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
            <p className="text-sm font-bold text-[#111827]">Notificaciones</p>
            {count > 0 && (
              <span className="text-xs text-[#3B82F6] font-semibold">{count} nueva{count !== 1 ? "s" : ""}</span>
            )}
          </div>

          {!loaded ? (
            <div className="py-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : count === 0 ? (
            <div className="py-10 flex flex-col items-center text-center px-4">
              <Bell className="w-8 h-8 text-[#D1D5DB] mb-2" />
              <p className="text-sm font-semibold text-[#374151]">Todo al día</p>
              <p className="text-xs text-[#9CA3AF] mt-1">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-[#F3F4F6]">
              {notifications.map(n => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => {
                    setOpen(false);
                    // Refrescar tras navegar para limpiar el contador
                    setTimeout(() => {
                      fetch("/api/notifications")
                        .then(r => r.json())
                        .then(d => setNotifications(d.notifications ?? []));
                    }, 1500);
                  }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${NotifBg({ type: n.type })}`}>
                    <NotifIcon type={n.type} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111827] leading-snug">{n.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{n.body}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

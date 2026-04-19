"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, MessageCircle, TrendingUp, ShoppingBag, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "message" | "sale" | "purchase" | "admin";
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

const SEEN_KEY = "quiver_seen_notifs";

function getSeenIds(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]")); }
  catch { return new Set(); }
}
function saveSeenIds(ids: Set<string>) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "message")  return <MessageCircle className="w-4 h-4 text-[#3B82F6]" />;
  if (type === "sale")     return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (type === "admin")    return <ShieldAlert className="w-4 h-4 text-white" />;
  return <ShoppingBag className="w-4 h-4 text-amber-500" />;
}

function NotifBg({ type }: { type: Notification["type"] }) {
  if (type === "message")  return "bg-blue-50";
  if (type === "sale")     return "bg-emerald-50";
  if (type === "admin")    return "bg-[#6B7280]";
  return "bg-amber-50";
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function fetchNotifications() {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => {
        setNotifications(d.notifications ?? []);
        setSeenIds(getSeenIds());
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 8_000);
    const onVisible = () => { if (document.visibilityState === "visible") fetchNotifications(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleOpen() {
    if (!open) {
      // Marcar todas como vistas al abrir
      const newSeen = new Set([...seenIds, ...notifications.map(n => n.id)]);
      setSeenIds(newSeen);
      saveSeenIds(newSeen);
    }
    setOpen(!open);
  }

  const unseenCount = notifications.filter(n => !seenIds.has(n.id)).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="p-2 rounded-lg hover:bg-[#F9FAFB] text-[#374151] relative flex"
      >
        <Bell className="w-5 h-5" />
        {loaded && unseenCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-[9px] font-bold px-1">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
            <p className="text-sm font-bold text-[#111827]">Notificaciones</p>
            {unseenCount > 0 && (
              <span className="text-xs text-[#3B82F6] font-semibold">{unseenCount} nueva{unseenCount !== 1 ? "s" : ""}</span>
            )}
          </div>

          {!loaded ? (
            <div className="py-8 flex justify-center">
              <div className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-10 flex flex-col items-center text-center px-4">
              <Bell className="w-8 h-8 text-[#D1D5DB] mb-2" />
              <p className="text-sm font-semibold text-[#374151]">Todo al día</p>
              <p className="text-xs text-[#9CA3AF] mt-1">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            <>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F3F4F6]">
                {(() => {
                  const adminNotifs = notifications.filter(n => n.type === "admin");
                  const userNotifs  = notifications.filter(n => n.type !== "admin");
                  const items = [...adminNotifs, ...userNotifs].slice(0, 5);
                  const firstUserIdx = items.findIndex(n => n.type !== "admin");
                  return items.map((n, i) => (
                    <div key={n.id}>
                      {i === 0 && adminNotifs.length > 0 && (
                        <div className="px-4 py-1.5 bg-[#F3F4F6]">
                          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Panel admin</p>
                        </div>
                      )}
                      {i === firstUserIdx && adminNotifs.length > 0 && (
                        <div className="px-4 py-1.5 bg-[#F3F4F6]">
                          <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Tus notificaciones</p>
                        </div>
                      )}
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.type === "admin" ? "bg-[#F3F4F6] hover:bg-[#E5E7EB]" : "hover:bg-[#F9FAFB]"}`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${NotifBg({ type: n.type })}`}>
                          <NotifIcon type={n.type} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-snug text-[#111827]">{n.title}</p>
                          <p className="text-xs mt-0.5 leading-relaxed line-clamp-2 text-[#6B7280]">{n.body}</p>
                        </div>
                      </Link>
                    </div>
                  ));
                })()}
              </div>
              <div className="border-t border-[#F3F4F6]">
                <Link
                  href="/notificaciones"
                  onClick={() => setOpen(false)}
                  className="block text-center px-4 py-3 text-sm text-[#3B82F6] font-medium hover:bg-[#F9FAFB] transition-colors"
                >
                  Ver todas las notificaciones →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

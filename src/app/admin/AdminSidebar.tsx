"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessagesSquare,
  Package,
  ShoppingCart,
  Star,
  Users,
  Wind,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/ordenes",  label: "Órdenes",   icon: ShoppingCart },
  { href: "/admin/anuncios", label: "Anuncios",  icon: Package },
  { href: "/admin/usuarios", label: "Usuarios",  icon: Users },
  { href: "/admin/resenas",  label: "Reseñas",   icon: Star },
  { href: "/admin/mensajes",        label: "Mensajes",        icon: MessageCircle },
  { href: "/admin/conversaciones",  label: "Conversaciones",  icon: MessagesSquare },
];

function isActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/crear-anuncio") return null;

  return (
    <>
      {/* ── Mobile: barra inferior fija ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111827] border-t border-white/10">
        <div className="flex items-center justify-around px-1 py-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[52px] ${
                  active ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-semibold leading-none">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-white/50 hover:text-white transition-colors min-w-[52px]"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-[9px] font-semibold leading-none">Salir</span>
          </button>
        </div>
      </div>

      {/* ── Desktop: sidebar izquierdo ── */}
      <aside className="hidden sm:flex sticky top-0 h-screen w-20 shrink-0 flex-col bg-[#111827] text-white">
        <div className="flex items-center justify-center border-b border-white/10 px-3 py-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#3B82F6]"
            title="Quiver Admin"
            aria-label="Quiver Admin"
          >
            <Wind className="h-5 w-5" />
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-2 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className={`flex items-center justify-center rounded-xl px-3 py-3 transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-2 py-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="flex w-full items-center justify-center rounded-xl px-3 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Users, Star, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/ordenes",   label: "Órdenes",    icon: ShoppingCart },
  { href: "/admin/anuncios",  label: "Anuncios",   icon: Package },
  { href: "/admin/usuarios",  label: "Usuarios",   icon: Users },
  { href: "/admin/resenas",   label: "Reseñas",    icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-[#111827] text-white flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <p className="font-bold text-lg">Quiver Admin</p>
        <p className="text-xs text-white/50 mt-0.5">Panel de control</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

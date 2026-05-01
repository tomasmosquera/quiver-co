"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Star,
  Users,
  Wind,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/ordenes", label: "Ordenes", icon: ShoppingCart },
  { href: "/admin/anuncios", label: "Anuncios", icon: Package },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/resenas", label: "Resenas", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  if (pathname === "/admin/crear-anuncio") return null;

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col bg-[#111827] text-white sm:w-20">
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
          const active = pathname === href;
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
          title="Cerrar sesion"
          aria-label="Cerrar sesion"
          className="flex w-full items-center justify-center rounded-xl px-3 py-3 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User, ShoppingBag, Package, TrendingUp,
  Heart, MessageCircle,
} from "lucide-react";

const NAV = [
  { label: "Mi perfil",    href: "/cuenta",           icon: User },
  { label: "Mis anuncios", href: "/cuenta/anuncios",  icon: ShoppingBag },
  { label: "Compras",      href: "/cuenta/compras",   icon: Package },
  { label: "Ventas",       href: "/cuenta/ventas",    icon: TrendingUp },
  { label: "Favoritos",    href: "/cuenta/favoritos", icon: Heart },
  { label: "Mensajes",     href: "/cuenta/mensajes",  icon: MessageCircle },
];

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="space-y-1 md:sticky md:top-24">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = href === "/cuenta"
                ? pathname === "/cuenta"
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#111827] text-white"
                      : "text-[#374151] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-[#9CA3AF]"}`} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}

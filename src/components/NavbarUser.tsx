"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ShoppingBag, Heart, Settings } from "lucide-react";

export default function NavbarUser() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-[#F3F4F6] animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-sm font-medium rounded-lg transition-colors"
      >
        <User className="w-4 h-4" />
        Ingresar
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F9FAFB] transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? ""}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
            {session.user.name?.[0] ?? "U"}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-50">
          <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
            <p className="text-sm font-semibold text-[#111827] truncate">{session.user.name}</p>
            <p className="text-xs text-[#9CA3AF] truncate">{session.user.email}</p>
          </div>
          <div className="py-1">
            {[
              { label: "Mis anuncios",  href: "/cuenta/anuncios",  icon: ShoppingBag },
              { label: "Favoritos",     href: "/cuenta/favoritos", icon: Heart },
              { label: "Configuración", href: "/cuenta/config",    icon: Settings },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-[#F3F4F6] py-1">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

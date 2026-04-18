"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ChevronDown, Wind, User, MessageCircle, Heart, LogOut, Package } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import NavbarUser from "@/components/NavbarUser";
import { useSession, signOut } from "next-auth/react";

const DISCIPLINES = [
  { name: "Kitesurf",    slug: "kitesurf",    seccion: "KITESURF" },
  { name: "Kitefoil",    slug: "kitefoil",    seccion: "KITEFOIL" },
  { name: "Wingfoil",    slug: "wingfoil",    seccion: "WINGFOIL" },
  { name: "Accesorios",  slug: "accesorios",  seccion: "Accesorios" },
];

const EQUIPMENT = [
  { label: "Cometas",  value: "COMETA" },
  { label: "Tablas",           value: "TABLA" },
  { label: "Barras & Líneas",  value: "BARRA_LINEAS" },
  { label: "Foils",            value: "FOIL" },
  { label: "Arneses",          value: "ARNES" },
  { label: "Trajes",           value: "TRAJE" },
  { label: "Accesorios",       value: "ACCESORIO" },
  { label: "Combos completos", value: "COMBO" },
];

const BRANDS = [
  { name: "Cabrinha", slug: "cabrinha" },
  { name: "Duotone", slug: "duotone" },
  { name: "Ozone", slug: "ozone" },
  { name: "Core", slug: "core" },
  { name: "North", slug: "north" },
  { name: "F-One", slug: "f-one" },
  { name: "Slingshot", slug: "slingshot" },
  { name: "Naish", slug: "naish" },
  { name: "Airush", slug: "airush" },
  { name: "Reedin", slug: "reedin" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [discOpen, setDiscOpen]     = useState(false);
  const [equipOpen, setEquipOpen]   = useState(false);
  const [brandOpen, setBrandOpen]   = useState(false);
  const [mDiscOpen, setMDiscOpen]   = useState(false);
  const [mEquipOpen, setMEquipOpen] = useState(false);
  const [mBrandOpen, setMBrandOpen] = useState(false);
  const [q, setQ] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/equipos?q=${encodeURIComponent(term)}` : "/equipos");
    setMenuOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDiscOpen(false);
        setEquipOpen(false);
        setBrandOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center">
              <Wind className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <span className="font-bold text-[#111827] text-lg tracking-tight">
              Quiver<span className="text-[#3B82F6]"> Co.</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="flex w-full rounded-lg border border-[#D1D5DB] overflow-hidden focus-within:border-[#3B82F6] focus-within:ring-1 focus-within:ring-[#3B82F6] transition-all">
              <input
                type="text"
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Buscar equipos, marcas, disciplinas..."
                className="flex-1 px-4 py-2.5 text-sm bg-white outline-none text-[#111827] placeholder:text-[#9CA3AF]"
              />
              <button type="submit" className="px-4 bg-[#3B82F6] hover:bg-blue-600 transition-colors text-white flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium hidden lg:block">Buscar</span>
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            <Link
              href="/vender"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#111827] hover:bg-[#374151] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Vender
            </Link>
            <div className="hidden md:flex">
              <NotificationBell />
            </div>
            <div className="hidden md:flex">
              <NavbarUser />
            </div>
            <button
              className="p-2 rounded-lg hover:bg-[#F9FAFB] text-[#374151] md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary nav — desktop */}
        <div className="hidden md:flex items-center gap-1 pb-2">

          {/* Por disciplina dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB] rounded-md transition-colors"
              onClick={() => { setDiscOpen(!discOpen); setEquipOpen(false); setBrandOpen(false); }}
            >
              Por sección <ChevronDown className={`w-3.5 h-3.5 transition-transform ${discOpen ? "rotate-180" : ""}`} />
            </button>
            {discOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-50">
                {DISCIPLINES.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/equipos?seccion=${d.seccion}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
                    onClick={() => setDiscOpen(false)}
                  >
                    {d.name}
                  </Link>
                ))}
                <div className="border-t border-[#F3F4F6] mt-1 pt-1">
                  <Link
                    href="/equipos"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3B82F6] font-medium hover:bg-[#F9FAFB] transition-colors"
                    onClick={() => setDiscOpen(false)}
                  >
                    Ver todas las secciones →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Equipos dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-md transition-colors"
              onClick={() => { setEquipOpen(!equipOpen); setDiscOpen(false); setBrandOpen(false); }}
            >
              Por equipo <ChevronDown className={`w-3.5 h-3.5 transition-transform ${equipOpen ? "rotate-180" : ""}`} />
            </button>
            {equipOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-50">
                {EQUIPMENT.map((eq) => (
                  <Link
                    key={eq.value}
                    href={`/equipos?tipo=${eq.value}`}
                    className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
                    onClick={() => setEquipOpen(false)}
                  >
                    {eq.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Marcas dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-md transition-colors"
              onClick={() => { setBrandOpen(!brandOpen); setDiscOpen(false); setEquipOpen(false); }}
            >
              Por marcas <ChevronDown className={`w-3.5 h-3.5 transition-transform ${brandOpen ? "rotate-180" : ""}`} />
            </button>
            {brandOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1.5 z-50">
                {BRANDS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/equipos?marca=${b.slug}`}
                    className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827] transition-colors"
                    onClick={() => setBrandOpen(false)}
                  >
                    {b.name}
                  </Link>
                ))}
                <div className="border-t border-[#F3F4F6] mt-1 pt-1">
                  <Link
                    href="/equipos"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3B82F6] font-medium hover:bg-[#F9FAFB] transition-colors"
                    onClick={() => setBrandOpen(false)}
                  >
                    Ver todas las marcas &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-[#E5E7EB] mx-1" />

          {[
            { label: "Guías",     href: "/guias"     },
            { label: "Spots",     href: "/spots"     },
            { label: "Eventos",   href: "/eventos"   },
            { label: "Comunidad", href: "/comunidad" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm text-[#374151] hover:text-[#111827] hover:bg-[#F9FAFB] rounded-md transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex rounded-lg border border-[#D1D5DB] overflow-hidden">
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar equipos..."
              className="flex-1 px-4 py-2.5 text-sm outline-none"
            />
            <button type="submit" className="px-4 bg-[#3B82F6] text-white">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <Link
            href="/vender"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#111827] text-white text-sm font-medium rounded-lg"
            onClick={() => setMenuOpen(false)}
          >
            <ShoppingBag className="w-4 h-4" />
            Publicar un equipo
          </Link>

          {/* Por disciplina */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            <button
              onClick={() => setMDiscOpen(!mDiscOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB]"
            >
              Por sección
              <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${mDiscOpen ? "rotate-180" : ""}`} />
            </button>
            {mDiscOpen && (
              <div className="border-t border-[#F3F4F6] grid grid-cols-2">
                {DISCIPLINES.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/equipos?seccion=${d.seccion}`}
                    className="px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Por equipo */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            <button
              onClick={() => setMEquipOpen(!mEquipOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB]"
            >
              Por equipo
              <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${mEquipOpen ? "rotate-180" : ""}`} />
            </button>
            {mEquipOpen && (
              <div className="border-t border-[#F3F4F6]">
                {EQUIPMENT.map((eq) => (
                  <Link
                    key={eq.value}
                    href={`/equipos?tipo=${eq.value}`}
                    className="block px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {eq.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Por marcas */}
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
            <button
              onClick={() => setMBrandOpen(!mBrandOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-[#111827] hover:bg-[#F9FAFB]"
            >
              Por marcas
              <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${mBrandOpen ? "rotate-180" : ""}`} />
            </button>
            {mBrandOpen && (
              <div className="border-t border-[#F3F4F6]">
                <div className="grid grid-cols-2">
                  {BRANDS.map((b) => (
                    <Link
                      key={b.slug}
                      href={`/equipos?marca=${b.slug}`}
                      className="px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/equipos"
                  className="block px-4 py-2.5 text-sm text-[#3B82F6] font-medium hover:bg-[#F9FAFB] border-t border-[#F3F4F6]"
                  onClick={() => setMenuOpen(false)}
                >
                  Ver todas las marcas →
                </Link>
              </div>
            )}
          </div>

          {/* Guías y Spots */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/guias"
              className="flex items-center justify-center py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
              onClick={() => setMenuOpen(false)}
            >
              Guías
            </Link>
            <Link
              href="/spots"
              className="flex items-center justify-center py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
              onClick={() => setMenuOpen(false)}
            >
              Spots
            </Link>
          </div>

          {/* Perfil / Sesión */}
          <div className="border-t border-[#E5E7EB] pt-4">
            {session ? (
              <div className="space-y-1">
                <Link
                  href="/cuenta"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-2 pb-3 hover:opacity-80"
                >
                  {session.user.image
                    ? <img src={session.user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                    : <div className="w-9 h-9 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold text-sm">{session.user.name?.[0]}</div>
                  }
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{session.user.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{session.user.email}</p>
                  </div>
                </Link>
                {[
                  { label: "Mis anuncios",  href: "/cuenta/anuncios",  Icon: ShoppingBag },
                  { label: "Compras",       href: "/cuenta/compras",   Icon: Package },
                  { label: "Mensajes",      href: "/mensajes",         Icon: MessageCircle },
                  { label: "Favoritos",     href: "/cuenta/favoritos", Icon: Heart },
                ].map(({ label, href, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#374151] hover:bg-[#F9FAFB] rounded-xl"
                  >
                    <Icon className="w-4 h-4 text-[#9CA3AF]" /> {label}
                  </Link>
                ))}
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 border border-[#E5E7EB] text-sm font-medium text-[#374151] rounded-xl hover:bg-[#F9FAFB]"
              >
                <User className="w-4 h-4" /> Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import {
  Search, ArrowRight, Wind, Shield, CreditCard,
  Star, MapPin, ChevronRight, TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import FavoriteButton from "@/components/FavoriteButton";
import { auth } from "@/lib/auth";

/* ─── Data ─── */

const COMING_SOON_DISCIPLINES = ["windsurf", "wakeboard", "paddle"];

const DISCIPLINE_META = [
  { name: "Kitesurf",  slug: "kitesurf",  desc: "Cometas, barras, tablas y arneses",            color: "bg-sky-50 border-sky-100 hover:border-sky-300",          badge: "text-sky-700"    },
  { name: "Kitefoil",  slug: "kitefoil",  desc: "Equipos específicos para foil con cometa",      color: "bg-rose-50 border-rose-100 hover:border-rose-300",         badge: "text-rose-700"   },
  { name: "Wingfoil",  slug: "wingfoil",  desc: "Wings, foils y tablas de wingfoil",             color: "bg-violet-50 border-violet-100 hover:border-violet-300",  badge: "text-violet-700" },
  { name: "Windsurf",  slug: "windsurf",  desc: "Velas, tablas y mástiles",                      color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300", badge: "text-emerald-700" },
  { name: "Wakeboard", slug: "wakeboard", desc: "Tablas, bindings y accesorios wake",             color: "bg-orange-50 border-orange-100 hover:border-orange-300",  badge: "text-orange-700" },
  { name: "Paddle",    slug: "paddle",    desc: "Tablas de paddle y remos",                       color: "bg-teal-50 border-teal-100 hover:border-teal-300",         badge: "text-teal-700"   },
];

const EQUIPMENT_TYPES = [
  { name: "Cometas",         href: "/equipos?tipo=COMETA&orden=reciente" },
  { name: "Tablas",          href: "/equipos?tipo=TABLA&orden=reciente" },
  { name: "Barras & Líneas", href: "/equipos?tipo=BARRA_LINEAS&orden=reciente" },
  { name: "Wings",           href: "/equipos?tipo=WING&orden=reciente" },
  { name: "Leashes",         href: "/equipos?tipo=LEASH&orden=reciente" },
  { name: "Arneses",         href: "/equipos?tipo=ARNES&orden=reciente" },
  { name: "Wetsuits",        href: "/equipos?orden=reciente&tipo=WETSUIT" },
  { name: "Accesorios",      href: "/equipos?orden=reciente&seccion=Accesorios" },
];


const SPOTS = [
  {
    name: "Cartagena",
    region: "Costa Caribe",
    wind: "Dic – Abr",
    level: "Todos",
    disciplines: ["Kitesurf", "Wingfoil"],
    img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=75",
  },
  {
    name: "Coveñas",
    region: "Sucre",
    wind: "Dic – Mar",
    level: "Intermedio",
    disciplines: ["Kitesurf", "Windsurf"],
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=500&q=75",
  },
  {
    name: "Laguna del Sonso",
    region: "Valle del Cauca",
    wind: "Todo el año",
    level: "Todos",
    disciplines: ["Wakeboard", "Paddle"],
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=75",
  },
];

const CONDITION_LABELS: Record<string, string> = {
  NUEVO: "Nuevo", COMO_NUEVO: "Como nuevo", USADO: "Usado",
};
const CONDITION_COLORS: Record<string, string> = {
  NUEVO: "bg-emerald-50 text-emerald-700",
  COMO_NUEVO: "bg-blue-50 text-blue-700",
  USADO: "bg-amber-50 text-amber-700",
};
const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf", KITEFOIL: "Kitefoil", WINGFOIL: "Wingfoil",
  WINDSURF: "Windsurf", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
  WATERWEAR: "Accesorios",
};

/* ─── Page ─── */

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [counts, recentListings, totalListings] = await Promise.all([
    prisma.listing.groupBy({
      by: ["discipline"],
      where: { status: "ACTIVE" },
      _count: { _all: true },
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        seller: { select: { name: true, image: true, verified: true } },
        favoritedBy: userId ? { where: { userId } } : false,
      },
    }),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
  ]);

  const countMap = Object.fromEntries(counts.map(c => [c.discipline, c._count._all]));

  const DISCIPLINES = DISCIPLINE_META.map(d => ({
    ...d,
    listings: countMap[d.slug.toUpperCase()] ?? 0,
  }));

  return (
    <div className="bg-[#FAFAF8]">

      {/* ── HERO ── */}
      <section className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1F2937] border border-[#374151] text-[#D1D5DB] text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Wind className="w-3.5 h-3.5 text-[#3B82F6]" />
              El mejor marketplace especializado de deportes acuáticos en Colombia
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Tu próximo equipo,{" "}
              <span className="text-[#3B82F6]">tu disciplina</span>
            </h1>
            <p className="mt-5 text-lg text-[#9CA3AF] max-w-xl leading-relaxed">
              Kitesurf, Kitefoil, Wingfoil, y más. Compra y vende equipos con transacciones 100% seguras en Colombia.
            </p>

            {/* Search with discipline selector */}
            <form method="GET" action="/equipos" className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="flex flex-1 rounded-xl border border-[#374151] bg-[#1F2937] overflow-hidden focus-within:border-[#3B82F6] transition-all">
                <Search className="w-5 h-5 text-[#6B7280] my-auto ml-4 shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar por equipo, marca, disciplina..."
                  className="flex-1 px-3 py-4 bg-transparent text-white placeholder:text-[#6B7280] outline-none text-sm"
                />
              </div>
              <button type="submit" className="px-6 py-4 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors whitespace-nowrap text-sm">
                Buscar
              </button>
            </form>

            {/* Quick discipline pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="text-xs text-[#6B7280] my-auto mr-1">Ir directo a:</span>
              {DISCIPLINES.filter(d => !COMING_SOON_DISCIPLINES.includes(d.slug)).map((d) => (
                <Link
                  key={d.slug}
                  href={`/equipos?seccion=${d.slug.toUpperCase()}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F2937] border border-[#374151] hover:border-[#3B82F6] text-[#D1D5DB] hover:text-white text-xs rounded-full transition-all"
                >
                  {d.name}
                </Link>
              ))}
              <Link
                href="/equipos?seccion=Accesorios"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F2937] border border-[#374151] hover:border-[#3B82F6] text-[#D1D5DB] hover:text-white text-xs rounded-full transition-all"
              >
                Accesorios
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { label: "Equipos en venta", value: totalListings > 0 ? `${totalListings}` : "Nuevo" },
                { label: "Disciplinas activas", value: "3" },
                { label: "Transacciones seguras", value: "100%" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-[#6B7280]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x divide-[#E5E7EB]">
            {[
              { icon: Shield,     title: "Pago protegido",         desc: "Tu dinero queda retenido hasta que confirmas la recepción del equipo." },
              { icon: CreditCard, title: "PSE, Nequi & tarjetas",  desc: "Próximamente: paga con los métodos que ya usas. Procesado por Wompi." },
              { icon: Star,       title: "Vendedores verificados",  desc: "Sistema de reputación y verificación de cédula para mayor confianza." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 sm:px-8 first:pl-0 last:pr-0">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="font-semibold text-[#111827] text-sm">{title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCIPLINES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-[#111827]">Elige tu disciplina</h2>
        </div>
        <p className="text-sm text-[#6B7280] mb-7">
          Filtra todos los equipos por el deporte que practicas.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DISCIPLINES.map((d) => {
            const soon = COMING_SOON_DISCIPLINES.includes(d.slug);
            if (soon) return (
              <div key={d.slug} className={`relative border rounded-2xl p-5 flex flex-col gap-3 opacity-50 cursor-not-allowed ${d.color}`}>
                <div>
                  <p className="font-bold text-[#111827]">{d.name}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{d.desc}</p>
                </div>
                <span className="text-xs font-semibold text-[#9CA3AF] mt-auto uppercase tracking-wider">Próximamente</span>
              </div>
            );
            return (
              <Link
                key={d.slug}
                href={`/equipos?seccion=${d.slug.toUpperCase()}`}
                className={`group border rounded-2xl p-5 flex flex-col gap-3 transition-all hover:shadow-md ${d.color}`}
              >
                <div>
                  <p className="font-bold text-[#111827] group-hover:text-[#3B82F6] transition-colors">{d.name}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{d.desc}</p>
                </div>
                <span className={`text-xs font-semibold ${d.badge} mt-auto`}>
                  {d.listings} equipos →
                </span>
              </Link>
            );
          })}

          {/* Ver todo CTA card */}
          <Link
            href="/equipos"
            className="group border border-dashed border-[#D1D5DB] hover:border-[#3B82F6] rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center transition-all hover:shadow-md bg-white"
          >
            <span className="text-3xl">🔍</span>
            <p className="font-semibold text-[#374151] group-hover:text-[#3B82F6] text-sm transition-colors">
              Ver todos los equipos
            </p>
            <p className="text-xs text-[#9CA3AF]">Sin filtro de disciplina</p>
          </Link>
        </div>
      </section>

      {/* ── EQUIPMENT TYPES ── */}
      <section className="bg-white border-y border-[#E5E7EB] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-5">
            O busca por equipo
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {EQUIPMENT_TYPES.map((eq) => (
              <Link
                key={eq.name}
                href={eq.href}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#111827] hover:bg-white rounded-xl text-sm font-medium text-[#374151] hover:text-[#111827] transition-all whitespace-nowrap"
              >
                {eq.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#111827]">Equipos destacados</h2>
            <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 font-medium px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> Popular
            </span>
          </div>
          <Link href="/equipos" className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <div className="text-center py-16 text-[#9CA3AF]">
            <Wind className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aún no hay equipos publicados. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentListings.map((listing) => {
              const img = listing.images[0]?.url;
              return (
                <Link
                  key={listing.id}
                  href={`/equipo/${listing.id}`}
                  className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-[#F9FAFB] overflow-hidden">
                    {img ? (
                      <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]">
                        <Wind className="w-12 h-12" />
                      </div>
                    )}
                    {listing.featured && (
                      <span className="absolute top-3 left-3 bg-[#3B82F6] text-white text-xs font-semibold px-2.5 py-1 rounded-full">Destacado</span>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-sm ${CONDITION_COLORS[listing.condition] ?? ""}`}>
                        {CONDITION_LABELS[listing.condition] ?? listing.condition}
                      </span>
                      <FavoriteButton 
                        listingId={listing.id} 
                        initiallySaved={userId && "favoritedBy" in listing ? (listing as any).favoritedBy.length > 0 : false} 
                        variant="icon" 
                      />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#3B82F6]">
                        {DISCIPLINE_LABELS[listing.discipline] ?? listing.discipline}
                      </span>
                      {listing.brand && (
                        <span className="text-xs text-[#9CA3AF]">{listing.brand}{listing.size ? ` · ${listing.size}` : ""}</span>
                      )}
                    </div>
                    <h3 className="text-[#111827] font-semibold text-sm line-clamp-2 leading-snug group-hover:text-[#3B82F6] transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-[#111827] font-bold text-xl mt-auto">
                      ${listing.price.toLocaleString("es-CO")}
                      <span className="text-xs text-[#9CA3AF] font-normal ml-1">COP</span>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                      <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {listing.city}
                      </div>
                      <div className="flex items-center gap-1">
                        {listing.seller.verified && <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />}
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-[#6B7280]">{listing.seller.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/equipos"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#111827] text-[#111827] font-semibold rounded-xl hover:bg-[#111827] hover:text-white transition-all"
          >
            Ver todos los equipos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── SPOTS ── */}
      <section className="bg-white border-y border-[#E5E7EB] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">Spots en Colombia</h2>
              <p className="text-sm text-[#6B7280] mt-1">Los mejores lugares para cada disciplina</p>
            </div>
            <Link href="/spots" className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
              Ver mapa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {SPOTS.map((spot) => (
              <Link
                key={spot.name}
                href={`/spots/${spot.name.toLowerCase().replace(/ /g, "-")}`}
                className="group relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#111827]"
              >
                <img
                  src={spot.img}
                  alt={spot.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {spot.region}
                  </div>
                  <h3 className="text-white font-bold text-xl">{spot.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-white/20 backdrop-blur text-white px-2.5 py-1 rounded-full">
                      💨 {spot.wind}
                    </span>
                    {spot.disciplines.map((d) => (
                      <span key={d} className="text-xs bg-white/20 backdrop-blur text-white px-2.5 py-1 rounded-full">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#111827]">¿Cómo funciona?</h2>
          <p className="text-[#6B7280] mt-3">Comprar y vender en Quiver Co. es simple y seguro</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8">
            <h3 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-50 text-[#3B82F6] rounded-lg flex items-center justify-center text-sm font-bold">C</span>
              Para compradores
            </h3>
            <ol className="space-y-5">
              {[
                ["Elige tu disciplina", "Filtra por Kitesurf, Wingfoil, Wakeboard o cualquier disciplina que practiques."],
                ["Paga de forma segura", "Tu pago queda protegido en escrow hasta que recibas el equipo."],
                ["Recibe y confirma", "Confirma que todo está bien y el vendedor recibe su dinero."],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151] flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-[#111827] text-sm">{title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-[#111827] rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#374151] text-[#3B82F6] rounded-lg flex items-center justify-center text-sm font-bold">V</span>
              Para vendedores
            </h3>
            <ol className="space-y-5">
              {[
                ["Publica tu equipo", "Selecciona la disciplina y tipo de equipo. Gratis para publicar."],
                ["Recibe ofertas", "Chatea con interesados y cierra el trato en la plataforma."],
                ["Recibe tu dinero", "Una vez confirmada la entrega, te transferimos menos el fee de la plataforma."],
              ].map(([title, desc], i) => (
                <li key={title} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#374151] text-[#D1D5DB] flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white text-sm">{title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link
              href="/vender"
              className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Publicar mi equipo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-[#111827] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Wind className="w-10 h-10 text-[#3B82F6] mx-auto mb-4 opacity-60" />
          <h2 className="text-3xl font-bold text-white">
            ¿Listo para tu próxima sesión?
          </h2>
          <p className="text-[#9CA3AF] mt-3 text-lg">
            La comunidad de deportes acuáticos más seria de Colombia te espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/equipos"
              className="px-8 py-3.5 bg-white text-[#111827] font-bold rounded-xl hover:bg-[#F9FAFB] transition-colors"
            >
              Explorar equipos
            </Link>
            <Link
              href="/registro"
              className="px-8 py-3.5 bg-[#3B82F6] hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

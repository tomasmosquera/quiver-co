import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Star, Shield, Wind } from "lucide-react";
import BrandFilterClient from "@/components/BrandFilterClient";
import SortSelect from "@/components/SortSelect";
import MobileFilters from "@/components/MobileFilters";
import { auth } from "@/lib/auth";

const PREDEFINED_BRANDS = [
  "Cabrinha", "Duotone", "Ozone", "Core", "North",
  "F-One", "Slingshot", "Naish", "Airush", "Reedin"
];

const DISCIPLINES = [
  { value: "",          label: "Todas" },
  { value: "KITESURF",  label: "Kitesurf" },
  { value: "WINGFOIL",  label: "Wingfoil" },
  { value: "WINDSURF",  label: "Windsurf" },
  { value: "FOILBOARD", label: "Foilboard" },
  { value: "KITEFOIL",  label: "Kitefoil" },
  { value: "WAKEBOARD", label: "Wakeboard" },
  { value: "PADDLE",    label: "Paddle" },
];

const CONDITIONS = [
  { value: "",          label: "Cualquier estado" },
  { value: "NUEVO",     label: "Nuevo" },
  { value: "COMO_NUEVO",label: "Como nuevo" },
  { value: "USADO",     label: "Usado" },
];

const EQUIPMENT_TYPES = [
  { value: "",            label: "Cualquier tipo" },
  { value: "COMETA_WING", label: "Cometa" },
  { value: "TABLA",       label: "Tabla" },
  { value: "BARRA_LINEAS",label: "Barra & Líneas" },
  { value: "FOIL",        label: "Foil" },
  { value: "ARNES",       label: "Arnés" },
  { value: "TRAJE",       label: "Traje" },
  { value: "ACCESORIO",   label: "Accesorio" },
  { value: "COMBO",       label: "Combo" },
];


const CONDITION_COLORS: Record<string, string> = {
  NUEVO:      "bg-emerald-50 text-emerald-700",
  COMO_NUEVO: "bg-blue-50 text-blue-700",
  USADO:      "bg-amber-50 text-amber-700",
};

const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf", WINGFOIL: "Wingfoil", WINDSURF: "Windsurf",
  FOILBOARD: "Foilboard", KITEFOIL: "Kitefoil", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
};

const CONDITION_LABELS: Record<string, string> = {
  NUEVO: "Nuevo", COMO_NUEVO: "Como nuevo", USADO: "Usado",
};

interface SearchParams {
  disciplina?: string;
  tipo?: string;
  marca?: string;
  condicion?: string;
  orden?: string;
  q?: string;
  precioMin?: string;
  precioMax?: string;
}

export default async function EquiposPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const params = await searchParams;
  const {
    disciplina = "",
    tipo = "",
    marca = "",
    condicion = "",
    orden = "reciente",
    q = "",
    precioMin = "",
    precioMax = "",
  } = params;

  // Construir filtros
  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (disciplina) where.discipline    = disciplina;
  if (tipo)       where.equipmentType = tipo;
  if (marca)      where.brand         = { equals: marca, mode: "insensitive" };
  if (condicion)  where.condition     = condicion;
  if (q)          where.title         = { contains: q, mode: "insensitive" };
  if (precioMin || precioMax) {
    where.price = {};
    if (precioMin) (where.price as Record<string, number>).gte = parseInt(precioMin);
    if (precioMax) (where.price as Record<string, number>).lte = parseInt(precioMax);
  }

  // Ordenamiento
  const orderBy =
    orden === "precio_asc"  ? { price: "asc"  as const } :
    orden === "precio_desc" ? { price: "desc" as const } :
    orden === "vistas"      ? { views: "desc" as const } :
    { createdAt: "desc" as const };

  const whereForBrands = { ...where };
  delete whereForBrands.brand;

  const [listings, total, brandGroups] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      include: {
        images:  { orderBy: { order: "asc" }, take: 1 },
        seller:  { select: { name: true, image: true, verified: true } },
        favoritedBy: userId ? { where: { userId } } : false,
      },
      take: 24,
    }),
    prisma.listing.count({ where }),
    prisma.listing.groupBy({
      by: ['brand'],
      where: whereForBrands,
      _count: { brand: true },
    })
  ]);

  const brandCountMap = new Map<string, number>();
  const originalNames = new Map<string, string>();
  for (const bg of brandGroups) {
    if (!bg.brand) continue;
    const slug = bg.brand.toLowerCase();
    brandCountMap.set(slug, (brandCountMap.get(slug) || 0) + bg._count.brand);
    if (!originalNames.has(slug)) originalNames.set(slug, bg.brand);
  }

  const PREDEFINED_LOWER = PREDEFINED_BRANDS.map(b => b.toLowerCase());
  const allBrandSlugs = Array.from(new Set([...PREDEFINED_LOWER, ...brandCountMap.keys()]));

  const allBrandsList = allBrandSlugs.map(slug => {
    let name = originalNames.get(slug) || slug;
    const predefinedObj = PREDEFINED_BRANDS.find(b => b.toLowerCase() === slug);
    if (predefinedObj) name = predefinedObj;
    else {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    const count = brandCountMap.get(slug) || 0;
    return { name, slug, count };
  });

  const sortedForTop10 = [...allBrandsList].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    
    const aIdx = PREDEFINED_LOWER.indexOf(a.slug);
    const bIdx = PREDEFINED_LOWER.indexOf(b.slug);
    
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;

    return a.name.localeCompare(b.name);
  });

  const top10Brands = sortedForTop10.slice(0, 10);
  const alphabeticalBrands = [...allBrandsList].sort((a, b) => a.name.localeCompare(b.name));

  function buildUrl(overrides: Record<string, string>) {
    const p = new URLSearchParams({
      ...(disciplina && { disciplina }),
      ...(tipo       && { tipo }),
      ...(marca      && { marca }),
      ...(condicion  && { condicion }),
      ...(orden      && { orden }),
      ...(q          && { q }),
      ...(precioMin  && { precioMin }),
      ...(precioMax  && { precioMax }),
      ...overrides,
    });
    const str = p.toString();
    return `/equipos${str ? `?${str}` : ""}`;
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Equipos en venta</h1>
          <p className="text-sm text-[#6B7280] mt-1">{total} {total === 1 ? "equipo encontrado" : "equipos encontrados"}</p>
        </div>

        {/* Búsqueda */}
        <form method="GET" action="/equipos" className="flex gap-2 mb-6">
          <div className="flex flex-1 max-w-xl rounded-xl border border-[#D1D5DB] overflow-hidden focus-within:border-[#3B82F6] focus-within:ring-1 focus-within:ring-[#3B82F6] transition-all bg-white">
            <Search className="w-4 h-4 text-[#9CA3AF] my-auto ml-4 shrink-0" />
            <input
              name="q"
              defaultValue={q}
              type="text"
              placeholder="Buscar por título, marca..."
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-[#111827] text-white text-sm font-semibold rounded-xl hover:bg-[#374151] transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="flex gap-8">

          {/* ── Sidebar filtros ── */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-6">

              {/* Disciplina */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-[#3B82F6]" /> Disciplina
                </h3>
                <div className="space-y-1">
                  {DISCIPLINES.map((d) => (
                    <Link
                      key={d.value}
                      href={buildUrl({ disciplina: d.value, tipo: "" })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        disciplina === d.value
                          ? "bg-[#111827] text-white font-semibold"
                          : "text-[#374151] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tipo de equipo */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B82F6]" /> Tipo
                </h3>
                <div className="space-y-1">
                  {EQUIPMENT_TYPES.map((t) => (
                    <Link
                      key={t.value}
                      href={buildUrl({ tipo: t.value })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        tipo === t.value
                          ? "bg-[#3B82F6] text-white font-semibold"
                          : "text-[#374151] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Marca */}
              <BrandFilterClient
                top10Brands={top10Brands.map(b => ({ ...b, href: buildUrl({ marca: b.slug }) }))}
                alphabeticalBrands={alphabeticalBrands.map(b => ({ ...b, href: buildUrl({ marca: b.slug }) }))}
                currentMarca={marca}
                clearMarcaHref={buildUrl({ marca: "" })}
              />

              {/* Estado */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Estado</h3>
                <div className="space-y-1">
                  {CONDITIONS.map((c) => (
                    <Link
                      key={c.value}
                      href={buildUrl({ condicion: c.value })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        condicion === c.value
                          ? "bg-[#3B82F6] text-white font-semibold"
                          : "text-[#374151] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Precio (COP)</h3>
                <form method="GET" action="/equipos" className="space-y-2">
                  {disciplina && <input type="hidden" name="disciplina" value={disciplina} />}
                  {tipo       && <input type="hidden" name="tipo"       value={tipo} />}
                  {marca      && <input type="hidden" name="marca"      value={marca} />}
                  {condicion  && <input type="hidden" name="condicion"  value={condicion} />}
                  {orden      && <input type="hidden" name="orden"      value={orden} />}
                  {q          && <input type="hidden" name="q"          value={q} />}
                  <input
                    name="precioMin"
                    type="number"
                    defaultValue={precioMin}
                    placeholder="Mínimo"
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                  <input
                    name="precioMax"
                    type="number"
                    defaultValue={precioMax}
                    placeholder="Máximo"
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#3B82F6]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-[#F3F4F6] transition-colors font-medium"
                  >
                    Aplicar
                  </button>
                </form>
              </div>

              {/* Limpiar filtros */}
              {(disciplina || tipo || marca || condicion || precioMin || precioMax || q) && (
                <Link
                  href="/equipos"
                  className="block text-center text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Limpiar filtros
                </Link>
              )}
            </div>
          </aside>

          {/* ── Grid de listings ── */}
          <div className="flex-1 min-w-0">

            {/* Ordenamiento */}
            <div className="flex items-center justify-between mb-4 min-w-0 gap-2">
              <div className="lg:hidden">
                <MobileFilters
                  disciplines={DISCIPLINES.map(d => ({ value: d.value, label: d.label }))}
                  equipmentTypes={EQUIPMENT_TYPES.map(t => ({ value: t.value, label: t.label }))}
                  conditions={CONDITIONS.map(c => ({ value: c.value, label: c.label }))}
                  top10Brands={top10Brands.map(b => ({ name: b.name, slug: b.slug, count: b.count }))}
                  currentDisciplina={disciplina}
                  currentTipo={tipo}
                  currentCondicion={condicion}
                  currentMarca={marca}
                  precioMin={precioMin}
                  precioMax={precioMax}
                  activeCount={[disciplina, tipo, condicion, marca, precioMin, precioMax].filter(Boolean).length}
                  baseParams={{ ...(orden && { orden }), ...(q && { q }) }}
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-[#9CA3AF] hidden sm:block">Ordenar:</span>
                <SortSelect currentOrden={orden} buildUrl={buildUrl({ orden: "" })} />
              </div>
            </div>

            {/* Cards */}
            {listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Wind className="w-12 h-12 text-[#D1D5DB] mb-4" />
                <h3 className="font-semibold text-[#374151]">No hay equipos con estos filtros</h3>
                <p className="text-sm text-[#9CA3AF] mt-1">Intenta con otros filtros o{" "}
                  <Link href="/equipos" className="text-[#3B82F6] hover:underline">ver todos</Link>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => {
                  const img = listing.images[0]?.url;
                  return (
                    <Link
                      key={listing.id}
                      href={`/equipo/${listing.id}`}
                      className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[16/9] sm:aspect-[4/3] bg-[#F9FAFB] overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]">
                            <Wind className="w-12 h-12" />
                          </div>
                        )}
                        {listing.featured && (
                          <span className="absolute top-3 left-3 bg-[#3B82F6] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            Destacado
                          </span>
                        )}
                        <span className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${CONDITION_COLORS[listing.condition] ?? ""}`}>
                          {CONDITION_LABELS[listing.condition] ?? listing.condition}
                        </span>
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
                            <span className="text-xs text-[#6B7280]">Nuevo</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

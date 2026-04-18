import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Star, Shield, Wind } from "lucide-react";
import BrandFilterClient from "@/components/BrandFilterClient";
import SortSelect from "@/components/SortSelect";
import MobileFilters from "@/components/MobileFilters";
import SmartFormFilters, { type TextFilterKey } from "@/components/SmartFormFilters";
import CityFilterClient from "@/components/CityFilterClient";
import { auth } from "@/lib/auth";

/* ─── Datos estáticos ─── */

const PREDEFINED_BRANDS = [
  "Cabrinha", "Duotone", "Ozone", "Core", "North",
  "F-One", "Slingshot", "Naish", "Airush", "Reedin",
];

const DISCIPLINES = [
  { value: "",          label: "Todas" },
  { value: "KITESURF",  label: "Kitesurf" },
  { value: "KITEFOIL",  label: "Kitefoil" },
  { value: "WINGFOIL",  label: "Wingfoil" },
  { value: "WATERWEAR", label: "Accesorios" },
];

const CONDITIONS = [
  { value: "",           label: "Cualquier estado" },
  { value: "NUEVO",      label: "Nuevo" },
  { value: "COMO_NUEVO", label: "Como nuevo" },
  { value: "USADO",      label: "Usado" },
];

const EQUIPMENT_TYPES = [
  { value: "COMETA_WING", label: "Cometa" },
  { value: "WING",        label: "Wing" },
  { value: "TABLA",       label: "Tabla" },
  { value: "BARRA_LINEAS",label: "Barra & Líneas" },
  { value: "LEASH",       label: "Leash" },
  { value: "ARNES",       label: "Arnés" },
  { value: "ACC_COMETA",  label: "Accesorios de cometa" },
  { value: "ACC_WING",    label: "Accesorios de wing" },
  { value: "ACC_BARRA",   label: "Accesorios de barra" },
  { value: "ACC_TABLA",   label: "Accesorios de tabla" },
  { value: "ACC_ARNES",   label: "Accesorios de arnés" },
  { value: "BOMBAS",      label: "Bombas" },
  { value: "MALETAS",     label: "Maletas y bolsas" },
  { value: "WETSUIT",     label: "Wetsuits" },
  { value: "PONCHO",      label: "Ponchos y Toallas" },
  { value: "PROTECCION",  label: "Protección" },
  { value: "TECNOLOGIA",  label: "Tecnología" },
  { value: "OTROS",       label: "Otros" },
];

/** Tipos visibles cuando una sección específica está seleccionada */
const SECTION_EQUIPMENT_TYPES: Record<string, string[]> = {
  KITESURF: ["COMETA_WING", "TABLA", "BARRA_LINEAS", "ARNES"],
  KITEFOIL: ["COMETA_WING", "TABLA", "BARRA_LINEAS", "ARNES"],
  WINGFOIL: ["COMETA_WING", "TABLA", "BARRA_LINEAS", "ARNES"],
  WATERWEAR: ["ACC_COMETA", "ACC_WING", "ACC_BARRA", "ACC_TABLA", "ACC_ARNES",
              "BOMBAS", "MALETAS", "WETSUIT", "PONCHO", "PROTECCION", "TECNOLOGIA", "OTROS"],
};

/** Etiquetas de tipo que cambian según la sección */
const SECTION_TYPE_LABELS: Record<string, Record<string, string>> = {
  WINGFOIL: {
    COMETA_WING: "Wing",
    BARRA_LINEAS: "Leash",
  },
};

/* ─── Configuración de filtros inteligentes ─── */

type SmartLinkFilter =
  | { kind: "subtipo"; label: string; metaKey: string; options: { value: string; label: string }[] }
  | { kind: "toggle"; key: "incluyeBarra" | "incluyeMaleta" | "incluyeLeash" | "sinReparaciones"; label: string; onLabel: string };

interface SmartConfig {
  linkFilters: SmartLinkFilter[];
  textFilters: TextFilterKey[];
  tamanioLabel?: string;
}

const SMART_FILTER_CONFIG: Record<string, SmartConfig> = {
  "KITESURF:COMETA_WING": {
    linkFilters: [
      { kind: "toggle", key: "incluyeBarra",    label: "Incluye barra",   onLabel: "Con barra y líneas" },
      { kind: "toggle", key: "incluyeMaleta",   label: "Incluye maleta",  onLabel: "Con maleta" },
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones",    onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Tamaño (m²)",
  },
  "KITEFOIL:COMETA_WING": {
    linkFilters: [
      { kind: "toggle", key: "incluyeBarra",    label: "Incluye barra",   onLabel: "Con barra y líneas" },
      { kind: "toggle", key: "incluyeMaleta",   label: "Incluye maleta",  onLabel: "Con maleta" },
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones",    onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Tamaño (m)",
  },
  "WINGFOIL:COMETA_WING": {
    linkFilters: [
      { kind: "toggle", key: "incluyeLeash",    label: "Incluye leash",   onLabel: "Con leash" },
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones",    onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Tamaño (m²)",
  },
  "KITESURF:TABLA": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de tabla", metaKey: "boardType", options: [
        { value: "twintip",   label: "Twintip" },
        { value: "surfboard", label: "Surfboard" },
        { value: "foilboard", label: "Foilboard" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Tamaño (cm)",
  },
  "KITEFOIL:TABLA": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de tabla", metaKey: "boardType", options: [
        { value: "foilboard", label: "Foilboard" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Tamaño (cm)",
  },
  "WINGFOIL:TABLA": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de tabla", metaKey: "boardType", options: [
        { value: "foilboard", label: "Foilboard" },
        { value: "surfboard", label: "Surfboard" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Tamaño (cm)",
  },
  "KITESURF:BARRA_LINEAS": {
    linkFilters: [
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio", "largoLineas"],
    tamanioLabel: "Tamaño barra (cm)",
  },
  "KITEFOIL:BARRA_LINEAS": {
    linkFilters: [
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio", "largoLineas"],
    tamanioLabel: "Tamaño barra (cm)",
  },
  "WINGFOIL:BARRA_LINEAS": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de leash", metaKey: "lineLength", options: [
        { value: "muneca",     label: "De muñeca" },
        { value: "antebrazo",  label: "De antebrazo" },
        { value: "arnes",      label: "De arnés" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio"],
    tamanioLabel: "Largo del leash",
  },
  "KITESURF:ARNES": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de arnés", metaKey: "arnesType", options: [
        { value: "cintura", label: "Cintura" },
        { value: "asiento", label: "Asiento" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Talla",
  },
  "KITEFOIL:ARNES": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de arnés", metaKey: "arnesType", options: [
        { value: "cintura", label: "Cintura" },
        { value: "asiento", label: "Asiento" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Talla",
  },
  "WINGFOIL:ARNES": {
    linkFilters: [
      { kind: "subtipo", label: "Tipo de arnés", metaKey: "arnesType", options: [
        { value: "cintura", label: "Cintura" },
        { value: "asiento", label: "Asiento" },
      ]},
      { kind: "toggle", key: "sinReparaciones", label: "Reparaciones", onLabel: "Sin reparaciones" },
    ],
    textFilters: ["referencia", "tamanio", "anio"],
    tamanioLabel: "Talla",
  },
};

const CONDITION_COLORS: Record<string, string> = {
  NUEVO:      "bg-emerald-50 text-emerald-700",
  COMO_NUEVO: "bg-blue-50 text-blue-700",
  USADO:      "bg-amber-50 text-amber-700",
};

const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf", KITEFOIL: "Kitefoil", WINGFOIL: "Wingfoil",
  WINDSURF: "Windsurf", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
  WATERWEAR: "Accesorios",
};

const CONDITION_LABELS: Record<string, string> = {
  NUEVO: "Nuevo", COMO_NUEVO: "Como nuevo", USADO: "Usado",
};

const VALID_DISCIPLINES = ["KITESURF","KITEFOIL","WINGFOIL","WINDSURF","FOILBOARD","WAKEBOARD","PADDLE","WATERWEAR"];

/* ─── Search params ─── */

interface SearchParams {
  seccion?: string;
  tipo?: string;
  marca?: string;
  condicion?: string;
  orden?: string;
  q?: string;
  precioMin?: string;
  precioMax?: string;
  ciudad?: string;
  subtipo?: string;
  anio?: string;
  tamanio?: string;
  referencia?: string;
  largoLineas?: string;
  incluyeBarra?: string;
  incluyeMaleta?: string;
  incluyeLeash?: string;
  sinReparaciones?: string;
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
    seccion = "", tipo = "", marca = "", condicion = "", orden = "reciente",
    q = "", precioMin = "", precioMax = "",
    ciudad = "", subtipo = "", anio = "", tamanio = "",
    referencia = "", largoLineas = "",
    incluyeBarra = "", incluyeMaleta = "", incluyeLeash = "", sinReparaciones = "",
  } = params;

  /* ─── Construir filtros de Prisma ─── */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conditions: any[] = [{ status: "ACTIVE" }];

  if (seccion && VALID_DISCIPLINES.includes(seccion)) conditions.push({ discipline: seccion });
  if (tipo)     conditions.push({ equipmentType: tipo });
  if (marca)    conditions.push({ brand: { equals: marca, mode: "insensitive" } });
  if (condicion) conditions.push({ condition: condicion });
  if (q)        conditions.push({ title: { contains: q, mode: "insensitive" } });
  if (ciudad)   conditions.push({ city: { equals: ciudad, mode: "insensitive" } });
  if (tamanio)  conditions.push({ size: { contains: tamanio, mode: "insensitive" } });
  if (precioMin || precioMax) {
    const priceFilter: Record<string, number> = {};
    if (precioMin) priceFilter.gte = parseInt(precioMin);
    if (precioMax) priceFilter.lte = parseInt(precioMax);
    conditions.push({ price: priceFilter });
  }

  // Filtros de metadata
  const isWingLeash = seccion === "WINGFOIL" && tipo === "BARRA_LINEAS";
  const smartCfg = SMART_FILTER_CONFIG[`${seccion}:${tipo}`];
  const subtipoMetaKey = smartCfg?.linkFilters.find(f => f.kind === "subtipo")
    ? (smartCfg.linkFilters.find(f => f.kind === "subtipo") as { kind: "subtipo"; metaKey: string }).metaKey
    : null;

  if (subtipo && subtipoMetaKey) {
    conditions.push({ metadata: { path: [subtipoMetaKey], equals: subtipo } });
  }
  if (anio) conditions.push({ metadata: { path: ["year"], equals: anio } });
  if (referencia) conditions.push({ metadata: { path: ["reference"], string_contains: referencia } });
  if (largoLineas && !isWingLeash) {
    conditions.push({ metadata: { path: ["lineLength"], equals: largoLineas } });
  }
  if (incluyeBarra === "si")    conditions.push({ metadata: { path: ["includesBar"],  equals: true } });
  if (incluyeMaleta === "si")   conditions.push({ metadata: { path: ["includesBag"],  equals: true } });
  if (incluyeLeash === "si")    conditions.push({ metadata: { path: ["includesBar"],  equals: true } });
  if (sinReparaciones === "si") conditions.push({ metadata: { path: ["hasRepairs"],   equals: false } });

  const where = { AND: conditions };

  // Para el agrupado de marcas, excluir el filtro de marca
  const conditionsForBrands = conditions.filter(
    c => !("brand" in c)
  );
  const whereForBrands = { AND: conditionsForBrands };

  /* ─── Ordenamiento ─── */

  const orderBy =
    orden === "precio_asc"  ? { price: "asc"  as const } :
    orden === "precio_desc" ? { price: "desc" as const } :
    orden === "vistas"      ? { views: "desc" as const } :
    { createdAt: "desc" as const };

  /* ─── Queries ─── */

  // Para el agrupado de ciudades, excluir el filtro de ciudad
  const conditionsForCities = conditions.filter(c => !("city" in c));
  const whereForCities = { AND: conditionsForCities };

  const [listings, total, brandGroups, cityGroups] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      include: {
        images:      { orderBy: { order: "asc" }, take: 1 },
        seller:      { select: { name: true, image: true, verified: true } },
        favoritedBy: userId ? { where: { userId } } : false,
      },
      take: 24,
    }),
    prisma.listing.count({ where }),
    prisma.listing.groupBy({
      by: ["brand"],
      where: whereForBrands,
      _count: { brand: true },
    }),
    prisma.listing.groupBy({
      by: ["city"],
      where: whereForCities,
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
    }),
  ]);

  /* ─── Marcas ─── */

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
    const predefinedObj = PREDEFINED_BRANDS.find(b => b.toLowerCase() === slug);
    const name = predefinedObj ?? (originalNames.get(slug) ?? slug).charAt(0).toUpperCase() + (originalNames.get(slug) ?? slug).slice(1);
    return { name: typeof name === "string" ? name : name, slug, count: brandCountMap.get(slug) || 0 };
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

  /* ─── Ciudades ─── */

  const allCitiesList = cityGroups
    .filter(g => g.city)
    .map(g => ({ name: g.city!, count: g._count.city }))
    .sort((a, b) => b.count - a.count);

  const top5Cities = allCitiesList.slice(0, 5);
  const allCitiesSorted = [...allCitiesList].sort((a, b) => a.name.localeCompare(b.name));

  /* ─── buildUrl ─── */

  function buildUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {
      ...(seccion        && { seccion }),
      ...(tipo           && { tipo }),
      ...(marca          && { marca }),
      ...(condicion      && { condicion }),
      ...(orden          && { orden }),
      ...(q              && { q }),
      ...(precioMin      && { precioMin }),
      ...(precioMax      && { precioMax }),
      ...(ciudad         && { ciudad }),
      ...(subtipo        && { subtipo }),
      ...(anio           && { anio }),
      ...(tamanio        && { tamanio }),
      ...(referencia     && { referencia }),
      ...(largoLineas    && { largoLineas }),
      ...(incluyeBarra   && { incluyeBarra }),
      ...(incluyeMaleta  && { incluyeMaleta }),
      ...(incluyeLeash   && { incluyeLeash }),
      ...(sinReparaciones && { sinReparaciones }),
      ...overrides,
    };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(base)) {
      if (v) p.set(k, v);
    }
    const str = p.toString();
    return `/equipos${str ? `?${str}` : ""}`;
  }

  /* ─── Tipos visibles según sección ─── */

  const visibleTypes = seccion && SECTION_EQUIPMENT_TYPES[seccion]
    ? EQUIPMENT_TYPES.filter(t => SECTION_EQUIPMENT_TYPES[seccion].includes(t.value))
    : EQUIPMENT_TYPES;

  function getTypeLabel(typeValue: string) {
    return SECTION_TYPE_LABELS[seccion]?.[typeValue]
      ?? EQUIPMENT_TYPES.find(t => t.value === typeValue)?.label
      ?? typeValue;
  }

  /* ─── Filtros inteligentes activos ─── */

  const smartConfig = seccion && tipo ? SMART_FILTER_CONFIG[`${seccion}:${tipo}`] : undefined;

  /* ─── baseParams para SmartFormFilters ─── */

  const textFilterBaseParams: Record<string, string> = {
    ...(seccion        && { seccion }),
    ...(tipo           && { tipo }),
    ...(marca          && { marca }),
    ...(condicion      && { condicion }),
    ...(orden          && { orden }),
    ...(q              && { q }),
    ...(precioMin      && { precioMin }),
    ...(precioMax      && { precioMax }),
    ...(subtipo        && { subtipo }),
    ...(incluyeBarra   && { incluyeBarra }),
    ...(incluyeMaleta  && { incluyeMaleta }),
    ...(incluyeLeash   && { incluyeLeash }),
    ...(sinReparaciones && { sinReparaciones }),
  };

  /* ─── Conteo de filtros activos ─── */

  const activeFilterCount = [
    seccion, tipo, marca, condicion, precioMin, precioMax,
    ciudad, subtipo, anio, tamanio, referencia, largoLineas,
    incluyeBarra, incluyeMaleta, incluyeLeash, sinReparaciones,
  ].filter(Boolean).length;

  return (
    <div className="bg-[#FAFAF8] min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Equipos en venta</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            {total} {total === 1 ? "equipo encontrado" : "equipos encontrados"}
          </p>
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

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 space-y-6">

              {/* Sección */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-[#3B82F6]" /> Sección
                </h3>
                <div className="space-y-1">
                  {DISCIPLINES.map((d) => (
                    <Link
                      key={d.value}
                      href={buildUrl({ seccion: d.value, tipo: "", subtipo: "", incluyeBarra: "", incluyeMaleta: "", incluyeLeash: "", sinReparaciones: "", anio: "", tamanio: "", referencia: "", largoLineas: "" })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        seccion === d.value
                          ? "bg-[#111827] text-white font-semibold"
                          : "text-[#374151] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {d.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tipo de equipo (filtrado por sección) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B82F6]" /> Equipo
                  </h3>
                  {tipo && (
                    <Link
                      href={buildUrl({ tipo: "", subtipo: "", incluyeBarra: "", incluyeMaleta: "", incluyeLeash: "", sinReparaciones: "", anio: "", tamanio: "", referencia: "", largoLineas: "" })}
                      className="text-[10px] text-[#9CA3AF] hover:text-[#374151]"
                    >
                      Limpiar
                    </Link>
                  )}
                </div>
                <div className="space-y-1">
                  {visibleTypes.map((t) => (
                    <Link
                      key={t.value}
                      href={buildUrl({ tipo: t.value, subtipo: "", incluyeBarra: "", incluyeMaleta: "", incluyeLeash: "", sinReparaciones: "", anio: "", tamanio: "", referencia: "", largoLineas: "" })}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        tipo === t.value
                          ? "bg-[#3B82F6] text-white font-semibold"
                          : "text-[#374151] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {getTypeLabel(t.value)}
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

              {/* Ciudad */}
              <CityFilterClient
                top5Cities={top5Cities.map(c => ({ ...c, href: buildUrl({ ciudad: c.name }) }))}
                allCities={allCitiesSorted.map(c => ({ ...c, href: buildUrl({ ciudad: c.name }) }))}
                currentCiudad={ciudad}
                clearCiudadHref={buildUrl({ ciudad: "" })}
              />

              {/* Filtros de texto contextuales (nivel 2) */}
              {smartConfig && smartConfig.textFilters.length > 0 && (
                <SmartFormFilters
                  key={`${seccion}-${tipo}`}
                  activeFilters={smartConfig.textFilters}
                  referencia={referencia}
                  tamanio={tamanio}
                  anio={anio}
                  largoLineas={largoLineas}
                  baseParams={textFilterBaseParams}
                  tamanioLabel={smartConfig.tamanioLabel}
                />
              )}

              {/* Filtros inteligentes de link (subtipo, toggles) */}
              {smartConfig && smartConfig.linkFilters.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#F3F4F6]">
                  {smartConfig.linkFilters.map((f, i) => {
                    if (f.kind === "subtipo") {
                      return (
                        <div key={i}>
                          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">{f.label}</h3>
                          <div className="space-y-1">
                            {f.options.map(opt => (
                              <Link
                                key={opt.value}
                                href={buildUrl({ subtipo: subtipo === opt.value ? "" : opt.value })}
                                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                  subtipo === opt.value
                                    ? "bg-[#3B82F6] text-white font-semibold"
                                    : "text-[#374151] hover:bg-[#F9FAFB]"
                                }`}
                              >
                                {opt.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (f.kind === "toggle") {
                      const isActive = params[f.key] === "si";
                      return (
                        <div key={i}>
                          <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">{f.label}</h3>
                          <Link
                            href={buildUrl({ [f.key]: isActive ? "" : "si" })}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                              isActive
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold"
                                : "border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                            }`}
                          >
                            {isActive ? `✓ ${f.onLabel}` : f.onLabel}
                          </Link>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              )}

              {/* Precio */}
              <div>
                <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Precio (COP)</h3>
                <form method="GET" action="/equipos" className="space-y-2">
                  {seccion        && <input type="hidden" name="seccion"         value={seccion} />}
                  {tipo           && <input type="hidden" name="tipo"            value={tipo} />}
                  {marca          && <input type="hidden" name="marca"           value={marca} />}
                  {condicion      && <input type="hidden" name="condicion"       value={condicion} />}
                  {orden          && <input type="hidden" name="orden"           value={orden} />}
                  {q              && <input type="hidden" name="q"               value={q} />}
                  {ciudad         && <input type="hidden" name="ciudad"          value={ciudad} />}
                  {subtipo        && <input type="hidden" name="subtipo"         value={subtipo} />}
                  {anio           && <input type="hidden" name="anio"            value={anio} />}
                  {tamanio        && <input type="hidden" name="tamanio"         value={tamanio} />}
                  {referencia     && <input type="hidden" name="referencia"      value={referencia} />}
                  {largoLineas    && <input type="hidden" name="largoLineas"     value={largoLineas} />}
                  {incluyeBarra   && <input type="hidden" name="incluyeBarra"    value={incluyeBarra} />}
                  {incluyeMaleta  && <input type="hidden" name="incluyeMaleta"   value={incluyeMaleta} />}
                  {incluyeLeash   && <input type="hidden" name="incluyeLeash"    value={incluyeLeash} />}
                  {sinReparaciones && <input type="hidden" name="sinReparaciones" value={sinReparaciones} />}
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
              {activeFilterCount > 0 && (
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
                  equipmentTypes={visibleTypes.map(t => ({ value: t.value, label: getTypeLabel(t.value) }))}
                  conditions={CONDITIONS.map(c => ({ value: c.value, label: c.label }))}
                  top10Brands={top10Brands.map(b => ({ name: b.name, slug: b.slug, count: b.count }))}
                  currentDisciplina={seccion}
                  currentTipo={tipo}
                  currentCondicion={condicion}
                  currentMarca={marca}
                  currentCiudad={ciudad}
                  precioMin={precioMin}
                  precioMax={precioMax}
                  activeCount={activeFilterCount}
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
                <p className="text-sm text-[#9CA3AF] mt-1">
                  Intenta con otros filtros o{" "}
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
                            <span className="text-xs text-[#9CA3AF]">
                              {listing.brand}{listing.size ? ` · ${listing.size}` : ""}
                            </span>
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

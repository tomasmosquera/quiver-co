import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus, Eye, MapPin, Tag, Wind,
  CheckCircle, Clock, XCircle, PauseCircle,
} from "lucide-react";
// Eye se usa para vistas, CheckCircle/Clock/XCircle/PauseCircle para STATUS_CONFIG
import ListingActions from "./ListingActions";

const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf", KITEFOIL: "Kitefoil", WINGFOIL: "Wingfoil",
  WINDSURF: "Windsurf", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
  WATERWEAR: "Accesorios",
};

const CONDITION_LABELS: Record<string, string> = {
  NUEVO: "Nuevo", COMO_NUEVO: "Como nuevo", USADO: "Usado",
};

const CONDITION_COLORS: Record<string, string> = {
  NUEVO: "bg-emerald-50 text-emerald-700",
  COMO_NUEVO: "bg-blue-50 text-blue-700",
  USADO: "bg-amber-50 text-amber-700",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ACTIVE:  { label: "Activo",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  DRAFT:   { label: "Borrador",  color: "bg-gray-50 text-gray-500 border-gray-200",          icon: Clock },
  PAUSED:  { label: "Pausado",   color: "bg-amber-50 text-amber-700 border-amber-200",        icon: PauseCircle },
  SOLD:    { label: "Vendido",   color: "bg-purple-50 text-purple-700 border-purple-200",     icon: CheckCircle },
  REMOVED: { label: "Eliminado", color: "bg-red-50 text-red-500 border-red-200",              icon: XCircle },
};

const STATUS_TABS = [
  { value: "all",     label: "Todos" },
  { value: "ACTIVE",  label: "Activos" },
  { value: "PAUSED",  label: "Pausados" },
  { value: "SOLD",    label: "Vendidos" },
];

export default async function MisAnunciosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { estado = "all" } = await searchParams;

  const where = {
    sellerId: session.user.id,
    status: { not: "REMOVED" as const },
    ...(estado !== "all" && { status: estado as "ACTIVE" | "PAUSED" | "SOLD" | "DRAFT" }),
  };

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  const counts = await prisma.listing.groupBy({
    by: ["status"],
    where: { sellerId: session.user.id, status: { not: "REMOVED" } },
    _count: true,
  });

  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]));
  const total = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Mis anuncios</h1>
            <p className="text-sm text-[#6B7280] mt-1">{total} {total === 1 ? "anuncio" : "anuncios"} en total</p>
          </div>
          <Link
            href="/vender"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> Publicar equipo
          </Link>
        </div>

        {/* Tabs de estado */}
        <div className="flex gap-1 mb-6 bg-white border border-[#E5E7EB] rounded-xl p-1 w-fit">
          {STATUS_TABS.map(tab => {
            const count = tab.value === "all" ? total : (countMap[tab.value] ?? 0);
            const active = estado === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === "all" ? "/cuenta/anuncios" : `/cuenta/anuncios?estado=${tab.value}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-[#111827] text-white" : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]"
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"
                }`}>
                  {count}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Lista */}
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Wind className="w-12 h-12 text-[#D1D5DB] mb-4" />
            <h3 className="font-semibold text-[#374151] text-lg">
              {estado === "all" ? "Aún no tienes anuncios" : "Sin anuncios en este estado"}
            </h3>
            <p className="text-sm text-[#9CA3AF] mt-1 mb-6">
              {estado === "all" ? "Publica tu primer equipo y empieza a vender." : "Prueba revisando otra pestaña."}
            </p>
            {estado === "all" && (
              <Link
                href="/vender"
                className="flex items-center gap-2 px-6 py-3 bg-[#111827] hover:bg-[#374151] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Publicar primer equipo
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => {
              const img = listing.images[0]?.url;
              const status = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.DRAFT;
              const StatusIcon = status.icon;

              return (
                <div
                  key={listing.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden flex gap-0 hover:border-[#D1D5DB] hover:shadow-sm transition-all"
                >
                  {/* Imagen */}
                  <div className="w-32 sm:w-44 shrink-0 bg-[#F9FAFB] relative">
                    {img ? (
                      <img src={img} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D1D5DB] min-h-[100px]">
                        <Tag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-[#3B82F6]">
                            {DISCIPLINE_LABELS[listing.discipline] ?? listing.discipline}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CONDITION_COLORS[listing.condition] ?? ""}`}>
                            {CONDITION_LABELS[listing.condition] ?? listing.condition}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#111827] text-sm leading-snug line-clamp-2">
                          {listing.title}
                        </h3>
                      </div>
                      <p className="text-lg font-bold text-[#111827] shrink-0">
                        ${listing.price.toLocaleString("es-CO")}
                        <span className="text-xs font-normal text-[#9CA3AF] ml-1">COP</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.city}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{listing.views} vistas</span>
                      <span>{new Date(listing.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    {/* Acciones */}
                    <ListingActions listingId={listing.id} currentStatus={listing.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

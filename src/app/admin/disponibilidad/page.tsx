import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Disponibilidad | Admin Quiver Co." };

const STATUS_LABELS: Record<string, string> = {
  PENDING:   "Pendiente",
  CONFIRMED: "Confirmada",
  REJECTED:  "Rechazada",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED:  "bg-red-50 text-red-600 border border-red-200",
};

const TABS = [
  { label: "Todas",       value: "" },
  { label: "Pendientes",  value: "PENDING" },
  { label: "Confirmadas", value: "CONFIRMED" },
  { label: "Rechazadas",  value: "REJECTED" },
];

export default async function AdminDisponibilidadPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const { estado = "" } = await searchParams;
  const validEstados = ["PENDING", "CONFIRMED", "REJECTED"];
  const filterEstado = validEstados.includes(estado) ? estado : undefined;

  const requests = await prisma.availabilityRequest.findMany({
    where: filterEstado ? { status: filterEstado as "PENDING" | "CONFIRMED" | "REJECTED" } : {},
    include: {
      listing: { select: { id: true, title: true } },
      buyer:   { select: { id: true, name: true, email: true } },
      seller:  { select: { id: true, name: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const counts = await prisma.availabilityRequest.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count.status]));
  const total = counts.reduce((acc, c) => acc + c._count.status, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Solicitudes de disponibilidad</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Compradores que presionaron "Confirmar disponibilidad" en un anuncio.
        </p>
      </div>

      {/* Tabs de estado */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => {
          const count = tab.value === ""
            ? total
            : (countMap[tab.value] ?? 0);
          const isActive = (tab.value === "" && !filterEstado) || tab.value === filterEstado;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/disponibilidad?estado=${tab.value}` : "/admin/disponibilidad"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                isActive
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white text-[#374151] border-[#E5E7EB] hover:border-[#D1D5DB]"
              }`}
            >
              {tab.label}
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#6B7280]"
              }`}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Tabla */}
      {requests.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <p className="text-[#9CA3AF] text-sm">No hay solicitudes {filterEstado ? STATUS_LABELS[filterEstado]?.toLowerCase() + "s" : ""}.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F3F4F6] bg-[#FAFAFA]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Anuncio</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Comprador</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Vendedor</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Estado</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-[#FAFAFA] transition-colors">
                    {/* Anuncio */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/equipo/${r.listing.id}`}
                        target="_blank"
                        className="font-medium text-[#111827] hover:text-[#3B82F6] transition-colors line-clamp-1 max-w-[200px] block"
                      >
                        {r.listing.title}
                      </Link>
                    </td>

                    {/* Comprador */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/usuarios/${r.buyer.id}`}
                        className="hover:text-[#3B82F6] transition-colors"
                      >
                        <p className="font-medium text-[#111827]">{r.buyer.name ?? "—"}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{r.buyer.email}</p>
                      </Link>
                    </td>

                    {/* Vendedor */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/usuarios/${r.seller.id}`}
                        className="hover:text-[#3B82F6] transition-colors"
                      >
                        <p className="font-medium text-[#374151]">{r.seller.name ?? "—"}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{r.seller.email}</p>
                      </Link>
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td className="px-5 py-4 text-[#6B7280] whitespace-nowrap">
                      {r.updatedAt.toLocaleDateString("es-CO", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

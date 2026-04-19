import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import ListingStatusToggle from "./ListingStatusToggle";
import DeleteListingButton from "./DeleteListingButton";


const STATUS_COLOR: Record<string, string> = {
  ACTIVE:  "bg-emerald-50 text-emerald-700",
  SOLD:    "bg-blue-50 text-blue-700",
  PAUSED:  "bg-amber-50 text-amber-700",
  REMOVED: "bg-red-50 text-red-600",
  DRAFT:   "bg-gray-100 text-gray-600",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE:  "Activo",
  SOLD:    "Vendido",
  PAUSED:  "Pausado",
  REMOVED: "Eliminado",
  DRAFT:   "Borrador",
};

const DISCIPLINE_LABEL: Record<string, string> = {
  KITESURF: "Kitesurf", KITEFOIL: "Kitefoil", WINGFOIL: "Wingfoil",
  WINDSURF: "Windsurf", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
  WATERWEAR: "Accesorios",
};

export default async function AdminAnunciosPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const listings = await prisma.listing.findMany({
    include: {
      seller: { select: { name: true, email: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Anuncios</h1>
          <p className="text-sm text-[#6B7280] mt-1">{listings.length} anuncios en total</p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Anuncio</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Vendedor</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Precio</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Estado</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg overflow-hidden shrink-0">
                      {listing.images[0]?.url
                        ? <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827] line-clamp-1">{listing.title}</p>
                      <p className="text-xs text-[#9CA3AF]">{DISCIPLINE_LABEL[listing.discipline] ?? listing.discipline}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-[#374151]">{listing.seller.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{listing.seller.email}</p>
                </td>
                <td className="px-5 py-4 font-semibold text-[#111827]">
                  ${listing.price.toLocaleString("es-CO")}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[listing.status]}`}>
                    {STATUS_LABEL[listing.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/equipo/${listing.id}`}
                      target="_blank"
                      className="text-xs text-[#3B82F6] hover:underline"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/equipo/${listing.id}/editar`}
                      className="text-xs text-[#6B7280] hover:text-[#111827] hover:underline"
                    >
                      Editar
                    </Link>
                    <ListingStatusToggle listingId={listing.id} currentStatus={listing.status} />
                    <DeleteListingButton listingId={listing.id} listingTitle={listing.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

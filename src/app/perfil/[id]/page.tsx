import { prisma } from "@/lib/prisma";
import { hasStandardInspection } from "@/lib/kiteInspection";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { ShieldCheck, ShieldOff, Star, Calendar, MapPin } from "lucide-react";

export default async function SellerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [seller, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        listings: {
          where: { status: { in: ["ACTIVE", "SOLD"] } },
          orderBy: { createdAt: "desc" },
          include: {
            images: { orderBy: { order: "asc" }, take: 1 },
            seller: { select: { name: true, verified: true } }
          }
        }
      }
    }),
    prisma.review.findMany({
      where: { subjectId: id },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        reviewer: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!seller) notFound();

  const joinedYear = seller.createdAt.getFullYear();
  const activeListings = seller.listings.filter(l => l.status === "ACTIVE");
  const soldListings = seller.listings.filter(l => l.status === "SOLD");
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* Portada y Perfil */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#F3F4F6] border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center text-4xl font-bold text-[#9CA3AF] bg-gradient-to-tr from-[#E5E7EB] to-[#F9FAFB]">
              {seller.image ? (
                <img src={seller.image} alt={seller.name ?? "Vendedor"} className="w-full h-full object-cover" />
              ) : (
                seller.name?.[0]?.toUpperCase() || "U"
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                {seller.name}
              </h1>
              <div className="mt-2">
                {seller.verified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Identidad verificada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F3F4F6] border border-[#E5E7EB] text-[#9CA3AF] text-xs font-semibold rounded-full">
                    <ShieldOff className="w-3.5 h-3.5" /> No verificado
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-3 text-sm text-[#4B5563]">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {avgRating !== null ? (
                    <span className="font-medium text-[#111827]">
                      {avgRating.toFixed(1)} · {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="font-medium text-[#6B7280]">Nuevo vendedor</span>
                  )}
                </div>
                {seller.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {seller.city}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Miembro desde {joinedYear}
                </div>
              </div>

              {seller.bio && (
                <p className="mt-4 text-[#374151] max-w-2xl leading-relaxed">
                  {seller.bio}
                </p>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* Anuncios Activos */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-[#111827]">Anuncios Activos</h2>
            <span className="bg-[#E5E7EB] text-[#374151] font-semibold text-xs px-2.5 py-0.5 rounded-full">
              {activeListings.length}
            </span>
          </div>
          
          {activeListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map((l) => (
                <ProductCard
                  key={l.id}
                  product={{
                    id: l.id,
                    title: l.title,
                    price: l.price,
                    condition: l.condition === "NUEVO" ? "Nuevo" : l.condition === "COMO_NUEVO" ? "Como nuevo" : "Usado",
                    brand: l.brand || "Sin marca",
                    size: l.size || undefined,
                    location: l.city,
                    discipline: l.discipline.charAt(0) + l.discipline.slice(1).toLowerCase(),
                    image: l.images[0]?.url || undefined,
                    seller: {
                      name: l.seller.name || "Usuario",
                      rating: avgRating,
                      reviewCount: reviews.length,
                      verified: l.seller.verified,
                    },
                    hasInspection: hasStandardInspection(l.metadata),
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-[#E5E7EB] text-[#6B7280]">
              Este vendedor no tiene anuncios activos en este momento.
            </div>
          )}
        </section>

        {/* Reseñas */}
        {reviews.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Reseñas</h2>
              <span className="bg-[#E5E7EB] text-[#374151] font-semibold text-xs px-2.5 py-0.5 rounded-full">
                {reviews.length}
              </span>
              {avgRating !== null && (
                <div className="flex items-center gap-1 ml-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-[#D1D5DB]"}`} />
                  ))}
                  <span className="text-sm font-semibold text-[#111827] ml-1">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#F3F4F6] overflow-hidden shrink-0 flex items-center justify-center text-sm font-bold text-[#9CA3AF]">
                      {r.reviewer.image
                        ? <img src={r.reviewer.image} alt="" className="w-full h-full object-cover" />
                        : r.reviewer.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{r.reviewer.name}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-amber-400 fill-amber-400" : "text-[#D1D5DB]"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-[#9CA3AF]">
                      {new Date(r.createdAt).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-[#374151] leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Anuncios Vendidos */}
        {soldListings.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-[#111827] opacity-60">Historial Vendido</h2>
              <span className="bg-[#E5E7EB] text-[#374151] opacity-60 font-semibold text-xs px-2.5 py-0.5 rounded-full">
                {soldListings.length}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 grayscale-[50%]">
              {soldListings.map((l) => (
                <ProductCard
                  key={l.id}
                  product={{
                    id: l.id,
                    title: l.title,
                    price: l.price,
                    condition: l.condition === "NUEVO" ? "Nuevo" : l.condition === "COMO_NUEVO" ? "Como nuevo" : "Usado",
                    brand: l.brand || "Sin marca",
                    size: l.size || undefined,
                    location: l.city,
                    discipline: l.discipline.charAt(0) + l.discipline.slice(1).toLowerCase(),
                    image: l.images[0]?.url || undefined,
                    seller: {
                      name: l.seller.name || "Usuario",
                      rating: avgRating,
                      reviewCount: reviews.length,
                      verified: l.seller.verified,
                    },
                    hasInspection: hasStandardInspection(l.metadata),
                  }}
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

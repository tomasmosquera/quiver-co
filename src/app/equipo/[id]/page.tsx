import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  MapPin, Star, Shield, ChevronLeft, MessageCircle,
  Share2, Heart, Eye, Calendar,
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import ExpandableImage from "@/components/ExpandableImage";
import FavoriteButton from "@/components/FavoriteButton";

const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf", WINGFOIL: "Wingfoil", WINDSURF: "Windsurf",
  FOILBOARD: "Foilboard", KITEFOIL: "Kitefoil", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
};

const CONDITION_LABELS: Record<string, string> = {
  NUEVO: "Nuevo", COMO_NUEVO: "Como nuevo", USADO: "Usado",
};

const EQUIPMENT_LABELS: Record<string, string> = {
  COMETA_WING: "Cometa", TABLA: "Tabla", BARRA_LINEAS: "Barra & Líneas",
  FOIL: "Foil", ARNES: "Arnés", TRAJE: "Traje", ACCESORIO: "Accesorio", COMBO: "Combo",
};

function conditionColor(c: string) {
  if (c === "NUEVO")      return "bg-emerald-50 text-emerald-700";
  if (c === "COMO_NUEVO") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      seller: true,
      favoritedBy: session?.user?.id ? { where: { userId: session.user.id } } : false,
    },
  });

  if (!listing || listing.status === "REMOVED") notFound();

  // Incrementar vistas
  await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });

  const isOwner = session?.user?.id === listing.sellerId;

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <Link href="/equipos" className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827] mb-6">
          <ChevronLeft className="w-4 h-4" /> Volver a equipos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna izquierda: fotos + detalles ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Fotos */}
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Info principal */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#3B82F6]">
                  {DISCIPLINE_LABELS[listing.discipline] ?? listing.discipline}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#374151]">
                  {EQUIPMENT_LABELS[listing.equipmentType] ?? listing.equipmentType}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${conditionColor(listing.condition)}`}>
                  {CONDITION_LABELS[listing.condition] ?? listing.condition}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#111827] leading-snug">{listing.title}</h1>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#6B7280]">
                {listing.brand && <span>🏷️ {listing.brand}</span>}
                {listing.size  && <span>📐 {listing.size}</span>}
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.city}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{listing.views} vistas</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(listing.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              {/* Datos extra de kite cometa */}
              {listing.metadata && listing.discipline === "KITESURF" && listing.equipmentType === "COMETA_WING" && (() => {
                const m = listing.metadata as Record<string, unknown>;
                return (
                  <div className="border-t border-[#F3F4F6] mt-5 pt-5 space-y-4">
                    <h3 className="font-semibold text-[#111827]">Detalles de la cometa</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {m.reference && <div className="text-sm"><span className="text-[#9CA3AF]">Modelo</span><p className="font-semibold text-[#111827]">{String(m.reference)}</p></div>}
                      {m.year      && <div className="text-sm"><span className="text-[#9CA3AF]">Año</span><p className="font-semibold text-[#111827]">{String(m.year)}</p></div>}
                      {m.color     && (
                        <div className="text-sm">
                          <span className="text-[#9CA3AF]">Color</span>
                          <p className="font-semibold text-[#111827]">{String(m.color)}</p>
                        </div>
                      )}
                    </div>
                    {m.includesBar && (
                      <div className="p-3 bg-blue-50 rounded-xl text-sm">
                        <p className="font-semibold text-[#3B82F6] mb-1">✓ Incluye barra y líneas</p>
                        {(m.barBrand || m.barReference) && <p className="text-[#374151]">{[m.barBrand, m.barReference].filter(Boolean).join(" · ")}{m.barYear ? ` (${m.barYear})` : ""}</p>}
                        {m.lineLength && <p className="text-[#6B7280]">Líneas: {String(m.lineLength)}</p>}
                      </div>
                    )}
                    {m.hasRepairs && Array.isArray(m.repairs) && m.repairs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-amber-600">⚠️ Reparaciones</p>
                        {(m.repairs as Array<{description: string; imageUrl?: string}>).map((r, i) => (
                          <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
                            <p className="text-[#374151]">{r.description}</p>
                            {r.imageUrl && (
                              <ExpandableImage
                                src={r.imageUrl}
                                alt={`Reparación ${i+1}`}
                                className="mt-2 w-32 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="border-t border-[#F3F4F6] mt-5 pt-5">
                <h3 className="font-semibold text-[#111827] mb-2">Descripción</h3>
                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            </div>
          </div>

          {/* ── Columna derecha: precio + vendedor ── */}
          <div className="space-y-4">

            {/* Precio */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sticky top-24">
              <p className="text-3xl font-bold text-[#111827]">
                ${listing.price.toLocaleString("es-CO")}
                <span className="text-base font-normal text-[#9CA3AF] ml-1">COP</span>
              </p>

              {isOwner ? (
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-blue-50 rounded-xl text-sm text-[#3B82F6] font-medium text-center">
                    Este es tu anuncio
                  </div>
                  <Link
                    href={`/equipo/${listing.id}/editar`}
                    className="flex items-center justify-center w-full py-3 border-2 border-[#111827] text-[#111827] font-semibold rounded-xl hover:bg-[#111827] hover:text-white transition-all text-sm"
                  >
                    Editar anuncio
                  </Link>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {listing.seller.phone ? (
                    <a
                      href={`https://wa.me/57${listing.seller.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola, vengo de Quiver y me interesa tu anuncio "${listing.title}"`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
                    </a>
                  ) : (
                    <a
                      href={`mailto:${listing.seller.email}?subject=Interés en anuncio Quiver: ${listing.title}`}
                      className="w-full py-3 bg-[#3B82F6] hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Hablar por Correo
                    </a>
                  )}
                  <div className="flex gap-2">
                    <FavoriteButton 
                      listingId={listing.id} 
                      initiallySaved={session?.user?.id ? listing.favoritedBy.length > 0 : false} 
                      variant="button" 
                    />
                    <button className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-1.5 text-sm text-[#374151]">
                      <Share2 className="w-4 h-4" /> Compartir
                    </button>
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-2.5">
                {[
                  ["🔒", "Pago protegido con escrow"],
                  ["↩️", "Política de disputas incluida"],
                  ["✓",  "Vendedor verificado"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-[#6B7280]">
                    <span>{icon}</span> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Vendedor */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h3 className="font-semibold text-[#111827] mb-3 text-sm">Vendedor</h3>
              <div className="flex items-center gap-3">
                {listing.seller.image ? (
                  <img src={listing.seller.image} alt="" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold">
                    {listing.seller.name?.[0] ?? "U"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#111827] text-sm">{listing.seller.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-[#6B7280]">Nuevo vendedor</span>
                    {listing.seller.verified && <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </div>
                </div>
              </div>
              <Link
                href={`/perfil/${listing.sellerId}`}
                className="mt-3 block text-center text-sm text-[#3B82F6] hover:underline"
              >
                Ver perfil completo →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

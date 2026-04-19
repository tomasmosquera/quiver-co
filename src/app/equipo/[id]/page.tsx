import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { type Metadata } from "next";
import Link from "next/link";
import {
  MapPin, Star, Shield, ChevronLeft,
  Eye, Calendar,
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import ExpandableImage from "@/components/ExpandableImage";
import FavoriteButton from "@/components/FavoriteButton";
import ContactButton from "@/components/ContactButton";
import ShareButton from "@/components/ShareButton";

const DISCIPLINE_LABELS: Record<string, string> = {
  KITESURF: "Kitesurf", KITEFOIL: "Kitefoil", WINGFOIL: "Wingfoil",
  WINDSURF: "Windsurf", WAKEBOARD: "Wakeboard", PADDLE: "Paddle",
  WATERWEAR: "Accesorios",
};

const CONDITION_LABELS: Record<string, string> = {
  NUEVO: "Nuevo", COMO_NUEVO: "Como nuevo", USADO: "Usado",
};

const EQUIPMENT_LABELS: Record<string, string> = {
  COMETA:      "Cometa",
  WING:        "Wing",
  TABLA:       "Tabla",
  BARRA_LINEAS:"Barra & Líneas",
  LEASH:       "Leash",
  FOIL:        "Foil",
  ARNES:       "Arnés",
  TRAJE:       "Traje",
  ACCESORIO:   "Accesorio",
  COMBO:       "Combo",
  ACC_COMETA:  "Accesorios de cometa",
  ACC_WING:    "Accesorios de wing",
  ACC_BARRA:   "Accesorios de barra",
  ACC_TABLA:   "Accesorios de tabla",
  ACC_ARNES:   "Accesorios de arnés",
  BOMBAS:      "Bombas",
  MALETAS:     "Maletas y bolsas",
  WETSUIT:     "Wetsuit",
  PONCHO:      "Poncho",
  PROTECCION:  "Protección",
  TECNOLOGIA:  "Tecnología",
  OTROS:       "Otros",
};

const BOARD_TYPE_LABELS: Record<string, string> = {
  twintip: "Twintip", surfboard: "Surfboard", foilboard: "Foilboard",
};

const ACCESORIO_TYPE_LABELS: Record<string, string> = {
  bombas:             "Bombas",
  accesorios_cometa:  "Accesorios de cometa",
  accesorios_barra:   "Accesorios de barra",
  accesorios_tabla:   "Accesorios de tabla",
  accesorios_arnes:   "Accesorios de arnés",
  maletas:            "Maletas y bolsas",
  tecnologia:         "Tecnología",
  otros:              "Otros",
};

function conditionColor(c: string) {
  if (c === "NUEVO")      return "bg-emerald-50 text-emerald-700";
  if (c === "COMO_NUEVO") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="text-[#9CA3AF] block text-xs">{label}</span>
      <p className="font-semibold text-[#111827] mt-0.5">{value}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });
  if (!listing) return { title: "Anuncio no encontrado | Quiver Co." };

  const discipline = DISCIPLINE_LABELS[listing.discipline] ?? listing.discipline;
  const condition  = CONDITION_LABELS[listing.condition]  ?? listing.condition;
  const price      = listing.price.toLocaleString("es-CO");
  const description = `${condition} · ${listing.city} · $${price} COP — ${listing.description.slice(0, 140)}`;
  const image = listing.images[0]?.url;

  return {
    title: `${listing.title} | ${discipline} | Quiver Co.`,
    description,
    openGraph: {
      title: listing.title,
      description,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: listing.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description,
      ...(image && { images: [image] }),
    },
  };
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

  // Reseñas del vendedor
  const sellerReviews = await prisma.review.findMany({
    where: { subjectId: listing.sellerId },
    select: { rating: true },
  });
  const sellerRating = sellerReviews.length > 0
    ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length
    : null;

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

              {/* Detalles técnicos del equipo */}
              {listing.metadata && (() => {
                const m = listing.metadata as Record<string, unknown>;
                const kite = ["KITESURF","KITEFOIL","WINGFOIL","WINDSURF"].includes(listing.discipline);
                const isCometa    = kite && listing.equipmentType === "COMETA";
                const isWing      = listing.discipline === "WINGFOIL" && listing.equipmentType === "WING";
                const isLeash     = listing.discipline === "WINGFOIL" && listing.equipmentType === "LEASH";
                const isTabla     = kite && listing.equipmentType === "TABLA";
                const isBarra     = kite && listing.equipmentType === "BARRA_LINEAS";
                const isArnes     = kite && listing.equipmentType === "ARNES";
                const isAccesorio = kite && listing.equipmentType === "ACCESORIO";
                if (!isCometa && !isWing && !isLeash && !isTabla && !isBarra && !isArnes && !isAccesorio) return null;

                return (
                  <div className="border-t border-[#F3F4F6] mt-5 pt-5 space-y-5">
                    <h3 className="font-semibold text-[#111827]">
                      {isCometa    ? "Detalles de la cometa"
                       : isTabla  ? "Detalles de la tabla"
                       : isBarra  ? "Detalles de la barra"
                       : isArnes  ? "Detalles del arnés"
                       : "Detalles del accesorio"}
                    </h3>

                    {/* Tipo de accesorio */}
                    {isAccesorio && !!m.accesorioType && (
                      <div className="inline-block px-3 py-1.5 bg-[#F3F4F6] rounded-lg text-sm font-medium text-[#374151]">
                        {ACCESORIO_TYPE_LABELS[String(m.accesorioType)] ?? String(m.accesorioType)}
                      </div>
                    )}

                    {/* Grid de campos básicos */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                      {isTabla && !!m.boardType && (
                        <DetailRow label="Tipo" value={BOARD_TYPE_LABELS[String(m.boardType)] ?? String(m.boardType)} />
                      )}
                      {isArnes && !!m.arnesType && (
                        <DetailRow label="Tipo" value={String(m.arnesType) === "cintura" ? "Cintura" : "Asiento"} />
                      )}
                      {!!listing.brand    && <DetailRow label="Marca"       value={listing.brand} />}
                      {!!m.reference      && <DetailRow label="Modelo"      value={String(m.reference)} />}
                      {!!m.complement     && <DetailRow label="Complemento" value={String(m.complement)} />}
                      {!!listing.size     && <DetailRow label={isArnes ? "Talla" : "Tamaño"} value={listing.size} />}
                      {!!m.year           && <DetailRow label="Año"         value={String(m.year)} />}
                      {!!m.color          && <DetailRow label="Color"       value={String(m.color)} />}
                      {isBarra && !!m.lineLength && (
                        <DetailRow label="Largo de líneas" value={String(m.lineLength)} />
                      )}
                    </div>

                    {/* Incluye barra y líneas (solo cometa) */}
                    {isCometa && (
                      <div className={`p-3 rounded-xl text-sm ${m.includesBar ? "bg-blue-50" : "bg-[#F9FAFB]"}`}>
                        <p className={`font-semibold mb-1 ${m.includesBar ? "text-[#3B82F6]" : "text-[#6B7280]"}`}>
                          {m.includesBar ? "✓ Incluye barra y líneas" : "✗ No incluye barra y líneas"}
                        </p>
                        {!!m.includesBar && !!(m.barBrand || m.barReference) && (
                          <p className="text-[#374151]">
                            {[m.barBrand, m.barReference].filter(Boolean).map(String).join(" · ")}
                            {m.barYear ? ` (${String(m.barYear)})` : ""}
                          </p>
                        )}
                        {!!m.includesBar && !!m.lineLength && (
                          <p className="text-[#6B7280]">Líneas: {String(m.lineLength)}</p>
                        )}
                      </div>
                    )}

                    {/* Incluye maleta (solo cometa) */}
                    {isCometa && m.includesBag !== undefined && (
                      <div className={`p-3 rounded-xl text-sm ${m.includesBag ? "bg-blue-50" : "bg-[#F9FAFB]"}`}>
                        <p className={`font-semibold ${m.includesBag ? "text-[#3B82F6]" : "text-[#6B7280]"}`}>
                          {m.includesBag ? "✓ Incluye maleta" : "✗ No incluye maleta"}
                        </p>
                      </div>
                    )}

                    {/* Reparaciones */}
                    {m.hasRepairs === false && (
                      <div className="p-3 bg-emerald-50 rounded-xl text-sm">
                        <p className="font-semibold text-emerald-700">✓ Sin reparaciones</p>
                      </div>
                    )}
                    {!!m.hasRepairs && Array.isArray(m.repairs) && m.repairs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-amber-600">⚠️ Tiene reparaciones</p>
                        {(m.repairs as Array<{ description: string; imageUrl?: string }>).map((r, i) => (
                          <div key={i} className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
                            <p className="text-[#374151]">{r.description}</p>
                            {r.imageUrl && (
                              <ExpandableImage
                                src={r.imageUrl}
                                alt={`Reparación ${i + 1}`}
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
              ) : listing.status === "SOLD" ? (
                <div className="mt-4 space-y-3">
                  <div className="w-full flex items-center justify-center py-3.5 bg-[#F3F4F6] text-[#9CA3AF] font-bold rounded-xl text-sm cursor-default">
                    Vendido
                  </div>
                  <p className="text-xs text-center text-[#9CA3AF]">Este equipo ya fue vendido. Mira otros anuncios similares.</p>
                  <Link
                    href="/equipos"
                    className="w-full flex items-center justify-center py-2.5 border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] font-semibold rounded-xl transition-colors text-sm"
                  >
                    Ver más equipos
                  </Link>
                  <ShareButton />
                </div>
              ) : listing.status === "PAUSED" ? (
                <div className="mt-4 space-y-3">
                  <div className="w-full flex items-center justify-center py-3.5 bg-[#FEF3C7] text-[#92400E] font-bold rounded-xl text-sm cursor-default">
                    Anuncio pausado
                  </div>
                  <p className="text-xs text-center text-[#9CA3AF]">El vendedor pausó este anuncio temporalmente. Puedes guardarlo y volver más tarde.</p>
                  <div className="flex gap-2">
                    <FavoriteButton
                      listingId={listing.id}
                      initiallySaved={session?.user?.id ? listing.favoritedBy.length > 0 : false}
                      variant="button"
                    />
                    <ShareButton />
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <Link
                    href={`/checkout/${listing.id}`}
                    className="w-full flex items-center justify-center py-3.5 bg-[#111827] hover:bg-[#374151] text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    Comprar
                  </Link>
                  <ContactButton listingId={listing.id} isLoggedIn={!!session?.user?.id} />
                  <div className="flex gap-2">
                    <FavoriteButton
                      listingId={listing.id}
                      initiallySaved={session?.user?.id ? listing.favoritedBy.length > 0 : false}
                      variant="button"
                    />
                    <ShareButton />
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-[#F3F4F6] space-y-2.5">
                {[
                  ["🔒", "Pago protegido con escrow"],
                  ["↩️", "Política de disputas incluida"],
                  ...(listing.seller.verified ? [["✓", "Vendedor verificado"]] : []),
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
                    {sellerRating !== null ? (
                      <span className="text-xs text-[#6B7280]">
                        {sellerRating.toFixed(1)} ({sellerReviews.length} reseña{sellerReviews.length !== 1 ? "s" : ""})
                      </span>
                    ) : (
                      <span className="text-xs text-[#6B7280]">Nuevo vendedor</span>
                    )}
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

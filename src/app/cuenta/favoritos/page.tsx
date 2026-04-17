import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          seller: { select: { name: true, verified: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const savedListings = favorites.map(f => f.listing);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Favoritos</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          {savedListings.length} {savedListings.length === 1 ? "anuncio guardado" : "anuncios guardados"}
        </p>
      </div>

      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedListings.map(l => (
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
                image: l.images[0]?.url || "",
                seller: { name: l.seller.name || "Usuario", rating: 5, verified: l.seller.verified },
                isSaved: true,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-[#111827] mb-2">No tienes favoritos aún</h3>
          <p className="text-[#6B7280] max-w-sm mb-6">
            Explora el marketplace y guarda los equipos que más te gusten.
          </p>
          <Link href="/equipos" className="px-5 py-2.5 bg-[#111827] text-white font-medium rounded-xl hover:bg-[#374151] transition-colors">
            Buscar equipos
          </Link>
        </div>
      )}
    </div>
  );
}

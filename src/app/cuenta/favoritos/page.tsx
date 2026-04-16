import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Heart, Home, Settings } from "lucide-react";

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
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const savedListings = favorites.map(f => f.listing);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar Mi Cuenta (Igual que en anuncios) */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <Link href="/cuenta/anuncios" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors">
            <Home className="w-5 h-5 text-[#9CA3AF]" /> Mis Anuncios
          </Link>
          <Link href="/cuenta/favoritos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#111827] text-white transition-colors">
            <Heart className="w-5 h-5 text-[#3B82F6] fill-current" /> Favoritos
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors cursor-not-allowed opacity-60">
            <Settings className="w-5 h-5 text-[#9CA3AF]" /> Ajustes
          </button>
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#111827]">Equipos Guardados</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              {savedListings.length} {savedListings.length === 1 ? "anuncio favorito" : "anuncios guardados"}
            </p>
          </div>

          {savedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map((l) => (
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
                    isSaved: true
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">No tienes favoritos aún</h3>
              <p className="text-[#6B7280] max-w-sm mb-6">
                Explora el marketplace y guarda los equipos que más te gusten para revisarlos luego o no perderlos de vista.
              </p>
              <Link href="/equipos" className="px-5 py-2.5 bg-[#111827] text-white font-medium rounded-xl hover:bg-[#374151] transition-colors">
                Buscar equipos
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

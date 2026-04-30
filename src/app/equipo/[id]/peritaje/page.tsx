import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import KiteStandardListingClient, { PeritajePrefill } from "@/app/admin/crear-anuncio/KiteStandardListingClient";

export default async function ListingPeritajePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/equipo/${id}/peritaje`);
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!listing || listing.status === "REMOVED") notFound();

  const userIsAdmin = isAdmin(session.user.email);
  if (!userIsAdmin && listing.sellerId !== session.user.id) notFound();

  // Only COMETA kite listings can have peritaje
  if (!["KITESURF", "KITEFOIL"].includes(listing.discipline) || listing.equipmentType !== "COMETA") {
    notFound();
  }

  const meta = (listing.metadata as Record<string, unknown>) ?? {};

  const prefill: PeritajePrefill = {
    title: listing.title,
    discipline: listing.discipline,
    equipmentType: listing.equipmentType,
    brand: listing.brand ?? "",
    size: listing.size ?? "",
    condition: listing.condition,
    price: String(listing.price),
    currency: (listing.currency as "COP" | "USD") ?? "COP",
    description: listing.description,
    city: listing.city,
    images: listing.images.map((img) => img.url),
    metadata: meta,
  };

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <KiteStandardListingClient
          backHref={`/equipo/${id}`}
          backLabel="Volver al anuncio"
          initialStep={2}
          prefillData={prefill}
          existingListingId={id}
        />
      </div>
    </div>
  );
}

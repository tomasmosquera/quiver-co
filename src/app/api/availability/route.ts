import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAvailabilityRequestSeller } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { listingId } = await req.json();
  if (!listingId) return NextResponse.json({ error: "Falta listingId" }, { status: 400 });

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { seller: { select: { id: true, name: true, email: true } } },
  });

  if (!listing || listing.status !== "ACTIVE") {
    return NextResponse.json({ error: "Anuncio no disponible" }, { status: 404 });
  }

  if (listing.sellerId === session.user.id) {
    return NextResponse.json({ error: "No puedes consultar disponibilidad de tu propio anuncio" }, { status: 400 });
  }

  // Upsert: si ya existe una solicitud rechazada la renueva a PENDING
  const request = await prisma.availabilityRequest.upsert({
    where: { listingId_buyerId: { listingId, buyerId: session.user.id } },
    update: { status: "PENDING", updatedAt: new Date() },
    create: {
      listingId,
      buyerId: session.user.id,
      sellerId: listing.sellerId,
      status: "PENDING",
    },
  });

  if (listing.seller.email) {
    await sendAvailabilityRequestSeller(
      listing.seller.email,
      listing.seller.name ?? "Vendedor",
      listing.title,
      listing.id,
    );
  }

  return NextResponse.json({ requestId: request.id, status: request.status });
}

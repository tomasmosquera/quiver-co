import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — crear o recuperar conversación al hacer clic en "Contactar vendedor"
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { listingId } = await req.json();
  if (!listingId) return NextResponse.json({ error: "Falta listingId" }, { status: 400 });

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Anuncio no encontrado" }, { status: 404 });
  if (listing.sellerId === session.user.id) {
    return NextResponse.json({ error: "No puedes contactarte a ti mismo" }, { status: 400 });
  }

  const conversation = await prisma.conversation.upsert({
    where: { listingId_buyerId: { listingId, buyerId: session.user.id } },
    update: {},
    create: { listingId, buyerId: session.user.id, sellerId: listing.sellerId },
  });

  return NextResponse.json({ conversationId: conversation.id });
}

// GET — listar conversaciones del usuario
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
    },
    include: {
      listing: { select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } } },
      buyer:  { select: { id: true, name: true, image: true } },
      seller: { select: { id: true, name: true, image: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ conversations });
}

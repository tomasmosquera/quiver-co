import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { sendNewMessageNotification } from "@/lib/email";
import { randomBytes } from "crypto";

// POST — crear conversación fantasma y enviar primer mensaje
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { listingId, fakeName, message } = await req.json();

  if (!listingId || !fakeName?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { seller: { select: { id: true, name: true, email: true } } },
  });

  if (!listing) return NextResponse.json({ error: "Anuncio no encontrado" }, { status: 404 });

  // Crear usuario fantasma con email único no registrable
  const uid = randomBytes(8).toString("hex");
  const ghostEmail = `ghost+${uid}@quiverkite.com`;

  const ghostUser = await prisma.user.create({
    data: {
      email: ghostEmail,
      name: fakeName.trim(),
    },
  });

  // Crear conversación (ghost = comprador, seller = vendedor)
  const conversation = await prisma.conversation.create({
    data: {
      listingId,
      buyerId: ghostUser.id,
      sellerId: listing.sellerId,
    },
  });

  // Enviar primer mensaje como ghost
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: ghostUser.id,
      content: message.trim(),
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  // Notificar al vendedor por email
  if (listing.seller.email) {
    await sendNewMessageNotification(
      listing.seller.email,
      listing.seller.name ?? "Vendedor",
      fakeName.trim(),
      listing.title,
      conversation.id,
    );
  }

  return NextResponse.json({ conversationId: conversation.id, ghostUserId: ghostUser.id });
}

// GET — listar todas las conversaciones fantasma
export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      buyer: { email: { startsWith: "ghost+" } },
    },
    include: {
      listing: {
        select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } },
      },
      buyer: { select: { id: true, name: true } },
      seller: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ conversations });
}

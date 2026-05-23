import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { sendNewMessageNotification } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

// GET — mensajes de una conversación fantasma
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: { buyer: { select: { email: true } } },
  });

  if (!conversation || !conversation.buyer.email?.startsWith("ghost+")) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ messages, conversation });
}

// POST — admin responde como el usuario fantasma
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, email: true, name: true } },
      seller: { select: { id: true, email: true, name: true } },
      listing: { select: { title: true } },
    },
  });

  if (!conversation || !conversation.buyer.email?.startsWith("ghost+")) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  // Enviar mensaje como el ghost (comprador)
  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: conversation.buyerId,
      content: content.trim(),
    },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

  // Notificar al vendedor
  if (conversation.seller.email) {
    await sendNewMessageNotification(
      conversation.seller.email,
      conversation.seller.name ?? "Vendedor",
      conversation.buyer.name ?? "Cliente",
      conversation.listing.title,
      id,
    );
  }

  return NextResponse.json({ message });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { filterMessage } from "@/lib/messageFilter";

// GET — mensajes de una conversación
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  // Marcar como leídos los mensajes del otro
  await prisma.message.updateMany({
    where: { conversationId: id, senderId: { not: session.user.id }, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ messages });
}

// POST — enviar mensaje
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });

  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (conversation.buyerId !== session.user.id && conversation.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const { blocked, reason } = filterMessage(content);
  if (blocked) return NextResponse.json({ error: reason }, { status: 422 });

  const message = await prisma.message.create({
    data: { conversationId: id, senderId: session.user.id, content: content.trim() },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

  return NextResponse.json({ message });
}

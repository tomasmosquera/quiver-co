import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } } },
      buyer:   { select: { id: true, name: true, email: true, image: true } },
      seller:  { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!conversation) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  // Excluir conversaciones ghost de esta vista
  if (conversation.buyer.email?.startsWith("ghost+")) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json({ conversation, messages });
}

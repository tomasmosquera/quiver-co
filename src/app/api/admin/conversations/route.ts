import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      buyer: { email: { not: { startsWith: "ghost+" } } },
    },
    include: {
      listing: {
        select: { id: true, title: true, images: { take: 1, orderBy: { order: "asc" } } },
      },
      buyer:  { select: { id: true, name: true, email: true, image: true } },
      seller: { select: { id: true, name: true, email: true, image: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ conversations });
}

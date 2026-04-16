import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { listingId, action } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: "ID de anuncio requerido" }, { status: 400 });
    }

    if (action === "ADD") {
      await prisma.favorite.upsert({
        where: {
          userId_listingId: {
            userId: session.user.id,
            listingId: listingId,
          },
        },
        update: {},
        create: {
          userId: session.user.id,
          listingId: listingId,
        },
      });
    } else if (action === "REMOVE") {
      await prisma.favorite.deleteMany({
        where: {
          userId: session.user.id,
          listingId: listingId,
        },
      });
    } else {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Favorite API Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendMetaServerEvent, splitFullName } from "@/lib/meta/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { listingId, action, metaEventId, metaSourceUrl } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: "ID de anuncio requerido" }, { status: 400 });
    }

    if (action === "ADD") {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: {
          title: true,
          price: true,
          currency: true,
        },
      });

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

      const { firstName, lastName } = splitFullName(session.user.name);

      await sendMetaServerEvent({
        eventName: "AddToWishlist",
        eventId: metaEventId,
        eventSourceUrl: metaSourceUrl,
        request: req,
        userData: {
          email: session.user.email,
          firstName,
          lastName,
          externalId: session.user.id,
        },
        customData: {
          content_ids: [listingId],
          content_name: listing?.title,
          content_type: "product",
          currency: listing?.currency ?? "COP",
          value: listing?.price,
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
  } catch (error: unknown) {
    console.error("Favorite API Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

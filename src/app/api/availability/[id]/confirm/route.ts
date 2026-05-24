import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAvailabilityConfirmedBuyer } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function PATCH(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const request = await prisma.availabilityRequest.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true } },
      buyer:   { select: { id: true, name: true, email: true } },
    },
  });

  if (!request) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (request.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const confirmedUntil = new Date(Date.now() + ONE_WEEK_MS);

  // 1. Confirmar la solicitud específica + activar flag global en el anuncio
  await prisma.$transaction([
    prisma.availabilityRequest.update({ where: { id }, data: { status: "CONFIRMED" } }),
    prisma.listing.update({
      where: { id: request.listingId },
      data: { availabilityConfirmedUntil: confirmedUntil },
    }),
  ]);

  // 2. Confirmar todos los demás requests pendientes del mismo anuncio
  const otherPending = await prisma.availabilityRequest.findMany({
    where: {
      listingId: request.listingId,
      status: "PENDING",
      id: { not: id },
    },
    include: { buyer: { select: { name: true, email: true } } },
  });

  if (otherPending.length > 0) {
    await prisma.availabilityRequest.updateMany({
      where: { id: { in: otherPending.map(r => r.id) } },
      data: { status: "CONFIRMED" },
    });

    // Notificar a todos los demás compradores pendientes
    await Promise.all(
      otherPending
        .filter(r => r.buyer.email)
        .map(r =>
          sendAvailabilityConfirmedBuyer(
            r.buyer.email!,
            r.buyer.name ?? "Comprador",
            request.listing.title,
            request.listingId,
          )
        )
    );
  }

  // 3. Notificar al comprador original
  if (request.buyer.email) {
    await sendAvailabilityConfirmedBuyer(
      request.buyer.email,
      request.buyer.name ?? "Comprador",
      request.listing.title,
      request.listing.id,
    );
  }

  return NextResponse.json({ ok: true, confirmedUntil });
}

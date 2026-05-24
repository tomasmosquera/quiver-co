import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAvailabilityRejectedBuyer } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const request = await prisma.availabilityRequest.findUnique({
    where: { id },
    include: {
      listing: { select: { title: true } },
      buyer:   { select: { name: true, email: true } },
    },
  });

  if (!request) return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  if (request.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  await prisma.availabilityRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  if (request.buyer.email) {
    await sendAvailabilityRejectedBuyer(
      request.buyer.email,
      request.buyer.name ?? "Comprador",
      request.listing.title,
    );
  }

  return NextResponse.json({ ok: true });
}

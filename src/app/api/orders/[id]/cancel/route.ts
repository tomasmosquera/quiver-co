import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "tmosquera93@gmail.com";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });

  const isAdmin  = session.user.email === ADMIN_EMAIL;
  const isBuyer  = order.buyerId  === session.user.id;
  const isSeller = order.sellerId === session.user.id;

  // Buyers can cancel only while PENDING
  if (isBuyer && order.status !== "PENDING") {
    return NextResponse.json({ error: "Solo puedes cancelar mientras el pago está siendo validado" }, { status: 400 });
  }

  // Sellers can cancel only while PENDING or PAID (before shipping)
  if (isSeller && !["PENDING", "PAID"].includes(order.status)) {
    return NextResponse.json({ error: "Solo puedes cancelar antes de enviar el equipo" }, { status: 400 });
  }

  // Admins can cancel at any point except if already DELIVERED or CANCELLED
  if (isAdmin && ["DELIVERED", "CANCELLED"].includes(order.status)) {
    return NextResponse.json({ error: "No se puede cancelar una orden ya entregada o cancelada" }, { status: 400 });
  }

  if (!isAdmin && !isBuyer && !isSeller) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  // Cancel the order and restore the listing to ACTIVE in a transaction
  await prisma.$transaction([
    prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    }),
    prisma.listing.update({
      where: { id: order.listingId },
      data: { status: "ACTIVE" },
    }),
  ]);

  return NextResponse.json({ success: true });
}

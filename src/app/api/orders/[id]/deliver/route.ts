import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderDeliveredSeller } from "@/lib/email";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      seller:  { select: { email: true, name: true } },
      listing: { select: { title: true } },
    },
  });
  if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  if (order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "DELIVERED", deliveredAt: new Date() },
  });

  sendOrderDeliveredSeller(order.seller.email!, order.seller.name ?? "Vendedor", order.listing.title, id).catch(console.error);

  return NextResponse.json(updated);
}

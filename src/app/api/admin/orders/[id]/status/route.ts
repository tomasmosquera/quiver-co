import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";


const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING:   ["PAID", "CANCELLED"],
  PAID:      ["SHIPPED", "CANCELLED"],
  SHIPPED:   ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });

  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `No se puede pasar de ${order.status} a ${status}` },
      { status: 400 }
    );
  }

  const now = new Date();
  const data: Record<string, unknown> = { status };

  if (status === "SHIPPED") {
    data.shippedAt = now;
    data.deliveryDeadline = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  }
  if (status === "DELIVERED") {
    data.deliveredAt = now;
  }

  // Si se cancela, restaurar el listing a ACTIVE
  if (status === "CANCELLED") {
    await prisma.order.update({ where: { id }, data });
    await prisma.listing.update({ where: { id: order.listingId }, data: { status: "ACTIVE" } });
    return NextResponse.json({ success: true });
  }

  await prisma.order.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}

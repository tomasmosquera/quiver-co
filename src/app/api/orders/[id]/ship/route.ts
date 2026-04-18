import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  if (order.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  if (order.status !== "PAID") {
    return NextResponse.json({ error: "La orden no está en estado PAID" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { shippingProofUrl } = body as { shippingProofUrl?: string };

  if (!shippingProofUrl) {
    return NextResponse.json({ error: "Debes subir una prueba de envío" }, { status: 400 });
  }

  const now = new Date();
  const deadline = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

  const updated = await prisma.order.update({
    where: { id },
    data: { status: "SHIPPED", shippedAt: now, deliveryDeadline: deadline, shippingProofUrl },
  });

  return NextResponse.json(updated);
}

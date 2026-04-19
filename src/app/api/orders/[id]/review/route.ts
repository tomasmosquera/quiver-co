import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
  if (order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }
  if (order.status !== "DELIVERED") {
    return NextResponse.json({ error: "Solo puedes reseñar órdenes entregadas" }, { status: 400 });
  }

  // One review per order
  const existing = await prisma.review.findUnique({ where: { orderId: id } });
  if (existing) {
    return NextResponse.json({ error: "Ya dejaste una reseña para esta compra" }, { status: 409 });
  }

  const { rating, comment } = await req.json();
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Calificación inválida (1-5)" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      reviewerId: order.buyerId,
      subjectId:  order.sellerId,
      orderId:    id,
      rating,
      comment: comment || null,
    },
  });

  return NextResponse.json(review, { status: 201 });
}

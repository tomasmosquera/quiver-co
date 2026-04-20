import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { buyerName, buyerIdDoc, buyerPhone, buyerCity, buyerAddress, listingId, sellerId, amount } = body;

  if (!buyerName || !buyerIdDoc || !buyerPhone || !buyerCity || !buyerAddress || !listingId || !sellerId)
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== "ACTIVE")
    return NextResponse.json({ error: "Artículo no disponible" }, { status: 400 });

  // Bloquear si ya existe una orden PAID (pago confirmado)
  const paidOrder = await prisma.order.findFirst({
    where: { listingId, status: "PAID" },
  });
  if (paidOrder)
    return NextResponse.json({ error: "Este artículo ya fue vendido" }, { status: 400 });

  // Cancelar órdenes PENDING anteriores del mismo listing (pagos abandonados)
  await prisma.order.updateMany({
    where: { listingId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });

  // Generar referencia única
  const reference = `QVR-${listingId.slice(0, 8)}-${Date.now()}`;
  const amountInCents = amount * 100;
  const currency = "COP";

  // Calcular firma de integridad: SHA256(reference + amountInCents + currency + integrityKey)
  const integrityKey = process.env.WOMPI_INTEGRITY_KEY!;
  const signatureString = `${reference}${amountInCents}${currency}${integrityKey}`;
  const signature = crypto.createHash("sha256").update(signatureString).digest("hex");

  // Crear la orden en estado PENDING con la referencia Wompi
  // El listing se mantiene ACTIVE hasta que el webhook confirme el pago aprobado
  await prisma.order.create({
    data: {
      listingId,
      buyerId: session.user!.id!,
      sellerId,
      amount,
      status: "PENDING",
      paymentMethod: "wompi",
      wompiReference: reference,
      buyerName,
      buyerIdDoc,
      buyerPhone,
      buyerCity,
      buyerAddress,
    },
  });

  return NextResponse.json({ reference, signature, amountInCents, currency });
}

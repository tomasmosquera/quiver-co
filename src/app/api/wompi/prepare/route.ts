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

  const existingOrder = await prisma.order.findFirst({
    where: { listingId, status: { not: "CANCELLED" } },
  });
  if (existingOrder)
    return NextResponse.json({ error: "Este artículo ya tiene una orden activa" }, { status: 400 });

  // Generar referencia única
  const reference = `QVR-${listingId.slice(0, 8)}-${Date.now()}`;
  const amountInCents = amount * 100;
  const currency = "COP";

  // Calcular firma de integridad: SHA256(reference + amountInCents + currency + integrityKey)
  const integrityKey = process.env.WOMPI_INTEGRITY_KEY!;
  const signatureString = `${reference}${amountInCents}${currency}${integrityKey}`;
  const signature = crypto.createHash("sha256").update(signatureString).digest("hex");

  // Crear la orden en estado PENDING con la referencia Wompi
  await prisma.$transaction([
    prisma.order.create({
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
    }),
    prisma.listing.update({
      where: { id: listingId },
      data: { status: "SOLD" },
    }),
  ]);

  return NextResponse.json({ reference, signature, amountInCents, currency });
}

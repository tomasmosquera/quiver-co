import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import {
  captureMetaTrackingSnapshot,
  sendMetaServerEvent,
  splitCityAndState,
  splitFullName,
} from "@/lib/meta/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    buyerName,
    buyerIdDoc,
    buyerPhone,
    buyerCity,
    buyerAddress,
    listingId,
    sellerId,
    amount,
    metaEventId,
    metaSourceUrl,
  } = body;

  if (
    !buyerName ||
    !buyerIdDoc ||
    !buyerPhone ||
    !buyerCity ||
    !buyerAddress ||
    !listingId ||
    !sellerId
  ) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== "ACTIVE") {
    return NextResponse.json({ error: "Articulo no disponible" }, { status: 400 });
  }

  const paidOrder = await prisma.order.findFirst({
    where: { listingId, status: "PAID" },
  });
  if (paidOrder) {
    return NextResponse.json(
      { error: "Este articulo ya fue vendido" },
      { status: 400 },
    );
  }

  await prisma.order.updateMany({
    where: { listingId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });

  const reference = `QVR-${listingId.slice(0, 8)}-${Date.now()}`;
  const amountInCents = amount * 100;
  const currency = "COP";
  const integrityKey = process.env.WOMPI_INTEGRITY_KEY!;
  const signatureString = `${reference}${amountInCents}${currency}${integrityKey}`;
  const signature = crypto.createHash("sha256").update(signatureString).digest("hex");
  const metaSnapshot = captureMetaTrackingSnapshot(req, metaSourceUrl);

  await prisma.order.create({
    data: {
      listingId,
      buyerId: session.user.id,
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
      metaConsentGranted: metaSnapshot.consentGranted,
      metaEventSourceUrl: metaSnapshot.eventSourceUrl ?? null,
      metaFbp: metaSnapshot.fbp ?? null,
      metaFbc: metaSnapshot.fbc ?? null,
      metaClientUserAgent: metaSnapshot.clientUserAgent ?? null,
      metaClientIpAddress: metaSnapshot.clientIpAddress ?? null,
    },
  });

  const { firstName, lastName } = splitFullName(buyerName);
  const { city, state } = splitCityAndState(buyerCity);

  await sendMetaServerEvent({
    eventName: "InitiateCheckout",
    eventId: metaEventId,
    eventSourceUrl: metaSourceUrl,
    request: req,
    userData: {
      email: session.user.email,
      phone: buyerPhone,
      firstName,
      lastName,
      city,
      state,
      country: "co",
      externalId: session.user.id,
    },
    customData: {
      content_ids: [listingId],
      content_name: listing.title,
      content_type: "product",
      currency: "COP",
      value: amount,
      num_items: 1,
    },
  });

  return NextResponse.json({ reference, signature, amountInCents, currency });
}

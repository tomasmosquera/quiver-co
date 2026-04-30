import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  captureMetaTrackingSnapshot,
  sendMetaServerEvent,
  splitCityAndState,
  splitFullName,
} from "@/lib/meta/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Debes iniciar sesion para comprar" },
        { status: 401 },
      );
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
      return NextResponse.json(
        { error: "Faltan datos de envio requeridos" },
        { status: 400 },
      );
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Oops, parece que este articulo ya no esta disponible." },
        { status: 400 },
      );
    }

    const existingOrder = await prisma.order.findFirst({
      where: { listingId, status: { not: "CANCELLED" } },
    });
    if (existingOrder) {
      return NextResponse.json(
        { error: "Este articulo ya tiene una orden activa." },
        { status: 400 },
      );
    }

    const metaSnapshot = captureMetaTrackingSnapshot(req, metaSourceUrl);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          listingId,
          buyerId: session.user.id,
          sellerId,
          amount,
          status: "PENDING",
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

      await tx.listing.update({
        where: { id: listingId },
        data: { status: "SOLD" },
      });

      return newOrder;
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

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: unknown) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error procesando el checkout",
      },
      { status: 500 },
    );
  }
}

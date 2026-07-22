import { NextRequest, NextResponse } from "next/server";
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getPayment } from "@/lib/mercadopago";
import { sendOrderPaidBuyer, sendOrderPaidSeller } from "@/lib/email";
import {
  sendMetaServerEvent,
  splitCityAndState,
  splitFullName,
} from "@/lib/meta/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const dataId = req.nextUrl.searchParams.get("data.id") ?? body?.data?.id;

  try {
    WebhookSignatureValidator.validate({
      xSignature: req.headers.get("x-signature"),
      xRequestId: req.headers.get("x-request-id"),
      dataId,
      secret: process.env.MERCADOPAGO_WEBHOOK_SECRET!,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
    }
    throw error;
  }

  if (body.type !== "payment" || !dataId) {
    return NextResponse.json({ ok: true });
  }

  const payment = await getPayment(dataId);
  const reference = payment.external_reference;
  const status = payment.status;

  if (!reference) {
    return NextResponse.json({ ok: true });
  }

  if (status === "approved") {
    const order = await prisma.order.findUnique({
      where: { paymentReference: reference },
      include: {
        buyer: { select: { email: true, name: true } },
        seller: { select: { email: true, name: true } },
        listing: { select: { title: true } },
      },
    });

    if (order && order.status === "PENDING") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID", paymentTransactionId: String(payment.id) },
        }),
        prisma.listing.update({
          where: { id: order.listingId },
          data: { status: "SOLD" },
        }),
      ]);

      const title = order.listing.title;
      sendOrderPaidBuyer(
        order.buyer.email!,
        order.buyer.name ?? "Comprador",
        title,
        order.id,
      ).catch(console.error);
      sendOrderPaidSeller(
        order.seller.email!,
        order.seller.name ?? "Vendedor",
        title,
        order.id,
        order.buyer.name ?? "el comprador",
      ).catch(console.error);

      const { firstName, lastName } = splitFullName(order.buyerName);
      const { city, state } = splitCityAndState(order.buyerCity);

      await sendMetaServerEvent({
        eventName: "Purchase",
        consentGranted: order.metaConsentGranted,
        eventSourceUrl:
          order.metaEventSourceUrl ?? `https://www.quiverkite.com/equipo/${order.listingId}`,
        userData: {
          email: order.buyer.email,
          phone: order.buyerPhone,
          firstName,
          lastName,
          city,
          state,
          country: "co",
          externalId: order.buyerId,
          fbp: order.metaFbp,
          fbc: order.metaFbc,
          clientIpAddress: order.metaClientIpAddress,
          clientUserAgent: order.metaClientUserAgent,
        },
        customData: {
          content_ids: [order.listingId],
          content_name: order.listing.title,
          content_type: "product",
          currency: "COP",
          value: order.amount,
          num_items: 1,
        },
      });
    }
  }

  if (status === "rejected" || status === "cancelled") {
    const order = await prisma.order.findUnique({
      where: { paymentReference: reference },
    });

    if (order && order.status === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED", paymentTransactionId: String(payment.id) },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

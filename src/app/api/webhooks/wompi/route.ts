import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendOrderPaidBuyer, sendOrderPaidSeller } from "@/lib/email";
import { ADMIN_EMAILS } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verificar firma del evento
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET!;
  const { timestamp, signature: wompiSig } = body;
  const event = body.event;
  const data = body.data;

  if (wompiSig?.checksum) {
    const toHash = `${timestamp}${eventsSecret}`;
    const expected = crypto.createHash("sha256").update(toHash).digest("hex");
    if (expected !== wompiSig.checksum) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
  }

  if (event === "transaction.updated") {
    const tx = data?.transaction;
    if (!tx) return NextResponse.json({ ok: true });

    const { reference, status, id: transactionId } = tx;

    if (status === "APPROVED") {
      const order = await prisma.order.findUnique({
        where: { wompiReference: reference },
        include: {
          buyer:   { select: { email: true, name: true } },
          seller:  { select: { email: true, name: true } },
          listing: { select: { title: true } },
        },
      });
      if (order && order.status === "PENDING") {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: { status: "PAID", wompiTransactionId: transactionId },
          }),
          prisma.listing.update({
            where: { id: order.listingId },
            data: { status: "SOLD" },
          }),
        ]);
        const title = order.listing.title;
        sendOrderPaidBuyer(order.buyer.email!, order.buyer.name ?? "Comprador", title, order.id).catch(console.error);
        sendOrderPaidSeller(order.seller.email!, order.seller.name ?? "Vendedor", title, order.id, order.buyer.name ?? "el comprador").catch(console.error);
      }
    }

    if (status === "DECLINED" || status === "VOIDED" || status === "ERROR") {
      const order = await prisma.order.findUnique({ where: { wompiReference: reference } });
      if (order && order.status === "PENDING") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "CANCELLED", wompiTransactionId: transactionId },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

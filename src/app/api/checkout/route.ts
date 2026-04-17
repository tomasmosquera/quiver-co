import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Debes iniciar sesión para comprar" }, { status: 401 });
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
      amount 
    } = body;

    if (!buyerName || !buyerIdDoc || !buyerPhone || !buyerCity || !buyerAddress || !listingId || !sellerId) {
      return NextResponse.json({ error: "Faltan datos de envío requeridos" }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing || listing.status !== "ACTIVE") {
      return NextResponse.json({ error: "Oops, parece que este artículo ya no está disponible." }, { status: 400 });
    }

    // Usamos una transacción para asegurar consistencia
    const order = await prisma.$transaction(async (tx) => {
      // 1. Crear Orden
      const newOrder = await tx.order.create({
        data: {
          listingId,
          buyerId: session.user!.id!,
          sellerId,
          amount,
          status: "PENDING",
          buyerName,
          buyerIdDoc,
          buyerPhone,
          buyerCity,
          buyerAddress
        }
      });

      // 2. Marcar listing como vendido
      await tx.listing.update({
        where: { id: listingId },
        data: { status: "SOLD" }
      });

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
    
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error?.message || "Error procesando el checkout" }, { status: 500 });
  }
}

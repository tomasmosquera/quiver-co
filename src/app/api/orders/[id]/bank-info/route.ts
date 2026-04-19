import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  if (order.sellerId !== session.user.id)
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });

  const { sellerBankName, sellerBankAccountType, sellerBankAccountNumber, sellerBankAccountHolder, sellerBankIdDoc } = await req.json();

  if (!sellerBankName || !sellerBankAccountType || !sellerBankAccountNumber || !sellerBankAccountHolder || !sellerBankIdDoc)
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  await prisma.order.update({
    where: { id },
    data: { sellerBankName, sellerBankAccountType, sellerBankAccountNumber, sellerBankAccountHolder, sellerBankIdDoc },
  });

  return NextResponse.json({ ok: true });
}

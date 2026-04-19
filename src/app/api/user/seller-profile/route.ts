import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, phone, department, city, address, bankName, bankAccountType, bankAccountNumber, bankAccountHolder, bankIdDoc } = body;

  if (!name || !phone || !department || !city || !address || !bankName || !bankAccountType || !bankAccountNumber || !bankAccountHolder || !bankIdDoc) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, department, city, address, bankName, bankAccountType, bankAccountNumber, bankAccountHolder, bankIdDoc },
  });

  return NextResponse.json({ success: true });
}

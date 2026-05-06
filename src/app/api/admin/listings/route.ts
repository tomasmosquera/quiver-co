import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { Discipline, EquipmentType, Condition } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const {
    sellerId,
    title,
    description,
    price,
    currency,
    discipline,
    equipmentType,
    condition,
    brand,
    size,
    city,
    images,
    metadata,
  } = body;

  if (!sellerId)
    return NextResponse.json({ error: "Debes asignar el anuncio a un usuario" }, { status: 400 });

  if (!title || !description || !price || !discipline || !equipmentType || !condition || !city)
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });

  const seller = await prisma.user.findUnique({ where: { id: sellerId } });
  if (!seller)
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      price: parseInt(price),
      currency: currency === "USD" ? "USD" : "COP",
      discipline: discipline as Discipline,
      equipmentType: equipmentType as EquipmentType,
      condition: condition as Condition,
      brand: brand || null,
      size: size || null,
      city,
      metadata: metadata ?? undefined,
      sellerId,
      images: {
        create: ((images as string[]) ?? []).map((url, i) => ({ url, order: i })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json({ listing }, { status: 201 });
}

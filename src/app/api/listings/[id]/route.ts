import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const userIsAdmin = isAdmin(session.user.email);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing || (!userIsAdmin && existing.sellerId !== session.user.id)) {
    return NextResponse.json({ error: "No encontrado o sin permiso" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, price, discipline, equipmentType, condition, brand, size, city, images, metadata } = body;

  if (!title || !description || !price || !discipline || !equipmentType || !condition || !city) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  // Reemplazar imágenes: borrar las anteriores y crear las nuevas
  await prisma.listingImage.deleteMany({ where: { listingId: id } });

  const listing = await prisma.listing.update({
    where: { id },
    data: {
      title,
      description,
      price: parseInt(price),
      discipline,
      equipmentType,
      condition,
      brand: brand || null,
      size: size || null,
      city,
      metadata: metadata ?? undefined,
      images: {
        create: (images as string[]).map((url, i) => ({ url, order: i })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json({ listing });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const isAdmin2 = isAdmin(session.user.email);
  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing || (!isAdmin2 && existing.sellerId !== session.user.id)) {
    return NextResponse.json({ error: "No encontrado o sin permiso" }, { status: 403 });
  }

  await prisma.listing.update({
    where: { id },
    data: { status: "REMOVED" },
  });

  return NextResponse.json({ ok: true });
}

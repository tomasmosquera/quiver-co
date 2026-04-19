import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Anuncio no encontrado" }, { status: 404 });
  }

  // 1. Borrar imágenes de Cloudinary
  const cloudinaryDeletions = listing.images
    .filter(img => img.publicId)
    .map(img =>
      cloudinary.uploader.destroy(img.publicId!).catch(() => null)
    );
  await Promise.allSettled(cloudinaryDeletions);

  // 2. Borrar todo en cascada dentro de una transacción:
  //    orders → listing (images, favorites, conversations se borran por cascade en BD)
  await prisma.$transaction(async (tx) => {
    // Cancelar y borrar órdenes asociadas
    await tx.order.deleteMany({ where: { listingId: id } });
    // Borrar el listing (cascade borra: images, favorites, conversations+messages)
    await tx.listing.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}

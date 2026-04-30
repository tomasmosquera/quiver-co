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
  const { hasRepairs, repairs, standardInspection } = body;

  if (!standardInspection || !standardInspection.version) {
    return NextResponse.json({ error: "Datos de peritaje inválidos" }, { status: 400 });
  }

  // Merge inspection into existing metadata
  const currentMeta = (existing.metadata as Record<string, unknown>) ?? {};
  const updatedMeta = {
    ...currentMeta,
    hasRepairs: hasRepairs ?? false,
    repairs: repairs ?? [],
    standardInspection,
  };

  const listing = await prisma.listing.update({
    where: { id },
    data: { metadata: updatedMeta },
  });

  return NextResponse.json({ listing });
}

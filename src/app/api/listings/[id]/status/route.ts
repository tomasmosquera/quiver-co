import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";
import { sendListingStatusSeller } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const userIsAdmin = isAdmin(session.user.email);
  const allowedOwner: ListingStatus[] = ["ACTIVE", "PAUSED", "SOLD"];
  const allowedAdmin: ListingStatus[] = ["ACTIVE", "PAUSED", "SOLD", "REMOVED"];

  const allowed = userIsAdmin ? allowedAdmin : allowedOwner;
  if (!allowed.includes(status))
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });

  const existing = await prisma.listing.findUnique({
    where: { id },
    include: { seller: { select: { email: true, name: true } } },
  });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (!userIsAdmin && existing.sellerId !== session.user.id)
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });

  const listing = await prisma.listing.update({
    where: { id },
    data: { status },
  });

  // Notificar al vendedor solo cuando el admin cambia el estado (no cuando el mismo vendedor lo cambia)
  if (userIsAdmin) {
    sendListingStatusSeller(
      existing.seller.email!,
      existing.seller.name ?? "Vendedor",
      existing.title,
      id,
      status,
    ).catch(console.error);
  }

  return NextResponse.json({ listing });
}

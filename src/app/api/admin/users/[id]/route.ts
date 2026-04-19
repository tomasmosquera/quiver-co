import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const {
    name, email, phone, city, department, address, bio,
    verified, verificationStatus,
  } = body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name:               name               ?? undefined,
      email:              email              ?? undefined,
      phone:              phone              ?? undefined,
      city:               city               ?? undefined,
      department:         department         ?? undefined,
      address:            address            ?? undefined,
      bio:                bio                ?? undefined,
      verified:           verified           !== undefined ? Boolean(verified) : undefined,
      verificationStatus: verificationStatus ?? undefined,
    },
  });

  return NextResponse.json({ user });
}

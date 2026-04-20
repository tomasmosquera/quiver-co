import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, phone, idDoc, address, city, department, bio } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name       !== undefined && { name: String(name).trim() || null }),
      ...(phone      !== undefined && { phone: String(phone).trim() || null }),
      ...(idDoc      !== undefined && { idDoc: String(idDoc).trim() || null }),
      ...(address    !== undefined && { address: String(address).trim() || null }),
      ...(city       !== undefined && { city: String(city).trim() || null }),
      ...(department !== undefined && { department: String(department).trim() || null }),
      ...(bio        !== undefined && { bio: String(bio).trim() || null }),
    },
    select: { id: true, name: true, phone: true, idDoc: true, address: true, city: true, department: true, bio: true },
  });

  return NextResponse.json({ user });
}

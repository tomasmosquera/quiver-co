import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, email, phone, city, department, address, password } = body;

  const resolvedEmail = email?.trim()
    ? email.trim()
    : `usuario-${Date.now()}@quiver-co.internal`;

  const existing = await prisma.user.findUnique({ where: { email: resolvedEmail } });
  if (existing)
    return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });

  const hashedPassword = password?.trim()
    ? await bcrypt.hash(password.trim(), 10)
    : null;

  const user = await prisma.user.create({
    data: {
      email: resolvedEmail,
      name:       name?.trim()       || null,
      phone:      phone?.trim()      || null,
      city:       city?.trim()       || null,
      department: department?.trim() || null,
      address:    address?.trim()    || null,
      password:   hashedPassword,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}

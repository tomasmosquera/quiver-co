import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendMetaServerEvent, splitFullName } from "@/lib/meta/server";

export async function POST(req: Request) {
  const { name, email, password, metaEventId, metaSourceUrl } = await req.json();

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
    },
  });

  const { firstName, lastName } = splitFullName(user.name);

  await sendMetaServerEvent({
    eventName: "CompleteRegistration",
    eventId: metaEventId,
    eventSourceUrl: metaSourceUrl,
    request: req,
    userData: {
      email: user.email,
      firstName,
      lastName,
      externalId: user.id,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

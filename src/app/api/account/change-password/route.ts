import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { current, next } = await req.json();
  if (!current || !next) return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  if (next.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return NextResponse.json(
      { error: "Esta cuenta usa Google para iniciar sesión. No puedes cambiar la contraseña desde aquí." },
      { status: 400 }
    );
  }

  const valid = await bcrypt.compare(current, user.password);
  if (!valid) return NextResponse.json({ error: "La contraseña actual es incorrecta." }, { status: 400 });

  const hash = await bcrypt.hash(next, 12);
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hash } });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Correo requerido." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });

  // Always return success to avoid email enumeration
  if (!user || !user.password) {
    return NextResponse.json({ ok: true });
  }

  // Delete any existing token for this email
  await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { email: user.email, token, expiresAt },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_URL ?? "https://quiverkite.com"}/reset-password?token=${token}`;

  await sendPasswordResetEmail(user.email, user.name ?? "Kitesurfista", resetUrl);

  return NextResponse.json({ ok: true });
}

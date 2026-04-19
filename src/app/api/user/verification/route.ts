import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { verificationIdUrl } = await req.json();
  if (!verificationIdUrl) return NextResponse.json({ error: "Falta la imagen" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { verificationStatus: true } });
  if (user?.verificationStatus === "APPROVED") {
    return NextResponse.json({ error: "Ya estás verificado" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { verificationStatus: "PENDING", verificationIdUrl },
  });

  return NextResponse.json({ success: true });
}

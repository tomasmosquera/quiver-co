import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { action } = await req.json(); // "approve" | "reject"

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: {
      verificationStatus: action === "approve" ? "APPROVED" : "REJECTED",
      verified: action === "approve",
    },
  });

  return NextResponse.json({ success: true });
}

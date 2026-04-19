import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email))
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { reviewerId, subjectId, rating, comment } = await req.json();

  if (!reviewerId || !subjectId || !rating)
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  if (reviewerId === subjectId)
    return NextResponse.json({ error: "El revisor y el sujeto no pueden ser el mismo usuario" }, { status: 400 });
  if (rating < 1 || rating > 5)
    return NextResponse.json({ error: "Rating debe ser entre 1 y 5" }, { status: 400 });

  const review = await prisma.review.create({
    data: {
      reviewerId,
      subjectId,
      rating: Number(rating),
      comment: comment || null,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}

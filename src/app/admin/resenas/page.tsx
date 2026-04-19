import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import ReviewsClient from "./ReviewsClient";

export default async function AdminResenasPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const reviews = await prisma.review.findMany({
    include: {
      reviewer: { select: { name: true, email: true } },
      subject:  { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Reseñas</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            {reviews.length} reseña{reviews.length !== 1 ? "s" : ""} · Promedio: {avg} ★
          </p>
        </div>
      </div>
      <ReviewsClient reviews={reviews} />
    </div>
  );
}

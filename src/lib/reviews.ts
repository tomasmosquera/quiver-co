import { prisma } from "@/lib/prisma";

export interface SellerRatingStats {
  avgRating: number | null;
  reviewCount: number;
}

export async function getSellerRatingStatsMap(
  sellerIds: string[],
): Promise<Map<string, SellerRatingStats>> {
  const uniqueSellerIds = [...new Set(sellerIds.filter(Boolean))];
  if (uniqueSellerIds.length === 0) return new Map();

  const rows = await prisma.review.groupBy({
    by: ["subjectId"],
    where: { subjectId: { in: uniqueSellerIds } },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return new Map(
    rows.map((row) => [
      row.subjectId,
      {
        avgRating: row._avg.rating ?? null,
        reviewCount: row._count.rating ?? 0,
      },
    ]),
  );
}

export function formatSellerRatingLabel(stats?: SellerRatingStats | null): string {
  if (!stats || stats.avgRating === null || stats.reviewCount === 0) {
    return "Nuevo vendedor";
  }

  return stats.avgRating.toFixed(1);
}

export function formatSellerRatingTitle(stats?: SellerRatingStats | null): string {
  if (!stats || stats.avgRating === null || stats.reviewCount === 0) {
    return "Nuevo vendedor";
  }

  return `${stats.avgRating.toFixed(1)} (${stats.reviewCount} reseña${stats.reviewCount !== 1 ? "s" : ""})`;
}

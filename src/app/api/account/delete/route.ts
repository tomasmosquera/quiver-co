import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const userId = session.user.id;

  // Cascade order: delete children before parents to avoid FK violations.
  // Prisma onDelete: Cascade handles most relations, but we handle orders
  // manually because listings have a unique order relation and orders
  // reference listings that we're about to delete.

  await prisma.$transaction(async (tx) => {
    // 1. Reviews written by or about this user
    await tx.review.deleteMany({
      where: { OR: [{ reviewerId: userId }, { subjectId: userId }] },
    });

    // 2. Orders where user is buyer or seller (also removes shippingProof refs)
    await tx.order.deleteMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    });

    // 3. Messages sent by user (conversations cascaded via listing delete below)
    await tx.message.deleteMany({ where: { senderId: userId } });

    // 4. Conversations where user is buyer or seller
    await tx.conversation.deleteMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
    });

    // 5. Favorites
    await tx.favorite.deleteMany({ where: { userId } });

    // 6. Listing images + listings
    const listings = await tx.listing.findMany({
      where: { sellerId: userId },
      select: { id: true },
    });
    const listingIds = listings.map(l => l.id);
    await tx.listingImage.deleteMany({ where: { listingId: { in: listingIds } } });
    await tx.listing.deleteMany({ where: { sellerId: userId } });

    // 7. Password reset tokens
    await tx.passwordResetToken.deleteMany({ where: { email: session.user!.email! } });

    // 8. NextAuth accounts & sessions
    await tx.account.deleteMany({ where: { userId } });
    await tx.session.deleteMany({ where: { userId } });

    // 9. User itself
    await tx.user.delete({ where: { id: userId } });
  });

  return NextResponse.json({ ok: true });
}

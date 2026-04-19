import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import EditForm from "./EditForm";

export default async function EditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  const isAdmin = isAdmin(session.user.email);
  if (!listing || listing.status === "REMOVED") notFound();
  if (!isAdmin && listing.sellerId !== session.user.id) notFound();

  return (
    <EditForm
      listingId={id}
      initial={{
        discipline:    listing.discipline,
        equipmentType: listing.equipmentType,
        title:         listing.title,
        brand:         listing.brand ?? "",
        size:          listing.size  ?? "",
        condition:     listing.condition,
        price:         listing.price.toString(),
        description:   listing.description,
        city:          listing.city,
        images:        listing.images.map(img => img.url),
        metadata:      (listing.metadata as Record<string, unknown>) ?? {},
      }}
    />
  );
}

import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminCreateListingForm from "./AdminCreateListingForm";

export default async function AdminCrearAnuncioPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: [{ name: "asc" }],
  });

  return <AdminCreateListingForm users={users} />;
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditUserForm from "./EditUserForm";

export default async function AdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true,
      city: true, department: true, address: true, bio: true,
      verified: true, verificationStatus: true, image: true,
      createdAt: true,
      listings:       { select: { id: true } },
      ordersAsBuyer:  { select: { id: true } },
      ordersAsSeller: { select: { id: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/usuarios" className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
          <ChevronLeft className="w-4 h-4" /> Usuarios
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user.image
          ? <img src={user.image} alt="" className="w-12 h-12 rounded-full object-cover" />
          : <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white font-bold">{user.name?.[0] ?? "?"}</div>
        }
        <div>
          <h1 className="text-xl font-bold text-[#111827]">{user.name ?? "Sin nombre"}</h1>
          <p className="text-sm text-[#6B7280]">
            {user.email} · {user.listings.length} anuncios · {user.ordersAsBuyer.length} compras · {user.ordersAsSeller.length} ventas
          </p>
        </div>
      </div>

      <EditUserForm user={user} />
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";


export default async function AdminOrdenesPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const orders = await prisma.order.findMany({
    include: {
      listing: { select: { title: true, id: true } },
      buyer:  { select: { name: true, email: true, phone: true } },
      seller: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Órdenes</h1>
        <p className="text-sm text-[#6B7280] mt-1">Gestiona y valida todas las transacciones.</p>
      </div>
      <OrdersClient orders={orders} />
    </div>
  );
}

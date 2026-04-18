import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

const ADMIN_EMAIL = "tmosquera93@gmail.com";

export default async function AdminOrdenesPage() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/");

  const orders = await prisma.order.findMany({
    include: {
      listing: { select: { title: true, id: true } },
      buyer:  { select: { name: true, email: true } },
      seller: { select: { name: true, email: true } },
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

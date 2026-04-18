import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";

const ADMIN_EMAIL = "tmosquera93@gmail.com";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/");

  const [
    totalUsers,
    totalListings,
    activeListings,
    totalOrders,
    pendingOrders,
    paidOrders,
    shippedOrders,
    deliveredOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.findMany({
      where: { status: "PENDING" },
      include: {
        listing: { select: { title: true } },
        buyer: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalRevenue = await prisma.order.aggregate({
    where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    _sum: { amount: true },
  });

  const stats = [
    { label: "Usuarios registrados", value: totalUsers, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Anuncios activos", value: `${activeListings} / ${totalListings}`, icon: Package, color: "bg-emerald-50 text-emerald-600" },
    { label: "Órdenes totales", value: totalOrders, icon: ShoppingCart, color: "bg-purple-50 text-purple-600" },
    { label: "Volumen validado", value: `$${(totalRevenue._sum.amount ?? 0).toLocaleString("es-CO")}`, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
  ];

  const orderStats = [
    { label: "Esperando validación", value: pendingOrders, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Pago confirmado", value: paidOrders, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Enviados", value: shippedOrders, icon: Truck, color: "text-blue-600 bg-blue-50" },
    { label: "Entregados", value: deliveredOrders, icon: CheckCircle, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#6B7280] mt-1">Resumen general de Quiver Co.</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-[#111827]">{value}</p>
            <p className="text-xs text-[#6B7280] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Order funnel */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
        <h2 className="font-bold text-[#111827] mb-4">Estado de órdenes</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {orderStats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center p-4 rounded-xl bg-[#F9FAFB]">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-[#111827]">{value}</p>
              <p className="text-xs text-[#6B7280] mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending orders alert */}
      {pendingOrders > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-amber-800">
              {pendingOrders} {pendingOrders === 1 ? "orden pendiente de validación" : "órdenes pendientes de validación"}
            </h2>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{order.listing.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {order.buyer.name} · {order.buyer.email} · ${order.amount.toLocaleString("es-CO")} COP
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Link
                  href="/admin/ordenes"
                  className="px-4 py-2 bg-[#111827] hover:bg-[#374151] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Validar
                </Link>
              </div>
            ))}
          </div>
          {pendingOrders > 5 && (
            <Link href="/admin/ordenes" className="block text-center text-sm text-amber-700 font-medium mt-3 hover:underline">
              Ver todas las órdenes pendientes →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

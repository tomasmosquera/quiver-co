import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "tmosquera93@gmail.com";

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/");

  const users = await prisma.user.findMany({
    include: {
      listings:      { select: { id: true } },
      ordersAsBuyer: { select: { id: true } },
      ordersAsSeller:{ select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Usuarios</h1>
        <p className="text-sm text-[#6B7280] mt-1">{users.length} usuarios registrados</p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Usuario</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Registro</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Anuncios</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Compras</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Ventas</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Perfil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.image
                      ? <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                      : <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-xs font-bold">{user.name?.[0] ?? "?"}</div>
                    }
                    <div>
                      <p className="font-semibold text-[#111827]">{user.name ?? "Sin nombre"}</p>
                      <p className="text-xs text-[#9CA3AF]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#6B7280]">
                  {new Date(user.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-5 py-4 text-center font-medium text-[#374151]">
                  {user.listings.length}
                </td>
                <td className="px-5 py-4 text-center font-medium text-[#374151]">
                  {user.ordersAsBuyer.length}
                </td>
                <td className="px-5 py-4 text-center font-medium text-[#374151]">
                  {user.ordersAsSeller.length}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/perfil/${user.id}`}
                    className="text-xs text-[#3B82F6] hover:underline"
                  >
                    Ver perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

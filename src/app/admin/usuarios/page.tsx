import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import VerificationActions from "./VerificationActions";


const VERIF_BADGE: Record<string, React.ReactNode> = {
  APPROVED: <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full"><ShieldCheck className="w-3 h-3" /> Verificado</span>,
  PENDING:  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full"><ShieldAlert className="w-3 h-3" /> Pendiente</span>,
  REJECTED: <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full"><Shield className="w-3 h-3" /> Rechazado</span>,
  NONE:     <span className="text-xs text-[#9CA3AF]">—</span>,
};

export default async function AdminUsuariosPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  const users = await prisma.user.findMany({
    include: {
      listings:       { select: { id: true } },
      ordersAsBuyer:  { select: { id: true } },
      ordersAsSeller: { select: { id: true } },
    },
    orderBy: [
      { verificationStatus: "asc" }, // PENDING primero (P antes que N/A/R alfabéticamente)
      { createdAt: "desc" },
    ],
  });

  const pending = users.filter(u => u.verificationStatus === "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Usuarios</h1>
        <p className="text-sm text-[#6B7280] mt-1">{users.length} usuarios registrados · {pending.length} verificación pendiente</p>
      </div>

      {/* Alert de pendientes */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm font-semibold text-amber-800">
            {pending.length} solicitud{pending.length !== 1 ? "es" : ""} de verificación pendiente{pending.length !== 1 ? "s" : ""} de revisión
          </p>
        </div>
      )}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Usuario</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Registro</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">Anuncios</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">Compras</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-[#6B7280]">Ventas</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Verificación</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {users.map((user) => (
              <tr key={user.id} className={`hover:bg-[#F9FAFB] transition-colors ${user.verificationStatus === "PENDING" ? "bg-amber-50/30" : ""}`}>
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
                <td className="px-5 py-4 text-center font-medium text-[#374151]">{user.listings.length}</td>
                <td className="px-5 py-4 text-center font-medium text-[#374151]">{user.ordersAsBuyer.length}</td>
                <td className="px-5 py-4 text-center font-medium text-[#374151]">{user.ordersAsSeller.length}</td>
                <td className="px-5 py-4">
                  {VERIF_BADGE[user.verificationStatus] ?? VERIF_BADGE.NONE}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.verificationStatus === "PENDING" && user.verificationIdUrl && (
                      <VerificationActions userId={user.id} idUrl={user.verificationIdUrl} />
                    )}
                    <Link href={`/admin/usuarios/${user.id}/editar`} className="text-xs text-[#3B82F6] hover:underline">
                      Editar
                    </Link>
                    <Link href={`/perfil/${user.id}`} className="text-xs text-[#6B7280] hover:underline">
                      Ver perfil
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

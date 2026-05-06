import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CreateUserForm from "./CreateUserForm";

export default async function CrearUsuarioPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/usuarios"
          className="text-sm text-[#6B7280] hover:text-[#111827] flex items-center gap-1 mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a usuarios
        </Link>
        <h1 className="text-2xl font-bold text-[#111827]">Crear usuario</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Todos los campos son opcionales. El email se autogenera si se deja vacío.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
        <CreateUserForm />
      </div>
    </div>
  );
}

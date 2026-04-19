import { Wind } from "lucide-react";
import Link from "next/link";
import AuthForms from "./AuthForms";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#111827] rounded-xl flex items-center justify-center">
              <Wind className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <span className="font-bold text-[#111827] text-2xl tracking-tight">
              Quiver<span className="text-[#3B82F6]"> Co.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Bienvenido</h1>
          <p className="text-[#6B7280] mt-2 text-sm">
            Compra, vende y conecta con la comunidad
          </p>
        </div>

        <AuthForms />

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Al continuar, aceptas nuestros{" "}
          <Link href="/terminos" className="text-[#3B82F6] hover:underline">Términos</Link>
          {" "}y{" "}
          <Link href="/privacidad" className="text-[#3B82F6] hover:underline">Política de privacidad</Link>
        </p>
      </div>
    </div>
  );
}

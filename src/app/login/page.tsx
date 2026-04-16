import { signIn } from "@/lib/auth";
import { Wind } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
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
          <h1 className="text-2xl font-bold text-[#111827]">Bienvenido de vuelta</h1>
          <p className="text-[#6B7280] mt-2 text-sm">
            Inicia sesión para comprar, vender y conectar con la comunidad
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-colors text-[#111827] font-medium text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#9CA3AF]">
              Al continuar, aceptas nuestros{" "}
              <Link href="/terminos" className="text-[#3B82F6] hover:underline">
                Términos y condiciones
              </Link>{" "}
              y{" "}
              <Link href="/privacidad" className="text-[#3B82F6] hover:underline">
                Política de privacidad
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/login" className="text-[#3B82F6] font-medium hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Wind, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      const data = await res.json();
      setError(data.error ?? "Ocurrió un error.");
    }
  }

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium">Enlace inválido.</p>
        <Link href="/olvide-contrasena" className="text-sm text-[#3B82F6] mt-3 inline-block hover:underline">
          Solicitar uno nuevo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {done ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7 text-emerald-500" />
          </div>
          <h2 className="font-bold text-[#111827]">¡Contraseña actualizada!</h2>
          <p className="text-sm text-[#6B7280]">Serás redirigido al inicio de sesión en unos segundos.</p>
          <Link href="/login" className="inline-block text-sm text-[#3B82F6] font-medium hover:underline">
            Ir al inicio de sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-2.5 pr-10 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Confirmar contraseña</label>
            <input
              type={showPw ? "text" : "password"}
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repite tu contraseña"
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar nueva contraseña
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#111827] rounded-xl flex items-center justify-center">
              <Wind className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <span className="font-bold text-[#111827] text-2xl tracking-tight">
              Quiver<span className="text-[#3B82F6]"> Co.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Nueva contraseña</h1>
          <p className="text-[#6B7280] mt-2 text-sm">Elige una contraseña segura para tu cuenta.</p>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          <Suspense fallback={<div className="h-40 animate-pulse bg-[#F9FAFB] rounded-xl" />}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

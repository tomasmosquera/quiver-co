"use client";

import { useState } from "react";
import Link from "next/link";
import { Wind, Loader2, CheckCircle } from "lucide-react";

export default function OlvideContrasenaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Ocurrió un error. Intenta de nuevo.");
    }
  }

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
          <h1 className="text-2xl font-bold text-[#111827]">Recuperar contraseña</h1>
          <p className="text-[#6B7280] mt-2 text-sm">
            Te enviamos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="font-bold text-[#111827]">Revisa tu correo</h2>
              <p className="text-sm text-[#6B7280]">
                Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
              </p>
              <Link href="/login" className="inline-block mt-2 text-sm text-[#3B82F6] font-medium hover:underline">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Enviar enlace de recuperación
              </button>
              <p className="text-center text-sm text-[#6B7280]">
                <Link href="/login" className="text-[#3B82F6] font-medium hover:underline">
                  Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

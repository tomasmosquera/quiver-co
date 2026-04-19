"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Lock, Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react";

/* ─── Change Password ──────────────────────────────────── */
function ChangePasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.next !== form.confirm) {
      setMsg("Las contraseñas nuevas no coinciden.");
      setStatus("error");
      return;
    }
    if (form.next.length < 8) {
      setMsg("La contraseña debe tener al menos 8 caracteres.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    const res = await fetch("/api/account/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: form.current, next: form.next }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("ok");
      setMsg("Contraseña actualizada correctamente.");
      setForm({ current: "", next: "", confirm: "" });
    } else {
      setStatus("error");
      setMsg(data.error ?? "Ocurrió un error. Inténtalo de nuevo.");
    }
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
          <Lock className="w-4 h-4 text-[#3B82F6]" />
        </div>
        <h2 className="text-base font-bold text-[#111827]">Cambiar contraseña</h2>
      </div>
      <p className="text-sm text-[#6B7280] mb-6 ml-12">
        Actualiza tu contraseña de acceso. No aplicable si iniciaste sesión con Google.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">Contraseña actual</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={form.current}
              onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
              required
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">Nueva contraseña</label>
          <input
            type={show ? "text" : "password"}
            value={form.next}
            onChange={e => setForm(f => ({ ...f, next: e.target.value }))}
            required
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">Confirmar nueva contraseña</label>
          <input
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            required
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            placeholder="Repite la nueva contraseña"
          />
        </div>

        {msg && (
          <p className={`text-sm ${status === "ok" ? "text-emerald-600" : "text-red-500"}`}>{msg}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#111827] hover:bg-[#1F2937] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Guardando…" : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}

/* ─── Delete Account ───────────────────────────────────── */
function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleDelete() {
    setStatus("loading");
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      const data = await res.json();
      setStatus("error");
      setMsg(data.error ?? "No se pudo eliminar la cuenta. Inténtalo más tarde.");
    }
  }

  return (
    <div className="bg-white border border-red-100 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <Trash2 className="w-4 h-4 text-red-500" />
        </div>
        <h2 className="text-base font-bold text-[#111827]">Eliminar cuenta</h2>
      </div>
      <p className="text-sm text-[#6B7280] mb-6 ml-12">
        Esta acción es irreversible. Se borrarán tu perfil, anuncios, mensajes, favoritos y todo dato asociado a tu cuenta.
      </p>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="ml-12 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Eliminar mi cuenta
        </button>
      ) : (
        <div className="ml-12 max-w-sm space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Se eliminarán permanentemente tus anuncios activos, conversaciones, favoritos, reseñas y tu perfil. Esta acción <strong>no se puede deshacer</strong>.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Escribe <span className="font-mono font-bold">ELIMINAR</span> para confirmar
            </label>
            <input
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="ELIMINAR"
            />
          </div>
          {msg && <p className="text-sm text-red-500">{msg}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => { setOpen(false); setConfirm(""); setMsg(""); setStatus("idle"); }}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={confirm !== "ELIMINAR" || status === "loading"}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-40"
            >
              {status === "loading" ? "Eliminando…" : "Confirmar eliminación"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────── */
export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111827]">Configuración</h1>
        <p className="text-sm text-[#6B7280] mt-1">Ajustes de seguridad y cuenta.</p>
      </div>
      <ChangePasswordSection />
      <DeleteAccountSection />
    </div>
  );
}

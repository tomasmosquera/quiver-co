import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const BASE_URL = "https://www.quiverkite.com";

function layout(content: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff">
      <div style="margin-bottom:28px">
        <span style="font-size:20px;font-weight:700;color:#111827">Quiver<span style="color:#3B82F6"> Co.</span></span>
      </div>
      ${content}
      <hr style="border:none;border-top:1px solid #F3F4F6;margin:32px 0" />
      <p style="color:#9CA3AF;font-size:12px;margin:0">© 2026 Quiver Co. — El marketplace de kitesurf en Colombia.</p>
    </div>
  `;
}

function btn(label: string) {
  return `<a href="#" style="display:inline-block;background:#111827;color:#ffffff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;text-decoration:none;margin-top:8px">${label}</a>`;
}

const TEMPLATES = [
  {
    id: "order-paid-buyer",
    label: "Pago aprobado → Comprador",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">¡Tu compra fue confirmada! 🎉</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Juan</strong>, tu pago por <strong>Cometa Cabrinha Moto 12m 2023</strong> fue aprobado exitosamente.
        El vendedor ya fue notificado y pronto recibirás tu equipo.
      </p>
      ${btn("Ver mi compra")}
    `),
  },
  {
    id: "order-paid-seller",
    label: "Pago aprobado → Vendedor",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">¡Tienes una venta! 🏄</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Carlos</strong>, <strong>Juan Pérez</strong> compró tu anuncio <strong>Cometa Cabrinha Moto 12m 2023</strong>.
        Coordina el envío lo antes posible y sube el comprobante desde tu panel de ventas.
      </p>
      ${btn("Ver mi venta")}
    `),
  },
  {
    id: "order-shipped-buyer",
    label: "Equipo enviado → Comprador",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">¡Tu equipo está en camino! 📦</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Juan</strong>, el vendedor ya envió <strong>Cometa Cabrinha Moto 12m 2023</strong>.
        Cuando lo recibas, recuerda confirmar la entrega en tu panel de compras.
      </p>
      ${btn("Ver mi compra")}
    `),
  },
  {
    id: "order-delivered-seller",
    label: "Entrega confirmada → Vendedor",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">El comprador confirmó la entrega ✅</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Carlos</strong>, el comprador confirmó que recibió <strong>Cometa Cabrinha Moto 12m 2023</strong>.
        La venta está completada.
      </p>
      ${btn("Ver mi venta")}
    `),
  },
  {
    id: "order-cancelled-buyer",
    label: "Orden cancelada → Comprador",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Tu orden fue cancelada</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Juan</strong>, la orden de <strong>Cometa Cabrinha Moto 12m 2023</strong> fue cancelada.
        Si tienes alguna duda, contáctanos.
      </p>
      ${btn("Ver detalle")}
    `),
  },
  {
    id: "order-cancelled-seller",
    label: "Orden cancelada → Vendedor",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">La orden fue cancelada</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Carlos</strong>, la orden de <strong>Cometa Cabrinha Moto 12m 2023</strong> fue cancelada.
        Tu anuncio vuelve a estar activo en el marketplace.
      </p>
      ${btn("Ver detalle")}
    `),
  },
  {
    id: "new-listing-admin",
    label: "Nuevo anuncio → Admin",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Nuevo anuncio publicado</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        <strong>Carlos Rodríguez</strong> publicó el anuncio <strong>Cometa Cabrinha Moto 12m 2023</strong>.
      </p>
      ${btn("Ver anuncio")}&nbsp;&nbsp;${btn("Panel admin")}
    `),
  },
  {
    id: "listing-status-seller",
    label: "Estado de anuncio cambiado → Vendedor",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Estado de tu anuncio actualizado</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola <strong>Carlos</strong>, tu anuncio <strong>Cometa Cabrinha Moto 12m 2023</strong> fue <strong>removido</strong> por el equipo de Quiver Co.
        Si tienes alguna pregunta, contáctanos.
      </p>
      ${btn("Ver anuncio")}
    `),
  },
  {
    id: "password-reset",
    label: "Recuperación de contraseña",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Recupera tu contraseña</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 24px">
        Hola <strong>Juan</strong>, recibimos una solicitud para restablecer la contraseña de tu cuenta.
        Si no fuiste tú, puedes ignorar este correo.
      </p>
      ${btn("Restablecer contraseña")}
      <p style="color:#9CA3AF;font-size:13px;margin:24px 0 0">
        Este enlace vence en <strong>1 hora</strong>.
      </p>
    `),
  },
];

export default async function EmailPreviewPage() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) redirect("/");

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Preview de emails</h1>
        <p className="text-sm text-[#6B7280] mb-8">Así se ven los correos que reciben compradores, vendedores y admins.</p>

        <div className="space-y-10">
          {TEMPLATES.map((t) => (
            <div key={t.id}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{t.label}</span>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                <iframe
                  srcDoc={t.html}
                  className="w-full"
                  style={{ height: 320, border: "none" }}
                  title={t.label}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

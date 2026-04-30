import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "Quiver Co. <noreply@quiverkite.com>";

const BASE_URL = "https://www.quiverkite.com";

async function sendEmail(
  payload: Parameters<NonNullable<typeof resend>["emails"]["send"]>[0],
) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is missing. Skipping email send.");
    return;
  }

  await resend.emails.send(payload);
}

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

function btn(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#111827;color:#ffffff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;text-decoration:none;margin-top:8px">${label}</a>`;
}

/* ─── Contraseña ─── */

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: "Recupera tu contraseña — Quiver Co.",
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Recupera tu contraseña</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 24px">
        Hola ${name}, recibimos una solicitud para restablecer la contraseña de tu cuenta.
        Si no fuiste tú, puedes ignorar este correo.
      </p>
      ${btn(resetUrl, "Restablecer contraseña")}
      <p style="color:#9CA3AF;font-size:13px;margin:24px 0 0">
        Este enlace vence en <strong>1 hora</strong>.
      </p>
    `),
  });
}

/* ─── Órdenes — Comprador ─── */

export async function sendOrderPaidBuyer(to: string, buyerName: string, listingTitle: string, orderId: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: `Compra confirmada: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">¡Tu compra fue confirmada! 🎉</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${buyerName}, tu pago por <strong>${listingTitle}</strong> fue aprobado exitosamente.
        El vendedor ya fue notificado y pronto recibirás tu equipo.
      </p>
      ${btn(`${BASE_URL}/cuenta/compras/${orderId}`, "Ver mi compra")}
    `),
  });
}

export async function sendOrderShippedBuyer(to: string, buyerName: string, listingTitle: string, orderId: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: `Tu equipo está en camino: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">¡Tu equipo está en camino! 📦</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${buyerName}, el vendedor ya envió <strong>${listingTitle}</strong>.
        Cuando lo recibas, recuerda confirmar la entrega en tu panel de compras.
      </p>
      ${btn(`${BASE_URL}/cuenta/compras/${orderId}`, "Ver mi compra")}
    `),
  });
}

export async function sendOrderCancelledBuyer(to: string, buyerName: string, listingTitle: string, orderId: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: `Orden cancelada: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Tu orden fue cancelada</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${buyerName}, la orden de <strong>${listingTitle}</strong> fue cancelada.
        Si tienes alguna duda, contáctanos.
      </p>
      ${btn(`${BASE_URL}/cuenta/compras/${orderId}`, "Ver detalle")}
    `),
  });
}

/* ─── Órdenes — Vendedor ─── */

export async function sendOrderPaidSeller(to: string, sellerName: string, listingTitle: string, orderId: string, buyerName: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: `¡Vendiste un equipo! ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">¡Tienes una venta! 🏄</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${sellerName}, <strong>${buyerName}</strong> compró tu anuncio <strong>${listingTitle}</strong>.
        Coordina el envío lo antes posible y sube el comprobante desde tu panel de ventas.
      </p>
      ${btn(`${BASE_URL}/cuenta/ventas/${orderId}`, "Ver mi venta")}
    `),
  });
}

export async function sendOrderDeliveredSeller(to: string, sellerName: string, listingTitle: string, orderId: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: `Entrega confirmada: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">El comprador confirmó la entrega ✅</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${sellerName}, el comprador confirmó que recibió <strong>${listingTitle}</strong>.
        La venta está completada.
      </p>
      ${btn(`${BASE_URL}/cuenta/ventas/${orderId}`, "Ver mi venta")}
    `),
  });
}

export async function sendOrderCancelledSeller(to: string, sellerName: string, listingTitle: string, orderId: string) {
  await sendEmail({
    from: FROM,
    to,
    subject: `Orden cancelada: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">La orden fue cancelada</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${sellerName}, la orden de <strong>${listingTitle}</strong> fue cancelada.
        Tu anuncio vuelve a estar activo en el marketplace.
      </p>
      ${btn(`${BASE_URL}/cuenta/ventas/${orderId}`, "Ver detalle")}
    `),
  });
}

/* ─── Anuncios — Vendedor ─── */

const LISTING_STATUS_LABELS: Record<string, string> = {
  ACTIVE:  "activado",
  PAUSED:  "pausado",
  REMOVED: "removido",
  SOLD:    "marcado como vendido",
};

export async function sendListingStatusSeller(to: string, sellerName: string, listingTitle: string, listingId: string, newStatus: string) {
  const statusLabel = LISTING_STATUS_LABELS[newStatus] ?? newStatus.toLowerCase();
  await sendEmail({
    from: FROM,
    to,
    subject: `Tu anuncio fue ${statusLabel}: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Estado de tu anuncio actualizado</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        Hola ${sellerName}, tu anuncio <strong>${listingTitle}</strong> fue <strong>${statusLabel}</strong> por el equipo de Quiver Co.
        Si tienes alguna pregunta, contáctanos.
      </p>
      ${btn(`${BASE_URL}/equipo/${listingId}`, "Ver anuncio")}
    `),
  });
}

/* ─── Anuncios — Admin ─── */

export async function sendNewListingAdmin(adminEmails: string[], sellerName: string, listingTitle: string, listingId: string) {
  await sendEmail({
    from: FROM,
    to: adminEmails,
    subject: `Nuevo anuncio publicado: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Nuevo anuncio publicado</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        <strong>${sellerName}</strong> publicó el anuncio <strong>${listingTitle}</strong>.
      </p>
      ${btn(`${BASE_URL}/equipo/${listingId}`, "Ver anuncio")}
      &nbsp;
      ${btn(`${BASE_URL}/admin/anuncios`, "Panel admin")}
    `),
  });
}

export async function sendOrderUpdateAdmin(adminEmails: string[], event: string, listingTitle: string, orderId: string, buyerName: string, sellerName: string) {
  await sendEmail({
    from: FROM,
    to: adminEmails,
    subject: `Orden ${event}: ${listingTitle}`,
    html: layout(`
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Actualización de orden</h1>
      <p style="color:#6B7280;font-size:15px;margin:0 0 16px">
        La orden de <strong>${listingTitle}</strong> entre <strong>${buyerName}</strong> (comprador) y <strong>${sellerName}</strong> (vendedor)
        cambió a estado <strong>${event}</strong>.
      </p>
      ${btn(`${BASE_URL}/admin/ordenes/${orderId}`, "Ver orden")}
    `),
  });
}

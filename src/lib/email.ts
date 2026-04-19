import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Quiver Co. <noreply@quiverkite.com>";

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Recupera tu contraseña — Quiver Co.",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff">
        <div style="margin-bottom:24px">
          <span style="font-size:20px;font-weight:700;color:#111827">Quiver<span style="color:#3B82F6"> Co.</span></span>
        </div>
        <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px">Recupera tu contraseña</h1>
        <p style="color:#6B7280;font-size:15px;margin:0 0 24px">
          Hola ${name}, recibimos una solicitud para restablecer la contraseña de tu cuenta.
          Si no fuiste tú, puedes ignorar este correo.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#111827;color:#ffffff;font-weight:600;font-size:15px;
                  padding:14px 28px;border-radius:12px;text-decoration:none">
          Restablecer contraseña
        </a>
        <p style="color:#9CA3AF;font-size:13px;margin:24px 0 0">
          Este enlace vence en <strong>1 hora</strong>. Si ya restableciste tu contraseña, ignora este mensaje.
        </p>
        <hr style="border:none;border-top:1px solid #F3F4F6;margin:32px 0" />
        <p style="color:#9CA3AF;font-size:12px;margin:0">
          © 2026 Quiver Co. — El marketplace de kitesurf en Colombia.
        </p>
      </div>
    `,
  });
}

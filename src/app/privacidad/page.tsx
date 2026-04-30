export const metadata = { title: "Política de privacidad | Quiver Co." };

const sections = [
  {
    title: "1. Responsable del tratamiento",
    body: `Quiver Co. es responsable del tratamiento de los datos personales recopilados a través de esta plataforma, de conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia.`,
  },
  {
    title: "2. Datos que recopilamos",
    body: `Recopilamos los siguientes datos cuando usas Quiver Co.:\n\n• Datos de registro: nombre, correo electrónico, imagen de perfil (si inicias sesión con Google).\n• Datos de perfil: teléfono, dirección de envío, ciudad, departamento y bio.\n• Datos de transacción: nombre completo, número de cédula, teléfono, dirección de envío y ciudad para cada compra.\n• Datos de uso: anuncios publicados, conversaciones, favoritos y calificaciones.\n• Datos técnicos y de medición: dirección IP, agente de usuario, URL visitadas, identificadores de navegador y parámetros de atribución publicitaria cuando aceptas cookies de marketing.`,
  },
  {
    title: "3. Finalidad del tratamiento",
    body: `Usamos tus datos para:\n\n• Crear y gestionar tu cuenta en la plataforma.\n• Procesar compras y coordinar envíos entre compradores y vendedores.\n• Mostrar tu perfil e historial a otros usuarios de la plataforma.\n• Enviarte notificaciones relacionadas con tus transacciones.\n• Mejorar la experiencia de la plataforma y prevenir fraudes.\n• Medir el rendimiento de nuestras campañas publicitarias en Meta cuando nos das tu consentimiento para cookies de marketing.`,
  },
  {
    title: "4. Compartición de datos",
    body: `Compartimos tus datos únicamente en los siguientes casos:\n\n• Con el vendedor: al confirmar una compra, el vendedor recibe tu nombre, teléfono y dirección de envío para coordinar el despacho.\n• Con el comprador: si eres vendedor, el comprador puede ver tu nombre y teléfono al confirmar el pago.\n• Con proveedores tecnológicos que operan la plataforma, como hosting, autenticación, correo transaccional y pagos.\n• Con Meta Platforms cuando aceptas cookies de marketing, solo para medición, atribución y optimización de campañas publicitarias.\n• Con autoridades: si la ley colombiana nos lo exige.\n\nNo vendemos ni cedemos tus datos a terceros con fines comerciales independientes.`,
  },
  {
    title: "5. Almacenamiento y seguridad",
    body: `Tus datos se almacenan en servidores seguros en la nube (Neon / Vercel). Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida o alteración.\n\nLas contraseñas nunca se almacenan en texto plano. El inicio de sesión con Google utiliza OAuth 2.0.`,
  },
  {
    title: "6. Tus derechos",
    body: `Como titular de tus datos, tienes derecho a:\n\n• Conocer, actualizar y rectificar tus datos personales.\n• Solicitar la eliminación de tus datos (derecho al olvido).\n• Revocar la autorización para el tratamiento.\n• Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).\n\nPara ejercer estos derechos, contáctanos por WhatsApp o al correo indicado en la sección de Contáctanos.`,
  },
  {
    title: "7. Cookies",
    body: `Usamos cookies y tecnologías similares en dos categorías:\n\n• Cookies necesarias: autenticación, seguridad, sesión y operación básica de la plataforma.\n• Cookies de marketing y medición: solo si las aceptas, activamos Meta Pixel y Conversions API para medir visitas, búsquedas, registros, contactos, favoritos, checkouts y compras asociadas a campañas de Facebook e Instagram.\n\nPuedes aceptar o rechazar estas cookies desde el banner de consentimiento y cambiar tu decisión más adelante desde el footer.`,
  },
  {
    title: "8. Cambios a esta política",
    body: `Podemos actualizar esta política en cualquier momento. Te notificaremos sobre cambios relevantes a través de la plataforma. La versión vigente siempre estará disponible en esta página.`,
  },
];

export default function PrivacidadPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Política de privacidad</h1>
          <p className="text-[#9CA3AF]">Última actualización: 29 de abril de 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#F3F4F6]">
          {sections.map(({ title, body }) => (
            <div key={title} className="px-6 md:px-8 py-6">
              <h2 className="font-bold text-[#111827] mb-3">{title}</h2>
              {body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-[#6B7280] leading-relaxed mb-3 last:mb-0 whitespace-pre-line"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

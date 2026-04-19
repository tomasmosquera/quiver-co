export const metadata = { title: "Términos y condiciones | Quiver Co." };

const sections = [
  {
    title: "1. Objeto y aceptación",
    body: `Quiver Co. es una plataforma de compraventa de equipos de deportes acuáticos usados entre particulares. Al registrarte y usar la plataforma, aceptas estos Términos y Condiciones en su totalidad.\n\nQuiver Co. actúa como intermediario entre compradores y vendedores, sin ser parte directa de la transacción de compraventa del equipo. Sin embargo, sí retenemos los fondos (Escrow) para garantizar la seguridad de ambas partes.`,
  },
  {
    title: "2. Registro y cuenta",
    body: `Para comprar o vender debes crear una cuenta con información real y actualizada. Eres responsable de la confidencialidad de tu contraseña y de todas las actividades realizadas desde tu cuenta.\n\nNos reservamos el derecho de suspender o eliminar cuentas que incumplan estos términos, publiquen información falsa o realicen conductas fraudulentas.`,
  },
  {
    title: "3. Publicación de anuncios",
    body: `El vendedor es responsable de la exactitud de la información publicada: fotos reales, descripción honesta del estado del equipo, precio y características. Queda prohibido publicar:\n\n• Equipos que no sean de tu propiedad.\n• Información falsa o engañosa sobre el estado o características del equipo.\n• Artículos ilegales o robados.\n\nQuiver Co. puede eliminar anuncios que incumplan estas condiciones sin previo aviso.`,
  },
  {
    title: "4. Proceso de compra y Escrow",
    body: `Al realizar una compra, el comprador transfiere el dinero a Quiver Co. (no al vendedor). Retenemos los fondos de forma segura hasta que el comprador confirme la recepción del equipo en las condiciones descritas.\n\nEl vendedor recibe el pago (menos la comisión del 5%) dentro de las 24 horas hábiles siguientes a la confirmación de entrega. Si el comprador no confirma dentro de los 15 días desde el aviso de envío, la entrega se confirma automáticamente.`,
  },
  {
    title: "5. Comisiones y tarifas",
    body: `Publicar anuncios en Quiver Co. es completamente gratuito. Cobramos una comisión del 5% sobre el precio de venta, descontada del pago al vendedor al completarse la transacción.\n\nEl costo del envío no está incluido en el precio del anuncio y es responsabilidad del comprador, acordado directamente con el vendedor.`,
  },
  {
    title: "6. Cancelaciones y devoluciones",
    body: `El comprador puede cancelar una orden mientras esté en estado "Validando pago". Una vez confirmado el pago, la cancelación debe gestionarse con nuestro equipo por WhatsApp.\n\nLas devoluciones aplican únicamente cuando el equipo recibido es materialmente diferente a lo descrito en el anuncio, o cuando el vendedor no realiza el envío. Ver Política de Disputas para más detalles.`,
  },
  {
    title: "7. Limitación de responsabilidad",
    body: `Quiver Co. no es responsable por el estado real del equipo comprado más allá del sistema de Escrow y mediación descrito. No garantizamos la calidad, seguridad o idoneidad de ningún equipo publicado.\n\nEn ningún caso nuestra responsabilidad total hacia un usuario superará el valor de la transacción involucrada.`,
  },
  {
    title: "8. Modificaciones",
    body: `Quiver Co. puede modificar estos Términos en cualquier momento. Te notificaremos sobre cambios significativos a través de la plataforma. El uso continuado de la plataforma tras la notificación implica la aceptación de los nuevos términos.`,
  },
  {
    title: "9. Ley aplicable",
    body: `Estos Términos se rigen por la legislación colombiana. Cualquier controversia será resuelta ante los tribunales competentes de la ciudad de Bogotá, Colombia.`,
  },
];

export default function TerminosPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      <div className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Términos y condiciones</h1>
          <p className="text-[#9CA3AF]">Última actualización: abril 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl divide-y divide-[#F3F4F6]">
          {sections.map(({ title, body }) => (
            <div key={title} className="px-6 md:px-8 py-6">
              <h2 className="font-bold text-[#111827] mb-3">{title}</h2>
              {body.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-[#6B7280] leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
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

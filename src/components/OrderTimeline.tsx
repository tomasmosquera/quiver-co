"use client";

interface Props {
  orderId: string;
  status: string;
  role: "buyer" | "seller";
  shippedAt?: string | null;
  deliveredAt?: string | null;
  deliveryDeadline?: string | null;
  listingTitle: string;
}

interface Step {
  label: string;
  done: boolean;
  date?: string | null;
}

function fmtDate(d?: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrderTimeline({
  status,
  role,
  shippedAt,
  deliveredAt,
  deliveryDeadline,
}: Props) {
  const isPaid      = ["PAID", "SHIPPED", "DELIVERED"].includes(status);
  const isShipped   = ["SHIPPED", "DELIVERED"].includes(status);
  const isDelivered = status === "DELIVERED";

  const steps: Step[] = [
    { label: "Transferencia enviada", done: true },
    { label: "Pago validado",         done: isPaid },
    { label: "Producto enviado",      done: isShipped,   date: fmtDate(shippedAt) },
    { label: "Entregado",             done: isDelivered, date: fmtDate(deliveredAt) },
  ];

  return (
    <div className="mt-4 space-y-4">
      {/* Timeline steps */}
      <div className="flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            {/* connector + circle row */}
            <div className="flex items-center w-full">
              {/* left line */}
              <div className={`flex-1 h-0.5 ${i === 0 ? "invisible" : step.done ? "bg-[#3B82F6]" : "bg-[#E5E7EB]"}`} />
              {/* circle */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
                step.done
                  ? "bg-[#3B82F6] border-[#3B82F6]"
                  : "bg-white border-[#E5E7EB]"
              }`}>
                {step.done && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {/* right line */}
              <div className={`flex-1 h-0.5 ${i === steps.length - 1 ? "invisible" : steps[i + 1]?.done ? "bg-[#3B82F6]" : "bg-[#E5E7EB]"}`} />
            </div>
            {/* label */}
            <div className="mt-2 text-center px-1">
              <p className={`text-xs font-medium leading-tight ${step.done ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                {step.label}
              </p>
              {step.date && (
                <p className="text-[10px] text-[#6B7280] mt-0.5">{step.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status message */}
      {status === "PENDING" && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
          Estamos validando tu transferencia. Te notificaremos pronto.
        </div>
      )}

      {status === "PAID" && role === "buyer" && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800">
          El pago fue confirmado. El vendedor está preparando el envío.
        </div>
      )}

      {status === "PAID" && role === "seller" && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800">
          El pago fue confirmado. Debes enviar el equipo al comprador.
        </div>
      )}

      {status === "SHIPPED" && role === "buyer" && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 space-y-1">
          <p className="font-medium">El vendedor envió el equipo. Confirma cuando lo recibas.</p>
          {deliveryDeadline && (
            <p className="text-xs text-blue-600">
              Plazo de entrega: {fmtDate(deliveryDeadline)}. Si no confirmas antes de esa fecha, se confirmará automáticamente.
            </p>
          )}
        </div>
      )}

      {status === "SHIPPED" && role === "seller" && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
          Enviaste el equipo. Esperando confirmación del comprador.
        </div>
      )}

      {status === "DELIVERED" && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-800 font-medium">
          Entrega confirmada. ¡Gracias por usar Quiver!
        </div>
      )}

      {status === "CANCELLED" && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-800">
          Esta orden fue cancelada.
        </div>
      )}
    </div>
  );
}

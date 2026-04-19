import { unstable_cache } from "next/cache";

export interface TRMResult {
  rate: number;      // COP per 1 USD
  source: string;
  updatedAt: string;
}

async function fetchTRM(): Promise<TRMResult> {
  // Fuente 1: TRM oficial de Colombia — Superfinanciera vía datos.gov.co
  try {
    const res = await fetch(
      "https://www.datos.gov.co/resource/mcec-87by.json?$order=vigenciadesde DESC&$limit=1",
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const valor = parseFloat(data?.[0]?.valor);
    if (valor && valor > 1000) {
      return {
        rate: Math.round(valor),
        source: "Superfinanciera Colombia",
        updatedAt: data[0].vigenciadesde ?? new Date().toISOString(),
      };
    }
  } catch { /* fallback */ }

  // Fuente 2: ExchangeRate-API (fallback)
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const rate = data?.rates?.COP as number;
    if (rate) return { rate: Math.round(rate), source: "ExchangeRate-API", updatedAt: new Date().toISOString() };
  } catch { /* fallback */ }

  // Fallback fijo
  return { rate: 4200, source: "fallback", updatedAt: new Date().toISOString() };
}

export const getTRM = unstable_cache(fetchTRM, ["trm-usd-cop"], { revalidate: 3600 });

/** Convierte un precio a COP. Si ya es COP lo retorna tal cual. */
export function toCOP(price: number, currency: string, trm: number): number {
  if (currency === "USD") return Math.round(price * trm);
  return price;
}

/** Formatea precio con su moneda */
export function formatPrice(price: number, currency: string): string {
  if (currency === "USD") return `USD $${price.toLocaleString("en-US")}`;
  return `$${price.toLocaleString("es-CO")} COP`;
}

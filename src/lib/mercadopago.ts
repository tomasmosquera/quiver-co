import MercadoPagoConfig, { Payment, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

interface CreatePreferenceParams {
  reference: string;
  title: string;
  amount: number;
  siteUrl: string;
}

export async function createPreference({
  reference,
  title,
  amount,
  siteUrl,
}: CreatePreferenceParams) {
  const preference = await new Preference(client).create({
    body: {
      items: [
        {
          id: reference,
          title,
          quantity: 1,
          currency_id: "COP",
          unit_price: amount,
        },
      ],
      external_reference: reference,
      back_urls: {
        success: `${siteUrl}/cuenta/compras`,
        pending: `${siteUrl}/cuenta/compras`,
        failure: `${siteUrl}/cuenta/compras`,
      },
      // auto_return exige que back_urls.success sea una URL https alcanzable
      // publicamente; en local (http://localhost) Mercado Pago la rechaza.
      ...(siteUrl.startsWith("https://") ? { auto_return: "approved" as const } : {}),
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
    },
  });

  const initPoint = preference.sandbox_init_point ?? preference.init_point;
  if (!initPoint) throw new Error("Mercado Pago no devolvio un init_point");

  return initPoint;
}

export async function getPayment(paymentId: string) {
  return new Payment(client).get({ id: paymentId });
}

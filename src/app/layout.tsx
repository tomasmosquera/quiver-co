import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import MetaConsentProvider from "@/components/MetaConsentProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const metaMarketingEnabled = Boolean(metaPixelId || process.env.META_PIXEL_ID);

export const metadata: Metadata = {
  title: "Quiver Co. — Marketplace de Deportes de Viento y Agua en Colombia",
  description:
    "Compra y vende equipos de kitesurf, wingfoil, windsurf, wakeboard, foil y más en Colombia. El marketplace más serio para deportes acuáticos.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Quiver Co. — Marketplace de Kitesurf y Deportes de Viento",
    description:
      "Compra y vende equipos de kitesurf, wingfoil, windsurf y más en Colombia.",
    url: "https://www.quiverkite.com",
    siteName: "Quiver Co.",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiver Co. — Marketplace de Kitesurf en Colombia",
    description:
      "Compra y vende equipos de kitesurf, wingfoil, windsurf y más en Colombia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#FAFAF8] text-[#111827] max-w-[100vw] overflow-x-hidden">
        <SessionProvider>
          <MetaConsentProvider
            marketingEnabled={metaMarketingEnabled}
            pixelId={metaPixelId}
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </MetaConsentProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}

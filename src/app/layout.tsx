import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    images: [
      {
        url: "https://www.quiverkite.com/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Quiver Co. — Marketplace de Kitesurf en Colombia",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiver Co. — Marketplace de Kitesurf en Colombia",
    description:
      "Compra y vende equipos de kitesurf, wingfoil, windsurf y más en Colombia.",
    images: ["https://www.quiverkite.com/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#FAFAF8] text-[#111827] max-w-[100vw] overflow-x-hidden">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

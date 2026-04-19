"use client";

import Link from "next/link";
import { Wind, Share2, MessageCircle, Check } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  function copyUrl() {
    navigator.clipboard.writeText("https://quiverkite.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <footer className="bg-[#111827] text-[#D1D5DB] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#374151] rounded-lg flex items-center justify-center">
                <Wind className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <span className="font-bold text-white text-lg">
                Quiver<span className="text-[#3B82F6]"> Co.</span>
              </span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              El mejor marketplace especializado de deportes acuáticos en Colombia.
            </p>
            <div className="flex gap-3">
              <button
                onClick={copyUrl}
                title={copied ? "¡Enlace copiado!" : "Copiar enlace"}
                className="w-9 h-9 bg-[#374151] hover:bg-[#3B82F6] rounded-lg flex items-center justify-center transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
              </button>
              <a
                href="https://wa.me/573164780276"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#374151] hover:bg-[#3B82F6] rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Comprar equipos",       href: "/equipos" },
                { label: "Vender mi equipo",       href: "/vender" },
                { label: "Cómo funciona",          href: "/como-funciona" },
                { label: "Tarifas y comisiones",   href: "/tarifas" },
                { label: "Protección al comprador",href: "/proteccion-comprador" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Comunidad
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Spots en Colombia", href: "/spots" },
                { label: "Foro",              href: "/comunidad" },
                { label: "Eventos y clínicas",href: "#" },
                { label: "Guías",             href: "/guias" },
                { label: "Blog",              href: "/comunidad" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Soporte
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Centro de ayuda",          href: "/ayuda" },
                { label: "Política de disputas",      href: "/disputas" },
                { label: "Términos y condiciones",    href: "/terminos" },
                { label: "Privacidad",                href: "/privacidad" },
                { label: "Contáctanos",               href: "/contacto" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#374151] mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            © 2026 Quiver Co. Todos los derechos reservados. Hecho en Colombia
          </p>
          <img
            src="/marca-pais-colombia.png"
            alt="Marca País Colombia"
            className="h-10 opacity-80"
          />
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Wind, Share2, MessageCircle, PlayCircle } from "lucide-react";

export default function Footer() {
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
              {[Share2, MessageCircle, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-[#374151] hover:bg-[#3B82F6] rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
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
              {["Centro de ayuda", "Política de disputas", "Términos y condiciones", "Privacidad", "Contáctanos"].map(
                (item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[#9CA3AF] hover:text-white transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#374151] mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            © 2026 Quiver Co. Todos los derechos reservados. Hecho en Colombia 🇨🇴
          </p>
          <div className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Wompi_logo.svg/200px-Wompi_logo.svg.png"
              alt="Wompi"
              className="h-5 opacity-50"
            />
            <span className="text-xs text-[#6B7280]">Pagos seguros con Wompi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

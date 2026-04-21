import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quiver Co. — Marketplace de Kitesurf en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#111827",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow azul fondo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 400,
            background: "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo container */}
        <div
          style={{
            width: 120,
            height: 120,
            background: "#1F2937",
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            position: "relative",
          }}
        >
          {/* Ícono wind SVG */}
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
          </svg>
          {/* Punto azul */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#3B82F6",
            }}
          />
        </div>

        {/* Nombre */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-1px",
            marginBottom: 16,
          }}
        >
          Quiver Co.
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#9CA3AF",
            marginBottom: 28,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          Marketplace de Kitesurf y Deportes de Viento · Colombia
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: "#3B82F6",
          }}
        >
          quiverkite.com
        </div>
      </div>
    ),
    { ...size }
  );
}

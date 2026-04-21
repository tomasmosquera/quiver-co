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
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Logo container */}
        <div
          style={{
            width: 500,
            height: 500,
            background: "#111827",
            borderRadius: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <svg width="320" height="320" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
          </svg>
          {/* Punto azul */}
          <div
            style={{
              position: "absolute",
              bottom: 44,
              right: 44,
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#3B82F6",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Wind, ChevronLeft, CheckCircle } from "lucide-react";
import { getSpotBySlug, REGIONS } from "@/lib/spots";

const DISCIPLINE_ICONS: Record<string, string> = {
  Kitesurf: "🪁",
  Wingfoil: "🪽",
  Windsurf: "⛵",
  Wakeboard: "🚤",
  Paddle: "🧘",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  "Principiante":     "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Intermedio":       "bg-amber-50 text-amber-700 border-amber-200",
  "Avanzado":         "bg-red-50 text-red-700 border-red-200",
  "Todos los niveles":"bg-blue-50 text-blue-700 border-blue-200",
};

export default async function SpotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const spot = getSpotBySlug(slug);
  if (!spot) notFound();

  // Otros spots en la misma región
  const region = REGIONS.find(r => r.slug === spot.regionSlug);
  const nearby = region?.spots.filter(s => s.slug !== spot.slug) ?? [];

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6 flex-wrap">
          <Link href="/spots" className="hover:text-[#111827] flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Spots
          </Link>
          <span>/</span>
          <span className="text-[#111827] font-medium">{spot.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna principal ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[spot.difficulty]}`}>
                  {spot.difficulty}
                </span>
                {spot.disciplines.map(d => (
                  <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB]">
                    {DISCIPLINE_ICONS[d] ?? ""} {d}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-[#111827] leading-tight">{spot.name}</h1>

              <div className="flex items-center gap-1.5 mt-2 text-sm text-[#6B7280]">
                <MapPin className="w-4 h-4 shrink-0" />
                {spot.region}
              </div>

              {/* Wind stats */}
              <div className="grid grid-cols-2 gap-4 mt-5 p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Temporada</p>
                  <p className="font-bold text-[#111827] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    {spot.windSeason}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Fuerza del viento</p>
                  <p className="font-bold text-[#111827] flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-[#3B82F6]" />
                    {spot.windStrength}
                  </p>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="font-bold text-[#111827] mb-3">Sobre este spot</h2>
              <p className="text-sm text-[#374151] leading-relaxed">{spot.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="font-bold text-[#111827] mb-4">Por qué ir</h2>
              <ul className="space-y-3">
                {spot.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                    <CheckCircle className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <h2 className="font-bold text-[#111827] mb-4">Consejos útiles</h2>
              <ul className="space-y-3">
                {spot.tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Columna lateral ── */}
          <div className="space-y-4">

            {/* Mapa placeholder */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <div className="aspect-square bg-[#F3F4F6] flex flex-col items-center justify-center gap-2 text-[#9CA3AF]">
                <MapPin className="w-8 h-8" />
                <p className="text-xs font-medium">
                  {spot.coords[0].toFixed(4)}, {spot.coords[1].toFixed(4)}
                </p>
                <a
                  href={`https://maps.google.com/?q=${spot.coords[0]},${spot.coords[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#3B82F6] hover:underline mt-1"
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </div>

            {/* Equipo en venta */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
              <h3 className="font-semibold text-[#111827] mb-1 text-sm">Equipo para este spot</h3>
              <p className="text-xs text-[#6B7280] mb-3">
                Encuentra equipos de {spot.disciplines[0]} de segunda mano.
              </p>
              <Link
                href={`/equipos?disciplina=${spot.disciplines[0].toUpperCase()}`}
                className="block text-center py-2.5 bg-[#111827] hover:bg-[#374151] text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Ver equipos de {spot.disciplines[0]}
              </Link>
            </div>

            {/* Otros spots de la región */}
            {nearby.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111827] mb-3 text-sm">
                  Otros spots en {region?.name}
                </h3>
                <div className="space-y-2">
                  {nearby.map(s => (
                    <Link
                      key={s.slug}
                      href={`/spots/${s.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F9FAFB] transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#111827] group-hover:text-[#3B82F6] transition-colors">
                          {s.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{s.windSeason}</p>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#3B82F6] rotate-180 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ver todos */}
            <Link
              href="/spots"
              className="block text-center py-2.5 border border-[#E5E7EB] hover:border-[#111827] text-[#374151] hover:text-[#111827] font-medium rounded-xl transition-all text-sm"
            >
              ← Ver todos los spots
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { getAllSpotsFlat } = await import("@/lib/spots");
  return getAllSpotsFlat().map(s => ({ slug: s.slug }));
}

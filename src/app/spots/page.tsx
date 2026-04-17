import Link from "next/link";
import { MapPin, Wind, ChevronRight } from "lucide-react";
import { REGIONS } from "@/lib/spots";

const DISCIPLINE_ICONS: Record<string, string> = {
  Kitesurf: "🪁",
  Wingfoil: "🪽",
  Windsurf: "⛵",
  Wakeboard: "🚤",
  Paddle: "🧘",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  "Principiante":     "bg-emerald-50 text-emerald-700",
  "Intermedio":       "bg-amber-50 text-amber-700",
  "Avanzado":         "bg-red-50 text-red-700",
  "Todos los niveles":"bg-blue-50 text-blue-700",
};

const REGION_COLORS: string[] = [
  "from-amber-500 to-orange-600",
  "from-sky-500 to-blue-600",
  "from-teal-500 to-cyan-600",
  "from-emerald-500 to-green-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
];

export default function SpotsPage() {
  const totalSpots = REGIONS.reduce((acc, r) => acc + r.spots.length, 0);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <section className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1F2937] border border-[#374151] text-[#D1D5DB] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
              {totalSpots} spots en todo Colombia
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Spots en <span className="text-[#3B82F6]">Colombia</span>
            </h1>
            <p className="mt-4 text-lg text-[#9CA3AF] max-w-xl leading-relaxed">
              Desde los vientos alisios de La Guajira hasta el viento térmico de Lago Calima.
              Encuentra el spot perfecto para tu disciplina y nivel.
            </p>

            {/* Quick jump */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="text-xs text-[#6B7280] my-auto mr-1">Ir a:</span>
              {REGIONS.map((r) => (
                <a
                  key={r.slug}
                  href={`#${r.slug}`}
                  className="px-3 py-1.5 bg-[#1F2937] border border-[#374151] hover:border-[#3B82F6] text-[#D1D5DB] hover:text-white text-xs rounded-full transition-all"
                >
                  {r.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {REGIONS.map((region, ri) => (
          <section key={region.slug} id={region.slug}>

            {/* Region header */}
            <div className="flex items-start justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${REGION_COLORS[ri % REGION_COLORS.length]} flex items-center justify-center shrink-0`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#111827]">{region.name}</h2>
                  <p className="text-sm text-[#6B7280] mt-0.5 max-w-xl">{region.description}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#9CA3AF] shrink-0 mt-1">
                {region.spots.length} spot{region.spots.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Spot cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {region.spots.map((spot) => (
                <Link
                  key={spot.slug}
                  href={`/spots/${spot.slug}`}
                  className="group bg-white border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#111827] group-hover:text-[#3B82F6] transition-colors leading-snug">
                        {spot.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#9CA3AF]">
                        <MapPin className="w-3 h-3" />
                        {spot.region}
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${DIFFICULTY_COLORS[spot.difficulty]}`}>
                      {spot.difficulty}
                    </span>
                  </div>

                  {/* Wind info */}
                  <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>{spot.windStrength}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{spot.windSeason}</span>
                    </div>
                  </div>

                  {/* Disciplines */}
                  <div className="flex flex-wrap gap-1.5">
                    {spot.disciplines.map((d) => (
                      <span
                        key={d}
                        className="flex items-center gap-1 text-xs px-2 py-0.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-[#374151]"
                      >
                        {DISCIPLINE_ICONS[d] ?? ""} {d}
                      </span>
                    ))}
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                    {spot.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs font-semibold text-[#3B82F6] mt-auto group-hover:gap-2 transition-all">
                    Ver detalles <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="bg-[#111827] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white">¿Conoces un spot que no está aquí?</h2>
          <p className="text-[#9CA3AF] mt-2 text-sm">
            La comunidad Quiver Co. crece con el aporte de todos. Escríbenos para agregar tu spot favorito.
          </p>
          <a
            href="mailto:hola@quivercokite.com"
            className="mt-6 inline-block px-6 py-3 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Sugerir un spot
          </a>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { GUIDES, CATEGORIES } from "@/lib/guides";

const CATEGORY_COLORS: Record<string, string> = {
  cometas:        "bg-sky-50 border-sky-100 text-sky-700",
  tablas:         "bg-emerald-50 border-emerald-100 text-emerald-700",
  equipamiento:   "bg-amber-50 border-amber-100 text-amber-700",
  "primeros-pasos": "bg-violet-50 border-violet-100 text-violet-700",
};

const CATEGORY_BADGE: Record<string, string> = {
  cometas:        "bg-sky-100 text-sky-700",
  tablas:         "bg-emerald-100 text-emerald-700",
  equipamiento:   "bg-amber-100 text-amber-700",
  "primeros-pasos": "bg-violet-100 text-violet-700",
};

export default function GuiasPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen">

      {/* Hero */}
      <section className="bg-[#111827] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1F2937] border border-[#374151] text-[#D1D5DB] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <BookOpen className="w-3.5 h-3.5 text-[#3B82F6]" />
              {GUIDES.length} guías para kitesurfers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Guías de <span className="text-[#3B82F6]">kitesurf</span>
            </h1>
            <p className="mt-4 text-lg text-[#9CA3AF] max-w-xl leading-relaxed">
              Aprende a elegir tu equipo, a entender las condiciones y a progresar más rápido.
              Todo lo que necesitas saber, en español y para Colombia.
            </p>

            {/* Category pills */}
            <div className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1F2937] border border-[#374151] hover:border-[#3B82F6] text-[#D1D5DB] hover:text-white text-xs rounded-full transition-all"
                >
                  {cat.icon} {cat.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories + Guides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {CATEGORIES.map((cat) => {
          const guides = GUIDES.filter(g => g.categorySlug === cat.slug);
          return (
            <section key={cat.slug} id={cat.slug}>

              {/* Category header */}
              <div className={`flex items-center gap-4 border rounded-2xl px-5 py-4 mb-6 ${CATEGORY_COLORS[cat.slug]}`}>
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">{cat.name}</h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">{cat.description}</p>
                </div>
              </div>

              {/* Guide cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guias/${guide.slug}`}
                    className="group bg-white border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${CATEGORY_BADGE[cat.slug]}`}>
                        {cat.icon} {cat.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#9CA3AF] shrink-0">
                        <Clock className="w-3 h-3" /> {guide.readTime} min
                      </span>
                    </div>

                    <h3 className="font-bold text-[#111827] group-hover:text-[#3B82F6] transition-colors leading-snug text-base">
                      {guide.title}
                    </h3>

                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 flex-1">
                      {guide.summary}
                    </p>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#3B82F6] mt-auto group-hover:gap-2 transition-all">
                      Leer guía <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-[#111827] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white">¿Listo para encontrar tu equipo?</h2>
          <p className="text-[#9CA3AF] mt-2 text-sm">
            Con todo lo que aprendiste, encuentra el equipo perfecto en el marketplace de Quiver Co.
          </p>
          <Link
            href="/equipos"
            className="mt-6 inline-block px-6 py-3 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Explorar equipos →
          </Link>
        </div>
      </section>
    </div>
  );
}

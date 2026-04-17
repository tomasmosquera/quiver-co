import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, BookOpen, Lightbulb } from "lucide-react";
import { getGuideBySlug, getRelatedGuides, GUIDES } from "@/lib/guides";

const CATEGORY_BADGE: Record<string, string> = {
  cometas:          "bg-sky-50 text-sky-700",
  tablas:           "bg-emerald-50 text-emerald-700",
  equipamiento:     "bg-amber-50 text-amber-700",
  "primeros-pasos": "bg-violet-50 text-violet-700",
};

const CATEGORY_ICONS: Record<string, string> = {
  cometas: "🪁", tablas: "🏄", equipamiento: "🦺", "primeros-pasos": "🌊",
};

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const related = getRelatedGuides(guide);

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6 flex-wrap">
          <Link href="/guias" className="hover:text-[#111827] flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Guías
          </Link>
          <span>/</span>
          <span className="text-[#111827] font-medium line-clamp-1">{guide.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Contenido principal ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Header */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_BADGE[guide.categorySlug]}`}>
                  {CATEGORY_ICONS[guide.categorySlug]} {guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#9CA3AF]">
                  <Clock className="w-3.5 h-3.5" /> {guide.readTime} min de lectura
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-snug">
                {guide.title}
              </h1>

              <p className="mt-4 text-[#6B7280] leading-relaxed border-l-4 border-[#3B82F6] pl-4">
                {guide.intro}
              </p>
            </div>

            {/* Sections */}
            {guide.sections.map((section, i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  {section.heading}
                </h2>

                {section.body && (
                  <p className="text-sm text-[#374151] leading-relaxed">{section.body}</p>
                )}

                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-[#374151]">
                        <ChevronRight className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.table && (
                  <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                          {section.table.headers.map((h, j) => (
                            <th key={j} className="px-4 py-3 text-left font-semibold text-[#374151] text-xs whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#FAFAFA]">
                            {row.map((cell, ci) => (
                              <td key={ci} className={`px-4 py-3 text-[#374151] ${ci === 0 ? "font-semibold" : ""}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section.tip && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">{section.tip}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {guide.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-[#111827] rounded-2xl p-6 text-center">
              <BookOpen className="w-8 h-8 text-[#3B82F6] mx-auto mb-3" />
              <h3 className="font-bold text-white mb-1">¿Listo para comprar?</h3>
              <p className="text-[#9CA3AF] text-sm mb-4">
                Encuentra el equipo que buscas en el marketplace de Quiver Co.
              </p>
              <Link
                href="/equipos"
                className="inline-block px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Ver equipos en venta →
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">

            {/* Table of contents */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sticky top-24">
              <h3 className="font-semibold text-[#111827] mb-3 text-sm">Contenido</h3>
              <ol className="space-y-2">
                {guide.sections.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280] hover:text-[#3B82F6] transition-colors cursor-pointer">
                    <span className="font-bold text-[#D1D5DB] shrink-0">{i + 1}.</span>
                    {s.heading}
                  </li>
                ))}
              </ol>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <h3 className="font-semibold text-[#111827] mb-3 text-sm">Guías relacionadas</h3>
                <div className="space-y-3">
                  {related.map(g => (
                    <Link
                      key={g.slug}
                      href={`/guias/${g.slug}`}
                      className="block p-3 rounded-xl hover:bg-[#F9FAFB] transition-colors group"
                    >
                      <p className="text-sm font-medium text-[#111827] group-hover:text-[#3B82F6] leading-snug transition-colors">
                        {g.title}
                      </p>
                      <span className="flex items-center gap-1 text-xs text-[#9CA3AF] mt-1">
                        <Clock className="w-3 h-3" /> {g.readTime} min
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back to all */}
            <Link
              href="/guias"
              className="block text-center py-2.5 border border-[#E5E7EB] hover:border-[#111827] text-[#374151] hover:text-[#111827] font-medium rounded-xl transition-all text-sm"
            >
              ← Ver todas las guías
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

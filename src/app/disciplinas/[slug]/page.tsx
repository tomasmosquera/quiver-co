import { notFound } from "next/navigation";
import Link from "next/link";
import { DISCIPLINES } from "@/lib/disciplines";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const discipline = DISCIPLINES.find((d) => d.slug === slug);
  if (!discipline) return {};
  return {
    title: `${discipline.name} | Disciplinas | Quiver Co.`,
    description: discipline.tagline,
  };
}

export async function generateStaticParams() {
  return DISCIPLINES.filter((d) => !d.comingSoon).map((d) => ({ slug: d.slug }));
}

export default async function DisciplinaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const discipline = DISCIPLINES.find((d) => d.slug === slug);

  if (!discipline) notFound();

  const paragraphs = discipline.description.split("\n\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back link */}
        <Link
          href="/disciplinas"
          className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827] text-sm mb-8 transition-colors"
        >
          ← Todas las disciplinas
        </Link>

        {/* Hero */}
        <section className={`rounded-2xl border p-8 mb-8 ${discipline.color}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{discipline.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-[#111827]">{discipline.name}</h1>
              <p className={`text-base font-medium mt-0.5 ${discipline.badge}`}>{discipline.tagline}</p>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[#374151] leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* Historia */}
        <section className="bg-white border border-[#E5E7EB] rounded-2xl p-7 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-3">Historia</h2>
          <p className="text-[#374151] leading-relaxed">{discipline.history}</p>
        </section>

        {/* Diferencias */}
        <section className="bg-white border border-[#E5E7EB] rounded-2xl p-7 mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-3">
            Diferencias con otros deportes
          </h2>
          <p className="text-[#374151] leading-relaxed">{discipline.vsOthers}</p>
        </section>

        {/* Equipo básico */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-[#111827] mb-4">Equipo básico</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {discipline.basicGear.map((item) => (
              <div
                key={item.name}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
              >
                <h3 className="font-semibold text-[#111827] mb-1">{item.name}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Variantes de equipo */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#111827] mb-4">Variantes de equipo</h2>
          <div className="space-y-6">
            {discipline.gearVariants.map((category) => (
              <div key={category.category} className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <h3 className="font-semibold text-[#111827] mb-4 pb-3 border-b border-[#F3F4F6]">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.variants.map((variant) => (
                    <div key={variant.name} className="flex flex-col gap-1">
                      <span className={`text-sm font-semibold ${discipline.badge}`}>
                        {variant.name}
                      </span>
                      <span className="text-sm text-[#6B7280] leading-relaxed">
                        {variant.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        {discipline.comingSoon ? (
          <div className="text-center py-6">
            <span className="inline-block bg-[#F3F4F6] text-[#9CA3AF] font-semibold px-6 py-3 rounded-xl cursor-not-allowed">
              Próximamente disponible en el marketplace
            </span>
          </div>
        ) : (
          <div className="text-center py-6">
            <Link
              href={`/equipos?disciplina=${slug.toUpperCase()}`}
              className="inline-block bg-[#111827] hover:bg-[#374151] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Ver equipos de {discipline.name} en venta →
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

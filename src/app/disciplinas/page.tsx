import Link from "next/link";
import { DISCIPLINES } from "@/lib/disciplines";

export const metadata = {
  title: "Disciplinas | Quiver Co.",
  description: "Explora todas las disciplinas de deportes acuáticos disponibles en Quiver Co.",
};

export default function DisciplinasPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Disciplinas</h1>
          <p className="text-[#6B7280] text-lg">
            Compra y vende equipo para tu deporte favorito sobre el agua.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISCIPLINES.map((discipline) => {
            const cardContent = (
              <>
                {discipline.comingSoon && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded-full">
                      Próximamente
                    </span>
                  </div>
                )}
                <h2 className={`text-lg font-bold mb-1 ${discipline.comingSoon ? "text-[#9CA3AF]" : "text-[#111827]"}`}>
                  {discipline.name}
                </h2>
                <p className={`text-sm leading-relaxed ${discipline.comingSoon ? "text-[#D1D5DB]" : "text-[#6B7280]"}`}>
                  {discipline.tagline}
                </p>
                {!discipline.comingSoon && (
                  <div className="mt-4 flex items-center gap-1 text-[#3B82F6] text-sm font-medium">
                    Explorar disciplina
                    <span aria-hidden>→</span>
                  </div>
                )}
              </>
            );

            if (discipline.comingSoon) {
              return (
                <div
                  key={discipline.slug}
                  className={`bg-white border rounded-2xl p-6 opacity-50 cursor-not-allowed select-none ${discipline.color}`}
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <Link
                key={discipline.slug}
                href={`/disciplinas/${discipline.slug}`}
                className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-md block ${discipline.color}`}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";

export default function EventosPage() {
  return (
    <div className="bg-[#FAFAF8] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-blue-50 text-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-[#111827] mb-4">Próximamente</h1>
        
        <p className="text-[#6B7280] mb-8 leading-relaxed">
          Estamos preparando una sección increíble para que descubras campamentos, competencias y eventos de kitesurf y deportes acuáticos en toda Colombia.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#374151] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

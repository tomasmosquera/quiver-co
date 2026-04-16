import Link from "next/link";
import { MapPin, Star, Shield } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  price: number;
  condition: "Nuevo" | "Como nuevo" | "Usado";
  brand: string;
  size?: string;
  location: string;
  discipline: string;
  image: string;
  seller: { name: string; rating: number; verified: boolean };
  featured?: boolean;
}

const DISCIPLINE_COLORS: Record<string, string> = {
  Kitesurf:  "bg-sky-50 text-sky-700",
  Wingfoil:  "bg-violet-50 text-violet-700",
  Windsurf:  "bg-emerald-50 text-emerald-700",
  Foilboard: "bg-amber-50 text-amber-700",
  Kitefoil:  "bg-rose-50 text-rose-700",
  Wakeboard: "bg-orange-50 text-orange-700",
  Paddle:    "bg-teal-50 text-teal-700",
};

function conditionColor(c: Product["condition"]) {
  if (c === "Nuevo")      return "bg-emerald-50 text-emerald-700";
  if (c === "Como nuevo") return "bg-blue-50 text-blue-700";
  return "bg-amber-50 text-amber-700";
}

export default function ProductCard({ product }: { product: Product }) {
  const discColor = DISCIPLINE_COLORS[product.discipline] ?? "bg-gray-50 text-gray-700";

  return (
    <Link
      href={`/equipo/${product.id}`}
      className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#F9FAFB] overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#3B82F6] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Destacado
          </span>
        )}
        <span
          className={`absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full ${conditionColor(product.condition)}`}
        >
          {product.condition}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Discipline + brand */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${discColor}`}>
            {product.discipline}
          </span>
          <span className="text-xs text-[#9CA3AF]">
            {product.brand}{product.size && ` · ${product.size}`}
          </span>
        </div>

        <h3 className="text-[#111827] font-semibold text-sm line-clamp-2 leading-snug group-hover:text-[#3B82F6] transition-colors">
          {product.title}
        </h3>

        <p className="text-[#111827] font-bold text-xl mt-auto">
          ${product.price.toLocaleString("es-CO")}
          <span className="text-xs text-[#9CA3AF] font-normal ml-1">COP</span>
        </p>

        {/* Seller & location */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
          <div className="flex items-center gap-1 text-xs text-[#6B7280]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {product.location}
          </div>
          <div className="flex items-center gap-1">
            {product.seller.verified && (
              <Shield className="w-3.5 h-3.5 text-[#3B82F6]" />
            )}
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs text-[#6B7280]">{product.seller.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

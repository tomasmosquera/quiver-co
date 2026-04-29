import Link from "next/link";
import { ClipboardCheck, MapPin, Shield, Star } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export interface Product {
  id: string;
  title: string;
  price: number;
  currency?: string;
  priceCOP?: number;  // equivalente COP si la moneda es USD
  condition: "Nuevo" | "Como nuevo" | "Usado";
  brand: string;
  size?: string;
  location: string;
  discipline: string;
  image?: string;
  seller: { name: string; rating: number | null; reviewCount?: number; verified: boolean };
  hasInspection?: boolean;
  featured?: boolean;
  isSaved?: boolean;
}

const DISCIPLINE_COLORS: Record<string, string> = {
  Kitesurf:  "bg-sky-50 text-sky-700",
  Wingfoil:  "bg-violet-50 text-violet-700",
  Windsurf:  "bg-emerald-50 text-emerald-700",
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
  const sellerRatingLabel = product.seller.rating !== null
    ? product.seller.rating.toFixed(1)
    : "Nuevo vendedor";
  const sellerRatingTitle = product.seller.rating !== null
    ? `${product.seller.rating.toFixed(1)} (${product.seller.reviewCount ?? 0} reseña${product.seller.reviewCount === 1 ? "" : "s"})`
    : "Nuevo vendedor";

  return (
    <Link
      href={`/equipo/${product.id}`}
      className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#3B82F6] hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#F9FAFB] overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#9CA3AF]">Sin foto</div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-[#3B82F6] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Destacado
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-sm ${conditionColor(product.condition)}`}
          >
            {product.condition}
          </span>
          <FavoriteButton listingId={product.id} initiallySaved={Boolean(product.isSaved)} variant="icon" />
        </div>
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

        {product.currency === "USD" ? (
          <div className="mt-auto">
            <p className="text-[#111827] font-bold text-xl">
              USD ${product.price.toLocaleString("en-US")}
            </p>
            {product.priceCOP && (
              <p className="text-xs text-[#6B7280]">≈ ${product.priceCOP.toLocaleString("es-CO")} COP</p>
            )}
          </div>
        ) : (
          <p className="text-[#111827] font-bold text-xl mt-auto">
            ${product.price.toLocaleString("es-CO")}
            <span className="text-xs text-[#9CA3AF] font-normal ml-1">COP</span>
          </p>
        )}

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
            {product.hasInspection && (
              <span title="Cuenta con peritaje" aria-label="Cuenta con peritaje">
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            )}
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span title={sellerRatingTitle} className="text-xs text-[#6B7280]">{sellerRatingLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

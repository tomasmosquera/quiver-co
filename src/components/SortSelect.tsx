"use client";

import { useRouter } from "next/navigation";

const ORDER_OPTIONS = [
  { value: "reciente",    label: "Más recientes" },
  { value: "precio_asc",  label: "Menor precio" },
  { value: "precio_desc", label: "Mayor precio" },
  { value: "vistas",      label: "Más vistos" },
];

export default function SortSelect({ currentOrden, buildUrl }: { currentOrden: string; buildUrl: string }) {
  const router = useRouter();

  return (
    <select
      value={currentOrden}
      onChange={(e) => {
        const url = new URL(buildUrl, window.location.origin);
        url.searchParams.set("orden", e.target.value);
        router.push(url.pathname + url.search);
      }}
      className="text-sm border border-[#E5E7EB] rounded-xl px-3 py-2 bg-white text-[#374151] focus:outline-none focus:border-[#3B82F6] cursor-pointer"
    >
      {ORDER_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

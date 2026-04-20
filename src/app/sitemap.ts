import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE = "https://quiverkite.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${BASE}/equipos`,             lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/vender`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/como-funciona`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tarifas`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/proteccion-comprador`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/ayuda`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/terminos`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/privacidad`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/contacto`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const listingPages: MetadataRoute.Sitemap = listings.map(l => ({
    url: `${BASE}/equipo/${l.id}`,
    lastModified: l.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...listingPages];
}

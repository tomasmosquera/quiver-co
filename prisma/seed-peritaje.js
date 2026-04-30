// Seed: anuncio de prueba con peritaje estándar
// Uso: node prisma/seed-peritaje.js

const { neon } = require("@neondatabase/serverless");

const DB_URL =
  "postgresql://neondb_owner:npg_xDB1MnF3cAlq@ep-old-sunset-anuvy4qm-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const SELLER_EMAIL = "tmosquera93@gmail.com";

const sql = neon(DB_URL);

const inspection = {
  version: "kite-standard-v1",
  source: "seller-admin-prototype",
  completedAt: new Date().toISOString(),
  score: 91,
  rawScore: 96,
  label: "Excelente",
  alerts: [],
  answers: {
    identity_match: "pass",
    inflates_shape: "pass",
    holds_pressure: "pass",
    main_valve_ok: "pass",
    one_pump_ok: "pass",
    leading_edge_ok: "pass",
    struts_ok: "pass",
    canopy_no_tears: "pass",
    canopy_no_severe_wear: "pass",
    trailing_edge_ok: "pass",
    bridles_ok: "pass",
    pigtails_ok: "pass",
    pulleys_ok: "na",
    repairs_declared: "pass",
  },
  photos: {
    inflated_identity: ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    pressure_final:    ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    main_valve:        ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    one_pump:          ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    leading_edge:      ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    trailing_edge:     ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    bridles_left:      ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
    bridles_right:     ["https://images.unsplash.com/photo-1600687688781-b03c94a9c2e0?w=800&q=80"],
  },
};

const metadata = {
  reference: "Switchblade",
  year: "2023",
  includesBar: false,
  includesBag: true,
  hasRepairs: false,
  repairs: [],
  standardInspection: inspection,
};

async function main() {
  // Find seller
  const [seller] = await sql`SELECT id FROM users WHERE email = ${SELLER_EMAIL} LIMIT 1`;
  if (!seller) {
    console.error("❌ Seller not found:", SELLER_EMAIL);
    process.exit(1);
  }

  const id = "cltest-peritaje-" + Date.now();
  const metaJson = JSON.stringify(metadata);

  // Insert listing
  await sql`
    INSERT INTO listings (id, title, description, price, currency, discipline, "equipmentType", brand, size, city, condition, status, featured, views, "sellerId", metadata, "createdAt", "updatedAt")
    VALUES (
      ${id},
      'Cabrinha Switchblade 12m 2023 · Peritaje Quiver Co.',
      'Cometa en excelente estado con Peritaje Estándar Quiver Co. completado. 91/100 puntos — sin alertas críticas. Muy pocas horas de uso, siempre guardada correctamente. Incluye maleta original. Ideal para freeriding en todos los vientos.',
      3600000,
      'COP',
      'KITESURF',
      'COMETA',
      'Cabrinha',
      '12m',
      'Santa Marta',
      'COMO_NUEVO',
      'ACTIVE',
      false,
      0,
      ${seller.id},
      ${metaJson}::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING
  `;

  // Insert cover image
  const imgId = "cltest-img-" + Date.now();
  await sql`
    INSERT INTO listing_images (id, url, "order", "listingId")
    VALUES (
      ${imgId},
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
      0,
      ${id}
    )
    ON CONFLICT DO NOTHING
  `;

  console.log("✅ Listing created:", id);
  console.log("   → /equipo/" + id);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

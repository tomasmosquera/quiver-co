// Seed: 40 anuncios de muestra para Quiver Co.
// Uso: node prisma/seed-listings.js

const { Client } = require("pg");

const DB_URL = "postgresql://postgres:quiver2410@localhost:5432/quiver_co";
const SELLER_EMAIL = "tmosquera93@gmail.com";

// ─── Datos de los 40 anuncios ───────────────────────────────────────────────

const listings = [
  // ── KITESURF – Cometas ──
  {
    title: "Cabrinha Switchblade 12m 2022",
    description: "Cometa en excelente estado, muy poca lluvia. Ideal para freeriding y poca experiencia en agua llana. Incluye maleta original.",
    price: 2800000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Cabrinha",
    size: "12m²",
    city: "Cartagena",
    metadata: { reference: "Switchblade", year: "2022", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Duotone Rebel 9m 2023 + Barra",
    description: "Cometa allround para todos los vientos. Viene con barra Duotone Trust Bar 2023 y líneas de 24m. En perfecto estado.",
    price: 4500000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Duotone",
    size: "9m²",
    city: "Santa Marta",
    metadata: { reference: "Rebel", year: "2023", includesBar: true, barBrand: "Duotone", barReference: "Trust Bar", lineLength: "24m", includesBag: true, hasRepairs: false },
  },
  {
    title: "Core XR7 14m 2021",
    description: "Cometa grande para viento ligero. Perfecta para freeriding en la bahía. Tiene una pequeña reparación en el borde de ataque, no afecta el vuelo.",
    price: 2200000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Core",
    size: "14m²",
    city: "Barranquilla",
    metadata: { reference: "XR7", year: "2021", includesBar: false, includesBag: false, hasRepairs: true, repairs: [{ description: "Parche de 5cm en borde de ataque, correctamente sellado." }] },
  },
  {
    title: "North Orbit 7m 2024 – Nueva",
    description: "Cometa nueva sin estrenar, comprada de más. Perfecta para viento fuerte y olas. Con maleta y pegatinas originales.",
    price: 5800000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "NUEVO",
    brand: "North",
    size: "7m²",
    city: "Cartagena",
    metadata: { reference: "Orbit", year: "2024", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Ozone Edge V10 11m 2020",
    description: "Cometa de rendimiento para freeriders avanzados. Gran sustentación, muy buena en rangos bajos de viento. Sin reparaciones.",
    price: 1800000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Ozone",
    size: "11m²",
    city: "San Andrés",
    metadata: { reference: "Edge V10", year: "2020", includesBar: false, includesBag: false, hasRepairs: false },
  },

  // ── KITESURF – Tablas ──
  {
    title: "Duotone Select 138x42 2022",
    description: "Tabla twintip para todos los niveles. Rígida y estable. En buen estado, algunos rasguños superficiales en la base.",
    price: 1400000,
    discipline: "KITESURF",
    equipmentType: "TABLA",
    condition: "USADO",
    brand: "Duotone",
    size: "138cm",
    city: "Cartagena",
    metadata: { boardType: "twintip", reference: "Select", year: "2022", hasRepairs: false },
  },
  {
    title: "Cabrinha Troop 142 Twintip – Como nueva",
    description: "Tabla ligera y rápida. Muy poca lluvia, prácticamente nueva. Ideal para freeride y wakestyle básico.",
    price: 1900000,
    discipline: "KITESURF",
    equipmentType: "TABLA",
    condition: "COMO_NUEVO",
    brand: "Cabrinha",
    size: "142cm",
    city: "Santa Marta",
    metadata: { boardType: "twintip", reference: "Troop", year: "2023", hasRepairs: false },
  },
  {
    title: "F-One Slice Bamboo Surfboard 5'6\"",
    description: "Tabla de surf para kite en olas. Construcción en bambú, muy ligera y sensible. Perfecta para el Caribe colombiano.",
    price: 2600000,
    discipline: "KITESURF",
    equipmentType: "TABLA",
    condition: "COMO_NUEVO",
    brand: "F-One",
    size: "5'6\"",
    city: "El Valle",
    metadata: { boardType: "surfboard", reference: "Slice Bamboo", year: "2022", hasRepairs: false },
  },

  // ── KITESURF – Barras ──
  {
    title: "Cabrinha Overdrive 2.0 Bar 52cm 2023",
    description: "Barra en perfecto estado. Líneas de 24m con muy poco desgaste. Compatible con todas las cometas Cabrinha.",
    price: 1100000,
    discipline: "KITESURF",
    equipmentType: "BARRA_LINEAS",
    condition: "COMO_NUEVO",
    brand: "Cabrinha",
    size: "52cm",
    city: "Cartagena",
    metadata: { reference: "Overdrive 2.0", year: "2023", lineLength: "24m", hasRepairs: false },
  },
  {
    title: "North Reach Bar 48cm + Líneas 22m",
    description: "Barra completa con líneas en buen estado. El depower funciona perfecto. Algún desgaste cosmético en el tubo.",
    price: 780000,
    discipline: "KITESURF",
    equipmentType: "BARRA_LINEAS",
    condition: "USADO",
    brand: "North",
    size: "48cm",
    city: "Barranquilla",
    metadata: { reference: "Reach Bar", year: "2021", lineLength: "22m", hasRepairs: false },
  },

  // ── KITESURF – Arneses ──
  {
    title: "Dakine Nitrous Arnés Cintura Talla M",
    description: "Arnés de cintura cómodo y con buen soporte lumbar. Pocas temporadas de uso. Perfecto para freeriding.",
    price: 650000,
    discipline: "KITESURF",
    equipmentType: "ARNES",
    condition: "USADO",
    brand: "Dakine",
    size: "M",
    city: "Cartagena",
    metadata: { arnesType: "cintura", reference: "Nitrous", year: "2021", hasRepairs: false },
  },
  {
    title: "ION Apex Arnés Cintura Talla L – Nuevo",
    description: "Arnés nuevo sin estrenar, regalo que no usé. Talla L, sistema de ajuste rápido, muy cómodo.",
    price: 980000,
    discipline: "KITESURF",
    equipmentType: "ARNES",
    condition: "NUEVO",
    brand: "ION",
    size: "L",
    city: "Santa Marta",
    metadata: { arnesType: "cintura", reference: "Apex", year: "2024", hasRepairs: false },
  },
  {
    title: "Mystic Star Seat Harness Arnés Asiento M",
    description: "Arnés de asiento ideal para principiantes o quienes tienen problemas de espalda. Buen estado.",
    price: 550000,
    discipline: "KITESURF",
    equipmentType: "ARNES",
    condition: "USADO",
    brand: "Mystic",
    size: "M",
    city: "San Andrés",
    metadata: { arnesType: "asiento", reference: "Star Seat", year: "2020", hasRepairs: false },
  },

  // ── KITEFOIL – Cometas ──
  {
    title: "Duotone Rebel 15m 2023 – Kitefoil",
    description: "Cometa grande perfecta para kitefoil en viento ligero. Excelente rango de viento bajo, muy poco uso en foil.",
    price: 5200000,
    discipline: "KITEFOIL",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Duotone",
    size: "15m",
    city: "Cartagena",
    metadata: { reference: "Rebel", year: "2023", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Ozone Enduro V3 17m 2022",
    description: "Cometa de foil para condiciones de viento ultra ligero. Ideal para bahías y lagunas tranquilas. En perfecto estado.",
    price: 4800000,
    discipline: "KITEFOIL",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Ozone",
    size: "17m",
    city: "Barranquilla",
    metadata: { reference: "Enduro V3", year: "2022", includesBar: false, includesBag: true, hasRepairs: false },
  },

  // ── KITEFOIL – Tablas ──
  {
    title: "Slingshot Phantasm Foilboard 4'8\"",
    description: "Tabla de foil en fibra de vidrio, compacta y manejable. Footpads en buen estado, algunos golpes en los bordes.",
    price: 1600000,
    discipline: "KITEFOIL",
    equipmentType: "TABLA",
    condition: "USADO",
    brand: "Slingshot",
    size: "4'8\"",
    city: "Cartagena",
    metadata: { boardType: "foilboard", reference: "Phantasm", year: "2021", hasRepairs: false },
  },
  {
    title: "Cabrinha Ace Foilboard 5'0\" 2023",
    description: "Tabla de foil carbono/vidrio. Muy ligera y rígida. Mínimo uso, casi nueva. Incluye straps y pads.",
    price: 2400000,
    discipline: "KITEFOIL",
    equipmentType: "TABLA",
    condition: "COMO_NUEVO",
    brand: "Cabrinha",
    size: "5'0\"",
    city: "Santa Marta",
    metadata: { boardType: "foilboard", reference: "Ace", year: "2023", hasRepairs: false },
  },

  // ── KITEFOIL – Barras ──
  {
    title: "Duotone Click Bar 45cm 2023",
    description: "Barra de foil con sistema Click. Líneas de 22m especiales para foil. En perfecto estado.",
    price: 1350000,
    discipline: "KITEFOIL",
    equipmentType: "BARRA_LINEAS",
    condition: "COMO_NUEVO",
    brand: "Duotone",
    size: "45cm",
    city: "Cartagena",
    metadata: { reference: "Click Bar", year: "2023", lineLength: "22m", hasRepairs: false },
  },

  // ── WINGFOIL – Wings ──
  {
    title: "F-One Strike CWC 5m 2023",
    description: "Wing allround muy versátil. Ideal para iniciarse o para sesiones de freeride. Poco uso, sin reparaciones.",
    price: 3200000,
    discipline: "WINGFOIL",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "F-One",
    size: "5m²",
    city: "Cartagena",
    metadata: { reference: "Strike CWC", year: "2023", includesBar: true, includesBag: true, hasRepairs: false },
  },
  {
    title: "Duotone Slick 4m Wing 2022",
    description: "Wing compacto para viento fuerte. Muy manejable y fácil de controlar. Algunas marcas de uso normal.",
    price: 2100000,
    discipline: "WINGFOIL",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Duotone",
    size: "4m²",
    city: "Santa Marta",
    metadata: { reference: "Slick", year: "2022", includesBar: false, includesBag: false, hasRepairs: false },
  },
  {
    title: "North Nova 6m Wing 2024 – Nuevo",
    description: "Wing nuevo, comprado pero cambié de talla. Perfecto para viento ligero y riders de más de 80kg.",
    price: 4900000,
    discipline: "WINGFOIL",
    equipmentType: "COMETA_WING",
    condition: "NUEVO",
    brand: "North",
    size: "6m²",
    city: "Barranquilla",
    metadata: { reference: "Nova", year: "2024", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Ozone Wasp V3 3m Wing",
    description: "Wing para viento ultra fuerte o riders ligeros. Muy potente y directo. En perfecto estado.",
    price: 1800000,
    discipline: "WINGFOIL",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Ozone",
    size: "3m²",
    city: "San Andrés",
    metadata: { reference: "Wasp V3", year: "2022", includesBar: false, includesBag: false, hasRepairs: false },
  },

  // ── WINGFOIL – Tablas ──
  {
    title: "Fanatic Sky Wing 5'4\" 2023",
    description: "Tabla de wingfoil en carbono. Muy rígida y estable. Perfecta para aprender o para sesiones tranquilas.",
    price: 3800000,
    discipline: "WINGFOIL",
    equipmentType: "TABLA",
    condition: "COMO_NUEVO",
    brand: "Fanatic",
    size: "5'4\"",
    city: "Cartagena",
    metadata: { boardType: "foilboard", reference: "Sky Wing", year: "2023", hasRepairs: false },
  },
  {
    title: "Starboard Wing Foil 4'10\" Carbon",
    description: "Tabla de wingfoil full carbon. Ultraligera. Algún golpe cosmético en los rails, no estructural.",
    price: 4200000,
    discipline: "WINGFOIL",
    equipmentType: "TABLA",
    condition: "USADO",
    brand: "Starboard",
    size: "4'10\"",
    city: "Santa Marta",
    metadata: { boardType: "foilboard", reference: "Wing Foil Carbon", year: "2022", hasRepairs: false },
  },

  // ── WINGFOIL – Leashes ──
  {
    title: "Prolimit Leash de muñeca 1.8m",
    description: "Leash de wing en buen estado. Velcro en perfecto estado, sin deformaciones.",
    price: 120000,
    discipline: "WINGFOIL",
    equipmentType: "BARRA_LINEAS",
    condition: "USADO",
    brand: "Prolimit",
    size: "1.8m",
    city: "Cartagena",
    metadata: { reference: "Wrist Leash", lineLength: "muneca", hasRepairs: false },
  },
  {
    title: "ION Leash de arnés 2m – Nuevo",
    description: "Leash de arnés nuevo, nunca usado. Muy resistente y con swivel doble anti-torsión.",
    price: 180000,
    discipline: "WINGFOIL",
    equipmentType: "BARRA_LINEAS",
    condition: "NUEVO",
    brand: "ION",
    size: "2m",
    city: "Barranquilla",
    metadata: { reference: "Core Leash", lineLength: "arnes", hasRepairs: false },
  },

  // ── WINGFOIL – Arneses ──
  {
    title: "Mystic Majestic X Arnés Cintura Talla S",
    description: "Arnés de cintura para wingfoil. Talla S, ajuste perfecto para rider delgado. Muy cómodo en sesiones largas.",
    price: 720000,
    discipline: "WINGFOIL",
    equipmentType: "ARNES",
    condition: "COMO_NUEVO",
    brand: "Mystic",
    size: "S",
    city: "Cartagena",
    metadata: { arnesType: "cintura", reference: "Majestic X", year: "2023", hasRepairs: false },
  },

  // ── ACCESORIOS – Varios ──
  {
    title: "Bomba eléctrica Bravo One Electric",
    description: "Bomba eléctrica recargable vía USB-C. Infla y desinfla automáticamente. Perfecta para viajes.",
    price: 350000,
    discipline: "WATERWEAR",
    equipmentType: "ACCESORIO",
    condition: "COMO_NUEVO",
    brand: "Bravo",
    size: null,
    city: "Cartagena",
    metadata: null,
  },
  {
    title: "Maleta Ozone Cometa 12-14m",
    description: "Maleta Ozone original para cometas de 12-14m. En muy buen estado, cierre perfecto.",
    price: 200000,
    discipline: "WATERWEAR",
    equipmentType: "ACCESORIO",
    condition: "USADO",
    brand: "Ozone",
    size: null,
    city: "Santa Marta",
    metadata: null,
  },
  {
    title: "Traje Prolimit 3/2 Steamer Talla M",
    description: "Traje de neopreno de 3mm. Perfecto para agua fría. Costuras selladas y sin cortes.",
    price: 480000,
    discipline: "WATERWEAR",
    equipmentType: "TRAJE",
    condition: "USADO",
    brand: "Prolimit",
    size: "M",
    city: "Barranquilla",
    metadata: null,
  },
  {
    title: "Poncho Manera Microfibre Pro",
    description: "Poncho de microfibra para cambios rápidos en la playa. Muy absorbente. Como nuevo.",
    price: 160000,
    discipline: "WATERWEAR",
    equipmentType: "ACCESORIO",
    condition: "COMO_NUEVO",
    brand: "Manera",
    size: null,
    city: "San Andrés",
    metadata: null,
  },
  {
    title: "Casco Mystic MK8 Talla M",
    description: "Casco de impacto para kitesurf y wingfoil. Talla M. Sin golpes estructurales.",
    price: 290000,
    discipline: "WATERWEAR",
    equipmentType: "ACCESORIO",
    condition: "USADO",
    brand: "Mystic",
    size: "M",
    city: "Cartagena",
    metadata: null,
  },
  {
    title: "Board Bag Cabrinha Twintip 140cm",
    description: "Funda acolchada para tabla twintip hasta 140cm. Muy buena protección. Muy buen estado.",
    price: 140000,
    discipline: "WATERWEAR",
    equipmentType: "ACCESORIO",
    condition: "USADO",
    brand: "Cabrinha",
    size: null,
    city: "Cartagena",
    metadata: null,
  },

  // ── Más KITESURF variado ──
  {
    title: "Naish Pivot 10m 2022",
    description: "Cometa freeride con excelente maniobrabilidad. Sin reparaciones, con maleta. Muy versátil en todos los vientos.",
    price: 2500000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Naish",
    size: "10m²",
    city: "Cartagena",
    metadata: { reference: "Pivot", year: "2022", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Slingshot RPM 12m 2021 + Barra",
    description: "Cometa crossover para freeride y wave. Incluye barra Guardian Bar 48cm con líneas de 24m.",
    price: 3100000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Slingshot",
    size: "12m²",
    city: "El Valle",
    metadata: { reference: "RPM", year: "2021", includesBar: true, barBrand: "Slingshot", barReference: "Guardian Bar", lineLength: "24m", includesBag: false, hasRepairs: false },
  },
  {
    title: "Eleveight RS 8m Wing 2023",
    description: "Cometa de alto rendimiento para freeriders avanzados. Muy rápida y con excelente borde de ataque. Poco uso.",
    price: 3600000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Eleveight",
    size: "8m²",
    city: "Cartagena",
    metadata: { reference: "RS", year: "2023", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Duotone Evo 13m 2020",
    description: "Cometa clásica allround. Gran rango de viento, muy fácil de volar. Perfecto para principiantes avanzados.",
    price: 1700000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Duotone",
    size: "13m²",
    city: "Barranquilla",
    metadata: { reference: "Evo", year: "2020", includesBar: false, includesBag: false, hasRepairs: false },
  },
  {
    title: "North Pulse 10m 2022 Foilboard",
    description: "Tabla de foil para kitefoil iniciación. 5'2\", molde simétrico, fácil de remontar.",
    price: 1950000,
    discipline: "KITEFOIL",
    equipmentType: "TABLA",
    condition: "USADO",
    brand: "North",
    size: "5'2\"",
    city: "Santa Marta",
    metadata: { boardType: "foilboard", reference: "Pulse Board", year: "2022", hasRepairs: false },
  },
  {
    title: "Reedin Super Model Wing 5.5m 2023",
    description: "Wing de alto rendimiento con manija ergonómica. Muy estable en racha. Como nuevo.",
    price: 3900000,
    discipline: "WINGFOIL",
    equipmentType: "COMETA_WING",
    condition: "COMO_NUEVO",
    brand: "Reedin",
    size: "5.5m²",
    city: "Cartagena",
    metadata: { reference: "Super Model", year: "2023", includesBar: false, includesBag: true, hasRepairs: false },
  },
  {
    title: "Airush Union V6 11m 2021",
    description: "Cometa freeride clásica. Gran polivalencia, buena en olas y agua plana. Un parche pequeño en el canopy.",
    price: 1600000,
    discipline: "KITESURF",
    equipmentType: "COMETA_WING",
    condition: "USADO",
    brand: "Airush",
    size: "11m²",
    city: "San Andrés",
    metadata: { reference: "Union V6", year: "2021", includesBar: false, includesBag: false, hasRepairs: true, repairs: [{ description: "Parche de 3cm en el canopy central, reparación profesional." }] },
  },
];

// ─── Script principal ───────────────────────────────────────────────────────

async function main() {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();
  console.log("✅ Conectado a la base de datos");

  // Obtener sellerId
  const sellerRes = await client.query(
    "SELECT id FROM users WHERE email = $1",
    [SELLER_EMAIL]
  );
  if (sellerRes.rows.length === 0) {
    throw new Error(`No se encontró el usuario con email ${SELLER_EMAIL}`);
  }
  const sellerId = sellerRes.rows[0].id;
  console.log(`✅ Vendedor: ${SELLER_EMAIL} (${sellerId})`);

  let created = 0;
  for (const l of listings) {
    const metadata = l.metadata ? JSON.stringify(l.metadata) : null;

    // Calcular createdAt distribuido en los últimos 60 días
    const daysAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);

    await client.query(
      `INSERT INTO listings
        (id, title, description, price, discipline, "equipmentType", condition, brand, size, city, metadata, status, featured, views, "sellerId", "createdAt", "updatedAt")
       VALUES
        (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, 'ACTIVE', false, $11, $12, $13, $13)`,
      [
        l.title,
        l.description,
        l.price,
        l.discipline,
        l.equipmentType,
        l.condition,
        l.brand ?? null,
        l.size ?? null,
        l.city,
        metadata,
        Math.floor(Math.random() * 200),
        sellerId,
        createdAt,
      ]
    );
    created++;
    console.log(`  [${created}/${listings.length}] ${l.title}`);
  }

  await client.end();
  console.log(`\n🎉 Listo. Se crearon ${created} anuncios.`);
}

main().catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/* ─── Tipos serializables (sin BigInt) ─── */
export type CachedToggleRow   = { val: string;  cnt: number };
export type CachedYearRow     = { year: string; cnt: number };
export type CachedRefRow      = { ref: string;  cnt: number };
export type CachedPeritajeRow = { has_peritaje: boolean; cnt: number };

const VALID_DISCIPLINES = [
  "KITESURF","KITEFOIL","WINGFOIL","WINDSURF",
  "FOILBOARD","WAKEBOARD","PADDLE","WATERWEAR","Accesorios",
];
const SECCION_TO_DB: Record<string, string> = { Accesorios: "WATERWEAR" };

/**
 * Queries sobre metadata JSON (años, referencias, toggles, peritaje).
 * Son las más costosas porque escanean la columna JSONB.
 * Se cachean 5 minutos por combinación (seccion, tipo).
 */
export const getCachedRawFilters = unstable_cache(
  async (seccion: string, tipo: string) => {
    const disciplineFilter =
      seccion && VALID_DISCIPLINES.includes(seccion)
        ? `AND discipline = '${SECCION_TO_DB[seccion] ?? seccion}'`
        : "";
    const tipoFilter = tipo ? `AND "equipmentType" = '${tipo}'` : "";
    const baseWhere  = `status = 'ACTIVE' ${disciplineFilter} ${tipoFilter}`;

    /* Años y referencias — siempre */
    const [rawYears, rawRefs] = await Promise.all([
      prisma.$queryRawUnsafe<{ year: string; cnt: bigint }[]>(`
        SELECT metadata->>'year' AS year, COUNT(*) AS cnt
        FROM listings
        WHERE status = 'ACTIVE'
          AND metadata->>'year' IS NOT NULL
          AND metadata->>'year' != ''
          ${disciplineFilter} ${tipoFilter}
        GROUP BY metadata->>'year'
      `),
      prisma.$queryRawUnsafe<{ ref: string; cnt: bigint }[]>(`
        SELECT split_part(metadata->>'reference', ' ', 1) AS ref, COUNT(*) AS cnt
        FROM listings
        WHERE status = 'ACTIVE'
          AND metadata->>'reference' IS NOT NULL
          AND metadata->>'reference' != ''
          ${disciplineFilter} ${tipoFilter}
        GROUP BY split_part(metadata->>'reference', ' ', 1)
        ORDER BY cnt DESC
      `),
    ]);

    /* Toggles — solo cuando hay seccion + tipo */
    let barraRows:  CachedToggleRow[] = [];
    let maletaRows: CachedToggleRow[] = [];
    let leashRows:  CachedToggleRow[] = [];
    let repRows:    CachedToggleRow[] = [];
    let peritajeRows: CachedPeritajeRow[] = [];

    if (seccion && tipo) {
      const [br, mr, lr, rr] = await Promise.all([
        prisma.$queryRawUnsafe<{ val: string; cnt: bigint }[]>(
          `SELECT (metadata->>'includesBar')   AS val, COUNT(*) AS cnt FROM listings WHERE ${baseWhere} AND metadata->>'includesBar'   IS NOT NULL GROUP BY val`),
        prisma.$queryRawUnsafe<{ val: string; cnt: bigint }[]>(
          `SELECT (metadata->>'includesBag')   AS val, COUNT(*) AS cnt FROM listings WHERE ${baseWhere} AND metadata->>'includesBag'   IS NOT NULL GROUP BY val`),
        prisma.$queryRawUnsafe<{ val: string; cnt: bigint }[]>(
          `SELECT (metadata->>'includesLeash') AS val, COUNT(*) AS cnt FROM listings WHERE ${baseWhere} AND metadata->>'includesLeash' IS NOT NULL GROUP BY val`),
        prisma.$queryRawUnsafe<{ val: string; cnt: bigint }[]>(
          `SELECT (metadata->>'hasRepairs')    AS val, COUNT(*) AS cnt FROM listings WHERE ${baseWhere} AND metadata->>'hasRepairs'    IS NOT NULL GROUP BY val`),
      ]);
      barraRows  = br.map(r => ({ val: r.val, cnt: Number(r.cnt) }));
      maletaRows = mr.map(r => ({ val: r.val, cnt: Number(r.cnt) }));
      leashRows  = lr.map(r => ({ val: r.val, cnt: Number(r.cnt) }));
      repRows    = rr.map(r => ({ val: r.val, cnt: Number(r.cnt) }));

      /* Peritaje — solo para cometas kite */
      if (tipo === "COMETA" && ["KITESURF", "KITEFOIL"].includes(seccion)) {
        const rows = await prisma.$queryRawUnsafe<{ has_peritaje: boolean; cnt: bigint }[]>(`
          SELECT
            (metadata->'standardInspection' IS NOT NULL
             AND metadata->>'standardInspection' != 'null') AS has_peritaje,
            COUNT(*) AS cnt
          FROM listings
          WHERE ${baseWhere}
          GROUP BY has_peritaje
        `);
        peritajeRows = rows.map(r => ({ has_peritaje: r.has_peritaje, cnt: Number(r.cnt) }));
      }
    }

    return {
      yearRows:       rawYears.map(r => ({ year: r.year, cnt: Number(r.cnt) })) as CachedYearRow[],
      referenciaRows: rawRefs.map(r => ({ ref: r.ref,   cnt: Number(r.cnt) })) as CachedRefRow[],
      barraRows, maletaRows, leashRows, repRows, peritajeRows,
    };
  },
  ["equipos-raw-filters-v1"],
  { revalidate: 300 }, // 5 minutos
);

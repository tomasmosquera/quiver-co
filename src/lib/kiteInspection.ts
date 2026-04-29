export type InspectionAnswer = "pass" | "fail" | "na";

export interface InspectionCheck {
  id: string;
  label: string;
  weight: number;
  section: string;
  allowNa?: boolean;
}

export interface InspectionResult {
  score: number;
  rawScore: number;
  label: string;
  alerts: string[];
  maxScore?: number;
}

export const KITE_INSPECTION_VERSION = "kite-standard-v1";

export const KITE_INSPECTION_CHECKS: InspectionCheck[] = [
  {
    id: "identity_match",
    label: "La cometa coincide con la marca, modelo y tamano declarado",
    weight: 4,
    section: "Identificacion",
  },
  {
    id: "inflates_shape",
    label: "La cometa infla completamente y toma buena forma",
    weight: 8,
    section: "Prueba de aire",
  },
  {
    id: "holds_pressure",
    label: "Mantiene presion despues de 15-20 minutos",
    weight: 12,
    section: "Prueba de aire",
  },
  {
    id: "main_valve_ok",
    label: "La valvula principal esta completa, cierra bien y no muestra fuga visible",
    weight: 6,
    section: "Valvulas",
  },
  {
    id: "one_pump_ok",
    label: "Los conectores one pump y mangueras estan completos y sin dano visible",
    weight: 5,
    section: "Valvulas",
  },
  {
    id: "leading_edge_ok",
    label: "El leading edge esta sin cortes, deformaciones o costuras abiertas",
    weight: 12,
    section: "Estructura",
  },
  {
    id: "struts_ok",
    label: "Las costillas estan sin cortes, deformaciones o costuras abiertas",
    weight: 8,
    section: "Estructura",
  },
  {
    id: "canopy_no_tears",
    label: "El canopy no tiene rasgaduras abiertas ni parches temporales",
    weight: 10,
    section: "Tela",
  },
  {
    id: "canopy_no_severe_wear",
    label: "La tela no muestra desgaste severo, moho fuerte o zonas quebradizas",
    weight: 5,
    section: "Tela",
  },
  {
    id: "trailing_edge_ok",
    label: "El trailing edge no tiene deshilachado fuerte, costuras abiertas o desgaste severo",
    weight: 5,
    section: "Tela",
  },
  {
    id: "bridles_ok",
    label: "Las bridas estan completas, simetricas y sin cortes o desgaste severo",
    weight: 8,
    section: "Bridas",
  },
  {
    id: "pigtails_ok",
    label: "Los pigtails y puntos de conexion estan en buen estado",
    weight: 6,
    section: "Bridas",
  },
  {
    id: "pulleys_ok",
    label: "Las poleas giran libremente y no estan trabadas o muy gastadas",
    weight: 4,
    section: "Bridas",
    allowNa: true,
  },
  {
    id: "repairs_declared",
    label: "Todas las reparaciones, danos o modificaciones fueron declarados y fotografiados",
    weight: 7,
    section: "Reparaciones",
  },
];

export const KITE_INSPECTION_REQUIRED_PHOTOS = [
  "inflated_identity",
  "pressure_final",
  "main_valve",
  "one_pump",
  "leading_edge",
  "trailing_edge",
  "bridles_left",
  "bridles_right",
] as const;

export function hasStandardInspection(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return false;
  const inspection = (metadata as Record<string, unknown>).standardInspection;
  return Boolean(inspection && typeof inspection === "object" && !Array.isArray(inspection));
}

export function calculateKiteInspection(
  answers: Record<string, InspectionAnswer | undefined>,
  photos: Record<string, string[] | undefined>,
): InspectionResult {
  const rawScore = KITE_INSPECTION_CHECKS.reduce((sum, check) => {
    const answer = answers[check.id];
    if (answer === "pass" || answer === "na") return sum + check.weight;
    return sum;
  }, 0);

  const alerts: string[] = [];
  const caps: number[] = [];
  const missingRequiredPhotos = KITE_INSPECTION_REQUIRED_PHOTOS.filter(
    (photoId) => !(photos[photoId]?.length),
  ).length;

  if (answers.holds_pressure === "fail") {
    alerts.push("Posible fuga de aire: la cometa no mantuvo presion.");
    caps.push(60);
  }
  if (answers.leading_edge_ok === "fail") {
    alerts.push("Posible dano estructural en leading edge.");
    caps.push(55);
  }
  if (answers.struts_ok === "fail") {
    alerts.push("Posible dano o fuga en costillas.");
    caps.push(60);
  }
  if (answers.main_valve_ok === "fail") {
    alerts.push("Valvula principal requiere revision.");
    caps.push(65);
  }
  if (answers.bridles_ok === "fail" || answers.pigtails_ok === "fail") {
    alerts.push("Bridas o pigtails requieren revision antes de usar.");
    caps.push(70);
  }
  if (answers.pulleys_ok === "fail") {
    alerts.push("Poleas trabadas o gastadas.");
    caps.push(75);
  }
  if (answers.canopy_no_tears === "fail") {
    alerts.push("Rasgadura abierta o parche temporal en canopy.");
    caps.push(70);
  }
  if (answers.repairs_declared === "fail") {
    alerts.push("Hay reparaciones, danos o modificaciones sin declarar por completo.");
    caps.push(75);
  }
  if (missingRequiredPhotos >= 4) {
    alerts.push("Faltan varias fotos obligatorias del peritaje.");
    caps.push(60);
  } else if (missingRequiredPhotos >= 2) {
    alerts.push("Faltan fotos obligatorias del peritaje.");
    caps.push(75);
  }

  const maxScore = caps.length ? Math.min(...caps) : undefined;
  const score = maxScore === undefined ? rawScore : Math.min(rawScore, maxScore);

  return {
    rawScore,
    score,
    maxScore,
    label: score >= 90
      ? "Excelente"
      : score >= 80
        ? "Bueno"
        : score >= 70
          ? "Aceptable"
          : score >= 60
            ? "Regular"
            : score >= 40
              ? "Riesgoso"
              : "No recomendable",
    alerts,
  };
}

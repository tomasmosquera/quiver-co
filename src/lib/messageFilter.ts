const BLOCKED_WORDS = [
  "gmail", "hotmail", "yahoo", "outlook", "icloud", "protonmail",
  "whatsapp", "telegram", "instagram", "facebook", "tiktok",
  "wa.me", ".com", ".co", ".net", ".org", "@",
];

// Detecta 8+ dígitos consecutivos aunque tengan espacios, guiones o puntos entre ellos
const PHONE_REGEX = /(\d[\s.\-]?){8,}/;

export function filterMessage(text: string): { blocked: boolean; reason?: string } {
  const lower = text.toLowerCase();

  for (const word of BLOCKED_WORDS) {
    if (lower.includes(word)) {
      return { blocked: true, reason: "El mensaje contiene información de contacto externa no permitida." };
    }
  }

  if (PHONE_REGEX.test(text)) {
    return { blocked: true, reason: "El mensaje contiene un número de teléfono. Por seguridad, no está permitido compartir datos de contacto." };
  }

  return { blocked: false };
}

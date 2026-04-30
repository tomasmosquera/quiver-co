export type MetaConsentState = "unknown" | "granted" | "denied";

export const META_CONSENT_COOKIE = "qc_meta_consent";
export const META_CONSENT_STORAGE_KEY = "qc.meta.consent.v1";
export const META_CONSENT_EVENT = "qc:meta-consent-change";

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const META_BROWSER_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

function readCookieValue(cookieString: string, name: string): string | null {
  const prefix = `${name}=`;
  const match = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
    window.location.protocol === "https:" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function clearCookie(name: string) {
  document.cookie = [
    `${name}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
    window.location.protocol === "https:" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function getFbclidFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("fbclid");
}

function ensureFbcCookie() {
  if (readCookieValue(document.cookie, "_fbc")) return;

  const fbclid = getFbclidFromUrl();
  if (!fbclid) return;

  const value = `fb.1.${Date.now()}.${fbclid}`;
  writeCookie("_fbc", value, META_BROWSER_COOKIE_MAX_AGE);
}

function ensureFbpCookie() {
  if (readCookieValue(document.cookie, "_fbp")) return;

  const value = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1_000_000_000_000)}`;
  writeCookie("_fbp", value, META_BROWSER_COOKIE_MAX_AGE);
}

export function getMetaConsentStateFromCookieString(cookieString: string): MetaConsentState {
  const value = readCookieValue(cookieString, META_CONSENT_COOKIE);
  return value === "granted" || value === "denied" ? value : "unknown";
}

export function getMetaConsentStateFromBrowser(): MetaConsentState {
  if (typeof document === "undefined") return "unknown";

  const cookieValue = getMetaConsentStateFromCookieString(document.cookie);
  if (cookieValue !== "unknown") return cookieValue;

  if (typeof window === "undefined") return "unknown";

  try {
    const stored = window.localStorage.getItem(META_CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}

export function setMetaConsentState(nextState: Exclude<MetaConsentState, "unknown">) {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  writeCookie(META_CONSENT_COOKIE, nextState, YEAR_IN_SECONDS);

  try {
    window.localStorage.setItem(META_CONSENT_STORAGE_KEY, nextState);
  } catch {
    // Ignore storage errors. The cookie remains the source of truth.
  }

  if (nextState === "granted") {
    ensureFbcCookie();
    ensureFbpCookie();
  } else {
    clearCookie("_fbp");
    clearCookie("_fbc");
  }

  window.dispatchEvent(new Event(META_CONSENT_EVENT));
}

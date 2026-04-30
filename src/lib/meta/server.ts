import crypto from "crypto";
import { META_CONSENT_COOKIE } from "@/lib/meta/consent";

type RequestLike = {
  headers: Headers;
  url?: string;
};

type MetaServerUserData = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

type MetaTrackingSnapshot = {
  consentGranted: boolean;
  eventSourceUrl?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
};

type MetaServerEventInput = {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  customData?: Record<string, unknown>;
  userData?: MetaServerUserData;
  eventSourceUrl?: string;
  consentGranted?: boolean;
  request?: RequestLike;
};

const META_PIXEL_ID = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_API_VERSION = process.env.META_CONVERSIONS_API_VERSION ?? "v23.0";
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

function readCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;

  const prefix = `${name}=`;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeString(value?: string | null) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}

function normalizeDigits(value?: string | null) {
  return value?.replace(/\D/g, "") ?? "";
}

function normalizeCountry(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || undefined;
  }

  return headers.get("x-real-ip") ?? undefined;
}

function stripEmpty<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null) return false;
      if (typeof entry === "string" && entry.trim() === "") return false;
      if (Array.isArray(entry) && entry.length === 0) return false;
      return true;
    }),
  );
}

function buildMetaUserData(userData: MetaServerUserData) {
  return stripEmpty({
    em: userData.email ? sha256(normalizeEmail(userData.email)) : undefined,
    ph: userData.phone ? sha256(normalizeDigits(userData.phone)) : undefined,
    fn: userData.firstName ? sha256(normalizeString(userData.firstName)) : undefined,
    ln: userData.lastName ? sha256(normalizeString(userData.lastName)) : undefined,
    ct: userData.city ? sha256(normalizeString(userData.city)) : undefined,
    st: userData.state ? sha256(normalizeString(userData.state)) : undefined,
    country: userData.country ? sha256(normalizeCountry(userData.country)) : undefined,
    external_id: userData.externalId ? sha256(normalizeString(userData.externalId)) : undefined,
    client_ip_address: userData.clientIpAddress,
    client_user_agent: userData.clientUserAgent,
    fbp: userData.fbp,
    fbc: userData.fbc,
  });
}

export function splitFullName(fullName?: string | null) {
  const normalized = fullName?.trim() ?? "";
  if (!normalized) return { firstName: undefined, lastName: undefined };

  const parts = normalized.split(/\s+/);
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
}

export function splitCityAndState(location?: string | null) {
  if (!location) return { city: undefined, state: undefined };

  const [city, state] = location.split(",").map((part) => part.trim());
  return {
    city: city || undefined,
    state: state || undefined,
  };
}

export function getMetaConsentFromRequest(request: RequestLike) {
  return readCookieValue(request.headers.get("cookie"), META_CONSENT_COOKIE) === "granted";
}

export function captureMetaTrackingSnapshot(
  request: RequestLike,
  eventSourceUrl?: string,
): MetaTrackingSnapshot {
  return {
    consentGranted: getMetaConsentFromRequest(request),
    eventSourceUrl,
    clientIpAddress: getClientIp(request.headers),
    clientUserAgent: request.headers.get("user-agent") ?? undefined,
    fbp: readCookieValue(request.headers.get("cookie"), "_fbp") ?? undefined,
    fbc: readCookieValue(request.headers.get("cookie"), "_fbc") ?? undefined,
  };
}

export async function sendMetaServerEvent(input: MetaServerEventInput) {
  if (!META_PIXEL_ID || !META_ACCESS_TOKEN) return;

  const snapshot = input.request
    ? captureMetaTrackingSnapshot(input.request, input.eventSourceUrl)
    : undefined;

  const consentGranted = input.consentGranted ?? snapshot?.consentGranted ?? false;
  if (!consentGranted) return;

  const payload = stripEmpty({
    data: [
      stripEmpty({
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl ?? snapshot?.eventSourceUrl,
        user_data: buildMetaUserData({
          ...input.userData,
          clientIpAddress:
            input.userData?.clientIpAddress ?? snapshot?.clientIpAddress,
          clientUserAgent:
            input.userData?.clientUserAgent ?? snapshot?.clientUserAgent,
          fbp: input.userData?.fbp ?? snapshot?.fbp,
          fbc: input.userData?.fbc ?? snapshot?.fbc,
        }),
        custom_data: stripEmpty(input.customData ?? {}),
      }),
    ],
    test_event_code: META_TEST_EVENT_CODE,
  });

  const endpoint = new URL(`https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`);
  endpoint.searchParams.set("access_token", META_ACCESS_TOKEN);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("[Meta CAPI] Request failed", response.status, details);
    }
  } catch (error) {
    console.error("[Meta CAPI] Unexpected error", error);
  }
}

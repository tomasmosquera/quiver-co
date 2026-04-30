import { getMetaConsentStateFromBrowser } from "@/lib/meta/consent";

type MetaEventPayload = Record<
  string,
  string | number | boolean | null | undefined | string[] | number[]
>;

function canTrackInBrowser() {
  return typeof window !== "undefined" && getMetaConsentStateFromBrowser() === "granted";
}

function queueMetaCall(callback: () => void) {
  if (typeof window === "undefined") return;

  if (window.__metaPixelReady && typeof window.fbq === "function") {
    callback();
    return;
  }

  window.__metaPixelQueue = window.__metaPixelQueue ?? [];
  window.__metaPixelQueue.push(callback);
}

export function generateMetaEventId(prefix = "meta") {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${prefix}-${Date.now()}-${randomPart}`;
}

export function getCurrentMetaSourceUrl() {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

export function trackMetaPageView() {
  if (!canTrackInBrowser()) return;

  queueMetaCall(() => {
    window.fbq?.("track", "PageView");
  });
}

export function trackMetaEvent(
  eventName: string,
  payload: MetaEventPayload = {},
  options: { eventId?: string } = {},
) {
  const eventId = options.eventId ?? generateMetaEventId(eventName.toLowerCase());
  if (!canTrackInBrowser()) return eventId;

  queueMetaCall(() => {
    window.fbq?.("track", eventName, payload, { eventID: eventId });
  });

  return eventId;
}

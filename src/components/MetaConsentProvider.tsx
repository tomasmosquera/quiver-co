"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import MetaPixel from "@/components/MetaPixel";
import {
  META_CONSENT_EVENT,
  getMetaConsentStateFromBrowser,
  setMetaConsentState,
  type MetaConsentState,
} from "@/lib/meta/consent";

type MetaConsentContextValue = {
  consent: MetaConsentState;
  marketingEnabled: boolean;
  openPreferences: () => void;
};

const MetaConsentContext = createContext<MetaConsentContextValue>({
  consent: "unknown",
  marketingEnabled: false,
  openPreferences: () => undefined,
});

export function useMetaConsent() {
  return useContext(MetaConsentContext);
}

export default function MetaConsentProvider({
  children,
  marketingEnabled,
  pixelId,
}: {
  children: ReactNode;
  marketingEnabled: boolean;
  pixelId: string;
}) {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const consent = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => undefined;

      const handleChange = () => onStoreChange();
      window.addEventListener("storage", handleChange);
      window.addEventListener(META_CONSENT_EVENT, handleChange);

      return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener(META_CONSENT_EVENT, handleChange);
      };
    },
    () => (marketingEnabled ? getMetaConsentStateFromBrowser() : "denied"),
    () => (marketingEnabled ? "unknown" : "denied"),
  );
  const bannerOpen = marketingEnabled && (preferencesOpen || consent === "unknown");

  function acceptMarketing() {
    setMetaConsentState("granted");
    setPreferencesOpen(false);
  }

  function rejectMarketing() {
    setMetaConsentState("denied");
    setPreferencesOpen(false);
  }

  function openPreferences() {
    if (!marketingEnabled) return;
    setPreferencesOpen(true);
  }

  function closePreferences() {
    if (consent === "unknown") return;
    setPreferencesOpen(false);
  }

  return (
    <MetaConsentContext.Provider
      value={{
        consent,
        marketingEnabled,
        openPreferences,
      }}
    >
      {children}
      {marketingEnabled ? (
        <>
          <MetaPixel pixelId={pixelId} consent={consent} />
          <CookieConsentBanner
            open={bannerOpen}
            consent={consent}
            onAccept={acceptMarketing}
            onReject={rejectMarketing}
            onClose={closePreferences}
          />
        </>
      ) : null}
    </MetaConsentContext.Provider>
  );
}

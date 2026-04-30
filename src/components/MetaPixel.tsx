"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import type { MetaConsentState } from "@/lib/meta/consent";
import { trackMetaPageView } from "@/lib/meta/browser";

export default function MetaPixel({
  pixelId,
  consent,
}: {
  pixelId: string;
  consent: MetaConsentState;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const isEnabled = Boolean(pixelId) && consent === "granted";

  useEffect(() => {
    if (!isEnabled) return;
    trackMetaPageView();
  }, [isEnabled, pathname, queryString]);

  if (!isEnabled) return null;

  return (
    <Script id="meta-pixel-bootstrap" strategy="afterInteractive">
      {`
        window.__metaPixelQueue = window.__metaPixelQueue || [];
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', ${JSON.stringify(pixelId)});
        window.__metaPixelReady = true;
        if (Array.isArray(window.__metaPixelQueue)) {
          while (window.__metaPixelQueue.length) {
            try {
              var callback = window.__metaPixelQueue.shift();
              if (typeof callback === 'function') callback();
            } catch (error) {
              console.error('[Meta Pixel] Queue flush failed', error);
            }
          }
        }
      `}
    </Script>
  );
}

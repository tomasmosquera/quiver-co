"use client";

import { useEffect, useRef } from "react";

interface Props {
  publicKey: string;
  reference: string;
  amountInCents: number;
  signature: string;
  redirectUrl: string;
}

export default function WompiWidget({ publicKey, reference, amountInCents, signature, redirectUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", publicKey);
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-amount-in-cents", String(amountInCents));
    script.setAttribute("data-reference", reference);
    script.setAttribute("data-signature:integrity", signature);
    script.setAttribute("data-redirect-url", redirectUrl);

    containerRef.current.appendChild(script);
  }, [publicKey, reference, amountInCents, signature, redirectUrl]);

  return (
    <div ref={containerRef} className="w-full [&>form]:w-full [&>form>button]:w-full" />
  );
}

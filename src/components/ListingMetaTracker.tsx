"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta/browser";

export default function ListingMetaTracker({
  listingId,
  title,
  discipline,
  price,
  currency,
}: {
  listingId: string;
  title: string;
  discipline: string;
  price: number;
  currency: string;
}) {
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_ids: [listingId],
      content_name: title,
      content_type: "product",
      content_category: discipline,
      value: price,
      currency,
    });
  }, [currency, discipline, listingId, price, title]);

  return null;
}

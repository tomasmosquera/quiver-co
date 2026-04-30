"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta/browser";

export default function CatalogMetaTracker({
  searchString,
  results,
  section,
  equipmentType,
}: {
  searchString: string;
  results: number;
  section?: string;
  equipmentType?: string;
}) {
  useEffect(() => {
    const trimmed = searchString.trim();
    if (!trimmed) return;

    trackMetaEvent("Search", {
      search_string: trimmed,
      content_category: section,
      content_type: equipmentType,
      num_items: results,
    });
  }, [equipmentType, results, searchString, section]);

  return null;
}

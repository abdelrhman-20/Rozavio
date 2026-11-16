import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

// Needed for the static export (GitHub Pages build).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Needs the real address; stays empty until NEXT_PUBLIC_SITE_URL is set.
  return siteUrl ? [{ url: siteUrl, changeFrequency: "monthly", priority: 1 }] : [];
}

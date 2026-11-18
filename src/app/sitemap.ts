import type { MetadataRoute } from "next";
import { getServices } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import { LOCALES } from "@/lib/types";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "services/", "checklist/", "portals/", "map/", "about/"];
  const serviceSlugs = getServices().map((s) => `services/${s.slug}/`);
  return LOCALES.flatMap((lang) =>
    [...pages, ...serviceSlugs].map((path) => ({
      url: `${SITE_URL}/${lang}/${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.startsWith("services/") ? 0.8 : 0.6,
    }))
  );
}

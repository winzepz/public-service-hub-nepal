import fs from "node:fs";
import path from "node:path";
import type { Locale, Portal, SearchItem, Service } from "./types";
import { categoryLabel, CATEGORIES } from "./i18n";

const CONTENT_DIR = path.join(process.cwd(), "content");
const SERVICES_DIR = path.join(CONTENT_DIR, "services");

let serviceCache: Service[] | null = null;
let portalCache: Portal[] | null = null;

export const getServices = (): Service[] => {
  if (serviceCache) return serviceCache;
  const order = CATEGORIES.map((c) => c.id as string);
  serviceCache = fs
    .readdirSync(SERVICES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(SERVICES_DIR, file), "utf8")) as Service)
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || a.title.en.localeCompare(b.title.en));
  return serviceCache;
};

export const getService = (slug: string) => getServices().find((s) => s.slug === slug);

export const getPortals = (): Portal[] => {
  if (portalCache) return portalCache;
  portalCache = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "portals.json"), "utf8")) as Portal[];
  return portalCache;
};

export const getPortalMap = () => new Map(getPortals().map((p) => [p.id, p]));

export const buildSearchIndex = (locale: Locale): SearchItem[] => {
  const other: Locale = locale === "en" ? "ne" : "en";
  return getServices().map((s) => ({
    slug: s.slug,
    title: s.title[locale],
    altTitle: s.title[other],
    summary: s.summary[locale],
    category: s.category,
    icon: s.icon,
    haystack: [
      s.summary.en,
      s.summary.ne,
      s.authority.en,
      s.authority.ne,
      categoryLabel(s.category, "en"),
      categoryLabel(s.category, "ne"),
      ...s.keywords,
    ].join(" "),
  }));
};

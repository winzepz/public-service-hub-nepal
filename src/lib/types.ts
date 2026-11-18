export const LOCALES = ["en", "ne"] as const;
export type Locale = (typeof LOCALES)[number];

export type Bilingual = { en: string; ne: string };

export type CategoryId = "identity" | "travel" | "transport" | "civil" | "tax-business" | "land-property";

export type Fee = { label: Bilingual; amount: Bilingual };

export type Service = {
  slug: string;
  category: CategoryId;
  icon: string;
  popular?: boolean;
  lastReviewed: string;
  title: Bilingual;
  summary: Bilingual;
  authority: Bilingual;
  keywords: string[];
  eligibility: Bilingual[];
  where: Bilingual[];
  documents: Bilingual[];
  steps: Bilingual[];
  fees: Fee[];
  time: Bilingual;
  portals: string[];
  tips: Bilingual[];
};

export type Portal = {
  id: string;
  name: Bilingual;
  authority: Bilingual;
  url: string;
  category: CategoryId | "general";
  description: Bilingual;
  note?: Bilingual;
};

export type SearchItem = {
  slug: string;
  title: string;
  altTitle: string;
  summary: string;
  category: CategoryId;
  icon: string;
  haystack: string;
};

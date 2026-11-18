import type { SearchItem } from "./types";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

type Prepared = { item: SearchItem; title: string; titleWords: string[]; hay: string };

const cache = new WeakMap<SearchItem[], Prepared[]>();

const prepare = (items: SearchItem[]) => {
  const cached = cache.get(items);
  if (cached) return cached;
  const prepared = items.map((item) => {
    const title = normalize(`${item.title} ${item.altTitle}`);
    return { item, title, titleWords: title.split(" "), hay: normalize(item.haystack) };
  });
  cache.set(items, prepared);
  return prepared;
};

/** Instant keyword match in both scripts: every query word must appear; title hits rank higher. */
export const searchServices = (items: SearchItem[], query: string, limit = 8): SearchItem[] => {
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];
  const scored: { item: SearchItem; score: number }[] = [];
  for (const entry of prepare(items)) {
    let score = 0;
    let matchedAll = true;
    for (const word of words) {
      if (entry.titleWords.some((t) => t.startsWith(word))) score += 6;
      else if (entry.title.includes(word)) score += 4;
      else if (entry.hay.includes(word)) score += 1;
      else {
        matchedAll = false;
        break;
      }
    }
    if (matchedAll) scored.push({ item: entry.item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((s) => s.item);
};

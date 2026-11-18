// Validates every guide in content/services and the portal list.
// Run: npm run validate  (also runs automatically before each Render build)
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const servicesDir = path.join(root, "content", "services");
const portals = JSON.parse(fs.readFileSync(path.join(root, "content", "portals.json"), "utf8"));

const CATEGORIES = ["identity", "travel", "transport", "civil", "tax-business", "land-property"];
const ICONS = ["passport", "id-card", "citizenship", "police", "licence", "car", "bluebook", "birth", "marriage", "family", "ballot", "work-abroad", "graduation", "pan", "company", "land"];
const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const isBilingual = (v) => v && typeof v.en === "string" && v.en.trim() && typeof v.ne === "string" && v.ne.trim();
const hasDevanagari = (s) => /[ऀ-ॿ]/.test(s);

const portalIds = new Set();
for (const p of portals) {
  if (portalIds.has(p.id)) err("portals.json", `duplicate id "${p.id}"`);
  portalIds.add(p.id);
  let host = "";
  try {
    const u = new URL(p.url);
    host = u.hostname;
    if (u.protocol !== "https:") err("portals.json", `${p.id} must use https`);
  } catch {
    err("portals.json", `${p.id} has an invalid url`);
  }
  if (!host.endsWith(".gov.np")) err("portals.json", `${p.id} is not a .gov.np domain (${host})`);
  for (const k of ["name", "authority", "description"]) if (!isBilingual(p[k])) err("portals.json", `${p.id}.${k} needs en and ne`);
}

const slugs = new Set();
for (const file of fs.readdirSync(servicesDir).filter((f) => f.endsWith(".json"))) {
  let s;
  try {
    s = JSON.parse(fs.readFileSync(path.join(servicesDir, file), "utf8"));
  } catch (e) {
    err(file, `invalid JSON (${e.message})`);
    continue;
  }
  if (`${s.slug}.json` !== file) err(file, `slug "${s.slug}" must match file name`);
  if (slugs.has(s.slug)) err(file, "duplicate slug");
  slugs.add(s.slug);
  if (!CATEGORIES.includes(s.category)) err(file, `unknown category "${s.category}"`);
  if (!ICONS.includes(s.icon)) err(file, `unknown icon "${s.icon}"`);
  if (!/^\d{4}-\d{2}$/.test(s.lastReviewed || "")) err(file, "lastReviewed must be YYYY-MM");
  for (const k of ["title", "summary", "authority", "time"]) {
    if (!isBilingual(s[k])) err(file, `${k} needs en and ne`);
    else if (!hasDevanagari(s[k].ne)) err(file, `${k}.ne should be written in Nepali`);
  }
  for (const k of ["eligibility", "where", "documents", "steps", "tips"]) {
    if (!Array.isArray(s[k])) err(file, `${k} must be an array`);
    else s[k].forEach((item, i) => !isBilingual(item) && err(file, `${k}[${i}] needs en and ne`));
  }
  for (const k of ["where", "documents", "steps"]) if (Array.isArray(s[k]) && s[k].length === 0) err(file, `${k} cannot be empty`);
  if (!Array.isArray(s.fees) || !s.fees.length) err(file, "fees cannot be empty");
  else s.fees.forEach((f, i) => (!isBilingual(f.label) || !isBilingual(f.amount)) && err(file, `fees[${i}] needs label and amount in en and ne`));
  if (!Array.isArray(s.keywords) || !s.keywords.length) err(file, "keywords cannot be empty");
  for (const id of s.portals || []) if (!portalIds.has(id)) err(file, `unknown portal "${id}"`);
}

if (errors.length) {
  console.error(`Content validation failed (${errors.length}):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`Content OK: ${slugs.size} services, ${portalIds.size} portals.`);

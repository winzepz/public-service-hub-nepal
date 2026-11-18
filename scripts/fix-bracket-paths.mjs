// Post-build step for static hosts that do not URL-decode request paths (e.g. Render).
// Next.js puts route chunks under folders like "_next/static/chunks/app/[lang]/", and browsers
// request them as "%5Blang%5D". This copies every bracketed path to its percent-encoded twin
// so both spellings resolve. Hosts that do decode paths keep using the originals.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const base = path.join(root, "out", "_next");

if (!fs.existsSync(base)) {
  console.error("out/_next not found. Run `next build` first.");
  process.exit(1);
}

const encode = (p) => p.replace(/\[/g, "%5B").replace(/\]/g, "%5D");
let copied = 0;

const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.includes("%5B")) walk(full);
      continue;
    }
    const rel = path.relative(base, full);
    if (!/[[\]]/.test(rel)) continue;
    const target = path.join(base, encode(rel));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(full, target);
    copied++;
  }
};

walk(base);
console.log(`Encoded-path copies created: ${copied}`);

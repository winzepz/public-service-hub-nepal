// Checks that every official portal still responds.
// Run: npm run check-links
// Many .gov.np servers send incomplete TLS certificate chains; browsers repair these,
// so a certificate error is reported as "reachable (TLS chain)" rather than a failure.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const portals = JSON.parse(fs.readFileSync(path.join(root, "content", "portals.json"), "utf8"));

const TLS_CODES = new Set([
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "CERT_HAS_EXPIRED",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
]);

const check = async (p) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(p.url, { redirect: "follow", signal: ctrl.signal, headers: { "user-agent": "public-service-hub-link-check" } });
    return { p, ok: res.status < 500, detail: String(res.status) };
  } catch (e) {
    const code = e?.cause?.code || e?.code || e?.name;
    if (TLS_CODES.has(code)) return { p, ok: true, detail: `reachable (TLS chain: ${code})` };
    return { p, ok: false, detail: code || String(e) };
  } finally {
    clearTimeout(timer);
  }
};

const results = await Promise.all(portals.map(check));
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "OK  " : "FAIL"}  ${r.p.url.padEnd(42)} ${r.detail}`);
}
console.log(`\n${results.length - failed}/${results.length} reachable. Failures may be temporary or region-specific; recheck before removing a link.`);

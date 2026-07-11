/* Assemble the deployable static tree for academy.milpa.lat.
 *
 * The repo-dev sources reference each other by RELATIVE path (../artifacts/,
 * ../site/, ./learn.js, …), which is file://-friendly for local inspection.
 * The deployed site is a single flat tree served from academy.milpa.lat/, so
 * this build:
 *   - copies site/ (portal es/en + atomo es/en + sitemap/robots/llms) → the
 *     _deploy/ ROOT — the portal lands at / (this is the fix: previously the
 *     R1-only build put the atom at root; the portal is the actual home),
 *   - copies the app dirs (learn/, labs/, artifacts/, webinars/) verbatim —
 *     es-only in Plan A, deployed so the portal nav resolves,
 *   - copies the shared root assets (academy.css, academy.js, i18n.js,
 *     analytics.js, inline-code.js) and the shared dirs (curriculum/, assets/)
 *     that the portal, the atom, and the apps all reference by relative path,
 *   - rewrites every relative ../ reference in every deployed *.html to an
 *     absolute path from the deploy root (longest-prefix / most-specific
 *     first — see rewriteHtml below),
 *   - drops the atom's "runtime x-ray" cross-link (kept from the R1 build:
 *     its target isn't wired for direct deep-linking in this launch),
 *   - writes the CNAME.
 *
 * Deterministic, zero-dependency, inspectable — same discipline as
 * gen-site.mjs. Run AFTER `node scripts/gen-site.mjs`. Output (_deploy/) is
 * git-ignored; CI rebuilds it on every deploy.
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "_deploy");
const DOMAIN = "academy.milpa.lat";

const APP_DIRS = ["learn", "labs", "artifacts", "webinars"];
const SHARED_DIRS = ["curriculum", "assets"];
const SHARED_FILES = ["academy.css", "academy.js", "i18n.js", "analytics.js", "inline-code.js"];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. site/ contents become the deploy root: portal at /, /en/, atomo at
//    /atomo/ + /en/atomo/, plus sitemap.xml/robots.txt/llms.txt/en/llms.txt.
cpSync(path.join(ROOT, "site"), OUT, { recursive: true });

// 2. App dirs, verbatim (es-only — Plan B bilingualizes them). Exception:
//    learn/index.html is the obsolete hash-router app-shell (Plan B moved
//    the learn-index to SSG). site/ already placed the SSG learn-index at
//    OUT/learn/index.html above; copying the app-dir verbatim would clobber
//    it with the blank shell. So the learn/ copy SKIPS that one file — the
//    SSG page wins — while learn.js/learn.css (the hydration bundle the SSG
//    page still loads) keep shipping. Unit pages (learn/<t>/<u>/) live only
//    under site/ and don't collide.
const LEARN_SHELL = path.join(ROOT, "learn", "index.html");
for (const dir of APP_DIRS) {
  const options = { recursive: true };
  if (dir === "learn") options.filter = (src) => path.resolve(src) !== LEARN_SHELL;
  cpSync(path.join(ROOT, dir), path.join(OUT, dir), options);
}

// 3. Shared dirs referenced by relative path from the portal/atom/apps.
for (const dir of SHARED_DIRS) {
  cpSync(path.join(ROOT, dir), path.join(OUT, dir), { recursive: true });
}

// 4. Shared root files referenced by relative path from the portal/atom/apps.
for (const file of SHARED_FILES) {
  cpSync(path.join(ROOT, file), path.join(OUT, file));
}

// 5. Rewrite every deployed page: drop the atom's runtime cross-link, then
//    flatten every relative ../ reference to an absolute deploy-root path.
for (const file of listHtmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  writeFileSync(file, rewriteHtml(html), "utf8");
}

// 6. Custom domain for GitHub Pages.
writeFileSync(path.join(OUT, "CNAME"), `${DOMAIN}\n`, "utf8");

console.log(
  "build-deploy: assembled _deploy/ for",
  DOMAIN,
  "— portal at /, /en/, atomo at /atomo/, /en/atomo/, apps:",
  APP_DIRS.join(", "),
  "+ shared assets + CNAME",
);

function listHtmlFiles(dir) {
  return readdirSync(dir, { recursive: true })
    .map((entry) => path.join(dir, entry))
    .filter((entry) => entry.endsWith(".html") && statSync(entry).isFile());
}

/* Rewrite order — most specific first, else a generic ../ collapse first
 * would corrupt ../site/ into /site/ instead of /.
 *
 * 1. Drop the atom's runtime cross-link (target not deployed for direct
 *    deep-linking in this launch) — text-only, no href, no dead link.
 * 2. ../site/  → /   (the apps' "back home" link → the portal root, a
 *    Task 6a repoint; must run BEFORE the generic collapse below).
 * 3. Any remaining run of one-or-more ../ segments → /   (a single regex
 *    pass handles 1-, 2- and 3-level-deep sources — e.g. site/en/atomo/
 *    is three levels from the repo root — without leaving a stray ../ or
 *    producing a doubled // the way chaining fixed-length "../../" then
 *    "../" replacements would for odd/triple depths).
 *
 * Already-absolute refs (/…, https://…, #…) and same-dir refs (./…) are
 * left untouched — they resolve correctly wherever the file lands.
 */
function rewriteHtml(html) {
  html = html.replace(/<a href="[^"]*artifacts\/#runtime">([^<]*)<\/a>/g, "$1");
  html = html.replaceAll("../site/", "/");
  html = html.replace(/(?:\.\.\/)+/g, "/");
  return html;
}

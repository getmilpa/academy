/* Assemble the deployable static tree for academy.milpa.lat (R1 launch).
 *
 * The repo-dev output (site/) references shared assets by RELATIVE path
 * (../artifacts/…), which is file://-friendly for local inspection. The
 * deployed site serves the R1 pages at /atomo/ and /en/atomo/ with the
 * shared assets at /artifacts/, so this build:
 *   - copies site/ → _deploy/ (es at /atomo/, en at /en/atomo/, plus sitemap/robots/llms),
 *   - copies the three shared runtime assets → _deploy/artifacts/,
 *   - rewrites the pages' ../artifacts/ refs to absolute /artifacts/ (depth-agnostic),
 *   - drops the "runtime x-ray" cross-link (its target, the interactive gallery,
 *     is not part of the R1-only launch — rendered as plain text, no dead link),
 *   - writes the CNAME.
 *
 * Deterministic, zero-dependency, inspectable — same discipline as gen-site.mjs.
 * Run AFTER `node scripts/gen-site.mjs`. Output (_deploy/) is git-ignored; CI
 * rebuilds it on every deploy.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "_deploy");
const DOMAIN = "academy.milpa.lat";
const SHARED_ASSETS = ["artifacts.css", "artifacts-core.js", "milpa-artifact.js"];
const PAGES = ["atomo/index.html", "en/atomo/index.html"];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. site/ contents become the deploy root (atomo/ at /atomo/, en/atomo/ at /en/atomo/, SEO files).
cpSync(path.join(ROOT, "site"), OUT, { recursive: true });

// 2. Shared runtime assets → /artifacts/ (only what the R1 pages consume, not the gallery).
mkdirSync(path.join(OUT, "artifacts"), { recursive: true });
for (const asset of SHARED_ASSETS) {
  cpSync(path.join(ROOT, "artifacts", asset), path.join(OUT, "artifacts", asset));
}

// 3. Rewrite the two pages for the deploy layout.
for (const rel of PAGES) {
  const file = path.join(OUT, rel);
  let html = readFileSync(file, "utf8");
  // Drop the runtime cross-link (target not deployed in the R1-only launch) → keep the text.
  html = html.replace(/<a href="[^"]*artifacts\/#runtime">([^<]*)<\/a>/g, "$1");
  // Relative shared-asset refs → absolute, depth-agnostic (longer prefix first).
  html = html
    .replaceAll("../../../artifacts/", "/artifacts/")
    .replaceAll("../../artifacts/", "/artifacts/")
    .replaceAll("../artifacts/", "/artifacts/");
  writeFileSync(file, html, "utf8");
}

// 4. Custom domain for GitHub Pages.
writeFileSync(path.join(OUT, "CNAME"), `${DOMAIN}\n`, "utf8");

console.log("build-deploy: assembled _deploy/ for", DOMAIN, "—", PAGES.join(", "), "+ /artifacts/{" + SHARED_ASSETS.join(",") + "} + CNAME");

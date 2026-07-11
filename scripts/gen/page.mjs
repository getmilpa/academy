/* Helpers de página compartidos por el SSG-lite: <head> (charset, viewport,
   title, description, canonical, hreflang, bundles CDN, jsonld opcional) y el
   doctype/<html> de apertura. Node ESM, cero dependencias, determinista —
   nada de Date/Math.random, orden de claves estable. Extraído de
   gen-site.mjs (el <head> del átomo) para reusarse en futuros tipos de
   página (portal, unit pages) sin duplicar el bloque. */

const CDN = "https://cdn.jsdelivr.net/npm/@milpa/design@0.9.0";

export function bundleLinks() {
  return [
    "dist/milpa-tokens.css",
    "motion/milpa-motion.css",
    "primitives/milpa-primitives.css",
    "components/milpa-components.css",
    "artifacts/milpa-artifacts.css",
    "layouts/milpa-layouts.css",
  ].map((p) => `<link rel="stylesheet" href="${CDN}/${p}">`).join("\n");
}

export function hreflangLinks(alternates) {
  return Object.entries(alternates)
    .map(([hl, url]) => `<link rel="alternate" hreflang="${hl}" href="${url}">`)
    .join("\n");
}

/* className = clase de contexto de scroll para artifacts.css (anti-fuga):
   "wb-app" (shell que bloquea el scroll del documento — la galería),
   "wb-doc" (documento fluido — el átomo standalone). Vacío = página que no
   carga artifacts.css a nivel de página (portal, learn, labs). */
export function htmlOpen(lang, className = "") {
  const cls = className ? ` class="${className}"` : "";
  return `<!doctype html>\n<html lang="${lang}${lang === "es" ? "-MX" : ""}"${cls} data-theme="dark">`;
}

export function renderHead({ lang, title, description, canonical, alternates, jsonld, extraHead }) {
  return [
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${canonical}">`,
    hreflangLinks(alternates),
    bundleLinks(),
    extraHead || "",
    jsonld ? `<script type="application/ld+json">${jsonld}</script>` : "",
    "</head>",
  ].filter(Boolean).join("\n");
}

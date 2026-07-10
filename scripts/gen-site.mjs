/* SSG-lite: genera site/atomo/index.html (es) y site/en/atomo/index.html (en) para el
   artifact #atomo a partir de la fuente bilingüe única artifacts/content/atomo.content.mjs.

   Node ESM, cero dependencias, determinista: nada de Date/timestamps, orden de
   claves estable, salida de string estable. Correr dos veces produce bytes
   idénticos — así site/ committeado queda limpio en un re-gen. */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ATOMO } from "../artifacts/content/atomo.content.mjs";
import { htmlOpen, renderHead } from "./gen/page.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["es", "en"];
const BASE = "https://academy.milpa.lat"; // canonical origin

function urlFor(lang) {
  return lang === "es" ? `${BASE}/atomo/` : `${BASE}/en/atomo/`;
}

function pathFor(lang) {
  return lang === "es" ? "site/atomo/index.html" : "site/en/atomo/index.html";
}

/* Prefijo relativo hacia academy/artifacts/ desde cada página emitida.
   site/atomo/index.html (es) está a dos niveles de academy/; site/en/atomo/index.html
   (en) está a tres niveles. Hardcodear "../../artifacts/" en ambas rompe la página en. */
function assetPrefix(lang) {
  return lang === "es" ? "../.." : "../../..";
}

function stage(lang, id, label) {
  return `<div class="mui-pipeline__stage" data-stage="${id}"><span class="mui-pipeline__label">${label[lang]}</span><p class="mui-pipeline__note"></p></div>`;
}

function pipelineColumn(lang, asset, surfaceId, surface) {
  const stages = ATOMO.stages.map((item) => stage(lang, item.id, item.label)).join("\n                ");
  return `          <section class="wb-surface-column" data-surface="${surfaceId}" aria-label="${surface.sectionAriaLabel[lang]}">
            <h2 class="wb-surface-column__title">${surface.columnTitle[lang]}</h2>
            <p class="wb-surface-column__invocation" id="inv-${surfaceId}"><code>${surface.invocation}</code></p>
            <div class="mui-pipeline mui-pipeline--vertical" id="pipe-${surfaceId}" aria-label="${surface.pipelineAriaLabel[lang]}">
              <div class="mui-pipeline__track" style="--_pipeline-progress: 0">
                <span class="mui-pipeline__marker" aria-hidden="true"></span>
                ${stages}
              </div>
            </div>
            <p class="wb-surface-column__status" id="status-${surfaceId}" role="status" aria-live="polite">${surface.initialStatus[lang]}</p>
          </section>`;
}

/* Estructura estática interior de <milpa-artifact id="atomo-artifact">, la
   MISMA que hidrata milpa-artifact.js (artifacts/index.html, bloque #atomo).
   data-stage, data-surface, ids de pipeline/status/scope-toggle: idénticos
   entre es/en — únicamente cambia el texto visible. */
function renderAtomo(lang, asset) {
  const runtimeHref = `${asset}/artifacts/#runtime`;
  const warning = ATOMO.warning[lang].replace("{runtimeHref}", runtimeHref);
  const guaranteeRows = ATOMO.guarantees.rows
    .map((row) => `            <tr><td>${row.surface}</td><td>${row.confirm[lang]}</td><td>${row.scopes[lang]}</td></tr>`)
    .join("\n");
  const sourceItems = ATOMO.sources.items.map((item) => `            <li>${item[lang]}</li>`).join("\n");

  return `<header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${ATOMO.badges.artifact[lang]}</span>
            <span class="mui-badge mui-badge--secondary">${ATOMO.badges.kind[lang]}</span>
          </div>
          <h1 id="atomo-title">${ATOMO.title[lang]}</h1>
          <p>${ATOMO.lede[lang]}</p>
        </header>

        <article class="wb-atom-card" aria-label="${ATOMO.atomCard.ariaLabel[lang]}">
          <p class="wb-atom-card__name"><code>${ATOMO.atomCard.name}</code></p>
          <ul class="wb-atom-card__chips">
            <li class="mui-badge mui-badge--warning">${ATOMO.atomCard.chips.mutating}</li>
            <li class="mui-badge mui-badge--warning">${ATOMO.atomCard.chips.requiresConfirmation}</li>
            <li class="mui-badge mui-badge--secondary">${ATOMO.atomCard.chips.scopes}</li>
            <li class="mui-badge mui-badge--secondary">${ATOMO.atomCard.chips.handler}</li>
          </ul>
        </article>

        <div class="wb-surface-controls" role="group" aria-label="${ATOMO.surfaceControls.groupLabel[lang]}">
          <button class="mui-btn mui-btn--lg mui-btn--primary wb-surface" type="button" data-surface="cli">${ATOMO.surfaceControls.buttons.cli[lang]}</button>
          <button class="mui-btn mui-btn--lg mui-btn--secondary wb-surface" type="button" data-surface="mcp">${ATOMO.surfaceControls.buttons.mcp[lang]}</button>
          <button class="mui-btn mui-btn--lg mui-btn--secondary wb-surface" type="button" data-surface="http">${ATOMO.surfaceControls.buttons.http[lang]}</button>
          <label class="mui-choice wb-scope-toggle">
            <input class="mui-switch" id="scope-toggle" type="checkbox" role="switch">
            <span>${ATOMO.surfaceControls.toggleLabel[lang]}</span>
          </label>
        </div>

        <div class="mui-callout mui-callout--warning" role="note">
          <p><strong>${ATOMO.warning.lead[lang]}</strong> ${warning}</p>
        </div>

        <div class="wb-projection">
${pipelineColumn(lang, asset, "cli", ATOMO.surfaces.cli)}
${pipelineColumn(lang, asset, "mcp", ATOMO.surfaces.mcp)}
${pipelineColumn(lang, asset, "http", ATOMO.surfaces.http)}
        </div>

        <table class="mui-table mui-table--compact wb-guarantees">
          <caption>${ATOMO.guarantees.caption[lang]}</caption>
          <thead><tr><th scope="col">${ATOMO.guarantees.headers.surface[lang]}</th><th scope="col">${ATOMO.guarantees.headers.confirm[lang]}</th><th scope="col">${ATOMO.guarantees.headers.scopes[lang]}</th></tr></thead>
          <tbody id="atomo-matrix">
${guaranteeRows}
          </tbody>
        </table>

        <div class="wb-lesson mui-callout" role="note">
          <p>${ATOMO.lesson[lang]}</p>
        </div>

        <details class="wb-source">
          <summary>${ATOMO.sources.summary[lang]}</summary>
          <p>${ATOMO.sources.scope[lang]}</p>
          <h3>${ATOMO.sources.heading[lang]}</h3>
          <ul>
${sourceItems}
          </ul>
        </details>`;
}

function jsonld(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    inLanguage: lang,
    name: ATOMO.title[lang],
    description: ATOMO.hero[lang],
    about: ATOMO.jsonld.about,
    isBasedOn: ATOMO.jsonld.isBasedOn,
  });
}

function page(lang) {
  const asset = assetPrefix(lang);
  const head = renderHead({
    lang,
    title: `${ATOMO.title[lang]} · Milpa`,
    description: ATOMO.hero[lang],
    canonical: urlFor(lang),
    alternates: { es: urlFor("es"), en: urlFor("en"), "x-default": urlFor("es") },
    jsonld: jsonld(lang),
    extraHead: `<link rel="stylesheet" href="${asset}/artifacts/artifacts.css">`,
  });
  return `${htmlOpen(lang)}
${head}
<body>
<main>
<h1 class="wb-hero">${ATOMO.hero[lang]}</h1>
<p class="wb-intro">${ATOMO.intro[lang]}</p>
<milpa-artifact id="atomo-artifact" lang="${lang}">
        ${renderAtomo(lang, asset)}
      </milpa-artifact>
</main>
<script src="${asset}/artifacts/artifacts-core.js" defer></script>
<script src="${asset}/artifacts/milpa-artifact.js" defer></script>
</body>
</html>
`;
}

/* Sitemap + robots + llms.txt: los archivos que hacen el sitio legible por
   crawlers y agentes. Determinismo: sitemap.xml NO lleva <lastmod> — un
   timestamp real rompería la salida byte-idéntica que exige la regla de oro
   de este generador (ver comentario de arriba). */
function sitemap() {
  const urls = LANGS.map(
    (lang) => `  <url>
    <loc>${urlFor(lang)}</loc>
${LANGS.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${urlFor(alt)}"/>`).join("\n")}
  </url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

function robots() {
  return `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`;
}

/* llms.txt: mapa curado para agentes/LLMs, uno por idioma. Cada idioma
   enlaza SOLO a URLs de su propio idioma — un agente que entra por /en/ no
   debe terminar en una página en español, y viceversa. Prosa propia de este
   archivo (no vive en ATOMO: es contenido de nivel sitio, no del artifact). */
const LLMS_COPY = {
  pagesHeading: { es: "Páginas", en: "Pages" },
  reposHeading: { es: "Repositorios del paquete", en: "Package repositories" },
  pageLinkNote: {
    es: "Artifact 09: el mismo handler, proyectado a tres puertas, con sus garantías por superficie.",
    en: "Artifact 09: the same handler, projected through three doors, with its guarantees per surface.",
  },
  what: {
    es: "Milpa es un framework de PHP cuyo rasgo distintivo es que abre pipelines "
      + "plugables a través de contratos claros para humanos y agentes: una "
      + "operación se declara una vez (el Command-as-atom) y se proyecta a las "
      + "superficies CLI, MCP y HTTP sin reescribirse.",
    en: "Milpa is a PHP framework whose distinguishing trait is that it opens "
      + "pluggable pipelines through clear contracts for humans and agents: one "
      + "operation is declared once (the Command-as-atom) and projected to the "
      + "CLI, MCP and HTTP surfaces without being rewritten.",
  },
};

function llmsRepoLabel(url) {
  return `milpa/${url.split("/").pop()}`;
}

function llmsPath(lang) {
  return lang === "es" ? "site/llms.txt" : "site/en/llms.txt";
}

function llms(lang) {
  const repos = ATOMO.jsonld.isBasedOn.map((url) => `- [${llmsRepoLabel(url)}](${url})`).join("\n");
  return `# Milpa

> ${ATOMO.hero[lang]}

${LLMS_COPY.what[lang]}

## ${LLMS_COPY.pagesHeading[lang]}

- [${ATOMO.title[lang]}](${urlFor(lang)}): ${LLMS_COPY.pageLinkNote[lang]}

## ${LLMS_COPY.reposHeading[lang]}

${repos}
`;
}

for (const lang of LANGS) {
  const out = pathFor(lang);
  mkdirSync(path.join(ROOT, path.dirname(out)), { recursive: true });
  writeFileSync(path.join(ROOT, out), page(lang), "utf8");
}

writeFileSync(path.join(ROOT, "site/sitemap.xml"), sitemap(), "utf8");
writeFileSync(path.join(ROOT, "site/robots.txt"), robots(), "utf8");
for (const lang of LANGS) {
  const out = llmsPath(lang);
  mkdirSync(path.join(ROOT, path.dirname(out)), { recursive: true });
  writeFileSync(path.join(ROOT, out), llms(lang), "utf8");
}

console.log(
  "gen-site: emitted",
  [...LANGS.map(pathFor), "site/sitemap.xml", "site/robots.txt", ...LANGS.map(llmsPath)].join(", "),
);

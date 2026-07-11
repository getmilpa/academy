/* SSG del shell de laboratorios (bilingüe). Emite:
     - site/labs/index.html        (es, 2 niveles: ../../)
     - site/en/labs/index.html     (en, 3 niveles: ../../../)

   Shell localizado por idioma: head/header/intro/nav/footer + un resumen
   estático de los 4 labs (título + objetivo desde labs/catalog.js vía pick),
   dentro de <main id="lab-workspace"> — la fuente PE que el runner (labs/labs.js,
   T2) reemplaza al hidratar en el idioma del <html lang>. El chrome sale de
   LABS_SHELL (labs/labs.content.mjs); el contenido de cada práctica del catalog.

   Determinismo: data pura, sin Date/Math.random, orden estable → byte-idéntico
   en re-gen. Contrato de salida idéntico a buildLearnPages/buildGalleryPages:
   { pages, sitemapPages, llms }. */

import { createRequire } from "node:module";
import { renderHead, htmlOpen } from "./page.mjs";
import { LABS_SHELL } from "../../labs/labs.content.mjs";

const require = createRequire(import.meta.url);
const labsCatalog = require("../../labs/catalog.js");
const inlineCode = require("../../inline-code.js");

const LANGS = ["es", "en"];
const BASE_URL = { fn: null };

function L(node, lang) {
  if (node && typeof node === "object" && ("es" in node || "en" in node)) {
    return node[lang === "en" ? "en" : "es"];
  }
  return node;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* Igual que learn.js/gen/learn.mjs escapeInline: los backticks `código` de los
   objetivos del catalog se vuelven <code> reales; el resto queda escapado. */
function escapeInline(text) {
  return inlineCode.splitCodeSpans(text).map((tok) => (tok.code ? "<code>" + escapeHtml(tok.text) + "</code>" : escapeHtml(tok.text))).join("");
}

function rootPrefixFor(lang) {
  return "../".repeat(lang === "es" ? 2 : 3);
}

function urlFor(lang) {
  return BASE_URL.fn + (lang === "es" ? "/labs/" : "/en/labs/");
}

function outPath(lang) {
  return lang === "es" ? "site/labs/index.html" : "site/en/labs/index.html";
}

function portalHome(lang, rootPrefix) {
  return lang === "es" ? rootPrefix : rootPrefix + "en/";
}

/* Enlace a un app-dir bilingüe (learn/artifacts) coherente por idioma. */
function appHref(lang, rootPrefix, dir) {
  return rootPrefix + (lang === "en" ? "en/" : "") + dir + "/";
}

function extraHead(lang, rootPrefix, gtagBootstrap) {
  return [
    `<link rel="icon" href="${rootPrefix}assets/milpa-app-icon.svg" type="image/svg+xml">`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">',
    `<link rel="stylesheet" href="${rootPrefix}labs/labs.css">`,
    gtagBootstrap(lang, "labs"),
    `<script src="${rootPrefix}analytics.js" defer></script>`,
  ].join("\n");
}

/* Scripts clásicos con defer, en orden: analytics.js (en <head>) precede a
   éstos; i18n/catalog/verifier/inline-code cargan ANTES que labs.js, que los
   consume vía globals (MilpaI18n opcional con fallback, MilpaLabCatalog,
   MilpaLabVerifier, MilpaInlineCode). */
function scripts(rootPrefix) {
  return [
    `  <script src="${rootPrefix}i18n.js" defer></script>`,
    `  <script src="${rootPrefix}labs/catalog.js" defer></script>`,
    `  <script src="${rootPrefix}labs/lab-verifier.js" defer></script>`,
    `  <script src="${rootPrefix}inline-code.js" defer></script>`,
    `  <script src="${rootPrefix}labs/labs.js" defer></script>`,
  ].join("\n");
}

function labsJsonLd(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: lang,
    name: L(LABS_SHELL.pageTitle, lang),
    description: L(LABS_SHELL.metaDescription, lang),
    itemListElement: labsCatalog.labs.map((lab, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: L(lab.title, lang),
      description: L(lab.objective, lang),
    })),
  });
}

/* Resumen estático de los 4 labs (PE): título + objetivo por lab. Vive dentro de
   #lab-workspace y el runner lo reemplaza con la práctica interactiva al hidratar. */
function summaryMarkup(lang) {
  const items = labsCatalog.labs
    .map((lab) => `        <li class="mui-steps__item">
          <span class="mui-steps__marker" aria-hidden="true"></span>
          <div>
            <p class="mui-steps__title"><span class="mui-badge mui-badge--accent">${escapeHtml(lab.number)}</span> ${escapeInline(L(lab.title, lang))}</p>
            <p class="mui-steps__body">${escapeInline(L(lab.objective, lang))}</p>
          </div>
        </li>`)
    .join("\n");
  return `      <section class="ac-labs-summary" aria-labelledby="labs-summary-title">
        <h2 id="labs-summary-title">${escapeInline(L(LABS_SHELL.summaryHeading, lang))}</h2>
        <ol class="mui-steps">
${items}
        </ol>
      </section>`;
}

function labsPage(lang, gtagBootstrap) {
  const rootPrefix = rootPrefixFor(lang);
  const s = LABS_SHELL;
  const head = renderHead({
    lang,
    title: L(s.pageTitle, lang),
    description: L(s.metaDescription, lang),
    canonical: urlFor(lang),
    alternates: { es: urlFor("es"), en: urlFor("en"), "x-default": urlFor("es") },
    jsonld: labsJsonLd(lang),
    extraHead: extraHead(lang, rootPrefix, gtagBootstrap),
  });
  return `${htmlOpen(lang)}
${head}
<body class="mui-page">
  <a class="ac-skip" href="#lab-workspace">${L(s.skipLink, lang)}</a>

  <header class="mui-header ac-header">
    <div class="mui-container mui-container--wide mui-header__row">
      <a class="mui-header__brand ac-brand" href="${portalHome(lang, rootPrefix)}" aria-label="${L(s.brandAria, lang)}">
        <img src="${rootPrefix}assets/milpa-symbol-color.svg" alt="" width="24" height="24">
        <strong>${L(s.brandName, lang)}</strong>
        <span class="mui-badge">${L(s.brandBadge, lang)}</span>
      </a>
      <nav class="mui-header__nav" aria-label="${L(s.navAria, lang)}">
        <a class="mui-btn mui-btn--ghost mui-btn--sm" href="${appHref(lang, rootPrefix, "learn")}">${L(s.navLearn, lang)}</a>
        <a class="mui-btn mui-btn--ghost mui-btn--sm" href="${appHref(lang, rootPrefix, "artifacts")}">${L(s.navArtifacts, lang)}</a>
      </nav>
      <div class="mui-header__actions">
        <button class="mui-btn mui-btn--ghost mui-btn--icon mui-btn--sm" id="theme-toggle" type="button" aria-label="${L(s.themeAria, lang)}" title="${L(s.themeTip, lang)}">◐</button>
      </div>
    </div>
  </header>

  <main>
    <section class="mui-section mui-section--tight ac-intro" aria-labelledby="labs-title">
      <div class="mui-container mui-container--wide">
        <div class="ac-intro__copy">
          <p class="mui-section__kicker">${L(s.introKicker, lang)}</p>
          <h1 class="mui-section__title" id="labs-title">${L(s.h1, lang)}</h1>
          <p class="mui-section__lede">${L(s.lede, lang)}</p>
        </div>
        <div class="ac-progress-block">
          <div class="ac-progress-block__label">
            <span>${L(s.progressBlockLabel, lang)}</span>
            <output id="progress-label">${L(s.progressInitial, lang)}</output>
          </div>
          <div class="mui-progress" id="course-progress" role="progressbar" aria-label="${L(s.progressBarAria, lang)}" aria-valuemin="0" aria-valuemax="4" aria-valuenow="0">
            <span class="mui-progress__bar" id="course-progress-bar" style="width:0%"></span>
          </div>
        </div>
      </div>
    </section>

    <section class="ac-labs" aria-label="${L(s.labsSectionAria, lang)}">
      <div class="mui-container mui-container--wide ac-labs__layout">
        <aside class="ac-labs__nav" aria-label="${L(s.navSectionAria, lang)}">
          <p class="ac-eyebrow">${L(s.eyebrow, lang)}</p>
          <ol class="mui-steps ac-step-list" id="lab-navigation"></ol>
        </aside>

        <article class="ac-workspace" id="lab-workspace" tabindex="-1">
${summaryMarkup(lang)}
        </article>
      </div>
    </section>
  </main>

  <footer class="ac-footer">
    <div class="mui-container mui-container--wide ac-footer__row">
      <span>${L(s.footerVersion, lang)}</span>
      <span>${L(s.footerNote, lang)}</span>
    </div>
  </footer>

${scripts(rootPrefix)}
</body>
</html>
`;
}

export function buildLabsPages({ BASE, gtagBootstrap }) {
  BASE_URL.fn = BASE;
  const pages = LANGS.map((lang) => ({ path: outPath(lang), html: labsPage(lang, gtagBootstrap) }));
  const sitemapPages = [{ es: urlFor("es"), en: urlFor("en") }];
  const note = {
    es: "Cuatro prácticas verificables: arranca un host, rompe y repara un contrato, genera una ruta y activa la superficie agent-ready.",
    en: "Four verifiable practices: boot a host, break and repair a contract, generate a route and activate the agent-ready surface.",
  };
  const llms = {
    es: [{ label: L(LABS_SHELL.pageTitle, "es"), url: urlFor("es"), note: note.es }],
    en: [{ label: L(LABS_SHELL.pageTitle, "en"), url: urlFor("en"), note: note.en }],
  };
  return { pages, sitemapPages, llms };
}

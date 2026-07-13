/* SSG-lite: genera site/atomo/index.html (es) y site/en/atomo/index.html (en) para el
   artifact #atomo a partir de la fuente bilingüe única artifacts/content/atomo.content.mjs.

   Node ESM, cero dependencias, determinista: nada de Date/timestamps, orden de
   claves estable, salida de string estable. Correr dos veces produce bytes
   idénticos — así site/ committeado queda limpio en un re-gen. */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { ATOMO } from "../artifacts/content/atomo.content.mjs";
import { PORTAL } from "../content/portal.content.mjs";
import { htmlOpen, renderHead } from "./gen/page.mjs";
import { buildLearnPages } from "./gen/learn.mjs";
import { renderAtomoFallback } from "./gen/atomo.mjs";
import { buildGalleryPages } from "./gen/gallery.mjs";
import { buildLabsPages } from "./gen/labs.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["es", "en"];
const BASE = "https://academy.milpa.lat"; // canonical origin

/* GA4 — única fuente de verdad del Measurement ID (Task 7). Ambas páginas
   (portal y átomo) inyectan el mismo bootstrap vía gtagBootstrap() más abajo;
   analytics.js (raíz) es el único punto donde el código del sitio llama
   window.gtag. No fires manual page_view — gtag('config', GA_ID) ya lo
   manda solo; duplicarlo con un track("page_view", …) doblaría el conteo. */
const GA_ID = "G-RNV9LK6RLL";

/* Bootstrap estándar de gtag.js con defaults de página (language, page_type)
   seteados ANTES del config, así todo hit — incluido el page_view automático
   de gtag('config', …) — ya los lleva. new Date() es texto literal de este
   template: corre en el navegador cuando el HTML generado se parsea, nunca
   en Node/SSG, por eso la salida sigue siendo un string constante y el
   generador se mantiene determinista/idempotente. */
function gtagBootstrap(lang, pageType) {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('set',{language:'${lang}',page_type:'${pageType}'});gtag('config','${GA_ID}');</script>`;
}

/* Per-unit + learn-index SSG pages (bilingual). Built once here so the same
   result feeds the emission loop, SITEMAP_PAGES and llms() below — the learn
   generators live in gen/learn.mjs (mismo estilo que gen/page.mjs) porque el
   volumen (30 unit pages + 2 learn index) crecería demasiado este archivo. */
const LEARN = buildLearnPages({ BASE, gtagBootstrap });

/* Galería completa (11 artifacts, es/en) + shell de laboratorios (es/en). Mismo
   contrato que buildLearnPages ({ pages, sitemapPages, llms }); los generadores
   viven en gen/gallery.mjs y gen/labs.mjs por volumen. Sus index.html ganan la
   colisión con el app-dir en build-deploy (EXCLUDED_SHELLS). */
const GALLERY_PAGES = buildGalleryPages({ BASE, gtagBootstrap });
const LABS_PAGES = buildLabsPages({ BASE, gtagBootstrap });

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

/* a11y: exactly one h1 on this standalone page. ATOMO.title ("El átomo y sus
   puertas") renders as <h1 id="atomo-title"> inside renderAtomoFallback()'s
   wb-artifact__header — that's the page's real topic (it's also what <title>/
   canonical/jsonld name() use above), and it matches the h1-per-card pattern
   every other artifact uses in gen/gallery.mjs. ATOMO.hero is a manifesto-style
   tagline that doubles as the meta description; it's a lead-in, not a second
   top-level heading, so it renders as h2 (wb-hero keeps its class/appearance —
   only the tag changed, see the .wb-hero rule in artifacts.css that pins the
   same size/weight now that it's off the h1 UA default). */
function page(lang) {
  const asset = assetPrefix(lang);
  const head = renderHead({
    lang,
    title: `${ATOMO.title[lang]} · Milpa`,
    description: ATOMO.hero[lang],
    canonical: urlFor(lang),
    alternates: { es: urlFor("es"), en: urlFor("en"), "x-default": urlFor("es") },
    jsonld: jsonld(lang),
    extraHead: [
      `<link rel="icon" href="${asset}/assets/milpa-app-icon.svg" type="image/svg+xml">`,
      `<link rel="stylesheet" href="${asset}/artifacts/artifacts.css">`,
      gtagBootstrap(lang, "atomo"),
      `<script src="${asset}/analytics.js" defer></script>`,
    ].join("\n"),
  });
  return `${htmlOpen(lang, "wb-doc")}
${head}
<body>
<main>
<h2 class="wb-hero">${ATOMO.hero[lang]}</h2>
<p class="wb-intro">${ATOMO.intro[lang]}</p>
<milpa-artifact id="atomo-artifact" lang="${lang}">
        ${renderAtomoFallback(lang, `${asset}/artifacts/#runtime`)}
      </milpa-artifact>
</main>
<script src="${asset}/artifacts/artifacts-core.js" defer></script>
<script src="${asset}/artifacts/milpa-artifact.js" defer></script>
</body>
</html>
`;
}

/* Portal (home de Milpa Academy): site/index.html (es) + site/en/index.html
   (en), generados desde content/portal.content.mjs (PORTAL). Mismo patrón
   que el átomo de arriba — reusa htmlOpen/renderHead — pero reproduce la
   estructura completa de index.html (header, drawer, hero, curriculum,
   practice, boundary, footer) en vez de un solo componente. Toda la prosa
   queda estática por idioma; #routeGrid queda vacío a propósito (lo
   hidrata academy.js con el catálogo). La card/link de webinar se omite
   deliberadamente (orfanado en esta fase). */

function portalUrlFor(lang) {
  return lang === "es" ? `${BASE}/` : `${BASE}/en/`;
}

function portalPathFor(lang) {
  return lang === "es" ? "site/index.html" : "site/en/index.html";
}

/* Prefijo relativo hacia la raíz de academy/ (learn/, labs/, artifacts/,
   assets/, academy.css, i18n.js, curriculum/, academy.js) desde cada
   portal emitido. site/index.html (es) está a un nivel de academy/;
   site/en/index.html (en) está a dos niveles. Mismo criterio que
   assetPrefix() arriba, aplicado a la profundidad del portal. */
function portalAssetPrefix(lang) {
  return lang === "es" ? ".." : "../..";
}

/* Enlace a un app-dir bilingüe (learn/labs/artifacts) coherente por idioma: el
   portal en enlaza al árbol /en/ (colapsa a /en/learn/ …), el es al árbol raíz
   (/learn/ …). assets compartidos siguen usando portalAssetPrefix directo. */
function portalAppHref(lang, asset, dir) {
  return `${asset}/${lang === "en" ? "en/" : ""}${dir}/`;
}

/* Switch de idioma: <a href> real, sin JS, hacia el portal del otro
   idioma. Ruta relativa ENTRE los dos portales generados (site/index.html
   <-> site/en/index.html) — no hacia la raíz de academy/, por eso es un
   prefijo propio y no portalAssetPrefix(). */
function portalLangSwitch(lang) {
  return lang === "es"
    ? { href: "en/", hreflang: "en", label: "EN" }
    : { href: "../", hreflang: "es", label: "ES" };
}

function portalJsonLd(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": PORTAL.jsonld.type,
    inLanguage: lang,
    name: PORTAL.meta.title[lang],
    description: PORTAL.meta.description[lang],
    sameAs: PORTAL.jsonld.sameAs,
  });
}

function portalExtraHead(lang, asset) {
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">',
    `<meta property="og:title" content="${PORTAL.meta.ogTitle[lang]}">`,
    `<meta property="og:description" content="${PORTAL.meta.ogDescription[lang]}">`,
    '<meta property="og:type" content="website">',
    `<link rel="icon" href="${asset}/assets/milpa-app-icon.svg" type="image/svg+xml">`,
    `<link rel="stylesheet" href="${asset}/academy.css">`,
    gtagBootstrap(lang, "portal"),
    `<script src="${asset}/analytics.js" defer></script>`,
  ].join("\n");
}

function renderPortalHeader(lang, asset, sw) {
  const c = PORTAL.chrome;
  return `  <header class="mui-header">
    <div class="mui-container mui-header__row">
      <a class="mui-header__brand ac-brand" href="./" aria-label="${PORTAL.meta.title[lang]}, ${c.brandHome[lang]}">
        <img src="${asset}/assets/milpa-symbol-color.svg" width="24" height="24" alt="">
        <span>${PORTAL.meta.title[lang]}</span>
      </a>
      <nav class="mui-header__nav" aria-label="${c.sectionsAriaLabel[lang]}">
        <a class="mui-btn mui-btn--ghost mui-btn--sm" href="${portalAppHref(lang, asset, "learn")}">${PORTAL.nav.learn[lang]}</a>
        <a class="mui-btn mui-btn--ghost mui-btn--sm" href="${portalAppHref(lang, asset, "labs")}">${PORTAL.nav.labs[lang]}</a>
        <a class="mui-btn mui-btn--ghost mui-btn--sm" href="${portalAppHref(lang, asset, "artifacts")}">${PORTAL.nav.artifacts[lang]}</a>
      </nav>
      <div class="mui-header__actions">
        <a class="mui-btn mui-btn--ghost mui-btn--sm" id="langSwitch" href="${sw.href}" hreflang="${sw.hreflang}" rel="alternate">${sw.label}</a>
        <button class="mui-btn mui-btn--ghost mui-btn--sm" id="themeBtn" type="button">${c.themeBtn[lang]}</button>
        <button class="mui-btn mui-btn--ghost mui-btn--sm mui-header__toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="mainMenu">${c.menuToggle[lang]}</button>
      </div>
    </div>
  </header>`;
}

function renderPortalDrawer(lang, asset) {
  const c = PORTAL.chrome;
  const sourceHref = PORTAL.jsonld.sameAs[1]; // https://github.com/getmilpa — mismo repo que el nav del footer
  return `  <dialog class="mui-drawer mui-drawer--end" id="mainMenu" aria-labelledby="mainMenuTitle">
    <header class="mui-drawer__header">
      <h2 class="mui-drawer__title" id="mainMenuTitle">Academy</h2>
      <button class="mui-btn mui-btn--ghost mui-btn--sm" id="menuClose" type="button">${c.menuClose[lang]}</button>
    </header>
    <div class="mui-drawer__body">
      <nav class="ac-mobile-nav" aria-label="${c.sectionsAriaLabel[lang]}">
        <a class="mui-docs__nav-item" href="${portalAppHref(lang, asset, "learn")}">${PORTAL.nav.learn[lang]}</a>
        <a class="mui-docs__nav-item" href="${portalAppHref(lang, asset, "labs")}">${PORTAL.nav.labs[lang]}</a>
        <a class="mui-docs__nav-item" href="${portalAppHref(lang, asset, "artifacts")}">${PORTAL.nav.artifacts[lang]}</a>
        <a class="mui-docs__nav-item" href="${sourceHref}" data-outbound-kind="repo">${PORTAL.nav.source[lang]}</a>
      </nav>
    </div>
  </dialog>`;
}

function renderPortalHero(lang, asset) {
  const s = PORTAL.stats;
  return `    <section class="ac-overview" aria-labelledby="academyTitle">
      <div class="mui-container">
        <p class="mui-section__kicker">${PORTAL.hero.kicker[lang]}</p>
        <h1 id="academyTitle">${PORTAL.hero.h1[lang]}</h1>
        <p class="ac-overview__lede">${PORTAL.hero.lede[lang]}</p>
        <div class="mui-callout mui-callout--tip ac-overview__mantra" role="note">
          <span class="mui-callout__icon" aria-hidden="true">✓</span>
          <div class="mui-callout__content"><p class="mui-callout__body">“${PORTAL.hero.thesis[lang]}”</p></div>
        </div>
        <div class="ac-overview__actions">
          <a class="mui-btn mui-btn--primary" id="primaryLearningAction" href="${portalAppHref(lang, asset, "learn")}">${PORTAL.hero.ctaPrimary[lang]}</a>
          <a class="mui-btn" id="secondaryLearningAction" href="${portalAppHref(lang, asset, "labs")}">${PORTAL.hero.ctaSecondary[lang]}</a>
        </div>
        <div class="ac-overview__stats" aria-label="${PORTAL.chrome.statsAriaLabel[lang]}">
          <div class="mui-stat"><span class="mui-stat__label">${s.tracks[lang]}</span><strong class="mui-stat__value" id="trackCount">4</strong><span class="mui-stat__meta">${s.tracksMeta[lang]}</span></div>
          <div class="mui-stat"><span class="mui-stat__label">${s.units[lang]}</span><strong class="mui-stat__value" id="unitCount">0</strong><span class="mui-stat__meta">${s.unitsMeta[lang]}</span></div>
          <div class="mui-stat"><span class="mui-stat__label">${s.progress[lang]}</span><strong class="mui-stat__value" id="completionCount">0%</strong><span class="mui-stat__meta" id="completionMeta">${s.progressMeta[lang]}</span></div>
        </div>
      </div>
    </section>`;
}

function renderPortalCurriculum(lang) {
  const r = PORTAL.routes;
  return `    <section class="mui-section ac-curriculum" aria-labelledby="routesTitle">
      <div class="mui-container">
        <div class="ac-section-head">
          <div><p class="mui-section__kicker">${r.kicker[lang]}</p><h2 class="mui-section__title" id="routesTitle">${r.title[lang]}</h2></div>
          <p>${r.method[lang]}</p>
        </div>
        <div class="ac-route-grid" id="routeGrid"></div>
      </div>
    </section>`;
}

function renderPortalPractice(lang, asset) {
  const p = PORTAL.practice;
  return `    <section class="mui-section ac-practice" aria-labelledby="practiceTitle">
      <div class="mui-container">
        <p class="mui-section__kicker">${p.kicker[lang]}</p>
        <h2 class="mui-section__title" id="practiceTitle">${p.title[lang]}</h2>
        <div class="ac-tool-grid">
          <a class="mui-card mui-card--interactive ac-tool" href="${portalAppHref(lang, asset, "labs")}">
            <div class="mui-card__body"><span class="mui-badge mui-badge--accent">${p.labs.badge[lang]}</span><h3>${p.labs.h3[lang]}</h3><p>${p.labs.body[lang]}</p><span class="ac-tool__link">${p.labs.link[lang]}</span></div>
          </a>
          <a class="mui-card mui-card--interactive ac-tool" href="${portalAppHref(lang, asset, "artifacts")}">
            <div class="mui-card__body"><span class="mui-badge mui-badge--secondary">${p.artifacts.badge[lang]}</span><h3>${p.artifacts.h3[lang]}</h3><p>${p.artifacts.body[lang]}</p><span class="ac-tool__link">${p.artifacts.link[lang]}</span></div>
          </a>
        </div>
      </div>
    </section>`;
}

function renderPortalBoundary(lang) {
  const b = PORTAL.boundary;
  return `    <section class="ac-boundary" aria-labelledby="boundaryTitle">
      <div class="mui-container ac-boundary__grid">
        <div><p class="mui-section__kicker">${b.kicker[lang]}</p><h2 id="boundaryTitle">${b.h1[lang]}</h2></div>
        <div><p>${b.body[lang]}</p><p><strong>${b.disclaimer[lang]}</strong></p></div>
      </div>
    </section>`;
}

function renderPortalFooter(lang) {
  const f = PORTAL.footer;
  const linkLabels = ["milpa.lat", "GitHub", "@milpa/design"]; // literales, mismos en ambos idiomas
  const linkKinds = ["site", "repo", "npm"]; // paralelo a PORTAL.jsonld.sameAs, para el evento outbound_click
  const links = PORTAL.jsonld.sameAs
    .map((href, i) => `<li><a href="${href}" data-outbound-kind="${linkKinds[i]}">${linkLabels[i]}</a></li>`)
    .join("");
  return `  <footer class="mui-footer">
    <div class="mui-footer__grid">
      <div class="mui-footer__brand"><strong>${PORTAL.meta.title[lang]}</strong><p class="mui-footer__mantra">${f.mantra[lang]}</p></div>
      <nav aria-labelledby="footerEcosystem"><p class="mui-footer__heading" id="footerEcosystem">${f.ecosystem[lang]}</p><ul class="mui-footer__links">${links}</ul></nav>
    </div>
    <div class="mui-footer__legal"><p>© 2026 Milpa · Apache-2.0</p></div>
  </footer>`;
}

function portalPage(lang) {
  const asset = portalAssetPrefix(lang);
  const sw = portalLangSwitch(lang);
  const head = renderHead({
    lang,
    title: PORTAL.meta.title[lang],
    description: PORTAL.meta.description[lang],
    canonical: portalUrlFor(lang),
    alternates: { es: portalUrlFor("es"), en: portalUrlFor("en"), "x-default": portalUrlFor("es") },
    jsonld: portalJsonLd(lang),
    extraHead: portalExtraHead(lang, asset),
  });
  return `${htmlOpen(lang)}
${head}
<body class="mui-page">
  <a class="mui-shell__skip" href="#main">${PORTAL.chrome.skipLink[lang]}</a>

${renderPortalHeader(lang, asset, sw)}

${renderPortalDrawer(lang, asset)}

  <main id="main">
${renderPortalHero(lang, asset)}

${renderPortalCurriculum(lang)}

${renderPortalPractice(lang, asset)}

${renderPortalBoundary(lang)}
  </main>

${renderPortalFooter(lang)}

  <script src="${asset}/i18n.js"></script>
  <script src="${asset}/curriculum/catalog.js"></script>
  <script src="${asset}/curriculum/progress.js"></script>
  <script src="${asset}/academy.js"></script>
</body>
</html>
`;
}

/* Sitemap + robots + llms.txt: los archivos que hacen el sitio legible por
   crawlers y agentes. Determinismo: sitemap.xml NO lleva <lastmod> — un
   timestamp real rompería la salida byte-idéntica que exige la regla de oro
   de este generador (ver comentario de arriba).

   SITEMAP_PAGES: un {es, en} por cada página emitida que deba listarse en
   sitemap.xml. El portal es la home/entrada canónica del sitio — va primero;
   el átomo (Artifact 09) le sigue. Agregar una página nueva al sitemap es
   agregar un elemento acá, no duplicar el bloque <url>. */
const SITEMAP_PAGES = [
  { es: portalUrlFor("es"), en: portalUrlFor("en") },
  { es: urlFor("es"), en: urlFor("en") },
  ...GALLERY_PAGES.sitemapPages,
  ...LABS_PAGES.sitemapPages,
  ...LEARN.sitemapPages,
];

function sitemap() {
  const urls = SITEMAP_PAGES.flatMap((page) =>
    LANGS.map(
      (lang) => `  <url>
    <loc>${page[lang]}</loc>
${LANGS.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${page[alt]}"/>`).join("\n")}
  </url>`,
    ),
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
   archivo (no vive en ATOMO: es contenido de nivel sitio, no del artifact).
   Exportado para que el walk de completitud i18n (tests/i18n-contract.test.mjs)
   lo recorra como toda hoja {es,en} — antes era el único {es,en} fuera de los
   módulos de contenido. */
export const LLMS_COPY = {
  pagesHeading: { es: "Páginas", en: "Pages" },
  reposHeading: { es: "Repositorios del paquete", en: "Package repositories" },
  pageLinkNote: {
    es: "Artifact 09: el mismo handler, proyectado a tres puertas, con sus garantías por superficie.",
    en: "Artifact 09: the same handler, projected through three doors, with its guarantees per surface.",
  },
  portalLinkNote: {
    es: "El home del currículo: rutas de aprendizaje, laboratorios verificables y artifacts de arquitectura.",
    en: "The curriculum home: learning tracks, verifiable labs, and architecture artifacts.",
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
  const learnLinks = LEARN.llms[lang].map((entry) => `- [${entry.label}](${entry.url}): ${entry.note}`).join("\n");
  // Galería + laboratorios: mismo idioma que la página (nunca cruza idiomas).
  const practiceLinks = [...GALLERY_PAGES.llms[lang], ...LABS_PAGES.llms[lang]]
    .map((entry) => `- [${entry.label}](${entry.url}): ${entry.note}`).join("\n");
  return `# Milpa

> ${ATOMO.hero[lang]}

${LLMS_COPY.what[lang]}

## ${LLMS_COPY.pagesHeading[lang]}

- [${PORTAL.meta.title[lang]}](${portalUrlFor(lang)}): ${LLMS_COPY.portalLinkNote[lang]}
- [${ATOMO.title[lang]}](${urlFor(lang)}): ${LLMS_COPY.pageLinkNote[lang]}
${practiceLinks}

## ${PORTAL.nav.learn[lang]}

${learnLinks}

## ${LLMS_COPY.reposHeading[lang]}

${repos}
`;
}

/* Todo lo emitido a disco vive detrás de este guard de módulo-principal: correr
   `node scripts/gen-site.mjs` (npm run gen, CI, execFileSync de los tests) genera
   el sitio; importar el módulo (p. ej. el test de completitud que consume
   LLMS_COPY) NO escribe nada. La salida byte a byte es idéntica — site/ no cambia. */
function emitSite() {
  for (const lang of LANGS) {
    const out = pathFor(lang);
    mkdirSync(path.join(ROOT, path.dirname(out)), { recursive: true });
    writeFileSync(path.join(ROOT, out), page(lang), "utf8");
  }

  for (const lang of LANGS) {
    const out = portalPathFor(lang);
    mkdirSync(path.join(ROOT, path.dirname(out)), { recursive: true });
    writeFileSync(path.join(ROOT, out), portalPage(lang), "utf8");
  }

  for (const learnPage of LEARN.pages) {
    mkdirSync(path.join(ROOT, path.dirname(learnPage.path)), { recursive: true });
    writeFileSync(path.join(ROOT, learnPage.path), learnPage.html, "utf8");
  }

  for (const genPage of [...GALLERY_PAGES.pages, ...LABS_PAGES.pages]) {
    mkdirSync(path.join(ROOT, path.dirname(genPage.path)), { recursive: true });
    writeFileSync(path.join(ROOT, genPage.path), genPage.html, "utf8");
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
    [
      ...LANGS.map(pathFor),
      ...LANGS.map(portalPathFor),
      `${LEARN.pages.length} learn pages (units + index, es/en)`,
      ...GALLERY_PAGES.pages.map((p) => p.path),
      ...LABS_PAGES.pages.map((p) => p.path),
      "site/sitemap.xml",
      "site/robots.txt",
      ...LANGS.map(llmsPath),
    ].join(", "),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  emitSite();
}

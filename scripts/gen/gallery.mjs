/* SSG de la galería completa de artifacts (bilingüe). Emite:
     - site/artifacts/index.html        (es, 2 niveles: ../../)
     - site/en/artifacts/index.html     (en, 3 niveles: ../../../)

   Reproduce el DOM EXACTO de artifacts/index.html (chrome del shell + los 10
   artifacts con su markup interactivo estático) sustituyendo cada string
   visible por su valor { es, en } desde GALLERY (artifacts/content/
   gallery.content.mjs). El átomo (#atomo, Artifact 09) renderiza su fallback
   estático desde ATOMO vía renderAtomoFallback() — fuente única compartida con
   site/atomo/. La galería completa (10 artifacts) es visible sin JS en ambos
   idiomas; artifacts.js sólo hidrata sobre este DOM (T4).

   Determinismo: data pura, sin Date/Math.random, orden estable → byte-idéntico
   en re-gen. Contrato de salida idéntico a buildLearnPages: { pages,
   sitemapPages, llms }.

   Nota XSS/escaping: como en gen-site.mjs (átomo) y atomo.mjs, los valores de
   GALLERY se emiten RAW — son fragmentos HTML autorados (con <code>/<strong>/
   <em> inline), no input de usuario. La fidelidad es-verbatim la prueba
   tests/i18n-contract.test.mjs contra artifacts/index.html. */

import { renderHead, htmlOpen } from "./page.mjs";
import { renderAtomoFallback } from "./atomo.mjs";
import { GALLERY } from "../../artifacts/content/gallery.content.mjs";
import { ATOMO } from "../../artifacts/content/atomo.content.mjs";

const LANGS = ["es", "en"];
const BASE_URL = { fn: null };

/* Resuelve un nodo { es, en } al idioma activo; deja pasar strings planos. */
function L(node, lang) {
  if (node && typeof node === "object" && ("es" in node || "en" in node)) {
    return node[lang === "en" ? "en" : "es"];
  }
  return node;
}

function stripTags(html) {
  return String(html).replace(/<[^>]+>/g, "");
}

/* Profundidades: site/artifacts/index.html (es) está a 2 niveles de la raíz que
   build-deploy mapea a "/"; site/en/artifacts/index.html (en) a 3. Mismo criterio
   que el átomo/learn: build-deploy colapsa toda corrida de ../ a /. */
function rootPrefixFor(lang) {
  return "../".repeat(lang === "es" ? 2 : 3);
}

function urlFor(lang) {
  return BASE_URL.fn + (lang === "es" ? "/artifacts/" : "/en/artifacts/");
}

function outPath(lang) {
  return lang === "es" ? "site/artifacts/index.html" : "site/en/artifacts/index.html";
}

/* Home del portal por idioma (el enlace del brand del sidebar). rootPrefix es
   una corrida de ../ que colapsa a /: es → /, en → /en/. */
function portalHome(lang, rootPrefix) {
  return lang === "es" ? rootPrefix : rootPrefix + "en/";
}

/* Enlace a un app-dir bilingüe (learn/labs) coherente por idioma: en → árbol
   /en/. Colapsa a /learn/ (es) o /en/learn/ (en) en deploy. webinars/ es
   es-only (no lo pasa por acá). */
function appHref(lang, rootPrefix, dir) {
  return rootPrefix + (lang === "en" ? "en/" : "") + dir + "/";
}

/* ---- <head> + scripts --------------------------------------------------- */

function extraHead(lang, rootPrefix, gtagBootstrap) {
  return [
    `<link rel="icon" href="${rootPrefix}assets/milpa-app-icon.svg" type="image/svg+xml">`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">',
    `<link rel="stylesheet" href="${rootPrefix}artifacts/artifacts.css">`,
    gtagBootstrap(lang, "gallery"),
    `<script src="${rootPrefix}analytics.js" defer></script>`,
  ].join("\n");
}

/* Scripts clásicos con defer, en orden: analytics.js (en <head>) precede a
   éstos por orden de documento, así los emisores de eventos (artifacts.js /
   milpa-artifact.js) corren DESPUÉS de que MilpaAnalytics y MilpaI18n existen. */
function scripts(rootPrefix) {
  return [
    `  <script src="${rootPrefix}i18n.js" defer></script>`,
    `  <script src="${rootPrefix}artifacts/artifacts-core.js" defer></script>`,
    `  <script src="${rootPrefix}artifacts/artifacts.js" defer></script>`,
    `  <script src="${rootPrefix}artifacts/milpa-artifact.js" defer></script>`,
  ].join("\n");
}

/* ---- JSON-LD ItemList ---------------------------------------------------- */

function itemName(a, lang) {
  return a.id === "atomo" ? ATOMO.title[lang] : L(a.title, lang);
}
function itemDescription(a, lang) {
  return stripTags(a.id === "atomo" ? ATOMO.lede[lang] : L(a.lede, lang));
}

function galleryJsonLd(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: lang,
    name: L(GALLERY.chrome.pageTitle, lang),
    description: L(GALLERY.chrome.metaDescription, lang),
    itemListElement: GALLERY.artifacts.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: itemName(a, lang),
      description: itemDescription(a, lang),
    })),
  });
}

/* ---- chrome: sidebar + topbar ------------------------------------------- */

function navLink(a, index, lang, current) {
  const num = String(index + 1).padStart(2, "0");
  return `          <a class="mui-sidebar__item" href="#${a.id}" data-artifact-link="${a.id}"${current ? ' aria-current="page"' : ""}>
            <span class="mui-sidebar__item-icon wb-nav-index" aria-hidden="true">${num}</span>
            <span class="mui-sidebar__item-label">${L(GALLERY.chrome.sidebar.links[a.id], lang)}</span>
          </a>`;
}

function renderSidebar(lang, rootPrefix) {
  const s = GALLERY.chrome.sidebar;
  const a = GALLERY.artifacts;
  const webinarPlay = [0, 1, 2].map((i) => navLink(a[i], i, lang, i === 0)).join("\n");
  const engineering = [3, 4, 5, 6, 7, 8, 9].map((i) => navLink(a[i], i, lang, false)).join("\n");
  return `    <nav class="mui-sidebar wb-sidebar" id="artifact-nav" aria-label="${L(s.navAriaLabel, lang)}">
      <a class="mui-sidebar__brand wb-sidebar__brand" href="${portalHome(lang, rootPrefix)}">
        <img src="${rootPrefix}assets/milpa-symbol-color.svg" alt="" width="24" height="24">
        <span class="mui-sidebar__wordmark">${L(s.wordmark, lang)}</span>
      </a>

      <div class="mui-sidebar__nav">
        <div class="mui-sidebar__section" role="group" aria-labelledby="nav-academy-label">
          <span class="mui-sidebar__section-label" id="nav-academy-label">${L(s.groups.academy.label, lang)}</span>
          <a class="mui-sidebar__item" href="${appHref(lang, rootPrefix, "learn")}">
            <span class="mui-sidebar__item-label">${L(s.groups.academy.items.learn, lang)}</span>
          </a>
          <a class="mui-sidebar__item" href="${appHref(lang, rootPrefix, "labs")}">
            <span class="mui-sidebar__item-label">${L(s.groups.academy.items.labs, lang)}</span>
          </a>
          <a class="mui-sidebar__item" href="${rootPrefix}webinars/">
            <span class="mui-sidebar__item-label">${L(s.groups.academy.items.webinar, lang)}</span>
          </a>
        </div>

        <div class="mui-sidebar__section" role="group" aria-labelledby="nav-webinar-label">
          <span class="mui-sidebar__section-label" id="nav-webinar-label">${L(s.groups.webinarPlay.label, lang)}</span>
${webinarPlay}
        </div>

        <div class="mui-sidebar__section" role="group" aria-labelledby="nav-architecture-label">
          <span class="mui-sidebar__section-label" id="nav-architecture-label">${L(s.groups.engineeringInspect.label, lang)}</span>
${engineering}
        </div>

        <div class="mui-sidebar__section" role="group" aria-labelledby="nav-demos-label">
          <span class="mui-sidebar__section-label" id="nav-demos-label">${L(s.groups.demos.label, lang)}</span>
          <a class="mui-sidebar__item" href="https://getmilpa.com" target="_blank" rel="noopener">
            <span class="mui-sidebar__item-icon" aria-hidden="true">↗</span>
            <span class="mui-sidebar__item-label">${L(s.groups.demos.items.themeSwap, lang)}</span>
          </a>
          <a class="mui-sidebar__item" href="https://milpa.lat" target="_blank" rel="noopener">
            <span class="mui-sidebar__item-icon" aria-hidden="true">↗</span>
            <span class="mui-sidebar__item-label">${L(s.groups.demos.items.mGerminating, lang)}</span>
          </a>
        </div>
      </div>

      <div class="mui-sidebar__footer wb-sidebar__footer">
        <span class="mui-badge mui-badge--secondary">${L(s.footer.versionBadge, lang)}</span>
        <span class="wb-sidebar__date">${L(s.footer.date, lang)}</span>
      </div>
    </nav>`;
}

function renderTopbar(lang) {
  const t = GALLERY.chrome.topbar;
  return `    <header class="mui-topbar wb-topbar">
      <div class="mui-topbar__start">
        <button class="mui-btn mui-btn--ghost mui-btn--icon mui-topbar__nav-toggle" id="nav-toggle" type="button" aria-label="${L(t.navToggleAria, lang)}" aria-controls="artifact-nav" aria-expanded="false">☰</button>
        <div class="wb-topbar__context" aria-live="polite">
          <span class="wb-topbar__kind" id="current-kind">${L(t.initialKind, lang)}</span>
          <strong id="current-title">${L(t.initialTitle, lang)}</strong>
        </div>
      </div>

      <div class="mui-topbar__end wb-topbar__end">
        <button class="mui-btn mui-btn--ghost mui-btn--icon mui-tooltip" id="previous-artifact" type="button" aria-label="${L(t.previousAria, lang)}" data-tip="${L(t.previousTip, lang)}">←</button>
        <output class="wb-progress" id="artifact-progress" aria-label="${L(t.progressAria, lang)}">01 / 10</output>
        <button class="mui-btn mui-btn--ghost mui-btn--icon mui-tooltip" id="next-artifact" type="button" aria-label="${L(t.nextAria, lang)}" data-tip="${L(t.nextTip, lang)}">→</button>
        <button class="mui-btn mui-btn--ghost mui-btn--icon mui-tooltip" id="theme-toggle" type="button" aria-label="${L(t.themeAria, lang)}" data-tip="${L(t.themeTip, lang)}">◐</button>
        <button class="mui-btn mui-btn--ghost mui-btn--icon mui-tooltip wb-fullscreen" id="fullscreen-toggle" type="button" aria-label="${L(t.fullscreenAria, lang)}" data-tip="${L(t.fullscreenTip, lang)}">⛶</button>
      </div>
    </header>`;
}

/* ---- shared per-artifact fragments -------------------------------------- */

function sourcesDetails(sourcesNode, lang) {
  return `        <details class="wb-source">
          <summary>${L(GALLERY.chrome.sourcesSummary, lang)}</summary>
          <p>${L(sourcesNode, lang)}</p>
        </details>`;
}

function sectionOpen(a, lang, ariaLabelledby, hidden) {
  return `      <section class="wb-artifact" id="${a.id}" data-artifact data-kind="${L(a.kind, lang)}" aria-labelledby="${ariaLabelledby}"${hidden ? " hidden" : ""}>`;
}

/* ---- Artifact 01 · siembra ---------------------------------------------- */

function renderSiembra(a, lang) {
  const f = a.field;
  return `${sectionOpen(a, lang, "siembra-title", false)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span>
            <span class="mui-badge mui-badge--secondary">${L(a.badges.tag, lang)}</span>
          </div>
          <h1 id="siembra-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="wb-graph" aria-describedby="siembra-summary">
          <section class="wb-zone wb-module-tray" aria-labelledby="module-tray-title">
            <header class="wb-zone__header">
              <div>
                <span class="wb-zone__kicker">${L(a.moduleTray.kicker, lang)}</span>
                <h2 id="module-tray-title">${L(a.moduleTray.title, lang)}</h2>
              </div>
              <span class="mui-badge" id="module-count">5</span>
            </header>
            <div class="mui-plot" id="module-palette" role="group" aria-label="${L(a.moduleTray.paletteAria, lang)}"></div>
          </section>

          <section class="wb-zone wb-field" id="module-field" aria-labelledby="field-title" data-dropzone>
            <header class="wb-zone__header">
              <div>
                <span class="wb-zone__kicker">${L(f.kicker, lang)}</span>
                <h2 id="field-title">${L(f.title, lang)}</h2>
              </div>
              <output class="wb-capability-list" id="capability-list">config</output>
            </header>

            <div class="mui-plot wb-field__plot" id="module-plot" role="group" aria-label="${L(f.plotAria, lang)}">
              <div class="mui-plot__core">${L(f.coreLine, lang)}</div>
              <p class="wb-plot-empty" id="field-empty">${L(f.empty, lang)}</p>
            </div>

            <div class="mui-alert wb-inline-status" id="planting-status" role="status" aria-live="polite">
              <span class="mui-alert__icon" aria-hidden="true">·</span>
              <div class="mui-alert__content">
                <p class="mui-alert__title">${L(f.statusTitle, lang)}</p>
                <p class="mui-alert__desc">${L(f.statusDesc, lang)}</p>
              </div>
            </div>
          </section>

          <aside class="wb-zone wb-boot" aria-labelledby="boot-title">
            <header class="wb-zone__header">
              <div>
                <span class="wb-zone__kicker">${L(a.boot.kicker, lang)}</span>
                <h2 id="boot-title">${L(a.boot.title, lang)}</h2>
              </div>
            </header>
            <div class="wb-action-row">
              <button class="mui-btn mui-btn--primary" id="boot-system" type="button">${L(a.boot.start, lang)}</button>
              <button class="mui-btn mui-btn--danger" id="chaos-mode" type="button">${L(a.boot.chaos, lang)}</button>
              <button class="mui-btn mui-btn--ghost" id="reset-graph" type="button">${L(a.boot.reset, lang)}</button>
            </div>
            <div class="mui-terminal wb-boot-terminal" id="boot-terminal">
              <div class="mui-terminal__bar"></div>
              <div class="mui-terminal__body" id="boot-log" role="log" aria-live="polite" aria-label="${L(a.boot.logAria, lang)}" tabindex="0">
                <div class="mui-terminal__line"><span class="mui-terminal__prompt" aria-hidden="true">${a.boot.logPrompt}</span><span class="mui-terminal__out">${L(a.boot.logInitial, lang)}</span></div>
              </div>
            </div>
          </aside>
        </div>

        <p class="mui-sr-only" id="siembra-summary">${L(a.summary, lang)}</p>
        <div class="mui-callout mui-callout--tip wb-lesson" role="note">
          <span class="mui-callout__icon" aria-hidden="true">✓</span>
          <div class="mui-callout__content">
            <p class="mui-callout__title">${L(a.lesson.title, lang)}</p>
            <p class="mui-callout__body">${L(a.lesson.body, lang)}</p>
          </div>
        </div>
${sourcesDetails(a.sources, lang)}
      </section>`;
}

/* ---- Artifact 02 · pipeline --------------------------------------------- */

function renderPipeline(a, lang) {
  const stages = a.stages
    .map((st) => `              <div class="mui-pipeline__stage" data-stage="${st.id}"><span class="mui-pipeline__label">${L(st.label, lang)}</span><p class="mui-pipeline__note"></p></div>`)
    .join("\n");
  return `${sectionOpen(a, lang, "pipeline-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span>
            <span class="mui-badge mui-badge--secondary">${L(a.badges.tag, lang)}</span>
          </div>
          <h1 id="pipeline-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="wb-pipeline-layout">
          <section class="mui-api wb-action-contract" aria-labelledby="action-contract-name">
            <header class="mui-api__header">
              <code class="mui-api__name" id="action-contract-name">${a.contract.name}</code>
              <span class="mui-api__meta"><span class="mui-badge mui-badge--warning">${L(a.contract.mutating, lang)}</span></span>
            </header>
            <div class="mui-api__signature">${L(a.contract.signature, lang)}</div>
            <p class="mui-api__desc">${L(a.contract.desc, lang)}</p>
          </section>

          <div class="wb-caller-controls" role="group" aria-label="${L(a.callers.groupAria, lang)}">
            <button class="mui-btn mui-btn--lg mui-btn--primary wb-caller" type="button" data-caller="human">${L(a.callers.human, lang)}</button>
            <button class="mui-btn mui-btn--lg mui-btn--secondary wb-caller" type="button" data-caller="agent">${L(a.callers.agent, lang)}</button>
            <label class="mui-choice wb-permission-toggle">
              <input class="mui-switch" id="permission-toggle" type="checkbox" role="switch">
              <span class="mui-choice__text">${L(a.callers.toggleText, lang)}<span class="mui-choice__hint">${L(a.callers.toggleHint, lang)}</span></span>
            </label>
          </div>

          <div class="mui-pipeline wb-conceptual-pipeline" id="conceptual-pipeline" aria-label="${L(a.pipelineAria, lang)}">
            <div class="mui-pipeline__track" style="--_pipeline-progress: 0">
              <span class="mui-pipeline__marker" aria-hidden="true"></span>
${stages}
            </div>
          </div>

          <div class="mui-alert mui-alert--info" id="pipeline-result" role="status" aria-live="polite">
            <span class="mui-alert__icon" aria-hidden="true">i</span>
            <div class="mui-alert__content">
              <p class="mui-alert__title">${L(a.result.title, lang)}</p>
              <p class="mui-alert__desc">${L(a.result.desc, lang)}</p>
            </div>
          </div>

          <div class="mui-terminal wb-pipeline-log">
            <div class="mui-terminal__bar"></div>
            <div class="mui-terminal__body" id="pipeline-log" role="log" aria-live="polite" aria-label="${L(a.logAria, lang)}" tabindex="0">
              <div class="mui-terminal__line"><span class="mui-terminal__prompt" aria-hidden="true">${a.logPrompt}</span><span class="mui-terminal__out">${L(a.logInitial, lang)}</span></div>
            </div>
          </div>
        </div>

        <div class="mui-callout mui-callout--note wb-lesson" role="note">
          <span class="mui-callout__icon" aria-hidden="true">i</span>
          <div class="mui-callout__content">
            <p class="mui-callout__title">${L(a.lesson.title, lang)}</p>
            <p class="mui-callout__body">${L(a.lesson.body, lang)}</p>
          </div>
        </div>
${sourcesDetails(a.sources, lang)}
      </section>`;
}

/* ---- Artifact 03 · compuerta -------------------------------------------- */

function renderCompuerta(a, lang) {
  return `${sectionOpen(a, lang, "gate-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span>
            <span class="mui-badge mui-badge--secondary">${L(a.badges.tag, lang)}</span>
          </div>
          <h1 id="gate-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="mui-gate wb-gate-layout" id="gate-root" data-status="pending">
          <section class="mui-gate__request" aria-labelledby="request-title">
            <header class="wb-gate-request__header">
              <span class="wb-zone__kicker">${L(a.request.kicker, lang)}</span>
              <span class="mui-badge mui-badge--warning" id="gate-status-badge">${a.request.statusBadge}</span>
            </header>
            <span class="mui-gate__actor">${L(a.request.actor, lang)}</span>
            <h2 class="mui-gate__action" id="request-title">${L(a.request.action, lang)}</h2>
            <span class="mui-gate__facts">${L(a.request.facts, lang)}</span>
          </section>

          <section class="wb-gate-machine" aria-labelledby="gate-machine-title">
            <span class="wb-zone__kicker">${L(a.machine.kicker, lang)}</span>
            <h2 id="gate-machine-title">${L(a.machine.title, lang)}</h2>
            <div class="wb-gate-symbol" id="gate-symbol" data-status="pending" aria-hidden="true">
              <span></span><i></i><span></span>
            </div>
            <div class="mui-gate__decisions" role="group" aria-label="${L(a.machine.decisionsAria, lang)}">
              <button class="mui-btn mui-btn--primary" type="button" data-decision="approved">${L(a.machine.approve, lang)}</button>
              <button class="mui-btn mui-btn--danger" type="button" data-decision="rejected">${L(a.machine.reject, lang)}</button>
              <button class="mui-btn" type="button" data-decision="waived">${L(a.machine.waive, lang)}</button>
            </div>
            <button class="mui-btn mui-btn--ghost" id="self-approval" type="button">${L(a.machine.selfApproval, lang)}</button>
            <button class="mui-btn mui-btn--ghost mui-btn--sm" id="reset-gate" type="button">${L(a.machine.reset, lang)}</button>
            <p class="mui-gate__outcome" id="gate-result" role="status"></p>
          </section>

          <section class="wb-audit-column" aria-labelledby="audit-title">
            <header class="wb-zone__header">
              <div>
                <span class="wb-zone__kicker">${L(a.audit.kicker, lang)}</span>
                <h2 id="audit-title">${L(a.audit.title, lang)}</h2>
              </div>
              <span class="mui-badge" id="audit-count">${L(a.audit.countInitial, lang)}</span>
            </header>
            <ol class="mui-gate__audit" id="gate-audit" role="log" aria-label="${L(a.audit.logAria, lang)}"></ol>
          </section>
        </div>

        <div class="mui-callout mui-callout--warning wb-lesson" role="note">
          <span class="mui-callout__icon" aria-hidden="true">!</span>
          <div class="mui-callout__content">
            <p class="mui-callout__title">${L(a.lesson.title, lang)}</p>
            <p class="mui-callout__body">${L(a.lesson.body, lang)}</p>
          </div>
        </div>
${sourcesDetails(a.sources, lang)}
      </section>`;
}

/* ---- Artifact 04 · atlas ------------------------------------------------ */

function renderAtlas(a, lang) {
  const n = a.nodes;
  const node = (i, badgeClass) =>
    `<button class="wb-boundary-node" type="button" data-node="${n[i].node}"><span class="${badgeClass}">${L(n[i].badge, lang)}</span><strong>${L(n[i].name, lang)}</strong><small>${L(n[i].desc, lang)}</small></button>`;
  const inspector = a.inspector;
  return `${sectionOpen(a, lang, "atlas-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span>
            <span class="mui-badge mui-badge--info">${L(a.badges.tag, lang)}</span>
          </div>
          <h1 id="atlas-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="mui-tabs wb-atlas-tabs" role="tablist" aria-label="${L(a.tabsAria, lang)}">
          <button class="mui-tabs__tab" id="atlas-tab-boot" type="button" role="tab" aria-selected="true" aria-controls="atlas-panel" data-atlas-flow="boot">${L(a.tabs.boot, lang)}</button>
          <button class="mui-tabs__tab" id="atlas-tab-mcp" type="button" role="tab" aria-selected="false" aria-controls="atlas-panel" data-atlas-flow="mcp" tabindex="-1">${L(a.tabs.mcp, lang)}</button>
          <button class="mui-tabs__tab" id="atlas-tab-process" type="button" role="tab" aria-selected="false" aria-controls="atlas-panel" data-atlas-flow="process" tabindex="-1">${L(a.tabs.process, lang)}</button>
          <button class="mui-tabs__tab" id="atlas-tab-ui" type="button" role="tab" aria-selected="false" aria-controls="atlas-panel" data-atlas-flow="ui" tabindex="-1">${L(a.tabs.ui, lang)}</button>
        </div>

        <div class="mui-tabs__panel wb-atlas-panel" id="atlas-panel" role="tabpanel" aria-labelledby="atlas-tab-boot" tabindex="0">
          <div class="wb-boundary-map" id="boundary-map" aria-label="${L(a.mapAria, lang)}">
            <div class="wb-boundary-tier" data-tier="host">
              <span class="wb-boundary-tier__label">${L(a.tiers.hosts, lang)}</span>
              ${node(0, "mui-badge")}
            </div>
            <div class="wb-boundary-arrow" aria-hidden="true">${L(a.arrows.adapters, lang)}</div>
            <div class="wb-boundary-tier" data-tier="adapters">
              <span class="wb-boundary-tier__label">${L(a.tiers.adapters, lang)}</span>
              ${node(1, "mui-badge mui-badge--info")}
              ${node(2, "mui-badge mui-badge--info")}
            </div>
            <div class="wb-boundary-arrow" aria-hidden="true">${L(a.arrows.engines, lang)}</div>
            <div class="wb-boundary-tier" data-tier="engines">
              <span class="wb-boundary-tier__label">${L(a.tiers.engines, lang)}</span>
              ${node(3, "mui-badge mui-badge--secondary")}
              ${node(4, "mui-badge mui-badge--secondary")}
              ${node(5, "mui-badge mui-badge--secondary")}
            </div>
            <div class="wb-boundary-arrow" aria-hidden="true">${L(a.arrows.contracts, lang)}</div>
            <div class="wb-boundary-tier" data-tier="contracts">
              <span class="wb-boundary-tier__label">${L(a.tiers.contracts, lang)}</span>
              ${node(6, "mui-badge mui-badge--accent")}
              ${node(7, "mui-badge mui-badge--accent")}
              ${node(8, "mui-badge mui-badge--accent")}
              ${node(9, "mui-badge mui-badge--accent")}
              ${node(10, "mui-badge mui-badge--accent")}
              ${node(11, "mui-badge mui-badge--accent")}
            </div>
          </div>

          <aside class="wb-boundary-inspector" aria-labelledby="boundary-inspector-title">
            <span class="wb-zone__kicker" id="boundary-inspector-kind">${L(inspector.kind, lang)}</span>
            <h2 id="boundary-inspector-title">${L(inspector.title, lang)}</h2>
            <p id="boundary-inspector-copy">${L(inspector.copy, lang)}</p>
            <dl class="wb-boundary-facts">
              <div><dt>${L(inspector.roleLabel, lang)}</dt><dd id="boundary-role">${L(inspector.role, lang)}</dd></div>
              <div><dt>${L(inspector.depsLabel, lang)}</dt><dd id="boundary-deps">${L(inspector.deps, lang)}</dd></div>
              <div><dt>${L(inspector.sourceLabel, lang)}</dt><dd><code id="boundary-source">${L(inspector.source, lang)}</code></dd></div>
            </dl>
          </aside>
        </div>

        <div class="mui-callout mui-callout--note wb-lesson" role="note">
          <span class="mui-callout__icon" aria-hidden="true">i</span>
          <div class="mui-callout__content"><p class="mui-callout__title">${L(a.lesson.title, lang)}</p><p class="mui-callout__body">${L(a.lesson.body, lang)}</p></div>
        </div>
        <details class="wb-source"><summary>${L(GALLERY.chrome.sourcesSummary, lang)}</summary><p>${L(a.sources, lang)}</p></details>
      </section>`;
}

/* ---- Artifact 05 · runtime ---------------------------------------------- */

function renderRuntime(a, lang) {
  const options = a.scenarios
    .map((sc) => `              <option value="${sc.value}">${L(sc.label, lang)}</option>`)
    .join("\n");
  // Clase del badge de auditoría por fila (esqueleto de estilo, paralelo a tableRows).
  const auditBadge = [
    "mui-badge",
    "mui-badge mui-badge--success",
    "mui-badge mui-badge--success",
    "mui-badge",
    "mui-badge mui-badge--success",
    "mui-badge mui-badge--warning",
    "mui-badge mui-badge--success",
  ];
  const rows = a.tableRows
    .map((r, i) => `                <tr><td>${L(r.output, lang)}</td><td>${L(r.callback, lang)}</td><td><span class="${auditBadge[i]}">${L(r.audit, lang)}</span></td></tr>`)
    .join("\n");
  return `${sectionOpen(a, lang, "runtime-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta"><span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span><span class="mui-badge mui-badge--info">${L(a.badges.tag, lang)}</span></div>
          <h1 id="runtime-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="wb-runtime-controls">
          <div class="mui-field">
            <label class="mui-field__label" for="runtime-scenario">${L(a.scenarioLabel, lang)}</label>
            <select class="mui-select" id="runtime-scenario">
${options}
            </select>
          </div>
          <button class="mui-btn mui-btn--primary" id="run-runtime" type="button">${L(a.run, lang)}</button>
          <button class="mui-btn mui-btn--ghost" id="reset-runtime" type="button">${L(a.reset, lang)}</button>
        </div>

        <div class="wb-runtime-layout">
          <div class="mui-pipeline mui-pipeline--vertical" id="runtime-rail" aria-label="${L(a.railAria, lang)}">
            <div class="mui-pipeline__track" style="--_pipeline-progress: 0"></div>
          </div>

          <div class="wb-runtime-evidence">
          <div class="mui-alert mui-alert--info" id="runtime-result" role="status" aria-live="polite">
            <span class="mui-alert__icon" aria-hidden="true">i</span>
            <div class="mui-alert__content"><p class="mui-alert__title">${L(a.result.title, lang)}</p><p class="mui-alert__desc">${L(a.result.desc, lang)}</p></div>
          </div>

          <div class="mui-table-wrap" role="region" aria-label="${L(a.tableAria, lang)}" tabindex="0">
            <table class="mui-table mui-table--compact wb-runtime-table">
              <thead><tr><th>${L(a.tableHeaders.output, lang)}</th><th>${L(a.tableHeaders.callback, lang)}</th><th>${L(a.tableHeaders.audit, lang)}</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          </div>
        </div>

        <div class="mui-callout mui-callout--warning wb-lesson" role="note"><span class="mui-callout__icon" aria-hidden="true">!</span><div class="mui-callout__content"><p class="mui-callout__title">${L(a.lesson.title, lang)}</p><p class="mui-callout__body">${L(a.lesson.body, lang)}</p></div></div>
        <details class="wb-source"><summary>${L(GALLERY.chrome.sourcesSummary, lang)}</summary><p>${L(a.sources, lang)}</p></details>
      </section>`;
}

/* ---- Artifact 06 · event-log -------------------------------------------- */

function renderEventLog(a, lang) {
  const p = a.projection;
  return `${sectionOpen(a, lang, "event-log-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta"><span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span><span class="mui-badge mui-badge--info">${L(a.badges.tag, lang)}</span></div>
          <h1 id="event-log-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="mui-replay wb-event-layout" id="replay-root">
          <section class="wb-event-column" aria-labelledby="event-stream-title">
            <header class="wb-zone__header"><div><span class="wb-zone__kicker">${L(a.stream.kicker, lang)}</span><h2 id="event-stream-title">${L(a.stream.title, lang)}</h2></div><span class="mui-badge" id="event-count">${L(a.stream.countInitial, lang)}</span></header>
            <ol class="mui-replay__stream" id="event-lines" aria-label="${L(a.stream.linesAria, lang)}"></ol>
            <div class="wb-action-row" id="event-decisions" role="group" aria-label="${L(a.stream.decisionsAria, lang)}">
              <button class="mui-btn mui-btn--secondary" type="button" data-event-decision="approved">${L(a.stream.approve, lang)}</button>
              <button class="mui-btn mui-btn--danger" type="button" data-event-decision="rejected">${L(a.stream.reject, lang)}</button>
              <button class="mui-btn" type="button" data-event-decision="waived">${L(a.stream.waive, lang)}</button>
              <button class="mui-btn mui-btn--ghost" id="reset-events" type="button">${L(a.stream.reset, lang)}</button>
            </div>
          </section>

          <section class="wb-projection-column" aria-labelledby="projection-title">
            <header class="wb-zone__header"><div><span class="wb-zone__kicker">${L(p.kicker, lang)}</span><h2 id="projection-title">${L(p.title, lang)}</h2></div><span class="mui-badge mui-badge--secondary" id="projection-position">2 / 2</span></header>
            <div class="mui-replay__projection" role="status">
              <div class="mui-replay__stat"><span class="mui-replay__stat-label">${L(p.stateLabel, lang)}</span><span class="mui-replay__stat-value" id="projection-state">${L(p.stateValue, lang)}</span></div>
              <div class="mui-replay__stat"><span class="mui-replay__stat-label">${L(p.verificationLabel, lang)}</span><span class="mui-replay__stat-value" id="projection-verification">${L(p.verificationValue, lang)}</span></div>
              <div class="mui-replay__stat"><span class="mui-replay__stat-label">${L(p.actorLabel, lang)}</span><span class="mui-replay__stat-value" id="projection-actor">${L(p.actorValue, lang)}</span></div>
            </div>
            <p class="wb-projection-note">${L(p.note, lang)}</p>
            <div class="mui-field wb-replay-cut">
              <label class="mui-field__label" for="replay-slider">${L(p.sliderLabel, lang)}</label>
              <div class="mui-replay__scrubber"><input id="replay-slider" type="range" min="0" max="2" value="2" step="1"></div>
            </div>
          </section>
        </div>

        <div class="mui-callout mui-callout--warning wb-lesson" role="note"><span class="mui-callout__icon" aria-hidden="true">!</span><div class="mui-callout__content"><p class="mui-callout__title">${L(a.lesson.title, lang)}</p><p class="mui-callout__body">${L(a.lesson.body, lang)}</p></div></div>
        <details class="wb-source"><summary>${L(GALLERY.chrome.sourcesSummary, lang)}</summary><p>${L(a.sources, lang)}</p></details>
      </section>`;
}

/* ---- Artifact 07 · design-contract -------------------------------------- */

function renderDesignContract(a, lang) {
  const c = a.contrast;
  const steps = a.steps
    .map((st, i) => `            <li class="mui-steps__item"${i === 2 ? ' aria-current="step"' : ""}><span class="mui-steps__marker" aria-hidden="true"></span><h2 class="mui-steps__title">${L(st.title, lang)}</h2><p class="mui-steps__body">${L(st.body, lang)}</p></li>`)
    .join("\n");
  const statValues = ["160", "68", "193"];
  const stats = a.stats
    .map((s, i) => `            <div class="mui-stat"><span class="mui-stat__label">${L(s.label, lang)}</span><span class="mui-stat__value">${statValues[i]}</span><span class="mui-stat__meta">${L(s.meta, lang)}</span></div>`)
    .join("\n");
  return `${sectionOpen(a, lang, "design-contract-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta"><span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span><span class="mui-badge mui-badge--info">${L(a.badges.tag, lang)}</span></div>
          <h1 id="design-contract-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="wb-design-flow">
          <ol class="mui-steps wb-design-steps">
${steps}
          </ol>

          <div class="wb-design-metrics" aria-label="${L(a.metricsAria, lang)}">
${stats}
          </div>

          <section class="wb-contrast-lab" aria-labelledby="contrast-lab-title">
            <header class="wb-zone__header"><div><span class="wb-zone__kicker">${L(c.kicker, lang)}</span><h2 id="contrast-lab-title">${L(c.title, lang)}</h2></div><span class="mui-badge" id="contrast-ratio">14.18:1</span></header>
            <div class="wb-color-controls">
              <label class="wb-color-control">${L(c.textLabel, lang)}<input type="color" id="contrast-text" value="#faf5ef"><span id="contrast-text-value">#FAF5EF</span></label>
              <label class="wb-color-control">${L(c.surfaceLabel, lang)}<input type="color" id="contrast-surface" value="#372f27"><span id="contrast-surface-value">#372F27</span></label>
              <label class="wb-color-control">${L(c.backgroundLabel, lang)}<input type="color" id="contrast-bg" value="#17120d"><span id="contrast-bg-value">#17120D</span></label>
              <div class="mui-field wb-alpha-control"><label class="mui-field__label" for="surface-alpha">${L(c.alphaLabel, lang)} <output id="alpha-value">100%</output></label><input id="surface-alpha" type="range" min="0" max="100" value="100"></div>
            </div>
            <div class="wb-composite-preview" id="composite-preview"><span>${L(c.preview, lang)}</span></div>
            <div class="mui-alert mui-alert--success" id="contrast-result" role="status" aria-live="polite"><span class="mui-alert__icon" aria-hidden="true">✓</span><div class="mui-alert__content"><p class="mui-alert__title">${L(c.resultTitle, lang)}</p><p class="mui-alert__desc">${L(c.resultDesc, lang)}</p></div></div>
          </section>
        </div>

        <div class="mui-callout mui-callout--warning wb-lesson" role="note"><span class="mui-callout__icon" aria-hidden="true">!</span><div class="mui-callout__content"><p class="mui-callout__title">${L(a.lesson.title, lang)}</p><p class="mui-callout__body">${L(a.lesson.body, lang)}</p></div></div>
        <details class="wb-source"><summary>${L(GALLERY.chrome.sourcesSummary, lang)}</summary><p>${L(a.sources, lang)}</p></details>
      </section>`;
}

/* ---- Artifact 08 · plan ------------------------------------------------- */

function renderPlan(a, lang) {
  const ctrl = a.controls;
  const stepIds = ["generate", "preflight", "write", "verify"];
  const steps = a.progress.steps
    .map((st, i) => `              <li class="mui-steps__item"${i === 0 ? ' aria-current="step"' : ""} data-plan-step="${stepIds[i]}"><span class="mui-steps__marker" aria-hidden="true"></span><h3 class="mui-steps__title">${L(st.title, lang)}</h3><p class="mui-steps__body">${L(st.body, lang)}</p></li>`)
    .join("\n");
  return `${sectionOpen(a, lang, "plan-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta"><span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span><span class="mui-badge mui-badge--warning">${L(a.badges.tag, lang)}</span></div>
          <h1 id="plan-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="wb-plan-layout">
          <section class="wb-plan-controls" aria-labelledby="plan-controls-title">
            <header class="wb-zone__header"><div><span class="wb-zone__kicker">${L(ctrl.kicker, lang)}</span><h2 id="plan-controls-title">${L(ctrl.title, lang)}</h2></div><span class="mui-badge mui-badge--secondary">${L(ctrl.flavor, lang)}</span></header>
            <div class="mui-code wb-plan-command">
              <div class="mui-code__header"><span class="mui-code__file">${L(ctrl.requestFile, lang)}</span><span class="mui-code__lang">php</span></div>
              <div class="mui-code__body" role="region" aria-label="${L(ctrl.requestAria, lang)}" tabindex="0"><pre><code><span class="tok-kw">entity</span> Product
<span class="tok-attr">fields</span>: nombre:string:120,
        precio:decimal:10,2</code></pre></div>
            </div>
            <div class="wb-plan-switches">
              <label class="mui-choice"><input class="mui-switch" id="target-exists" type="checkbox" role="switch"><span class="mui-choice__text">${L(ctrl.existsText, lang)}<span class="mui-choice__hint">${L(ctrl.existsHint, lang)}</span></span></label>
              <label class="mui-choice"><input class="mui-switch" id="force-write" type="checkbox" role="switch"><span class="mui-choice__text">${L(ctrl.forceText, lang)}<span class="mui-choice__hint">${L(ctrl.forceHint, lang)}</span></span></label>
            </div>
            <div class="wb-action-row">
              <button class="mui-btn mui-btn--primary" id="generate-plan" type="button">${L(ctrl.generate, lang)}</button>
              <button class="mui-btn" id="inspect-plan" type="button" disabled>${L(ctrl.inspect, lang)}</button>
              <button class="mui-btn mui-btn--secondary" id="apply-plan" type="button" disabled>${L(ctrl.apply, lang)}</button>
              <button class="mui-btn mui-btn--ghost" id="reset-plan" type="button">${L(ctrl.reset, lang)}</button>
            </div>
          </section>

          <section class="wb-plan-files" aria-labelledby="plan-files-title">
            <header class="wb-zone__header"><div><span class="wb-zone__kicker">${L(a.files.kicker, lang)}</span><h2 id="plan-files-title">${L(a.files.title, lang)}</h2></div><span class="mui-badge" id="planned-file-count">${L(a.files.countInitial, lang)}</span></header>
            <ul class="mui-file-tree" id="plan-file-tree"><li class="mui-file-tree__file">${L(a.files.empty, lang)}</li></ul>
            <div class="mui-code wb-plan-diff" id="plan-diff" hidden>
              <div class="mui-code__header"><span class="mui-code__file">Product.php</span><span class="mui-code__lang">diff</span></div>
              <div class="mui-code__body" role="region" aria-label="${L(a.files.diffAria, lang)}" tabindex="0"><pre><code><span class="mui-code__line mui-code__line--add"><ins>final class Product implements EntityInterface</ins></span>
<span class="mui-code__line mui-code__line--add"><ins>{ public string $nombre; }</ins></span>
<span class="mui-code__line mui-code__line--add"><ins>{ public Decimal $precio; }</ins></span></code></pre></div>
            </div>
          </section>

          <section class="wb-plan-progress" aria-labelledby="plan-progress-title">
            <header class="wb-zone__header"><div><span class="wb-zone__kicker">${L(a.progress.kicker, lang)}</span><h2 id="plan-progress-title">${L(a.progress.title, lang)}</h2></div></header>
            <ol class="mui-steps" id="plan-steps">
${steps}
            </ol>
            <div class="mui-terminal wb-plan-terminal">
              <div class="mui-terminal__bar"></div>
              <div class="mui-terminal__body" id="plan-log" role="log" aria-live="polite" aria-label="${L(a.progress.logAria, lang)}" tabindex="0"><div class="mui-terminal__line"><span class="mui-terminal__prompt" aria-hidden="true">${a.progress.logPrompt}</span><span class="mui-terminal__out">${L(a.progress.logInitial, lang)}</span></div></div>
            </div>
          </section>
        </div>

        <div class="mui-callout mui-callout--warning wb-lesson" role="note"><span class="mui-callout__icon" aria-hidden="true">!</span><div class="mui-callout__content"><p class="mui-callout__title">${L(a.lesson.title, lang)}</p><p class="mui-callout__body">${L(a.lesson.body, lang)}</p></div></div>
        <details class="wb-source"><summary>${L(GALLERY.chrome.sourcesSummary, lang)}</summary><p>${L(a.sources, lang)}</p></details>
      </section>`;
}

/* ---- Artifact 09 · atomo (fallback estático desde ATOMO) ---------------- */

function renderAtomoSection(a, lang) {
  return `${sectionOpen(a, lang, "atomo-title", true)}
        <milpa-artifact id="atomo-artifact" lang="${lang}">
        ${renderAtomoFallback(lang, "#runtime")}
        </milpa-artifact>
      </section>`;
}

/* ---- Artifact 10 · frontera (boundary-map demo + coupling test) --------- */

function renderFrontera(a, lang) {
  const d = a.demo;
  const u = a.understand;
  const c = d.coupling;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const mappedBadge = L(d.mappedBadge, lang);
  const leakBadge = L(d.leakBadge, lang);
  // Diagram labels are decorative skeleton (not GALLERY leaves): localized inline
  // so the en page reads core→frontier→screen, not Spanish. The chips ARE the raw
  // es codes the core emits — Spanish on BOTH pages IS the lesson.
  const diag = lang === "en"
    ? { core: "core", map: "frontier · es→en map", screen: "screen" }
    : { core: "núcleo", map: "frontera · mapa es→en", screen: "pantalla" };

  const coreChips = d.outputs.map((code) => `<code class="wb-frontier-chip">${code}</code>`).join("");
  const options = d.outputs
    .map((code, i) => `                <option value="${esc(code)}"${i === 0 ? " selected" : ""}>${code}</option>`)
    .join("\n");

  // Map table: 7 mapped rows + the gap row (gapCode) marked as a leak. The static
  // render already SHOWS the leak (PE: the lesson reads with zero JS). The rows +
  // container data-* ARE the demo fixture artifacts.js reads back (single source).
  const rows = d.outputs
    .map((code) => {
      const mapped = Object.prototype.hasOwnProperty.call(d.enMap, code);
      const value = mapped ? d.enMap[code] : "";
      return `                <tr data-frontier-row data-code="${esc(code)}" data-mapped="${mapped}"${mapped ? ` data-value="${esc(value)}"` : " data-gap"}>
                  <td><code>${code}</code></td>
                  <td>${mapped
                    ? `<code>${value}</code> <span class="mui-badge mui-badge--success">${mappedBadge}</span>`
                    : `<span class="wb-frontier-dash" aria-hidden="true">—</span> <span class="mui-badge mui-badge--warning wb-frontier-leak-badge">${leakBadge}</span>`}</td>
                </tr>`;
    })
    .join("\n");
  const missingList = d.outputs.filter((code) => !Object.prototype.hasOwnProperty.call(d.enMap, code));

  return `${sectionOpen(a, lang, "frontera-title", true)}
        <header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span>
            <span class="mui-badge mui-badge--info">${L(a.badges.tag, lang)}</span>
          </div>
          <h1 id="frontera-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <section class="wb-frontier-understand" aria-labelledby="frontier-understand-title">
          <header class="wb-zone__header">
            <div>
              <span class="wb-zone__kicker">${L(u.kicker, lang)}</span>
              <h2 id="frontier-understand-title">${L(u.title, lang)}</h2>
            </div>
          </header>
          <div class="wb-frontier-options">
            <article class="wb-frontier-option"><h3>${L(u.optionA.name, lang)}</h3><p>${L(u.optionA.body, lang)}</p></article>
            <article class="wb-frontier-option"><h3>${L(u.optionB.name, lang)}</h3><p>${L(u.optionB.body, lang)}</p></article>
          </div>
          <p class="wb-frontier-when">${L(u.when, lang)}</p>
        </section>

        <section class="wb-frontier-see" aria-labelledby="frontier-see-title">
          <span class="wb-zone__kicker">${L(a.see.kicker, lang)}</span>
          <h2 id="frontier-see-title">${L(a.see.title, lang)}</h2>
          <p>${L(a.see.body, lang)}</p>
        </section>

        <section class="wb-frontier-demo" aria-label="${esc(stripTags(L(a.title, lang)))}" data-gap-code="${esc(d.gapCode)}" data-gap-value="${esc(d.gapValue)}" data-mapped-badge="${esc(mappedBadge)}" data-leak-badge="${esc(leakBadge)}" data-couple-ok="${esc(L(c.okLabel, lang))}" data-couple-missing="${esc(L(c.missingLabel, lang))}" data-couple-orphan="${esc(L(c.orphanLabel, lang))}" data-couple-ok-desc="${esc(L(c.okDesc, lang))}" data-couple-gap-desc="${esc(L(c.gapDesc, lang))}">
          <p class="wb-frontier-intro">${L(d.intro, lang)}</p>

          <div class="wb-frontier-diagram" aria-hidden="true">
            <div class="wb-frontier-stage wb-frontier-stage--core">
              <span class="wb-frontier-stage__label">${diag.core}</span>
              <div class="wb-frontier-chips">${coreChips}</div>
            </div>
            <span class="wb-frontier-arrow">→</span>
            <div class="wb-frontier-stage wb-frontier-stage--map"><span class="wb-frontier-stage__label">${diag.map}</span></div>
            <span class="wb-frontier-arrow">→</span>
            <div class="wb-frontier-stage wb-frontier-stage--screen"><span class="wb-frontier-stage__label">${diag.screen}</span></div>
          </div>

          <div class="wb-frontier-controls">
            <div class="mui-field">
              <label class="mui-field__label" for="frontier-code">${L(d.codeSelectorLabel, lang)}</label>
              <select class="mui-select" id="frontier-code">
${options}
              </select>
            </div>
            <div class="wb-frontier-lang" role="group" aria-label="${esc(stripTags(L(d.langToggleLabel, lang)))}">
              <span class="mui-field__label">${L(d.langToggleLabel, lang)}</span>
              <div class="wb-frontier-lang__buttons">
                <button class="mui-btn mui-btn--sm mui-btn--primary" type="button" id="frontier-lang-es" data-frontier-lang="es" aria-pressed="true">${L(d.langOptionEs, lang)}</button>
                <button class="mui-btn mui-btn--sm" type="button" id="frontier-lang-en" data-frontier-lang="en" aria-pressed="false">${L(d.langOptionEn, lang)}</button>
              </div>
              <small class="wb-frontier-hint">${L(d.langToggleHint, lang)}</small>
            </div>
          </div>

          <div class="wb-frontier-projection">
            <span class="wb-zone__kicker">${L(d.projectionLabel, lang)}</span>
            <output class="wb-frontier-output" id="frontier-output" data-lang="es" data-code="${esc(d.outputs[0])}">${d.outputs[0]}</output>
          </div>

          <div class="mui-table-wrap wb-frontier-map" role="region" aria-label="${esc(stripTags(L(a.title, lang)))}" tabindex="0">
            <table class="mui-table mui-table--compact">
              <thead><tr><th>${L(d.codeSelectorLabel, lang)}</th><th>${L(d.langOptionEn, lang)}</th></tr></thead>
              <tbody id="frontier-map-body">
${rows}
              </tbody>
            </table>
          </div>

          <div class="wb-action-row">
            <button class="mui-btn mui-btn--primary" type="button" id="frontier-repair">${L(d.repairButton, lang)}</button>
            <button class="mui-btn mui-btn--ghost" type="button" id="frontier-reset">${L(d.resetButton, lang)}</button>
          </div>
          <small class="wb-frontier-hint">${L(d.repairHint, lang)}</small>

          <section class="wb-frontier-coupling" aria-labelledby="frontier-coupling-title">
            <header class="wb-zone__header">
              <div>
                <span class="wb-zone__kicker">${L(a.verify.kicker, lang)}</span>
                <h3 id="frontier-coupling-title">${L(c.title, lang)}</h3>
              </div>
              <button class="mui-btn mui-btn--sm" type="button" id="frontier-run-couple">${L(c.runLabel, lang)}</button>
            </header>
            <div class="mui-alert mui-alert--warning wb-frontier-couple-result" id="frontier-coupling-result" data-state="missing" role="status" aria-live="polite">
              <span class="mui-alert__icon" aria-hidden="true">!</span>
              <div class="mui-alert__content">
                <p class="mui-alert__title">${L(c.missingLabel, lang)}: ${missingList.map((code) => `<code>${code}</code>`).join(", ")}</p>
                <p class="mui-alert__desc">${L(c.gapDesc, lang)}</p>
              </div>
            </div>
          </section>
        </section>

        <section class="wb-frontier-do" aria-labelledby="frontier-do-title">
          <span class="wb-zone__kicker">${L(a.do.kicker, lang)}</span>
          <h2 id="frontier-do-title">${L(a.do.title, lang)}</h2>
          <p>${L(a.do.body, lang)}</p>
        </section>

        <section class="wb-frontier-verify" aria-labelledby="frontier-verify-title">
          <span class="wb-zone__kicker">${L(a.verify.kicker, lang)}</span>
          <h2 id="frontier-verify-title">${L(a.verify.title, lang)}</h2>
          <p>${L(a.verify.body, lang)}</p>
        </section>

        <section class="wb-frontier-bug" aria-labelledby="frontier-bug-title">
          <span class="wb-zone__kicker">${L(a.bug.kicker, lang)}</span>
          <h2 id="frontier-bug-title">${L(a.bug.title, lang)}</h2>
          <p>${L(a.bug.body, lang)}</p>
        </section>

        <p class="wb-frontier-modelnote">${L(a.modelNote, lang)}</p>

        <div class="mui-callout mui-callout--tip wb-lesson" role="note">
          <span class="mui-callout__icon" aria-hidden="true">✓</span>
          <div class="mui-callout__content">
            <p class="mui-callout__title">${L(a.lesson.title, lang)}</p>
            <p class="mui-callout__body">${L(a.lesson.body, lang)}</p>
          </div>
        </div>
${sourcesDetails(a.sources, lang)}
      </section>`;
}

const RENDERERS = {
  siembra: renderSiembra,
  pipeline: renderPipeline,
  compuerta: renderCompuerta,
  atlas: renderAtlas,
  runtime: renderRuntime,
  "event-log": renderEventLog,
  "design-contract": renderDesignContract,
  plan: renderPlan,
  atomo: renderAtomoSection,
  frontera: renderFrontera,
};

/* ---- document ----------------------------------------------------------- */

function galleryPage(lang, gtagBootstrap) {
  const rootPrefix = rootPrefixFor(lang);
  const head = renderHead({
    lang,
    title: L(GALLERY.chrome.pageTitle, lang),
    description: L(GALLERY.chrome.metaDescription, lang),
    canonical: urlFor(lang),
    alternates: { es: urlFor("es"), en: urlFor("en"), "x-default": urlFor("es") },
    jsonld: galleryJsonLd(lang),
    extraHead: extraHead(lang, rootPrefix, gtagBootstrap),
  });
  const sections = GALLERY.artifacts.map((a) => RENDERERS[a.id](a, lang)).join("\n\n");
  return `${htmlOpen(lang, "wb-app")}
${head}
<body>
  <div class="mui-shell wb-shell" id="app-shell">
    <a class="mui-shell__skip" href="#main">${L(GALLERY.chrome.skipLink, lang)}</a>

${renderSidebar(lang, rootPrefix)}

${renderTopbar(lang)}

    <main class="mui-shell__main mui-shell__main--wide wb-main" id="main" tabindex="-1">
${sections}
    </main>
  </div>

  <!-- scripts clásicos con defer (no módulos): la galería funciona también en file:// -->
${scripts(rootPrefix)}
</body>
</html>
`;
}

/* buildGalleryPages: entrada determinista única para gen-site.mjs. Devuelve las
   páginas emitidas + una entrada { es, en } de sitemap + los registros
   llms.txt por idioma (sólo URLs del propio idioma). */
export function buildGalleryPages({ BASE, gtagBootstrap }) {
  BASE_URL.fn = BASE;
  const pages = LANGS.map((lang) => ({ path: outPath(lang), html: galleryPage(lang, gtagBootstrap) }));
  const sitemapPages = [{ es: urlFor("es"), en: urlFor("en") }];
  const note = {
    es: "La galería completa: los 10 artifacts de arquitectura interactivos, del webinar a la inspección de ingeniería.",
    en: "The full gallery: the 10 interactive architecture artifacts, from the webinar to engineering inspection.",
  };
  const llms = {
    es: [{ label: L(GALLERY.chrome.pageTitle, "es"), url: urlFor("es"), note: note.es }],
    en: [{ label: L(GALLERY.chrome.pageTitle, "en"), url: urlFor("en"), note: note.en }],
  };
  return { pages, sitemapPages, llms };
}

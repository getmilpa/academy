import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { ATOMO } from "../artifacts/content/atomo.content.mjs";
import { RUNTIME } from "../artifacts/content/runtime.content.mjs";
import { GALLERY } from "../artifacts/content/gallery.content.mjs";
import { LABS_SHELL } from "../labs/labs.content.mjs";
import { PORTAL } from "../content/portal.content.mjs";
// LLMS_COPY es la única tabla {es,en} que vive fuera de los módulos de contenido
// (prosa de nivel sitio en gen-site.mjs). gen-site.mjs sólo emite el sitio tras
// su guard de módulo-principal, así que este import es libre de efectos.
import { LLMS_COPY } from "../scripts/gen-site.mjs";

// catalog.js es UMD (module.exports = factory()); cjs-module-lexer no ve sus
// named exports a través de un import estático, así que se carga con require.
const require = createRequire(import.meta.url);
const catalog = require("../curriculum/catalog.js");
const labsCatalog = require("../labs/catalog.js");

execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
const es = readFileSync(new URL("../site/atomo/index.html", import.meta.url), "utf8");
const en = readFileSync(new URL("../site/en/atomo/index.html", import.meta.url), "utf8");
const portalEs = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const portalEn = readFileSync(new URL("../site/en/index.html", import.meta.url), "utf8");
const galleryEs = readFileSync(new URL("../site/artifacts/index.html", import.meta.url), "utf8");
const galleryEn = readFileSync(new URL("../site/en/artifacts/index.html", import.meta.url), "utf8");
const labsEs = readFileSync(new URL("../site/labs/index.html", import.meta.url), "utf8");
const labsEn = readFileSync(new URL("../site/en/labs/index.html", import.meta.url), "utf8");

test("es page: lang, hero line, canonical, hreflang", () => {
  assert.match(es, /<html lang="es[^"]*"/);
  assert.match(es, /enseñarte a pensar mientras construyes/);
  assert.match(es, /rel="canonical"/);
  assert.match(es, /hreflang="en"/);
});

test("en page: lang, hero line, hreflang reciprocal", () => {
  assert.match(en, /<html lang="en[^"]*"/);
  assert.match(en, /teach you to think while you build/);
  assert.match(en, /hreflang="es"/);
});

test("both pages hydrate the SAME element: id=atomo-artifact, not the gallery id=atomo", () => {
  for (const html of [es, en]) {
    assert.match(html, /<milpa-artifact id="atomo-artifact"/);
    assert.doesNotMatch(html, /<milpa-artifact id="atomo"[\s">]/);
    assert.doesNotMatch(html, /<section[^>]*id="atomo"/);
  }
});

test("neither page ships a hidden artifact (standalone page renders with zero JS)", () => {
  for (const html of [es, en]) {
    assert.doesNotMatch(html, /<milpa-artifact[^>]*\bhidden\b/);
    assert.doesNotMatch(html, /class="wb-artifact"[^>]*\bhidden\b/);
  }
});

test("relative asset refs resolve at the right depth per language", () => {
  assert.match(es, /href="\.\.\/\.\.\/artifacts\/artifacts\.css"/);
  assert.match(es, /src="\.\.\/\.\.\/artifacts\/artifacts-core\.js" defer/);
  assert.match(es, /src="\.\.\/\.\.\/artifacts\/milpa-artifact\.js" defer/);
  assert.doesNotMatch(es, /\.\.\/\.\.\/\.\.\/artifacts\//);

  assert.match(en, /href="\.\.\/\.\.\/\.\.\/artifacts\/artifacts\.css"/);
  assert.match(en, /src="\.\.\/\.\.\/\.\.\/artifacts\/artifacts-core\.js" defer/);
  assert.match(en, /src="\.\.\/\.\.\/\.\.\/artifacts\/milpa-artifact\.js" defer/);
});

/* Task 2 (debt cleanup): portal + learn pages already ship a favicon link;
   the atom was the one surface missing it (0 icon links before this fix).
   Assert the tag AND the relative depth per language — same criterion as
   the artifacts.css/js asserts above (es 2 levels, en 3 levels under
   academy/, per assetPrefix()). */
test("atom pages ship a favicon <link rel=\"icon\"> at the correct relative depth", () => {
  assert.equal((es.match(/<link rel="icon"/g) || []).length, 1, "es atom page must have exactly one icon link");
  assert.equal((en.match(/<link rel="icon"/g) || []).length, 1, "en atom page must have exactly one icon link");
  assert.match(es, /<link rel="icon" href="\.\.\/\.\.\/assets\/milpa-app-icon\.svg" type="image\/svg\+xml">/);
  assert.match(en, /<link rel="icon" href="\.\.\/\.\.\/\.\.\/assets\/milpa-app-icon\.svg" type="image\/svg\+xml">/);
});

test("machine identifiers are byte-identical between es and en (only visible text differs)", () => {
  const machineTokens = (html) => [...html.matchAll(/data-stage="([^"]+)"|data-surface="([^"]+)"|id="(pipe-[a-z]+|status-[a-z]+|scope-toggle|inv-[a-z]+)"/g)]
    .map((match) => match[1] || match[2] || match[3]);
  assert.deepEqual(machineTokens(es), machineTokens(en));
});

test("initial status lines are static (no-JS renders them, not empty)", () => {
  assert.match(es, /id="status-cli"[^>]*>Elige una puerta para proyectar\.</);
  assert.match(en, /id="status-cli"[^>]*>Pick a door to project\.</);
});

test("JSON-LD LearningResource carries per-language name/description and shared isBasedOn", () => {
  for (const [html, lang] of [[es, "es"], [en, "en"]]) {
    const match = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/);
    assert.ok(match, "missing JSON-LD block");
    const data = JSON.parse(match[1]);
    assert.equal(data["@type"], "LearningResource");
    assert.equal(data.inLanguage, lang);
    assert.ok(data.name.length > 0);
    assert.ok(data.description.length > 0);
    assert.deepEqual(data.isBasedOn, [
      "https://github.com/getmilpa/command",
      "https://github.com/getmilpa/runtime",
      "https://github.com/getmilpa/skeleton",
    ]);
  }
});

test("re-running the generator is idempotent (byte-identical output)", () => {
  const before = { es, en, portalEs, portalEn };
  execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
  const after = {
    es: readFileSync(new URL("../site/atomo/index.html", import.meta.url), "utf8"),
    en: readFileSync(new URL("../site/en/atomo/index.html", import.meta.url), "utf8"),
    portalEs: readFileSync(new URL("../site/index.html", import.meta.url), "utf8"),
    portalEn: readFileSync(new URL("../site/en/index.html", import.meta.url), "utf8"),
  };
  assert.equal(after.es, before.es);
  assert.equal(after.en, before.en);
  assert.equal(after.portalEs, before.portalEs);
  assert.equal(after.portalEn, before.portalEn);
});

test("translation completeness: every leaf string has es and en", () => {
  const missing = [];
  function walk(node, path) {
    if (node && typeof node === "object" && !Array.isArray(node)) {
      const keys = Object.keys(node);
      if (keys.includes("es") || keys.includes("en")) {
        if (!node.es) missing.push(path + ".es");
        if (!node.en) missing.push(path + ".en");
        // Un nodo hoja puede además cargar hijos {es,en} anidados junto a su
        // propio es/en (p. ej. ATOMO.warning: { lead:{es,en}, es, en }). El
        // early-return anterior los saltaba — seguí recorriendo las claves que
        // no son de idioma para no dejar esos leaves fuera del walk.
        for (const k of keys) {
          if (k !== "es" && k !== "en") walk(node[k], `${path}.${k}`);
        }
        return;
      }
      for (const k of keys) walk(node[k], `${path}.${k}`);
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${path}[${i}]`));
    }
  }
  walk(ATOMO, "ATOMO");
  walk(RUNTIME, "RUNTIME");
  walk(GALLERY, "GALLERY");
  walk(LABS_SHELL, "LABS_SHELL");
  walk(catalog.tracks, "catalog.tracks");
  walk(labsCatalog.labs, "labs.labs");
  walk(LLMS_COPY, "LLMS_COPY");
  assert.deepEqual(missing, [], `strings missing a language: ${missing.join(", ")}`);
});

/* Task 1 (cierre de la clase de fuga boundary-map): acople enums↔maps.
   projectProcess() en artifacts-core.js proyecta el log de eventos a estos
   literales es de state/verification. artifacts.js los traduce por su valor con
   los mapas PROJECTION_STATE_EN / PROJECTION_VERIFICATION_EN. Si el core AGREGA
   un estado nuevo, esta lista canónica DEBE actualizarse junto con los mapas —
   ese es el punto del test: un estado del core sin traducción tiene que romper
   CI, no colarse silenciosamente al `?? state` de fallback.

   Como artifacts.js es un script clásico (usa window/document en top-level, no
   es importable en Node), las keys de los mapas se leen del source por regex —
   mismo precedente que site-contract. */
const CORE_STATES = [
  "sin iniciar",
  "solicitado",
  "esperando verificación",
  "listo para ejecutar",
  "detenido",
  "ejecutando",
  "completado",
  "fallido",
];
const CORE_VERIFICATIONS = ["ninguna", "pendiente", "aprobada", "rechazada", "exonerada"];

test("boundary-map coupling: every projectProcess() literal is a map key AND still emitted by the core", () => {
  const coreSrc = readFileSync(new URL("../artifacts/artifacts-core.js", import.meta.url), "utf8");
  const artSrc = readFileSync(new URL("../artifacts/artifacts.js", import.meta.url), "utf8");

  // (b) keys presentes en el source de cada mapa de artifacts.js.
  const mapKeys = (mapName) => {
    const block = artSrc.match(new RegExp(`const ${mapName} = \\{([\\s\\S]*?)\\};`));
    assert.ok(block, `${mapName} block not found in artifacts.js`);
    return new Set([...block[1].matchAll(/"([^"]+)":/g)].map((m) => m[1]));
  };
  const stateKeys = mapKeys("PROJECTION_STATE_EN");
  const verifKeys = mapKeys("PROJECTION_VERIFICATION_EN");

  for (const state of CORE_STATES) {
    // (b) traducción presente en el mapa; quitar la key del mapa → falla acá.
    assert.ok(stateKeys.has(state), `PROJECTION_STATE_EN is missing a translation key: "${state}"`);
    // (c) el core sigue emitiendo ese literal; si el core lo renombra → falla acá
    // y obliga a actualizar test + mapa juntos.
    assert.ok(coreSrc.includes(`"${state}"`), `core no longer emits the state literal: "${state}"`);
  }
  for (const verification of CORE_VERIFICATIONS) {
    assert.ok(verifKeys.has(verification), `PROJECTION_VERIFICATION_EN is missing a translation key: "${verification}"`);
    assert.ok(coreSrc.includes(`"${verification}"`), `core no longer emits the verification literal: "${verification}"`);
  }

  // Cobertura recíproca: los mapas no llevan keys muertas (que ni el core emite
  // ni esta lista canónica declara) — mantiene el mapa y esta lista sincronizados.
  for (const key of stateKeys) assert.ok(CORE_STATES.includes(key), `PROJECTION_STATE_EN has an orphan key not in CORE_STATES: "${key}"`);
  for (const key of verifKeys) assert.ok(CORE_VERIFICATIONS.includes(key), `PROJECTION_VERIFICATION_EN has an orphan key not in CORE_VERIFICATIONS: "${key}"`);
});

/* Task 3: la galería (8 artifacts estáticos + chrome del shell) se extrajo a
   artifacts/content/gallery.content.mjs. Dos guardas:

   (a) completeness — el walk de arriba ya recorre GALLERY: cualquier hoja con
       es|en incompleto falla.

   (b) es-fidelity — cada string es del módulo debe aparecer VERBATIM en el
       artifacts/index.html actual (normalizando el whitespace de indentación
       HTML). Protege contra ediciones accidentales del español durante la
       extracción: si un es no aparece tal cual en el HTML fuente, falla. */
const galleryHtml = readFileSync(new URL("../artifacts/index.html", import.meta.url), "utf8");
const squashWhitespace = (s) => s.replace(/\s+/g, " ").trim();

function collectEsLeaves(node, path, out) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    const keys = Object.keys(node);
    if (keys.includes("es") || keys.includes("en")) {
      if (typeof node.es === "string") out.push([path, node.es]);
      return;
    }
    for (const k of keys) collectEsLeaves(node[k], `${path}.${k}`, out);
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => collectEsLeaves(v, `${path}[${i}]`, out));
  }
}

test("gallery es-fidelity: every es leaf appears verbatim in artifacts/index.html", () => {
  const normalizedHtml = squashWhitespace(galleryHtml);
  const leaves = [];
  collectEsLeaves(GALLERY, "GALLERY", leaves);
  /* Task 5 CARRY: pin the GALLERY walk leaf-count (como el key-count de
     learn-strings). Cierra el blind-spot de completitud — borrar un artifact
     del módulo bajaría el conteo y pasaría el fidelity test silenciosamente.
     Almácigo (frontera): 324 → 372 (+48 hojas es del Artifact 10 "frontera", la
     graduación de la lección boundary-map). El pin cuenta TODAS las hojas
     (frontera incluida) para seguir guardando contra borrados.
     Ola Superficies (compuerta-arranque): 372 → 420 (+48 hojas es del Artifact
     11 — chrome del artifact + el navLabel del sidebar + los links {es,en} de
     learn.academy/artifact/llms que viajan DENTRO de los 3 reportes congelados
     con error: el walk los ve como hojas y eso es correcto, son URLs por idioma).
     Ola Superficies (corte 2026-07-13): 420 → 429 (+9 hojas es del atlas — 3
     nodos nuevos resolver/command/ai-gateway × badge/name/desc).
     P2b (Plan de invocación): 429 → 473 (+44 hojas es de la pestaña "Plan de
     invocación" del runtime — tabsAria/tabs (3), plan.tableAria/tableHeaders
     (5), presenceLabels/presenceGloss (6), roleLabels (7), channelLabel (1),
     y los 11 pasos × {label,source} (22)).
     Hardening post-P2b (ADR#13 aplicado al artifact mismo): 473 → 451 (-22 —
     plan.steps se ELIMINÓ de GALLERY: ya no es un snapshot congelado a mano,
     gen/gallery.mjs computa las 11 filas llamando a invocationPlan("web",
     DEFAULT_WIRING) en build-time. Ver tests/site-contract.test.mjs para el
     drift-guard que reemplaza esta cobertura de fidelidad).
     P2c (graduación del runtime a <milpa-artifact>, mismo criterio que el
     átomo): 451 → 384 (-67 — toda la prosa del artifact "runtime" se movió a
     artifacts/content/runtime.content.mjs (RUNTIME); el stub que queda en
     GALLERY.artifacts sólo aporta { id, kind, component }, igual que el stub
     de atomo. RUNTIME (70 hojas, incluidas hero/intro/sourcesSummary nuevas
     de la página standalone) ya lo cubre el walk de completeness de arriba;
     su fidelidad contra artifacts/index.html se cubre por muestra
     representativa en el test de content-parity de abajo, igual que ATOMO). */
  assert.equal(leaves.length, 384, `GALLERY es-leaf count drifted: found ${leaves.length}`);
  /* Task 2 (Almácigo) des-scopeó la exclusión de frontera: al promoverlo a
     artifacts[9] su <section> se autoró en artifacts/index.html (además de
     emitirse por el SSG), así que sus hojas es aparecen verbatim como las de los
     otros 10. Ahora los 11 artifacts se verifican sin filtro. */
  const missing = leaves
    .filter(([, es]) => !normalizedHtml.includes(squashWhitespace(es)))
    .map(([path, es]) => `${path}: ${JSON.stringify(es)}`);
  assert.deepEqual(missing, [], `es strings not found verbatim in index.html:\n${missing.join("\n")}`);
});

/* Task 5: la galería completa (11 artifacts) + el shell de labs pasaron a SSG
   bilingüe (site/[en/]artifacts/, site/[en/]labs/). Estas guardas cubren el HTML
   efectivamente emitido: paridad de contenido es contra la galería generada,
   auditoría de hooks DOM que artifacts.js consulta (fundamento del smoke de T6),
   canonical/hreflang/JSON-LD ItemList/idempotencia y GA4 por página. */

test("gallery es content-parity: every GALLERY es leaf appears in the GENERATED site/artifacts/index.html", () => {
  const normalized = squashWhitespace(galleryEs);
  const leaves = [];
  collectEsLeaves(GALLERY, "GALLERY", leaves);
  /* Task 2 (Almácigo) des-scopeó frontera: gen/gallery.mjs ya registra
     renderFrontera, así que sus hojas es se emiten en la galería generada como
     las de los otros 10. Los 11 artifacts se verifican sin filtro. */
  const missing = leaves
    .filter(([, es]) => !normalized.includes(squashWhitespace(es)))
    .map(([p, es]) => `${p}: ${JSON.stringify(es)}`);
  assert.deepEqual(missing, [], `es strings missing in generated gallery:\n${missing.join("\n")}`);
  // El átomo (Artifact 09) trae su prosa desde ATOMO — muestra representativa.
  assert.ok(galleryEs.includes(ATOMO.title.es) && galleryEs.includes(ATOMO.atomCard.name), "atomo prose missing (es)");
  assert.ok(galleryEn.includes(ATOMO.title.en), "atomo prose missing (en)");
  // El runtime (Artifact 05, graduado P2c) trae su prosa desde RUNTIME —
  // misma muestra representativa que el átomo.
  assert.ok(galleryEs.includes(RUNTIME.title.es) && galleryEs.includes(RUNTIME.lesson.title.es), "runtime prose missing (es)");
  assert.ok(galleryEn.includes(RUNTIME.title.en), "runtime prose missing (en)");
});

test("gallery hook-audit: every id-hook artifacts.js queries exists in the generated pages (es/en)", () => {
  const artjs = readFileSync(new URL("../artifacts/artifacts.js", import.meta.url), "utf8");
  const idHooks = [...new Set([...artjs.matchAll(/\$\(["'](#[a-zA-Z0-9_-]+)["']/g)].map((m) => m[1].slice(1)))];
  assert.ok(idHooks.length >= 70, `expected the full id-hook set, found ${idHooks.length}`);
  for (const html of [galleryEs, galleryEn]) {
    const missing = idHooks.filter((id) => !html.includes(`id="${id}"`));
    assert.deepEqual(missing, [], `id-hooks missing in generated gallery: ${missing.join(", ")}`);
  }
  // Los 10 artifacts 2-11 quedan hidden; sólo #siembra visible (no-JS entra por el 01).
  for (const html of [galleryEs, galleryEn]) {
    assert.equal((html.match(/class="wb-artifact"[^>]*\bhidden\b/g) || []).length, 10);
  }
});

test(`gallery pages: lang, canonical, reciprocal hreflang, JSON-LD ItemList (${GALLERY.artifacts.length} items) per language`, () => {
  for (const [html, lang] of [[galleryEs, "es"], [galleryEn, "en"]]) {
    const canon = `https://academy.milpa.lat/${lang === "es" ? "" : "en/"}artifacts/`;
    assert.match(html, new RegExp(`<html lang="${lang === "es" ? "es-MX" : "en"}"`));
    assert.ok(html.includes(`rel="canonical" href="${canon}"`), `${lang} gallery canonical ${canon}`);
    const hreflangs = [...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    assert.deepEqual(hreflangs, [
      ["es", "https://academy.milpa.lat/artifacts/"],
      ["en", "https://academy.milpa.lat/en/artifacts/"],
      ["x-default", "https://academy.milpa.lat/artifacts/"],
    ], `${lang} gallery hreflang`);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
    assert.equal(ld["@type"], "ItemList");
    assert.equal(ld.inLanguage, lang);
    assert.equal(ld.itemListElement.length, GALLERY.artifacts.length);
    assert.ok(ld.itemListElement.every((it) => it.name.length > 0 && it.description.length > 0), "ItemList items need name+description");
  }
  assert.match(galleryEs, /gtag\('set',\{language:'es',page_type:'gallery'\}\)/);
  assert.match(galleryEn, /gtag\('set',\{language:'en',page_type:'gallery'\}\)/);
});

test("labs pages: lang, canonical, reciprocal hreflang, JSON-LD ItemList (4 items), static 4-lab summary", () => {
  for (const [html, lang] of [[labsEs, "es"], [labsEn, "en"]]) {
    const canon = `https://academy.milpa.lat/${lang === "es" ? "" : "en/"}labs/`;
    assert.match(html, new RegExp(`<html lang="${lang === "es" ? "es-MX" : "en"}"`));
    assert.ok(html.includes(`rel="canonical" href="${canon}"`), `${lang} labs canonical ${canon}`);
    const hreflangs = [...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    assert.deepEqual(hreflangs, [
      ["es", "https://academy.milpa.lat/labs/"],
      ["en", "https://academy.milpa.lat/en/labs/"],
      ["x-default", "https://academy.milpa.lat/labs/"],
    ], `${lang} labs hreflang`);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
    assert.equal(ld["@type"], "ItemList");
    assert.equal(ld.inLanguage, lang);
    assert.equal(ld.itemListElement.length, labsCatalog.labs.length);
    // Resumen estático: cada lab del catalog aparece con su título en el idioma.
    for (const lab of labsCatalog.labs) assert.ok(html.includes(lab.title[lang]), `${lang} labs summary missing ${lab.id}`);
  }
  assert.match(labsEs, /gtag\('set',\{language:'es',page_type:'labs'\}\)/);
  assert.match(labsEn, /gtag\('set',\{language:'en',page_type:'labs'\}\)/);
});

test("gallery + labs machine identifiers are byte-identical between es and en (only visible text differs)", () => {
  const tokens = (html) => [...html.matchAll(/data-stage="([^"]+)"|data-surface="([^"]+)"|data-node="([^"]+)"|data-caller="([^"]+)"|data-artifact-link="([^"]+)"/g)]
    .map((m) => m.slice(1).find(Boolean));
  assert.deepEqual(tokens(galleryEs), tokens(galleryEn));
  assert.deepEqual(
    [...labsEs.matchAll(/id="(lab-navigation|lab-workspace|course-progress|progress-label)"/g)].map((m) => m[1]),
    [...labsEn.matchAll(/id="(lab-navigation|lab-workspace|course-progress|progress-label)"/g)].map((m) => m[1]),
  );
});

test("re-running the generator is idempotent for the gallery + labs pages (byte-identical)", () => {
  const before = { galleryEs, galleryEn, labsEs, labsEn };
  execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
  const after = {
    galleryEs: readFileSync(new URL("../site/artifacts/index.html", import.meta.url), "utf8"),
    galleryEn: readFileSync(new URL("../site/en/artifacts/index.html", import.meta.url), "utf8"),
    labsEs: readFileSync(new URL("../site/labs/index.html", import.meta.url), "utf8"),
    labsEn: readFileSync(new URL("../site/en/labs/index.html", import.meta.url), "utf8"),
  };
  assert.deepEqual(after, before);
});

/* Task 6: per-unit SSG pages (site/learn/<track>/<unit>/) + learn index
   (site/learn/), one file per language. Full lesson + graded quiz render
   WITHOUT JS; learn.js only hydrates progress (Task 7 consumes this DOM). */
const unitEntries = catalog.tracks.flatMap((track) =>
  track.units.map((unit, index) => ({ track, unit, index })),
);

function readUnitPage(lang, trackId, unitId) {
  const rel = lang === "es"
    ? `../site/learn/${trackId}/${unitId}/index.html`
    : `../site/en/learn/${trackId}/${unitId}/index.html`;
  return readFileSync(new URL(rel, import.meta.url), "utf8");
}

const learnIndexEs = readFileSync(new URL("../site/learn/index.html", import.meta.url), "utf8");
const learnIndexEn = readFileSync(new URL("../site/en/learn/index.html", import.meta.url), "utf8");

test("unit page (representative es): lang, canonical, reciprocal hreflang, JSON-LD, full no-JS body + quiz", () => {
  const html = readUnitPage("es", "fundamentos", "contratos-grafo");
  assert.match(html, /<html lang="es-MX"/);
  assert.ok(html.includes('rel="canonical" href="https://academy.milpa.lat/learn/fundamentos/contratos-grafo/"'));
  const hreflangs = [...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(hreflangs, [
    ["es", "https://academy.milpa.lat/learn/fundamentos/contratos-grafo/"],
    ["en", "https://academy.milpa.lat/en/learn/fundamentos/contratos-grafo/"],
    ["x-default", "https://academy.milpa.lat/learn/fundamentos/contratos-grafo/"],
  ]);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
  assert.equal(ld["@type"], "LearningResource");
  assert.equal(ld.inLanguage, "es");
  assert.ok(ld.name.length > 0 && ld.description.length > 0);
  const unit = catalog.getUnit("fundamentos", "contratos-grafo").unit;
  assert.deepEqual(ld.isBasedOn, unit.sources.map((s) => s.href));
  // Progressive enhancement: the whole lesson is real HTML.
  assert.match(html, /<article class="mui-prose" data-unit="fundamentos\/contratos-grafo">/);
  for (const id of ["entender", "ver", "hacer", "verificar", "fuentes"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /Contratos antes que acoplamiento/);
  assert.match(html, /Al terminar podrás/);
  // Quiz is fully static: form, questions, options, labels, submit.
  assert.ok(html.includes('<form class="ac-quiz mui-not-prose" id="lessonQuiz" data-unit-key="fundamentos/contratos-grafo" novalidate>'));
  assert.match(html, /class="mui-field ac-quiz-question" data-question-id="contratos-grafo-01"/);
  assert.match(html, /name="quiz-fundamentos-contratos-grafo-contratos-grafo-01"/);
  assert.match(html, /<code>php bin\/coa validate<\/code>/); // code-span rendered like escapeInline
});

test("unit page (representative en twin): lang, English content, reciprocal hreflang, JSON-LD", () => {
  const html = readUnitPage("en", "fundamentos", "contratos-grafo");
  assert.match(html, /<html lang="en"/);
  assert.ok(html.includes('rel="canonical" href="https://academy.milpa.lat/en/learn/fundamentos/contratos-grafo/"'));
  assert.match(html, /Contracts before coupling/); // en title
  assert.match(html, /Graded assessment/); // en quiz chrome (apostrophe-free)
  // The objectives heading has an apostrophe, escaped to &#39; exactly like learn.js escapeHtml.
  assert.match(html, /By the end, you&#39;ll be able to/);
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
  assert.equal(ld.inLanguage, "en");
  assert.ok(html.includes('id="lessonQuiz" data-unit-key="fundamentos/contratos-grafo"'));
});

test("every unit page (20 × es/en) has lang, canonical, {es,en,x-default} hreflang and JSON-LD LearningResource", () => {
  for (const { track, unit } of unitEntries) {
    for (const lang of ["es", "en"]) {
      const label = `${lang} ${track.id}/${unit.id}`;
      const html = readUnitPage(lang, track.id, unit.id);
      const canon = `https://academy.milpa.lat/${lang === "es" ? "" : "en/"}learn/${track.id}/${unit.id}/`;
      assert.match(html, new RegExp(`<html lang="${lang === "es" ? "es-MX" : "en"}"`), `${label}: lang`);
      assert.ok(html.includes(`rel="canonical" href="${canon}"`), `${label}: canonical ${canon}`);
      const hreflangs = [...html.matchAll(/rel="alternate" hreflang="([^"]+)"/g)].map((m) => m[1]);
      assert.deepEqual(hreflangs, ["es", "en", "x-default"], `${label}: hreflang order`);
      const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
      assert.equal(ld["@type"], "LearningResource", `${label}: JSON-LD type`);
      assert.equal(ld.inLanguage, lang, `${label}: inLanguage`);
      assert.deepEqual(ld.isBasedOn, unit.sources.map((s) => s.href), `${label}: isBasedOn`);
      assert.match(html, new RegExp(`data-unit="${track.id}\\/${unit.id}"`), `${label}: article data-unit`);
      assert.match(html, new RegExp(`id="lessonQuiz" data-unit-key="${track.id}\\/${unit.id}"`), `${label}: quiz data-unit-key`);
    }
  }
});

test("learn index (es/en): lang, canonical, reciprocal hreflang, JSON-LD ItemList, static track cards", () => {
  for (const [html, lang] of [[learnIndexEs, "es"], [learnIndexEn, "en"]]) {
    const canon = `https://academy.milpa.lat/${lang === "es" ? "" : "en/"}learn/`;
    assert.match(html, new RegExp(`<html lang="${lang === "es" ? "es-MX" : "en"}"`));
    assert.ok(html.includes(`rel="canonical" href="${canon}"`), `${lang} learn index canonical`);
    const hreflangs = [...html.matchAll(/rel="alternate" hreflang="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(hreflangs, ["es", "en", "x-default"]);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/)[1]);
    assert.equal(ld["@type"], "ItemList");
    assert.equal(ld.inLanguage, lang);
    assert.equal(ld.itemListElement.length, catalog.tracks.length);
    assert.ok((html.match(/ac-track-card/g) || []).length >= catalog.tracks.length);
    assert.match(html, /id="globalProgress">0\/23</);
    assert.match(html, /id="tracksTitle"/);
  }
  assert.match(learnIndexEs, /Rutas públicas/);
  assert.match(learnIndexEn, /Public tracks/);
});

test("re-running the generator is idempotent for the new learn pages (byte-identical)", () => {
  const sample = [
    "../site/learn/index.html",
    "../site/en/learn/index.html",
    "../site/learn/fundamentos/sistema-vivo/index.html",
    "../site/en/learn/disena/promocion-patron/index.html",
  ];
  const before = sample.map((p) => readFileSync(new URL(p, import.meta.url), "utf8"));
  execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
  const after = sample.map((p) => readFileSync(new URL(p, import.meta.url), "utf8"));
  assert.deepEqual(after, before);
});

/* Debt cleanup: learn/learn-strings.js is now the ONE chrome table both
   learn/learn.js (runtime) and scripts/gen/learn.mjs (SSG) consume, so the two
   can no longer drift by construction — the old ~9-needle drift guard is
   obsolete. Replace it with a completeness walk over the module (exact es/en
   key parity, no empty values, function values that actually use their args),
   plus a couple of SSG-output smoke needles proving the wording still lands. */
test("learn chrome strings module: es/en completeness + SSG render (single source)", () => {
  const strings = require("../learn/learn-strings.js");
  const { es: esT, en: enT } = strings;
  // Same key-set, exactly, in both languages (deleting any key breaks this).
  assert.deepEqual(Object.keys(esT).sort(), Object.keys(enT).sort());
  // Same-key-count deletion in BOTH languages preserves parity above but
  // shrinks the table silently — pin the count so that still fails loudly.
  assert.equal(Object.keys(esT).length, 68);
  for (const table of [esT, enT]) {
    for (const [key, value] of Object.entries(table)) {
      if (typeof value === "function") {
        const one = value(1, 1, 1);
        const two = value(2, 2, 2);
        assert.equal(typeof one, "string", `${key}(1) is not a string`);
        assert.equal(typeof two, "string", `${key}(2) is not a string`);
        assert.ok(one.length > 0 && two.length > 0, `${key} returned an empty string`);
        // A function must actually use its argument. Numeric probes 1 vs 2
        // separate every fn except themeAriaSwitch, which branches on the
        // categorical theme name — "light" vs "dark" separates that one.
        const distinct = one !== two
          || value("light", "light", "light") !== value("dark", "dark", "dark");
        assert.ok(distinct, `${key} ignores its argument (looks constant)`);
      } else {
        assert.equal(typeof value, "string", `${key} is not a string`);
        assert.ok(value.length > 0, `${key} is an empty string`);
      }
    }
  }
  // SSG smoke: the generated pages render module wording (apostrophe-free so
  // escapeHtml leaves them byte-identical), both languages.
  const esPage = readUnitPage("es", "fundamentos", "sistema-vivo");
  const enPage = readUnitPage("en", "fundamentos", "sistema-vivo");
  assert.ok(esPage.includes(esT.sourcesHeading), "es page missing sourcesHeading");
  assert.ok(esPage.includes(esT.submitGrade), "es page missing submitGrade");
  assert.ok(enPage.includes(enT.quizEyebrow), "en page missing quizEyebrow");
});

test("unit + learn-index pages ship the GA4 gtag bootstrap with per-page page_type", () => {
  const unit = readUnitPage("es", "fundamentos", "sistema-vivo");
  assert.match(unit, /gtag\('set',\{language:'es',page_type:'unit'\}\)/);
  assert.match(readUnitPage("en", "fundamentos", "sistema-vivo"), /gtag\('set',\{language:'en',page_type:'unit'\}\)/);
  assert.match(learnIndexEs, /gtag\('set',\{language:'es',page_type:'learn'\}\)/);
  assert.match(learnIndexEn, /gtag\('set',\{language:'en',page_type:'learn'\}\)/);
  for (const html of [unit, learnIndexEs, learnIndexEn]) {
    assert.match(html, /gtag\('config','G-RNV9LK6RLL'\)/);
    assert.doesNotMatch(html, /gtag\('event'\s*,\s*'page_view'/);
  }
});

test("sitemap + es llms include the learn index and every unit; es llms stays es-only", () => {
  const sm = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/learn\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/en\/learn\/<\/loc>/);
  const llmsEs = readFileSync(new URL("../site/llms.txt", import.meta.url), "utf8");
  const llmsEn = readFileSync(new URL("../site/en/llms.txt", import.meta.url), "utf8");
  for (const { track, unit } of unitEntries) {
    assert.match(sm, new RegExp(`<loc>https:\\/\\/academy\\.milpa\\.lat\\/learn\\/${track.id}\\/${unit.id}\\/<\\/loc>`), `sitemap es ${track.id}/${unit.id}`);
    assert.match(sm, new RegExp(`<loc>https:\\/\\/academy\\.milpa\\.lat\\/en\\/learn\\/${track.id}\\/${unit.id}\\/<\\/loc>`), `sitemap en ${track.id}/${unit.id}`);
    assert.ok(llmsEs.includes(`https://academy.milpa.lat/learn/${track.id}/${unit.id}/`), `es llms ${track.id}/${unit.id}`);
    assert.ok(llmsEn.includes(`https://academy.milpa.lat/en/learn/${track.id}/${unit.id}/`), `en llms ${track.id}/${unit.id}`);
  }
  assert.doesNotMatch(llmsEs, /\/en\//, "es llms.txt must not point at /en/ learn pages");
});

/* Portal (Task 6a): site/index.html (es) + site/en/index.html (en),
   generados desde content/portal.content.mjs. La completeness walk sobre
   PORTAL ya la cubre tests/portal-contract.test.mjs — acá se verifica lo
   que esa unit test NO cubre: el HTML efectivamente emitido por el SSG. */
test("portal es page: lang, thesis line, canonical, hreflang", () => {
  assert.match(portalEs, /<html lang="es-MX"/);
  assert.match(portalEs, /enseñarte a pensar mientras construyes/);
  assert.match(portalEs, /rel="canonical" href="https:\/\/academy\.milpa\.lat\/"/);
  assert.match(portalEs, /rel="alternate" hreflang="en"/);
});

test("portal en page: lang, thesis line, hreflang reciprocal", () => {
  assert.match(portalEn, /<html lang="en"/);
  assert.match(portalEn, /teach you to think while you build/);
  assert.match(portalEn, /rel="canonical" href="https:\/\/academy\.milpa\.lat\/en\/"/);
  assert.match(portalEn, /rel="alternate" hreflang="es"/);
});

test("portal pages carry a JSON-LD EducationalOrganization per language", () => {
  for (const [html, lang] of [[portalEs, "es"], [portalEn, "en"]]) {
    const match = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/);
    assert.ok(match, "missing JSON-LD block");
    const data = JSON.parse(match[1]);
    assert.equal(data["@type"], "EducationalOrganization");
    assert.equal(data.inLanguage, lang);
    assert.ok(data.name.length > 0);
    assert.ok(data.description.length > 0);
    assert.deepEqual(data.sameAs, PORTAL.jsonld.sameAs);
  }
});

test("portal: no webinar card or nav link leaked into the generated markup", () => {
  for (const html of [portalEs, portalEn]) {
    assert.doesNotMatch(html, /webinars\//);
    assert.doesNotMatch(html, /Webinar/);
  }
});

test("llms.txt per language links only to same-language URLs", () => {
  const llmsEs = readFileSync(new URL("../site/llms.txt", import.meta.url), "utf8");
  const llmsEn = readFileSync(new URL("../site/en/llms.txt", import.meta.url), "utf8");
  assert.doesNotMatch(llmsEs, /\/en\//, "es llms.txt must not point at /en/ pages");
  assert.match(llmsEn, /\/en\//, "en llms.txt points at /en/ pages");
});

/* Fix for a Task 6a review finding: the bilingual portal (/, /en/) is the
   home/canonical entry point of the site but was absent from sitemap.xml
   and both llms.txt files — only the atom (/atomo/, /en/atomo/) was listed.
   These assertions pin the portal's presence alongside the atom. */
test("llms.txt per language links the portal (home) as well as the atom", () => {
  const llmsEs = readFileSync(new URL("../site/llms.txt", import.meta.url), "utf8");
  const llmsEn = readFileSync(new URL("../site/en/llms.txt", import.meta.url), "utf8");
  assert.match(llmsEs, /\(https:\/\/academy\.milpa\.lat\/\)/, "es llms.txt must link the es portal");
  assert.match(llmsEs, /\(https:\/\/academy\.milpa\.lat\/atomo\/\)/, "es llms.txt must still link the atom");
  assert.match(llmsEn, /\(https:\/\/academy\.milpa\.lat\/en\/\)/, "en llms.txt must link the en portal");
  assert.match(llmsEn, /\(https:\/\/academy\.milpa\.lat\/en\/atomo\/\)/, "en llms.txt must still link the atom");
});

test("sitemap + robots exist and reference the canonical origin", () => {
  const sm = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.match(sm, /hreflang="es"/); assert.match(sm, /hreflang="en"/);
  const rb = readFileSync(new URL("../site/robots.txt", import.meta.url), "utf8");
  assert.match(rb, /Sitemap:/);
});

/* GA4 instrumentation (Task 7): the bootstrap is a literal constant string
   (GA_ID lives once in scripts/gen-site.mjs) — no Date()/timestamp is ever
   evaluated by the SSG, so this must stay covered by the idempotence test
   above. Assert it landed on BOTH the portal and the atom, in BOTH
   languages, and that page_type is set per page kind (not just present). */
test("portal + atom pages ship the GA4 gtag bootstrap with the real Measurement ID", () => {
  for (const html of [portalEs, portalEn, es, en]) {
    assert.match(html, /googletagmanager\.com\/gtag\/js\?id=G-RNV9LK6RLL/);
    assert.match(html, /gtag\('config','G-RNV9LK6RLL'\)/);
  }
});

test("GA4 bootstrap does NOT fire a manual page_view (gtag('config',…) already sends it)", () => {
  for (const html of [portalEs, portalEn, es, en]) {
    assert.doesNotMatch(html, /gtag\('event'\s*,\s*'page_view'/);
  }
});

test("portal pages set page_type:'portal' and the atom pages set page_type:'atomo', per language", () => {
  assert.match(portalEs, /gtag\('set',\{language:'es',page_type:'portal'\}\)/);
  assert.match(portalEn, /gtag\('set',\{language:'en',page_type:'portal'\}\)/);
  assert.match(es, /gtag\('set',\{language:'es',page_type:'atomo'\}\)/);
  assert.match(en, /gtag\('set',\{language:'en',page_type:'atomo'\}\)/);
});

test("portal + atom pages load analytics.js, deferred, at the right relative depth", () => {
  assert.match(portalEs, /<script src="\.\.\/analytics\.js" defer><\/script>/);
  assert.match(portalEn, /<script src="\.\.\/\.\.\/analytics\.js" defer><\/script>/);
  assert.match(es, /<script src="\.\.\/\.\.\/analytics\.js" defer><\/script>/);
  assert.match(en, /<script src="\.\.\/\.\.\/\.\.\/analytics\.js" defer><\/script>/);
});

test("sitemap.xml lists the portal (home) as well as the atom, per language", () => {
  const sm = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/<\/loc>/, "sitemap must list the es portal root");
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/en\/<\/loc>/, "sitemap must list the en portal root");
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/atomo\/<\/loc>/, "sitemap must still list the es atom");
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/en\/atomo\/<\/loc>/, "sitemap must still list the en atom");
});

/* Task 5: la galería + el shell de labs suman 2 páginas nuevas × 2 idiomas al
   sitemap (36 → 40 URLs) y una entrada por idioma a cada llms.txt, sin cruzar
   idiomas (es → /artifacts/ + /labs/; en → /en/artifacts/ + /en/labs/).
   Ola Superficies: 4 lecciones nuevas × 2 idiomas (40 → 48 URLs).
   P2c: el runtime standalone (site/runtime/, mismo patrón que el átomo) suma
   1 página nueva × 2 idiomas (48 → 50 URLs).
   ADR#13 (plan-invocacion): 1 lección nueva × 2 idiomas (50 → 52 URLs).
   GOV-7 (procedencia-firmada): 1 lección nueva × 2 idiomas (52 → 54 URLs).
   Almácigo capacidad (admision-en-el-edge + evidencia-bajo-carga): 2 lecciones nuevas × 2 idiomas (54 → 58 URLs). */
test("sitemap: exactly 58 URLs, incl. gallery + labs + runtime per language", () => {
  const sm = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.equal((sm.match(/<loc>/g) || []).length, 58, "sitemap must list exactly 58 URLs (portal+atom+runtime+gallery+labs+23 learn, ×2 langs)");
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/artifacts\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/en\/artifacts\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/labs\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/en\/labs\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/runtime\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/academy\.milpa\.lat\/en\/runtime\/<\/loc>/);
});

test("llms.txt links the gallery + labs per language, without crossing languages", () => {
  const llmsEs = readFileSync(new URL("../site/llms.txt", import.meta.url), "utf8");
  const llmsEn = readFileSync(new URL("../site/en/llms.txt", import.meta.url), "utf8");
  assert.match(llmsEs, /\(https:\/\/academy\.milpa\.lat\/artifacts\/\)/, "es llms must link the es gallery");
  assert.match(llmsEs, /\(https:\/\/academy\.milpa\.lat\/labs\/\)/, "es llms must link the es labs");
  assert.match(llmsEn, /\(https:\/\/academy\.milpa\.lat\/en\/artifacts\/\)/, "en llms must link the en gallery");
  assert.match(llmsEn, /\(https:\/\/academy\.milpa\.lat\/en\/labs\/\)/, "en llms must link the en labs");
  assert.doesNotMatch(llmsEs, /\/en\//, "es llms must not point at /en/ pages");
});

/* Refuerzo más allá del brief: la neutralidad de la lógica pura (projectOperation)
   ya la cubre el test unitario de T4.5 en artifacts-core.test.mjs — no se duplica
   acá. Esto prueba lo que esa unit test NO cubre: que la tabla de strings en
   tiempo de ejecución del componente (lo que efectivamente hidrata el usuario o
   agente que interactúa con la página) ships las DOS versiones, no solo español. */
test("milpa-artifact.js ships bilingual runtime strings, not just es", () => {
  const source = readFileSync(new URL("../artifacts/milpa-artifact.js", import.meta.url), "utf8");
  const esStrings = ["aplicada", "MCP y HTTP exigen scopes; coa no", "lo denegado también se registra"];
  const enStrings = ["applied", "MCP and HTTP enforce scopes; coa doesn't", "denials are logged too"];
  for (const needle of [...esStrings, ...enStrings]) {
    assert.ok(source.includes(needle), `runtime string table missing: ${needle}`);
  }
});

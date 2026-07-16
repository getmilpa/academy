import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { GALLERY } from "../artifacts/content/gallery.content.mjs";
// Script clásico (globalThis.AcademyCore), importado por side effect — mismo
// patrón que gen/gallery.mjs y artifacts-core.test.mjs.
import "../artifacts/artifacts-core.js";
const { invocationPlan, DEFAULT_WIRING } = globalThis.AcademyCore;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// catalog.js es UMD; se carga con require (cjs-module-lexer no ve sus exports).
const require = createRequire(import.meta.url);
const catalog = require("../curriculum/catalog.js");
/* Task 5: labs/index.html + artifacts/index.html salen del contrato es-MX plano
   — la galería y el shell de labs pasaron a SSG bilingüe (site/[en/]artifacts/,
   site/[en/]labs/) y sus index.html legado quedan como shells NO deployados
   (EXCLUDED_SHELLS en build-deploy), igual que learn/index.html. Sus contratos
   (lang/hreflang/6-bundles) se verifican ahora sobre las páginas generadas
   (generatedHtmlFiles). learn/index.html se conserva acá porque otros tests
   siguen leyendo su bundle de hidratación (orden de scripts learn-strings→learn). */
const htmlFiles = [
  "learn/index.html",
  "webinars/index.html",
];
const bundleOrder = [
  "/dist/milpa-tokens.css",
  "/motion/milpa-motion.css",
  "/primitives/milpa-primitives.css",
  "/components/milpa-components.css",
  "/artifacts/milpa-artifacts.css",
  "/layouts/milpa-layouts.css",
];

/* Páginas generadas por scripts/gen-site.mjs (SSG-lite, una por idioma). A
   diferencia de las páginas fuente de htmlFiles (siempre es-MX, contenido
   editorial), site/en/atomo/index.html declara lang="en" — es la superficie
   en inglés, no un descuido de locale. site/atomo/index.html sigue siendo
   es-MX. */
const generatedHtmlFiles = [
  { relative: "site/atomo/index.html", lang: "es-MX" },
  { relative: "site/en/atomo/index.html", lang: "en" },
  { relative: "site/index.html", lang: "es-MX" },
  { relative: "site/en/index.html", lang: "en" },
  /* Task 5: galería completa + shell de labs (SSG bilingüe). */
  { relative: "site/artifacts/index.html", lang: "es-MX" },
  { relative: "site/en/artifacts/index.html", lang: "en" },
  { relative: "site/labs/index.html", lang: "es-MX" },
  { relative: "site/en/labs/index.html", lang: "en" },
  /* Task 6: learn index + 30 unit pages (bilingual SSG). */
  { relative: "site/learn/index.html", lang: "es-MX" },
  { relative: "site/en/learn/index.html", lang: "en" },
];
for (const track of catalog.tracks) {
  for (const unit of track.units) {
    generatedHtmlFiles.push({ relative: `site/learn/${track.id}/${unit.id}/index.html`, lang: "es-MX" });
    generatedHtmlFiles.push({ relative: `site/en/learn/${track.id}/${unit.id}/index.html`, lang: "en" });
  }
}

function localTarget(sourceFile, reference) {
  const clean = reference.split("#")[0].split("?")[0];
  if (!clean) return null;
  let target = path.resolve(path.dirname(sourceFile), clean);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
  return target;
}

test("todas las aplicaciones cargan los seis bundles publicados en orden", () => {
  for (const relative of htmlFiles) {
    const html = fs.readFileSync(path.join(root, relative), "utf8");
    assert.match(html, /<html lang="es-MX"/, relative + ": locale editorial");
    let cursor = -1;
    for (const bundle of bundleOrder) {
      const index = html.indexOf(bundle);
      assert.ok(index > cursor, relative + ": falta o está fuera de orden " + bundle);
      cursor = index;
    }
    assert.match(html, /@milpa\/design@0\.9\.0/);
  }
});

test("las páginas generadas por idioma declaran su lang y llevan hreflang alternate", () => {
  for (const { relative, lang } of generatedHtmlFiles) {
    const html = fs.readFileSync(path.join(root, relative), "utf8");
    assert.match(html, new RegExp(`<html lang="${lang}"`), relative + ": locale editorial");
    assert.match(html, /rel="alternate" hreflang="es"/, relative + ": falta hreflang es");
    assert.match(html, /rel="alternate" hreflang="en"/, relative + ": falta hreflang en");
    let cursor = -1;
    for (const bundle of bundleOrder) {
      const index = html.indexOf(bundle);
      assert.ok(index > cursor, relative + ": falta o está fuera de orden " + bundle);
      cursor = index;
    }
    assert.match(html, /@milpa\/design@0\.9\.0/);
  }
});

test("puerto de desarrollo y cortes técnicos no conservan valores anteriores", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(
    packageJson.scripts.dev,
    "node scripts/gen-site.mjs && node scripts/build-deploy.mjs && python3 -m http.server 4325 --directory _deploy",
  );
  const files = [
    "README.md",
    "artifacts/README.md",
    "artifacts/index.html",
    "labs/index.html",
    "curriculum/catalog.js",
  ];
  const text = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  assert.doesNotMatch(text, /4322|2026-07-09/);
  assert.match(text, /2026-07-10/);
});

test("href y src locales resuelven a archivos existentes", () => {
  for (const relative of htmlFiles) {
    const source = path.join(root, relative);
    const html = fs.readFileSync(source, "utf8");
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
      const target = localTarget(source, reference);
      assert.ok(target && fs.existsSync(target), relative + ": destino ausente " + reference);
    }
  }
});

test("los hashes estáticos apuntan a IDs y no hay IDs duplicados", () => {
  for (const relative of htmlFiles) {
    const source = path.join(root, relative);
    const html = fs.readFileSync(source, "utf8");
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, relative + ": IDs duplicados");
    for (const match of html.matchAll(/\bhref="([^"]*#([^"]+))"/g)) {
      const reference = match[1];
      const fragment = match[2];
      const target = localTarget(source, reference) || source;
      if (target.endsWith(path.join("learn", "index.html"))) continue;
      if (!fs.existsSync(target) || !target.endsWith(".html")) continue;
      const targetHtml = fs.readFileSync(target, "utf8");
      assert.match(targetHtml, new RegExp("\\bid=[\"']" + fragment + "[\"']"), relative + ": hash ausente " + reference);
    }
  }
});

test("no reaparecen rutas ni claves de tema anteriores", () => {
  const files = [
    "academy.js",
    "artifacts/index.html",
    "artifacts/artifacts.js",
    "learn/learn.js",
    "labs/labs.js",
    "webinars/webinars.js",
  ];
  const text = files.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  assert.doesNotMatch(text, /#puertas\b/);
  assert.doesNotMatch(text, /["']milpa-theme["']/);
  assert.doesNotMatch(text, /milpa-academy\/webinar/);
  assert.doesNotMatch(text, /data-tooltip=/);
});

test("los breadcrumbs respetan la anatomía publicada", () => {
  // Task 7: learn.js ya no construye el breadcrumb de la unidad; lo sirve el
  // SSG (scripts/gen/learn.mjs). Verificamos la anatomía sobre la página
  // generada — link a la learn-index + <span aria-current> en el track, nunca
  // aria-current sobre el <li>.
  const unit = fs.readFileSync(path.join(root, "site/learn/fundamentos/sistema-vivo/index.html"), "utf8");
  const webinar = fs.readFileSync(path.join(root, "webinars/index.html"), "utf8");
  assert.match(unit, /<a class="mui-breadcrumbs__link" href="[^"]*learn\/">[^<]+<\/a>/);
  assert.match(unit, /<span aria-current="page">/);
  assert.doesNotMatch(unit, /mui-breadcrumbs__item" aria-current/);
  assert.match(webinar, /class="mui-breadcrumbs__link"/);
  assert.match(webinar, /<span aria-current="page">Webinar<\/span>/);
  assert.doesNotMatch(webinar, /mui-breadcrumbs__item" aria-current/);
});

test("el lector carga y usa la evaluación antes de registrar progreso", () => {
  const html = fs.readFileSync(path.join(root, "learn/index.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "learn/learn.js"), "utf8");
  const order = [
    "quiz-bank.js",
    "quizzes-fundamentos.js",
    "quizzes-arquitectura.js",
    "quiz-engine.js",
    "progress.js",
    "learn-strings.js",
    "learn.js",
  ].map((name) => html.indexOf(name));
  order.forEach((index, position) => assert.ok(index >= 0 && (position === 0 || index > order[position - 1]), "orden de scripts de evaluación"));
  assert.match(script, /quizEngine\.gradeQuiz/);
  assert.match(script, /store\.recordAssessment/);
  assert.doesNotMatch(script, /setCompleted|completeLesson|ac-evidence/);
});

/* Debt cleanup: learn/learn-strings.js single-sources the {es,en} chrome table
   that both learn.js (runtime, reads window.MilpaLearnStrings) and the SSG read.
   It MUST load immediately before learn.js on every learn surface — the legacy
   shell and every generated page — or the global is undefined when learn.js
   runs and the whole hydration no-ops. */
test("learn-strings.js loads immediately before learn.js on every learn surface", () => {
  const pages = [
    "learn/index.html",
    "site/learn/index.html",
    "site/en/learn/index.html",
    "site/learn/fundamentos/sistema-vivo/index.html",
    "site/en/learn/fundamentos/sistema-vivo/index.html",
  ];
  for (const rel of pages) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    const srcs = [...html.matchAll(/<script src="[^"]*?([\w-]+\.js)"/g)].map((m) => m[1]);
    const stringsIndex = srcs.indexOf("learn-strings.js");
    const learnIndex = srcs.indexOf("learn.js");
    assert.ok(stringsIndex >= 0, rel + ": falta el script learn-strings.js");
    assert.ok(learnIndex >= 0, rel + ": falta el script learn.js");
    assert.equal(stringsIndex, learnIndex - 1, rel + ": learn-strings.js debe ir justo antes de learn.js");
  }
});

/* Task 6 — Progressive enhancement: every SSG unit page shows the full lesson
   body AND the graded quiz as real HTML, before any JS runs. Both languages. */
test("las páginas de unidad SSG muestran el cuerpo completo y el quiz sin JS", () => {
  for (const track of catalog.tracks) {
    for (const unit of track.units) {
      for (const prefix of ["site/learn", "site/en/learn"]) {
        const rel = `${prefix}/${track.id}/${unit.id}/index.html`;
        const html = fs.readFileSync(path.join(root, rel), "utf8");
        assert.match(html, new RegExp(`<article class="mui-prose" data-unit="${track.id}\\/${unit.id}">`), rel + ": falta el article");
        for (const id of ["entender", "ver", "hacer", "verificar", "fuentes"]) {
          assert.match(html, new RegExp(`id="${id}"`), `${rel}: falta la sección ${id}`);
        }
        // quiz estático: form + al menos una pregunta con opciones y botón de calificar
        assert.match(html, new RegExp(`id="lessonQuiz" data-unit-key="${track.id}\\/${unit.id}"`), rel + ": falta el form del quiz");
        assert.match(html, /class="mui-field ac-quiz-question" data-question-id="/, rel + ": falta una pregunta");
        assert.match(html, /<input class="mui-radio" type="radio" name="quiz-/, rel + ": falta una opción");
        assert.match(html, /<button class="mui-btn mui-btn--primary" type="submit">/, rel + ": falta el botón calificar");
        assert.match(html, /id="courseNav"/, rel + ": falta courseNav");
        assert.match(html, /id="courseAside"/, rel + ": falta courseAside");
      }
    }
  }
});

test("las páginas learn-index SSG muestran las 4 tarjetas de track y #globalProgress sin JS", () => {
  for (const rel of ["site/learn/index.html", "site/en/learn/index.html"]) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    assert.equal((html.match(/mui-card--interactive ac-track-card/g) || []).length, catalog.tracks.length, rel + ": 4 tarjetas");
    assert.match(html, /id="globalProgress">0\/\d+</, rel + ": #globalProgress");
    assert.match(html, /id="courseNav"/, rel + ": courseNav");
  }
});

/* Task 5 + Almácigo T2 — PE de la galería: los 11 artifacts (chrome + 10 hidden +
   el átomo) renderizan como HTML real sin JS, ambos idiomas. artifacts.js sólo
   hidrata. frontera (Artifact 10) se sumó como sección hidden 2-10; Ola
   Superficies sumó compuerta-arranque (Artifact 11, el boot path real). */
test("la galería SSG muestra los 11 artifacts sin JS (chrome + 10 hidden + átomo), es/en", () => {
  const ids = ["siembra", "pipeline", "compuerta", "atlas", "runtime", "event-log", "design-contract", "plan", "atomo", "frontera", "compuerta-arranque"];
  for (const rel of ["site/artifacts/index.html", "site/en/artifacts/index.html"]) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    for (const id of ids) assert.match(html, new RegExp(`id="${id}"`), rel + ": falta la sección " + id);
    assert.equal((html.match(/class="wb-artifact"[^>]*\bhidden\b/g) || []).length, 10, rel + ": deben quedar 10 artifacts hidden (2-11)");
    assert.match(html, /<milpa-artifact id="atomo-artifact" lang="(?:es|en)">/, rel + ": falta el wrapper del átomo");
    assert.match(html, /id="app-shell"/, rel + ": falta el shell");
    assert.match(html, /id="artifact-nav"/, rel + ": falta el sidebar");
    assert.match(html, /id="main"/, rel + ": falta el main");
  }
});

/* P2b — PE de la pestaña "Plan de invocación" (Tab B del runtime, Artifact 05):
   los 11 pasos del plan para el canal por defecto (POST/web) ya viajan como
   HTML real en la SSG — hydrate, not shell, a diferencia del carril de Tab A
   (#runtime-rail), que sigue vacío hasta que JS lo monta. Un lector sin JS ve
   los 11 <tr data-step> + las 4 etiquetas de presencia, incluida la
   distinción honesta dormido/omitido del ADR#13, en ambos idiomas. */
test("runtime Tab B: el plan de invocación de 11 pasos + las 4 etiquetas de presencia viajan estáticos, es/en", () => {
  const steps = ["resolve", "validate", "clamp", "authorize", "rate-limit", "plan-mode", "confirm", "emit-executing", "execute", "contain-exception", "audit"];
  const presenceLabel = {
    es: ["Activo", "Condicional", "Dormido", "Omitido"],
    en: ["Active", "Conditional", "Dormant", "Skipped"],
  };
  for (const [rel, lang] of [["site/artifacts/index.html", "es"], ["site/en/artifacts/index.html", "en"]]) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    assert.match(html, /<div class="wb-runtime-panel" id="runtime-panel-plan"[^>]*\shidden(?:\s|>)/, rel + ": el panel del plan debe arrancar oculto (JS lo revela)");
    assert.equal((html.match(/<tr data-step="/g) || []).length, 11, rel + ": deben ser 11 <tr data-step>");
    for (const step of steps) assert.match(html, new RegExp(`<tr data-step="${step}"`), rel + ": falta el paso " + step);
    for (const label of presenceLabel[lang]) assert.ok(html.includes(`>${label}<`), rel + ": falta la etiqueta de presencia " + label);
    // El toggle de canal (coa/MCP/POST) arranca en POST — el canal 'web' por defecto.
    assert.match(html, /id="runtime-channel-http"[^>]*aria-pressed="true"/, rel + ": el canal POST debe arrancar activo");
    assert.match(html, /id="runtime-channel-cli"[^>]*aria-pressed="false"/, rel + ": el canal coa debe arrancar inactivo");
    assert.match(html, /id="runtime-channel-mcp"[^>]*aria-pressed="false"/, rel + ": el canal MCP debe arrancar inactivo");
  }
});

/* Drift-guard de Tab B (hardening post-P2b, ADR#13 aplicado al artifact mismo):
   "inspection must describe what the runtime actually executes, not a parallel
   model" — este artifact enseña esa doctrina, así que no puede tener un modelo
   paralelo silencioso adentro. site/[en/]artifacts/index.html YA salen
   computados de invocationPlan("web", DEFAULT_WIRING) en build-time
   (gen/gallery.mjs, ya no leen un snapshot congelado) — pero artifacts/
   index.html sigue siendo una fuente hand-mantenida (el generador reproduce SU
   DOM, no al revés) y NO puede computarse. Este test parsea las 11 filas
   servidas en los 3 archivos y las compara BYTE A BYTE contra la salida fresca
   de invocationPlan('web', DEFAULT_WIRING): si alguien toca authorizeSource/
   confirmSource/etc. en artifacts-core.js y olvida re-generar (o, para
   artifacts/index.html, olvida actualizar a mano), este test se pone rojo —
   el mismo patrón que el drift-guard real de ADR#13 (InvocationPipelineDriftTest
   en PHP), un nivel arriba. */
test("runtime Tab B drift-guard: las filas servidas (generadas + hand-frozen) coinciden byte a byte con invocationPlan('web', DEFAULT_WIRING)", () => {
  const runtimeArtifact = GALLERY.artifacts.find((a) => a.id === "runtime");
  const { roleLabels, presenceLabels } = runtimeArtifact.plan;
  const plan = invocationPlan("web", DEFAULT_WIRING);
  assert.equal(plan.steps.length, 11, "invocationPlan('web', DEFAULT_WIRING) debe tener 11 pasos");

  const rowRe = /<tr data-step="([^"]+)"><td>[\s\S]*?<\/td><td>([\s\S]*?)<\/td><td><span[^>]*>([\s\S]*?)<\/span><\/td><td class="wb-runtime-plan-source">([\s\S]*?)<\/td><\/tr>/g;

  function parseRows(html) {
    const rows = new Map();
    for (const m of html.matchAll(rowRe)) {
      rows.set(m[1], { role: m[2], presence: m[3], source: m[4] });
    }
    return rows;
  }

  const targets = [
    { rel: "site/artifacts/index.html", lang: "es", generated: true },
    { rel: "site/en/artifacts/index.html", lang: "en", generated: true },
    { rel: "artifacts/index.html", lang: "es", generated: false },
  ];

  for (const { rel, lang } of targets) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    const rows = parseRows(html);
    assert.equal(rows.size, 11, `${rel}: deben parsearse 11 <tr data-step> del plan`);

    for (const step of plan.steps) {
      const row = rows.get(step.kind);
      assert.ok(row, `${rel}: falta la fila data-step="${step.kind}"`);
      assert.equal(row.role, roleLabels[step.role][lang], `${rel} [${step.kind}]: role desincronizado del invocationPlan real`);
      assert.equal(row.presence, presenceLabels[step.presence][lang], `${rel} [${step.kind}]: presence desincronizada del invocationPlan real`);
      assert.equal(row.source, step.source[lang], `${rel} [${step.kind}]: source desincronizado del invocationPlan real (modelo paralelo detectado)`);
    }
  }
});

/* Almácigo T2 — PE de frontera (Artifact 10): la lección se entiende SIN JS. La
   prosa del arco completo y — crucial — la FUGA (fila detenido marcada + panel de
   acople en rojo) ya son visibles en el HTML estático, ambos idiomas. El demo JS
   sólo la hace explorable; no la introduce. */
test("frontera PE: prosa del arco + la fuga estática (detenido sin mapear + acople rojo) visibles sin JS, es/en", () => {
  const prose = {
    es: ["¿Dónde vive la traducción?", "Un punto sin mapear", "El test de acople", "La fuga que cazó el review"],
    en: ["Where does the translation live?", "One unmapped point", "The coupling test", "The leak review caught"],
  };
  for (const [rel, lang] of [["site/artifacts/index.html", "es"], ["site/en/artifacts/index.html", "en"]]) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    for (const p of prose[lang]) assert.ok(html.includes(p), `${rel}: falta la prosa "${p}"`);
    // La fila del gap (detenido) sale marcada como fuga en el markup estático.
    assert.match(html, /data-code="detenido" data-mapped="false" data-gap/, rel + ": la fila detenido debe salir como fuga sin JS");
    assert.match(html, /wb-frontier-leak-badge/, rel + ": falta el badge de fuga en la tabla estática");
    // El panel de acople arranca en rojo (missing) con el código faltante, sin JS.
    assert.match(html, /id="frontier-coupling-result"[^>]*data-state="missing"/, rel + ": el panel de acople debe arrancar en missing");
    assert.match(html, /faltan|missing/, rel + ": el panel debe nombrar el faltante");
  }
});

/* Task 5 — PE del shell de labs: el resumen estático de los 4 labs (título +
   objetivo) es visible sin JS, y los hooks del runner existen. labs.js reemplaza
   el resumen dentro de #lab-workspace al hidratar en el idioma del <html lang>. */
test("el shell de labs SSG muestra el resumen de los 4 labs sin JS + hooks del runner, es/en", () => {
  for (const rel of ["site/labs/index.html", "site/en/labs/index.html"]) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    for (const hook of ["lab-navigation", "lab-workspace", "course-progress", "course-progress-bar", "progress-label", "theme-toggle"]) {
      assert.match(html, new RegExp(`id="${hook}"`), rel + ": falta el hook " + hook);
    }
    assert.match(html, /class="ac-labs-summary"/, rel + ": falta el resumen estático");
    assert.ok((html.match(/mui-steps__title/g) || []).length >= 4, rel + ": el resumen debe listar los 4 labs");
  }
});

/* Fix css-leak — GATE anti-fuga de artifacts.css (la lección frontera aplicada a CSS).
   artifacts.css se consume en TRES contextos: la galería (shell con panes), las
   páginas del átomo (documento fluido) y los embeds cross-origin en los sitios de
   marketing. Un selector GLOBAL (*, html, body sin scope) se fuga a los tres:
   html/body{overflow:hidden} bloqueó el scroll de milpa.lat, getmilpa.com y
   /atomo/ en producción (bug real, 2026-07-11). Regla: en artifacts.css los
   selectores de nivel página van scoped por contexto (html.wb-app = shell que
   bloquea; html.wb-doc = documento que fluye); lo del átomo va bajo
   .wb-artifact / milpa-artifact. Cobertura total, no mayoría. */
test("artifacts.css no tiene selectores globales sin scope (anti-fuga de embed)", () => {
  const css = fs.readFileSync(path.join(root, "artifacts/artifacts.css"), "utf8");
  const offenders = [];
  for (const [i, line] of css.split("\n").entries()) {
    // Selector que empieza en *, html o body sin clase de contexto — EN
    // CUALQUIER nivel de anidación (el bug real vivía indentado dentro de
    // un @media (max-width:960px) y el escaneo top-level no lo veía).
    if (/^\s*(\*|html|body)(\s|,|\{|$)/.test(line) && !/^\s*html\.wb-|^\s*body\.wb-/.test(line)) {
      offenders.push(`L${i + 1}: ${line.trim()}`);
    }
  }
  assert.deepEqual(offenders, [], "selectores globales fugables en artifacts.css:\n" + offenders.join("\n"));
});

test("artifacts.css estila los anchors del contexto wb-artifact (no azul UA)", () => {
  const css = fs.readFileSync(path.join(root, "artifacts/artifacts.css"), "utf8");
  /* Ola Superficies (artifact 11): la regla de links excluye a los
     anchor-botones (a:not(.mui-btn)) — pintarlos accent-text sobre el fill
     accent del mui-btn--primary los volvía invisibles en dark. El gate acepta
     ambas formas pero sigue exigiendo el estilo de anchors del contexto. */
  assert.match(css, /\.wb-artifact a(?::not\(\.mui-btn\))?[\s,{]/, "falta el estilo de <a> scoped a .wb-artifact — los links caen al azul/morado del navegador");
});

test("las páginas llevan su clase de contexto de scroll: galería wb-app, átomo wb-doc", () => {
  for (const [rel, cls] of [
    ["site/artifacts/index.html", "wb-app"], ["site/en/artifacts/index.html", "wb-app"],
    ["site/atomo/index.html", "wb-doc"], ["site/en/atomo/index.html", "wb-doc"],
    ["artifacts/index.html", "wb-app"],
  ]) {
    const html = fs.readFileSync(path.join(root, rel), "utf8");
    assert.match(html, new RegExp(`<html[^>]*class="[^"]*${cls}`), `${rel}: el <html> debe llevar la clase de contexto ${cls}`);
  }
});

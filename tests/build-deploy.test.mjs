import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

/* Cobertura de scripts/build-deploy.mjs (antes en cero — el bug real de
   profundidad relativa que motiva este archivo pasó desapercibido sin
   tests). Corre el generador + el ensamblador y valida el ÁRBOL _deploy/
   resultante: existen las páginas esperadas, no queda NINGUNA referencia
   relativa (../) ni un /site/ residual, y todo href/src local resuelve a
   un archivo real. _deploy/ es scratch git-ignorado — no se limpia al
   final a propósito: es el mismo árbol que sirve `npm run dev`. */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deploy = path.join(root, "_deploy");
// catalog.js es UMD; se carga con require (cjs-module-lexer no ve sus exports).
const catalog = createRequire(import.meta.url)("../curriculum/catalog.js");

test.before(() => {
  execFileSync(process.execPath, ["scripts/gen-site.mjs"], { cwd: root, stdio: "pipe" });
  execFileSync(process.execPath, ["scripts/build-deploy.mjs"], { cwd: root, stdio: "pipe" });
});

function listHtmlFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true })
    .map((entry) => path.join(dir, entry))
    .filter((entry) => entry.endsWith(".html") && fs.statSync(entry).isFile());
}

/* Resuelve un href/src del árbol _deploy/ al archivo real. Los refs ya
   reescritos por build-deploy son absolutos desde la raíz del deploy
   (/learn/, /artifacts/index.html#siembra) o same-dir (./labs.js) — nunca
   ../, eso es justo lo que este archivo verifica que no reaparezca. */
function resolveDeployTarget(sourceFile, reference) {
  const clean = reference.split("#")[0].split("?")[0];
  if (!clean) return null;
  let target = clean.startsWith("/") ? path.join(deploy, clean) : path.resolve(path.dirname(sourceFile), clean);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
  return target;
}

test("build-deploy: gen-site + build-deploy corren y producen _deploy/", () => {
  assert.ok(fs.existsSync(deploy) && fs.statSync(deploy).isDirectory());
});

test("build-deploy: el portal queda en la raíz del deploy, el átomo en /atomo/", () => {
  const expected = [
    "index.html",
    "en/index.html",
    "atomo/index.html",
    "en/atomo/index.html",
    "learn/index.html",
    "labs/index.html",
    "artifacts/index.html",
    "webinars/index.html",
    "CNAME",
    "sitemap.xml",
    "robots.txt",
    "llms.txt",
    "en/llms.txt",
  ];
  for (const relative of expected) {
    assert.ok(fs.existsSync(path.join(deploy, relative)), `falta ${relative}`);
  }
});

test("build-deploy: _deploy/index.html es el portal, no el átomo (regresión del bug atom-at-root)", () => {
  const home = fs.readFileSync(path.join(deploy, "index.html"), "utf8");
  assert.match(home, /id="academyTitle"/, "index.html no tiene el hero del portal");
  assert.doesNotMatch(home, /id="atomo-title"/, "index.html contiene el átomo, no el portal");

  const atom = fs.readFileSync(path.join(deploy, "atomo", "index.html"), "utf8");
  assert.match(atom, /id="atomo-title"/, "atomo/index.html no tiene el título del átomo");
  assert.doesNotMatch(atom, /id="academyTitle"/, "atomo/index.html contiene el portal, no el átomo");
});

/* Colisión learn-index (Task 8): el app-dir learn/ trae un index.html legado
   (el shell hash-router, ahora obsoleto — 0/0, sin track cards) que ANTES
   clobbeaba la learn-index SSG que site/ ya había colocado. El fix hace ganar
   a la SSG. Verificamos por CONTENIDO, no sólo por existencia: la SSG trae una
   tarjeta por track y un total real (0/N), el shell trae 0/0 y cero tarjetas. */
test("build-deploy: _deploy/learn/index.html es la learn-index SSG, no el shell legado", () => {
  const html = fs.readFileSync(path.join(deploy, "learn", "index.html"), "utf8");
  const cards = (html.match(/ac-track-card/g) || []).length;
  assert.equal(cards, catalog.tracks.length, "learn/index.html no trae las tarjetas de track de la SSG (parece el shell legado)");
  assert.match(html, /id="globalProgress">0\/\d+</, "learn/index.html no trae el contador global de la SSG");
  assert.doesNotMatch(html, /id="globalProgress">0\/0</, "learn/index.html es el shell legado (0/0), no la SSG");
  assert.match(html, /data-total-progress/, "learn/index.html no trae la barra de progreso total de la SSG");
});

/* Los assets del app-dir learn/ (bundle de hidratación) SÍ deben seguir
   copiándose aunque su index.html quede excluido del app-dir copy. */
test("build-deploy: learn.js y learn.css se siguen deployando", () => {
  for (const asset of ["learn.js", "learn.css"]) {
    assert.ok(fs.existsSync(path.join(deploy, "learn", asset)), `falta _deploy/learn/${asset}`);
  }
});

/* Colisión galería + labs (Task 5): los app-dirs artifacts/ y labs/ traen un
   index.html legado (galería es-only / shell de labs es-only) que ANTES habría
   clobbeado la SSG bilingüe que site/ ya colocó. EXCLUDED_SHELLS hace ganar a la
   SSG. Verificamos por CONTENIDO: la galería trae lang="es-MX" + los 10 section
   ids; el shell de labs trae el resumen estático de los 4 labs. */
test("build-deploy: _deploy/artifacts/index.html es la galería SSG (10 artifacts), no el shell legado", () => {
  const html = fs.readFileSync(path.join(deploy, "artifacts", "index.html"), "utf8");
  assert.match(html, /<html lang="es-MX"/, "artifacts/index.html debe ser la galería SSG es");
  for (const id of ["siembra", "pipeline", "compuerta", "atlas", "runtime", "event-log", "design-contract", "plan", "atomo", "frontera"]) {
    assert.match(html, new RegExp(`id="${id}"`), "falta la sección " + id);
  }
  assert.match(html, /<milpa-artifact id="atomo-artifact"/, "falta el átomo hidratable");
  assert.ok(fs.existsSync(path.join(deploy, "en", "artifacts", "index.html")), "falta la galería en");
});

test("build-deploy: _deploy/labs/index.html es el shell SSG (resumen de 4 labs), no el shell legado", () => {
  const html = fs.readFileSync(path.join(deploy, "labs", "index.html"), "utf8");
  assert.match(html, /<html lang="es-MX"/, "labs/index.html debe ser el shell SSG es");
  assert.match(html, /class="ac-labs-summary"/, "falta el resumen estático de labs");
  assert.match(html, /id="lab-workspace"/, "falta el hook del runner");
  assert.ok(fs.existsSync(path.join(deploy, "en", "labs", "index.html")), "falta el shell de labs en");
});

/* Los assets de runtime de los app-dirs artifacts/ y labs/ (los que las páginas
   SSG cargan por ruta relativa colapsada) SÍ deben seguir deployándose aunque
   sus index.html queden excluidos del app-dir copy. */
test("build-deploy: los assets de runtime de galería y labs se siguen deployando", () => {
  const assets = [
    "artifacts/artifacts.js", "artifacts/artifacts-core.js", "artifacts/milpa-artifact.js", "artifacts/artifacts.css",
    "labs/labs.js", "labs/catalog.js", "labs/lab-verifier.js", "labs/labs.css",
  ];
  for (const asset of assets) assert.ok(fs.existsSync(path.join(deploy, asset)), `falta _deploy/${asset}`);
});

/* Task 5 — coherencia de idioma de los cross-links tras el colapso ../ → /:
   las páginas en deben aterrizar en el árbol /en/ (galería/labs), no en el es. */
test("build-deploy: los cross-links de páginas en aterrizan en /en/ (Step 5), es queda en la raíz", () => {
  // Portal en: nav/cards a /en/learn|labs|artifacts.
  const portalEn = fs.readFileSync(path.join(deploy, "en", "index.html"), "utf8");
  for (const dir of ["learn", "labs", "artifacts"]) {
    assert.match(portalEn, new RegExp(`href="/en/${dir}/"`), `portal en debe enlazar /en/${dir}/`);
    assert.doesNotMatch(portalEn, new RegExp(`href="/${dir}/"`), `portal en NO debe enlazar el árbol es /${dir}/`);
  }
  // Portal es: nav/cards a la raíz.
  const portalEsHtml = fs.readFileSync(path.join(deploy, "index.html"), "utf8");
  for (const dir of ["learn", "labs", "artifacts"]) {
    assert.match(portalEsHtml, new RegExp(`href="/${dir}/"`), `portal es debe enlazar /${dir}/`);
  }
  // Unidad en (see → /en/artifacts/#x, do → /en/labs/#x); su gemela es queda en la raíz.
  const unitEn = fs.readFileSync(path.join(deploy, "en", "learn", "fundamentos", "contratos-grafo", "index.html"), "utf8");
  assert.match(unitEn, /href="\/en\/artifacts\/#siembra"/, "unit en see → /en/artifacts/#siembra");
  assert.match(unitEn, /href="\/en\/labs\/#capabilities"/, "unit en do → /en/labs/#capabilities");
  assert.doesNotMatch(unitEn, /href="\/artifacts\/#siembra"/, "unit en NO debe apuntar al árbol es");
  const unitEs = fs.readFileSync(path.join(deploy, "learn", "fundamentos", "contratos-grafo", "index.html"), "utf8");
  assert.match(unitEs, /href="\/artifacts\/#siembra"/, "unit es se queda en la raíz");
  assert.match(unitEs, /href="\/labs\/#capabilities"/, "unit es se queda en la raíz");
});

/* CARRY de T5: assert dedicado para el chrome-nav (topbar + docs-nav móvil) de
   las páginas de learn EN. A diferencia del test de arriba (que cubre los links
   see/do CON hash del cuerpo de la unidad), esto protege la reescritura
   lang-aware del CHROME — los links de nav "Labs"/"Artifacts" (SIN hash) deben
   apuntar al árbol /en/, no al es. Hasta ahora sólo lo guardaba el output
   commiteado; la reescritura del topbar/mobile no tenía assert propio. */
test("build-deploy: el chrome-nav (topbar + móvil) de una página learn EN apunta a /en/labs/ y /en/artifacts/", () => {
  const unitEn = fs.readFileSync(path.join(deploy, "en", "learn", "fundamentos", "contratos-grafo", "index.html"), "utf8");
  assert.match(unitEn, /href="\/en\/labs\/"/, "chrome-nav EN debe enlazar /en/labs/");
  assert.match(unitEn, /href="\/en\/artifacts\/"/, "chrome-nav EN debe enlazar /en/artifacts/");
  // Sin fuga al árbol es: el chrome-nav (href sin hash) nunca debe ser /labs/ o /artifacts/.
  assert.doesNotMatch(unitEn, /href="\/labs\/"/, "chrome-nav EN NO debe enlazar el árbol es /labs/");
  assert.doesNotMatch(unitEn, /href="\/artifacts\/"/, "chrome-nav EN NO debe enlazar el árbol es /artifacts/");
  // El chrome aparece 2× (topbar mui-btn + docs-nav mui-docs__nav-item), en ambos idiomas del árbol.
  assert.equal((unitEn.match(/href="\/en\/labs\/"/g) || []).length, 2, "faltan las 2 apariciones del chrome-nav Labs EN (topbar + móvil)");
  assert.equal((unitEn.match(/href="\/en\/artifacts\/"/g) || []).length, 2, "faltan las 2 apariciones del chrome-nav Artifacts EN (topbar + móvil)");
});

/* Las páginas de unidad SSG (no colisionan con el app-dir) deben existir en
   ambos idiomas para las 15 unidades del catálogo. */
test("build-deploy: existen las páginas de unidad SSG en _deploy (es + en)", () => {
  const missing = [];
  for (const track of catalog.tracks) {
    for (const unit of track.units) {
      for (const prefix of ["learn", "en/learn"]) {
        const rel = path.join(prefix, track.id, unit.id, "index.html");
        if (!fs.existsSync(path.join(deploy, rel))) missing.push(rel);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test("build-deploy: CNAME apunta al dominio publicado", () => {
  const cname = fs.readFileSync(path.join(deploy, "CNAME"), "utf8").trim();
  assert.equal(cname, "academy.milpa.lat");
});

/* Task 2 (debt cleanup): favicon.ico físico en la raíz del deploy para
   crawlers/agents que lo piden a ciegas (404 antes de este fix). Se
   commitea como binario generado una sola vez (no entra al pipeline de
   gen), pero SHARED_FILES debe seguir copiándolo en cada build-deploy. */
test("build-deploy: favicon.ico se copia a la raíz del deploy y no está vacío", () => {
  const target = path.join(deploy, "favicon.ico");
  assert.ok(fs.existsSync(target), "falta _deploy/favicon.ico");
  assert.ok(fs.statSync(target).size > 0, "_deploy/favicon.ico existe pero pesa 0 bytes");
});

test("build-deploy: ningún href/src de ninguna página deployada conserva ../, /site/ o ..//", () => {
  const offenders = [];
  for (const file of listHtmlFiles(deploy)) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (reference.includes("../") || reference.includes("/site/") || reference.includes("..//")) {
        offenders.push(`${path.relative(deploy, file)}: ${reference}`);
      }
    }
  }
  assert.deepEqual(offenders, []);
});

test("build-deploy: todo href/src local de toda página deployada resuelve a un archivo existente", () => {
  const missing = [];
  for (const file of listHtmlFiles(deploy)) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const reference = match[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue; // externo o fragmento puro
      const target = resolveDeployTarget(file, reference);
      if (!target || !fs.existsSync(target)) {
        missing.push(`${path.relative(deploy, file)}: ${reference} -> ${target ? path.relative(deploy, target) : "(vacío)"}`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

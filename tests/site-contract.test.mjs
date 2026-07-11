import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [
  "learn/index.html",
  "labs/index.html",
  "artifacts/index.html",
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
];

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
  const learn = fs.readFileSync(path.join(root, "learn/learn.js"), "utf8");
  const webinar = fs.readFileSync(path.join(root, "webinars/index.html"), "utf8");
  assert.match(learn, /<a class=\\"mui-breadcrumbs__link\\" href=\\"\.\/\\">Rutas<\/a>/);
  assert.match(learn, /<span aria-current=\\"page\\">/);
  assert.doesNotMatch(learn, /mui-breadcrumbs__item\\" aria-current/);
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
    "learn.js",
  ].map((name) => html.indexOf(name));
  order.forEach((index, position) => assert.ok(index >= 0 && (position === 0 || index > order[position - 1]), "orden de scripts de evaluación"));
  assert.match(script, /quizEngine\.gradeQuiz/);
  assert.match(script, /store\.recordAssessment/);
  assert.doesNotMatch(script, /setCompleted|completeLesson|ac-evidence/);
});

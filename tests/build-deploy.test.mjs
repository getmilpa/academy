import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/* Cobertura de scripts/build-deploy.mjs (antes en cero — el bug real de
   profundidad relativa que motiva este archivo pasó desapercibido sin
   tests). Corre el generador + el ensamblador y valida el ÁRBOL _deploy/
   resultante: existen las páginas esperadas, no queda NINGUNA referencia
   relativa (../) ni un /site/ residual, y todo href/src local resuelve a
   un archivo real. _deploy/ es scratch git-ignorado — no se limpia al
   final a propósito: es el mismo árbol que sirve `npm run dev`. */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deploy = path.join(root, "_deploy");

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

test("build-deploy: CNAME apunta al dominio publicado", () => {
  const cname = fs.readFileSync(path.join(deploy, "CNAME"), "utf8").trim();
  assert.equal(cname, "academy.milpa.lat");
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

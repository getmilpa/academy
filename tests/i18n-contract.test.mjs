import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { ATOMO } from "../artifacts/content/atomo.content.mjs";

execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
const es = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const en = readFileSync(new URL("../site/en/index.html", import.meta.url), "utf8");

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
  assert.match(es, /href="\.\.\/artifacts\/artifacts\.css"/);
  assert.match(es, /src="\.\.\/artifacts\/artifacts-core\.js" defer/);
  assert.match(es, /src="\.\.\/artifacts\/milpa-artifact\.js" defer/);
  assert.doesNotMatch(es, /\.\.\/\.\.\/artifacts\//);

  assert.match(en, /href="\.\.\/\.\.\/artifacts\/artifacts\.css"/);
  assert.match(en, /src="\.\.\/\.\.\/artifacts\/artifacts-core\.js" defer/);
  assert.match(en, /src="\.\.\/\.\.\/artifacts\/milpa-artifact\.js" defer/);
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
  const before = { es, en };
  execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
  const after = {
    es: readFileSync(new URL("../site/index.html", import.meta.url), "utf8"),
    en: readFileSync(new URL("../site/en/index.html", import.meta.url), "utf8"),
  };
  assert.equal(after.es, before.es);
  assert.equal(after.en, before.en);
});

test("translation completeness: every leaf string has es and en", () => {
  const missing = [];
  (function walk(node, path) {
    if (node && typeof node === "object" && !Array.isArray(node)) {
      const keys = Object.keys(node);
      if (keys.includes("es") || keys.includes("en")) {
        if (!node.es) missing.push(path + ".es");
        if (!node.en) missing.push(path + ".en");
        return;
      }
      for (const k of keys) walk(node[k], `${path}.${k}`);
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${path}[${i}]`));
    }
  })(ATOMO, "ATOMO");
  assert.deepEqual(missing, [], `strings missing a language: ${missing.join(", ")}`);
});

test("llms.txt per language links only to same-language URLs", () => {
  const llmsEs = readFileSync(new URL("../site/llms.txt", import.meta.url), "utf8");
  const llmsEn = readFileSync(new URL("../site/en/llms.txt", import.meta.url), "utf8");
  assert.doesNotMatch(llmsEs, /\/en\//, "es llms.txt must not point at /en/ pages");
  assert.match(llmsEn, /\/en\//, "en llms.txt points at /en/ pages");
});

test("sitemap + robots exist and reference the canonical origin", () => {
  const sm = readFileSync(new URL("../site/sitemap.xml", import.meta.url), "utf8");
  assert.match(sm, /hreflang="es"/); assert.match(sm, /hreflang="en"/);
  const rb = readFileSync(new URL("../site/robots.txt", import.meta.url), "utf8");
  assert.match(rb, /Sitemap:/);
});

/* Refuerzo más allá del brief: la neutralidad de la lógica pura (projectOperation)
   ya la cubre el test unitario de T4.5 en artifacts-core.test.mjs — no se duplica
   acá. Esto prueba lo que esa unit test NO cubre: que la tabla de strings en
   tiempo de ejecución del componente (lo que efectivamente hidrata el usuario o
   agente que interactúa con la página) ships las DOS versiones, no solo español. */
test("milpa-artifact.js ships bilingual runtime strings, not just es", () => {
  const source = readFileSync(new URL("../artifacts/milpa-artifact.js", import.meta.url), "utf8");
  const esStrings = ["aplicada", "solo MCP aplica scopes", "lo denegado también se registra"];
  const enStrings = ["applied", "only MCP enforces scopes", "denials are logged too"];
  for (const needle of [...esStrings, ...enStrings]) {
    assert.ok(source.includes(needle), `runtime string table missing: ${needle}`);
  }
});

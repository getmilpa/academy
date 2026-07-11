import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { ATOMO } from "../artifacts/content/atomo.content.mjs";
import { PORTAL } from "../content/portal.content.mjs";

execFileSync("node", ["scripts/gen-site.mjs"], { cwd: new URL("..", import.meta.url) });
const es = readFileSync(new URL("../site/atomo/index.html", import.meta.url), "utf8");
const en = readFileSync(new URL("../site/en/atomo/index.html", import.meta.url), "utf8");
const portalEs = readFileSync(new URL("../site/index.html", import.meta.url), "utf8");
const portalEn = readFileSync(new URL("../site/en/index.html", import.meta.url), "utf8");

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

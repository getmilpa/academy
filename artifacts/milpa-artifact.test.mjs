import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

/* <milpa-artifact> must hydrate static content that already ships in the
   served HTML — it must never be a JS shell. This test reads the served
   index.html (not a JS-evaluated DOM) so a shell implementation (empty
   element filled by JS at runtime) fails it by construction.

   Note: the element's own id is "atomo-artifact", not "atomo" — the outer
   <section id="atomo" data-artifact> keeps the "atomo" id because the
   gallery/hash navigation in artifacts.js reads it (`section.id`) and
   tests/site-contract.test.mjs enforces zero duplicate id="..." values
   document-wide. Two elements sharing id="atomo" would violate that. */
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

test("milpa-artifact#atomo-artifact ships full static content, not a JS shell", () => {
  const m = html.match(/<milpa-artifact id="atomo-artifact"[^>]*>([\s\S]*?)<\/milpa-artifact>/);
  assert.ok(m, 'the <milpa-artifact id="atomo-artifact"> element exists');
  const inner = m[1];
  assert.match(inner, /crear:tarea/, "the atom card is in the served HTML");
  assert.match(inner, /mui-pipeline/, "the pipelines are in the served HTML");
  assert.match(inner, /radiograf[íi]a de la implementaci[óo]n/i, "the auth-hole warning is in the served HTML");
  assert.match(inner, /Fuentes auditadas/i, "the sources block is in the served HTML");
  assert.ok(inner.length > 800, "the element is not an empty shell");
});

/* Artifact 05 (runtime x-ray), graduated to <milpa-artifact> in P2c — same
   hydrate-not-shell gate as the atom above. Unlike the atom (whose id="..."
   dev shell lives in this same directory, artifacts/index.html), the runtime
   artifact is checked against its GENERATED standalone page
   (site/runtime/index.html, emitted by scripts/gen-site.mjs) — that page is
   the deliverable getmilpa.com/other embedders would actually fetch, so it's
   the surface this gate protects. A JS-shell implementation (empty element,
   filled only by milpa-artifact.js at runtime) fails this by construction
   because this test parses the served markup, never evaluates JS. */
const runtimeHtml = readFileSync(new URL("../site/runtime/index.html", import.meta.url), "utf8");

test("milpa-artifact#runtime-artifact ships full static content, not a JS shell", () => {
  const m = runtimeHtml.match(/<milpa-artifact id="runtime-artifact"[^>]*>([\s\S]*?)<\/milpa-artifact>/);
  assert.ok(m, 'the <milpa-artifact id="runtime-artifact"> element exists');
  const inner = m[1];
  // Both tabs' labels (Tab A: failure walk, Tab B: invocation plan).
  assert.match(inner, /Recorrido de fallo/, "the failure-walk tab label is in the served HTML");
  assert.match(inner, /Plan de invocaci[óo]n/, "the invocation-plan tab label is in the served HTML");
  // Tab A's static guarantees table (7 output/callback/audit-evidence rows).
  assert.match(inner, /Matriz de garant[íi]as del runtime/, "the guarantees table is in the served HTML");
  assert.match(inner, /Evidencia de auditor[íi]a/, "the guarantees table header is in the served HTML");
  // Tab B's 11-step invocation plan (ADR#13): all 11 <tr data-step> rows,
  // computed from invocationPlan("web", DEFAULT_WIRING) at build time.
  const steps = ["resolve", "validate", "clamp", "authorize", "rate-limit", "plan-mode", "confirm", "emit-executing", "execute", "contain-exception", "audit"];
  assert.equal((inner.match(/<tr data-step="/g) || []).length, 11, "must ship 11 <tr data-step> rows");
  for (const step of steps) assert.match(inner, new RegExp(`<tr data-step="${step}"`), `missing plan row for step "${step}"`);
  // Sources block (parity with the atom's "Fuentes auditadas" check above).
  assert.match(inner, /Evidencia y alcance/i, "the sources block summary is in the served HTML");
  assert.match(inner, /ToolRegistry\.php/, "the sources citation is in the served HTML");
  assert.ok(inner.length > 800, "the element is not an empty shell");
});

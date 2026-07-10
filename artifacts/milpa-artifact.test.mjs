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

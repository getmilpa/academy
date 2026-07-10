import test from "node:test";
import assert from "node:assert/strict";
import { PORTAL } from "../content/portal.content.mjs";

test("portal: every bilingual leaf has non-empty es and en", () => {
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
    } else if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}[${i}]`));
  })(PORTAL, "PORTAL");
  assert.deepEqual(missing, [], `missing: ${missing.join(", ")}`);
});

test("portal thesis carries the canonical bilingual hero line", () => {
  assert.match(PORTAL.hero.thesis.es, /enseñarte a pensar mientras construyes/);
  assert.match(PORTAL.hero.thesis.en, /teach you to think while you build/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { labs } = require("./catalog.js");

test("los 4 labs son bilingües en cada hoja de prosa", () => {
  assert.equal(labs.length, 4);
  for (const lab of labs) {
    for (const f of ["title", "shortTitle", "level", "objective", "evidenceHint"])
      assert.ok(lab[f].es && lab[f].en, `${lab.id}.${f}`);
    lab.steps.forEach((s, i) => assert.ok(s.es && s.en, `${lab.id}.steps[${i}]`));
    lab.commands.forEach((c, i) => {
      assert.ok(c.label.es && c.label.en, `${lab.id}.commands[${i}].label`);
      assert.equal(typeof c.code, "string", `${lab.id}.commands[${i}].code neutral`);
    });
    assert.equal(typeof lab.id, "string");
    assert.equal(typeof lab.duration, "string");
  }
});

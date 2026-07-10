import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { pick, switchUrl, LANG_KEY } = require("../i18n.js");

test("pick returns the language leaf for a bilingual node", () => {
  assert.equal(pick({ es: "Hola", en: "Hi" }, "en"), "Hi");
  assert.equal(pick({ es: "Hola", en: "Hi" }, "es"), "Hola");
});

test("pick passes through plain strings and numbers untouched", () => {
  assert.equal(pick("coa", "en"), "coa");
  assert.equal(pick(60, "es"), 60);
});

test("switchUrl maps es <-> en pathnames both ways", () => {
  assert.equal(switchUrl("/", "en"), "/en/");
  assert.equal(switchUrl("/en/", "es"), "/");
  assert.equal(switchUrl("/atomo/", "en"), "/en/atomo/");
  assert.equal(switchUrl("/en/atomo/", "es"), "/atomo/");
});

test("switchUrl is idempotent when already in the target language", () => {
  assert.equal(switchUrl("/en/atomo/", "en"), "/en/atomo/");
  assert.equal(switchUrl("/atomo/", "es"), "/atomo/");
});

test("LANG_KEY mirrors the theme key convention", () => {
  assert.equal(LANG_KEY, "milpa-academy-lang");
});

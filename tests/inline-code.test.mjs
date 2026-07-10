import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { splitCodeSpans } = require("../inline-code.js");

// Réplica del escapeHtml usado por learn/learn.js, para probar la garantía
// de escapado por token sin importar el DOM ni el archivo del navegador.
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character]
  ));
}

function escapeInline(text) {
  return splitCodeSpans(text).map((token) => (
    token.code ? "<code>" + escapeHtml(token.text) + "</code>" : escapeHtml(token.text)
  )).join("");
}

test("un code-span simple se tokeniza como code:true con el contenido exacto", () => {
  const tokens = splitCodeSpans("run `doctor` now");
  const codeTokens = tokens.filter((token) => token.code);
  assert.equal(codeTokens.length, 1);
  assert.equal(codeTokens[0].text, "doctor");
  assert.equal(tokens.map((token) => token.text).join(""), "run doctor now");
});

test("texto plano sin backticks produce un único token code:false igual al input", () => {
  const input = "texto sin marcado alguno";
  const tokens = splitCodeSpans(input);
  assert.equal(tokens.length, 1);
  assert.deepEqual(tokens[0], { code: false, text: input });
});

test("un backtick sin cierre queda literal: no token code, no error, no texto perdido", () => {
  const input = "a `b sin cerrar";
  assert.doesNotThrow(() => splitCodeSpans(input));
  const tokens = splitCodeSpans(input);
  assert.ok(tokens.every((token) => token.code === false));
  assert.equal(tokens.map((token) => token.text).join(""), input);
});

test("un code-span vacío (``) no produce la ilusión de un <code> vacío", () => {
  const tokens = splitCodeSpans("antes `` después");
  // El patrón exige al menos un carácter dentro del par de backticks, así
  // que `` no cierra un code-span: los backticks quedan como texto literal
  // y no aparece ningún token { code: true, text: "" }.
  assert.ok(!tokens.some((token) => token.code === true));
  assert.equal(tokens.map((token) => token.text).join(""), "antes `` después");
});

test("entrada vacía se maneja de forma consistente (un único token de texto vacío)", () => {
  assert.deepEqual(splitCodeSpans(""), [{ code: false, text: "" }]);
});

test("múltiples code-spans en una sola cadena se tokenizan todos", () => {
  const tokens = splitCodeSpans("usa `MailConsumer` y luego `validate` antes de `doctor`");
  const codeTexts = tokens.filter((token) => token.code).map((token) => token.text);
  assert.deepEqual(codeTexts, ["MailConsumer", "validate", "doctor"]);
  assert.equal(tokens.map((token) => token.text).join(""), "usa MailConsumer y luego validate antes de doctor");
});

test("code-spans adyacentes (sin texto entre ellos) se tokenizan como dos code-spans separados", () => {
  const tokens = splitCodeSpans("`a``b`");
  // "`a``b`" son dos pares válidos espalda con espalda: `a` y `b`. Los
  // backticks son delimitadores, no contenido, así que no hay texto que
  // "perder" entre ambos — ninguna excepción, ningún token de más.
  assert.deepEqual(tokens, [
    { code: true, text: "a" },
    { code: true, text: "b" },
  ]);
});

test("splitCodeSpans nunca hace HTML-escaping: es puro tokenizado", () => {
  const tokens = splitCodeSpans("`<b>&\"`");
  assert.equal(tokens.length, 1);
  assert.equal(tokens[0].code, true);
  assert.equal(tokens[0].text, "<b>&\"");
});

test("garantía de escapado: un code-span con HTML-especiales nunca inyecta markup", () => {
  const html = escapeInline("ejecuta `<b>&\"` en tu terminal");
  assert.equal(html, "ejecuta <code>&lt;b&gt;&amp;&quot;</code> en tu terminal");
  assert.doesNotMatch(html, /<b>/);
});

test("garantía de escapado: texto fuera del code-span también se escapa", () => {
  const html = escapeInline("<script> y `doctor`");
  assert.equal(html, "&lt;script&gt; y <code>doctor</code>");
});

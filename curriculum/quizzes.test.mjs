import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const catalog = require("./catalog.js");
const bank = require("./quiz-bank.js");
const { gradeQuiz, validateQuiz } = require("./quiz-engine.js");
const { pick } = require("../i18n.js");
require("./quizzes-fundamentos.js");
require("./quizzes-arquitectura.js");

// Task 2 dejó bilingües fundamentos + construye (quizzes-fundamentos.js).
// Task 3 hará lo mismo con arquitectura + disena (quizzes-arquitectura.js)
// usando ESTE MISMO walk; hasta entonces esas unidades quedan pendientes.
const BILINGUAL_PREFIXES = ["fundamentos/", "construye/"];
function isBilingual(unitKey) {
  return BILINGUAL_PREFIXES.some((prefix) => unitKey.indexOf(prefix) === 0);
}

test("cada unidad pública tiene exactamente un cuestionario válido", () => {
  const unitKeys = catalog.allUnits().map((unit) => unit.trackId + "/" + unit.id).sort();
  assert.deepEqual(bank.keys().sort(), unitKeys);

  for (const unitKey of unitKeys) {
    const quiz = bank.get(unitKey);
    assert.equal(validateQuiz(quiz), true, unitKey);
    assert.equal(quiz.questions.length, 3, unitKey);
    assert.equal(quiz.passScore, quiz.questions.length, unitKey);
  }
});

test("las 45 preguntas tienen IDs globales, escenarios y distractores únicos", () => {
  const questionIds = new Set();
  let count = 0;

  for (const [unitKey, quiz] of Object.entries(bank.all())) {
    for (const question of quiz.questions) {
      count += 1;
      assert.ok(!questionIds.has(question.id), "pregunta duplicada: " + question.id);
      questionIds.add(question.id);
      assert.ok(pick(question.prompt, "es").length >= 45, unitKey + "/" + question.id + ": prompt superficial");
      assert.ok(pick(question.explanation, "es").length >= 50, unitKey + "/" + question.id + ": explicación insuficiente");
      assert.ok(question.options.length >= 3, unitKey + "/" + question.id + ": faltan distractores");
      const esTexts = question.options.map((option) => pick(option.text, "es"));
      assert.equal(new Set(esTexts).size, question.options.length, unitKey + "/" + question.id + ": opciones duplicadas");
    }
  }

  assert.equal(count, 45);
});

// Walk de translation-completeness: ninguna hoja de contenido sin es y en,
// floors por idioma (prompt ≥45, explanation ≥50) y textos de opción únicos
// POR IDIOMA. Es el mismo walk que Task 3 aplicará a quizzes-arquitectura.js.
function assertBilingualQuiz(unitKey, quiz) {
  for (const question of quiz.questions) {
    const where = unitKey + "/" + question.id;
    for (const lang of ["es", "en"]) {
      const prompt = question.prompt && question.prompt[lang];
      assert.equal(typeof prompt, "string", where + ": prompt." + lang + " ausente");
      assert.ok(prompt.length >= 45, where + ": prompt." + lang + " superficial");

      const explanation = question.explanation && question.explanation[lang];
      assert.equal(typeof explanation, "string", where + ": explanation." + lang + " ausente");
      assert.ok(explanation.length >= 50, where + ": explanation." + lang + " insuficiente");

      const texts = question.options.map((option, index) => {
        const text = option.text && option.text[lang];
        assert.equal(typeof text, "string", where + ".options[" + index + "].text." + lang + " ausente");
        return text;
      });
      assert.equal(new Set(texts).size, texts.length, where + ": opciones duplicadas en " + lang);
    }
  }
}

for (const unitKey of bank.keys()) {
  const title = "quiz bilingüe {es,en} con floors por idioma: " + unitKey;
  if (isBilingual(unitKey)) {
    test(title, () => assertBilingualQuiz(unitKey, bank.get(unitKey)));
  } else {
    test(title, { todo: "Task 3 — quizzes-arquitectura.js sigue es-only" }, () => assertBilingualQuiz(unitKey, bank.get(unitKey)));
  }
}

test("el banco devuelve copias y rechaza claves o registros duplicados", () => {
  const key = "fundamentos/sistema-vivo";
  const first = bank.get(key);
  first.questions[0].prompt = "mutado";
  assert.notEqual(bank.get(key).questions[0].prompt, "mutado");
  assert.throws(() => bank.register({ invalid: { questions: [] } }), /Clave de unidad inválida/);
  assert.throws(() => bank.register({ [key]: first }), /Quiz duplicado/);
});

test("cada cuestionario aprueba todas las respuestas correctas y rechaza un distractor", () => {
  for (const [unitKey, quiz] of Object.entries(bank.all())) {
    const correct = Object.fromEntries(quiz.questions.map((question) => [question.id, question.answer]));
    assert.equal(gradeQuiz(quiz, correct).passed, true, unitKey);

    const first = quiz.questions[0];
    const distractor = first.options.find((option) => option.id !== first.answer);
    const wrong = { ...correct, [first.id]: distractor.id };
    assert.equal(gradeQuiz(quiz, wrong).passed, false, unitKey);
  }
});

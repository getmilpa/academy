import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const catalog = require("./catalog.js");
const bank = require("./quiz-bank.js");
const { gradeQuiz, validateQuiz } = require("./quiz-engine.js");
require("./quizzes-fundamentos.js");
require("./quizzes-arquitectura.js");

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
      assert.ok(question.prompt.length >= 45, unitKey + "/" + question.id + ": prompt superficial");
      assert.ok(question.explanation.length >= 50, unitKey + "/" + question.id + ": explicación insuficiente");
      assert.ok(question.options.length >= 3, unitKey + "/" + question.id + ": faltan distractores");
      assert.equal(new Set(question.options.map((option) => option.text)).size, question.options.length);
    }
  }

  assert.equal(count, 45);
});

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

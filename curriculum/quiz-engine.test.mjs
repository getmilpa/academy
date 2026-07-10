import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { gradeQuiz, validateQuiz } = require("./quiz-engine.js");

function quiz(overrides = {}) {
  return {
    id: "contratos",
    questions: [
      {
        id: "q1",
        prompt: "¿Quién decide qué sembrar?",
        options: [
          { id: "host", text: "El host" },
          { id: "runtime", text: "El runtime" },
        ],
        answer: "host",
        explanation: "El host compone el sistema y decide qué módulos cargar.",
      },
      {
        id: "q2",
        prompt: "¿Qué expresa requires?",
        options: [
          { id: "need", text: "Una capacidad necesaria" },
          { id: "order", text: "Una posición fija de boot" },
          { id: "style", text: "Un token visual" },
        ],
        answer: "need",
        explanation: "requires declara una dependencia por capacidad.",
      },
    ],
    ...overrides,
  };
}

test("valida un cuestionario con opciones {id, text}", () => {
  assert.equal(validateQuiz(quiz()), true);
});

test("aprueba únicamente con 100% cuando passScore no está declarado", () => {
  const result = gradeQuiz(quiz(), { q1: "host", q2: "need" });

  assert.deepEqual(result, {
    passed: true,
    score: 2,
    total: 2,
    percentage: 100,
    answered: 2,
    results: [
      {
        questionId: "q1",
        selected: "host",
        correct: true,
        explanation: "El host compone el sistema y decide qué módulos cargar.",
      },
      {
        questionId: "q2",
        selected: "need",
        correct: true,
        explanation: "requires declara una dependencia por capacidad.",
      },
    ],
  });
});

test("reprueba una respuesta incorrecta y conserva el resultado por pregunta", () => {
  const result = gradeQuiz(quiz(), { q1: "runtime", q2: "need" });

  assert.equal(result.passed, false);
  assert.equal(result.score, 1);
  assert.equal(result.percentage, 50);
  assert.equal(result.answered, 2);
  assert.deepEqual(result.results.map(({ selected, correct }) => ({ selected, correct })), [
    { selected: "runtime", correct: false },
    { selected: "need", correct: true },
  ]);
});

test("una respuesta incompleta cuenta solo lo contestado y no aprueba", () => {
  const result = gradeQuiz(quiz(), { q1: "host" });

  assert.equal(result.passed, false);
  assert.equal(result.score, 1);
  assert.equal(result.total, 2);
  assert.equal(result.percentage, 50);
  assert.equal(result.answered, 1);
  assert.deepEqual(result.results[1], {
    questionId: "q2",
    selected: null,
    correct: false,
    explanation: "requires declara una dependencia por capacidad.",
  });
});

test("passScore explícito permite un umbral entero dentro del total", () => {
  const result = gradeQuiz(quiz({ passScore: 1 }), { q1: "host", q2: "order" });

  assert.equal(result.passed, true);
  assert.equal(result.score, 1);
});

test("rechaza schema de preguntas y distractores inválidos", () => {
  assert.throws(() => validateQuiz({ questions: [] }), /quiz\.questions.*al menos una/);
  assert.throws(
    () => validateQuiz(quiz({ questions: [{ ...quiz().questions[0], options: [{ id: "host", text: "El host" }] }] })),
    /al menos un distractor/
  );
  assert.throws(
    () => validateQuiz(quiz({ questions: [{ ...quiz().questions[0], options: [{ id: "host", text: "El host" }, { id: "x", text: "" }] }] })),
    /options\[1\]\.text.*no vacío/
  );
});

test("rechaza una respuesta correcta que no pertenece a las opciones", () => {
  const invalid = quiz();
  invalid.questions[0].answer = "otra";

  assert.throws(() => validateQuiz(invalid), /answer.*coincidir con una opción/);
});

test("rechaza passScore fuera del rango o que no sea entero", () => {
  assert.throws(() => validateQuiz(quiz({ passScore: 0 })), /passScore.*entre 1 y 2/);
  assert.throws(() => validateQuiz(quiz({ passScore: 3 })), /passScore.*entre 1 y 2/);
  assert.throws(() => validateQuiz(quiz({ passScore: 1.5 })), /passScore.*entero/);
});

test("rechaza preguntas y opciones de respuesta desconocidas", () => {
  assert.throws(() => gradeQuiz(quiz(), { q3: "host" }), /q3.*pregunta desconocida/);
  assert.throws(() => gradeQuiz(quiz(), { q1: "otra" }), /q1.*opción desconocida/);
});

test("calificar no muta el cuestionario ni las respuestas", () => {
  const inputQuiz = quiz();
  const responses = { q1: "host", q2: "need" };
  const beforeQuiz = structuredClone(inputQuiz);
  const beforeResponses = structuredClone(responses);

  gradeQuiz(inputQuiz, responses);

  assert.deepEqual(inputQuiz, beforeQuiz);
  assert.deepEqual(responses, beforeResponses);
});

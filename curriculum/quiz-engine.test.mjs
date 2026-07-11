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
        prompt: { es: "¿Quién decide qué sembrar?", en: "Who decides what to plant?" },
        options: [
          { id: "host", text: { es: "El host", en: "The host" } },
          { id: "runtime", text: { es: "El runtime", en: "The runtime" } },
        ],
        answer: "host",
        explanation: {
          es: "El host compone el sistema y decide qué módulos cargar.",
          en: "The host composes the system and decides which modules to load.",
        },
      },
      {
        id: "q2",
        prompt: { es: "¿Qué expresa requires?", en: "What does requires express?" },
        options: [
          { id: "need", text: { es: "Una capacidad necesaria", en: "A required capability" } },
          { id: "order", text: { es: "Una posición fija de boot", en: "A fixed boot position" } },
          { id: "style", text: { es: "Un token visual", en: "A visual token" } },
        ],
        answer: "need",
        explanation: {
          es: "requires declara una dependencia por capacidad.",
          en: "requires declares a dependency by capability.",
        },
      },
    ],
    ...overrides,
  };
}

// Unidad es-only (string plano): la forma que conservan las quizzes de
// arquitectura hasta Task 3 y que el engine debe seguir aceptando.
function plainQuiz(overrides = {}) {
  return {
    id: "es-only",
    questions: [
      {
        id: "p1",
        prompt: "¿Quién arranca la composición del host?",
        options: [
          { id: "rt", text: "El runtime" },
          { id: "hs", text: "El host" },
        ],
        answer: "rt",
        explanation: "El runtime arranca la composición que el host declaró.",
      },
    ],
    ...overrides,
  };
}

test("valida un cuestionario bilingüe con opciones {id, text:{es,en}}", () => {
  assert.equal(validateQuiz(quiz()), true);
});

test("acepta cuestionarios es-only (string plano) sin exigir traducción", () => {
  assert.equal(validateQuiz(plainQuiz()), true);
});

test("rechaza una hoja bilingüe a medio traducir (sin en)", () => {
  const half = quiz();
  half.questions[0].prompt = { es: "solo español" };
  assert.throws(() => validateQuiz(half), /prompt\.en.*no vacío/);

  const halfText = quiz();
  halfText.questions[0].options[0].text = { en: "only english" };
  assert.throws(() => validateQuiz(halfText), /options\[0\]\.text\.es.*no vacío/);
});

test("gradeQuiz localiza la explicación según lang y en difiere de es", () => {
  const en = gradeQuiz(quiz(), { q1: "host", q2: "need" }, "en");
  const es = gradeQuiz(quiz(), { q1: "host", q2: "need" }, "es");

  assert.equal(en.results[0].explanation, "The host composes the system and decides which modules to load.");
  assert.equal(es.results[0].explanation, "El host compone el sistema y decide qué módulos cargar.");
  assert.equal(en.results[1].explanation, "requires declares a dependency by capability.");
  assert.notEqual(en.results[0].explanation, es.results[0].explanation);
});

test("sin lang la explicación cae en español (default es)", () => {
  const result = gradeQuiz(quiz(), { q1: "host", q2: "need" });
  assert.equal(result.results[0].explanation, "El host compone el sistema y decide qué módulos cargar.");
  assert.equal(result.results[1].explanation, "requires declara una dependencia por capacidad.");
});

test("localiza igual las explicaciones de un cuestionario es-only en cualquier lang", () => {
  const en = gradeQuiz(plainQuiz(), { p1: "rt" }, "en");
  const es = gradeQuiz(plainQuiz(), { p1: "rt" }, "es");
  assert.equal(en.results[0].explanation, "El runtime arranca la composición que el host declaró.");
  assert.equal(es.results[0].explanation, "El runtime arranca la composición que el host declaró.");
});

test("aprueba únicamente con 100% cuando passScore no está declarado", () => {
  const result = gradeQuiz(quiz(), { q1: "host", q2: "need" }, "en");

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
        explanation: "The host composes the system and decides which modules to load.",
      },
      {
        questionId: "q2",
        selected: "need",
        correct: true,
        explanation: "requires declares a dependency by capability.",
      },
    ],
  });
});

test("reprueba una respuesta incorrecta y conserva el resultado por pregunta", () => {
  const result = gradeQuiz(quiz(), { q1: "runtime", q2: "need" }, "en");

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
  const result = gradeQuiz(quiz(), { q1: "host" }, "en");

  assert.equal(result.passed, false);
  assert.equal(result.score, 1);
  assert.equal(result.total, 2);
  assert.equal(result.percentage, 50);
  assert.equal(result.answered, 1);
  assert.deepEqual(result.results[1], {
    questionId: "q2",
    selected: null,
    correct: false,
    explanation: "requires declares a dependency by capability.",
  });
});

test("passScore explícito permite un umbral entero dentro del total", () => {
  const result = gradeQuiz(quiz({ passScore: 1 }), { q1: "host", q2: "order" }, "en");

  assert.equal(result.passed, true);
  assert.equal(result.score, 1);
});

test("rechaza schema de preguntas y distractores inválidos", () => {
  assert.throws(() => validateQuiz({ questions: [] }), /quiz\.questions.*al menos una/);
  assert.throws(
    () => validateQuiz(quiz({ questions: [{ ...quiz().questions[0], options: [{ id: "host", text: { es: "El host", en: "The host" } }] }] })),
    /al menos un distractor/
  );
  assert.throws(
    () => validateQuiz(quiz({ questions: [{ ...quiz().questions[0], options: [{ id: "host", text: { es: "El host", en: "The host" } }, { id: "x", text: { es: "", en: "" } }] }] })),
    /options\[1\]\.text\.es.*no vacío/
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
  assert.throws(() => gradeQuiz(quiz(), { q3: "host" }, "en"), /q3.*pregunta desconocida/);
  assert.throws(() => gradeQuiz(quiz(), { q1: "otra" }, "en"), /q1.*opción desconocida/);
});

test("calificar no muta el cuestionario ni las respuestas", () => {
  const inputQuiz = quiz();
  const responses = { q1: "host", q2: "need" };
  const beforeQuiz = structuredClone(inputQuiz);
  const beforeResponses = structuredClone(responses);

  gradeQuiz(inputQuiz, responses, "en");

  assert.deepEqual(inputQuiz, beforeQuiz);
  assert.deepEqual(responses, beforeResponses);
});

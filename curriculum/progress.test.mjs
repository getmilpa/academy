import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const progress = require("./progress.js");

function fakeStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
    has: (key) => data.has(key),
  };
}

test("solo una evaluación aprobada completa la unidad", () => {
  const storage = fakeStorage();
  const store = progress.createStore(storage);
  store.recordAssessment("fundamentos/sistema-vivo", { score: 2, total: 3, passed: false });
  let state = store.read();
  assert.equal(state.completed["fundamentos/sistema-vivo"], undefined);
  assert.equal(state.assessments["fundamentos/sistema-vivo"].attempts, 1);

  store.recordAssessment("fundamentos/sistema-vivo", { score: 3, total: 3, passed: true });
  state = store.read();
  assert.equal(state.completed["fundamentos/sistema-vivo"], true);
  assert.equal(state.assessments["fundamentos/sistema-vivo"].attempts, 2);
  assert.equal(state.assessments["fundamentos/sistema-vivo"].bestScore, 3);
  assert.ok(state.assessments["fundamentos/sistema-vivo"].passedAt);
});

test("un intento posterior no revoca una evaluación ya aprobada", () => {
  const store = progress.createStore(fakeStorage());
  store.recordAssessment("a/one", { score: 3, total: 3, passed: true });
  store.recordAssessment("a/one", { score: 1, total: 3, passed: false });
  const assessment = store.read().assessments["a/one"];
  assert.equal(assessment.passed, true);
  assert.equal(assessment.bestScore, 3);
  assert.equal(assessment.lastScore, 1);
  assert.equal(assessment.attempts, 2);
});

test("ignora progreso v1 auto declarado y calcula avance desde assessments", () => {
  const storage = fakeStorage({
    [progress.LEGACY_STORAGE_KEY]: JSON.stringify({ completed: { "a/one": true } }),
  });
  const store = progress.createStore(storage);
  assert.deepEqual(store.read(), progress.emptyState());

  store.recordAssessment("a/one", { score: 2, total: 2, passed: true });
  const units = [{ id: "one", trackId: "a" }, { id: "two", trackId: "a" }];
  assert.equal(progress.countCompleted(store.read(), units), 1);
  assert.equal(progress.percent(store.read(), units), 50);
});

test("normaliza storage corrupto y rechaza resultados inválidos", () => {
  const storage = fakeStorage({ [progress.STORAGE_KEY]: "{broken" });
  const store = progress.createStore(storage);
  assert.deepEqual(store.read(), progress.emptyState());
  assert.throws(() => store.recordAssessment("a/one", { score: 4, total: 3, passed: true }), /score\/total/);
  assert.throws(() => store.recordAssessment("a/one", { score: 1, total: 3 }), /passed/);
});

test("reset elimina progreso vigente y legado", () => {
  const storage = fakeStorage({ [progress.LEGACY_STORAGE_KEY]: "{}" });
  const store = progress.createStore(storage);
  store.recordAssessment("a/one", { score: 1, total: 1, passed: true });
  store.reset();
  assert.equal(storage.has(progress.STORAGE_KEY), false);
  assert.equal(storage.has(progress.LEGACY_STORAGE_KEY), false);
  assert.deepEqual(store.read(), progress.emptyState());
});

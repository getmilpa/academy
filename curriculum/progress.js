(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaProgress = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var STORAGE_KEY = "milpa-academy-progress-v2";
  var LEGACY_STORAGE_KEY = "milpa-academy-progress-v1";

  function emptyState() {
    return { version: 2, assessments: {}, completed: {}, lastUnit: null, updatedAt: null };
  }

  function normalizeAssessment(value) {
    if (!value || typeof value !== "object") return null;
    var total = Number.isInteger(value.total) && value.total > 0 ? value.total : 0;
    var bestScore = Number.isInteger(value.bestScore) ? Math.max(0, Math.min(value.bestScore, total)) : 0;
    var lastScore = Number.isInteger(value.lastScore) ? Math.max(0, Math.min(value.lastScore, total)) : 0;
    if (!total) return null;
    return {
      passed: value.passed === true,
      bestScore: bestScore,
      lastScore: lastScore,
      total: total,
      percentage: Math.round((bestScore / total) * 100),
      attempts: Number.isInteger(value.attempts) && value.attempts > 0 ? value.attempts : 1,
      passedAt: typeof value.passedAt === "string" ? value.passedAt : null,
      lastAttemptAt: typeof value.lastAttemptAt === "string" ? value.lastAttemptAt : null
    };
  }

  function normalize(value) {
    var state = value && typeof value === "object" ? value : {};
    var input = state.assessments && typeof state.assessments === "object" ? state.assessments : {};
    var assessments = Object.keys(input).reduce(function (result, unitKey) {
      var assessment = normalizeAssessment(input[unitKey]);
      if (assessment) result[unitKey] = assessment;
      return result;
    }, {});
    var completed = Object.keys(assessments).reduce(function (result, unitKey) {
      if (assessments[unitKey].passed) result[unitKey] = true;
      return result;
    }, {});
    return {
      version: 2,
      assessments: assessments,
      completed: completed,
      lastUnit: typeof state.lastUnit === "string" ? state.lastUnit : null,
      updatedAt: typeof state.updatedAt === "string" ? state.updatedAt : null
    };
  }

  function assertGrade(result) {
    if (!result || typeof result !== "object") throw new TypeError("Se requiere un resultado de evaluación.");
    if (!Number.isInteger(result.score) || !Number.isInteger(result.total) || result.total < 1 || result.score < 0 || result.score > result.total) {
      throw new TypeError("El resultado contiene score/total inválidos.");
    }
    if (typeof result.passed !== "boolean") throw new TypeError("El resultado debe declarar passed.");
  }

  function createStore(storage) {
    function read() {
      if (!storage) return emptyState();
      try { return normalize(JSON.parse(storage.getItem(STORAGE_KEY) || "null")); }
      catch (error) { return emptyState(); }
    }

    function write(state) {
      var next = normalize(state);
      next.updatedAt = new Date().toISOString();
      if (storage) {
        try { storage.setItem(STORAGE_KEY, JSON.stringify(next)); }
        catch (error) { return next; }
      }
      return next;
    }

    function recordAssessment(unitKey, result) {
      assertGrade(result);
      var state = read();
      var previous = state.assessments[unitKey] || null;
      var now = new Date().toISOString();
      var passed = Boolean(previous && previous.passed) || result.passed;
      var bestScore = Math.max(previous ? previous.bestScore : 0, result.score);
      state.assessments[unitKey] = {
        passed: passed,
        bestScore: bestScore,
        lastScore: result.score,
        total: result.total,
        percentage: Math.round((bestScore / result.total) * 100),
        attempts: (previous ? previous.attempts : 0) + 1,
        passedAt: previous && previous.passedAt ? previous.passedAt : (result.passed ? now : null),
        lastAttemptAt: now
      };
      state.lastUnit = unitKey;
      return write(state);
    }

    function visit(unitKey) {
      var state = read();
      state.lastUnit = unitKey;
      return write(state);
    }

    function reset() {
      if (storage) {
        try {
          storage.removeItem(STORAGE_KEY);
          storage.removeItem(LEGACY_STORAGE_KEY);
        } catch (error) { return emptyState(); }
      }
      return emptyState();
    }

    return { read: read, write: write, recordAssessment: recordAssessment, visit: visit, reset: reset };
  }

  function unitKey(trackId, unitId) { return trackId + "/" + unitId; }

  function countCompleted(state, units) {
    var current = normalize(state);
    return units.reduce(function (count, unit) {
      var key = unit.trackId ? unitKey(unit.trackId, unit.id) : unit.id;
      return count + (current.completed[key] ? 1 : 0);
    }, 0);
  }

  function percent(state, units) {
    return units.length ? Math.round((countCompleted(state, units) / units.length) * 100) : 0;
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    LEGACY_STORAGE_KEY: LEGACY_STORAGE_KEY,
    emptyState: emptyState,
    normalize: normalize,
    createStore: createStore,
    unitKey: unitKey,
    countCompleted: countCompleted,
    percent: percent
  };
});

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaQuizBank = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var quizzes = Object.create(null);

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function register(batch) {
    if (!batch || typeof batch !== "object" || Array.isArray(batch)) {
      throw new TypeError("El banco requiere un objeto de quizzes por unidad.");
    }
    Object.keys(batch).forEach(function (unitKey) {
      if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(unitKey)) {
        throw new TypeError("Clave de unidad inválida: " + unitKey);
      }
      if (quizzes[unitKey]) throw new Error("Quiz duplicado: " + unitKey);
      quizzes[unitKey] = clone(batch[unitKey]);
    });
    return all();
  }

  function get(unitKey) {
    return quizzes[unitKey] ? clone(quizzes[unitKey]) : null;
  }

  function keys() {
    return Object.keys(quizzes);
  }

  function all() {
    return keys().reduce(function (result, unitKey) {
      result[unitKey] = get(unitKey);
      return result;
    }, {});
  }

  return { register: register, get: get, keys: keys, all: all };
});

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaQuiz = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var owns = Object.prototype.hasOwnProperty;

  function fail(path, message, ErrorType) {
    throw new (ErrorType || TypeError)(path + " " + message);
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  // Una hoja "localizada" es un objeto {es,en}. Detección y resolución idénticas
  // a MilpaI18n.pick; se definen local porque i18n.js se carga después de este
  // módulo en el sitio, así que el engine no depende de ese global.
  function isLocalized(value) {
    return isRecord(value) && ("es" in value || "en" in value);
  }

  function pick(node, lang) {
    if (isLocalized(node)) return node[lang === "en" ? "en" : "es"];
    return node;
  }

  function requireText(value, path) {
    if (typeof value !== "string" || value.trim() === "") {
      fail(path, "debe ser un texto no vacío.");
    }
  }

  // Texto de contenido: acepta un string plano (unidades es-only) o una hoja
  // bilingüe {es,en}. En el caso bilingüe exige ambos idiomas no vacíos, así
  // que una traducción a medias falla la validación.
  function requireLocalizedText(value, path) {
    if (isLocalized(value)) {
      requireText(value.es, path + ".es");
      requireText(value.en, path + ".en");
      return;
    }
    requireText(value, path);
  }

  function validateQuiz(quiz) {
    if (!isRecord(quiz)) fail("quiz", "debe ser un objeto.");
    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      fail("quiz.questions", "debe contener al menos una pregunta.");
    }

    var questionIds = new Set();

    quiz.questions.forEach(function (question, questionIndex) {
      var questionPath = "quiz.questions[" + questionIndex + "]";
      if (!isRecord(question)) fail(questionPath, "debe ser un objeto.");
      requireText(question.id, questionPath + ".id");
      if (questionIds.has(question.id)) {
        fail(questionPath + ".id", 'está duplicado: "' + question.id + '".');
      }
      questionIds.add(question.id);
      requireLocalizedText(question.prompt, questionPath + ".prompt");

      if (!Array.isArray(question.options) || question.options.length < 2) {
        fail(questionPath + ".options", "debe incluir una respuesta y al menos un distractor.");
      }

      var optionIds = new Set();
      question.options.forEach(function (option, optionIndex) {
        var optionPath = questionPath + ".options[" + optionIndex + "]";
        if (!isRecord(option)) fail(optionPath, "debe ser un objeto.");
        requireText(option.id, optionPath + ".id");
        requireLocalizedText(option.text, optionPath + ".text");
        if (optionIds.has(option.id)) {
          fail(optionPath + ".id", 'está duplicado: "' + option.id + '".');
        }
        optionIds.add(option.id);
      });

      requireText(question.answer, questionPath + ".answer");
      if (!optionIds.has(question.answer)) {
        fail(questionPath + ".answer", 'debe coincidir con una opción; se recibió "' + question.answer + '".');
      }
      requireLocalizedText(question.explanation, questionPath + ".explanation");
    });

    if (owns.call(quiz, "passScore")) {
      if (!Number.isInteger(quiz.passScore)) {
        fail("quiz.passScore", "debe ser un entero.");
      }
      if (quiz.passScore < 1 || quiz.passScore > quiz.questions.length) {
        fail(
          "quiz.passScore",
          "debe estar entre 1 y " + quiz.questions.length + ".",
          RangeError
        );
      }
    }

    return true;
  }

  function gradeQuiz(quiz, responses, lang) {
    validateQuiz(quiz);
    if (!isRecord(responses)) fail("responses", "debe ser un objeto.");

    var questionsById = new Map(
      quiz.questions.map(function (question) {
        return [question.id, question];
      })
    );

    Object.keys(responses).forEach(function (questionId) {
      var question = questionsById.get(questionId);
      if (!question) {
        fail("responses." + questionId, "corresponde a una pregunta desconocida.", RangeError);
      }
      var selected = responses[questionId];
      if (typeof selected !== "string" || !question.options.some(function (option) { return option.id === selected; })) {
        fail(
          "responses." + questionId,
          'contiene una opción desconocida: "' + String(selected) + '".',
          RangeError
        );
      }
    });

    var answered = 0;
    var score = 0;
    var results = quiz.questions.map(function (question) {
      var hasResponse = owns.call(responses, question.id);
      var selected = hasResponse ? responses[question.id] : null;
      var correct = hasResponse && selected === question.answer;
      if (hasResponse) answered += 1;
      if (correct) score += 1;
      return {
        questionId: question.id,
        selected: selected,
        correct: correct,
        explanation: pick(question.explanation, lang),
      };
    });

    var total = quiz.questions.length;
    var passScore = owns.call(quiz, "passScore") ? quiz.passScore : total;
    return {
      passed: score >= passScore,
      score: score,
      total: total,
      percentage: Math.round((score / total) * 100),
      answered: answered,
      results: results,
    };
  }

  return {
    validateQuiz: validateQuiz,
    gradeQuiz: gradeQuiz,
  };
});

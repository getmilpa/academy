(function () {
  "use strict";

  var catalog = window.MilpaCurriculum;
  var progress = window.MilpaProgress;
  var quizBank = window.MilpaQuizBank;
  var quizEngine = window.MilpaQuiz;
  var inlineCode = window.MilpaInlineCode;
  var i18n = window.MilpaI18n;
  if (!catalog || !progress || !quizBank || !quizEngine || !inlineCode || !i18n) return;

  var lang = MilpaI18n.currentLang();
  var pick = i18n.pick;
  var store = progress.createStore(window.localStorage);
  var retakeUnits = new Set();
  var lessonRoot = document.getElementById("lesson");
  var navRoot = document.getElementById("courseNav");
  var mobileNavRoot = document.getElementById("mobileCourseNav");
  var asideRoot = document.getElementById("courseAside");
  var globalProgress = document.getElementById("globalProgress");
  var menu = document.getElementById("courseMenu");
  var menuToggle = document.getElementById("navToggle");
  var menuClose = document.getElementById("navClose");
  var themeButton = document.getElementById("themeBtn");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  // Escapa texto que puede traer code-spans Markdown (`código`) y envuelve
  // cada uno en <code>. El escapado ocurre por token, así que HTML dentro
  // de un code-span queda neutralizado igual que fuera de él.
  function escapeInline(text) {
    return inlineCode.splitCodeSpans(text).map(function (token) {
      return token.code ? "<code>" + escapeHtml(token.text) + "</code>" : escapeHtml(token.text);
    }).join("");
  }

  function unitHref(trackId, unitId) { return "#" + trackId + "/" + unitId; }
  function minutes(value) { return value >= 60 ? Math.round(value / 60 * 10) / 10 + " h" : value + " min"; }

  function parseRoute() {
    var raw = decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));
    var parts = raw.split("/").filter(Boolean);
    if (parts.length !== 2) return null;
    return catalog.getUnit(parts[0], parts[1]);
  }

  function unitsForTrack(track) {
    return track.units.map(function (unit) { return Object.assign({ trackId: track.id }, unit); });
  }

  function trackProgress(track, state) {
    return progress.percent(state, unitsForTrack(track));
  }

  function progressMarkup(value, label) {
    return "<div class=\"mui-progress\" role=\"progressbar\" aria-label=\"" + escapeHtml(label) + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"" + value + "\"><div class=\"mui-progress__bar\" style=\"width:" + value + "%\"></div></div>";
  }

  function navMarkup(route, mobile) {
    var state = store.read();
    var html = "<div class=\"mui-docs__nav-group ac-nav-home\"><a class=\"mui-docs__nav-item\" href=\"./\"" + (!route ? " aria-current=\"page\"" : "") + ">Todas las rutas</a></div>";
    catalog.tracks.forEach(function (track) {
      html += "<div class=\"mui-docs__nav-group\"><p class=\"mui-docs__nav-heading\">" + escapeHtml(pick(track.title, lang)) + "</p>";
      track.units.forEach(function (unit) {
        var key = progress.unitKey(track.id, unit.id);
        var current = route && route.track.id === track.id && route.unit.id === unit.id;
        var done = state.completed[key] === true;
        html += "<a class=\"mui-docs__nav-item ac-nav-unit\" href=\"" + unitHref(track.id, unit.id) + "\"" + (current ? " aria-current=\"page\"" : "") + "><span>" + escapeHtml(pick(unit.title, lang)) + "</span><span class=\"ac-nav-status\" aria-label=\"" + (done ? "Completada" : "Pendiente") + "\" title=\"" + (done ? "Completada" : "Pendiente") + "\">" + (done ? "✓" : "·") + "</span></a>";
      });
      html += "</div>";
    });
    if (mobile) {
      html = "<div class=\"mui-docs__nav-group\"><p class=\"mui-docs__nav-heading\">Academy</p><a class=\"mui-docs__nav-item\" href=\"../labs/\">Laboratorios</a><a class=\"mui-docs__nav-item\" href=\"../artifacts/\">Artifacts</a><a class=\"mui-docs__nav-item\" href=\"../webinars/\">Webinar</a></div>" + html;
    }
    return html;
  }

  function updateNavigation(route) {
    navRoot.innerHTML = navMarkup(route, false);
    mobileNavRoot.innerHTML = navMarkup(route, true);
    var state = store.read();
    var all = catalog.allUnits();
    globalProgress.textContent = progress.countCompleted(state, all) + "/" + all.length;
  }

  function resumeMarkup(state) {
    if (!state.lastUnit) return "";
    var parts = state.lastUnit.split("/");
    var found = parts.length === 2 ? catalog.getUnit(parts[0], parts[1]) : null;
    if (!found) return "";
    return "<div class=\"mui-callout mui-callout--note\" role=\"note\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">↗</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">Continúa donde estabas</p><p class=\"mui-callout__body\">" + escapeHtml(pick(found.track.title, lang) + " · " + pick(found.unit.title, lang)) + "</p><div class=\"ac-action-row\"><a class=\"mui-btn mui-btn--primary mui-btn--sm\" href=\"" + unitHref(found.track.id, found.unit.id) + "\">Continuar</a></div></div></div>";
  }

  function renderDashboard() {
    var state = store.read();
    var all = catalog.allUnits();
    var done = progress.countCompleted(state, all);
    var cards = catalog.tracks.map(function (track) {
      var value = trackProgress(track, state);
      var completed = progress.countCompleted(state, unitsForTrack(track));
      var firstPending = track.units.find(function (unit) { return !state.completed[progress.unitKey(track.id, unit.id)]; }) || track.units[track.units.length - 1];
      return "<a class=\"mui-card mui-card--interactive ac-track-card\" href=\"" + unitHref(track.id, firstPending.id) + "\"><div class=\"mui-card__body\"><p class=\"mui-section__kicker\">" + escapeHtml(pick(track.eyebrow, lang)) + "</p><h2>" + escapeHtml(pick(track.title, lang)) + "</h2><p>" + escapeHtml(pick(track.summary, lang)) + "</p><div class=\"ac-track-meta\"><span class=\"mui-badge\">" + escapeHtml(pick(track.level, lang)) + "</span><span class=\"mui-badge mui-badge--secondary\">" + escapeHtml(minutes(track.durationMinutes)) + "</span></div><div class=\"ac-track-progress\"><div class=\"ac-progress-copy\"><span>" + completed + " de " + track.units.length + " unidades</span><span>" + value + "%</span></div>" + progressMarkup(value, "Progreso en " + pick(track.title, lang)) + "</div></div></a>";
    }).join("");

    lessonRoot.innerHTML = "<section class=\"ac-dashboard-head\"><p class=\"mui-section__kicker\">Currículo público · v" + catalog.version + "</p><h1>Aprende la arquitectura haciéndola visible</h1><p>Elige una ruta. Cada unidad conecta una explicación breve, un artifact, una práctica y una evaluación calificable con la fuente primaria.</p><div class=\"ac-dashboard-meta\"><span class=\"mui-badge mui-badge--accent\">" + all.length + " unidades</span><span class=\"mui-badge\">" + done + " aprobadas</span><span class=\"mui-badge mui-badge--secondary\">progreso validado</span></div></section>" + resumeMarkup(state) + "<section aria-labelledby=\"tracksTitle\" style=\"margin-top:var(--space-8)\"><h2 id=\"tracksTitle\" class=\"mui-section__title\">Rutas públicas</h2><div class=\"ac-track-list\">" + cards + "</div></section><div class=\"mui-callout mui-callout--version\" role=\"note\" style=\"margin-top:var(--space-8)\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">i</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">Academy pública, contexto privado separado</p><p class=\"mui-callout__body\">TeamX puede añadir un catálogo interno durante su propio deploy. El pack privado no se publica ni se esconde dentro de este bundle.</p></div></div><div class=\"ac-reset\"><button class=\"mui-btn mui-btn--ghost mui-btn--sm\" id=\"resetProgress\" type=\"button\">Reiniciar progreso</button></div>";
    asideRoot.innerHTML = "<div class=\"ac-aside-block\"><p class=\"ac-aside-title\">Progreso total</p>" + progressMarkup(progress.percent(state, all), "Progreso total") + "<p class=\"ac-aside-copy\">" + done + " de " + all.length + " unidades aprobadas</p></div><div class=\"ac-aside-block\"><p class=\"ac-aside-title\">Método</p><p class=\"ac-aside-copy\">Entender → Ver → Hacer → Evaluar.</p></div>";
    document.title = "Aprender · Milpa Academy";
    var reset = document.getElementById("resetProgress");
    reset.addEventListener("click", function () {
      if (!window.confirm("¿Reiniciar el progreso de todas las rutas?")) return;
      store.reset();
      render();
    });
  }

  function terminalMarkup(commands) {
    if (!commands.length) return "";
    return "<div class=\"mui-terminal ac-terminal mui-not-prose\" aria-label=\"Comandos de la práctica\"><div class=\"mui-terminal__bar\"><span>terminal</span></div><div class=\"mui-terminal__body\" role=\"region\" aria-label=\"Comandos\" tabindex=\"0\">" + commands.map(function (command) { return "<div class=\"mui-terminal__line\"><span class=\"mui-terminal__prompt\">$</span><span>" + escapeHtml(command) + "</span></div>"; }).join("") + "</div></div>";
  }

  function tocMarkup() {
    return "<nav class=\"mui-toc\" aria-label=\"En esta página\"><ul class=\"mui-toc__list\"><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"entender\" href=\"#entender\">Entender</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"ver\" href=\"#ver\">Ver</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"hacer\" href=\"#hacer\">Hacer</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"verificar\" href=\"#verificar\">Verificar</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"fuentes\" href=\"#fuentes\">Fuentes</a></li></ul></nav>";
  }

  function pagerMarkup(track, index) {
    var previous = index > 0 ? track.units[index - 1] : null;
    var next = index < track.units.length - 1 ? track.units[index + 1] : null;
    var html = "<nav class=\"mui-pager\" aria-label=\"Paginación de la ruta\">";
    if (previous) html += "<a class=\"mui-pager__link\" href=\"" + unitHref(track.id, previous.id) + "\"><span class=\"mui-pager__dir\">← Anterior</span><span class=\"mui-pager__title\">" + escapeHtml(pick(previous.title, lang)) + "</span></a>";
    if (next) html += "<a class=\"mui-pager__link mui-pager__link--next\" href=\"" + unitHref(track.id, next.id) + "\"><span class=\"mui-pager__dir\">Siguiente →</span><span class=\"mui-pager__title\">" + escapeHtml(pick(next.title, lang)) + "</span></a>";
    return html + "</nav>";
  }

  function passedAssessmentMarkup(assessment) {
    return "<div class=\"mui-callout mui-callout--tip ac-quiz-passed mui-not-prose\" role=\"status\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">✓</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">Evaluación aprobada</p><p class=\"mui-callout__body\">Mejor resultado: " + assessment.bestScore + " de " + assessment.total + " · " + assessment.attempts + " intento" + (assessment.attempts === 1 ? "" : "s") + ".</p><div class=\"ac-action-row\"><button class=\"mui-btn mui-btn--ghost mui-btn--sm\" id=\"retakeQuiz\" type=\"button\">Repetir cuestionario</button></div></div></div>";
  }

  function quizMarkup(unitKey, quiz, assessment) {
    var passScore = quiz.passScore || quiz.questions.length;
    var attempts = assessment ? assessment.attempts : 0;
    var questions = quiz.questions.map(function (question, questionIndex) {
      var inputName = "quiz-" + unitKey.replace("/", "-") + "-" + question.id;
      var errorId = "quiz-error-" + question.id;
      var feedbackId = "quiz-feedback-" + question.id;
      var options = question.options.map(function (option) {
        return "<label class=\"mui-choice ac-quiz-option\"><input class=\"mui-radio\" type=\"radio\" name=\"" + escapeHtml(inputName) + "\" value=\"" + escapeHtml(option.id) + "\"><span class=\"mui-choice__text\">" + escapeInline(option.text) + "</span></label>";
      }).join("");
      return "<fieldset class=\"mui-field ac-quiz-question\" data-question-id=\"" + escapeHtml(question.id) + "\"><legend class=\"mui-field__label ac-quiz-prompt\"><span class=\"ac-quiz-index\">Pregunta " + (questionIndex + 1) + " de " + quiz.questions.length + "</span><span>" + escapeInline(question.prompt) + "</span></legend><div class=\"ac-quiz-options\">" + options + "</div><p class=\"mui-field__error\" id=\"" + errorId + "\" data-question-error hidden>Selecciona una respuesta antes de calificar.</p><div class=\"ac-quiz-feedback\" id=\"" + feedbackId + "\" data-question-feedback hidden></div></fieldset>";
    }).join("");

    return "<form class=\"ac-quiz mui-not-prose\" id=\"lessonQuiz\" novalidate><div class=\"ac-quiz-head\"><div><p class=\"ac-quiz-eyebrow\">Evaluación calificable</p><p class=\"ac-quiz-copy\">Resuelve los " + quiz.questions.length + " escenarios. Esta unidad exige " + passScore + " de " + quiz.questions.length + " respuestas correctas.</p></div><span class=\"mui-badge\">" + attempts + " intento" + (attempts === 1 ? "" : "s") + "</span></div><div class=\"ac-quiz-questions\">" + questions + "</div><div class=\"ac-quiz-actions\"><button class=\"mui-btn mui-btn--primary\" type=\"submit\">Calificar evaluación</button><p>La calificación valida respuestas en este navegador; no certifica identidad.</p></div><div class=\"ac-quiz-result\" id=\"quizResult\" role=\"status\" aria-live=\"polite\" tabindex=\"-1\"></div></form>";
  }

  function renderLesson(route) {
    var track = route.track;
    var unit = route.unit;
    var key = progress.unitKey(track.id, unit.id);
    store.visit(key);
    var state = store.read();
    var complete = state.completed[key] === true;
    var assessment = state.assessments[key] || null;
    var quiz = quizBank.get(key);
    if (!quiz) {
      lessonRoot.innerHTML = "<div class=\"mui-callout mui-callout--danger\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">Evaluación no disponible</p><p class=\"mui-callout__body\">La unidad no puede completarse porque su banco de preguntas no está registrado.</p></div></div>";
      asideRoot.innerHTML = "";
      return;
    }
    quizEngine.validateQuiz(quiz);

    var body = unit.understand.map(function (paragraph) { return "<p>" + escapeHtml(pick(paragraph, lang)) + "</p>"; }).join("");
    var objectives = unit.objectives.map(function (objective) { return "<li>" + escapeHtml(pick(objective, lang)) + "</li>"; }).join("");
    var rubric = unit.verify.map(function (criterion) { return "<li>" + escapeHtml(pick(criterion, lang)) + "</li>"; }).join("");
    var sources = unit.sources.map(function (source) { return "<li><a href=\"" + escapeHtml(source.href) + "\">" + escapeHtml(pick(source.label, lang)) + "</a></li>"; }).join("");
    var toc = tocMarkup();
    var assessmentMarkup = complete && !retakeUnits.has(key)
      ? passedAssessmentMarkup(assessment)
      : quizMarkup(key, quiz, assessment);
    var breadcrumbs = "<nav class=\"mui-breadcrumbs\" aria-label=\"Migas de pan\"><ol class=\"mui-breadcrumbs__list\"><li class=\"mui-breadcrumbs__item\"><a class=\"mui-breadcrumbs__link\" href=\"./\">Rutas</a></li><li class=\"mui-breadcrumbs__item\"><span aria-current=\"page\">" + escapeHtml(pick(track.title, lang)) + "</span></li></ol></nav>";
    var header = "<header class=\"ac-lesson-header mui-not-prose\"><p class=\"ac-lesson-kicker\">" + escapeHtml(pick(track.title, lang)) + " · Unidad " + (route.index + 1) + " de " + track.units.length + "</p><h1>" + escapeHtml(pick(unit.title, lang)) + "</h1><p class=\"ac-lesson-summary\">" + escapeHtml(pick(unit.understand[0], lang)) + "</p><div class=\"ac-lesson-meta\"><span class=\"mui-badge\">" + escapeHtml(pick(track.level, lang)) + "</span><span class=\"mui-badge mui-badge--secondary\">" + unit.durationMinutes + " min</span>" + (complete ? "<span class=\"mui-badge mui-badge--success\">Evaluación aprobada</span>" : "") + "</div></header>";
    var objectivesMarkup = "<section class=\"ac-objectives mui-not-prose\" aria-labelledby=\"objectivesTitle\"><h2 id=\"objectivesTitle\">Al terminar podrás</h2><ul>" + objectives + "</ul></section>";
    var understandMarkup = "<section class=\"ac-phase\" id=\"entender\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">1</span>Entender</h2>" + body + "</section>";
    var seeMarkup = "<section class=\"ac-phase\" id=\"ver\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">2</span>Ver</h2><div class=\"mui-callout mui-callout--note mui-not-prose\" role=\"note\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">↗</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(pick(unit.see.label, lang)) + "</p><p class=\"mui-callout__body\">" + escapeHtml(pick(unit.see.note, lang)) + "</p><div class=\"ac-action-row\"><a class=\"mui-btn mui-btn--primary mui-btn--sm\" href=\"" + escapeHtml(unit.see.href) + "\">Abrir artifact</a></div></div></div></section>";
    var doMarkup = "<section class=\"ac-phase\" id=\"hacer\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">3</span>Hacer</h2><p>Ejecuta la práctica en tu checkout y conserva la salida como evidencia.</p>" + terminalMarkup(unit.do.commands) + "<div class=\"ac-action-row mui-not-prose\"><a class=\"mui-btn mui-btn--secondary\" href=\"" + escapeHtml(unit.do.href) + "\">" + escapeHtml(pick(unit.do.label, lang)) + "</a></div></section>";
    var verifyMarkup = "<section class=\"ac-phase\" id=\"verificar\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">4</span>Verificar</h2><p>Demuestra que puedes aplicar la unidad. El progreso solo avanza al aprobar la evaluación.</p><div class=\"ac-rubric mui-not-prose\"><p>Criterios evaluados</p><ul>" + rubric + "</ul></div>" + assessmentMarkup + "</section>";
    var sourcesMarkup = "<section class=\"ac-sources\" id=\"fuentes\"><h2>Fuentes primarias</h2><ul>" + sources + "</ul><p class=\"ac-verified\">Contenido verificado: " + escapeHtml(unit.lastVerified) + "</p></section>";

    lessonRoot.innerHTML = breadcrumbs + "<details class=\"mui-docs__toc-inline ac-mobile-toc\"><summary>En esta página</summary>" + toc + "</details><article class=\"mui-prose\">" + header + objectivesMarkup + understandMarkup + seeMarkup + doMarkup + verifyMarkup + sourcesMarkup + "</article>" + pagerMarkup(track, route.index);
    asideRoot.innerHTML = "<div class=\"ac-aside-block\"><p class=\"ac-aside-title\">En esta página</p>" + toc + "</div><div class=\"ac-aside-block\"><p class=\"ac-aside-title\">Progreso de la ruta</p>" + progressMarkup(trackProgress(track, state), "Progreso en " + pick(track.title, lang)) + "<p class=\"ac-aside-copy\">" + progress.countCompleted(state, unitsForTrack(track)) + " de " + track.units.length + " unidades</p></div>";
    document.title = pick(unit.title, lang) + " · Milpa Academy";

    if (complete && !retakeUnits.has(key)) {
      document.getElementById("retakeQuiz").addEventListener("click", function () {
        retakeUnits.add(key);
        render();
      });
      return;
    }

    var form = document.getElementById("lessonQuiz");
    var resultRoot = document.getElementById("quizResult");
    var submitButton = form.querySelector("button[type=\"submit\"]");

    function fieldsetFor(questionId) {
      return Array.prototype.find.call(form.querySelectorAll("[data-question-id]"), function (fieldset) {
        return fieldset.dataset.questionId === questionId;
      });
    }

    function clearQuestionState(fieldset) {
      fieldset.removeAttribute("aria-describedby");
      delete fieldset.dataset.result;
      fieldset.querySelectorAll(".mui-radio").forEach(function (radio) { radio.removeAttribute("aria-invalid"); });
      var error = fieldset.querySelector("[data-question-error]");
      var feedback = fieldset.querySelector("[data-question-feedback]");
      error.hidden = true;
      feedback.hidden = true;
      feedback.innerHTML = "";
    }

    form.addEventListener("change", function (event) {
      var fieldset = event.target.closest("[data-question-id]");
      if (fieldset) clearQuestionState(fieldset);
      resultRoot.innerHTML = "";
      submitButton.textContent = "Calificar evaluación";
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var responses = {};
      quiz.questions.forEach(function (question) {
        var inputName = "quiz-" + key.replace("/", "-") + "-" + question.id;
        var selected = data.get(inputName);
        if (typeof selected === "string") responses[question.id] = selected;
      });

      form.querySelectorAll("[data-question-id]").forEach(clearQuestionState);
      var result = quizEngine.gradeQuiz(quiz, responses);
      if (result.answered < result.total) {
        result.results.filter(function (item) { return item.selected === null; }).forEach(function (item) {
          var fieldset = fieldsetFor(item.questionId);
          var error = fieldset.querySelector("[data-question-error]");
          fieldset.setAttribute("aria-describedby", error.id);
          fieldset.querySelectorAll(".mui-radio").forEach(function (radio) { radio.setAttribute("aria-invalid", "true"); });
          error.hidden = false;
        });
        resultRoot.innerHTML = "<div class=\"mui-callout mui-callout--warning\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">Evaluación incompleta</p><p class=\"mui-callout__body\">Responde las " + result.total + " preguntas antes de calificar.</p></div></div>";
        resultRoot.focus();
        return;
      }

      var nextState = store.recordAssessment(key, result);
      var recorded = nextState.assessments[key];
      result.results.forEach(function (item) {
        var fieldset = fieldsetFor(item.questionId);
        var feedback = fieldset.querySelector("[data-question-feedback]");
        fieldset.dataset.result = item.correct ? "correct" : "incorrect";
        fieldset.setAttribute("aria-describedby", feedback.id);
        feedback.innerHTML = "<strong>" + (item.correct ? "Correcta." : "Incorrecta.") + "</strong><p>" + escapeInline(item.explanation) + "</p>";
        feedback.hidden = false;
      });

      if (result.passed) {
        retakeUnits.delete(key);
        render();
        document.getElementById("verificar").scrollIntoView({ block: "start" });
        return;
      }

      updateNavigation(route);
      form.querySelector(".ac-quiz-head .mui-badge").textContent = recorded.attempts + " intentos";
      submitButton.textContent = "Volver a calificar";
      var failedTitle = recorded.passed ? "Repaso no aprobado" : "Aún no se aprueba";
      var failedBody = "Resultado: " + result.score + " de " + result.total + ". Revisa la explicación de cada escenario y vuelve a intentarlo." + (recorded.passed ? " Tu aprobación anterior se conserva." : "");
      resultRoot.innerHTML = "<div class=\"mui-callout mui-callout--danger\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + failedTitle + "</p><p class=\"mui-callout__body\">" + failedBody + "</p></div></div>";
      resultRoot.focus();
    });
  }

  function render() {
    var route = parseRoute();
    updateNavigation(route);
    if (route) renderLesson(route);
    else renderDashboard();
  }

  function setTheme(theme) {
    var selected = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = selected;
    themeButton.textContent = selected === "dark" ? "Tema: oscuro" : "Tema: claro";
    themeButton.setAttribute("aria-label", "Cambiar a tema " + (selected === "dark" ? "claro" : "oscuro"));
    try { window.localStorage.setItem("milpa-academy-theme", selected); } catch (error) { return; }
  }

  menuToggle.addEventListener("click", function () {
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
  });
  menuClose.addEventListener("click", function () { menu.close(); });
  menu.addEventListener("close", function () {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  });
  menu.addEventListener("click", function (event) { if (event.target === menu) menu.close(); });
  mobileNavRoot.addEventListener("click", function (event) { if (event.target.closest("a")) menu.close(); });
  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-section]");
    if (!link) return;
    var section = document.getElementById(link.dataset.section);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  themeButton.addEventListener("click", function () { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); });
  window.addEventListener("hashchange", function () { render(); document.getElementById("main").focus(); });

  var savedTheme = "dark";
  try { savedTheme = window.localStorage.getItem("milpa-academy-theme") || "dark"; } catch (error) { savedTheme = "dark"; }
  setTheme(savedTheme);
  render();
})();

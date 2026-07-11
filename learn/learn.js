(function () {
  "use strict";

  var catalog = window.MilpaCurriculum;
  var progress = window.MilpaProgress;
  var quizBank = window.MilpaQuizBank;
  var quizEngine = window.MilpaQuiz;
  var inlineCode = window.MilpaInlineCode;
  var i18n = window.MilpaI18n;
  if (!catalog || !progress || !quizBank || !quizEngine || !inlineCode || !i18n) return;

  /* Script clásico (sin import/export): learn.js no puede importar el módulo
     ESM del portal, así que trae su propia tabla {es,en} — mismo enfoque que
     academy.js. Todo el texto de chrome que learn.js genera en el cliente
     (nav, breadcrumbs, TOC, quiz, dashboard, títulos de documento) vive acá;
     el contenido del currículo y los quizzes ya viene {es,en} y se resuelve
     con pick(), no con STRINGS. */
  var STRINGS = {
    es: {
      allRoutesLink: "Todas las rutas",
      statusDone: "Completada",
      statusPending: "Pendiente",
      mobileAcademyHeading: "Academy",
      navLabs: "Laboratorios",
      navArtifacts: "Artifacts",
      navWebinar: "Webinar",
      resumeTitle: "Continúa donde estabas",
      resumeButton: "Continuar",
      dashboardKicker: function (version) {
        return "Currículo público · v" + version;
      },
      dashboardH1: "Aprende la arquitectura haciéndola visible",
      dashboardLede: "Elige una ruta. Cada unidad conecta una explicación breve, un artifact, una práctica y una evaluación calificable con la fuente primaria.",
      unitsBadge: function (count) {
        return count + " unidades";
      },
      passedBadge: function (count) {
        return count + " aprobadas";
      },
      validatedProgressBadge: "progreso validado",
      unitsOfTotal: function (completed, total) {
        return completed + " de " + total + " unidades";
      },
      progressInLabel: function (trackTitle) {
        return "Progreso en " + trackTitle;
      },
      tracksHeading: "Rutas públicas",
      privateContextTitle: "Academy pública, contexto privado separado",
      privateContextBody: "TeamX puede añadir un catálogo interno durante su propio deploy. El pack privado no se publica ni se esconde dentro de este bundle.",
      resetProgressButton: "Reiniciar progreso",
      resetProgressConfirm: "¿Reiniciar el progreso de todas las rutas?",
      totalProgressTitle: "Progreso total",
      totalProgressCopy: function (completed, total) {
        return completed + " de " + total + " unidades aprobadas";
      },
      methodTitle: "Método",
      methodCopy: "Entender → Ver → Hacer → Evaluar.",
      dashboardTitle: "Aprender · Milpa Academy",
      titleSuffix: " · Milpa Academy",
      terminalAriaLabel: "Comandos de la práctica",
      terminalRegionAriaLabel: "Comandos",
      onThisPage: "En esta página",
      phaseUnderstand: "Entender",
      phaseSee: "Ver",
      phaseDo: "Hacer",
      phaseVerify: "Verificar",
      tocSources: "Fuentes",
      pagerAriaLabel: "Paginación de la ruta",
      pagerPrev: "← Anterior",
      pagerNext: "Siguiente →",
      assessmentPassed: "Evaluación aprobada",
      passedBody: function (bestScore, total, attempts) {
        return "Mejor resultado: " + bestScore + " de " + total + " · " + attempts + " intento" + (attempts === 1 ? "" : "s") + ".";
      },
      retakeButton: "Repetir cuestionario",
      questionIndex: function (index, total) {
        return "Pregunta " + index + " de " + total;
      },
      questionError: "Selecciona una respuesta antes de calificar.",
      quizEyebrow: "Evaluación calificable",
      quizIntro: function (count, passScore) {
        return "Resuelve los " + count + " escenarios. Esta unidad exige " + passScore + " de " + count + " respuestas correctas.";
      },
      attemptsBadge: function (attempts) {
        return attempts + " intento" + (attempts === 1 ? "" : "s");
      },
      attemptsPluralWord: "intentos",
      submitGrade: "Calificar evaluación",
      gradingNote: "La calificación valida respuestas en este navegador; no certifica identidad.",
      quizUnavailableTitle: "Evaluación no disponible",
      quizUnavailableBody: "La unidad no puede completarse porque su banco de preguntas no está registrado.",
      breadcrumbsAriaLabel: "Migas de pan",
      breadcrumbRoutes: "Rutas",
      unitOfTotal: function (index, total) {
        return "Unidad " + index + " de " + total;
      },
      objectivesHeading: "Al terminar podrás",
      openArtifactButton: "Abrir artifact",
      doIntro: "Ejecuta la práctica en tu checkout y conserva la salida como evidencia.",
      verifyIntro: "Demuestra que puedes aplicar la unidad. El progreso solo avanza al aprobar la evaluación.",
      rubricTitle: "Criterios evaluados",
      sourcesHeading: "Fuentes primarias",
      verifiedPrefix: "Contenido verificado: ",
      routeProgressTitle: "Progreso de la ruta",
      incompleteTitle: "Evaluación incompleta",
      incompleteBody: function (total) {
        return "Responde las " + total + " preguntas antes de calificar.";
      },
      correctLabel: "Correcta.",
      incorrectLabel: "Incorrecta.",
      regradeButton: "Volver a calificar",
      failedTitleRepeat: "Repaso no aprobado",
      failedTitleFirst: "Aún no se aprueba",
      failedBody: function (score, total, keepPrevious) {
        return "Resultado: " + score + " de " + total + ". Revisa la explicación de cada escenario y vuelve a intentarlo." + (keepPrevious ? " Tu aprobación anterior se conserva." : "");
      },
      themeDark: "Tema: oscuro",
      themeLight: "Tema: claro",
      themeAriaSwitch: function (toTheme) {
        return "Cambiar a tema " + (toTheme === "light" ? "claro" : "oscuro");
      }
    },
    en: {
      allRoutesLink: "All routes",
      statusDone: "Completed",
      statusPending: "Pending",
      mobileAcademyHeading: "Academy",
      navLabs: "Labs",
      navArtifacts: "Artifacts",
      navWebinar: "Webinar",
      resumeTitle: "Continue where you left off",
      resumeButton: "Continue",
      dashboardKicker: function (version) {
        return "Public curriculum · v" + version;
      },
      dashboardH1: "Learn the architecture by making it visible",
      dashboardLede: "Choose a track. Each unit connects a short explanation, an artifact, a hands-on practice, and a graded assessment with the primary source.",
      unitsBadge: function (count) {
        return count + " units";
      },
      passedBadge: function (count) {
        return count + " passed";
      },
      validatedProgressBadge: "validated progress",
      unitsOfTotal: function (completed, total) {
        return completed + " of " + total + " units";
      },
      progressInLabel: function (trackTitle) {
        return "Progress in " + trackTitle;
      },
      tracksHeading: "Public tracks",
      privateContextTitle: "Public academy, private context kept separate",
      privateContextBody: "TeamX can add an internal catalog during its own deploy. The private pack is never published or hidden inside this bundle.",
      resetProgressButton: "Reset progress",
      resetProgressConfirm: "Reset progress across all tracks?",
      totalProgressTitle: "Total progress",
      totalProgressCopy: function (completed, total) {
        return completed + " of " + total + " units passed";
      },
      methodTitle: "Method",
      methodCopy: "Understand → See → Do → Assess.",
      dashboardTitle: "Learn · Milpa Academy",
      titleSuffix: " · Milpa Academy",
      terminalAriaLabel: "Practice commands",
      terminalRegionAriaLabel: "Commands",
      onThisPage: "On this page",
      phaseUnderstand: "Understand",
      phaseSee: "See",
      phaseDo: "Do",
      phaseVerify: "Verify",
      tocSources: "Sources",
      pagerAriaLabel: "Track pagination",
      pagerPrev: "← Previous",
      pagerNext: "Next →",
      assessmentPassed: "Assessment passed",
      passedBody: function (bestScore, total, attempts) {
        return "Best result: " + bestScore + " of " + total + " · " + attempts + " attempt" + (attempts === 1 ? "" : "s") + ".";
      },
      retakeButton: "Retake quiz",
      questionIndex: function (index, total) {
        return "Question " + index + " of " + total;
      },
      questionError: "Select an answer before grading.",
      quizEyebrow: "Graded assessment",
      quizIntro: function (count, passScore) {
        return "Solve the " + count + " scenarios. This unit requires " + passScore + " of " + count + " correct answers.";
      },
      attemptsBadge: function (attempts) {
        return attempts + " attempt" + (attempts === 1 ? "" : "s");
      },
      attemptsPluralWord: "attempts",
      submitGrade: "Grade assessment",
      gradingNote: "Grading validates answers in this browser; it doesn't certify identity.",
      quizUnavailableTitle: "Assessment unavailable",
      quizUnavailableBody: "This unit can't be completed because its question bank isn't registered.",
      breadcrumbsAriaLabel: "Breadcrumb",
      breadcrumbRoutes: "Routes",
      unitOfTotal: function (index, total) {
        return "Unit " + index + " of " + total;
      },
      objectivesHeading: "By the end, you'll be able to",
      openArtifactButton: "Open artifact",
      doIntro: "Run the practice in your checkout and keep the output as evidence.",
      verifyIntro: "Show that you can apply the unit. Progress only advances once you pass the assessment.",
      rubricTitle: "Criteria assessed",
      sourcesHeading: "Primary sources",
      verifiedPrefix: "Content verified: ",
      routeProgressTitle: "Track progress",
      incompleteTitle: "Incomplete assessment",
      incompleteBody: function (total) {
        return "Answer all " + total + " questions before grading.";
      },
      correctLabel: "Correct.",
      incorrectLabel: "Incorrect.",
      regradeButton: "Grade again",
      failedTitleRepeat: "Retake not passed",
      failedTitleFirst: "Not passed yet",
      failedBody: function (score, total, keepPrevious) {
        return "Result: " + score + " of " + total + ". Review the explanation for each scenario and try again." + (keepPrevious ? " Your previous pass is kept." : "");
      },
      themeDark: "Theme: dark",
      themeLight: "Theme: light",
      themeAriaSwitch: function (toTheme) {
        return "Switch to " + (toTheme === "light" ? "light" : "dark") + " theme";
      }
    }
  };

  var lang = MilpaI18n.currentLang();
  var t = STRINGS[lang];
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
    var html = "<div class=\"mui-docs__nav-group ac-nav-home\"><a class=\"mui-docs__nav-item\" href=\"./\"" + (!route ? " aria-current=\"page\"" : "") + ">" + escapeHtml(t.allRoutesLink) + "</a></div>";
    catalog.tracks.forEach(function (track) {
      html += "<div class=\"mui-docs__nav-group\"><p class=\"mui-docs__nav-heading\">" + escapeHtml(pick(track.title, lang)) + "</p>";
      track.units.forEach(function (unit) {
        var key = progress.unitKey(track.id, unit.id);
        var current = route && route.track.id === track.id && route.unit.id === unit.id;
        var done = state.completed[key] === true;
        var statusLabel = done ? t.statusDone : t.statusPending;
        html += "<a class=\"mui-docs__nav-item ac-nav-unit\" href=\"" + unitHref(track.id, unit.id) + "\"" + (current ? " aria-current=\"page\"" : "") + "><span>" + escapeHtml(pick(unit.title, lang)) + "</span><span class=\"ac-nav-status\" aria-label=\"" + escapeHtml(statusLabel) + "\" title=\"" + escapeHtml(statusLabel) + "\">" + (done ? "✓" : "·") + "</span></a>";
      });
      html += "</div>";
    });
    if (mobile) {
      html = "<div class=\"mui-docs__nav-group\"><p class=\"mui-docs__nav-heading\">" + escapeHtml(t.mobileAcademyHeading) + "</p><a class=\"mui-docs__nav-item\" href=\"../labs/\">" + escapeHtml(t.navLabs) + "</a><a class=\"mui-docs__nav-item\" href=\"../artifacts/\">" + escapeHtml(t.navArtifacts) + "</a><a class=\"mui-docs__nav-item\" href=\"../webinars/\">" + escapeHtml(t.navWebinar) + "</a></div>" + html;
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
    return "<div class=\"mui-callout mui-callout--note\" role=\"note\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">↗</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(t.resumeTitle) + "</p><p class=\"mui-callout__body\">" + escapeHtml(pick(found.track.title, lang) + " · " + pick(found.unit.title, lang)) + "</p><div class=\"ac-action-row\"><a class=\"mui-btn mui-btn--primary mui-btn--sm\" href=\"" + unitHref(found.track.id, found.unit.id) + "\">" + escapeHtml(t.resumeButton) + "</a></div></div></div>";
  }

  function renderDashboard() {
    var state = store.read();
    var all = catalog.allUnits();
    var done = progress.countCompleted(state, all);
    var cards = catalog.tracks.map(function (track) {
      var value = trackProgress(track, state);
      var completed = progress.countCompleted(state, unitsForTrack(track));
      var firstPending = track.units.find(function (unit) { return !state.completed[progress.unitKey(track.id, unit.id)]; }) || track.units[track.units.length - 1];
      return "<a class=\"mui-card mui-card--interactive ac-track-card\" href=\"" + unitHref(track.id, firstPending.id) + "\"><div class=\"mui-card__body\"><p class=\"mui-section__kicker\">" + escapeHtml(pick(track.eyebrow, lang)) + "</p><h2>" + escapeHtml(pick(track.title, lang)) + "</h2><p>" + escapeHtml(pick(track.summary, lang)) + "</p><div class=\"ac-track-meta\"><span class=\"mui-badge\">" + escapeHtml(pick(track.level, lang)) + "</span><span class=\"mui-badge mui-badge--secondary\">" + escapeHtml(minutes(track.durationMinutes)) + "</span></div><div class=\"ac-track-progress\"><div class=\"ac-progress-copy\"><span>" + escapeHtml(t.unitsOfTotal(completed, track.units.length)) + "</span><span>" + value + "%</span></div>" + progressMarkup(value, t.progressInLabel(pick(track.title, lang))) + "</div></div></a>";
    }).join("");

    lessonRoot.innerHTML = "<section class=\"ac-dashboard-head\"><p class=\"mui-section__kicker\">" + escapeHtml(t.dashboardKicker(catalog.version)) + "</p><h1>" + escapeHtml(t.dashboardH1) + "</h1><p>" + escapeHtml(t.dashboardLede) + "</p><div class=\"ac-dashboard-meta\"><span class=\"mui-badge mui-badge--accent\">" + escapeHtml(t.unitsBadge(all.length)) + "</span><span class=\"mui-badge\">" + escapeHtml(t.passedBadge(done)) + "</span><span class=\"mui-badge mui-badge--secondary\">" + escapeHtml(t.validatedProgressBadge) + "</span></div></section>" + resumeMarkup(state) + "<section aria-labelledby=\"tracksTitle\" style=\"margin-top:var(--space-8)\"><h2 id=\"tracksTitle\" class=\"mui-section__title\">" + escapeHtml(t.tracksHeading) + "</h2><div class=\"ac-track-list\">" + cards + "</div></section><div class=\"mui-callout mui-callout--version\" role=\"note\" style=\"margin-top:var(--space-8)\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">i</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(t.privateContextTitle) + "</p><p class=\"mui-callout__body\">" + escapeHtml(t.privateContextBody) + "</p></div></div><div class=\"ac-reset\"><button class=\"mui-btn mui-btn--ghost mui-btn--sm\" id=\"resetProgress\" type=\"button\">" + escapeHtml(t.resetProgressButton) + "</button></div>";
    asideRoot.innerHTML = "<div class=\"ac-aside-block\"><p class=\"ac-aside-title\">" + escapeHtml(t.totalProgressTitle) + "</p>" + progressMarkup(progress.percent(state, all), t.totalProgressTitle) + "<p class=\"ac-aside-copy\">" + escapeHtml(t.totalProgressCopy(done, all.length)) + "</p></div><div class=\"ac-aside-block\"><p class=\"ac-aside-title\">" + escapeHtml(t.methodTitle) + "</p><p class=\"ac-aside-copy\">" + escapeHtml(t.methodCopy) + "</p></div>";
    document.title = t.dashboardTitle;
    var reset = document.getElementById("resetProgress");
    reset.addEventListener("click", function () {
      if (!window.confirm(t.resetProgressConfirm)) return;
      store.reset();
      render();
    });
  }

  function terminalMarkup(commands) {
    if (!commands.length) return "";
    return "<div class=\"mui-terminal ac-terminal mui-not-prose\" aria-label=\"" + escapeHtml(t.terminalAriaLabel) + "\"><div class=\"mui-terminal__bar\"><span>terminal</span></div><div class=\"mui-terminal__body\" role=\"region\" aria-label=\"" + escapeHtml(t.terminalRegionAriaLabel) + "\" tabindex=\"0\">" + commands.map(function (command) { return "<div class=\"mui-terminal__line\"><span class=\"mui-terminal__prompt\">$</span><span>" + escapeHtml(command) + "</span></div>"; }).join("") + "</div></div>";
  }

  function tocMarkup() {
    return "<nav class=\"mui-toc\" aria-label=\"" + escapeHtml(t.onThisPage) + "\"><ul class=\"mui-toc__list\"><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"entender\" href=\"#entender\">" + escapeHtml(t.phaseUnderstand) + "</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"ver\" href=\"#ver\">" + escapeHtml(t.phaseSee) + "</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"hacer\" href=\"#hacer\">" + escapeHtml(t.phaseDo) + "</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"verificar\" href=\"#verificar\">" + escapeHtml(t.phaseVerify) + "</a></li><li class=\"mui-toc__item\"><a class=\"mui-toc__link\" data-section=\"fuentes\" href=\"#fuentes\">" + escapeHtml(t.tocSources) + "</a></li></ul></nav>";
  }

  function pagerMarkup(track, index) {
    var previous = index > 0 ? track.units[index - 1] : null;
    var next = index < track.units.length - 1 ? track.units[index + 1] : null;
    var html = "<nav class=\"mui-pager\" aria-label=\"" + escapeHtml(t.pagerAriaLabel) + "\">";
    if (previous) html += "<a class=\"mui-pager__link\" href=\"" + unitHref(track.id, previous.id) + "\"><span class=\"mui-pager__dir\">" + escapeHtml(t.pagerPrev) + "</span><span class=\"mui-pager__title\">" + escapeHtml(pick(previous.title, lang)) + "</span></a>";
    if (next) html += "<a class=\"mui-pager__link mui-pager__link--next\" href=\"" + unitHref(track.id, next.id) + "\"><span class=\"mui-pager__dir\">" + escapeHtml(t.pagerNext) + "</span><span class=\"mui-pager__title\">" + escapeHtml(pick(next.title, lang)) + "</span></a>";
    return html + "</nav>";
  }

  function passedAssessmentMarkup(assessment) {
    return "<div class=\"mui-callout mui-callout--tip ac-quiz-passed mui-not-prose\" role=\"status\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">✓</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(t.assessmentPassed) + "</p><p class=\"mui-callout__body\">" + escapeHtml(t.passedBody(assessment.bestScore, assessment.total, assessment.attempts)) + "</p><div class=\"ac-action-row\"><button class=\"mui-btn mui-btn--ghost mui-btn--sm\" id=\"retakeQuiz\" type=\"button\">" + escapeHtml(t.retakeButton) + "</button></div></div></div>";
  }

  function quizMarkup(unitKey, quiz, assessment) {
    var passScore = quiz.passScore || quiz.questions.length;
    var attempts = assessment ? assessment.attempts : 0;
    var questions = quiz.questions.map(function (question, questionIndex) {
      var inputName = "quiz-" + unitKey.replace("/", "-") + "-" + question.id;
      var errorId = "quiz-error-" + question.id;
      var feedbackId = "quiz-feedback-" + question.id;
      var options = question.options.map(function (option) {
        return "<label class=\"mui-choice ac-quiz-option\"><input class=\"mui-radio\" type=\"radio\" name=\"" + escapeHtml(inputName) + "\" value=\"" + escapeHtml(option.id) + "\"><span class=\"mui-choice__text\">" + escapeInline(pick(option.text, lang)) + "</span></label>";
      }).join("");
      return "<fieldset class=\"mui-field ac-quiz-question\" data-question-id=\"" + escapeHtml(question.id) + "\"><legend class=\"mui-field__label ac-quiz-prompt\"><span class=\"ac-quiz-index\">" + escapeHtml(t.questionIndex(questionIndex + 1, quiz.questions.length)) + "</span><span>" + escapeInline(pick(question.prompt, lang)) + "</span></legend><div class=\"ac-quiz-options\">" + options + "</div><p class=\"mui-field__error\" id=\"" + errorId + "\" data-question-error hidden>" + escapeHtml(t.questionError) + "</p><div class=\"ac-quiz-feedback\" id=\"" + feedbackId + "\" data-question-feedback hidden></div></fieldset>";
    }).join("");

    return "<form class=\"ac-quiz mui-not-prose\" id=\"lessonQuiz\" novalidate><div class=\"ac-quiz-head\"><div><p class=\"ac-quiz-eyebrow\">" + escapeHtml(t.quizEyebrow) + "</p><p class=\"ac-quiz-copy\">" + escapeHtml(t.quizIntro(quiz.questions.length, passScore)) + "</p></div><span class=\"mui-badge\">" + escapeHtml(t.attemptsBadge(attempts)) + "</span></div><div class=\"ac-quiz-questions\">" + questions + "</div><div class=\"ac-quiz-actions\"><button class=\"mui-btn mui-btn--primary\" type=\"submit\">" + escapeHtml(t.submitGrade) + "</button><p>" + escapeHtml(t.gradingNote) + "</p></div><div class=\"ac-quiz-result\" id=\"quizResult\" role=\"status\" aria-live=\"polite\" tabindex=\"-1\"></div></form>";
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
      lessonRoot.innerHTML = "<div class=\"mui-callout mui-callout--danger\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(t.quizUnavailableTitle) + "</p><p class=\"mui-callout__body\">" + escapeHtml(t.quizUnavailableBody) + "</p></div></div>";
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
    var breadcrumbs = "<nav class=\"mui-breadcrumbs\" aria-label=\"" + escapeHtml(t.breadcrumbsAriaLabel) + "\"><ol class=\"mui-breadcrumbs__list\"><li class=\"mui-breadcrumbs__item\"><a class=\"mui-breadcrumbs__link\" href=\"./\">" + escapeHtml(t.breadcrumbRoutes) + "</a></li><li class=\"mui-breadcrumbs__item\"><span aria-current=\"page\">" + escapeHtml(pick(track.title, lang)) + "</span></li></ol></nav>";
    var header = "<header class=\"ac-lesson-header mui-not-prose\"><p class=\"ac-lesson-kicker\">" + escapeHtml(pick(track.title, lang)) + " · " + escapeHtml(t.unitOfTotal(route.index + 1, track.units.length)) + "</p><h1>" + escapeHtml(pick(unit.title, lang)) + "</h1><p class=\"ac-lesson-summary\">" + escapeHtml(pick(unit.understand[0], lang)) + "</p><div class=\"ac-lesson-meta\"><span class=\"mui-badge\">" + escapeHtml(pick(track.level, lang)) + "</span><span class=\"mui-badge mui-badge--secondary\">" + unit.durationMinutes + " min</span>" + (complete ? "<span class=\"mui-badge mui-badge--success\">" + escapeHtml(t.assessmentPassed) + "</span>" : "") + "</div></header>";
    var objectivesMarkup = "<section class=\"ac-objectives mui-not-prose\" aria-labelledby=\"objectivesTitle\"><h2 id=\"objectivesTitle\">" + escapeHtml(t.objectivesHeading) + "</h2><ul>" + objectives + "</ul></section>";
    var understandMarkup = "<section class=\"ac-phase\" id=\"entender\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">1</span>" + escapeHtml(t.phaseUnderstand) + "</h2>" + body + "</section>";
    var seeMarkup = "<section class=\"ac-phase\" id=\"ver\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">2</span>" + escapeHtml(t.phaseSee) + "</h2><div class=\"mui-callout mui-callout--note mui-not-prose\" role=\"note\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">↗</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(pick(unit.see.label, lang)) + "</p><p class=\"mui-callout__body\">" + escapeHtml(pick(unit.see.note, lang)) + "</p><div class=\"ac-action-row\"><a class=\"mui-btn mui-btn--primary mui-btn--sm\" href=\"" + escapeHtml(unit.see.href) + "\">" + escapeHtml(t.openArtifactButton) + "</a></div></div></div></section>";
    var doMarkup = "<section class=\"ac-phase\" id=\"hacer\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">3</span>" + escapeHtml(t.phaseDo) + "</h2><p>" + escapeHtml(t.doIntro) + "</p>" + terminalMarkup(unit.do.commands) + "<div class=\"ac-action-row mui-not-prose\"><a class=\"mui-btn mui-btn--secondary\" href=\"" + escapeHtml(unit.do.href) + "\">" + escapeHtml(pick(unit.do.label, lang)) + "</a></div></section>";
    var verifyMarkup = "<section class=\"ac-phase\" id=\"verificar\"><h2><span class=\"ac-phase-index\" aria-hidden=\"true\">4</span>" + escapeHtml(t.phaseVerify) + "</h2><p>" + escapeHtml(t.verifyIntro) + "</p><div class=\"ac-rubric mui-not-prose\"><p>" + escapeHtml(t.rubricTitle) + "</p><ul>" + rubric + "</ul></div>" + assessmentMarkup + "</section>";
    var sourcesMarkup = "<section class=\"ac-sources\" id=\"fuentes\"><h2>" + escapeHtml(t.sourcesHeading) + "</h2><ul>" + sources + "</ul><p class=\"ac-verified\">" + escapeHtml(t.verifiedPrefix) + escapeHtml(unit.lastVerified) + "</p></section>";

    lessonRoot.innerHTML = breadcrumbs + "<details class=\"mui-docs__toc-inline ac-mobile-toc\"><summary>" + escapeHtml(t.onThisPage) + "</summary>" + toc + "</details><article class=\"mui-prose\">" + header + objectivesMarkup + understandMarkup + seeMarkup + doMarkup + verifyMarkup + sourcesMarkup + "</article>" + pagerMarkup(track, route.index);
    asideRoot.innerHTML = "<div class=\"ac-aside-block\"><p class=\"ac-aside-title\">" + escapeHtml(t.onThisPage) + "</p>" + toc + "</div><div class=\"ac-aside-block\"><p class=\"ac-aside-title\">" + escapeHtml(t.routeProgressTitle) + "</p>" + progressMarkup(trackProgress(track, state), t.progressInLabel(pick(track.title, lang))) + "<p class=\"ac-aside-copy\">" + escapeHtml(t.unitsOfTotal(progress.countCompleted(state, unitsForTrack(track)), track.units.length)) + "</p></div>";
    document.title = pick(unit.title, lang) + t.titleSuffix;

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
      submitButton.textContent = t.submitGrade;
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
      var result = quizEngine.gradeQuiz(quiz, responses, lang);
      if (result.answered < result.total) {
        result.results.filter(function (item) { return item.selected === null; }).forEach(function (item) {
          var fieldset = fieldsetFor(item.questionId);
          var error = fieldset.querySelector("[data-question-error]");
          fieldset.setAttribute("aria-describedby", error.id);
          fieldset.querySelectorAll(".mui-radio").forEach(function (radio) { radio.setAttribute("aria-invalid", "true"); });
          error.hidden = false;
        });
        resultRoot.innerHTML = "<div class=\"mui-callout mui-callout--warning\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(t.incompleteTitle) + "</p><p class=\"mui-callout__body\">" + escapeHtml(t.incompleteBody(result.total)) + "</p></div></div>";
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
        feedback.innerHTML = "<strong>" + (item.correct ? escapeHtml(t.correctLabel) : escapeHtml(t.incorrectLabel)) + "</strong><p>" + escapeInline(item.explanation) + "</p>";
        feedback.hidden = false;
      });

      if (result.passed) {
        retakeUnits.delete(key);
        render();
        document.getElementById("verificar").scrollIntoView({ block: "start" });
        return;
      }

      updateNavigation(route);
      form.querySelector(".ac-quiz-head .mui-badge").textContent = recorded.attempts + " " + t.attemptsPluralWord;
      submitButton.textContent = t.regradeButton;
      var failedTitle = recorded.passed ? t.failedTitleRepeat : t.failedTitleFirst;
      var failedBody = t.failedBody(result.score, result.total, recorded.passed);
      resultRoot.innerHTML = "<div class=\"mui-callout mui-callout--danger\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(failedTitle) + "</p><p class=\"mui-callout__body\">" + escapeHtml(failedBody) + "</p></div></div>";
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
    themeButton.textContent = selected === "dark" ? t.themeDark : t.themeLight;
    themeButton.setAttribute("aria-label", t.themeAriaSwitch(selected === "dark" ? "light" : "dark"));
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

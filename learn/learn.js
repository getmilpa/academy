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
     academy.js. learn.js ya NO construye el DOM de la unidad: el SSG sirve la
     lección y el quiz completos (ver scripts/gen/learn.mjs) y las páginas
     navegan con enlaces <a href> reales, no con #hash. learn.js sólo HIDRATA
     sobre ese DOM el progreso guardado en este navegador —estado del nav,
     barras de progreso, calificación del quiz y el callout de aprobado— que el
     SSG no puede conocer. La tabla STRINGS se conserva completa como contrato
     de wording que el generador refleja (tests/i18n-contract la protege contra
     drift); el contenido del currículo y los quizzes ya viene {es,en} y se
     resuelve con pick(), no con STRINGS. */
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
  var mobileNavRoot = document.getElementById("mobileCourseNav");
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

  function unitsForTrack(track) {
    return track.units.map(function (unit) { return Object.assign({ trackId: track.id }, unit); });
  }

  function trackProgress(track, state) {
    return progress.percent(state, unitsForTrack(track));
  }

  // El callout de "evaluación aprobada" se sigue generando en runtime: refleja
  // el progreso guardado en este navegador, que el SSG no conoce. Usa STRINGS/
  // pick como el resto del rendering de resultados.
  function passedAssessmentMarkup(assessment) {
    return "<div class=\"mui-callout mui-callout--tip ac-quiz-passed mui-not-prose\" role=\"status\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">✓</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(t.assessmentPassed) + "</p><p class=\"mui-callout__body\">" + escapeHtml(t.passedBody(assessment.bestScore, assessment.total, assessment.attempts)) + "</p><div class=\"ac-action-row\"><button class=\"mui-btn mui-btn--ghost mui-btn--sm\" id=\"retakeQuiz\" type=\"button\">" + escapeHtml(t.retakeButton) + "</button></div></div></div>";
  }

  // Actualiza una barra mui-progress ya servida por el SSG (no la reconstruye):
  // sólo mueve aria-valuenow y el ancho del relleno.
  function setBar(bar, value) {
    if (!bar) return;
    bar.setAttribute("aria-valuenow", value);
    var fill = bar.querySelector(".mui-progress__bar");
    if (fill) fill.style.width = value + "%";
  }

  // Hidrata el estado del nav servido: marca ✓/· en cada unidad y refresca el
  // contador global. No reconstruye el nav (lo sirve el SSG con enlaces reales).
  function updateNavigation() {
    var state = store.read();
    Array.prototype.forEach.call(document.querySelectorAll(".ac-nav-unit"), function (link) {
      var key = link.getAttribute("data-unit-key");
      var status = link.querySelector("[data-unit-status]");
      if (!key || !status) return;
      var done = state.completed[key] === true;
      var label = done ? t.statusDone : t.statusPending;
      status.textContent = done ? "✓" : "·";
      status.setAttribute("aria-label", label);
      status.setAttribute("title", label);
    });
    if (globalProgress) {
      var all = catalog.allUnits();
      globalProgress.textContent = progress.countCompleted(state, all) + "/" + all.length;
    }
  }

  // Barra + copy de progreso de ruta del aside de una unidad.
  function updateTrackAside(trackId) {
    var track = catalog.getTrack(trackId);
    if (!track) return;
    var state = store.read();
    setBar(document.querySelector("[data-track-progress=\"" + trackId + "\"]"), trackProgress(track, state));
    var copy = document.querySelector("[data-track-progress-copy=\"" + trackId + "\"]");
    if (copy) copy.textContent = t.unitsOfTotal(progress.countCompleted(state, unitsForTrack(track)), track.units.length);
  }

  /* ---- Hidratación de la página de unidad ---------------------------------
     El SSG ya sirvió la lección completa y el quiz estático (novalidate). Acá
     sólo: marca la visita, hidrata nav y barra de ruta, y cablea la
     calificación del quiz sobre el <form id="lessonQuiz"> servido. */
  function hydrateUnit(article) {
    var key = article.getAttribute("data-unit");
    if (!key) return;
    store.visit(key);
    updateNavigation();
    updateTrackAside(key.split("/")[0]);
    wireQuiz(key);
  }

  function wireQuiz(key) {
    var form = document.getElementById("lessonQuiz");
    if (!form) return;
    var quiz = quizBank.get(key);
    if (!quiz) return; // sin banco no hay calificación; el form estático queda visible
    quizEngine.validateQuiz(quiz);

    var resultRoot = document.getElementById("quizResult");
    var submitButton = form.querySelector("button[type=\"submit\"]");
    var attemptsBadge = form.querySelector(".ac-quiz-head .mui-badge");
    var stored = store.read().assessments[key] || null;
    // Reflejar los intentos reales en el badge servido (que arranca en 0).
    if (attemptsBadge && stored) attemptsBadge.textContent = t.attemptsBadge(stored.attempts);

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

    function onChange(event) {
      var fieldset = event.target.closest("[data-question-id]");
      if (fieldset) clearQuestionState(fieldset);
      resultRoot.innerHTML = "";
      submitButton.textContent = t.submitGrade;
    }

    function onSubmit(event) {
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

      updateNavigation();
      updateTrackAside(key.split("/")[0]);

      if (result.passed) {
        form.removeEventListener("change", onChange);
        form.removeEventListener("submit", onSubmit);
        showPassed(recorded);
        var verificar = document.getElementById("verificar");
        if (verificar) verificar.scrollIntoView({ block: "start" });
        return;
      }

      if (attemptsBadge) attemptsBadge.textContent = recorded.attempts + " " + t.attemptsPluralWord;
      submitButton.textContent = t.regradeButton;
      var failedTitle = recorded.passed ? t.failedTitleRepeat : t.failedTitleFirst;
      var failedBody = t.failedBody(result.score, result.total, recorded.passed);
      resultRoot.innerHTML = "<div class=\"mui-callout mui-callout--danger\" role=\"alert\"><span class=\"mui-callout__icon\" aria-hidden=\"true\">!</span><div class=\"mui-callout__content\"><p class=\"mui-callout__title\">" + escapeHtml(failedTitle) + "</p><p class=\"mui-callout__body\">" + escapeHtml(failedBody) + "</p></div></div>";
      resultRoot.focus();
    }

    function bindForm() {
      form.addEventListener("change", onChange);
      form.addEventListener("submit", onSubmit);
    }

    // Estado aprobado: inserta el callout runtime y oculta el form servido.
    // "Reintentar" vuelve a mostrar el form servido y recablea la calificación.
    function showPassed(assessment) {
      var holder = document.createElement("div");
      holder.innerHTML = passedAssessmentMarkup(assessment);
      var callout = holder.firstChild;
      form.parentNode.insertBefore(callout, form);
      form.style.display = "none";
      var retake = callout.querySelector("#retakeQuiz");
      if (retake) {
        retake.addEventListener("click", function () {
          if (callout.parentNode) callout.parentNode.removeChild(callout);
          form.style.display = "";
          bindForm();
        });
      }
    }

    if (store.read().completed[key] === true && stored) showPassed(stored);
    else bindForm();
  }

  /* ---- Hidratación de la learn-index (dashboard) --------------------------
     Repinta #globalProgress, el badge de aprobadas, la barra de progreso total
     y, por track, la barra + copy + porcentaje de las tarjetas servidas. */
  function paintIndex() {
    updateNavigation();
    var state = store.read();
    var all = catalog.allUnits();
    var done = progress.countCompleted(state, all);
    var passedBadge = document.querySelector("[data-passed-badge]");
    if (passedBadge) passedBadge.textContent = t.passedBadge(done);
    setBar(document.querySelector("[data-total-progress]"), progress.percent(state, all));
    var totalCopy = document.querySelector("[data-total-progress-copy]");
    if (totalCopy) totalCopy.textContent = t.totalProgressCopy(done, all.length);
    catalog.tracks.forEach(function (track) {
      var value = trackProgress(track, state);
      var completed = progress.countCompleted(state, unitsForTrack(track));
      setBar(document.querySelector("[data-track-progress=\"" + track.id + "\"]"), value);
      var units = document.querySelector("[data-track-units=\"" + track.id + "\"]");
      if (units) units.textContent = t.unitsOfTotal(completed, track.units.length);
      var percent = document.querySelector("[data-track-percent=\"" + track.id + "\"]");
      if (percent) percent.textContent = value + "%";
    });
  }

  function hydrateIndex() {
    paintIndex();
    var reset = document.getElementById("resetProgress");
    if (reset) {
      reset.addEventListener("click", function () {
        if (!window.confirm(t.resetProgressConfirm)) return;
        store.reset();
        paintIndex();
      });
    }
  }

  /* Enrutado por el DOM servido (ya no por #hash): una página de unidad trae
     <article data-unit>; la learn-index trae los hooks del dashboard. El shell
     legado learn/index.html no trae ninguno → sólo refresca el contador global
     sin fallar (defensivo). */
  function hydrate() {
    var article = document.querySelector("article[data-unit]");
    if (article) {
      hydrateUnit(article);
      return;
    }
    if (document.querySelector("[data-total-progress]") || document.querySelector(".ac-track-card[data-track]")) {
      hydrateIndex();
      return;
    }
    updateNavigation();
  }

  function setTheme(theme) {
    var selected = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = selected;
    if (themeButton) {
      themeButton.textContent = selected === "dark" ? t.themeDark : t.themeLight;
      themeButton.setAttribute("aria-label", t.themeAriaSwitch(selected === "dark" ? "light" : "dark"));
    }
    try { window.localStorage.setItem("milpa-academy-theme", selected); } catch (error) { return; }
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      menu.showModal();
      menuToggle.setAttribute("aria-expanded", "true");
    });
    menu.addEventListener("close", function () {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    });
    menu.addEventListener("click", function (event) { if (event.target === menu) menu.close(); });
  }
  if (menuClose && menu) menuClose.addEventListener("click", function () { menu.close(); });
  if (mobileNavRoot && menu) mobileNavRoot.addEventListener("click", function (event) { if (event.target.closest("a")) menu.close(); });
  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-section]");
    if (!link) return;
    var section = document.getElementById(link.dataset.section);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  if (themeButton) themeButton.addEventListener("click", function () { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); });

  var savedTheme = "dark";
  try { savedTheme = window.localStorage.getItem("milpa-academy-theme") || "dark"; } catch (error) { savedTheme = "dark"; }
  setTheme(savedTheme);
  hydrate();
})();

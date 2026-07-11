/* Single source of the learn UI chrome strings ({es,en}).

   Both consumers read THIS table, so it can never drift:
     - learn/learn.js (bare IIFE): reads window.MilpaLearnStrings and hydrates
       progress chrome on top of the served DOM.
     - scripts/gen/learn.mjs (Node SSG): createRequire()s this file and renders
       the same wording into the static per-unit + learn-index pages.

   Classic UMD, mirroring learn/i18n.js and analytics.js: exposes both
   root.MilpaLearnStrings (browser global) and module.exports (Node require).
   Chrome text only — the curriculum/quiz copy is bilingual in the catalog and
   resolved with i18n.pick(), never from here. Values are contract wording;
   tests/i18n-contract.test.mjs walks this module for es/en completeness. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaLearnStrings = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return {
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
});

/* SSG per-unit + learn-index generators for Milpa Academy (bilingual).

   Emits the static, no-JS-required surface of the learning app:
     - site/learn/<track>/<unit>/index.html        (es, 4 levels deep)
     - site/en/learn/<track>/<unit>/index.html      (en, 5 levels deep)
     - site/learn/index.html                        (es learn index, 2 deep)
     - site/en/learn/index.html                     (en learn index, 3 deep)

   The full lesson (objectives, Entender/Ver/Hacer/Verificar, Fuentes) and the
   graded quiz render WITHOUT JavaScript in both languages; learn.js only
   hydrates progress on top of this DOM (Task 7). Determinism is the golden
   rule of this generator: no Date/Math.random, stable catalog ordering, byte
   identical output across regenerations.

   The markup mirrors learn/learn.js (quizMarkup/tocMarkup/renderLesson/
   renderDashboard) so it is styled by learn.css and so Task 7's hydration
   consumes an identical structure. The only deltas versus the client-rendered
   markup are the hydration hooks documented in the Task 6 report:
     - <article class="mui-prose" data-unit="<track>/<unit>">
     - <form id="lessonQuiz" data-unit-key="<track>/<unit>">
     - #courseNav unit links carry data-unit-key + a data-unit-status span
     - #courseAside / dashboard progress bars carry data-track-progress hooks
   and links point at real per-unit PAGES (not "#track/unit" hashes).

   UI chrome text is the same wording as learn.js's STRINGS table (mirrored
   below as LEARN_STRINGS — learn.js is a bare IIFE that touches document at
   load, so it cannot be imported into Node; a shared single-source module is
   deferred to Task 7). The shell chrome (skip link, menu, theme, section nav)
   is single-sourced from PORTAL.chrome/PORTAL.nav. */

import { createRequire } from "node:module";
import { renderHead, htmlOpen } from "./page.mjs";
import { PORTAL } from "../../content/portal.content.mjs";

const require = createRequire(import.meta.url);
const catalog = require("../../curriculum/catalog.js");
const quizBank = require("../../curriculum/quiz-bank.js");
require("../../curriculum/quizzes-fundamentos.js");
require("../../curriculum/quizzes-arquitectura.js");
const inlineCode = require("../../inline-code.js");

const LANGS = ["es", "en"];

/* Mirror of learn/learn.js STRINGS (both languages). Kept byte-faithful to
   the client wording; tests/i18n-contract.test.mjs guards the load-bearing
   chrome strings against drift between learn.js and this table. */
const LEARN_STRINGS = {
  es: {
    allRoutesLink: "Todas las rutas",
    statusDone: "Completada",
    statusPending: "Pendiente",
    mobileAcademyHeading: "Academy",
    navLabs: "Laboratorios",
    navArtifacts: "Artifacts",
    navWebinar: "Webinar",
    dashboardKicker: function (version) { return "Currículo público · v" + version; },
    dashboardH1: "Aprende la arquitectura haciéndola visible",
    dashboardLede: "Elige una ruta. Cada unidad conecta una explicación breve, un artifact, una práctica y una evaluación calificable con la fuente primaria.",
    unitsBadge: function (count) { return count + " unidades"; },
    passedBadge: function (count) { return count + " aprobadas"; },
    validatedProgressBadge: "progreso validado",
    unitsOfTotal: function (completed, total) { return completed + " de " + total + " unidades"; },
    progressInLabel: function (trackTitle) { return "Progreso en " + trackTitle; },
    tracksHeading: "Rutas públicas",
    privateContextTitle: "Academy pública, contexto privado separado",
    privateContextBody: "TeamX puede añadir un catálogo interno durante su propio deploy. El pack privado no se publica ni se esconde dentro de este bundle.",
    resetProgressButton: "Reiniciar progreso",
    totalProgressTitle: "Progreso total",
    totalProgressCopy: function (completed, total) { return completed + " de " + total + " unidades aprobadas"; },
    methodTitle: "Método",
    methodCopy: "Entender → Ver → Hacer → Evaluar.",
    dashboardTitle: "Aprender · Milpa Academy",
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
    questionIndex: function (index, total) { return "Pregunta " + index + " de " + total; },
    questionError: "Selecciona una respuesta antes de calificar.",
    quizEyebrow: "Evaluación calificable",
    quizIntro: function (count, passScore) { return "Resuelve los " + count + " escenarios. Esta unidad exige " + passScore + " de " + count + " respuestas correctas."; },
    attemptsBadge: function (attempts) { return attempts + " intento" + (attempts === 1 ? "" : "s"); },
    submitGrade: "Calificar evaluación",
    gradingNote: "La calificación valida respuestas en este navegador; no certifica identidad.",
    breadcrumbsAriaLabel: "Migas de pan",
    breadcrumbRoutes: "Rutas",
    unitOfTotal: function (index, total) { return "Unidad " + index + " de " + total; },
    objectivesHeading: "Al terminar podrás",
    openArtifactButton: "Abrir artifact",
    doIntro: "Ejecuta la práctica en tu checkout y conserva la salida como evidencia.",
    verifyIntro: "Demuestra que puedes aplicar la unidad. El progreso solo avanza al aprobar la evaluación.",
    rubricTitle: "Criterios evaluados",
    sourcesHeading: "Fuentes primarias",
    verifiedPrefix: "Contenido verificado: ",
    routeProgressTitle: "Progreso de la ruta"
  },
  en: {
    allRoutesLink: "All routes",
    statusDone: "Completed",
    statusPending: "Pending",
    mobileAcademyHeading: "Academy",
    navLabs: "Labs",
    navArtifacts: "Artifacts",
    navWebinar: "Webinar",
    dashboardKicker: function (version) { return "Public curriculum · v" + version; },
    dashboardH1: "Learn the architecture by making it visible",
    dashboardLede: "Choose a track. Each unit connects a short explanation, an artifact, a hands-on practice, and a graded assessment with the primary source.",
    unitsBadge: function (count) { return count + " units"; },
    passedBadge: function (count) { return count + " passed"; },
    validatedProgressBadge: "validated progress",
    unitsOfTotal: function (completed, total) { return completed + " of " + total + " units"; },
    progressInLabel: function (trackTitle) { return "Progress in " + trackTitle; },
    tracksHeading: "Public tracks",
    privateContextTitle: "Public academy, private context kept separate",
    privateContextBody: "TeamX can add an internal catalog during its own deploy. The private pack is never published or hidden inside this bundle.",
    resetProgressButton: "Reset progress",
    totalProgressTitle: "Total progress",
    totalProgressCopy: function (completed, total) { return completed + " of " + total + " units passed"; },
    methodTitle: "Method",
    methodCopy: "Understand → See → Do → Assess.",
    dashboardTitle: "Learn · Milpa Academy",
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
    questionIndex: function (index, total) { return "Question " + index + " of " + total; },
    questionError: "Select an answer before grading.",
    quizEyebrow: "Graded assessment",
    quizIntro: function (count, passScore) { return "Solve the " + count + " scenarios. This unit requires " + passScore + " of " + count + " correct answers."; },
    attemptsBadge: function (attempts) { return attempts + " attempt" + (attempts === 1 ? "" : "s"); },
    submitGrade: "Grade assessment",
    gradingNote: "Grading validates answers in this browser; it doesn't certify identity.",
    breadcrumbsAriaLabel: "Breadcrumb",
    breadcrumbRoutes: "Routes",
    unitOfTotal: function (index, total) { return "Unit " + index + " of " + total; },
    objectivesHeading: "By the end, you'll be able to",
    openArtifactButton: "Open artifact",
    doIntro: "Run the practice in your checkout and keep the output as evidence.",
    verifyIntro: "Show that you can apply the unit. Progress only advances once you pass the assessment.",
    rubricTitle: "Criteria assessed",
    sourcesHeading: "Primary sources",
    verifiedPrefix: "Content verified: ",
    routeProgressTitle: "Track progress"
  }
};

/* Chrome strings that are neither in learn.js STRINGS nor in PORTAL.chrome
   (learn/index.html carried them as static Spanish). */
const CHROME = {
  themeToggleAria: { es: "Cambiar tema", en: "Change theme" },
  asideAria: { es: "Contexto de la lección", en: "Lesson context" }
};

function pick(node, lang) {
  if (node && typeof node === "object" && ("es" in node || "en" in node)) {
    return node[lang === "en" ? "en" : "es"];
  }
  return node;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
  });
}

/* Same as learn.js escapeInline: escape per code-span token so `código`
   backticks become <code> and static/hydrated output match byte for byte. */
function escapeInline(text) {
  return inlineCode.splitCodeSpans(text).map(function (token) {
    return token.code ? "<code>" + escapeHtml(token.text) + "</code>" : escapeHtml(token.text);
  }).join("");
}

function minutes(value) {
  return value >= 60 ? Math.round(value / 60 * 10) / 10 + " h" : value + " min";
}

/* Enough "../" to climb from a page back to the tree root that build-deploy
   maps to "/" (it collapses any run of ../ to /). Unit pages sit 4 (es) / 5
   (en) levels deep; the learn index sits 2 (es) / 3 (en). */
function rootPrefixFor(lang, kind) {
  const depth = kind === "unit" ? (lang === "es" ? 4 : 5) : (lang === "es" ? 2 : 3);
  return "../".repeat(depth);
}

/* Root-relative deploy paths (no leading slash) prefixed by rootPrefix. The
   en surface lives under /en/; shared root assets (curriculum/, analytics.js,
   learn/learn.js, labs/, artifacts/) are language-agnostic. */
function learnIndexRel(lang) { return lang === "es" ? "learn/" : "en/learn/"; }
function unitRel(lang, trackId, unitId) {
  return (lang === "es" ? "learn/" : "en/learn/") + trackId + "/" + unitId + "/";
}
function portalHomeHref(lang, rootPrefix) { return lang === "es" ? rootPrefix : rootPrefix + "en/"; }

const BASE_URL = { fn: null };
function unitUrl(lang, trackId, unitId) {
  return BASE_URL.fn + (lang === "es" ? "/learn/" : "/en/learn/") + trackId + "/" + unitId + "/";
}
function indexUrl(lang) {
  return BASE_URL.fn + (lang === "es" ? "/learn/" : "/en/learn/");
}

function outUnitPath(lang, trackId, unitId) {
  return (lang === "es" ? "site/learn/" : "site/en/learn/") + trackId + "/" + unitId + "/index.html";
}
function outIndexPath(lang) {
  return lang === "es" ? "site/learn/index.html" : "site/en/learn/index.html";
}

/* ---- shared fragments -------------------------------------------------- */

function extraHead(lang, rootPrefix, pageType, gtagBootstrap) {
  return [
    `<link rel="icon" href="${rootPrefix}assets/milpa-app-icon.svg" type="image/svg+xml">`,
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&amp;family=Space+Mono:wght@400;700&amp;display=swap" rel="stylesheet">',
    `<link rel="stylesheet" href="${rootPrefix}learn/learn.css">`,
    gtagBootstrap(lang, pageType),
    `<script src="${rootPrefix}analytics.js" defer></script>`
  ].join("\n");
}

function scripts(rootPrefix) {
  return [
    "curriculum/catalog.js",
    "curriculum/quiz-bank.js",
    "curriculum/quizzes-fundamentos.js",
    "curriculum/quizzes-arquitectura.js",
    "curriculum/quiz-engine.js",
    "curriculum/progress.js",
    "inline-code.js",
    "i18n.js",
    "learn/learn.js"
  ].map(function (src) { return '  <script src="' + rootPrefix + src + '"></script>'; }).join("\n");
}

function progressMarkup(value, label, extraAttr) {
  return '<div class="mui-progress" role="progressbar"' + (extraAttr ? " " + extraAttr : "")
    + ' aria-label="' + escapeHtml(label) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + value
    + '"><div class="mui-progress__bar" style="width:' + value + '%"></div></div>';
}

function tocMarkup(t) {
  return '<nav class="mui-toc" aria-label="' + escapeHtml(t.onThisPage) + '"><ul class="mui-toc__list">'
    + '<li class="mui-toc__item"><a class="mui-toc__link" data-section="entender" href="#entender">' + escapeHtml(t.phaseUnderstand) + '</a></li>'
    + '<li class="mui-toc__item"><a class="mui-toc__link" data-section="ver" href="#ver">' + escapeHtml(t.phaseSee) + '</a></li>'
    + '<li class="mui-toc__item"><a class="mui-toc__link" data-section="hacer" href="#hacer">' + escapeHtml(t.phaseDo) + '</a></li>'
    + '<li class="mui-toc__item"><a class="mui-toc__link" data-section="verificar" href="#verificar">' + escapeHtml(t.phaseVerify) + '</a></li>'
    + '<li class="mui-toc__item"><a class="mui-toc__link" data-section="fuentes" href="#fuentes">' + escapeHtml(t.tocSources) + '</a></li>'
    + '</ul></nav>';
}

function navMarkup(lang, rootPrefix, currentKey, mobile) {
  const t = LEARN_STRINGS[lang];
  let html = '<div class="mui-docs__nav-group ac-nav-home"><a class="mui-docs__nav-item" href="'
    + rootPrefix + learnIndexRel(lang) + '"' + (currentKey === null ? ' aria-current="page"' : "") + ">"
    + escapeHtml(t.allRoutesLink) + "</a></div>";
  catalog.tracks.forEach(function (track) {
    html += '<div class="mui-docs__nav-group"><p class="mui-docs__nav-heading">' + escapeHtml(pick(track.title, lang)) + "</p>";
    track.units.forEach(function (unit) {
      const key = track.id + "/" + unit.id;
      const current = key === currentKey;
      const statusLabel = t.statusPending;
      html += '<a class="mui-docs__nav-item ac-nav-unit" href="' + rootPrefix + unitRel(lang, track.id, unit.id)
        + '" data-unit-key="' + escapeHtml(key) + '"' + (current ? ' aria-current="page"' : "")
        + "><span>" + escapeHtml(pick(unit.title, lang)) + '</span><span class="ac-nav-status" data-unit-status aria-label="'
        + escapeHtml(statusLabel) + '" title="' + escapeHtml(statusLabel) + '">·</span></a>';
    });
    html += "</div>";
  });
  if (mobile) {
    html = '<div class="mui-docs__nav-group"><p class="mui-docs__nav-heading">' + escapeHtml(t.mobileAcademyHeading)
      + '</p><a class="mui-docs__nav-item" href="' + rootPrefix + 'labs/">' + escapeHtml(t.navLabs)
      + '</a><a class="mui-docs__nav-item" href="' + rootPrefix + 'artifacts/">' + escapeHtml(t.navArtifacts)
      + '</a><a class="mui-docs__nav-item" href="' + rootPrefix + 'webinars/">' + escapeHtml(t.navWebinar) + "</a></div>" + html;
  }
  return html;
}

function terminalMarkup(t, commands) {
  if (!commands.length) return "";
  return '<div class="mui-terminal ac-terminal mui-not-prose" aria-label="' + escapeHtml(t.terminalAriaLabel)
    + '"><div class="mui-terminal__bar"><span>terminal</span></div><div class="mui-terminal__body" role="region" aria-label="'
    + escapeHtml(t.terminalRegionAriaLabel) + '" tabindex="0">'
    + commands.map(function (command) {
      return '<div class="mui-terminal__line"><span class="mui-terminal__prompt">$</span><span>' + escapeHtml(command) + "</span></div>";
    }).join("") + "</div></div>";
}

function quizMarkup(lang, unitKey, quiz) {
  const t = LEARN_STRINGS[lang];
  const passScore = quiz.passScore || quiz.questions.length;
  const attempts = 0;
  const questions = quiz.questions.map(function (question, questionIndex) {
    const inputName = "quiz-" + unitKey.replace("/", "-") + "-" + question.id;
    const errorId = "quiz-error-" + question.id;
    const feedbackId = "quiz-feedback-" + question.id;
    const options = question.options.map(function (option) {
      return '<label class="mui-choice ac-quiz-option"><input class="mui-radio" type="radio" name="' + escapeHtml(inputName)
        + '" value="' + escapeHtml(option.id) + '"><span class="mui-choice__text">' + escapeInline(pick(option.text, lang)) + "</span></label>";
    }).join("");
    return '<fieldset class="mui-field ac-quiz-question" data-question-id="' + escapeHtml(question.id)
      + '"><legend class="mui-field__label ac-quiz-prompt"><span class="ac-quiz-index">'
      + escapeHtml(t.questionIndex(questionIndex + 1, quiz.questions.length)) + "</span><span>"
      + escapeInline(pick(question.prompt, lang)) + '</span></legend><div class="ac-quiz-options">' + options
      + '</div><p class="mui-field__error" id="' + errorId + '" data-question-error hidden>' + escapeHtml(t.questionError)
      + '</p><div class="ac-quiz-feedback" id="' + feedbackId + '" data-question-feedback hidden></div></fieldset>';
  }).join("");

  return '<form class="ac-quiz mui-not-prose" id="lessonQuiz" data-unit-key="' + escapeHtml(unitKey)
    + '" novalidate><div class="ac-quiz-head"><div><p class="ac-quiz-eyebrow">' + escapeHtml(t.quizEyebrow)
    + '</p><p class="ac-quiz-copy">' + escapeHtml(t.quizIntro(quiz.questions.length, passScore))
    + '</p></div><span class="mui-badge">' + escapeHtml(t.attemptsBadge(attempts)) + '</span></div><div class="ac-quiz-questions">'
    + questions + '</div><div class="ac-quiz-actions"><button class="mui-btn mui-btn--primary" type="submit">'
    + escapeHtml(t.submitGrade) + "</button><p>" + escapeHtml(t.gradingNote)
    + '</p></div><div class="ac-quiz-result" id="quizResult" role="status" aria-live="polite" tabindex="-1"></div></form>';
}

/* ---- lesson (unit) ----------------------------------------------------- */

function lessonMarkup(lang, rootPrefix, track, unit, index, quiz) {
  const t = LEARN_STRINGS[lang];
  const key = track.id + "/" + unit.id;
  const body = unit.understand.map(function (p) { return "<p>" + escapeHtml(pick(p, lang)) + "</p>"; }).join("");
  const objectives = unit.objectives.map(function (o) { return "<li>" + escapeHtml(pick(o, lang)) + "</li>"; }).join("");
  const rubric = unit.verify.map(function (c) { return "<li>" + escapeHtml(pick(c, lang)) + "</li>"; }).join("");
  const sources = unit.sources.map(function (s) {
    return '<li><a href="' + escapeHtml(s.href) + '">' + escapeHtml(pick(s.label, lang)) + "</a></li>";
  }).join("");
  const toc = tocMarkup(t);

  const breadcrumbs = '<nav class="mui-breadcrumbs" aria-label="' + escapeHtml(t.breadcrumbsAriaLabel)
    + '"><ol class="mui-breadcrumbs__list"><li class="mui-breadcrumbs__item"><a class="mui-breadcrumbs__link" href="'
    + rootPrefix + learnIndexRel(lang) + '">' + escapeHtml(t.breadcrumbRoutes)
    + '</a></li><li class="mui-breadcrumbs__item"><span aria-current="page">' + escapeHtml(pick(track.title, lang)) + "</span></li></ol></nav>";

  const header = '<header class="ac-lesson-header mui-not-prose"><p class="ac-lesson-kicker">'
    + escapeHtml(pick(track.title, lang)) + " · " + escapeHtml(t.unitOfTotal(index + 1, track.units.length))
    + "</p><h1>" + escapeHtml(pick(unit.title, lang)) + '</h1><p class="ac-lesson-summary">'
    + escapeHtml(pick(unit.understand[0], lang)) + '</p><div class="ac-lesson-meta"><span class="mui-badge">'
    + escapeHtml(pick(track.level, lang)) + '</span><span class="mui-badge mui-badge--secondary">'
    + unit.durationMinutes + " min</span></div></header>";

  const objectivesMarkup = '<section class="ac-objectives mui-not-prose" aria-labelledby="objectivesTitle"><h2 id="objectivesTitle">'
    + escapeHtml(t.objectivesHeading) + "</h2><ul>" + objectives + "</ul></section>";

  const understandMarkup = '<section class="ac-phase" id="entender"><h2><span class="ac-phase-index" aria-hidden="true">1</span>'
    + escapeHtml(t.phaseUnderstand) + "</h2>" + body + "</section>";

  const seeMarkup = '<section class="ac-phase" id="ver"><h2><span class="ac-phase-index" aria-hidden="true">2</span>'
    + escapeHtml(t.phaseSee) + '</h2><div class="mui-callout mui-callout--note mui-not-prose" role="note"><span class="mui-callout__icon" aria-hidden="true">↗</span><div class="mui-callout__content"><p class="mui-callout__title">'
    + escapeHtml(pick(unit.see.label, lang)) + '</p><p class="mui-callout__body">' + escapeHtml(pick(unit.see.note, lang))
    + '</p><div class="ac-action-row"><a class="mui-btn mui-btn--primary mui-btn--sm" href="' + escapeHtml(unit.see.href)
    + '">' + escapeHtml(t.openArtifactButton) + "</a></div></div></div></section>";

  const doMarkup = '<section class="ac-phase" id="hacer"><h2><span class="ac-phase-index" aria-hidden="true">3</span>'
    + escapeHtml(t.phaseDo) + "</h2><p>" + escapeHtml(t.doIntro) + "</p>" + terminalMarkup(t, unit.do.commands)
    + '<div class="ac-action-row mui-not-prose"><a class="mui-btn mui-btn--secondary" href="' + escapeHtml(unit.do.href)
    + '">' + escapeHtml(pick(unit.do.label, lang)) + "</a></div></section>";

  const verifyMarkup = '<section class="ac-phase" id="verificar"><h2><span class="ac-phase-index" aria-hidden="true">4</span>'
    + escapeHtml(t.phaseVerify) + "</h2><p>" + escapeHtml(t.verifyIntro) + '</p><div class="ac-rubric mui-not-prose"><p>'
    + escapeHtml(t.rubricTitle) + "</p><ul>" + rubric + "</ul></div>" + quizMarkup(lang, key, quiz) + "</section>";

  const sourcesMarkup = '<section class="ac-sources" id="fuentes"><h2>' + escapeHtml(t.sourcesHeading) + "</h2><ul>"
    + sources + '</ul><p class="ac-verified">' + escapeHtml(t.verifiedPrefix) + escapeHtml(unit.lastVerified) + "</p></section>";

  return breadcrumbs
    + '<details class="mui-docs__toc-inline ac-mobile-toc"><summary>' + escapeHtml(t.onThisPage) + "</summary>" + toc + "</details>"
    + '<article class="mui-prose" data-unit="' + escapeHtml(key) + '">'
    + header + objectivesMarkup + understandMarkup + seeMarkup + doMarkup + verifyMarkup + sourcesMarkup
    + "</article>"
    + pagerMarkup(lang, rootPrefix, track, index);
}

function pagerMarkup(lang, rootPrefix, track, index) {
  const t = LEARN_STRINGS[lang];
  const previous = index > 0 ? track.units[index - 1] : null;
  const next = index < track.units.length - 1 ? track.units[index + 1] : null;
  let html = '<nav class="mui-pager" aria-label="' + escapeHtml(t.pagerAriaLabel) + '">';
  if (previous) {
    html += '<a class="mui-pager__link" href="' + rootPrefix + unitRel(lang, track.id, previous.id)
      + '"><span class="mui-pager__dir">' + escapeHtml(t.pagerPrev) + '</span><span class="mui-pager__title">'
      + escapeHtml(pick(previous.title, lang)) + "</span></a>";
  }
  if (next) {
    html += '<a class="mui-pager__link mui-pager__link--next" href="' + rootPrefix + unitRel(lang, track.id, next.id)
      + '"><span class="mui-pager__dir">' + escapeHtml(t.pagerNext) + '</span><span class="mui-pager__title">'
      + escapeHtml(pick(next.title, lang)) + "</span></a>";
  }
  return html + "</nav>";
}

function unitAside(lang, track) {
  const t = LEARN_STRINGS[lang];
  const total = track.units.length;
  return '<div class="ac-aside-block"><p class="ac-aside-title">' + escapeHtml(t.onThisPage) + "</p>" + tocMarkup(t) + "</div>"
    + '<div class="ac-aside-block"><p class="ac-aside-title">' + escapeHtml(t.routeProgressTitle) + "</p>"
    + progressMarkup(0, t.progressInLabel(pick(track.title, lang)), 'data-track-progress="' + escapeHtml(track.id) + '"')
    + '<p class="ac-aside-copy" data-track-progress-copy="' + escapeHtml(track.id) + '">' + escapeHtml(t.unitsOfTotal(0, total)) + "</p></div>";
}

/* ---- dashboard (learn index) ------------------------------------------ */

function dashboardMarkup(lang, rootPrefix) {
  const t = LEARN_STRINGS[lang];
  const all = catalog.allUnits();
  const cards = catalog.tracks.map(function (track) {
    const value = 0;
    const completed = 0;
    const firstPending = track.units[0];
    return '<a class="mui-card mui-card--interactive ac-track-card" href="' + rootPrefix + unitRel(lang, track.id, firstPending.id)
      + '" data-track="' + escapeHtml(track.id) + '"><div class="mui-card__body"><p class="mui-section__kicker">'
      + escapeHtml(pick(track.eyebrow, lang)) + "</p><h2>" + escapeHtml(pick(track.title, lang)) + "</h2><p>"
      + escapeHtml(pick(track.summary, lang)) + '</p><div class="ac-track-meta"><span class="mui-badge">'
      + escapeHtml(pick(track.level, lang)) + '</span><span class="mui-badge mui-badge--secondary">'
      + escapeHtml(minutes(track.durationMinutes)) + '</span></div><div class="ac-track-progress"><div class="ac-progress-copy"><span data-track-units="'
      + escapeHtml(track.id) + '">' + escapeHtml(t.unitsOfTotal(completed, track.units.length)) + '</span><span data-track-percent="'
      + escapeHtml(track.id) + '">' + value + "%</span></div>"
      + progressMarkup(value, t.progressInLabel(pick(track.title, lang)), 'data-track-progress="' + escapeHtml(track.id) + '"')
      + "</div></div></a>";
  }).join("");

  return '<section class="ac-dashboard-head"><p class="mui-section__kicker">' + escapeHtml(t.dashboardKicker(catalog.version))
    + "</p><h1>" + escapeHtml(t.dashboardH1) + "</h1><p>" + escapeHtml(t.dashboardLede) + '</p><div class="ac-dashboard-meta"><span class="mui-badge mui-badge--accent">'
    + escapeHtml(t.unitsBadge(all.length)) + '</span><span class="mui-badge" data-passed-badge>' + escapeHtml(t.passedBadge(0))
    + '</span><span class="mui-badge mui-badge--secondary">' + escapeHtml(t.validatedProgressBadge) + "</span></div></section>"
    + '<section aria-labelledby="tracksTitle" style="margin-top:var(--space-8)"><h2 id="tracksTitle" class="mui-section__title">'
    + escapeHtml(t.tracksHeading) + '</h2><div class="ac-track-list">' + cards + "</div></section>"
    + '<div class="mui-callout mui-callout--version" role="note" style="margin-top:var(--space-8)"><span class="mui-callout__icon" aria-hidden="true">i</span><div class="mui-callout__content"><p class="mui-callout__title">'
    + escapeHtml(t.privateContextTitle) + '</p><p class="mui-callout__body">' + escapeHtml(t.privateContextBody) + "</p></div></div>"
    + '<div class="ac-reset"><button class="mui-btn mui-btn--ghost mui-btn--sm" id="resetProgress" type="button">'
    + escapeHtml(t.resetProgressButton) + "</button></div>";
}

function dashboardAside(lang) {
  const t = LEARN_STRINGS[lang];
  const all = catalog.allUnits();
  return '<div class="ac-aside-block"><p class="ac-aside-title">' + escapeHtml(t.totalProgressTitle) + "</p>"
    + progressMarkup(0, t.totalProgressTitle, "data-total-progress")
    + '<p class="ac-aside-copy" data-total-progress-copy>' + escapeHtml(t.totalProgressCopy(0, all.length)) + "</p></div>"
    + '<div class="ac-aside-block"><p class="ac-aside-title">' + escapeHtml(t.methodTitle) + '</p><p class="ac-aside-copy">'
    + escapeHtml(t.methodCopy) + "</p></div>";
}

/* ---- shell + document -------------------------------------------------- */

function documentHtml(lang, rootPrefix, headHtml, parts) {
  const t = LEARN_STRINGS[lang];
  const total = catalog.allUnits().length;
  return htmlOpen(lang) + "\n" + headHtml + "\n" + [
    '<body class="mui-page">',
    '  <a class="mui-shell__skip" href="#main">' + escapeHtml(pick(PORTAL.chrome.skipLink, lang)) + "</a>",
    "",
    '  <header class="mui-docs__topbar">',
    '    <button class="mui-btn mui-btn--ghost mui-btn--sm mui-docs__nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="courseMenu">' + escapeHtml(pick(PORTAL.chrome.menuToggle, lang)) + "</button>",
    '    <a class="mui-docs__brand" href="' + portalHomeHref(lang, rootPrefix) + '">',
    '      <img class="ac-brand-mark" src="' + rootPrefix + 'assets/milpa-symbol-color.svg" width="22" height="22" alt="">',
    "      <span>" + escapeHtml(t.mobileAcademyHeading) + "</span>",
    "    </a>",
    '    <nav class="mui-docs__topbar-nav" aria-label="' + escapeHtml(pick(PORTAL.chrome.sectionsAriaLabel, lang)) + '">',
    '      <a class="mui-btn mui-btn--ghost mui-btn--sm" href="' + rootPrefix + learnIndexRel(lang) + '">' + escapeHtml(pick(PORTAL.nav.learn, lang)) + "</a>",
    '      <a class="mui-btn mui-btn--ghost mui-btn--sm" href="' + rootPrefix + 'labs/">' + escapeHtml(pick(PORTAL.nav.labs, lang)) + "</a>",
    '      <a class="mui-btn mui-btn--ghost mui-btn--sm" href="' + rootPrefix + 'artifacts/">' + escapeHtml(pick(PORTAL.nav.artifacts, lang)) + "</a>",
    '      <a class="mui-btn mui-btn--ghost mui-btn--sm" href="' + rootPrefix + 'webinars/">' + escapeHtml(t.navWebinar) + "</a>",
    "    </nav>",
    '    <div class="mui-docs__topbar-actions">',
    '      <span class="mui-badge ac-progress-badge" id="globalProgress">0/' + total + "</span>",
    '      <button class="mui-btn mui-btn--ghost mui-btn--sm" id="themeBtn" type="button" aria-label="' + escapeHtml(pick(CHROME.themeToggleAria, lang)) + '">' + escapeHtml(pick(PORTAL.chrome.themeBtn, lang)) + "</button>",
    "    </div>",
    "  </header>",
    "",
    '  <dialog class="mui-drawer mui-drawer--start" id="courseMenu" aria-labelledby="courseMenuTitle">',
    '    <header class="mui-drawer__header">',
    '      <h2 class="mui-drawer__title" id="courseMenuTitle">' + escapeHtml(t.breadcrumbRoutes) + "</h2>",
    '      <button class="mui-btn mui-btn--ghost mui-btn--sm" id="navClose" type="button">' + escapeHtml(pick(PORTAL.chrome.menuClose, lang)) + "</button>",
    "    </header>",
    '    <div class="mui-drawer__body">',
    '      <nav id="mobileCourseNav" aria-label="' + escapeHtml(pick(PORTAL.routes.title, lang)) + '">' + parts.mobileNavHtml + "</nav>",
    "    </div>",
    "  </dialog>",
    "",
    '  <div class="mui-docs">',
    '    <nav class="mui-docs__nav" id="courseNav" aria-label="' + escapeHtml(pick(PORTAL.routes.title, lang)) + '">' + parts.navHtml + "</nav>",
    '    <main class="mui-docs__main" id="main" tabindex="-1">',
    '      <div id="lesson" aria-live="polite">' + parts.lessonHtml + "</div>",
    "    </main>",
    '    <aside class="mui-docs__aside" id="courseAside" aria-label="' + escapeHtml(pick(CHROME.asideAria, lang)) + '">' + parts.asideHtml + "</aside>",
    "  </div>",
    "",
    scripts(rootPrefix),
    "</body>",
    "</html>",
    ""
  ].join("\n");
}

/* ---- page builders ----------------------------------------------------- */

function unitJsonLd(lang, track, unit) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    inLanguage: lang,
    name: pick(unit.title, lang),
    description: pick(unit.understand[0], lang),
    learningResourceType: "lesson",
    timeRequired: "PT" + unit.durationMinutes + "M",
    about: pick(track.title, lang),
    isBasedOn: unit.sources.map(function (s) { return s.href; })
  });
}

function learnIndexJsonLd(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: lang,
    name: pick(PORTAL.routes.title, lang),
    description: LEARN_STRINGS[lang].dashboardLede,
    itemListElement: catalog.tracks.map(function (track, i) {
      return { "@type": "ListItem", position: i + 1, name: pick(track.title, lang) };
    })
  });
}

function unitPage(lang, track, unit, index, quiz, gtagBootstrap) {
  const rootPrefix = rootPrefixFor(lang, "unit");
  const headHtml = renderHead({
    lang,
    title: escapeHtml(pick(unit.title, lang)) + " · Milpa",
    description: escapeHtml(pick(unit.understand[0], lang)),
    canonical: unitUrl(lang, track.id, unit.id),
    alternates: {
      es: unitUrl("es", track.id, unit.id),
      en: unitUrl("en", track.id, unit.id),
      "x-default": unitUrl("es", track.id, unit.id)
    },
    jsonld: unitJsonLd(lang, track, unit),
    extraHead: extraHead(lang, rootPrefix, "unit", gtagBootstrap)
  });
  const key = track.id + "/" + unit.id;
  return documentHtml(lang, rootPrefix, headHtml, {
    navHtml: navMarkup(lang, rootPrefix, key, false),
    mobileNavHtml: navMarkup(lang, rootPrefix, key, true),
    lessonHtml: lessonMarkup(lang, rootPrefix, track, unit, index, quiz),
    asideHtml: unitAside(lang, track)
  });
}

function learnIndexPage(lang, gtagBootstrap) {
  const rootPrefix = rootPrefixFor(lang, "index");
  const t = LEARN_STRINGS[lang];
  const headHtml = renderHead({
    lang,
    title: escapeHtml(t.dashboardTitle),
    description: escapeHtml(t.dashboardLede),
    canonical: indexUrl(lang),
    alternates: { es: indexUrl("es"), en: indexUrl("en"), "x-default": indexUrl("es") },
    jsonld: learnIndexJsonLd(lang),
    extraHead: extraHead(lang, rootPrefix, "learn", gtagBootstrap)
  });
  return documentHtml(lang, rootPrefix, headHtml, {
    navHtml: navMarkup(lang, rootPrefix, null, false),
    mobileNavHtml: navMarkup(lang, rootPrefix, null, true),
    lessonHtml: dashboardMarkup(lang, rootPrefix),
    asideHtml: dashboardAside(lang)
  });
}

/* buildLearnPages: single deterministic entry point for gen-site.mjs.
   Returns the emitted pages plus sitemap {es,en} entries (learn index first,
   then units in catalog order) and per-language llms.txt link records. */
export function buildLearnPages({ BASE, gtagBootstrap }) {
  BASE_URL.fn = BASE;

  const pages = [];
  const sitemapPages = [{ es: indexUrl("es"), en: indexUrl("en") }];
  const llms = {
    es: [{ label: pick(PORTAL.nav.learn, "es"), url: indexUrl("es"), note: LEARN_STRINGS.es.dashboardLede }],
    en: [{ label: pick(PORTAL.nav.learn, "en"), url: indexUrl("en"), note: LEARN_STRINGS.en.dashboardLede }]
  };

  for (const lang of LANGS) {
    pages.push({ path: outIndexPath(lang), html: learnIndexPage(lang, gtagBootstrap) });
  }

  catalog.tracks.forEach(function (track) {
    track.units.forEach(function (unit, index) {
      const key = track.id + "/" + unit.id;
      const quiz = quizBank.get(key);
      if (!quiz) throw new Error("gen-learn: missing quiz for unit " + key);
      for (const lang of LANGS) {
        pages.push({ path: outUnitPath(lang, track.id, unit.id), html: unitPage(lang, track, unit, index, quiz, gtagBootstrap) });
      }
      sitemapPages.push({ es: unitUrl("es", track.id, unit.id), en: unitUrl("en", track.id, unit.id) });
      for (const lang of LANGS) {
        llms[lang].push({ label: pick(unit.title, lang), url: unitUrl(lang, track.id, unit.id), note: pick(track.title, lang) });
      }
    });
  });

  return { pages, sitemapPages, llms };
}

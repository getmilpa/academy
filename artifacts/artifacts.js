(() => {
"use strict";
/* Script clásico: la lógica pura llega por globalThis.AcademyCore
   (artifacts-core.js, cargado antes con defer) — así la galería funciona
   también bajo file://, donde los módulos ES no cargan (CORS). */
const {
  CHAOS_MODULES,
  MODULE_CATALOG,
  RUNTIME_STAGES,
  SURFACES,
  availableCapabilities,
  conceptualPipelineResult,
  createGenerationPlan,
  decideVerification,
  evaluatePlanting,
  evaluateThemePair,
  projectOperation,
  projectProcess,
  resolveModuleOrder,
  runtimeTrace,
} = globalThis.AcademyCore;

// Idioma real (Task 4, mismo patrón que labs/labs.js): artifacts.js es un
// script clásico (sin import/export) que no carga i18n.js, así que deriva el
// idioma directo de document.documentElement.lang — igual que analytics.js. El
// shell legado sirve <html lang="es-MX">; el shell SSG (Task 5) servirá
// "es-MX" | "en".
const lang = (document.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es";

// pick() resuelve un nodo {es,en} (prosa de artifacts-core.js: MODULE_CATALOG,
// CHAOS_MODULES, RUNTIME_STAGES, y boundaryNodes de este archivo) al idioma
// activo, y deja pasar strings planos sin tocar. Si un shell futuro carga
// i18n.js antes que artifacts.js, prefiere MilpaI18n.pick (fuente única).
function pick(node) {
  if (globalThis.MilpaI18n && typeof globalThis.MilpaI18n.pick === "function") return globalThis.MilpaI18n.pick(node, lang);
  if (node && typeof node === "object" && ("es" in node || "en" in node)) return node[lang];
  return node;
}

// GA4 de la galería (Task 4): artifacts.js corre con `defer`, igual que
// analytics.js. En el shell legado analytics.js NO se carga: trackEvent() no-opea
// para siempre — nunca rompe la galería. En el shell SSG (Task 5) analytics.js
// será defer y precederá a artifacts.js, así que MilpaAnalytics ya estará
// definido. Guardado con try/catch: la telemetría nunca debe romper la UX.
// Nombre `trackEvent` (no `track`): dentro de runConceptualPipeline hay un
// `const track` local (el nodo DOM del carril) que lo sombrearía — el rename
// elimina esa trampa latente.
function trackEvent(name, params) {
  if (!window.MilpaAnalytics) return;
  try { window.MilpaAnalytics.track(name, params); } catch { /* telemetry must never break UX */ }
}

// Códigos de etapa del runtime auditados explícitamente en ToolRegistry::call()
// (espejo UI del set de artifacts-core.js: runtimeTrace()). Se usa sólo para
// elegir la variante del alert y el texto de cobertura localizado, sin leer la
// prosa que devuelve el core — la lógica del core queda intacta.
const AUDITED_FAILURES = new Set(["validation", "authorization", "rate-limit", "execution"]);

// Chrome runtime de la galería + traducción de la prosa neutra que devuelven
// las funciones puras del core (conceptualPipelineResult.reason,
// projectProcess.state/verification, runtimeTrace.auditCoverage,
// decideVerification.reason). El core NO cambia: sigue devolviendo su prosa es;
// acá se mapea por código (outcome/decision/failure) o por valor con `es`
// idéntico (identidad) y fallback en `en`. es byte-idéntico al literal previo.
const STRINGS = {
  es: {
    navToggleAria: (open) => (open ? "Cerrar navegación" : "Abrir navegación"),
    themeAria: (theme) => `Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`,
    fullscreenAria: (active) => (active ? "Salir de pantalla completa" : "Entrar a pantalla completa"),
    fullscreenTip: (active) => (active ? "Salir de pantalla completa" : "Pantalla completa"),
    contractNone: "nada",
    moduleCardAria: (name, provides, requires) => `Sembrar ${name}. Provee ${provides}. Requiere ${requires}.`,
    chaosCycleNote: (requires) => `ciclo: requiere ${requires}`,
    plantMissingNote: (missing) => `falta: ${missing}`,
    plantWiltedTitle: (name) => `${name} se marchitó`,
    plantWiltedDesc: (missing) => `Falta: ${missing}. Siembra primero quien provee esa capacidad.`,
    plantSproutedTitle: (name) => `${name} germinó`,
    plantSproutedDesc: (caps) => `Ahora el campo provee: ${caps}.`,
    bootNoModules: "no hay módulos sembrados",
    bootCycle: (cycle) => `CICLO VISUAL: ${cycle}`,
    bootMissing: (caps) => `faltan capacidades: ${caps}`,
    bootContractsOk: (count) => `contratos válidos · ${count} módulos`,
    bootModuleLine: (name, provides) => `boot ${name} · provee ${provides}`,
    bootReady: "sistema listo",
    chaosTitle: "El campo no puede arrancar",
    chaosDesc: (modules) => `A requiere B y B requiere A. El resolver real reporta los módulos implicados: ${modules}.`,
    graphWaiting: "esperando módulos…",
    graphReadyTitle: "Campo listo",
    graphReadyDesc: "Selecciona una semilla o arrástrala al campo.",
    pipelineReason: (outcome) => (outcome === "denied" ? "denegado: falta correo:enviar" : "correo enviado"),
    pipelineDeniedAudits: "lo denegado también se registra",
    pipelineDeniedTitle: "Llamada denegada",
    pipelineDeniedDesc: (reason) => `${reason}. Ejecutar no ocurrió; auditar sí registró la denegación.`,
    pipelineOkTitle: "Llamada completada",
    pipelineOkDesc: (caller, reason) => `${caller} atravesó el pipeline compartido: ${reason}.`,
    pipelineOkLog: (caller) => `${caller} · correo enviado · auditado`,
    gateChip: { approved: "aprobada", rejected: "rechazada", waived: "exonerada" },
    locale: "es-MX",
    gateWaitingTitle: "Esperando decisión",
    gateSelfBadge: "self-approval forbidden",
    gateSelfTitle: "Autoaprobación rechazada",
    gateConstructionReason: "el principal que abrió la compuerta no puede resolverla por esa misma ruta",
    gateSelfResult: (reason) => `Rechazado por construcción: ${reason}.`,
    gateDetails: { approved: "méritos verificados", rejected: "riesgo no aceptado", waived: "compuerta exonerada explícitamente · ticket INC-204" },
    gateMachineTitle: (decision) => (decision === "approved" ? "Compuerta abierta" : decision === "rejected" ? "Solicitud detenida" : "Exoneración registrada"),
    gateOutcomeTitle: (decision) => (decision === "approved" ? "Aprobado" : decision === "rejected" ? "Rechazado" : "Waived"),
    gateResult: (title, detail) => `${title}: ${detail}.`,
    auditCount: (count) => `${count} ${count === 1 ? "evento" : "eventos"}`,
    runtimeResultTitle: (outcome) => (outcome === "success" ? "Callback completado" : "Retorno anticipado"),
    runtimeCoverage: (failure) => (failure === "none" ? "tool.executed" : AUDITED_FAILURES.has(failure) ? "ruta auditada explícitamente" : "retorno sin auditoría explícita en ToolRegistry::call()"),
    runtimeResultDesc: (failure, coverage) => `${failure === "none" ? "tool.executed" : failure} · ${coverage}.`,
    runtimeResetTitle: "Selecciona una ruta",
    runtimeResetDesc: "La cobertura de auditoría cambia según el punto de retorno.",
    eventCount: (count) => `${count} eventos`,
    projectionState: (state) => state,
    projectionVerification: (verification) => verification,
    replaySliderAria: (position, total) => `Corte del log: evento ${position} de ${total}`,
    contrastTitle: (passes) => (passes ? "AA pasa" : "AA falla"),
    contrastDesc: (ratio, minimum) => `Contraste efectivo ${ratio}:1 · mínimo ${minimum}:1 para texto normal.`,
    planWaitingFile: "esperando generación",
    planFileCount: (count) => `${count} archivos`,
    planGeneratedLog: (count) => `${count} PlannedFile generados · cero escrituras`,
    planGuardLog: "assertWritable() para todos los targets",
    planWriteLog: (count) => `${count} archivos · directorios asegurados`,
    planWaitingLog: "esperando plan…",
    planFileExists: (file) => `${file} ya existe (usa --force para sobrescribir)`,
  },
  en: {
    navToggleAria: (open) => (open ? "Close navigation" : "Open navigation"),
    themeAria: (theme) => `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
    fullscreenAria: (active) => (active ? "Exit fullscreen" : "Enter fullscreen"),
    fullscreenTip: (active) => (active ? "Exit fullscreen" : "Fullscreen"),
    contractNone: "none",
    moduleCardAria: (name, provides, requires) => `Plant ${name}. Provides ${provides}. Requires ${requires}.`,
    chaosCycleNote: (requires) => `cycle: requires ${requires}`,
    plantMissingNote: (missing) => `missing: ${missing}`,
    plantWiltedTitle: (name) => `${name} wilted`,
    plantWiltedDesc: (missing) => `Missing: ${missing}. Plant whoever provides that capability first.`,
    plantSproutedTitle: (name) => `${name} sprouted`,
    plantSproutedDesc: (caps) => `The field now provides: ${caps}.`,
    bootNoModules: "no modules planted",
    bootCycle: (cycle) => `VISUAL CYCLE: ${cycle}`,
    bootMissing: (caps) => `missing capabilities: ${caps}`,
    bootContractsOk: (count) => `valid contracts · ${count} modules`,
    bootModuleLine: (name, provides) => `boot ${name} · provides ${provides}`,
    bootReady: "system ready",
    chaosTitle: "The field cannot boot",
    chaosDesc: (modules) => `A requires B and B requires A. The real resolver reports the modules involved: ${modules}.`,
    graphWaiting: "waiting for modules…",
    graphReadyTitle: "Field ready",
    graphReadyDesc: "Select a seed or drag it onto the field.",
    pipelineReason: (outcome) => (outcome === "denied" ? "denied: missing correo:enviar" : "email sent"),
    pipelineDeniedAudits: "denials are logged too",
    pipelineDeniedTitle: "Call denied",
    pipelineDeniedDesc: (reason) => `${reason}. Execute didn't happen; audit did log the denial.`,
    pipelineOkTitle: "Call completed",
    pipelineOkDesc: (caller, reason) => `${caller} went through the shared pipeline: ${reason}.`,
    pipelineOkLog: (caller) => `${caller} · email sent · audited`,
    gateChip: { approved: "approved", rejected: "rejected", waived: "waived" },
    locale: "en-US",
    gateWaitingTitle: "Waiting for a decision",
    gateSelfBadge: "self-approval forbidden",
    gateSelfTitle: "Self-approval rejected",
    gateConstructionReason: "the principal who opened the gate cannot resolve it through that same path",
    gateSelfResult: (reason) => `Rejected by construction: ${reason}.`,
    gateDetails: { approved: "merits verified", rejected: "risk not accepted", waived: "gate explicitly waived · ticket INC-204" },
    gateMachineTitle: (decision) => (decision === "approved" ? "Gate open" : decision === "rejected" ? "Request stopped" : "Waiver logged"),
    gateOutcomeTitle: (decision) => (decision === "approved" ? "Approved" : decision === "rejected" ? "Rejected" : "Waived"),
    gateResult: (title, detail) => `${title}: ${detail}.`,
    auditCount: (count) => `${count} ${count === 1 ? "event" : "events"}`,
    runtimeResultTitle: (outcome) => (outcome === "success" ? "Callback completed" : "Early return"),
    runtimeCoverage: (failure) => (failure === "none" ? "tool.executed" : AUDITED_FAILURES.has(failure) ? "explicitly audited route" : "return without explicit audit in ToolRegistry::call()"),
    runtimeResultDesc: (failure, coverage) => `${failure === "none" ? "tool.executed" : failure} · ${coverage}.`,
    runtimeResetTitle: "Select a path",
    runtimeResetDesc: "Audit coverage changes depending on the return point.",
    eventCount: (count) => `${count} events`,
    projectionState: (state) => PROJECTION_STATE_EN[state] ?? state,
    projectionVerification: (verification) => PROJECTION_VERIFICATION_EN[verification] ?? verification,
    replaySliderAria: (position, total) => `Log cut: event ${position} of ${total}`,
    contrastTitle: (passes) => (passes ? "AA passes" : "AA fails"),
    contrastDesc: (ratio, minimum) => `Effective contrast ${ratio}:1 · minimum ${minimum}:1 for normal text.`,
    planWaitingFile: "waiting for generation",
    planFileCount: (count) => `${count} files`,
    planGeneratedLog: (count) => `${count} PlannedFile generated · zero writes`,
    planGuardLog: "assertWritable() for all targets",
    planWriteLog: (count) => `${count} files · directories ensured`,
    planWaitingLog: "waiting for plan…",
    planFileExists: (file) => `${file} already exists (use --force to overwrite)`,
  },
};

// Mapas es→en para la prosa que devuelve projectProcess() (core intacto). En
// `es` se rinde con identidad (byte-idéntico); en `en` se traduce con fallback
// al valor original si el core agregara un estado nuevo (degrada, no rompe).
const PROJECTION_STATE_EN = {
  "sin iniciar": "not started",
  "solicitado": "requested",
  "esperando verificación": "awaiting verification",
  "listo para ejecutar": "ready to execute",
  "detenido": "stopped",
  "ejecutando": "executing",
  "completado": "completed",
  "fallido": "failed",
};
const PROJECTION_VERIFICATION_EN = {
  "ninguna": "none",
  "pendiente": "pending",
  "aprobada": "approved",
  "rechazada": "rejected",
  "exonerada": "waived",
};
const t = STRINGS[lang];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduceMotion.matches ? 1 : ms));

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setAlert(root, variant, title, description) {
  const variants = ["success", "warning", "danger", "info"];
  for (const name of variants) root.classList.remove(`mui-alert--${name}`);
  if (variant) root.classList.add(`mui-alert--${variant}`);

  let icon = $(".mui-alert__icon", root);
  if (!icon) {
    icon = createElement("span", "mui-alert__icon");
    icon.setAttribute("aria-hidden", "true");
    root.prepend(icon);
  }
  icon.textContent = variant === "success" ? "✓" : variant === "danger" ? "!" : variant === "warning" ? "!" : "i";

  let content = $(".mui-alert__content", root);
  if (!content) {
    content = createElement("div", "mui-alert__content");
    root.append(content);
  }
  content.replaceChildren();
  if (title) content.append(createElement("p", "mui-alert__title", title));
  content.append(createElement("p", "mui-alert__desc", description));
}

function appendTerminalLine(root, prompt, output, variant = null) {
  const line = createElement("div", "mui-terminal__line");
  if (variant === "error") line.classList.add("mui-terminal__line--error");
  const promptNode = createElement("span", "mui-terminal__prompt", prompt);
  promptNode.setAttribute("aria-hidden", "true");
  const outputNode = createElement("span", "mui-terminal__out", output);
  line.append(promptNode, outputNode);
  root.append(line);
  root.scrollTop = root.scrollHeight;
  return line;
}

/* Global artifact navigation */
const artifacts = $$('[data-artifact]');
const artifactIds = artifacts.map((section) => section.id);
const shell = $("#app-shell");
const sidebar = $("#artifact-nav");
const navToggle = $("#nav-toggle");
const mobileNav = window.matchMedia("(max-width: 960px)");
let currentArtifactIndex = 0;

function syncSidebarState() {
  const open = shell.classList.contains("mui-shell--nav-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", t.navToggleAria(open));
  if (mobileNav.matches) sidebar.inert = !open;
  else sidebar.inert = false;
}

function closeSidebar({ restoreFocus = false } = {}) {
  shell.classList.remove("mui-shell--nav-open");
  syncSidebarState();
  if (restoreFocus) navToggle.focus();
}

function showArtifact(id, { updateHash = true, focus = false } = {}) {
  const nextIndex = artifactIds.indexOf(id);
  if (nextIndex < 0) return;

  // GA4 (Task 4): un artifact_view por artifact mostrado. Se OMITE el slug
  // "atomo": su <milpa-artifact> ya emite artifact_view {artifact_id:"atomo"}
  // al hidratar (milpa-artifact.js), así que emitirlo acá lo duplicaría.
  if (id !== "atomo") trackEvent("artifact_view", { artifact_id: id });

  currentArtifactIndex = nextIndex;
  artifacts.forEach((section, index) => { section.hidden = index !== nextIndex; });
  $$('[data-artifact-link]').forEach((link) => {
    if (link.dataset.artifactLink === id) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const section = artifacts[nextIndex];
  $("#current-kind").textContent = section.dataset.kind.split(" · ")[0];
  $("#current-title").textContent = $("h1", section).textContent;
  $("#artifact-progress").textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(artifacts.length).padStart(2, "0")}`;
  $("#previous-artifact").disabled = nextIndex === 0;
  $("#next-artifact").disabled = nextIndex === artifacts.length - 1;
  if (updateHash) history.replaceState(null, "", `#${id}`);
  if (focus) {
    $("h1", section).setAttribute("tabindex", "-1");
    $("h1", section).focus({ preventScroll: true });
  }
  $("#main").scrollTop = 0;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    $("#main").scrollTop = 0;
    window.scrollTo(0, 0);
  });
  if (mobileNav.matches) closeSidebar();
}

$$('[data-artifact-link]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.dataset.artifactLink;
    if (!artifactIds.includes(id)) return;
    event.preventDefault();
    showArtifact(id, { focus: true });
  });
});

$("#previous-artifact").addEventListener("click", () => showArtifact(artifactIds[currentArtifactIndex - 1], { focus: true }));
$("#next-artifact").addEventListener("click", () => showArtifact(artifactIds[currentArtifactIndex + 1], { focus: true }));

navToggle.addEventListener("click", () => {
  shell.classList.toggle("mui-shell--nav-open");
  syncSidebarState();
  if (shell.classList.contains("mui-shell--nav-open")) {
    $('[data-artifact-link][aria-current="page"]', sidebar)?.focus();
  }
});

mobileNav.addEventListener("change", syncSidebarState);
window.addEventListener("hashchange", () => showArtifact(location.hash.slice(1), { updateHash: false }));

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;
  const target = event.target;
  const editing = target instanceof HTMLInputElement
    || target instanceof HTMLSelectElement
    || target instanceof HTMLTextAreaElement
    || target?.isContentEditable;

  if (event.key === "Escape" && shell.classList.contains("mui-shell--nav-open")) {
    closeSidebar({ restoreFocus: true });
    return;
  }
  if (editing || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === "ArrowRight" && currentArtifactIndex < artifacts.length - 1) {
    event.preventDefault();
    showArtifact(artifactIds[currentArtifactIndex + 1]);
  }
  if (event.key === "ArrowLeft" && currentArtifactIndex > 0) {
    event.preventDefault();
    showArtifact(artifactIds[currentArtifactIndex - 1]);
  }
});

const themeToggle = $("#theme-toggle");
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", t.themeAria(theme));
  try { localStorage.setItem("milpa-academy-theme", theme); } catch { /* storage may be unavailable on file:// */ }
}

try {
  const savedTheme = localStorage.getItem("milpa-academy-theme");
  if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
} catch { /* use the document default */ }

themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

const fullscreenToggle = $("#fullscreen-toggle");
fullscreenToggle.addEventListener("click", async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});
document.addEventListener("fullscreenchange", () => {
  const active = Boolean(document.fullscreenElement);
  fullscreenToggle.setAttribute("aria-label", t.fullscreenAria(active));
  fullscreenToggle.dataset.tip = t.fullscreenTip(active);
});

/* Artifact 01: dependency graph */
const graphState = { planted: [], chaos: false, runId: 0 };
const modulePalette = $("#module-palette");
const moduleField = $("#module-field");
const modulePlot = $("#module-plot");
const plantingStatus = $("#planting-status");
const bootLog = $("#boot-log");

function moduleContractLine(module) {
  return `+ ${module.provides.join(", ")} · ← ${module.requires.join(", ") || t.contractNone}`;
}

function moduleCard(module) {
  const button = createElement("button", "mui-plot__cell");
  button.type = "button";
  button.draggable = true;
  button.dataset.moduleId = module.id;
  button.setAttribute("aria-grabbed", "false");
  button.setAttribute("aria-label", t.moduleCardAria(pick(module.name), module.provides.join(", "), module.requires.join(", ") || t.contractNone));

  button.append(
    createElement("span", "mui-plot__name", pick(module.name)),
    createElement("span", "mui-plot__contract", moduleContractLine(module)),
    createElement("p", "mui-plot__note", pick(module.description)),
  );
  button.addEventListener("click", () => plantModule(module.id, { focusNext: true }));
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", module.id);
    button.setAttribute("aria-grabbed", "true");
  });
  button.addEventListener("dragend", () => {
    button.setAttribute("aria-grabbed", "false");
    moduleField.removeAttribute("data-drag-over");
  });
  return button;
}

function renderGraph() {
  modulePalette.replaceChildren(...MODULE_CATALOG.map(moduleCard));
  for (const module of graphState.planted) {
    const paletteCard = $(`[data-module-id="${module.id}"]`, modulePalette);
    if (paletteCard) paletteCard.hidden = true;
  }

  const visibleCount = MODULE_CATALOG.filter((module) => !graphState.planted.some((item) => item.id === module.id)).length;
  $("#module-count").textContent = String(visibleCount);
  $$(".mui-plot__cell", modulePlot).forEach((cell) => cell.remove());

  graphState.planted.forEach((module, index) => {
    const cell = createElement("div", "mui-plot__cell");
    cell.append(
      createElement("span", "mui-plot__name", pick(module.name)),
      createElement("span", "mui-plot__contract", moduleContractLine(module)),
    );
    if (module.id.startsWith("chaos-")) {
      cell.dataset.state = "wilted";
      cell.append(createElement("p", "mui-plot__note", t.chaosCycleNote(module.requires.join(", "))));
    } else {
      cell.dataset.state = index === graphState.planted.length - 1 ? "germinating" : "sown";
    }
    modulePlot.append(cell);
  });

  $("#field-empty").hidden = graphState.planted.length > 0;
  $("#capability-list").textContent = availableCapabilities(graphState.planted).join(" · ");
  moduleField.toggleAttribute("data-chaos", graphState.chaos);
}

function plantModule(moduleId, { focusNext = false } = {}) {
  const module = MODULE_CATALOG.find((item) => item.id === moduleId);
  if (!module || graphState.planted.some((item) => item.id === moduleId)) return;

  const evaluation = evaluatePlanting(module, graphState.planted);
  if (!evaluation.accepted) {
    const card = $(`[data-module-id="${moduleId}"]`, modulePalette);
    const note = $(".mui-plot__note", card);
    card.dataset.state = "wilted";
    note.textContent = t.plantMissingNote(evaluation.missing.join(", "));
    window.setTimeout(() => {
      card.removeAttribute("data-state");
      note.textContent = pick(module.description);
    }, reduceMotion.matches ? 1 : 720);
    setAlert(plantingStatus, "danger", t.plantWiltedTitle(pick(module.name)), t.plantWiltedDesc(evaluation.missing.join(", ")));
    return;
  }

  graphState.chaos = false;
  graphState.planted.push(module);
  renderGraph();
  setAlert(plantingStatus, "success", t.plantSproutedTitle(pick(module.name)), t.plantSproutedDesc(availableCapabilities(graphState.planted).join(", ")));
  if (focusNext) {
    const next = $(".mui-plot__cell:not([hidden])", modulePalette) ?? $("#boot-system");
    next.focus();
  }
}

moduleField.addEventListener("dragover", (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  moduleField.dataset.dragOver = "true";
});
moduleField.addEventListener("dragleave", (event) => {
  if (!moduleField.contains(event.relatedTarget)) moduleField.removeAttribute("data-drag-over");
});
moduleField.addEventListener("drop", (event) => {
  event.preventDefault();
  moduleField.removeAttribute("data-drag-over");
  plantModule(event.dataTransfer.getData("text/plain"));
});

async function runBoot() {
  const runId = ++graphState.runId;
  const result = resolveModuleOrder(graphState.planted);
  bootLog.replaceChildren();
  $("#boot-system").setAttribute("aria-busy", "true");

  if (graphState.planted.length === 0) {
    appendTerminalLine(bootLog, "error", t.bootNoModules, "error");
  } else if (!result.ok) {
    const message = result.cycle.length
      ? t.bootCycle(result.cycle.join(" → "))
      : t.bootMissing(result.missing.map((item) => item.capability).join(", "));
    appendTerminalLine(bootLog, "error", message, "error");
  } else {
    appendTerminalLine(bootLog, "kernel", t.bootContractsOk(result.order.length));
    for (const [index, module] of result.order.entries()) {
      if (runId !== graphState.runId) return;
      await delay(360);
      appendTerminalLine(bootLog, String(index + 1).padStart(2, "0"), t.bootModuleLine(pick(module.name), module.provides.join(", ")));
    }
    appendTerminalLine(bootLog, "ok", t.bootReady);
  }

  $("#boot-system").removeAttribute("aria-busy");
}

$("#boot-system").addEventListener("click", runBoot);
$("#chaos-mode").addEventListener("click", () => {
  graphState.runId += 1;
  graphState.chaos = true;
  graphState.planted = [...CHAOS_MODULES];
  const result = resolveModuleOrder(graphState.planted);
  renderGraph();
  bootLog.replaceChildren();
  appendTerminalLine(bootLog, "error", t.bootCycle(result.cycle.join(" → ")), "error");
  setAlert(plantingStatus, "danger", t.chaosTitle, t.chaosDesc(result.cycle.slice(0, -1).join(", ")));
});
$("#reset-graph").addEventListener("click", () => {
  graphState.runId += 1;
  graphState.planted = [];
  graphState.chaos = false;
  renderGraph();
  bootLog.replaceChildren();
  appendTerminalLine(bootLog, "coa", t.graphWaiting);
  setAlert(plantingStatus, null, t.graphReadyTitle, t.graphReadyDesc);
});

/* Artifact 02: one action, two callers */
let pipelineRunId = 0;
async function runConceptualPipeline(caller) {
  const runId = ++pipelineRunId;
  const result = conceptualPipelineResult({ hasPermission: !$("#permission-toggle").checked });
  // La prosa neutra del core (result.reason) se traduce por su código de
  // outcome; en `es` es byte-idéntica al valor que devuelve el core.
  const reason = t.pipelineReason(result.outcome);
  const callerLabel = caller === "agent" ? "agent:mcp" : "human:cli";
  const track = $(".mui-pipeline__track", $("#conceptual-pipeline"));
  const stations = $$(".mui-pipeline__stage", track);
  const callers = $$(".wb-caller");
  callers.forEach((button) => { button.disabled = true; });
  stations.forEach((station) => {
    station.removeAttribute("data-status");
    $(".mui-pipeline__note", station).textContent = "";
  });
  track.style.setProperty("--_pipeline-progress", "0");
  $("#pipeline-log").replaceChildren();
  appendTerminalLine($("#pipeline-log"), "call", `${callerLabel} → enviar_correo`);

  for (const [index, stage] of result.stages.entries()) {
    if (runId !== pipelineRunId) return;
    const station = stations.find((item) => item.dataset.stage === stage.id);
    if (stage.status !== "skipped") {
      station.dataset.status = "active";
      if (!(result.outcome === "denied" && stage.id === "audit")) {
        track.style.setProperty("--_pipeline-progress", String(index / (stations.length - 1)));
      }
      await delay(460);
    }
    station.dataset.status = stage.status;
    if (stage.status === "denied") $(".mui-pipeline__note", station).textContent = reason;
    if (result.outcome === "denied" && stage.id === "audit") {
      $(".mui-pipeline__note", station).textContent = t.pipelineDeniedAudits;
    }
  }

  if (result.outcome === "denied") {
    setAlert($("#pipeline-result"), "danger", t.pipelineDeniedTitle, t.pipelineDeniedDesc(reason));
    appendTerminalLine($("#pipeline-log"), "deny", `${callerLabel} · ${reason}`, "error");
  } else {
    setAlert($("#pipeline-result"), "success", t.pipelineOkTitle, t.pipelineOkDesc(callerLabel, reason));
    appendTerminalLine($("#pipeline-log"), "ok", t.pipelineOkLog(callerLabel));
  }
  callers.forEach((button) => { button.disabled = false; });
}

$$('.wb-caller').forEach((button) => button.addEventListener("click", () => runConceptualPipeline(button.dataset.caller)));

/* Artifact 03: verification gate */
const gateState = { audit: [], status: "pending" };
const gateRoot = $("#gate-root");
const gateAudit = $("#gate-audit");
const GATE_CHIPS = {
  approved: { variant: "success", label: t.gateChip.approved },
  rejected: { variant: "danger", label: t.gateChip.rejected },
  waived: { variant: "warning", label: t.gateChip.waived },
  "self-denied": { variant: "danger", label: t.gateChip.rejected },
};

function gateEntryTime() {
  return new Date().toLocaleTimeString(t.locale, { hour12: false });
}

function resetGate() {
  gateState.status = "pending";
  gateState.audit = [{ event: "verification.requested", actor: "agent:bot-severo", detail: "users:delete · 500 records", time: gateEntryTime() }];
  gateRoot.dataset.status = "pending";
  $("#gate-symbol").dataset.status = "pending";
  $("#gate-status-badge").className = "mui-badge mui-badge--warning";
  $("#gate-status-badge").textContent = "pending";
  $("#gate-machine-title").textContent = t.gateWaitingTitle;
  $$('[data-decision]').forEach((button) => { button.disabled = false; });
  renderGateAudit();
  $("#gate-result").textContent = "";
}

function renderGateAudit() {
  gateAudit.replaceChildren();
  gateState.audit.forEach((entry) => {
    const item = createElement("li", "mui-gate__entry");
    item.append(createElement("span", null, entry.actor));
    if (entry.chip) {
      item.append(createElement("span", `mui-badge mui-badge--${entry.chip.variant}`, entry.chip.label));
    }
    const suffix = entry.detail ? ` · ${entry.detail}` : "";
    item.append(
      createElement("span", null, `${entry.event}${suffix}`),
      createElement("span", "mui-gate__entry-time", entry.time),
    );
    gateAudit.append(item);
  });
  $("#audit-count").textContent = t.auditCount(gateState.audit.length);
}

function applyGateDecision(decision, decider = "member:42") {
  const verdict = decideVerification({ requester: "agent:bot-severo", decider, decision });
  $$('[data-decision]').forEach((button) => { button.disabled = true; });

  if (!verdict.accepted) {
    gateState.status = "self-denied";
    // detail localizado: verdict.reason es la prosa es del core (rama única
    // self-denied); t.gateConstructionReason es byte-idéntica en es y aporta
    // la traducción en en — el audit trail nunca mezcla idiomas.
    gateState.audit.push({ event: "decision.rejected_by_construction", actor: decider, detail: t.gateConstructionReason, chip: GATE_CHIPS["self-denied"], time: gateEntryTime() });
    gateRoot.dataset.status = "self-denied";
    $("#gate-symbol").dataset.status = "self-denied";
    $("#gate-status-badge").className = "mui-badge mui-badge--danger";
    $("#gate-status-badge").textContent = t.gateSelfBadge;
    $("#gate-machine-title").textContent = t.gateSelfTitle;
    // verdict.reason es prosa neutra del core (rama self-denied): se traduce
    // por su rama conocida; en `es` es byte-idéntica al valor del core.
    $("#gate-result").textContent = t.gateSelfResult(t.gateConstructionReason);
    renderGateAudit();
    return;
  }

  gateState.status = decision;
  const details = t.gateDetails;
  gateState.audit.push({ event: `verification.${decision}`, actor: decider, detail: details[decision], chip: GATE_CHIPS[decision], time: gateEntryTime() });
  gateRoot.dataset.status = decision;
  $("#gate-symbol").dataset.status = decision;
  $("#gate-status-badge").className = `mui-badge mui-badge--${decision === "approved" ? "success" : decision === "rejected" ? "danger" : "warning"}`;
  $("#gate-status-badge").textContent = decision;
  $("#gate-machine-title").textContent = t.gateMachineTitle(decision);
  $("#gate-result").textContent = t.gateResult(t.gateOutcomeTitle(decision), details[decision]);
  renderGateAudit();
}

$$('[data-decision]').forEach((button) => button.addEventListener("click", () => applyGateDecision(button.dataset.decision)));
$("#self-approval").addEventListener("click", () => {
  resetGate();
  gateState.audit.push({ event: "decision.attempted", actor: "agent:bot-severo", detail: "approved" });
  applyGateDecision("approved", "agent:bot-severo");
});
$("#reset-gate").addEventListener("click", resetGate);

/* Artifact 04: architecture atlas. La prosa (kind/title/copy/role/deps) viaja
   como {es,en} y se resuelve con pick(); title/deps que son códigos (nombres de
   paquete, listas de deps) quedan planos y neutros. source es siempre una ruta
   de archivo (código), plana. */
const KIND = { host: "host", motor: { es: "motor", en: "engine" }, adaptador: { es: "adaptador", en: "adapter" }, contrato: { es: "contrato", en: "contract" } };
const boundaryNodes = {
  host: { kind: KIND.host, title: { es: "Aplicación", en: "Application" }, copy: { es: "Posee el transporte, autenticación concreta, configuración y efectos de dominio.", en: "Owns transport, concrete authentication, configuration and domain effects." }, role: { es: "composición del producto", en: "product composition" }, deps: { es: "elige adaptadores y motores", en: "chooses adapters and engines" }, source: "host application" },
  runtime: { kind: KIND.motor, title: "runtime", copy: { es: "Compone core, container, events, HTTP y plugin; verifica contratos antes de iniciar módulos.", en: "Composes core, container, events, HTTP and plugin; verifies contracts before starting modules." }, role: { es: "kernel y bootstrap", en: "kernel and bootstrap" }, deps: "core · container · events · http · plugin", source: "getmilpa-runtime/composer.json" },
  "tool-runtime": { kind: KIND.motor, title: "tool-runtime", copy: { es: "Registra tools y ejecuta validación, policy, límites, confirmación, intercepción y auditoría.", en: "Registers tools and runs validation, policy, limits, confirmation, interception and audit." }, role: { es: "ejecución de acciones", en: "action execution" }, deps: "core · psr/log", source: "getmilpa-tool-runtime/composer.json" },
  "mcp-server": { kind: KIND.adaptador, title: "mcp-server", copy: { es: "Convierte JSON-RPC/MCP en llamadas al ToolRegistry sin conocer HTTP, SSE o stdio.", en: "Turns JSON-RPC/MCP into ToolRegistry calls without knowing HTTP, SSE or stdio." }, role: { es: "puerto JSON-RPC", en: "JSON-RPC port" }, deps: "core · events · tool-runtime", source: "mcp-server/src/JsonRpcService.php" },
  orchestrator: { kind: KIND.motor, title: "orchestrator", copy: { es: "Compone procesos event-sourced, gates humanos y tools operables por agentes.", en: "Composes event-sourced processes, human gates and agent-operable tools." }, role: { es: "motor de procesos", en: "process engine" }, deps: "core · event-store · workflow · events · live · tool-runtime", source: "getmilpa-orchestrator/composer.json" },
  workflow: { kind: KIND.contrato, title: "workflow", copy: { es: "Máquinas de estado y gates respaldados por ORM; conecta verificación con el contrato de core.", en: "State machines and gates backed by ORM; connects verification with the core contract." }, role: { es: "estados y gates", en: "states and gates" }, deps: "core · Doctrine ORM", source: "getmilpa-workflow/composer.json" },
  "event-store": { kind: KIND.contrato, title: "event-store", copy: { es: "Primitiva append-only con streams reproducibles, implementaciones JSONL e in-memory.", en: "Append-only primitive with replayable streams, JSONL and in-memory implementations." }, role: { es: "persistencia de hechos", en: "fact persistence" }, deps: { es: "cero paquetes", en: "zero packages" }, source: "event-store/src/EventStoreInterface.php" },
  live: { kind: KIND.contrato, title: "live", copy: { es: "Define componente, estado y handlers sin imponer un target de render concreto.", en: "Defines component, state and handlers without imposing a concrete render target." }, role: { es: "UI server-driven pura", en: "pure server-driven UI" }, deps: "core", source: "live/ComponentDefinitionInterface.php" },
  "live-web": { kind: KIND.adaptador, title: "live-web", copy: { es: "Adapta definiciones live a HTTP y HTML, y emite clases del design system.", en: "Adapts live definitions to HTTP and HTML, and emits design-system classes." }, role: { es: "render web", en: "web render" }, deps: "live · http · @milpa/design", source: "live-web/composer.json" },
  core: { kind: KIND.contrato, title: "core", copy: { es: "Interfaces y value objects framework-agnostic; define formas, no infraestructura concreta.", en: "Framework-agnostic interfaces and value objects; defines shapes, not concrete infrastructure." }, role: { es: "lenguaje compartido", en: "shared language" }, deps: { es: "mínimas", en: "minimal" }, source: "getmilpa-core/src" },
  plugin: { kind: KIND.contrato, title: "plugin", copy: { es: "Manifests de capabilities, resolución provides/requires y orden de Kahn.", en: "Capability manifests, provides/requires resolution and Kahn ordering." }, role: { es: "modularidad", en: "modularity" }, deps: "core", source: "plugin/src/ContractResolver.php" },
  design: { kind: KIND.contrato, title: "@milpa/design", copy: { es: "Publica tokens, motion, primitivas, componentes, artifacts y layouts con contratos JSON.", en: "Publishes tokens, motion, primitives, components, artifacts and layouts with JSON contracts." }, role: { es: "interfaz y gobernanza", en: "interface and governance" }, deps: { es: "sin dependencias runtime", en: "no runtime dependencies" }, source: "milpa-design/package.json" },
};

const boundaryFlows = {
  boot: ["host", "runtime", "plugin", "core"],
  mcp: ["host", "mcp-server", "tool-runtime", "core"],
  process: ["host", "orchestrator", "workflow", "event-store", "tool-runtime", "live", "core"],
  ui: ["host", "live-web", "live", "design"],
};

function inspectBoundary(id) {
  const data = boundaryNodes[id];
  if (!data) return;
  $("#boundary-inspector-kind").textContent = pick(data.kind);
  $("#boundary-inspector-title").textContent = pick(data.title);
  $("#boundary-inspector-copy").textContent = pick(data.copy);
  $("#boundary-role").textContent = pick(data.role);
  $("#boundary-deps").textContent = pick(data.deps);
  $("#boundary-source").textContent = data.source;
}

function activateBoundaryFlow(flow, tab) {
  const activeIds = boundaryFlows[flow];
  $("#boundary-map").dataset.filtering = "true";
  $$(".wb-boundary-node").forEach((node) => { node.dataset.active = String(activeIds.includes(node.dataset.node)); });
  $$("[data-atlas-flow]").forEach((button) => {
    const selected = button === tab;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $("#atlas-panel").setAttribute("aria-labelledby", tab.id);
  inspectBoundary(activeIds.find((id) => id !== "host"));
}

const atlasTabs = $$('[data-atlas-flow]');
atlasTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateBoundaryFlow(tab.dataset.atlasFlow, tab));
  tab.addEventListener("keydown", (event) => {
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % atlasTabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + atlasTabs.length) % atlasTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = atlasTabs.length - 1;
    if (next === null) return;
    event.preventDefault();
    atlasTabs[next].focus();
    activateBoundaryFlow(atlasTabs[next].dataset.atlasFlow, atlasTabs[next]);
  });
});
$$('.wb-boundary-node').forEach((node) => node.addEventListener("click", () => inspectBoundary(node.dataset.node)));

/* Artifact 05: real ToolRegistry pipeline */
let runtimeRunId = 0;
const runtimeTrack = $(".mui-pipeline__track", $("#runtime-rail"));

function renderRuntimeRail() {
  const marker = createElement("span", "mui-pipeline__marker");
  marker.setAttribute("aria-hidden", "true");
  runtimeTrack.replaceChildren(marker);
  runtimeTrack.style.setProperty("--_pipeline-progress", "0");
  RUNTIME_STAGES.forEach((stage) => {
    const item = createElement("div", "mui-pipeline__stage");
    item.dataset.stage = stage.id;
    item.append(
      createElement("span", "mui-pipeline__label", pick(stage.label)),
      createElement("p", "mui-pipeline__note", pick(stage.note)),
    );
    runtimeTrack.append(item);
  });
}

async function runRuntimeTrace() {
  const runId = ++runtimeRunId;
  const failure = $("#runtime-scenario").value;
  const trace = runtimeTrace(failure);
  const items = $$(".mui-pipeline__stage", runtimeTrack);
  $("#run-runtime").setAttribute("aria-busy", "true");
  items.forEach((item) => item.removeAttribute("data-status"));
  runtimeTrack.style.setProperty("--_pipeline-progress", "0");

  for (const [index, stage] of trace.stages.entries()) {
    if (runId !== runtimeRunId) return;
    const item = items.find((node) => node.dataset.stage === stage.id);
    if (stage.status !== "skipped") {
      item.dataset.status = "active";
      runtimeTrack.style.setProperty("--_pipeline-progress", String(index / (items.length - 1)));
      await delay(300);
    }
    item.dataset.status = stage.status;
  }

  // La variante y el texto de cobertura se derivan del código `failure` (no de
  // la prosa que devuelve el core) — el core queda intacto. En `es` el texto es
  // byte-idéntico al valor previo de trace.auditCoverage.
  const uncovered = failure !== "none" && !AUDITED_FAILURES.has(failure);
  setAlert(
    $("#runtime-result"),
    trace.outcome === "success" ? "success" : uncovered ? "warning" : "danger",
    t.runtimeResultTitle(trace.outcome),
    t.runtimeResultDesc(failure, t.runtimeCoverage(failure)),
  );
  $("#run-runtime").removeAttribute("aria-busy");
}

$("#run-runtime").addEventListener("click", runRuntimeTrace);
$("#reset-runtime").addEventListener("click", () => {
  runtimeRunId += 1;
  renderRuntimeRail();
  setAlert($("#runtime-result"), "info", t.runtimeResetTitle, t.runtimeResetDesc);
  $("#run-runtime").removeAttribute("aria-busy");
});

/* Artifact 06: append-only events and projection */
let processEvents = [];
function baseProcessEvents() {
  return [
    { seq: 1, type: "process.requested", actor: "agent:bot-severo", payload: { action: "users.prune" } },
    { seq: 2, type: "verification.requested", actor: "human_verify", payload: { gate: "ops-review" } },
  ];
}

function appendProcessDecision(decision) {
  const mapping = {
    approved: "verification.approved",
    rejected: "verification.rejected",
    waived: "verification.waived",
  };
  processEvents.push({ seq: processEvents.length + 1, type: mapping[decision], actor: "member:42", payload: decision === "waived" ? { reason: "INC-204" } : {} });
  if (decision !== "rejected") {
    processEvents.push({ seq: processEvents.length + 1, type: "execution.started", actor: "orchestrator", payload: {} });
    processEvents.push({ seq: processEvents.length + 1, type: "process.completed", actor: "orchestrator", payload: { affected: 500 } });
  }
  $$('[data-event-decision]').forEach((button) => { button.disabled = true; });
  renderEventStream(true);
}

function renderEventStream(jumpToEnd = false) {
  const stream = $("#event-lines");
  stream.replaceChildren();
  processEvents.forEach((event) => {
    const item = createElement("li", "mui-replay__event");
    const payload = JSON.stringify({ ...event.payload, by: event.actor });
    item.append(
      createElement("span", "mui-replay__type", event.type),
      createElement("span", "mui-replay__actor", event.actor),
      createElement("span", "mui-replay__payload", `seq ${event.seq} · ${payload}`),
    );
    stream.append(item);
  });
  $("#event-count").textContent = t.eventCount(processEvents.length);
  const slider = $("#replay-slider");
  slider.max = String(processEvents.length);
  if (jumpToEnd) slider.value = String(processEvents.length);
  renderProjection();
}

function renderProjection() {
  const position = Number($("#replay-slider").value);
  const projection = projectProcess(processEvents, position);
  $("#projection-position").textContent = `${position} / ${processEvents.length}`;
  // projection.state/verification son prosa neutra del core (projectProcess):
  // en `es` se rinden con identidad (byte-idéntico); en `en` se traducen por
  // mapa con fallback al valor original.
  $("#projection-state").textContent = t.projectionState(projection.state);
  $("#projection-verification").textContent = t.projectionVerification(projection.verification);
  $("#projection-actor").textContent = projection.actor ?? "—";
  $("#replay-slider").setAttribute("aria-label", t.replaySliderAria(position, processEvents.length));

  $$(".mui-replay__event", $("#event-lines")).forEach((item, index) => {
    item.dataset.applied = String(index < position);
    if (position > 0 && index === Math.min(position - 1, processEvents.length - 1)) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
}

function resetEvents() {
  processEvents = baseProcessEvents();
  $$('[data-event-decision]').forEach((button) => { button.disabled = false; });
  $("#replay-slider").value = "2";
  renderEventStream(true);
}

$$('[data-event-decision]').forEach((button) => button.addEventListener("click", () => appendProcessDecision(button.dataset.eventDecision)));
$("#reset-events").addEventListener("click", resetEvents);
$("#replay-slider").addEventListener("input", renderProjection);

/* Artifact 07: executable design contract */
function rgbString(color) { return `rgb(${color.r} ${color.g} ${color.b})`; }
function updateContrastLab() {
  const text = $("#contrast-text").value;
  const surface = $("#contrast-surface").value;
  const background = $("#contrast-bg").value;
  const alpha = Number($("#surface-alpha").value) / 100;
  const result = evaluateThemePair({ text, surface, background, surfaceAlpha: alpha });

  $("#contrast-text-value").textContent = text.toUpperCase();
  $("#contrast-surface-value").textContent = surface.toUpperCase();
  $("#contrast-bg-value").textContent = background.toUpperCase();
  $("#alpha-value").textContent = `${Math.round(alpha * 100)}%`;
  $("#contrast-ratio").textContent = `${result.ratio.toFixed(2)}:1`;
  const preview = $("#composite-preview");
  preview.style.color = text;
  preview.style.backgroundColor = rgbString(result.effectiveSurface);
  setAlert(
    $("#contrast-result"),
    result.passes ? "success" : "danger",
    t.contrastTitle(result.passes),
    t.contrastDesc(result.ratio.toFixed(2), result.minimum.toFixed(1)),
  );
}

$$('#contrast-text, #contrast-surface, #contrast-bg, #surface-alpha').forEach((control) => control.addEventListener("input", updateContrastLab));

/* Artifact 08: plan before disk */
const planState = { plan: null, runId: 0 };

function setPlanStep(id, status = "current") {
  $$('[data-plan-step]').forEach((step) => {
    step.removeAttribute("aria-current");
    step.removeAttribute("data-status");
  });
  const current = $(`[data-plan-step="${id}"]`);
  if (status === "current") current.setAttribute("aria-current", "step");
  else current.dataset.status = status;
}

function renderPlanFiles() {
  const tree = $("#plan-file-tree");
  tree.replaceChildren();
  if (!planState.plan) {
    tree.append(createElement("li", "mui-file-tree__file", t.planWaitingFile));
    $("#planned-file-count").textContent = t.planFileCount(0);
    return;
  }

  planState.plan.files.forEach((file) => {
    const item = createElement("li", "mui-file-tree__file");
    const path = createElement("span", "wb-file-path", file.path);
    const badge = createElement("span", `mui-file-tree__badge ${file.status === "blocked" ? "wb-file-badge--blocked" : "mui-file-tree__badge--new"}`, file.status);
    item.append(path, badge);
    tree.append(item);
  });
  $("#planned-file-count").textContent = t.planFileCount(planState.plan.files.length);
}

function generatePlan() {
  planState.runId += 1;
  planState.plan = createGenerationPlan({ targetExists: $("#target-exists").checked, force: $("#force-write").checked });
  renderPlanFiles();
  $("#plan-diff").hidden = true;
  $("#inspect-plan").disabled = false;
  $("#apply-plan").disabled = false;
  setPlanStep("generate");
  $("#plan-log").replaceChildren();
  appendTerminalLine($("#plan-log"), "plan", t.planGeneratedLog(planState.plan.files.length));
}

function inspectPlan() {
  if (!planState.plan) return;
  $("#plan-diff").hidden = false;
  appendTerminalLine($("#plan-log"), "inspect", `${planState.plan.verifyKind} · ${planState.plan.verifyTarget}`);
}

async function applyPlan() {
  if (!planState.plan) return;
  const runId = ++planState.runId;
  $("#apply-plan").setAttribute("aria-busy", "true");
  setPlanStep("preflight");
  appendTerminalLine($("#plan-log"), "guard", t.planGuardLog);
  await delay(480);
  if (runId !== planState.runId) return;

  if (!planState.plan.writable) {
    setPlanStep("preflight", "failed");
    // El core devuelve plan.reason en inglés (prosa neutra, rama única). En vez
    // de renderizar esa prosa, se localiza acá derivando el filename de la MISMA
    // fuente que usa el core (files[0]) — no se parsea el string inglés.
    appendTerminalLine($("#plan-log"), "error", t.planFileExists(planState.plan.files[0].path), "error");
    $("#apply-plan").removeAttribute("aria-busy");
    return;
  }

  setPlanStep("write");
  appendTerminalLine($("#plan-log"), "write", t.planWriteLog(planState.plan.files.length));
  await delay(480);
  if (runId !== planState.runId) return;
  setPlanStep("verify");
  appendTerminalLine($("#plan-log"), "verify", `${planState.plan.verifyTarget} · PASS`);
  $("#apply-plan").removeAttribute("aria-busy");
}

function resetPlan() {
  planState.runId += 1;
  planState.plan = null;
  renderPlanFiles();
  $("#plan-diff").hidden = true;
  $("#inspect-plan").disabled = true;
  $("#apply-plan").disabled = true;
  $("#apply-plan").removeAttribute("aria-busy");
  setPlanStep("generate");
  $("#plan-log").replaceChildren();
  appendTerminalLine($("#plan-log"), "make", t.planWaitingLog);
}

$("#generate-plan").addEventListener("click", generatePlan);
$("#inspect-plan").addEventListener("click", inspectPlan);
$("#apply-plan").addEventListener("click", applyPlan);
$("#reset-plan").addEventListener("click", resetPlan);
$("#target-exists").addEventListener("change", () => {
  const targetExists = $("#target-exists").checked;
  $("#force-write").disabled = !targetExists;
  if (!targetExists) $("#force-write").checked = false;
  resetPlan();
});
$("#force-write").addEventListener("change", resetPlan);

/* Initial state */
renderGraph();
resetGate();
activateBoundaryFlow("boot", atlasTabs[0]);
renderRuntimeRail();
resetEvents();
updateContrastLab();
$("#force-write").disabled = true;
resetPlan();
syncSidebarState();
showArtifact(artifactIds.includes(location.hash.slice(1)) ? location.hash.slice(1) : artifactIds[0], { updateHash: true });
})();

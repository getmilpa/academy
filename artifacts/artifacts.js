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
  navToggle.setAttribute("aria-label", open ? "Cerrar navegación" : "Abrir navegación");
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
  themeToggle.setAttribute("aria-label", `Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`);
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
  fullscreenToggle.setAttribute("aria-label", active ? "Salir de pantalla completa" : "Entrar a pantalla completa");
  fullscreenToggle.dataset.tip = active ? "Salir de pantalla completa" : "Pantalla completa";
});

/* Artifact 01: dependency graph */
const graphState = { planted: [], chaos: false, runId: 0 };
const modulePalette = $("#module-palette");
const moduleField = $("#module-field");
const modulePlot = $("#module-plot");
const plantingStatus = $("#planting-status");
const bootLog = $("#boot-log");

function moduleContractLine(module) {
  return `+ ${module.provides.join(", ")} · ← ${module.requires.join(", ") || "nada"}`;
}

function moduleCard(module) {
  const button = createElement("button", "mui-plot__cell");
  button.type = "button";
  button.draggable = true;
  button.dataset.moduleId = module.id;
  button.setAttribute("aria-grabbed", "false");
  button.setAttribute("aria-label", `Sembrar ${module.name}. Provee ${module.provides.join(", ")}. Requiere ${module.requires.join(", ") || "nada"}.`);

  button.append(
    createElement("span", "mui-plot__name", module.name),
    createElement("span", "mui-plot__contract", moduleContractLine(module)),
    createElement("p", "mui-plot__note", module.description),
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
      createElement("span", "mui-plot__name", module.name),
      createElement("span", "mui-plot__contract", moduleContractLine(module)),
    );
    if (module.id.startsWith("chaos-")) {
      cell.dataset.state = "wilted";
      cell.append(createElement("p", "mui-plot__note", `ciclo: requiere ${module.requires.join(", ")}`));
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
    note.textContent = `falta: ${evaluation.missing.join(", ")}`;
    window.setTimeout(() => {
      card.removeAttribute("data-state");
      note.textContent = module.description;
    }, reduceMotion.matches ? 1 : 720);
    setAlert(plantingStatus, "danger", `${module.name} se marchitó`, `Falta: ${evaluation.missing.join(", ")}. Siembra primero quien provee esa capacidad.`);
    return;
  }

  graphState.chaos = false;
  graphState.planted.push(module);
  renderGraph();
  setAlert(plantingStatus, "success", `${module.name} germinó`, `Ahora el campo provee: ${availableCapabilities(graphState.planted).join(", ")}.`);
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
    appendTerminalLine(bootLog, "error", "no hay módulos sembrados", "error");
  } else if (!result.ok) {
    const message = result.cycle.length
      ? `CICLO VISUAL: ${result.cycle.join(" → ")}`
      : `faltan capacidades: ${result.missing.map((item) => item.capability).join(", ")}`;
    appendTerminalLine(bootLog, "error", message, "error");
  } else {
    appendTerminalLine(bootLog, "kernel", `contratos válidos · ${result.order.length} módulos`);
    for (const [index, module] of result.order.entries()) {
      if (runId !== graphState.runId) return;
      await delay(360);
      appendTerminalLine(bootLog, String(index + 1).padStart(2, "0"), `boot ${module.name} · provee ${module.provides.join(", ")}`);
    }
    appendTerminalLine(bootLog, "ok", "sistema listo");
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
  appendTerminalLine(bootLog, "error", `CICLO VISUAL: ${result.cycle.join(" → ")}`, "error");
  setAlert(plantingStatus, "danger", "El campo no puede arrancar", `A requiere B y B requiere A. El resolver real reporta los módulos implicados: ${result.cycle.slice(0, -1).join(", ")}.`);
});
$("#reset-graph").addEventListener("click", () => {
  graphState.runId += 1;
  graphState.planted = [];
  graphState.chaos = false;
  renderGraph();
  bootLog.replaceChildren();
  appendTerminalLine(bootLog, "coa", "esperando módulos…");
  setAlert(plantingStatus, null, "Campo listo", "Selecciona una semilla o arrástrala al campo.");
});

/* Artifact 02: one action, two callers */
let pipelineRunId = 0;
async function runConceptualPipeline(caller) {
  const runId = ++pipelineRunId;
  const result = conceptualPipelineResult({ hasPermission: !$("#permission-toggle").checked });
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
    if (stage.status === "denied") $(".mui-pipeline__note", station).textContent = result.reason;
    if (result.outcome === "denied" && stage.id === "audit") {
      $(".mui-pipeline__note", station).textContent = "lo denegado también se registra";
    }
  }

  if (result.outcome === "denied") {
    setAlert($("#pipeline-result"), "danger", "Llamada denegada", `${result.reason}. Ejecutar no ocurrió; auditar sí registró la denegación.`);
    appendTerminalLine($("#pipeline-log"), "deny", `${callerLabel} · ${result.reason}`, "error");
  } else {
    setAlert($("#pipeline-result"), "success", "Llamada completada", `${callerLabel} atravesó el pipeline compartido: ${result.reason}.`);
    appendTerminalLine($("#pipeline-log"), "ok", `${callerLabel} · correo enviado · auditado`);
  }
  callers.forEach((button) => { button.disabled = false; });
}

$$('.wb-caller').forEach((button) => button.addEventListener("click", () => runConceptualPipeline(button.dataset.caller)));

/* Artifact 03: verification gate */
const gateState = { audit: [], status: "pending" };
const gateRoot = $("#gate-root");
const gateAudit = $("#gate-audit");
const GATE_CHIPS = {
  approved: { variant: "success", label: "aprobada" },
  rejected: { variant: "danger", label: "rechazada" },
  waived: { variant: "warning", label: "exonerada" },
  "self-denied": { variant: "danger", label: "rechazada" },
};

function gateEntryTime() {
  return new Date().toLocaleTimeString("es-MX", { hour12: false });
}

function resetGate() {
  gateState.status = "pending";
  gateState.audit = [{ event: "verification.requested", actor: "agent:bot-severo", detail: "users:delete · 500 records", time: gateEntryTime() }];
  gateRoot.dataset.status = "pending";
  $("#gate-symbol").dataset.status = "pending";
  $("#gate-status-badge").className = "mui-badge mui-badge--warning";
  $("#gate-status-badge").textContent = "pending";
  $("#gate-machine-title").textContent = "Esperando decisión";
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
  $("#audit-count").textContent = `${gateState.audit.length} ${gateState.audit.length === 1 ? "evento" : "eventos"}`;
}

function applyGateDecision(decision, decider = "member:42") {
  const verdict = decideVerification({ requester: "agent:bot-severo", decider, decision });
  $$('[data-decision]').forEach((button) => { button.disabled = true; });

  if (!verdict.accepted) {
    gateState.status = "self-denied";
    gateState.audit.push({ event: "decision.rejected_by_construction", actor: decider, detail: verdict.reason, chip: GATE_CHIPS["self-denied"], time: gateEntryTime() });
    gateRoot.dataset.status = "self-denied";
    $("#gate-symbol").dataset.status = "self-denied";
    $("#gate-status-badge").className = "mui-badge mui-badge--danger";
    $("#gate-status-badge").textContent = "self-approval forbidden";
    $("#gate-machine-title").textContent = "Autoaprobación rechazada";
    $("#gate-result").textContent = `Rechazado por construcción: ${verdict.reason}.`;
    renderGateAudit();
    return;
  }

  gateState.status = decision;
  const details = {
    approved: "méritos verificados",
    rejected: "riesgo no aceptado",
    waived: "compuerta exonerada explícitamente · ticket INC-204",
  };
  gateState.audit.push({ event: `verification.${decision}`, actor: decider, detail: details[decision], chip: GATE_CHIPS[decision], time: gateEntryTime() });
  gateRoot.dataset.status = decision;
  $("#gate-symbol").dataset.status = decision;
  $("#gate-status-badge").className = `mui-badge mui-badge--${decision === "approved" ? "success" : decision === "rejected" ? "danger" : "warning"}`;
  $("#gate-status-badge").textContent = decision;
  $("#gate-machine-title").textContent = decision === "approved" ? "Compuerta abierta" : decision === "rejected" ? "Solicitud detenida" : "Exoneración registrada";
  const outcomeTitle = decision === "approved" ? "Aprobado" : decision === "rejected" ? "Rechazado" : "Waived";
  $("#gate-result").textContent = `${outcomeTitle}: ${details[decision]}.`;
  renderGateAudit();
}

$$('[data-decision]').forEach((button) => button.addEventListener("click", () => applyGateDecision(button.dataset.decision)));
$("#self-approval").addEventListener("click", () => {
  resetGate();
  gateState.audit.push({ event: "decision.attempted", actor: "agent:bot-severo", detail: "approved" });
  applyGateDecision("approved", "agent:bot-severo");
});
$("#reset-gate").addEventListener("click", resetGate);

/* Artifact 04: architecture atlas */
const boundaryNodes = {
  host: { kind: "host", title: "Aplicación", copy: "Posee el transporte, autenticación concreta, configuración y efectos de dominio.", role: "composición del producto", deps: "elige adaptadores y motores", source: "host application" },
  runtime: { kind: "motor", title: "runtime", copy: "Compone core, container, events, HTTP y plugin; verifica contratos antes de iniciar módulos.", role: "kernel y bootstrap", deps: "core · container · events · http · plugin", source: "getmilpa-runtime/composer.json" },
  "tool-runtime": { kind: "motor", title: "tool-runtime", copy: "Registra tools y ejecuta validación, policy, límites, confirmación, intercepción y auditoría.", role: "ejecución de acciones", deps: "core · psr/log", source: "getmilpa-tool-runtime/composer.json" },
  "mcp-server": { kind: "adaptador", title: "mcp-server", copy: "Convierte JSON-RPC/MCP en llamadas al ToolRegistry sin conocer HTTP, SSE o stdio.", role: "puerto JSON-RPC", deps: "core · events · tool-runtime", source: "mcp-server/src/JsonRpcService.php" },
  orchestrator: { kind: "motor", title: "orchestrator", copy: "Compone procesos event-sourced, gates humanos y tools operables por agentes.", role: "motor de procesos", deps: "core · event-store · workflow · events · live · tool-runtime", source: "getmilpa-orchestrator/composer.json" },
  workflow: { kind: "contrato", title: "workflow", copy: "Máquinas de estado y gates respaldados por ORM; conecta verificación con el contrato de core.", role: "estados y gates", deps: "core · Doctrine ORM", source: "getmilpa-workflow/composer.json" },
  "event-store": { kind: "contrato", title: "event-store", copy: "Primitiva append-only con streams reproducibles, implementaciones JSONL e in-memory.", role: "persistencia de hechos", deps: "cero paquetes", source: "event-store/src/EventStoreInterface.php" },
  live: { kind: "contrato", title: "live", copy: "Define componente, estado y handlers sin imponer un target de render concreto.", role: "UI server-driven pura", deps: "core", source: "live/ComponentDefinitionInterface.php" },
  "live-web": { kind: "adaptador", title: "live-web", copy: "Adapta definiciones live a HTTP y HTML, y emite clases del design system.", role: "render web", deps: "live · http · @milpa/design", source: "live-web/composer.json" },
  core: { kind: "contrato", title: "core", copy: "Interfaces y value objects framework-agnostic; define formas, no infraestructura concreta.", role: "lenguaje compartido", deps: "mínimas", source: "getmilpa-core/src" },
  plugin: { kind: "contrato", title: "plugin", copy: "Manifests de capabilities, resolución provides/requires y orden de Kahn.", role: "modularidad", deps: "core", source: "plugin/src/ContractResolver.php" },
  design: { kind: "contrato", title: "@milpa/design", copy: "Publica tokens, motion, primitivas, componentes, artifacts y layouts con contratos JSON.", role: "interfaz y gobernanza", deps: "sin dependencias runtime", source: "milpa-design/package.json" },
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
  $("#boundary-inspector-kind").textContent = data.kind;
  $("#boundary-inspector-title").textContent = data.title;
  $("#boundary-inspector-copy").textContent = data.copy;
  $("#boundary-role").textContent = data.role;
  $("#boundary-deps").textContent = data.deps;
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
      createElement("span", "mui-pipeline__label", stage.label),
      createElement("p", "mui-pipeline__note", stage.note),
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

  const uncovered = trace.auditCoverage.includes("sin auditoría");
  setAlert(
    $("#runtime-result"),
    trace.outcome === "success" ? "success" : uncovered ? "warning" : "danger",
    trace.outcome === "success" ? "Callback completado" : "Retorno anticipado",
    `${failure === "none" ? "tool.executed" : failure} · ${trace.auditCoverage}.`,
  );
  $("#run-runtime").removeAttribute("aria-busy");
}

$("#run-runtime").addEventListener("click", runRuntimeTrace);
$("#reset-runtime").addEventListener("click", () => {
  runtimeRunId += 1;
  renderRuntimeRail();
  setAlert($("#runtime-result"), "info", "Selecciona una ruta", "La cobertura de auditoría cambia según el punto de retorno.");
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
  $("#event-count").textContent = `${processEvents.length} eventos`;
  const slider = $("#replay-slider");
  slider.max = String(processEvents.length);
  if (jumpToEnd) slider.value = String(processEvents.length);
  renderProjection();
}

function renderProjection() {
  const position = Number($("#replay-slider").value);
  const projection = projectProcess(processEvents, position);
  $("#projection-position").textContent = `${position} / ${processEvents.length}`;
  $("#projection-state").textContent = projection.state;
  $("#projection-verification").textContent = projection.verification;
  $("#projection-actor").textContent = projection.actor ?? "—";
  $("#replay-slider").setAttribute("aria-label", `Corte del log: evento ${position} de ${processEvents.length}`);

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
    result.passes ? "AA pasa" : "AA falla",
    `Contraste efectivo ${result.ratio.toFixed(2)}:1 · mínimo ${result.minimum.toFixed(1)}:1 para texto normal.`,
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
    tree.append(createElement("li", "mui-file-tree__file", "esperando generación"));
    $("#planned-file-count").textContent = "0 archivos";
    return;
  }

  planState.plan.files.forEach((file) => {
    const item = createElement("li", "mui-file-tree__file");
    const path = createElement("span", "wb-file-path", file.path);
    const badge = createElement("span", `mui-file-tree__badge ${file.status === "blocked" ? "wb-file-badge--blocked" : "mui-file-tree__badge--new"}`, file.status);
    item.append(path, badge);
    tree.append(item);
  });
  $("#planned-file-count").textContent = `${planState.plan.files.length} archivos`;
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
  appendTerminalLine($("#plan-log"), "plan", `${planState.plan.files.length} PlannedFile generados · cero escrituras`);
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
  appendTerminalLine($("#plan-log"), "guard", "assertWritable() para todos los targets");
  await delay(480);
  if (runId !== planState.runId) return;

  if (!planState.plan.writable) {
    setPlanStep("preflight", "failed");
    appendTerminalLine($("#plan-log"), "error", planState.plan.reason, "error");
    $("#apply-plan").removeAttribute("aria-busy");
    return;
  }

  setPlanStep("write");
  appendTerminalLine($("#plan-log"), "write", `${planState.plan.files.length} archivos · directorios asegurados`);
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
  appendTerminalLine($("#plan-log"), "make", "esperando plan…");
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

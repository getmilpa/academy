(() => {
"use strict";
/* Script clásico (sin import/export): lee globalThis.AcademyCore, expuesto por
   artifacts-core.js (cargado antes con defer) — así funciona también bajo
   file://, donde los módulos ES no cargan (CORS).

   Invariante: este elemento HIDRATA contenido estático que ya viaja completo
   en el HTML servido. Nunca usa Shadow DOM, nunca hace innerHTML/replaceChildren
   ni borra hijos existentes — solo agrega listeners y alterna data-status /
   textContent sobre nodos que ya están en el light DOM. Con JS deshabilitado,
   la tarjeta del átomo, las tres pipelines, el toggle, el aviso del hueco de
   auth, la tabla de garantías, la lección y las fuentes siguen siendo
   visibles y legibles. */

const core = globalThis.AcademyCore || {};
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduceMotion.matches ? 1 : ms));

/* projectOperation (artifacts-core.js) es lógica pura y neutra: devuelve
   códigos (reasonCode/scope, noteCode, confirmCode), nunca prosa. Este
   componente conoce el idioma (atributo lang) y es la única capa que
   traduce esos códigos a texto para quien lee la pantalla. */
const STRINGS = {
  es: {
    applied: "aplicada",
    deniedStatus: (scope) => `denegado: falta ${scope} (MCP y HTTP exigen scopes; coa no)`,
    noteDeniedAuthorize: (scope) => `denegado: falta ${scope}`,
    noteDeniedAudit: "lo denegado también se registra",
  },
  en: {
    applied: "applied",
    deniedStatus: (scope) => `denied: missing ${scope} (MCP and HTTP enforce scopes; coa doesn't)`,
    noteDeniedAuthorize: (scope) => `denied: missing ${scope}`,
    noteDeniedAudit: "denials are logged too",
  },
};

/* Artifact 05 (runtime x-ray): prosa de runtime propia de este componente —
   ported from artifacts.js (P2c, relocated not rewritten). AUDITED_FAILURES
   decide sólo la variante del alert y el texto de cobertura localizado; el
   core (runtimeTrace) se queda neutro, nunca devuelve esta prosa. */
const RUNTIME_AUDITED_FAILURES = new Set(["validation", "authorization", "rate-limit", "execution"]);
const RUNTIME_STRINGS = {
  es: {
    resultTitle: (outcome) => (outcome === "success" ? "Callback completado" : "Retorno anticipado"),
    coverage: (failure) => (failure === "none" ? "tool.executed" : RUNTIME_AUDITED_FAILURES.has(failure) ? "ruta auditada explícitamente" : "retorno sin auditoría explícita en ToolRegistry::call()"),
    resultDesc: (failure, coverage) => `${failure === "none" ? "tool.executed" : failure} · ${coverage}.`,
    resetTitle: "Selecciona una ruta",
    resetDesc: "La cobertura de auditoría cambia según el punto de retorno.",
    presence: { active: "Activo", conditional: "Condicional", dormant: "Dormido", skipped: "Omitido" },
  },
  en: {
    resultTitle: (outcome) => (outcome === "success" ? "Callback completed" : "Early return"),
    coverage: (failure) => (failure === "none" ? "tool.executed" : RUNTIME_AUDITED_FAILURES.has(failure) ? "explicitly audited route" : "return without explicit audit in ToolRegistry::call()"),
    resultDesc: (failure, coverage) => `${failure === "none" ? "tool.executed" : failure} · ${coverage}.`,
    resetTitle: "Select a path",
    resetDesc: "Audit coverage changes depending on the return point.",
    presence: { active: "Active", conditional: "Conditional", dormant: "Dormant", skipped: "Skipped" },
  },
};

class MilpaArtifact extends HTMLElement {
  connectedCallback() {
    if (this._hydrated) return;
    this._hydrated = true;
    /* Forward-compat con Learnable Errors (deep-links ?case=…): se lee el
       preset pero se ignora en v1 — la proyección es siempre la default.
       Mantiene la puerta abierta sin construir el ruteo todavía. */
    const preset = this.dataset.case || new URLSearchParams(location.search).get("case") || null;
    const id = this.getAttribute("id") || "";
    if (id === "atomo-artifact") this.#hydrateAtomo(preset);
    else if (id === "runtime-artifact") this.#hydrateRuntime();
  }

  /* Artifact 09: command-as-atom projection. Ported from artifacts.js
     (relocated, not rewritten) — mismo run-logic que ya corrió en producción:
     run-ids por superficie (no un contador compartido), selectores reales del
     markup de la Task 2, y el texto de status con el sufijo "→ aplicada". */
  #hydrateAtomo(_preset) {
    /* GA4 (Task 7): guardado a propósito — este componente se embebe
       cross-origin en los sitios de marketing, que NO cargan analytics.js.
       window.MilpaAnalytics ausente ahí, así que esto queda como no-op puro
       y nunca dispara eventos en el analytics de ese otro sitio. */
    if (window.MilpaAnalytics && window.MilpaAnalytics.track) {
      window.MilpaAnalytics.track("artifact_view", { artifact_id: "atomo" });
    }
    const { projectOperation, SURFACES } = core;
    if (!projectOperation) return; // sin lógica JS disponible → sigue estático, igual de legible
    const root = this;
    const LANG = (root.getAttribute("lang") || "es").slice(0, 2) === "en" ? "en" : "es";
    const strings = STRINGS[LANG];
    const ATOM_OP = Object.freeze({ name: "crear:tarea", mutating: true, requiresConfirmation: true, scopes: ["tarea:crear"] });
    // Run-ids por superficie: cada pipeline solo reemplaza su propia corrida
    // anterior, así las tres proyecciones concurrentes del toggle no se cancelan
    // entre sí (bug de concurrencia ya encontrado y corregido en la Task 2).
    const atomRunIds = { cli: 0, mcp: 0, http: 0 };

    async function runProjection(surface) {
      const runId = ++atomRunIds[surface];
      const scopeGranted = !(root.querySelector("#scope-toggle") || {}).checked;
      const result = projectOperation(ATOM_OP, surface, { scopeGranted });
      const pipeline = root.querySelector(`#pipe-${surface}`);
      const track = pipeline.querySelector(".mui-pipeline__track");
      const stations = [...track.querySelectorAll(".mui-pipeline__stage")];
      const statusLine = root.querySelector(`#status-${surface}`);
      const buttons = [...root.querySelectorAll(".wb-surface")];

      buttons.forEach((button) => { button.disabled = true; });
      stations.forEach((station) => {
        station.removeAttribute("data-status");
        station.querySelector(".mui-pipeline__note").textContent = "";
      });
      track.style.setProperty("--_pipeline-progress", "0");
      statusLine.textContent = "";

      for (const [index, stage] of result.stages.entries()) {
        if (runId !== atomRunIds[surface]) return;
        const station = stations.find((item) => item.dataset.stage === stage.id);
        if (stage.status !== "skipped") {
          station.dataset.status = "active";
          if (!(result.outcome === "denied" && stage.id === "audit")) {
            track.style.setProperty("--_pipeline-progress", String(index / (stations.length - 1)));
          }
          await wait(420);
        }
        station.dataset.status = stage.status;
        if (stage.noteCode === "denied_missing_scope") {
          station.querySelector(".mui-pipeline__note").textContent = strings.noteDeniedAuthorize(result.scope);
        } else if (stage.noteCode === "denied_still_audits") {
          station.querySelector(".mui-pipeline__note").textContent = strings.noteDeniedAudit;
        }
      }

      const label = (SURFACES || []).find((item) => item.id === surface)?.label ?? surface;
      statusLine.textContent = result.outcome === "denied"
        ? `${label}: ${strings.deniedStatus(result.scope)}`
        : `${label}: ${result.invocation} → ${result.outcome === "success" ? strings.applied : result.outcome}`;
      buttons.forEach((button) => { button.disabled = false; });
    }

    root.querySelectorAll(".wb-surface").forEach((button) =>
      button.addEventListener("click", () => {
        if (window.MilpaAnalytics && window.MilpaAnalytics.track) {
          window.MilpaAnalytics.track("artifact_surface_click", { surface: button.dataset.surface });
        }
        runProjection(button.dataset.surface);
      }));
    const toggle = root.querySelector("#scope-toggle");
    if (toggle) {
      toggle.addEventListener("change", () => {
        if (window.MilpaAnalytics && window.MilpaAnalytics.track) {
          window.MilpaAnalytics.track("chaos_toggle", { state: toggle.checked ? "on" : "off" });
        }
        // Re-proyecta las tres puertas para que la asimetría se vea de una.
        (SURFACES || []).forEach((item) => runProjection(item.id));
      });
    }
  }

  /* Artifact 05: runtime x-ray. Ported from artifacts.js (P2c, relocated not
     rewritten) — mismo run-logic que ya corría en producción: el carril de
     Tab A nace vacío y lo puebla esta hidratación (excepción documentada en
     tests/site-contract.test.mjs), Tab B llama a la MISMA invocationPlan()
     que ya computó el HTML servido en build-time (ADR#13, un solo cómputo,
     dos runtimes). */
  #hydrateRuntime() {
    if (window.MilpaAnalytics && window.MilpaAnalytics.track) {
      window.MilpaAnalytics.track("artifact_view", { artifact_id: "runtime" });
    }
    const { RUNTIME_STAGES, DEFAULT_WIRING, invocationPlan, runtimeTrace } = core;
    if (!runtimeTrace || !invocationPlan) return; // sin lógica JS disponible → sigue estático, igual de legible
    const root = this;
    const LANG = (root.getAttribute("lang") || "es").slice(0, 2) === "en" ? "en" : "es";
    const rt = RUNTIME_STRINGS[LANG];
    // pick() resuelve un nodo {es,en} de artifacts-core.js (RUNTIME_STAGES.
    // label/note, invocationPlan.steps[].source) al idioma de la página — sin
    // depender de i18n.js, así este componente sigue funcionando embebido
    // cross-origin (getmilpa.com no carga i18n.js).
    const pick = (node) => (node && typeof node === "object" && ("es" in node || "en" in node) ? node[LANG] : node);
    const $ = (selector, scope = root) => scope.querySelector(selector);
    const $$ = (selector, scope = root) => [...scope.querySelectorAll(selector)];

    function createElement(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function setAlert(alertRoot, variant, title, description) {
      const variants = ["success", "warning", "danger", "info"];
      for (const name of variants) alertRoot.classList.remove(`mui-alert--${name}`);
      if (variant) alertRoot.classList.add(`mui-alert--${variant}`);
      let icon = alertRoot.querySelector(".mui-alert__icon");
      if (!icon) {
        icon = createElement("span", "mui-alert__icon");
        icon.setAttribute("aria-hidden", "true");
        alertRoot.prepend(icon);
      }
      icon.textContent = variant === "success" ? "✓" : variant === "danger" ? "!" : variant === "warning" ? "!" : "i";
      let content = alertRoot.querySelector(".mui-alert__content");
      if (!content) {
        content = createElement("div", "mui-alert__content");
        alertRoot.append(content);
      }
      content.replaceChildren();
      if (title) content.append(createElement("p", "mui-alert__title", title));
      content.append(createElement("p", "mui-alert__desc", description));
    }

    /* Tab A: real ToolRegistry pipeline. El carril (#runtime-rail) ships
       vacío en el HTML servido — esta hidratación lo puebla, misma excepción
       documentada en tests/site-contract.test.mjs ("el carril de Tab A sigue
       vacío hasta que JS lo monta"). */
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
          await wait(300);
        }
        item.dataset.status = stage.status;
      }

      // La variante y el texto de cobertura se derivan del código `failure`
      // (no de la prosa que devuelve el core) — el core queda intacto.
      const uncovered = failure !== "none" && !RUNTIME_AUDITED_FAILURES.has(failure);
      setAlert(
        $("#runtime-result"),
        trace.outcome === "success" ? "success" : uncovered ? "warning" : "danger",
        rt.resultTitle(trace.outcome),
        rt.resultDesc(failure, rt.coverage(failure)),
      );
      $("#run-runtime").removeAttribute("aria-busy");
    }

    $("#run-runtime").addEventListener("click", runRuntimeTrace);
    $("#reset-runtime").addEventListener("click", () => {
      runtimeRunId += 1;
      renderRuntimeRail();
      setAlert($("#runtime-result"), "info", rt.resetTitle, rt.resetDesc);
      $("#run-runtime").removeAttribute("aria-busy");
    });

    /* Chrome de pestañas: dos tabpanels estáticos (recorrido de fallo / plan
       de invocación). Tablist + navegación por teclado — mismo patrón que
       activateBoundaryFlow (Artifact 04) en artifacts.js. */
    const runtimeTabs = $$("[data-runtime-tab]");
    const runtimePanels = $$(".wb-runtime-panel");
    function activateRuntimeTab(tab) {
      const target = tab.dataset.runtimeTab;
      runtimeTabs.forEach((btn) => {
        const selected = btn === tab;
        btn.setAttribute("aria-selected", String(selected));
        btn.tabIndex = selected ? 0 : -1;
      });
      runtimePanels.forEach((panel) => { panel.hidden = panel.dataset.runtimePanel !== target; });
    }
    runtimeTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activateRuntimeTab(tab));
      tab.addEventListener("keydown", (event) => {
        let next = null;
        if (event.key === "ArrowRight") next = (index + 1) % runtimeTabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + runtimeTabs.length) % runtimeTabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = runtimeTabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        runtimeTabs[next].focus();
        activateRuntimeTab(runtimeTabs[next]);
      });
    });

    /* Tab B: invocation plan (ADR#13 mirror). `wiring` stays DEFAULT_WIRING
       (same constant the SSG uses to compute the default web/POST row at
       build time) — the honest stock-registry state (no rate limiter, no
       dispatcher, no rule provider wired). Only `channel` toggles; PolicyGate
       calls the web channel 'web', SURFACES calls it 'http', hence the
       id→channel map below. */
    const PLAN_CHANNEL_OF_SURFACE = { cli: "cli", mcp: "mcp", http: "web" };
    const PLAN_PRESENCE_BADGE = { active: "mui-badge--success", conditional: "mui-badge--warning", dormant: "mui-badge--secondary", skipped: "" };
    const runtimePlanRoot = $("#runtime-panel-plan");

    function renderInvocationPlan(channel) {
      const plan = invocationPlan(channel, DEFAULT_WIRING);
      for (const step of plan.steps) {
        const row = $(`[data-step="${step.kind}"]`, runtimePlanRoot);
        if (!row) continue;
        const badge = $(".wb-runtime-plan-presence", row);
        badge.className = `mui-badge wb-runtime-plan-presence ${PLAN_PRESENCE_BADGE[step.presence] ?? ""}`.trim();
        badge.textContent = rt.presence[step.presence] ?? step.presence;
        $(".wb-runtime-plan-source", row).textContent = pick(step.source);
      }
    }

    function activateRuntimeChannel(button) {
      $$("[data-runtime-channel]", runtimePlanRoot).forEach((btn) => {
        const active = btn === button;
        btn.setAttribute("aria-pressed", String(active));
        btn.classList.toggle("mui-btn--primary", active);
      });
      renderInvocationPlan(PLAN_CHANNEL_OF_SURFACE[button.dataset.runtimeChannel] ?? "web");
    }
    $$("[data-runtime-channel]", runtimePlanRoot).forEach((button) => button.addEventListener("click", () => activateRuntimeChannel(button)));

    renderRuntimeRail();
  }
}

if (!customElements.get("milpa-artifact")) customElements.define("milpa-artifact", MilpaArtifact);
})();

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
    deniedStatus: (scope) => `denegado: falta ${scope} (solo MCP aplica scopes)`,
    noteDeniedAuthorize: (scope) => `denegado: falta ${scope}`,
    noteDeniedAudit: "lo denegado también se registra",
  },
  en: {
    applied: "applied",
    deniedStatus: (scope) => `denied: missing ${scope} (only MCP enforces scopes)`,
    noteDeniedAuthorize: (scope) => `denied: missing ${scope}`,
    noteDeniedAudit: "denials are logged too",
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
    if ((this.getAttribute("id") || "") === "atomo-artifact") this.#hydrateAtomo(preset);
  }

  /* Artifact 09: command-as-atom projection. Ported from artifacts.js
     (relocated, not rewritten) — mismo run-logic que ya corrió en producción:
     run-ids por superficie (no un contador compartido), selectores reales del
     markup de la Task 2, y el texto de status con el sufijo "→ aplicada". */
  #hydrateAtomo(_preset) {
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
      button.addEventListener("click", () => runProjection(button.dataset.surface)));
    const toggle = root.querySelector("#scope-toggle");
    if (toggle) {
      toggle.addEventListener("change", () => {
        // Re-proyecta las tres puertas para que la asimetría se vea de una.
        (SURFACES || []).forEach((item) => runProjection(item.id));
      });
    }
  }
}

if (!customElements.get("milpa-artifact")) customElements.define("milpa-artifact", MilpaArtifact);
})();

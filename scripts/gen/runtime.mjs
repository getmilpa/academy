/* Fallback estático interior de <milpa-artifact id="runtime-artifact">, la
   MISMA estructura que hidrata milpa-artifact.js (artifacts/index.html, bloque
   #runtime). Fuente única compartida por DOS emisores:
     - scripts/gen-site.mjs  → site/runtime/ + site/en/runtime/ (páginas
       standalone, mismo patrón que site/atomo/).
     - scripts/gen/gallery.mjs → la sección #runtime de la galería completa.

   Graduación P2c (mirror del átomo/ADR#5): extraído de gen/gallery.mjs (antes
   renderRuntime) sin cambiar un byte de su salida. ADR#13 se sostiene a
   través de la graduación: la pestaña "Plan de invocación" (Tab B) sigue
   computándose llamando a invocationPlan("web", DEFAULT_WIRING) en build-time
   — esta función no introduce un segundo modelo congelado ("inspection must
   describe what the runtime actually executes, not a parallel model"). El
   recorrido de fallo (Tab A) no cambia de comportamiento: el carril
   (#runtime-rail) sigue naciendo vacío — lo puebla milpa-artifact.js al
   hidratar, exactamente como antes (ver tests/site-contract.test.mjs). */

import { RUNTIME } from "../../artifacts/content/runtime.content.mjs";
// Script clásico (globalThis.AcademyCore) importado por side effect — mismo
// patrón que gen/gallery.mjs y artifacts-core.test.mjs.
import "../../artifacts/artifacts-core.js";
const { invocationPlan, RUNTIME_STAGES, DEFAULT_WIRING } = globalThis.AcademyCore;

/* Resuelve un nodo { es, en } al idioma activo; deja pasar strings planos. */
function L(node, lang) {
  if (node && typeof node === "object" && ("es" in node || "en" in node)) {
    return node[lang === "en" ? "en" : "es"];
  }
  return node;
}

// Presencia → clase de mui-badge (esqueleto de estilo). skipped usa el
// mui-badge liso (sin modificador) — el mismo look "sin log explícito" que ya
// usa Tab A para lo menos accionable.
const PLAN_PRESENCE_BADGE = {
  active: "mui-badge--success",
  conditional: "mui-badge--warning",
  dormant: "mui-badge--secondary",
  skipped: "",
};

// step.kind (invocationPlan) e id (RUNTIME_STAGES) son el mismo código
// kebab-case (ver el comentario de invocationPlan en artifacts-core.js) — este
// mapa solo resuelve la etiqueta {es,en} del paso ("Resolver"/"Resolve") desde
// la ÚNICA fuente que ya la tiene (RUNTIME_STAGES, la misma que pinta Tab A);
// no hay una segunda copia de esas etiquetas en ningún lado.
const PLAN_STEP_LABEL = new Map(RUNTIME_STAGES.map((stage) => [stage.id, stage.label]));

/* Estructura estática interior de <milpa-artifact id="runtime-artifact">:
   header, ambas pestañas (recorrido de fallo + plan de 11 pasos), la tabla de
   garantías y el bloque de fuentes. Todo presente pre-JS (hydrate-not-shell). */
export function renderRuntimeFallback(lang) {
  const a = RUNTIME;
  const options = a.scenarios
    .map((sc) => `              <option value="${sc.value}">${L(sc.label, lang)}</option>`)
    .join("\n");
  // Clase del badge de auditoría por fila (esqueleto de estilo, paralelo a tableRows).
  const auditBadge = [
    "mui-badge",
    "mui-badge mui-badge--success",
    "mui-badge mui-badge--success",
    "mui-badge",
    "mui-badge mui-badge--success",
    "mui-badge mui-badge--warning",
    "mui-badge mui-badge--success",
  ];
  const rows = a.tableRows
    .map((r, i) => `                <tr><td>${L(r.output, lang)}</td><td>${L(r.callback, lang)}</td><td><span class="${auditBadge[i]}">${L(r.audit, lang)}</span></td></tr>`)
    .join("\n");

  // Tab B: el plan de invocación de 11 pasos, canal 'web' (POST/HTTP) por
  // defecto. ADR#13 al pie de la letra: esto LLAMA a invocationPlan("web",
  // DEFAULT_WIRING) acá mismo, en build-time, así el HTML servido es la
  // salida real de la función, no una copia que pueda derivar en silencio. El
  // toggle de canal (coa/MCP/POST) vuelve a llamar invocationPlan(channel,
  // wiring) del lado del cliente con la MISMA función — un solo cómputo, dos
  // runtimes.
  const planRows = invocationPlan("web", DEFAULT_WIRING).steps
    .map((step) => {
      const badgeClass = ["mui-badge", "wb-runtime-plan-presence", PLAN_PRESENCE_BADGE[step.presence]]
        .filter(Boolean)
        .join(" ");
      const label = PLAN_STEP_LABEL.get(step.kind);
      return `                <tr data-step="${step.kind}"><td>${L(label, lang)}</td><td>${L(a.plan.roleLabels[step.role], lang)}</td><td><span class="${badgeClass}">${L(a.plan.presenceLabels[step.presence], lang)}</span></td><td class="wb-runtime-plan-source">${L(step.source, lang)}</td></tr>`;
    })
    .join("\n");
  const presenceLegend = ["dormant", "skipped"]
    .map((code) => {
      const badgeClass = ["mui-badge", PLAN_PRESENCE_BADGE[code]].filter(Boolean).join(" ");
      return `            <li><span class="${badgeClass}">${L(a.plan.presenceLabels[code], lang)}</span> — ${L(a.plan.presenceGloss[code], lang)}</li>`;
    })
    .join("\n");

  return `<header class="wb-artifact__header">
          <div class="wb-artifact__meta"><span class="mui-badge mui-badge--accent">${L(a.badges.index, lang)}</span><span class="mui-badge mui-badge--info">${L(a.badges.tag, lang)}</span></div>
          <h1 id="runtime-title">${L(a.title, lang)}</h1>
          <p>${L(a.lede, lang)}</p>
        </header>

        <div class="mui-tabs wb-runtime-tabs" role="tablist" aria-label="${L(a.tabsAria, lang)}">
          <button class="mui-tabs__tab" id="runtime-tab-failure" type="button" role="tab" aria-selected="true" aria-controls="runtime-panel-failure" data-runtime-tab="failure">${L(a.tabs.failure, lang)}</button>
          <button class="mui-tabs__tab" id="runtime-tab-plan" type="button" role="tab" aria-selected="false" aria-controls="runtime-panel-plan" data-runtime-tab="plan" tabindex="-1">${L(a.tabs.plan, lang)}</button>
        </div>

        <div class="wb-runtime-panel" id="runtime-panel-failure" data-runtime-panel="failure" role="tabpanel" aria-labelledby="runtime-tab-failure" tabindex="0">
        <div class="wb-runtime-controls">
          <div class="mui-field">
            <label class="mui-field__label" for="runtime-scenario">${L(a.scenarioLabel, lang)}</label>
            <select class="mui-select" id="runtime-scenario">
${options}
            </select>
          </div>
          <button class="mui-btn mui-btn--primary" id="run-runtime" type="button">${L(a.run, lang)}</button>
          <button class="mui-btn mui-btn--ghost" id="reset-runtime" type="button">${L(a.reset, lang)}</button>
        </div>

        <div class="wb-runtime-layout">
          <div class="mui-pipeline mui-pipeline--vertical" id="runtime-rail" aria-label="${L(a.railAria, lang)}">
            <div class="mui-pipeline__track" style="--_pipeline-progress: 0"></div>
          </div>

          <div class="wb-runtime-evidence">
          <div class="mui-alert mui-alert--info" id="runtime-result" role="status" aria-live="polite">
            <span class="mui-alert__icon" aria-hidden="true">i</span>
            <div class="mui-alert__content"><p class="mui-alert__title">${L(a.result.title, lang)}</p><p class="mui-alert__desc">${L(a.result.desc, lang)}</p></div>
          </div>

          <div class="mui-table-wrap" role="region" aria-label="${L(a.tableAria, lang)}" tabindex="0">
            <table class="mui-table mui-table--compact wb-runtime-table">
              <thead><tr><th>${L(a.tableHeaders.output, lang)}</th><th>${L(a.tableHeaders.callback, lang)}</th><th>${L(a.tableHeaders.audit, lang)}</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          </div>
        </div>
        </div>

        <div class="wb-runtime-panel" id="runtime-panel-plan" data-runtime-panel="plan" role="tabpanel" aria-labelledby="runtime-tab-plan" tabindex="0" hidden>
          <div class="wb-runtime-channels" role="group" aria-label="${L(a.plan.channelLabel, lang)}">
            <span class="mui-field__label">${L(a.plan.channelLabel, lang)}</span>
            <div class="wb-runtime-channels__buttons">
              <button class="mui-btn mui-btn--sm" type="button" id="runtime-channel-cli" data-runtime-channel="cli" aria-pressed="false">coa</button>
              <button class="mui-btn mui-btn--sm" type="button" id="runtime-channel-mcp" data-runtime-channel="mcp" aria-pressed="false">MCP</button>
              <button class="mui-btn mui-btn--sm mui-btn--primary" type="button" id="runtime-channel-http" data-runtime-channel="http" aria-pressed="true">POST</button>
            </div>
          </div>

          <div class="mui-table-wrap" role="region" aria-label="${L(a.plan.tableAria, lang)}" tabindex="0">
            <table class="mui-table mui-table--compact wb-runtime-plan-table">
              <thead><tr><th>${L(a.plan.tableHeaders.step, lang)}</th><th>${L(a.plan.tableHeaders.role, lang)}</th><th>${L(a.plan.tableHeaders.presence, lang)}</th><th>${L(a.plan.tableHeaders.source, lang)}</th></tr></thead>
              <tbody id="runtime-plan-body">
${planRows}
              </tbody>
            </table>
          </div>

          <ul class="wb-runtime-plan-legend">
${presenceLegend}
          </ul>
        </div>

        <div class="mui-callout mui-callout--warning wb-lesson" role="note"><span class="mui-callout__icon" aria-hidden="true">!</span><div class="mui-callout__content"><p class="mui-callout__title">${L(a.lesson.title, lang)}</p><p class="mui-callout__body">${L(a.lesson.body, lang)}</p></div></div>
        <details class="wb-source"><summary>${L(a.sourcesSummary, lang)}</summary><p>${L(a.sources, lang)}</p></details>`;
}

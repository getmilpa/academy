/* Fallback estático interior de <milpa-artifact id="atomo-artifact">, la MISMA
   estructura que hidrata milpa-artifact.js (artifacts/index.html, bloque #atomo).
   Fuente única compartida por DOS emisores:
     - scripts/gen-site.mjs  → site/atomo/ + site/en/atomo/ (páginas standalone
       del Artifact 09, con runtimeHref = "{asset}/artifacts/#runtime").
     - scripts/gen/gallery.mjs → la sección #atomo de la galería completa, donde
       #runtime vive en la MISMA página (runtimeHref = "#runtime").

   data-stage, data-surface, ids de pipeline/status/scope-toggle: idénticos entre
   es/en — únicamente cambia el texto visible. Determinista: sin Date/Math.random,
   string estable. Extraído de gen-site.mjs sin cambiar un byte de su salida (la
   única diferencia es que runtimeHref se recibe como parámetro en vez de
   computarse desde `asset`). */

import { ATOMO } from "../../artifacts/content/atomo.content.mjs";

function stage(lang, id, label) {
  return `<div class="mui-pipeline__stage" data-stage="${id}"><span class="mui-pipeline__label">${label[lang]}</span><p class="mui-pipeline__note"></p></div>`;
}

function pipelineColumn(lang, surfaceId, surface) {
  const stages = ATOMO.stages.map((item) => stage(lang, item.id, item.label)).join("\n                ");
  return `          <section class="wb-surface-column" data-surface="${surfaceId}" aria-label="${surface.sectionAriaLabel[lang]}">
            <h2 class="wb-surface-column__title">${surface.columnTitle[lang]}</h2>
            <p class="wb-surface-column__invocation" id="inv-${surfaceId}"><code>${surface.invocation}</code></p>
            <div class="mui-pipeline mui-pipeline--vertical" id="pipe-${surfaceId}" aria-label="${surface.pipelineAriaLabel[lang]}">
              <div class="mui-pipeline__track" style="--_pipeline-progress: 0">
                <span class="mui-pipeline__marker" aria-hidden="true"></span>
                ${stages}
              </div>
            </div>
            <p class="wb-surface-column__status" id="status-${surfaceId}" role="status" aria-live="polite">${surface.initialStatus[lang]}</p>
          </section>`;
}

/* Estructura estática interior de <milpa-artifact id="atomo-artifact">. El caller
   provee runtimeHref (destino del enlace "Radiografía del runtime" dentro del
   aviso): en la página standalone apunta al árbol /artifacts/ por profundidad
   relativa; en la galería es un ancla local "#runtime". */
export function renderAtomoFallback(lang, runtimeHref) {
  const warning = ATOMO.warning[lang].replace("{runtimeHref}", runtimeHref);
  const guaranteeRows = ATOMO.guarantees.rows
    .map((row) => `            <tr><td>${row.surface}</td><td>${row.confirm[lang]}</td><td>${row.scopes[lang]}</td></tr>`)
    .join("\n");
  const sourceItems = ATOMO.sources.items.map((item) => `            <li>${item[lang]}</li>`).join("\n");

  return `<header class="wb-artifact__header">
          <div class="wb-artifact__meta">
            <span class="mui-badge mui-badge--accent">${ATOMO.badges.artifact[lang]}</span>
            <span class="mui-badge mui-badge--secondary">${ATOMO.badges.kind[lang]}</span>
          </div>
          <h1 id="atomo-title">${ATOMO.title[lang]}</h1>
          <p>${ATOMO.lede[lang]}</p>
        </header>

        <article class="wb-atom-card" aria-label="${ATOMO.atomCard.ariaLabel[lang]}">
          <p class="wb-atom-card__name"><code>${ATOMO.atomCard.name}</code></p>
          <ul class="wb-atom-card__chips">
            <li class="mui-badge mui-badge--warning">${ATOMO.atomCard.chips.mutating}</li>
            <li class="mui-badge mui-badge--warning">${ATOMO.atomCard.chips.requiresConfirmation}</li>
            <li class="mui-badge mui-badge--secondary">${ATOMO.atomCard.chips.scopes}</li>
            <li class="mui-badge mui-badge--secondary">${ATOMO.atomCard.chips.handler}</li>
          </ul>
        </article>

        <div class="wb-surface-controls" role="group" aria-label="${ATOMO.surfaceControls.groupLabel[lang]}">
          <button class="mui-btn mui-btn--lg mui-btn--primary wb-surface" type="button" data-surface="cli">${ATOMO.surfaceControls.buttons.cli[lang]}</button>
          <button class="mui-btn mui-btn--lg mui-btn--secondary wb-surface" type="button" data-surface="mcp">${ATOMO.surfaceControls.buttons.mcp[lang]}</button>
          <button class="mui-btn mui-btn--lg mui-btn--secondary wb-surface" type="button" data-surface="http">${ATOMO.surfaceControls.buttons.http[lang]}</button>
          <label class="mui-choice wb-scope-toggle">
            <input class="mui-switch" id="scope-toggle" type="checkbox" role="switch">
            <span>${ATOMO.surfaceControls.toggleLabel[lang]}</span>
          </label>
        </div>

        <div class="mui-callout mui-callout--warning" role="note">
          <p><strong>${ATOMO.warning.lead[lang]}</strong> ${warning}</p>
        </div>

        <div class="wb-projection">
${pipelineColumn(lang, "cli", ATOMO.surfaces.cli)}
${pipelineColumn(lang, "mcp", ATOMO.surfaces.mcp)}
${pipelineColumn(lang, "http", ATOMO.surfaces.http)}
        </div>

        <table class="mui-table mui-table--compact wb-guarantees">
          <caption>${ATOMO.guarantees.caption[lang]}</caption>
          <thead><tr><th scope="col">${ATOMO.guarantees.headers.surface[lang]}</th><th scope="col">${ATOMO.guarantees.headers.confirm[lang]}</th><th scope="col">${ATOMO.guarantees.headers.scopes[lang]}</th></tr></thead>
          <tbody id="atomo-matrix">
${guaranteeRows}
          </tbody>
        </table>

        <div class="wb-lesson mui-callout" role="note">
          <p>${ATOMO.lesson[lang]}</p>
        </div>

        <details class="wb-source">
          <summary>${ATOMO.sources.summary[lang]}</summary>
          <p>${ATOMO.sources.scope[lang]}</p>
          <h3>${ATOMO.sources.heading[lang]}</h3>
          <ul>
${sourceItems}
          </ul>
        </details>`;
}

/* Fuente bilingüe única para el artifact #runtime (Artifact 05: runtime x-ray).
   Todo string visible vive acá como { es, en }. scripts/gen-site.mjs lo consume
   para emitir site/runtime/index.html (es) y site/en/runtime/index.html (en) —
   mismo patrón que artifacts/content/atomo.content.mjs (Artifact 09), sin
   dependencias, determinista.

   Graduación P2c (mirror del átomo, ADR#5): antes de esta tarea toda esta
   prosa vivía inline en GALLERY.artifacts (id "runtime",
   artifacts/content/gallery.content.mjs). Se extrajo acá para que los DOS
   emisores (scripts/gen/runtime.mjs → gen-site.mjs + gen/gallery.mjs) compartan
   una fuente única — igual que el átomo, gallery.content.mjs ahora solo aporta
   el stub { id, kind, component } para el data-kind de la <section> (ver el
   comentario ahí).

   Nota importante (ADR#13, sostenida a través de la graduación): el plan de
   invocación de 11 pasos (plan.tableHeaders/presenceLabels/... de abajo) NO
   congela sus FILAS acá — scripts/gen/runtime.mjs las computa en build-time
   llamando a invocationPlan("web", DEFAULT_WIRING) (artifacts-core.js),
   exactamente como antes de esta extracción. Lo que sí vive acá son los
   labels de presentación (roleLabels/presenceLabels/presenceGloss/
   tableHeaders/channelLabel) — prosa {es,en} pura, sin duplicar ningún dato
   que invocationPlan ya calcula. */

export const RUNTIME = {
  id: "runtime",

  /* hero/intro: sólo los consume la página standalone (site/runtime/), mismo
     rol que ATOMO.hero/ATOMO.intro en site/atomo/ — un escalón pedagógico en
     lenguaje llano antes de la radiografía técnica que sigue. */
  hero: {
    es: "Once pasos ejecutan la operación. Solo algunos de esos pasos quedan escritos en la auditoría.",
    en: "Eleven steps execute the operation. Only some of those steps make it into the audit trail.",
  },
  intro: {
    es: "Imagina que le pides al mismo sistema que ejecute una acción siete veces, y cada vez la petición "
      + "se detiene en un punto distinto: argumentos inválidos, permiso denegado, un límite de uso agotado, "
      + "una confirmación que nunca llega. Cada camino deja un rastro distinto — y no todos dejan el mismo "
      + "rastro. Eso es lo que vas a recorrer acá, ya con su nombre técnico: el plan de invocación real de "
      + "ToolRegistry::call(), paso por paso, incluidas las reglas que hoy no pueden dispararse.",
    en: "Imagine asking the same system to run one action seven times, and each time the request stops at "
      + "a different point: invalid arguments, denied permission, an exhausted rate limit, a confirmation "
      + "that never arrives. Each path leaves a different trace — and not all of them leave the same trace. "
      + "That's what you're about to walk through here, now with its technical name: the real invocation "
      + "plan of ToolRegistry::call(), step by step, including the rules that can't fire today.",
  },

  title: { es: "Radiografía del runtime", en: "Runtime x-ray" },
  badges: {
    index: { es: "Artifact 05", en: "Artifact 05" },
    tag: { es: "código auditado", en: "audited code" },
  },
  lede: {
    es: "El recorrido de once pasos es una buena entrada. La implementación real agrega límites que importan para seguridad, costos, confirmación e intercepción.",
    en: "The eleven-step walk is a good entry point. The real implementation adds boundaries that matter for security, cost, confirmation, and interception.",
  },

  /* Dos pestañas — Tab A (el recorrido de fallo) y Tab B (plan de invocación,
     ADR#13 mirror). tabsAria/tabs siguen el mismo patrón que atlas. */
  tabsAria: { es: "Vistas del runtime", en: "Runtime views" },
  tabs: {
    failure: { es: "Recorrido de fallo", en: "Failure walk" },
    plan: { es: "Plan de invocación", en: "Invocation plan" },
  },
  scenarioLabel: { es: "Salida a inspeccionar", en: "Output to inspect" },
  /* <option> del <select id="runtime-scenario"> (value = neutro estable). */
  scenarios: [
    { value: "none", label: { es: "callback exitoso", en: "successful callback" } },
    { value: "validation", label: { es: "argumentos inválidos", en: "invalid arguments" } },
    { value: "authorization", label: { es: "policy denegada", en: "policy denied" } },
    { value: "rate-limit", label: { es: "rate limit agotado", en: "rate limit exhausted" } },
    { value: "confirmation", label: { es: "confirmación pendiente", en: "pending confirmation" } },
    { value: "veto", label: { es: "listener veta ejecución", en: "listener vetoes execution" } },
    { value: "execution", label: { es: "callback lanza excepción", en: "callback throws exception" } },
  ],
  run: { es: "Recorrer implementación", en: "Walk the implementation" },
  reset: { es: "Limpiar", en: "Clear" },
  railAria: { es: "Etapas reales de ToolRegistry call", en: "Real stages of ToolRegistry call" },
  result: {
    title: { es: "Selecciona una ruta", en: "Select a path" },
    desc: {
      es: "La cobertura de auditoría cambia según el punto de retorno.",
      en: "Audit coverage changes depending on the return point.",
    },
  },
  tableAria: { es: "Matriz de garantías del runtime", en: "Runtime guarantees matrix" },
  tableHeaders: {
    output: { es: "Salida", en: "Output" },
    callback: { es: "Callback", en: "Callback" },
    audit: { es: "Evidencia de auditoría", en: "Audit evidence" },
  },
  tableRows: [
    { output: { es: "Tool inexistente", en: "Nonexistent tool" }, callback: { es: "No", en: "No" }, audit: { es: "sin log explícito", en: "no explicit log" } },
    { output: { es: "Args inválidos", en: "Invalid args" }, callback: { es: "No", en: "No" }, audit: { es: "validation failure", en: "validation failure" } },
    { output: { es: "Policy denied", en: "Policy denied" }, callback: { es: "No", en: "No" }, audit: { es: "auth failure", en: "auth failure" } },
    { output: { es: "Plan / confirmación", en: "Plan / confirmation" }, callback: { es: "No", en: "No" }, audit: { es: "sin log explícito", en: "no explicit log" } },
    { output: { es: "Cache short-circuit", en: "Cache short-circuit" }, callback: { es: "No", en: "No" }, audit: { es: "tool.executed", en: "tool.executed" } },
    { output: { es: "Veto puro", en: "Pure veto" }, callback: { es: "No", en: "No" }, audit: { es: "hueco conocido", en: "known gap" } },
    { output: { es: "Callback / throw", en: "Callback / throw" }, callback: { es: "Sí", en: "Yes" }, audit: { es: "executed / failed", en: "executed / failed" } },
  ],
  /* Tab B — Plan de invocación (ADR#13 mirror). Los 11 renglones NO viven acá
     congelados: scripts/gen/runtime.mjs llama a invocationPlan("web",
     DEFAULT_WIRING) en build-time (artifacts-core.js) y computa las filas
     desde esa salida real — así el HTML servido ES la computación, no una
     copia que pueda derivar en silencio (ADR#13: "inspection must describe
     what the runtime actually executes, not a parallel model"). El canal por
     defecto es 'web' (mismo canal que SURFACES llama 'http'); el wiring por
     defecto es el del host de stock (rateLimiter/dispatcher/ruleProvider
     ausentes). El toggle de canal (coa/MCP/POST) vuelve a llamar
     invocationPlan(channel, wiring) del lado del cliente con la MISMA
     función — un solo cómputo, dos runtimes. */
  plan: {
    tableAria: { es: "Plan de invocación de once pasos", en: "Eleven-step invocation plan" },
    tableHeaders: {
      step: { es: "Paso", en: "Step" },
      role: { es: "Rol", en: "Role" },
      presence: { es: "Presencia", en: "Presence" },
      source: { es: "Fuente", en: "Source" },
    },
    presenceLabels: {
      active: { es: "Activo", en: "Active" },
      conditional: { es: "Condicional", en: "Conditional" },
      dormant: { es: "Dormido", en: "Dormant" },
      skipped: { es: "Omitido", en: "Skipped" },
    },
    /* La honestidad de presencia (Enmienda 3 del ADR#13): Dormido y Omitido
       no son sinónimos — un lector sin JS debe poder distinguirlos. */
    presenceGloss: {
      dormant: { es: "la regla existe pero no puede dispararse", en: "the rule exists but can't fire" },
      skipped: { es: "el subsistema no está conectado", en: "the subsystem isn't wired in" },
    },
    roleLabels: {
      guard: { es: "Guardia", en: "Guard" },
      transform: { es: "Transformación", en: "Transform" },
      branch: { es: "Bifurcación", en: "Branch" },
      hook: { es: "Gancho", en: "Hook" },
      execution: { es: "Ejecución", en: "Execution" },
      boundary: { es: "Límite", en: "Boundary" },
      outcome: { es: "Resultado", en: "Outcome" },
    },
    channelLabel: { es: "Canal de invocación", en: "Invocation channel" },
    // steps no vive acá — ver el comentario de arriba. scripts/gen/runtime.mjs
    // computa las 11 filas llamando a invocationPlan("web", DEFAULT_WIRING).
  },
  lesson: {
    title: { es: "La garantía se lee por rama", en: "The guarantee reads per branch" },
    body: {
      es: "“Todo se audita” no describe hoy todas las salidas tempranas. Este artifact hace visibles tanto las garantías implementadas como los huecos.",
      en: "“Everything is audited” doesn't describe every early return today. This artifact makes both the implemented guarantees and the gaps visible.",
    },
  },
  sourcesSummary: { es: "Evidencia y alcance", en: "Evidence and scope" },
  sources: {
    es: "<code>getmilpa-tool-runtime/src/ToolRegistry.php:348-570</code> · redacción en <code>ToolAuditLogger.php:45-57,204-232</code>.",
    en: "<code>getmilpa-tool-runtime/src/ToolRegistry.php:348-570</code> · wording in <code>ToolAuditLogger.php:45-57,204-232</code>.",
  },

  jsonld: {
    about: "Milpa — pluggable pipelines through clear contracts for humans and agents",
    isBasedOn: ["https://github.com/getmilpa/tool-runtime"],
  },
};

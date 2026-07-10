/* Fuente bilingüe única para el artifact #atomo (Artifact 09: command-as-atom
   projection). Todo string visible vive acá como { es, en }. scripts/gen-site.mjs
   lo consume para emitir site/index.html (es) y site/en/index.html (en) — sin
   dependencias, determinista.

   Regla de oro: los identificadores de dominio (nombre de la Operation, flags de
   CLI, rutas HTTP, nombres de scope, clase::método del handler) NO se traducen.
   Son el mismo átomo diga lo que diga la puerta — y mantenerlos idénticos evita
   que el estado estático y el hidratado se contradigan (la lógica pura en
   artifacts-core.js emite códigos neutrales; milpa-artifact.js localiza la prosa
   de runtime según el lang de la página). Solo se traduce la prosa: títulos,
   leyendas, etiquetas humanas, advertencias, tabla de garantías y fuentes. */

export const ATOMO = {
  id: "atomo",

  hero: {
    es: "Milpa no promete ahorrarte pensar. Milpa promete enseñarte a pensar mientras construyes.",
    en: "Milpa doesn't promise to save you from thinking. Milpa promises to teach you to think while you build.",
  },

  /* Escalón pedagógico: lenguaje llano ANTES de nombrar "Operación",
     "proyección" o "scope". Cierra con esos mismos términos como puente hacia
     la sección técnica que sigue. */
  intro: {
    es: "Imaginá que le pides lo mismo a tres mensajeros distintos — una línea de "
      + "comandos, un asistente de IA, un formulario web — y cada uno lo resuelve "
      + "un poco distinto: uno te pide confirmar antes de actuar, otro revisa "
      + "primero si tienes permiso, el tercero todavía no revisa nada. Es la misma "
      + "orden, dicha de tres formas, con tres niveles de cuidado distintos. Eso es "
      + "lo que vas a ver acá, ya con su nombre técnico: una Operación, proyectada "
      + "a tres puertas.",
    en: "Imagine giving the same instruction to three different messengers — a "
      + "command line, an AI assistant, a web form — and each one handles it a "
      + "little differently: one asks you to confirm before acting, another "
      + "checks your permission first, the third doesn't check at all yet. It's "
      + "the same order, said three ways, with three different levels of care. "
      + "That's what you're about to see, now with its technical name: one "
      + "Operation, projected through three doors.",
  },

  title: { es: "El átomo y sus puertas", en: "The atom and its doors" },

  badges: {
    artifact: { es: "Artifact 09", en: "Artifact 09" },
    kind: { es: "Ingeniería · inspeccionar", en: "Engineering · inspect" },
  },

  /* Fragmento con <code> inline — se mirra la estructura exacta del párrafo
     fuente (artifacts/index.html), no un texto plano reformateado. */
  lede: {
    es: 'Una operación se declara una vez. <code>coa</code>, MCP y HTTP son '
      + "adaptadores del mismo handler — pero cambiar de puerta puede cambiar la "
      + "política.",
    en: 'An operation is declared once. <code>coa</code>, MCP and HTTP are '
      + "adapters of the same handler — but changing doors can change the "
      + "policy.",
  },

  atomCard: {
    ariaLabel: { es: "La operación declarada", en: "The declared operation" },
    /* Identificador de la Operation real — no se traduce (ver nota de arriba). */
    name: "crear:tarea",
    chips: {
      /* Nombres de propiedad del objeto Operation — código, no prosa. */
      mutating: "mutating",
      requiresConfirmation: "requiresConfirmation",
      scopes: "scopes: tarea:crear",
      handler: "handler: TaskService::create",
    },
  },

  surfaceControls: {
    groupLabel: { es: "Eliger superficie", en: "Choose surface" },
    buttons: {
      cli: { es: "coa · CLI", en: "coa · CLI" },
      mcp: { es: "MCP · agente", en: "MCP · agent" },
      http: { es: "POST · HTTP", en: "POST · HTTP" },
    },
    toggleLabel: {
      es: 'Modo caos · quitar scope <code>tarea:crear</code>',
      en: 'Chaos mode · remove scope <code>tarea:crear</code>',
    },
  },

  /* Aviso del hueco de auth — sostenido, sin suavizar ninguna de las dos
     versiones. */
  warning: {
    lead: { es: "Hueco de cobertura honesto:", en: "Honest coverage gap:" },
    es: "Esto no es una garantía deseable de HTTP. Es una radiografía de la "
      + "implementación actual. MCP aplica scopes hoy; HTTP todavía no lee "
      + "scopes de <code>Operation</code>. Este hueco debe cerrarse en "
      + "runtime/policy antes de producción. Ver "
      + '<a href="{runtimeHref}">Radiografía del runtime</a>. Fuente: '
      + "<code>Operation.php</code>.",
    en: "This is not a desirable HTTP guarantee. It is a radiography of the "
      + "current implementation. MCP enforces scopes today; HTTP does not yet "
      + "read scopes from <code>Operation</code>. This gap must be closed in "
      + "runtime/policy before production. See "
      + '<a href="{runtimeHref}">Runtime x-ray</a>. Source: '
      + "<code>Operation.php</code>.",
  },

  /* 5 etapas del pipeline. `id` = data-stage, identificador de máquina estable
     entre idiomas. `label` = texto visible, traducido. */
  stages: [
    { id: "resolve", label: { es: "resolver", en: "resolve" } },
    { id: "validate", label: { es: "validar", en: "validate" } },
    { id: "authorize", label: { es: "autorizar", en: "authorize" } },
    { id: "execute", label: { es: "ejecutar", en: "execute" } },
    { id: "audit", label: { es: "auditar", en: "audit" } },
  ],

  surfaces: {
    cli: {
      columnTitle: { es: "coa · CLI", en: "coa · CLI" },
      sectionAriaLabel: { es: "Proyección a coa (CLI)", en: "Projection to coa (CLI)" },
      pipelineAriaLabel: {
        es: "Pipeline resolver, validar, autorizar, ejecutar, auditar (coa)",
        en: "Pipeline resolve, validate, authorize, execute, audit (coa)",
      },
      /* Sintaxis real de invocación — identificador, no se traduce. */
      invocation: "coa crear:tarea --titulo=… --yes",
      initialStatus: { es: "Elige una puerta para proyectar.", en: "Pick a door to project." },
    },
    mcp: {
      columnTitle: { es: "MCP · agente", en: "MCP · agent" },
      sectionAriaLabel: { es: "Proyección a MCP (agente)", en: "Projection to MCP (agent)" },
      pipelineAriaLabel: {
        es: "Pipeline resolver, validar, autorizar, ejecutar, auditar (MCP)",
        en: "Pipeline resolve, validate, authorize, execute, audit (MCP)",
      },
      invocation: "tools/call · crear:tarea",
      initialStatus: { es: "Elige una puerta para proyectar.", en: "Pick a door to project." },
    },
    http: {
      columnTitle: { es: "POST · HTTP", en: "POST · HTTP" },
      sectionAriaLabel: { es: "Proyección a POST (HTTP)", en: "Projection to POST (HTTP)" },
      pipelineAriaLabel: {
        es: "Pipeline resolver, validar, autorizar, ejecutar, auditar (POST)",
        en: "Pipeline resolve, validate, authorize, execute, audit (POST)",
      },
      invocation: "POST /crear/tarea",
      initialStatus: { es: "Elige una puerta para proyectar.", en: "Pick a door to project." },
    },
  },

  guarantees: {
    caption: { es: "Garantías por superficie", en: "Guarantees by surface" },
    headers: {
      surface: { es: "Superficie", en: "Surface" },
      confirm: { es: "Confirm", en: "Confirm" },
      scopes: { es: "Scopes aplicados", en: "Scopes applied" },
    },
    /* confirm/scopes llevan <code>/<strong> inline — se mirra el markup exacto
       de la tabla fuente, no texto plano reformateado. */
    rows: [
      {
        surface: "coa",
        confirm: { es: "flag <code>--yes</code>", en: "flag <code>--yes</code>" },
        scopes: { es: "no (local/confiable)", en: "no (local/trusted)" },
      },
      {
        surface: "MCP",
        confirm: { es: "gate heredado (tool-runtime)", en: "inherited gate (tool-runtime)" },
        scopes: { es: "<strong>sí</strong> (PolicyGate)", en: "<strong>yes</strong> (PolicyGate)" },
      },
      {
        surface: "POST",
        confirm: { es: "token <code>428→201</code>", en: "token <code>428→201</code>" },
        scopes: { es: "no (pendiente · middleware)", en: "no (pending · middleware)" },
      },
    ],
  },

  lesson: {
    es: "El handler nunca cambió. Cambiaste de puerta y el framework sintetizó "
      + "la invocación — pero la puerta puede cambiar la política, y hoy no "
      + "todas aplican los mismos scopes.",
    en: "The handler never changed. You changed doors and the framework "
      + "synthesized the invocation — but the door can change the policy, and "
      + "today not all of them apply the same scopes.",
  },

  sources: {
    summary: { es: "Evidencia y alcance", en: "Evidence and scope" },
    scope: {
      es: "Modelo <strong>didáctico</strong> sobre implementación "
        + "<strong>auditada</strong>. Este artifact no afirma que HTTP aplique "
        + "scopes ni que el token store in-memory sea de producción.",
      en: "<strong>Didactic</strong> model over an <strong>audited</strong> "
        + "implementation. This artifact does not claim that HTTP applies "
        + "scopes, nor that the in-memory token store is production-grade.",
    },
    heading: { es: "Fuentes auditadas", en: "Audited sources" },
    items: [
      {
        es: "Contrato publicado <code>milpa/command</code>: "
          + "<code>getmilpa-command/src/Operation.php</code>, "
          + "<code>CommandProvider.php</code>, <code>SurfaceProjector.php</code>.",
        en: "Published contract <code>milpa/command</code>: "
          + "<code>getmilpa-command/src/Operation.php</code>, "
          + "<code>CommandProvider.php</code>, <code>SurfaceProjector.php</code>.",
      },
      {
        es: "Proyectores de referencia (<code>skeleton</code>, ns "
          + "<code>App\\Command</code>, no parte del paquete): "
          + "<code>getmilpa-skeleton/src/Command/{CliProjector,McpProjector,HttpProjector}.php</code>.",
        en: "Reference projectors (<code>skeleton</code>, ns "
          + "<code>App\\Command</code>, not part of the package): "
          + "<code>getmilpa-skeleton/src/Command/{CliProjector,McpProjector,HttpProjector}.php</code>.",
      },
      {
        es: "Stand-ins didácticos: <code>ConfirmTokenStore.php</code> "
          + "(in-memory, single-process — no producción), "
          + "<code>SchemaCoercer.php</code>.",
        en: "Didactic stand-ins: <code>ConfirmTokenStore.php</code> "
          + "(in-memory, single-process — not production), "
          + "<code>SchemaCoercer.php</code>.",
      },
      {
        es: "Semilla junior: <code>docs/GUION-WEBINAR-JUNIORS.md</code> "
          + "(Artifact 2).",
        en: "Junior seed: <code>docs/GUION-WEBINAR-JUNIORS.md</code> "
          + "(Artifact 2).",
      },
    ],
  },

  jsonld: {
    about: "Milpa — pluggable pipelines through clear contracts for humans and agents",
    isBasedOn: [
      "https://github.com/getmilpa/command",
      "https://github.com/getmilpa/runtime",
      "https://github.com/getmilpa/skeleton",
    ],
  },
};

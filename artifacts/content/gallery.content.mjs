/* Fuente bilingüe única de la galería de artifacts (artifacts/index.html: los 8
   artifacts estáticos + el chrome del shell). Todo string visible vive acá como
   { es, en }. Task 5 (SSG de la galería) lo consume para regenerar el DOM es/en;
   Task 4 (runtime) sigue leyendo ids/clases/data-attrs desde artifacts.js. Sin
   dependencias, determinista (data pura — sin Date/Math.random).

   Reglas de la extracción (idénticas en espíritu a atomo.content.mjs):

   1. es VERBATIM del index.html actual — cero ediciones del español. La
      i18n-fidelity test (tests/i18n-contract.test.mjs) prueba, por cada hoja es,
      que aparezca en artifacts/index.html normalizando whitespace.

   2. en técnico natural (no calco), es-MX de origen (tú). Code-spans (<code>,
      <em>, <strong>) preservados en ambos idiomas.

   3. Identificadores NEUTROS que NO se traducen y viven como STRING PLANO (el
      walk de completeness los ignora, no llevan par {es,en}): el nombre de la
      Operation/action en <code> (enviar_correo), el status de máquina que el JS
      reescribe (statusBadge "pending"), y los prompts decorativos de terminal
      (coa/audit/make). Los demás neutros que SÍ son etiquetas legibles (kickers
      como "append-only" / "human_verify", nombres de paquete en el atlas,
      cabeceras "JSONL append-only", etc.) van como { es, en } idénticos: son el
      mismo texto en las dos páginas pero T5 los emite por la misma vía localize().

   4. ESQUELETO que queda para T5 (NO es data, se reproduce tal cual desde el
      template, no vive acá): tags/ids/clases/data-* /inputs/hrefs/hidden; los
      números puros (module-count "5", progress "01 / 10", contrast-ratio, stats
      160/68/193, replay 2/2), los hex de color (#FAF5EF…), los code-fixtures
      resaltados (el bloque `entity Product…` y el diff `final class Product…`),
      y los índices de nav aria-hidden (01…09).

   5. El artifact #9 (atomo) NO reextrae su prosa: vive en atomo.content.mjs
      (ATOMO) — esa es la fuente única que también emite site/atomo/. Acá el
      atomo solo aporta el data-kind de su <section> (que además alimenta el
      topbar). T5 renderiza el fallback estático del <milpa-artifact> desde ATOMO.

   6. Valores estáticos pre-hidratación: varios textos (alerts de estado,
      inspector del atlas, proyección del event-log, contadores "1 evento"…) son
      el estado que se ve SIN JS; el runtime (T4) los reescribe al hidratar. Se
      capturan igual porque son texto visible del markup estático. */

export const GALLERY = {
  chrome: {
    /* <head> + skip link (index.html L6-7, L22). */
    pageTitle: {
      es: "Milpa Academy · Artifacts de arquitectura",
      en: "Milpa Academy · Architecture artifacts",
    },
    metaDescription: {
      es: "Artifacts interactivos para entender módulos, contratos, pipelines, compuertas y arquitectura de Milpa.",
      en: "Interactive artifacts to understand Milpa's modules, contracts, pipelines, gates, and architecture.",
    },
    skipLink: { es: "Saltar al artifact", en: "Skip to the artifact" },

    /* <details><summary> compartido por los 8 artifacts (el del atomo vive en
       ATOMO.sources.summary). */
    sourcesSummary: { es: "Evidencia y alcance", en: "Evidence and scope" },

    sidebar: {
      navAriaLabel: { es: "Artifacts de arquitectura", en: "Architecture artifacts" },
      wordmark: { es: "Milpa Academy", en: "Milpa Academy" },
      groups: {
        academy: {
          label: { es: "Academy", en: "Academy" },
          items: {
            learn: { es: "Aprender", en: "Learn" },
            labs: { es: "Laboratorios", en: "Labs" },
            webinar: { es: "Webinar", en: "Webinar" },
          },
        },
        /* Grupos 2 y 3: los labels; sus items son los artifact-links de abajo
           (01-03 en webinarPlay, 04-10 en engineeringInspect). */
        webinarPlay: { label: { es: "Webinar · jugar", en: "Webinar · play" } },
        engineeringInspect: { label: { es: "Ingeniería · inspeccionar", en: "Engineering · inspect" } },
        demos: {
          label: { es: "Demos existentes", en: "Existing demos" },
          items: {
            themeSwap: { es: "Theme swap", en: "Theme swap" },
            mGerminating: { es: "La M germinando", en: "The germinating M" },
          },
        },
      },
      /* Labels de los 10 <a data-artifact-link> del sidebar (mismo texto que el
         <h1> de cada artifact, pero nodo DOM distinto — el h1 de 1-8 y frontera
         vive en artifacts[].title; el del atomo en ATOMO.title). */
      links: {
        siembra: { es: "Siembra tu milpa", en: "Plant your milpa" },
        pipeline: { es: "Una acción, dos puertas", en: "One action, two doors" },
        compuerta: { es: "La compuerta", en: "The gate" },
        atlas: { es: "Atlas de límites", en: "Atlas of boundaries" },
        runtime: { es: "Radiografía del runtime", en: "Runtime x-ray" },
        "event-log": { es: "El proceso es el log", en: "The process is the log" },
        "design-contract": { es: "Contrato ejecutable", en: "Executable contract" },
        plan: { es: "El plan antes del disco", en: "The plan before disk" },
        atomo: { es: "El átomo y sus puertas", en: "The atom and its doors" },
        frontera: { es: "El mapa en la frontera", en: "The map at the boundary" },
      },
      footer: {
        versionBadge: { es: "@milpa/design 0.9.0", en: "@milpa/design 0.9.0" },
        date: { es: "Corte técnico · 2026-07-10", en: "Technical snapshot · 2026-07-10" },
      },
    },

    topbar: {
      navToggleAria: { es: "Abrir navegación", en: "Open navigation" },
      /* Valores estáticos iniciales (showArtifact los reescribe al primer render). */
      initialKind: { es: "Webinar", en: "Webinar" },
      initialTitle: { es: "Siembra tu milpa", en: "Plant your milpa" },
      previousAria: { es: "Artifact anterior", en: "Previous artifact" },
      previousTip: { es: "Anterior", en: "Previous" },
      progressAria: { es: "Artifact actual", en: "Current artifact" },
      nextAria: { es: "Artifact siguiente", en: "Next artifact" },
      nextTip: { es: "Siguiente", en: "Next" },
      themeAria: { es: "Cambiar a tema claro", en: "Switch to light theme" },
      themeTip: { es: "Cambiar tema", en: "Switch theme" },
      fullscreenAria: { es: "Entrar a pantalla completa", en: "Enter fullscreen" },
      fullscreenTip: { es: "Pantalla completa", en: "Fullscreen" },
    },
  },

  artifacts: [
    /* ── Artifact 01: siembra (index.html L126-204) ───────────────────────── */
    {
      id: "siembra",
      kind: { es: "Webinar · min 12–22", en: "Webinar · min 12–22" }, // data-section + topbar
      badges: {
        index: { es: "Artifact 01", en: "Artifact 01" },
        tag: { es: "modelo didáctico", en: "didactic model" },
      },
      title: { es: "Siembra tu milpa", en: "Plant your milpa" },
      lede: {
        es: "Arma la tienda capacidad por capacidad. El campo acepta un módulo solo cuando todo lo que requiere ya está sembrado.",
        en: "Build it up capability by capability. The field accepts a module only when everything it requires is already planted.",
      },
      moduleTray: {
        kicker: { es: "módulos disponibles", en: "available modules" },
        title: { es: "Semillas", en: "Seeds" },
        paletteAria: { es: "Semillas disponibles", en: "Available seeds" },
      },
      field: {
        kicker: { es: "capacidades activas", en: "active capabilities" },
        title: { es: "Campo", en: "Field" },
        plotAria: { es: "Módulos sembrados en el campo", en: "Modules planted in the field" },
        coreLine: { es: "<strong>core</strong> provee: config", en: "<strong>core</strong> provides: config" },
        empty: { es: "El tallo está listo para recibir módulos.", en: "The stalk is ready to receive modules." },
        statusTitle: { es: "Campo listo", en: "Field ready" },
        statusDesc: { es: "Selecciona una semilla o arrástrala al campo.", en: "Select a seed or drag it to the field." },
      },
      boot: {
        kicker: { es: "resolver contratos", en: "resolve contracts" },
        title: { es: "Arranque", en: "Boot" },
        start: { es: "Arrancar sistema", en: "Boot the system" },
        chaos: { es: "Modo caos", en: "Chaos mode" },
        reset: { es: "Reiniciar", en: "Reset" },
        logAria: { es: "Secuencia de arranque", en: "Boot sequence" },
        logPrompt: "coa",
        logInitial: { es: "esperando módulos…", en: "waiting for modules…" },
      },
      summary: {
        es: "El juego representa módulos como nodos y sus capacidades como aristas. Cada módulo también se puede sembrar con teclado.",
        en: "The game represents modules as nodes and their capabilities as edges. Each module can also be planted from the keyboard.",
      },
      lesson: {
        title: { es: "Lo que acabas de hacer", en: "What you just did" },
        body: {
          es: "Validación de capacidades, ordenamiento topológico de Kahn y detección de ciclos. El runtime real lista los módulos del ciclo; la ruta A → B → A aquí es una explicación visual.",
          en: "Capability validation, Kahn topological sort, and cycle detection. The real runtime lists the modules in the cycle; the A → B → A path here is a visual explanation.",
        },
      },
      sources: {
        es: "<code>docs/GUION-WEBINAR-JUNIORS.md</code> · <code>getmilpa-runtime/src/Kernel.php:90-127</code> · <code>getmilpa-plugin/src/ContractResolver.php:80-143</code>.",
        en: "<code>docs/GUION-WEBINAR-JUNIORS.md</code> · <code>getmilpa-runtime/src/Kernel.php:90-127</code> · <code>getmilpa-plugin/src/ContractResolver.php:80-143</code>.",
      },
    },

    /* ── Artifact 02: pipeline (index.html L206-273) ──────────────────────── */
    {
      id: "pipeline",
      kind: { es: "Webinar · min 22–32", en: "Webinar · min 22–32" },
      badges: {
        index: { es: "Artifact 02", en: "Artifact 02" },
        tag: { es: "modelo conceptual", en: "conceptual model" },
      },
      title: { es: "Una acción, dos puertas", en: "One action, two doors" },
      lede: {
        es: "CLI y MCP llegan a la misma acción por el mismo mecanismo de ejecución. El canal cambia el contexto y puede cambiar la policy; el tubo es compartido.",
        en: "CLI and MCP reach the same action through the same execution mechanism. The channel changes the context and can change the policy; the pipe is shared.",
      },
      contract: {
        name: "enviar_correo", // neutral: nombre de la action en <code>
        mutating: { es: "mutating", en: "mutating" },
        signature: {
          es: "scope requerido: <strong>correo:enviar</strong>",
          en: "required scope: <strong>correo:enviar</strong>",
        },
        desc: {
          es: "Una definición declarada; dos callers con contextos explícitos.",
          en: "One declared definition; two callers with explicit contexts.",
        },
      },
      callers: {
        groupAria: { es: "Elegir caller", en: "Choose caller" },
        human: { es: "Humano · CLI", en: "Human · CLI" },
        agent: { es: "Agente · MCP", en: "Agent · MCP" },
        toggleText: { es: "Quitar permiso al caller", en: "Remove the caller's permission" },
        toggleHint: { es: "Fuerza la denegación en autorizar.", en: "Forces denial at authorize." },
      },
      pipelineAria: {
        es: "Pipeline resolver, validar, autorizar, ejecutar y auditar",
        en: "Pipeline resolve, validate, authorize, execute, and audit",
      },
      /* Etapas estáticas del markup (id = data-stage estable entre idiomas). */
      stages: [
        { id: "resolve", label: { es: "resolver", en: "resolve" } },
        { id: "validate", label: { es: "validar", en: "validate" } },
        { id: "authorize", label: { es: "autorizar", en: "authorize" } },
        { id: "execute", label: { es: "ejecutar", en: "execute" } },
        { id: "audit", label: { es: "auditar", en: "audit" } },
      ],
      result: {
        title: { es: "Esperando caller", en: "Waiting for caller" },
        desc: {
          es: "La misma acción puede entrar por CLI o por <code>tools/call</code>.",
          en: "The same action can enter through CLI or through <code>tools/call</code>.",
        },
      },
      logAria: { es: "Auditoría del pipeline", en: "Pipeline audit" },
      logPrompt: "audit",
      logInitial: { es: "sin llamadas", en: "no calls" },
      lesson: {
        title: { es: "Mismo pipeline no significa mismo permiso", en: "Same pipeline doesn't mean same permission" },
        body: {
          es: "El runtime recibe un <code>ToolContext</code>. La configuración actual permite CLI por defecto y exige autenticación para MCP; ambas rutas sí convergen en <code>ToolRegistry::call()</code>.",
          en: "The runtime receives a <code>ToolContext</code>. The current configuration allows CLI by default and requires authentication for MCP; both paths do converge in <code>ToolRegistry::call()</code>.",
        },
      },
      sources: {
        es: "<code>ToolRegistry.php:348-570</code> · <code>JsonRpcService.php:282-300</code> · <code>PolicyGate.php:34-56</code>. Los botones simulan callers; no representan comandos incluidos hoy en el skeleton.",
        en: "<code>ToolRegistry.php:348-570</code> · <code>JsonRpcService.php:282-300</code> · <code>PolicyGate.php:34-56</code>. The buttons simulate callers; they don't represent commands shipped in the skeleton today.",
      },
    },

    /* ── Artifact 03: compuerta (index.html L275-335) ─────────────────────── */
    {
      id: "compuerta",
      kind: { es: "Webinar · min 40–48", en: "Webinar · min 40–48" },
      badges: {
        index: { es: "Artifact 03", en: "Artifact 03" },
        tag: { es: "síntesis didáctica", en: "didactic synthesis" },
      },
      title: { es: "La compuerta", en: "The gate" },
      lede: {
        es: "Una acción sensible queda pendiente hasta recibir un veredicto explícito. Aprobar, rechazar y exonerar producen datos distintos.",
        en: "A sensitive action stays pending until it receives an explicit verdict. Approve, reject, and waive produce different data.",
      },
      request: {
        kicker: { es: "solicitud mutante", en: "mutating request" },
        statusBadge: "pending", // neutral: status de máquina que el JS reescribe
        actor: { es: "agente · bot-severo", en: "agent · bot-severo" },
        action: { es: "Borrar 500 usuarios inactivos", en: "Delete 500 inactive users" },
        facts: { es: "scope: users:delete · alto · irreversible", en: "scope: users:delete · high · irreversible" },
      },
      machine: {
        kicker: { es: "human_verify", en: "human_verify" },
        title: { es: "Esperando decisión", en: "Awaiting decision" },
        decisionsAria: { es: "Decidir solicitud", en: "Decide request" },
        approve: { es: "Aprobar", en: "Approve" },
        reject: { es: "Rechazar", en: "Reject" },
        waive: { es: "Exonerar", en: "Waive" },
        selfApproval: { es: "Intentar autoaprobarse", en: "Try to self-approve" },
        reset: { es: "Nueva solicitud", en: "New request" },
      },
      audit: {
        kicker: { es: "append-only", en: "append-only" },
        title: { es: "Registro de auditoría", en: "Audit log" },
        countInitial: { es: "1 evento", en: "1 event" },
        logAria: { es: "Registro de decisiones", en: "Decision log" },
      },
      lesson: {
        title: { es: "Dos contratos relacionados, no una sola llamada", en: "Two related contracts, not a single call" },
        body: {
          es: "<code>VerificationResult</code> modela PENDING/PASSED/FAILED/WAIVED. El anti autoaprobación vive en el flujo de gates; la exoneración con justificación vive en workflow. Esta pantalla los reúne para enseñar el sistema.",
          en: "<code>VerificationResult</code> models PENDING/PASSED/FAILED/WAIVED. Self-approval prevention lives in the gate flow; justified waiving lives in workflow. This screen brings them together to teach the system.",
        },
      },
      sources: {
        es: "<code>VerificationStatus.php:17-48</code> · <code>HumanGate.php:101-165</code> · <code>ProcessSubmitDecisionTool.php:63-99</code>.",
        en: "<code>VerificationStatus.php:17-48</code> · <code>HumanGate.php:101-165</code> · <code>ProcessSubmitDecisionTool.php:63-99</code>.",
      },
    },

    /* ── Artifact 04: atlas (index.html L337-402) ─────────────────────────── */
    {
      id: "atlas",
      kind: { es: "Ingeniería · mapa", en: "Engineering · map" },
      badges: {
        index: { es: "Artifact 04", en: "Artifact 04" },
        tag: { es: "implementación auditada", en: "audited implementation" },
      },
      title: { es: "Atlas de límites", en: "Atlas of boundaries" },
      lede: {
        es: "Un mapa de responsabilidades y dependencias declaradas. Elige un recorrido para ver qué paquetes participan sin convertir el ecosistema en una sola caja.",
        en: "A map of responsibilities and declared dependencies. Choose a path to see which packages take part without collapsing the ecosystem into a single box.",
      },
      tabsAria: { es: "Recorridos de arquitectura", en: "Architecture paths" },
      tabs: {
        boot: { es: "Arranque", en: "Boot" },
        mcp: { es: "Tool por MCP", en: "Tool via MCP" },
        process: { es: "Proceso humano", en: "Human process" },
        ui: { es: "Interfaz live", en: "Live interface" },
      },
      mapAria: { es: "Mapa de paquetes Milpa", en: "Map of Milpa packages" },
      tiers: {
        hosts: { es: "hosts", en: "hosts" },
        adapters: { es: "adaptadores", en: "adapters" },
        engines: { es: "motores", en: "engines" },
        contracts: { es: "contratos", en: "contracts" },
      },
      arrows: {
        adapters: { es: "↓ adaptadores ↓", en: "↓ adapters ↓" },
        engines: { es: "↓ motores ↓", en: "↓ engines ↓" },
        contracts: { es: "↓ contratos y primitivas ↓", en: "↓ contracts and primitives ↓" },
      },
      /* 12 nodos del mapa: badge = rol (traducido), name = nombre de paquete
         (neutro salvo host → Aplicación), desc = línea corta. Todos { es, en }
         para que T5 los emita uniformemente; los neutros son idénticos. */
      nodes: [
        { node: "host", badge: { es: "host", en: "host" }, name: { es: "Aplicación", en: "Application" }, desc: { es: "CLI · HTTP · proceso", en: "CLI · HTTP · process" } },
        { node: "mcp-server", badge: { es: "adaptador", en: "adapter" }, name: { es: "mcp-server", en: "mcp-server" }, desc: { es: "JSON-RPC array in/out", en: "JSON-RPC array in/out" } },
        { node: "live-web", badge: { es: "adaptador", en: "adapter" }, name: { es: "live-web", en: "live-web" }, desc: { es: "HTTP + HTML", en: "HTTP + HTML" } },
        { node: "runtime", badge: { es: "motor", en: "engine" }, name: { es: "runtime", en: "runtime" }, desc: { es: "kernel y boot", en: "kernel and boot" } },
        { node: "tool-runtime", badge: { es: "motor", en: "engine" }, name: { es: "tool-runtime", en: "tool-runtime" }, desc: { es: "acciones + policy", en: "actions + policy" } },
        { node: "orchestrator", badge: { es: "motor", en: "engine" }, name: { es: "orchestrator", en: "orchestrator" }, desc: { es: "procesos event-sourced", en: "event-sourced processes" } },
        { node: "core", badge: { es: "contrato", en: "contract" }, name: { es: "core", en: "core" }, desc: { es: "interfaces + resultados", en: "interfaces + results" } },
        { node: "plugin", badge: { es: "contrato", en: "contract" }, name: { es: "plugin", en: "plugin" }, desc: { es: "provides / requires", en: "provides / requires" } },
        { node: "workflow", badge: { es: "contrato", en: "contract" }, name: { es: "workflow", en: "workflow" }, desc: { es: "states + gates ORM", en: "states + gates ORM" } },
        { node: "event-store", badge: { es: "contrato", en: "contract" }, name: { es: "event-store", en: "event-store" }, desc: { es: "append + replay", en: "append + replay" } },
        { node: "live", badge: { es: "contrato", en: "contract" }, name: { es: "live", en: "live" }, desc: { es: "definición sin render", en: "definition without render" } },
        { node: "design", badge: { es: "contrato", en: "contract" }, name: { es: "milpa-design", en: "milpa-design" }, desc: { es: "tokens + mui-*", en: "tokens + mui-*" } },
      ],
      /* Inspector: snapshot estático pre-hidratación (inspectBoundary lo
         reescribe; solo los <dt> son permanentes). El role inicial es
         "composición" (el JS luego pone "composición del producto"). */
      inspector: {
        kind: { es: "motor", en: "engine" },
        title: { es: "runtime", en: "runtime" },
        copy: {
          es: "Compone core, container, events, HTTP y plugin; verifica contratos antes de iniciar módulos.",
          en: "Composes core, container, events, HTTP, and plugin; verifies contracts before starting modules.",
        },
        roleLabel: { es: "Rol", en: "Role" },
        role: { es: "composición", en: "composition" },
        depsLabel: { es: "Depende de", en: "Depends on" },
        deps: { es: "core · container · events · http · plugin", en: "core · container · events · http · plugin" },
        sourceLabel: { es: "Fuente", en: "Source" },
        source: { es: "getmilpa-runtime/composer.json", en: "getmilpa-runtime/composer.json" },
      },
      lesson: {
        title: { es: "Las flechas son dependencias declaradas", en: "The arrows are declared dependencies" },
        body: {
          es: "No intentan inferir todas las llamadas en runtime. En MCP, HTTP/SSE/stdio pertenecen al host; <code>JsonRpcService</code> solo conoce arrays decodificados.",
          en: "They don't try to infer every runtime call. In MCP, HTTP/SSE/stdio belong to the host; <code>JsonRpcService</code> only knows decoded arrays.",
        },
      },
      sources: {
        es: "<code>getmilpa-runtime/composer.json</code> · <code>getmilpa-orchestrator/composer.json</code> · <code>JsonRpcService.php:25-37</code> · <code>ComponentDefinitionInterface.php:23-63</code> · <code>milpa-design/package.json:11-42</code>.",
        en: "<code>getmilpa-runtime/composer.json</code> · <code>getmilpa-orchestrator/composer.json</code> · <code>JsonRpcService.php:25-37</code> · <code>ComponentDefinitionInterface.php:23-63</code> · <code>milpa-design/package.json:11-42</code>.",
      },
    },

    /* ── Artifact 05: runtime (index.html L404-458) ───────────────────────── */
    {
      id: "runtime",
      kind: { es: "Ingeniería · ejecución", en: "Engineering · execution" },
      badges: {
        index: { es: "Artifact 05", en: "Artifact 05" },
        tag: { es: "código auditado", en: "audited code" },
      },
      title: { es: "Radiografía del runtime", en: "Runtime x-ray" },
      lede: {
        es: "El tubo de cinco pasos es una buena entrada. La implementación real agrega límites que importan para seguridad, costos, confirmación e intercepción.",
        en: "The five-step pipe is a good entry point. The real implementation adds boundaries that matter for security, cost, confirmation, and interception.",
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
      lesson: {
        title: { es: "La garantía se lee por rama", en: "The guarantee reads per branch" },
        body: {
          es: "“Todo se audita” no describe hoy todas las salidas tempranas. Este artifact hace visibles tanto las garantías implementadas como los huecos.",
          en: "“Everything is audited” doesn't describe every early return today. This artifact makes both the implemented guarantees and the gaps visible.",
        },
      },
      sources: {
        es: "<code>getmilpa-tool-runtime/src/ToolRegistry.php:353-570</code> · redacción en <code>ToolAuditLogger.php:45-57,204-232</code>.",
        en: "<code>getmilpa-tool-runtime/src/ToolRegistry.php:353-570</code> · wording in <code>ToolAuditLogger.php:45-57,204-232</code>.",
      },
    },

    /* ── Artifact 06: event-log (index.html L460-496) ─────────────────────── */
    {
      id: "event-log",
      kind: { es: "Ingeniería · estado", en: "Engineering · state" },
      badges: {
        index: { es: "Artifact 06", en: "Artifact 06" },
        tag: { es: "replay real · datos simulados", en: "real replay · simulated data" },
      },
      title: { es: "El proceso es el log", en: "The process is the log" },
      lede: {
        es: "No se guarda <em>current_state</em>. Se anexan hechos y un reducer puro reconstruye el estado al reproducirlos en orden.",
        en: "No <em>current_state</em> is stored. Facts are appended and a pure reducer reconstructs the state by replaying them in order.",
      },
      stream: {
        kicker: { es: "stream process-042", en: "stream process-042" },
        title: { es: "JSONL append-only", en: "JSONL append-only" },
        countInitial: { es: "2 eventos", en: "2 events" },
        linesAria: { es: "Eventos del proceso", en: "Process events" },
        decisionsAria: { es: "Añadir decisión al log", en: "Add decision to the log" },
        approve: { es: "Aprobar", en: "Approve" },
        reject: { es: "Rechazar", en: "Reject" },
        waive: { es: "Exonerar", en: "Waive" },
        reset: { es: "Reiniciar", en: "Reset" },
      },
      projection: {
        kicker: { es: "fold(events[0..n])", en: "fold(events[0..n])" },
        title: { es: "Proyección", en: "Projection" },
        stateLabel: { es: "estado derivado", en: "derived state" },
        stateValue: { es: "esperando verificación", en: "awaiting verification" },
        verificationLabel: { es: "verificación", en: "verification" },
        verificationValue: { es: "pendiente", en: "pending" },
        actorLabel: { es: "actor", en: "actor" },
        actorValue: { es: "agent:bot-severo", en: "agent:bot-severo" },
        note: {
          es: "el estado no existe como columna persistida — se re-deriva del log en cada corte",
          en: "the state doesn't exist as a persisted column — it's re-derived from the log at each cut",
        },
        sliderLabel: { es: "Punto de replay", en: "Replay point" },
      },
      lesson: {
        title: { es: "Minimalista a propósito", en: "Minimalist on purpose" },
        body: {
          es: "El file store actual reescanea JSONL para replay y secuencia; sirve para entender el patrón y persistencia ligera, no debe presentarse como event store concurrente de gran escala.",
          en: "The current file store rescans JSONL for replay and sequence; it's useful for grasping the pattern and light persistence, and shouldn't be presented as a large-scale concurrent event store.",
        },
      },
      sources: {
        es: "<code>EventStoreInterface.php:7-42</code> · <code>FileEventStore.php:25-83</code> · <code>orchestrator/Reducer.php:19-68</code>.",
        en: "<code>EventStoreInterface.php:7-42</code> · <code>FileEventStore.php:25-83</code> · <code>orchestrator/Reducer.php:19-68</code>.",
      },
    },

    /* ── Artifact 07: design-contract (index.html L498-534) ───────────────── */
    {
      id: "design-contract",
      kind: { es: "Ingeniería · gobernanza", en: "Engineering · governance" },
      badges: {
        index: { es: "Artifact 07", en: "Artifact 07" },
        tag: { es: "este repositorio", en: "this repository" },
      },
      title: { es: "Contrato ejecutable", en: "Executable contract" },
      lede: {
        es: "La intención visual no termina en un documento: tokens, contratos y pares de contraste pasan por generadores y gates repetibles.",
        en: "Visual intent doesn't end in a document: tokens, contracts, and contrast pairs pass through repeatable generators and gates.",
      },
      steps: [
        { title: { es: "Fuente DTCG", en: "DTCG source" }, body: { es: "<code>tokens/milpa-tokens.json</code> concentra primitivas y semántica.", en: "<code>tokens/milpa-tokens.json</code> concentrates primitives and semantics." } },
        { title: { es: "Build determinista", en: "Deterministic build" }, body: { es: "Genera CSS, preset Tailwind y <code>theme.contract.json</code>.", en: "Generates CSS, a Tailwind preset, and <code>theme.contract.json</code>." } },
        { title: { es: "Gates npm", en: "npm gates" }, body: { es: "Contraste, gobernanza, capas, drift y skins.", en: "Contrast, governance, layers, drift, and skins." } },
        { title: { es: "Consumidor", en: "Consumer" }, body: { es: "Carga seis bundles y puede sobrescribir tokens por contrato.", en: "Loads six bundles and can override tokens by contract." } },
      ],
      metricsAria: { es: "Métricas actuales del design system", en: "Current design system metrics" },
      /* Solo labels + meta; los valores (160/68/193) son números → esqueleto. */
      stats: [
        { label: { es: "Tokens requeridos", en: "Required tokens" }, meta: { es: "8 grupos + effects", en: "8 groups + effects" } },
        { label: { es: "Contratos", en: "Contracts" }, meta: { es: "4 capas publicadas", en: "4 published layers" } },
        { label: { es: "Checks AA", en: "AA checks" }, meta: { es: "dark + light", en: "dark + light" } },
      ],
      contrast: {
        kicker: { es: "alpha sobre --bg", en: "alpha over --bg" },
        title: { es: "Laboratorio de contraste efectivo", en: "Effective contrast lab" },
        textLabel: { es: "Texto", en: "Text" },
        surfaceLabel: { es: "Superficie", en: "Surface" },
        backgroundLabel: { es: "Fondo", en: "Background" },
        /* Prosa del <label>; el <output>100%</output> anidado es esqueleto. */
        alphaLabel: { es: "Opacidad de superficie ·", en: "Surface opacity ·" },
        preview: { es: "texto renderizado sobre superficie compuesta", en: "text rendered over composite surface" },
        resultTitle: { es: "AA pasa", en: "AA passes" },
        resultDesc: {
          es: "El gate mide el color efectivo, no el valor alpha aislado.",
          en: "The gate measures the effective color, not the alpha value in isolation.",
        },
      },
      lesson: {
        title: { es: "Garantía concreta, alcance concreto", en: "Concrete guarantee, concrete scope" },
        body: {
          es: "<code>verify-governance</code> valida forma básica y tokens, no todo el JSON Schema. <code>verify-theme</code> fuerza directamente la opacidad de <code>--bg</code>; otras invariantes quedan documentadas.",
          en: "<code>verify-governance</code> validates basic shape and tokens, not the whole JSON Schema. <code>verify-theme</code> directly enforces the opacity of <code>--bg</code>; other invariants stay documented.",
        },
      },
      sources: {
        es: "<code>scripts/build-tokens.mjs:189-265</code> · <code>verify-governance.mjs:38-98</code> · <code>verify-contrast.mjs:28-42</code> · <code>verify-theme.mjs:107-149</code>.",
        en: "<code>scripts/build-tokens.mjs:189-265</code> · <code>verify-governance.mjs:38-98</code> · <code>verify-contrast.mjs:28-42</code> · <code>verify-theme.mjs:107-149</code>.",
      },
    },

    /* ── Artifact 08: plan (index.html L536-592) ──────────────────────────── */
    {
      id: "plan",
      kind: { es: "Ingeniería · generación", en: "Engineering · generation" },
      badges: {
        index: { es: "Artifact 08", en: "Artifact 08" },
        tag: { es: "capacidad interna", en: "internal capability" },
      },
      title: { es: "El plan antes del disco", en: "The plan before disk" },
      lede: {
        es: "El generador devuelve archivos planeados en memoria. Eso permite inspeccionar el resultado y ejecutar un preflight de colisiones antes de escribir.",
        en: "The generator returns planned files in memory. That lets you inspect the result and run a collision preflight before writing.",
      },
      controls: {
        kicker: { es: "GenerationContext", en: "GenerationContext" },
        title: { es: "Entidad Product", en: "Product entity" },
        flavor: { es: "runtime flavor", en: "runtime flavor" },
        /* El <pre><code> `entity Product / fields:…` es un code-fixture resaltado
           → esqueleto; acá solo el nombre de archivo y el aria del region. */
        requestFile: { es: "solicitud", en: "request" },
        requestAria: { es: "Solicitud de generación", en: "Generation request" },
        existsText: { es: "El archivo ya existe", en: "The file already exists" },
        existsHint: { es: "Prueba el preflight de WriteGuard.", en: "Tests WriteGuard's preflight." },
        forceText: { es: "Permitir overwrite", en: "Allow overwrite" },
        forceHint: { es: "Equivale a una decisión <code>--force</code>.", en: "Equivalent to a <code>--force</code> decision." },
        generate: { es: "Generar en memoria", en: "Generate in memory" },
        inspect: { es: "Inspeccionar", en: "Inspect" },
        apply: { es: "Escribir + verificar", en: "Write + verify" },
        reset: { es: "Reiniciar", en: "Reset" },
      },
      files: {
        kicker: { es: "GenerationResult.files", en: "GenerationResult.files" },
        title: { es: "Plan inspeccionable", en: "Inspectable plan" },
        countInitial: { es: "0 archivos", en: "0 files" },
        empty: { es: "esperando generación", en: "awaiting generation" },
        /* El diff `final class Product…` es code-fixture → esqueleto. */
        diffAria: { es: "Diff planeado", en: "Planned diff" },
      },
      progress: {
        kicker: { es: "generate → preflight → write → verify", en: "generate → preflight → write → verify" },
        title: { es: "Loop actual", en: "Current loop" },
        steps: [
          { title: { es: "Render en memoria", en: "In-memory render" }, body: { es: "Produce <code>PlannedFile(path, contents)</code>.", en: "Produces <code>PlannedFile(path, contents)</code>." } },
          { title: { es: "Preflight completo", en: "Full preflight" }, body: { es: "Aborta antes de escribir si un target existe.", en: "Aborts before writing if a target exists." } },
          { title: { es: "Escritura", en: "Write" }, body: { es: "Crea directorios y escribe contenidos.", en: "Creates directories and writes contents." } },
          { title: { es: "Verificación", en: "Verification" }, body: { es: "Entity cierra el loop contra reglas de runtime.", en: "Entity closes the loop against runtime rules." } },
        ],
        logAria: { es: "Resultado del generador", en: "Generator result" },
        logPrompt: "make",
        logInitial: { es: "esperando plan…", en: "waiting for plan…" },
      },
      lesson: {
        title: { es: "Preview posible, CLI pendiente", en: "Preview possible, CLI pending" },
        body: {
          es: "<code>GenerationResult</code> ya hace inspeccionable el plan, pero el skeleton actual no expone <code>--dry-run</code>: hace preflight, escribe y luego verifica entidades. <code>WriteGuard</code> evita overwrite; no promete atomicidad ni rollback.",
          en: "<code>GenerationResult</code> already makes the plan inspectable, but the current skeleton doesn't expose <code>--dry-run</code>: it runs preflight, writes, and then verifies entities. <code>WriteGuard</code> prevents overwrite; it doesn't promise atomicity or rollback.",
        },
      },
      sources: {
        es: "<code>GenerationResult.php:7-28</code> · <code>PlannedFile.php:7-14</code> · <code>WriteGuard.php:7-31</code> · <code>getmilpa-skeleton/src/Console/Application.php:178-274</code>.",
        en: "<code>GenerationResult.php:7-28</code> · <code>PlannedFile.php:7-14</code> · <code>WriteGuard.php:7-31</code> · <code>getmilpa-skeleton/src/Console/Application.php:178-274</code>.",
      },
    },

    /* ── Artifact 09: atomo (index.html L594-712) ─────────────────────────── */
    {
      id: "atomo",
      /* data-kind de la <section> (además alimenta el topbar). Coincide con
         ATOMO.badges.kind pero es un nodo DOM distinto (el wrapper del shell). */
      kind: { es: "Ingeniería · inspeccionar", en: "Engineering · inspect" },
      /* Toda la prosa vive en atomo.content.mjs (ATOMO). T5 renderiza el
         fallback estático del <milpa-artifact> desde ATOMO, no desde acá. */
      component: "atomo",
    },

    /* ── Artifact 10: frontera — GRADUACIÓN del Almácigo (lección boundary-map,
       commit real 058fdf9). Nació staged como GALLERY.frontera (T1); Task 2 lo
       promovió a artifacts[9] al registrar renderFrontera en gen/gallery.mjs y
       movió su navLabel a chrome.sidebar.links.frontera. */
    {
      id: "frontera",
      /* data-kind de la <section> (alimenta el topbar). Grupo del sidebar:
         "Ingeniería · inspeccionar" (engineeringInspect). */
      kind: { es: "Ingeniería · inspeccionar", en: "Engineering · inspect" },
      badges: {
        index: { es: "Artifact 10", en: "Artifact 10" },
        tag: { es: "modelo didáctico", en: "didactic model" },
      },
      title: { es: "El mapa en la frontera", en: "The map at the boundary" },
      lede: {
        es: "Cuando la lógica pura emite prosa en un idioma, localizarla te obliga a elegir dónde vive la traducción. Mapear en la frontera preserva la API — pero abre una clase de fuga: es hermética solo si <em>cada</em> punto de consumo pasa por el mapa.",
        en: "When pure logic emits prose in one language, localizing it forces a choice about where the translation lives. Mapping at the boundary keeps the API intact — but it opens a leak class: it is airtight only if <em>every</em> consumption point goes through the map.",
      },

      /* ── Entender: dos arquitecturas ── */
      understand: {
        kicker: { es: "entender · dos arquitecturas", en: "understand · two architectures" },
        title: { es: "¿Dónde vive la traducción?", en: "Where does the translation live?" },
        optionA: {
          name: { es: "Códigos neutros en el núcleo", en: "Neutral codes in the core" },
          body: {
            es: "El núcleo emite códigos (<code>rejected_by_construction</code>, <code>missing_scope</code>) y el componente presenta. El idioma se resuelve en un solo lugar, contra un enum cerrado. La fuga es imposible por construcción: no hay prosa que escape porque el núcleo nunca la produce.",
            en: "The core emits codes (<code>rejected_by_construction</code>, <code>missing_scope</code>) and the component presents. Language resolves in one place, against a closed enum. The leak is impossible by construction: no prose can escape because the core never produces any.",
          },
        },
        optionB: {
          name: { es: "Mapa en la frontera", en: "Map at the boundary" },
          body: {
            es: "El núcleo sigue emitiendo prosa en un idioma y el consumidor la traduce con un mapa código→idioma en el límite. Preserva la API — nada del núcleo cambia — pero la hermeticidad ahora depende de disciplina: cada punto de consumo tiene que pasar por el mapa.",
            en: "The core keeps emitting prose in one language and the consumer translates it with a code→language map at the boundary. It keeps the API intact — nothing in the core changes — but airtightness now rests on discipline: every consumption point has to go through the map.",
          },
        },
        when: {
          es: "Prefiere (a) cuando puedes refactorizar el núcleo: la garantía la da el compilador, no tu memoria. Usa (b) cuando la API tiene que quedarse quieta — y entonces trátala como lo que es: un contrato de cobertura total.",
          en: "Prefer (a) when you can refactor the core: the guarantee comes from the compiler, not your memory. Use (b) when the API must stay still — and then treat it for what it is: a total-coverage contract.",
        },
      },

      /* ── Ver: la fuga ── */
      see: {
        kicker: { es: "ver · la fuga", en: "see · the leak" },
        title: { es: "Un punto sin mapear", en: "One unmapped point" },
        body: {
          es: "La frontera de abajo tiene varias salidas del núcleo. Cambia el idioma del demo a <strong>en</strong> y elige la salida que el mapa no cubre: el motor reporta <code>mapped:false</code> y el consumidor, sin traducción, deja pasar el código crudo — un literal en español dentro de la vista en inglés. Un solo punto olvidado basta.",
          en: "The frontier below has several core outputs. Switch the demo's language to <strong>en</strong> and pick the output the map doesn't cover: the engine reports <code>mapped:false</code> and the consumer, with no translation, passes the raw code through — a Spanish literal inside the English view. One forgotten point is enough.",
        },
      },

      /* ── Hacer: la reparación ── */
      do: {
        kicker: { es: "hacer · la reparación", en: "do · the repair" },
        title: { es: "Completa el mapa", en: "Complete the map" },
        body: {
          es: "Agrega la clave que falta con <strong>Agregar al mapa</strong>. La salida que fugaba ahora resuelve a su traducción y la vista en inglés queda limpia. Reparaste el síntoma; lo que sigue evita que vuelva.",
          en: "Add the missing key with <strong>Add to map</strong>. The output that was leaking now resolves to its translation and the English view comes out clean. You fixed the symptom; what comes next keeps it from coming back.",
        },
      },

      /* ── Verificar: la red en CI ── */
      verify: {
        kicker: { es: "verificar · la red en CI", en: "verify · the net in CI" },
        title: { es: "El test de acople", en: "The coupling test" },
        body: {
          es: "<code>coupleCheck</code> acopla los códigos que emite el núcleo con las claves que traduce el mapa. Reporta <code>missing</code> (un código sin traducción) y <code>orphan</code> (una clave muerta) y solo dice <code>ok</code> si la cobertura es total en ambos sentidos. Un estado nuevo del núcleo sin su clave rompe CI — no se cuela a producción por el <code>?? code</code> de fallback.",
          en: "<code>coupleCheck</code> couples the codes the core emits with the keys the map translates. It reports <code>missing</code> (a code with no translation) and <code>orphan</code> (a dead key), and only says <code>ok</code> when coverage is total both ways. A new core state without its key breaks CI — it doesn't slip into production through the <code>?? code</code> fallback.",
        },
      },

      /* ── El error real (aprendible) · commit 058fdf9 ── */
      bug: {
        kicker: { es: "el error real · 058fdf9", en: "the real bug · 058fdf9" },
        title: { es: "La fuga que cazó el review", en: "The leak review caught" },
        body: {
          es: "Al bilingüizar esta galería, <code>applyGateDecision</code> localizó el resultado visible (<code>#gate-result</code>) pero el push al registro de auditoría siguió usando la prosa cruda del núcleo (<code>verdict.reason</code>). En <code>/en/</code>, el flujo de auto-aprobación mostraba una oración completa en español dentro del audit trail. El review lo cazó enumerando <em>todas</em> las salidas de las cuatro funciones y persiguiendo cada punto de consumo; el smoke del navegador no lo vio porque miró el resultado, no el registro. El fix empujó <code>t.gateConstructionReason</code> (localizado) en vez de <code>verdict.reason</code>.",
          en: "While making this gallery bilingual, <code>applyGateDecision</code> localized the visible result (<code>#gate-result</code>) but the push to the audit trail kept using the core's raw prose (<code>verdict.reason</code>). On <code>/en/</code>, the self-approval flow showed a full Spanish sentence inside the audit trail. Review caught it by enumerating <em>every</em> output of the four functions and chasing each consumption point; the browser smoke missed it because it looked at the result, not the log. The fix pushed <code>t.gateConstructionReason</code> (localized) instead of <code>verdict.reason</code>.",
        },
      },

      /* El gate modelo-vs-implementación, explícito en la prosa. */
      modelNote: {
        es: "Este demo es el patrón destilado: una frontera de juguete para que veas la fuga y la cierres. La implementación auditada vive en <code>artifacts.js</code> (los mapas <code>PROJECTION_*_EN</code>, el fix del audit trail) y en <code>artifacts-core.js</code> (el núcleo neutro) de esta misma galería.",
        en: "This demo is the distilled pattern: a toy boundary so you can see the leak and close it. The audited implementation lives in <code>artifacts.js</code> (the <code>PROJECTION_*_EN</code> maps, the audit-trail fix) and <code>artifacts-core.js</code> (the neutral core) of this very gallery.",
      },

      /* ── Controles del demo (Task 2 los cablea con frontierProject/coupleCheck) ── */
      demo: {
        intro: {
          es: "Una frontera con ocho salidas del núcleo y un mapa que traduce al inglés. Falta una clave a propósito.",
          en: "A frontier with eight core outputs and a map that translates to English. One key is missing on purpose.",
        },
        codeSelectorLabel: { es: "Salida del núcleo", en: "Core output" },
        langToggleLabel: { es: "Idioma del demo", en: "Demo language" },
        langToggleHint: {
          es: "Cambia el idioma de esta frontera de juguete — no el de la página.",
          en: "Switches the language of this toy frontier — not the page's.",
        },
        langOptionEs: { es: "es · crudo", en: "es · raw" },
        langOptionEn: { es: "en · mapeado", en: "en · mapped" },
        projectionLabel: { es: "Lo que renderiza la frontera", en: "What the frontier renders" },
        mappedBadge: { es: "mapeado", en: "mapped" },
        leakBadge: { es: "fuga", en: "leak" },
        repairButton: { es: "Agregar al mapa", en: "Add to map" },
        repairHint: {
          es: "Inserta la clave faltante para la salida seleccionada.",
          en: "Inserts the missing key for the selected output.",
        },
        resetButton: { es: "Reiniciar", en: "Reset" },
        coupling: {
          title: { es: "Test de acople", en: "Coupling test" },
          runLabel: { es: "Correr acople", en: "Run coupling" },
          okLabel: { es: "ok", en: "ok" },
          missingLabel: { es: "faltan", en: "missing" },
          orphanLabel: { es: "huérfanas", en: "orphan" },
          okDesc: {
            es: "Cobertura total: cada salida del núcleo tiene su clave y no hay claves muertas.",
            en: "Total coverage: every core output has its key and there are no dead keys.",
          },
          gapDesc: {
            es: "Con la clave faltante, el acople falla: eso es exactamente lo que rompería CI antes de llegar a producción.",
            en: "With the missing key, the coupling fails: that is exactly what would break CI before it reaches production.",
          },
        },
        /* ESQUELETO / FIXTURE neutro (strings planos — el walk de completeness NO
           los toca porque no llevan par {es,en}). Las salidas son los estados que
           proyecta el runtime real (projectProcess, artifact 06); enMap es su
           traducción es→en. "detenido" se omite a propósito: es la fuga. */
        outputs: [
          "sin iniciar",
          "solicitado",
          "esperando verificación",
          "listo para ejecutar",
          "detenido",
          "ejecutando",
          "completado",
          "fallido",
        ],
        enMap: {
          "sin iniciar": "not started",
          "solicitado": "requested",
          "esperando verificación": "awaiting verification",
          "listo para ejecutar": "ready to execute",
          "ejecutando": "executing",
          "completado": "completed",
          "fallido": "failed",
        },
        gapCode: "detenido",
        gapValue: "stopped",
      },

      lesson: {
        title: { es: "Una frontera es cobertura total, no mayoría", en: "A boundary is total coverage, not a majority" },
        body: {
          es: "Las defensas reales, en orden: prefiere códigos neutros en el núcleo cuando puedas (la fuga se vuelve imposible por construcción); si mapeas en la frontera, acopla los enums del núcleo a las claves del mapa con un test que rompa CI ante un estado sin traducir; y verifica la superficie completa, no solo el happy path que se ve. Es la gemela de i18n de <strong>La compuerta</strong>: lo que el sistema garantiza por construcción contra lo que promete por disciplina.",
          en: "The real defenses, in order: prefer neutral codes in the core when you can (the leak becomes impossible by construction); if you map at the boundary, couple the core enums to the map keys with a test that breaks CI on an untranslated state; and verify the full surface, not just the happy path you can see. It is the i18n twin of <strong>The gate</strong>: what the system guarantees by construction versus what it promises by discipline.",
        },
      },
      sources: {
        es: "<code>artifacts/artifacts.js</code> (mapas <code>PROJECTION_*_EN</code>, fix del audit trail) · <code>artifacts/artifacts-core.js</code> (<code>frontierProject</code>, <code>coupleCheck</code>) · <code>tests/i18n-contract.test.mjs</code> (acople enum↔mapa) · <code>docs/LESSON-CANDIDATES.md</code> · commit <code>058fdf9</code>.",
        en: "<code>artifacts/artifacts.js</code> (<code>PROJECTION_*_EN</code> maps, audit-trail fix) · <code>artifacts/artifacts-core.js</code> (<code>frontierProject</code>, <code>coupleCheck</code>) · <code>tests/i18n-contract.test.mjs</code> (enum↔map coupling) · <code>docs/LESSON-CANDIDATES.md</code> · commit <code>058fdf9</code>.",
      },
    },
  ],
};

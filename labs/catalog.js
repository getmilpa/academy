(function (root, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MilpaLabCatalog = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const labs = [
    {
      id: "doctor",
      number: "01",
      title: { es: "Arranca una Milpa real", en: "Boot a real Milpa" },
      shortTitle: { es: "Boot y doctor", en: "Boot and doctor" },
      duration: "10 min",
      level: { es: "inicio", en: "start" },
      objective: {
        es: "Crear el skeleton, arrancar su kernel y reconocer en la salida las piezas que efectivamente quedaron conectadas.",
        en: "Create the skeleton, boot its kernel and recognize in the output the pieces that actually got wired up.",
      },
      commands: [
        {
          label: { es: "Crear el proyecto", en: "Create the project" },
          code: "composer create-project milpa/skeleton milpa-lab\ncd milpa-lab",
        },
        {
          label: { es: "Diagnosticar el arranque", en: "Diagnose the boot" },
          code: "php bin/coa doctor",
        },
      ],
      steps: [
        {
          es: "Ejecuta los comandos en una terminal con PHP y Composer disponibles.",
          en: "Run the commands in a terminal with PHP and Composer available.",
        },
        {
          es: "Lee la salida: identifica plugins, container, dispatcher y rutas.",
          en: "Read the output: identify plugins, container, dispatcher and routes.",
        },
        {
          es: "Pega abajo la salida completa de `php bin/coa doctor` y verifícala.",
          en: "Paste the full output of `php bin/coa doctor` below and verify it.",
        },
      ],
      evidenceHint: {
        es: "Se exigen siete señales independientes del boot; una línea que solo diga `success` no alcanza.",
        en: "Seven independent boot signals are required; a line that only says `success` isn't enough.",
      },
    },
    {
      id: "capabilities",
      number: "02",
      title: { es: "Rompe y repara un contrato", en: "Break and repair a contract" },
      shortTitle: { es: "Capability graph", en: "Capability graph" },
      duration: "15 min",
      level: { es: "fundamentos", en: "fundamentals" },
      objective: {
        es: "Observar que `requires/provides` falla antes del boot y comprobar que agregar un provider repara el grafo.",
        en: "Observe that `requires/provides` fails before boot and confirm that adding a provider repairs the graph.",
      },
      commands: [
        {
          label: { es: "Crear el consumidor y observar el fallo", en: "Create the consumer and observe the failure" },
          code: "php bin/coa make:plugin MailConsumer --requires=mailer\n# Agrega App\\Plugins\\MailConsumer\\MailConsumer::class a config/plugins.php\nphp bin/coa validate",
        },
        {
          label: { es: "Crear el provider y reparar", en: "Create the provider and repair" },
          code: "php bin/coa make:plugin MailProvider --provides=mailer\n# Agrega App\\Plugins\\MailProvider\\MailProvider::class a config/plugins.php\nphp bin/coa validate",
        },
      ],
      steps: [
        {
          es: "Genera y registra `MailConsumer`; conserva la salida fallida de `validate`.",
          en: "Generate and register `MailConsumer`; keep the failing output from `validate`.",
        },
        {
          es: "Genera `MailProvider`, regístralo antes del consumidor y vuelve a validar.",
          en: "Generate `MailProvider`, register it before the consumer and validate again.",
        },
        {
          es: "Pega juntas ambas salidas. La evidencia debe mostrar el fallo y la reparación.",
          en: "Paste both outputs together. The evidence must show the failure and the repair.",
        },
      ],
      evidenceHint: {
        es: "El verificador exige dos corridas, el error exacto de `MailConsumer`, `mailer` y el cierre exitoso con `PluginMetadata`.",
        en: "The verifier requires two runs, the exact `MailConsumer` error, `mailer` and the successful close with `PluginMetadata`.",
      },
    },
    {
      id: "route",
      number: "03",
      title: { es: "Genera e inspecciona una ruta", en: "Generate and inspect a route" },
      shortTitle: { es: "Scaffold y route", en: "Scaffold and route" },
      duration: "15 min",
      level: { es: "construir", en: "build" },
      objective: {
        es: "Usar devtools para generar código y después comprobar la ruta desde el kernel arrancado, no desde el filesystem.",
        en: "Use devtools to generate code and then check the route from the booted kernel, not from the filesystem.",
      },
      commands: [
        {
          label: { es: "Generar controller y plugin", en: "Generate controller and plugin" },
          code: "php bin/coa make:controller PingPlugin PingController --path=/academy-health",
        },
        {
          label: { es: "Registrar e inspeccionar", en: "Register and inspect" },
          code: "# Sigue la guía impresa y registra PingPlugin en config/plugins.php\nphp bin/coa inspect:routes",
        },
      ],
      steps: [
        {
          es: "Genera `PingController` y revisa cada archivo reportado por devtools.",
          en: "Generate `PingController` and review each file reported by devtools.",
        },
        {
          es: "Sigue la guía que imprime el comando para registrar `PingPlugin`.",
          en: "Follow the guide the command prints to register `PingPlugin`.",
        },
        {
          es: "Inspecciona las rutas y pega juntas las salidas de generación e inspección.",
          en: "Inspect the routes and paste the generation and inspection outputs together.",
        },
      ],
      evidenceHint: {
        es: "Deben aparecer ambos archivos generados y una fila `GET /academy-health` ligada a `PingController` dentro de `PingPlugin`.",
        en: "Both generated files must appear, plus a `GET /academy-health` row bound to `PingController` inside `PingPlugin`.",
      },
    },
    {
      id: "tool",
      number: "04",
      title: { es: "Activa la superficie agent-ready", en: "Activate the agent-ready surface" },
      shortTitle: { es: "Tool y MCP", en: "Tool and MCP" },
      duration: "20 min",
      level: { es: "integración", en: "integration" },
      objective: {
        es: "Habilitar MCP de forma explícita, generar una tool y comprobar que el runtime la registró con nombre y descripción.",
        en: "Enable MCP explicitly, generate a tool and confirm the runtime registered it with a name and description.",
      },
      commands: [
        {
          label: { es: "Habilitar agent-ready", en: "Enable agent-ready" },
          code: "php bin/coa agent:enable",
        },
        {
          label: { es: "Generar la tool", en: "Generate the tool" },
          code: "php bin/coa make:tool HelloPlugin HealthSummaryTool --tool-name=health_summary --description=\"Summariza el estado de salud\"",
        },
        {
          label: { es: "Registrar e inspeccionar", en: "Register and inspect" },
          code: "# Sigue la guía impresa para registrar la tool en el provider\nphp bin/coa inspect:tools",
        },
      ],
      steps: [
        {
          es: "Habilita las dependencias opcionales; Composer necesita acceso a red.",
          en: "Enable the optional dependencies; Composer needs network access.",
        },
        {
          es: "Genera `HealthSummaryTool` y aplica la guía de registro que imprime devtools.",
          en: "Generate `HealthSummaryTool` and apply the registration guide devtools prints.",
        },
        {
          es: "Inspecciona el registry y pega juntas las tres salidas.",
          en: "Inspect the registry and paste the three outputs together.",
        },
      ],
      evidenceHint: {
        es: "Se comprueban la habilitación de ambos paquetes, el archivo generado y la tool registrada como `health_summary`.",
        en: "It checks that both packages were enabled, the generated file and the tool registered as `health_summary`.",
      },
    },
  ].map(Object.freeze);

  function getLab(id) {
    return labs.find((lab) => lab.id === id) ?? null;
  }

  return Object.freeze({ labs: Object.freeze(labs), getLab });
}));

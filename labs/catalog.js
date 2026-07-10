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
      title: "Arranca una Milpa real",
      shortTitle: "Boot y doctor",
      duration: "10 min",
      level: "inicio",
      objective: "Crear el skeleton, arrancar su kernel y reconocer en la salida las piezas que efectivamente quedaron conectadas.",
      commands: [
        {
          label: "Crear el proyecto",
          code: "composer create-project milpa/skeleton milpa-lab\ncd milpa-lab",
        },
        {
          label: "Diagnosticar el arranque",
          code: "php bin/coa doctor",
        },
      ],
      steps: [
        "Ejecuta los comandos en una terminal con PHP y Composer disponibles.",
        "Lee la salida: identifica plugins, container, dispatcher y rutas.",
        "Pega abajo la salida completa de `php bin/coa doctor` y verifícala.",
      ],
      evidenceHint: "Se exigen siete señales independientes del boot; una línea que solo diga `success` no alcanza.",
    },
    {
      id: "capabilities",
      number: "02",
      title: "Rompe y repara un contrato",
      shortTitle: "Capability graph",
      duration: "15 min",
      level: "fundamentos",
      objective: "Observar que `requires/provides` falla antes del boot y comprobar que agregar un provider repara el grafo.",
      commands: [
        {
          label: "Crear el consumidor y observar el fallo",
          code: "php bin/coa make:plugin MailConsumer --requires=mailer\n# Agrega App\\Plugins\\MailConsumer\\MailConsumer::class a config/plugins.php\nphp bin/coa validate",
        },
        {
          label: "Crear el provider y reparar",
          code: "php bin/coa make:plugin MailProvider --provides=mailer\n# Agrega App\\Plugins\\MailProvider\\MailProvider::class a config/plugins.php\nphp bin/coa validate",
        },
      ],
      steps: [
        "Genera y registra `MailConsumer`; conserva la salida fallida de `validate`.",
        "Genera `MailProvider`, regístralo antes del consumidor y vuelve a validar.",
        "Pega juntas ambas salidas. La evidencia debe mostrar el fallo y la reparación.",
      ],
      evidenceHint: "El verificador exige dos corridas, el error exacto de `MailConsumer`, `mailer` y el cierre exitoso con `PluginMetadata`.",
    },
    {
      id: "route",
      number: "03",
      title: "Genera e inspecciona una ruta",
      shortTitle: "Scaffold y route",
      duration: "15 min",
      level: "construir",
      objective: "Usar devtools para generar código y después comprobar la ruta desde el kernel arrancado, no desde el filesystem.",
      commands: [
        {
          label: "Generar controller y plugin",
          code: "php bin/coa make:controller PingPlugin PingController --path=/academy-health",
        },
        {
          label: "Registrar e inspeccionar",
          code: "# Sigue la guía impresa y registra PingPlugin en config/plugins.php\nphp bin/coa inspect:routes",
        },
      ],
      steps: [
        "Genera `PingController` y revisa cada archivo reportado por devtools.",
        "Sigue la guía que imprime el comando para registrar `PingPlugin`.",
        "Inspecciona las rutas y pega juntas las salidas de generación e inspección.",
      ],
      evidenceHint: "Deben aparecer ambos archivos generados y una fila `GET /academy-health` ligada a `PingController` dentro de `PingPlugin`.",
    },
    {
      id: "tool",
      number: "04",
      title: "Activa la superficie agent-ready",
      shortTitle: "Tool y MCP",
      duration: "20 min",
      level: "integración",
      objective: "Habilitar MCP de forma explícita, generar una tool y comprobar que el runtime la registró con nombre y descripción.",
      commands: [
        {
          label: "Habilitar agent-ready",
          code: "php bin/coa agent:enable",
        },
        {
          label: "Generar la tool",
          code: "php bin/coa make:tool HelloPlugin HealthSummaryTool --tool-name=health_summary --description=\"Summariza el estado de salud\"",
        },
        {
          label: "Registrar e inspeccionar",
          code: "# Sigue la guía impresa para registrar la tool en el provider\nphp bin/coa inspect:tools",
        },
      ],
      steps: [
        "Habilita las dependencias opcionales; Composer necesita acceso a red.",
        "Genera `HealthSummaryTool` y aplica la guía de registro que imprime devtools.",
        "Inspecciona el registry y pega juntas las tres salidas.",
      ],
      evidenceHint: "Se comprueban la habilitación de ambos paquetes, el archivo generado y la tool registrada como `health_summary`.",
    },
  ].map(Object.freeze);

  function getLab(id) {
    return labs.find((lab) => lab.id === id) ?? null;
  }

  return Object.freeze({ labs: Object.freeze(labs), getLab });
}));

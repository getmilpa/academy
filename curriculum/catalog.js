(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.MilpaCurriculum = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var verifiedAt = "2026-07-10";
  var tracks = [
    {
      id: "fundamentos",
      title: "Fundamentos",
      eyebrow: "Empieza aquí",
      level: "Inicial",
      audience: "Devs y agentes",
      durationMinutes: 60,
      summary: "Lee la arquitectura como un sistema de contratos, dependencias y decisiones verificables.",
      prerequisites: [],
      units: [
        {
          id: "sistema-vivo",
          title: "La metáfora es el diseño",
          durationMinutes: 15,
          objectives: ["Distinguir ecosistema, framework y host", "Ubicar las responsabilidades de Core, Runtime, Plugin y Workflow"],
          understand: [
            "Milpa no usa la milpa como decoración. Cada cultivo conserva una responsabilidad y coopera mediante contratos pequeños.",
            "El host decide qué sembrar; el runtime arranca el sistema; los plugins aportan capacidades; los workflows coordinan acciones. Ninguna capa necesita fingir que es toda la plataforma."
          ],
          see: { label: "Abrir Siembra tu milpa", href: "../artifacts/#siembra", note: "Construye el grafo módulo por módulo y observa cuándo una dependencia todavía no puede germinar." },
          do: { label: "Leer el mapa en lenguaje llano", href: "../docs/QUE-ES-MILPA.md", commands: [] },
          verify: ["Distingue las decisiones del host de las responsabilidades del runtime.", "Identifica responsabilidades que no pertenecen a Core."],
          sources: [
            { label: "Milpa Core", href: "https://github.com/getmilpa/core" },
            { label: "Milpa Runtime", href: "https://github.com/getmilpa/runtime" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "contratos-grafo",
          title: "Contratos antes que acoplamiento",
          durationMinutes: 20,
          objectives: ["Reconocer provides/requires", "Detectar una capacidad ausente y un ciclo"],
          understand: [
            "Un plugin declara lo que provee y lo que requiere. El resolver puede validar el conjunto antes de arrancar porque trabaja con un grafo explícito, no con efectos laterales escondidos.",
            "El orden de boot es una consecuencia del grafo. Si falta una capacidad o existe un ciclo, el sistema debe fallar con evidencia y antes de atender tráfico."
          ],
          see: { label: "Romper y reparar la siembra", href: "../artifacts/#siembra", note: "Activa un ciclo, inspecciona el bloqueo y vuelve a un orden válido." },
          do: { label: "Practicar validate", href: "../labs/#capabilities", commands: ["php bin/coa validate"] },
          verify: ["Ubica la validación antes del boot.", "Justifica el orden válido a partir del grafo, no de una lista manual."],
          sources: [
            { label: "ContractResolver", href: "https://github.com/getmilpa/plugin" },
            { label: "Plugin metadata", href: "https://github.com/getmilpa/core" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "pipeline-gates",
          title: "Una acción, políticas explícitas",
          durationMinutes: 25,
          objectives: ["Separar entrada, acción y política", "Distinguir validación automática de decisión humana"],
          understand: [
            "CLI, HTTP o un agente pueden iniciar trabajo, pero la entrada no debe convertirse en una segunda implementación del dominio. La acción cruza el mismo pipeline y deja la misma clase de evidencia.",
            "Una compuerta humana no reemplaza validaciones automáticas. Interviene cuando la política exige intención, responsabilidad o contexto que una regla mecánica no puede decidir."
          ],
          see: { label: "Recorrer el pipeline", href: "../artifacts/#pipeline", note: "Cambia la puerta de entrada y retira un permiso para localizar exactamente dónde se detiene la acción." },
          do: { label: "Operar la compuerta", href: "../artifacts/#compuerta", commands: [] },
          verify: ["La entrada no contiene la lógica del caso de uso.", "Una aprobación produce una decisión auditable, no un atajo invisible."],
          sources: [
            { label: "Milpa Workflow", href: "https://github.com/getmilpa/workflow" },
            { label: "Milpa Orchestrator", href: "https://github.com/getmilpa/orchestrator" }
          ],
          lastVerified: verifiedAt
        }
      ]
    },
    {
      id: "construye",
      title: "Construye con Milpa",
      eyebrow: "Del cero al plugin",
      level: "Inicial a intermedio",
      audience: "Implementadores",
      durationMinutes: 120,
      summary: "Arranca el skeleton público, crea capacidades y comprueba el resultado con inspección real.",
      prerequisites: ["fundamentos"],
      units: [
        {
          id: "skeleton-boot",
          title: "Arranca un host verificable",
          durationMinutes: 25,
          objectives: ["Crear el skeleton público", "Leer doctor como evidencia del boot"],
          understand: [
            "El skeleton es un host mínimo. Su trabajo es ensamblar paquetes, configuración y rutas sin introducir una segunda arquitectura.",
            "Doctor no es una pantalla de bienvenida: comprueba que el kernel arrancó, enumera plugins y rutas y hace visible el estado del contenedor."
          ],
          see: { label: "Inspeccionar el runtime", href: "../artifacts/#runtime", note: "Usa la radiografía para relacionar boot, contenedor, dispatcher y registry." },
          do: { label: "Ejecutar el laboratorio de boot", href: "../labs/#doctor", commands: ["composer create-project milpa/skeleton myapp", "cd myapp", "php bin/coa doctor"] },
          verify: ["Doctor confirma kernel, plugins, contenedor y rutas.", "El servidor público se sirve desde public/."],
          sources: [
            { label: "Skeleton", href: "https://github.com/getmilpa/skeleton" },
            { label: "Runtime Kernel", href: "https://github.com/getmilpa/runtime" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "plugin-request",
          title: "Crea una capacidad y una ruta",
          durationMinutes: 35,
          objectives: ["Generar un plugin con contrato", "Inspeccionar la ruta resultante"],
          understand: [
            "El generador reduce trabajo repetitivo, pero el contrato sigue siendo explícito: nombre, capacidades provistas, dependencias y flavor.",
            "Después de escribir, inspecciona. Un archivo presente no prueba que el host registró correctamente el plugin o la ruta."
          ],
          see: { label: "Explorar el atlas de límites", href: "../artifacts/#atlas", note: "Ubica la nueva pieza en el mapa antes de convertirla en código." },
          do: { label: "Verificar scaffold e inspect", href: "../labs/#route", commands: ["php bin/coa make:plugin Catalog --provides=catalog", "php bin/coa make:controller CatalogPlugin CatalogController --path=/catalog", "php bin/coa inspect:routes"] },
          verify: ["El plugin declara catalog en provides.", "La ruta /catalog aparece en inspect:routes."],
          sources: [
            { label: "Plugin package", href: "https://github.com/getmilpa/plugin" },
            { label: "Devtools", href: "https://github.com/getmilpa/devtools" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "agent-tools",
          title: "Habilita herramientas para agentes",
          durationMinutes: 30,
          objectives: ["Entender el opt-in agent-ready", "Registrar e inspeccionar una tool"],
          understand: [
            "El skeleton básico no instala Tool Runtime ni MCP Server. agent:enable agrega esas capacidades de forma explícita para mantener pequeño el host base.",
            "Una tool necesita schema, autorización y auditoría; exponer una función al modelo no basta para convertirla en una herramienta gobernada."
          ],
          see: { label: "Comparar las dos puertas", href: "../artifacts/#pipeline", note: "La visualización explica el pipeline compartido; no promete un runner CLI genérico que el skeleton no ofrece." },
          do: { label: "Habilitar y comprobar tools", href: "../labs/#tools", commands: ["php bin/coa agent:enable", "php bin/coa make:tool CatalogPlugin SearchCatalog", "php bin/coa inspect:tools"] },
          verify: ["agent:enable instala Tool Runtime y MCP Server.", "inspect:tools muestra la tool registrada."],
          sources: [
            { label: "Tool Runtime", href: "https://github.com/getmilpa/tool-runtime" },
            { label: "MCP Server", href: "https://github.com/getmilpa/mcp-server" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "consume-design",
          title: "Compón con @milpa/design",
          durationMinutes: 30,
          objectives: ["Cargar los seis bundles en orden", "Separar contrato visual de lógica de producto"],
          understand: [
            "Design entrega tokens, motion, primitives, components, artifacts y layouts. No entrega JavaScript: estado, datos y comportamiento siguen perteneciendo a la aplicación.",
            "Consume una versión publicada. Academy puede probar composiciones ac-*, pero no debe duplicar la anatomía de una pieza mui-* ni leer archivos privados del paquete."
          ],
          see: { label: "Auditar el contrato ejecutable", href: "../artifacts/#design-contract", note: "Cambia tema y superficie; el gate calcula contraste en vivo." },
          do: { label: "Abrir la guía de contribución", href: "../docs/CONTRIBUIR.md", commands: [] },
          verify: ["Los bundles cargan tokens, motion, primitives, components, artifacts y layouts, en ese orden.", "La lógica de progreso vive en Academy, no en Design."],
          sources: [
            { label: "Milpa Design", href: "https://www.npmjs.com/package/@milpa/design" },
            { label: "Gobernanza pública", href: "https://github.com/getmilpa/design" }
          ],
          lastVerified: verifiedAt
        }
      ]
    },
    {
      id: "arquitectura",
      title: "Arquitectura auditable",
      eyebrow: "Para profundizar",
      level: "Intermedio a senior",
      audience: "Arquitectos y maintainers",
      durationMinutes: 180,
      summary: "Sigue límites, estado y decisiones desde el mapa conceptual hasta la evidencia ejecutable.",
      prerequisites: ["fundamentos"],
      units: [
        {
          id: "atlas-limites",
          title: "Atlas de límites",
          durationMinutes: 35,
          objectives: ["Seguir dependencias entre paquetes", "Diferenciar contrato público de detalle interno"],
          understand: ["Una arquitectura auditable permite seguir una responsabilidad desde la interfaz hasta el paquete que la implementa. El mapa no sustituye al código: indica dónde empezar a verificar."],
          see: { label: "Abrir Atlas de límites", href: "../artifacts/#atlas", note: "Selecciona un paquete y sigue sus relaciones y fuentes primarias." },
          do: { label: "Consultar la referencia senior", href: "../docs/REFERENCIA-SENIOR.md", commands: [] },
          verify: ["Ubica al dueño de boot, capabilities, tools, gates y estado.", "Sustenta cada afirmación importante con una fuente primaria."],
          sources: [{ label: "Organización getmilpa", href: "https://github.com/getmilpa" }],
          lastVerified: verifiedAt
        },
        {
          id: "runtime-boot",
          title: "Radiografía del runtime",
          durationMinutes: 35,
          objectives: ["Reconstruir la secuencia de boot", "Identificar los registries derivados"],
          understand: ["El kernel carga manifiestos, resuelve el grafo, registra servicios y expone rutas. La secuencia importa porque cada fase valida una condición para la siguiente."],
          see: { label: "Abrir radiografía del runtime", href: "../artifacts/#runtime", note: "Avanza fase por fase y contrasta modelo didáctico con implementación auditada." },
          do: { label: "Comprobar doctor", href: "../labs/#doctor", commands: ["php bin/coa doctor", "php bin/coa inspect:plugins", "php bin/coa inspect:services"] },
          verify: ["Distingue la información disponible antes y después de resolver el grafo.", "Relaciona doctor e inspect como vistas complementarias."],
          sources: [{ label: "Runtime", href: "https://github.com/getmilpa/runtime" }],
          lastVerified: verifiedAt
        },
        {
          id: "estado-log",
          title: "El proceso es el log",
          durationMinutes: 35,
          objectives: ["Distinguir evento de snapshot", "Reconstruir estado por replay"],
          understand: ["Cuando cada transición significativa queda como evento, el estado puede reconstruirse y una decisión puede explicarse. El snapshot acelera lectura; no reemplaza la historia."],
          see: { label: "Ejecutar el replay", href: "../artifacts/#event-log", note: "Añade eventos, rebobina y compara estado derivado con la secuencia." },
          do: { label: "Inspeccionar contratos de event store", href: "https://github.com/getmilpa/event-store", commands: [] },
          verify: ["Deriva el estado mostrado desde eventos ordenados.", "Identifica la evidencia perdida al persistir únicamente el último estado."],
          sources: [{ label: "Event Store", href: "https://github.com/getmilpa/event-store" }],
          lastVerified: verifiedAt
        },
        {
          id: "contrato-ejecutable",
          title: "El contrato visual se ejecuta",
          durationMinutes: 35,
          objectives: ["Leer estructura, estados y a11y como un contrato", "Comprobar paridad dark/light"],
          understand: ["Una clase CSS no es suficiente contrato. Milpa Design documenta anatomía, estados, tokens, accesibilidad, motion y ejemplos, y los gates comprueban que el paquete publicado preserve esas promesas."],
          see: { label: "Medir el contrato", href: "../artifacts/#design-contract", note: "Inspecciona contraste AA y cambia superficie sin alterar el contenido." },
          do: { label: "Consultar @milpa/design", href: "https://github.com/getmilpa/design", commands: ["npm test"] },
          verify: ["El componente conserva significado sin depender solo del color.", "La versión consumida está fijada y no sigue main accidentalmente."],
          sources: [{ label: "Design", href: "https://github.com/getmilpa/design" }],
          lastVerified: verifiedAt
        },
        {
          id: "plan-disco",
          title: "El plan antes del disco",
          durationMinutes: 40,
          objectives: ["Separar preflight, escritura y verificación", "Evitar atribuir --dry-run al CLI público"],
          understand: ["Los generadores actuales hacen preflight, escriben y verifican ciertos resultados. Internamente producen un GenerationResult inspeccionable, pero el skeleton público no expone --dry-run.", "La lección es revisar alcance y conflictos antes de mutar, no documentar una bandera inexistente."],
          see: { label: "Abrir el plan antes del disco", href: "../artifacts/#plan", note: "Explora la secuencia conceptual y conserva visible la diferencia con el CLI publicado." },
          do: { label: "Generar e inspeccionar", href: "../labs/#route", commands: ["php bin/coa make:controller CatalogPlugin HealthController --path=/health", "php bin/coa inspect:routes"] },
          verify: ["Distingue el plan interno de una bandera --dry-run que el CLI público no expone.", "Comprueba el registro resultante después de generar."],
          sources: [{ label: "Devtools", href: "https://github.com/getmilpa/devtools" }],
          lastVerified: verifiedAt
        }
      ]
    },
    {
      id: "disena",
      title: "Diseña con Milpa",
      eyebrow: "Sistema visual",
      level: "Intermedio",
      audience: "Frontend y diseño",
      durationMinutes: 90,
      summary: "Usa el lenguaje visual publicado, compón comportamiento en la aplicación y promueve patrones con evidencia.",
      prerequisites: ["fundamentos"],
      units: [
        {
          id: "capas-visuales",
          title: "Las seis capas",
          durationMinutes: 25,
          objectives: ["Reconocer la cascada publicada", "Elegir la capa correcta para cada pieza"],
          understand: ["Tokens nombran decisiones; motion define movimiento; primitives resuelven controles; components forman piezas; artifacts expresan contenido; layouts organizan páginas."],
          see: { label: "Inspeccionar contrato visual", href: "../artifacts/#design-contract", note: "Relaciona el selector visible con su contrato y sus gates." },
          do: { label: "Abrir npm publicado", href: "https://www.npmjs.com/package/@milpa/design", commands: [] },
          verify: ["Ordena las seis capas según su contrato de carga.", "Prioriza tokens semánticos existentes sobre valores visuales nuevos."],
          sources: [{ label: "Design package", href: "https://www.npmjs.com/package/@milpa/design" }],
          lastVerified: verifiedAt
        },
        {
          id: "composicion-app",
          title: "Design da lenguaje; Academy da conducta",
          durationMinutes: 30,
          objectives: ["Mantener lógica fuera del paquete CSS", "Crear composición local sin duplicar anatomía mui-*"],
          understand: ["Milpa Design publica CSS y contratos, no JavaScript. Academy controla rutas, progreso, datos del currículo y verificadores. Sus clases ac-* cosen el caso educativo sin redefinir componentes estables."],
          see: { label: "Abrir la galería", href: "../artifacts/", note: "Las piezas mui-plot, mui-pipeline, mui-gate y mui-replay reciben escenarios y estado desde Academy." },
          do: { label: "Comparar artifacts y lógica", href: "../artifacts/README.md", commands: [] },
          verify: ["Separa la lógica Academy del contrato CSS publicado.", "Distingue una composición ac-* específica de un componente genérico."],
          sources: [{ label: "Design governance", href: "https://github.com/getmilpa/design" }],
          lastVerified: verifiedAt
        },
        {
          id: "promocion-patron",
          title: "De candidato local a patrón público",
          durationMinutes: 35,
          objectives: ["Aplicar la regla de promoción", "Reunir evidencia antes de generalizar"],
          understand: ["Academy es laboratorio: puede inventar una composición ac-*. Design decide si sobrevive como mui-* cuando existe un caso real, aparece al menos dos veces, admite contrato, pasa gates y se consume sin hacks."],
          see: { label: "Ver el precedente de artifacts", href: "../artifacts/", note: "El cluster nació como composición local y hoy se consume desde @milpa/design@0.9.0." },
          do: { label: "Leer cómo contribuir", href: "../docs/CONTRIBUIR.md", commands: [] },
          verify: ["Exige dos usos reales o evidencia fuerte antes de promover.", "Describe al candidato mediante anatomía, estados, a11y y motion."],
          sources: [{ label: "Design", href: "https://github.com/getmilpa/design" }],
          lastVerified: verifiedAt
        }
      ]
    }
  ];

  tracks.forEach(function (track) {
    track.visibility = "public";
    track.packId = "academy-public";
  });

  function registerPack(pack) {
    if (!pack || typeof pack !== "object" || typeof pack.id !== "string" || !Array.isArray(pack.tracks)) {
      throw new TypeError("El pack privado requiere id y tracks.");
    }
    var knownTracks = new Set(tracks.map(function (track) { return track.id; }));
    pack.tracks.forEach(function (candidate) {
      if (!candidate || candidate.visibility !== "internal") {
        throw new TypeError("Toda ruta de un pack privado debe declarar visibility: internal.");
      }
      if (!candidate.id || knownTracks.has(candidate.id) || !Array.isArray(candidate.units) || candidate.units.length === 0) {
        throw new TypeError("La ruta privada requiere un id único y al menos una unidad.");
      }
      var unitIds = new Set();
      candidate.units.forEach(function (unit) {
        if (!unit.id || unitIds.has(unit.id)) throw new TypeError("Cada unidad privada requiere un id único en su ruta.");
        unitIds.add(unit.id);
      });
      var track = JSON.parse(JSON.stringify(candidate));
      track.packId = pack.id;
      tracks.push(track);
      knownTracks.add(track.id);
    });
    return tracks;
  }

  function allUnits() {
    return tracks.reduce(function (items, track) {
      return items.concat(track.units.map(function (unit, index) {
        return Object.assign({ trackId: track.id, trackTitle: track.title, order: index }, unit);
      }));
    }, []);
  }

  function getTrack(trackId) {
    return tracks.find(function (track) { return track.id === trackId; }) || null;
  }

  function getUnit(trackId, unitId) {
    var track = getTrack(trackId);
    if (!track) return null;
    var index = track.units.findIndex(function (unit) { return unit.id === unitId; });
    if (index < 0) return null;
    return { track: track, unit: track.units[index], index: index };
  }

  function firstUnit(trackId) {
    var track = getTrack(trackId);
    return track && track.units.length ? track.units[0] : null;
  }

  return { version: 1, verifiedAt: verifiedAt, tracks: tracks, allUnits: allUnits, getTrack: getTrack, getUnit: getUnit, firstUnit: firstUnit, registerPack: registerPack };
});

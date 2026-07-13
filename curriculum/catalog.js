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
      title: { es: "Fundamentos", en: "Fundamentals" },
      eyebrow: { es: "Empieza aquí", en: "Start here" },
      level: { es: "Inicial", en: "Beginner" },
      audience: { es: "Devs y agentes", en: "Devs and agents" },
      durationMinutes: 80,
      summary: { es: "Lee la arquitectura como un sistema de contratos, dependencias y decisiones verificables.", en: "Read the architecture as a system of contracts, dependencies and verifiable decisions." },
      prerequisites: [],
      units: [
        {
          id: "sistema-vivo",
          title: { es: "La metáfora es el diseño", en: "The metaphor is the design" },
          durationMinutes: 15,
          objectives: [
            { es: "Distinguir ecosistema, framework y host", en: "Tell ecosystem, framework and host apart" },
            { es: "Ubicar las responsabilidades de Core, Runtime, Plugin y Workflow", en: "Locate the responsibilities of Core, Runtime, Plugin and Workflow" }
          ],
          understand: [
            { es: "Milpa no usa la milpa como decoración. Cada cultivo conserva una responsabilidad y coopera mediante contratos pequeños.", en: "Milpa doesn't use the milpa as decoration. Each crop keeps a single responsibility and cooperates through small contracts." },
            { es: "El host decide qué sembrar; el runtime arranca el sistema; los plugins aportan capacidades; los workflows coordinan acciones. Ninguna capa necesita fingir que es toda la plataforma.", en: "The host decides what to plant; the runtime boots the system; plugins contribute capabilities; workflows coordinate actions. No layer needs to pretend it is the whole platform." }
          ],
          see: { label: { es: "Abrir Siembra tu milpa", en: "Open Plant your milpa" }, href: "../artifacts/#siembra", note: { es: "Construye el grafo módulo por módulo y observa cuándo una dependencia todavía no puede germinar.", en: "Build the graph module by module and watch when a dependency can't germinate yet." } },
          do: { label: { es: "Construir el grafo", en: "Build the graph" }, href: "../artifacts/#siembra", commands: [] },
          verify: [
            { es: "Distingue las decisiones del host de las responsabilidades del runtime.", en: "Tell the host's decisions apart from the runtime's responsibilities." },
            { es: "Identifica responsabilidades que no pertenecen a Core.", en: "Identify responsibilities that don't belong to Core." }
          ],
          sources: [
            { label: { es: "Milpa Core", en: "Milpa Core" }, href: "https://github.com/getmilpa/core" },
            { label: { es: "Milpa Runtime", en: "Milpa Runtime" }, href: "https://github.com/getmilpa/runtime" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "contratos-grafo",
          title: { es: "Contratos antes que acoplamiento", en: "Contracts before coupling" },
          durationMinutes: 20,
          objectives: [
            { es: "Reconocer provides/requires", en: "Recognize provides/requires" },
            { es: "Detectar una capacidad ausente y un ciclo", en: "Detect a missing capability and a cycle" }
          ],
          understand: [
            { es: "Un plugin declara lo que provee y lo que requiere. El resolver puede validar el conjunto antes de arrancar porque trabaja con un grafo explícito, no con efectos laterales escondidos.", en: "A plugin declares what it provides and what it requires. The resolver can validate the whole set before boot because it works with an explicit graph, not with hidden side effects." },
            { es: "El orden de boot es una consecuencia del grafo. Si falta una capacidad o existe un ciclo, el sistema debe fallar con evidencia y antes de atender tráfico. El reporte del resolver nombra el ciclo con su propio vocabulario: en un ciclo nadie puede ir primero, así que los miembros del ciclo quedan excluidos de loadOrder[] y el grafo bloquea (MILPA_DEPENDENCY_CYCLE) hasta que el ciclo se rompe.", en: "Boot order is a consequence of the graph. If a capability is missing or a cycle exists, the system must fail with evidence and before it serves traffic. The resolver's report names the cycle in its own vocabulary: in a cycle nobody can go first, so the cycle members are excluded from loadOrder[] and the graph blocks (MILPA_DEPENDENCY_CYCLE) until the cycle is broken." },
            { es: "Cuando varios proveedores reclaman el mismo id, el resolver separa dos casos. Un id exclusivo reclamado por dos o más proveedores bloquea el grafo (MILPA_CAPABILITY_CONFLICT): el resolver se niega a elegir en silencio, porque una elección oculta es exactamente la arquitectura invisible que existe para prevenir. Entre múltiples proveedores NO exclusivos la elección sí es legítima, y priority la vuelve determinista: gana la priority más alta (ausente = 0). priority ordena una elección permitida; no rescata un conflicto exclusivo.", en: "When several providers claim the same id, the resolver separates two cases. An exclusive id claimed by two or more providers blocks the graph (MILPA_CAPABILITY_CONFLICT): the resolver refuses to pick silently, because a hidden choice is exactly the invisible architecture it exists to prevent. Among multiple NON-exclusive providers the choice is legitimate, and priority makes it deterministic: the highest priority wins (absent = 0). priority orders a permitted choice; it does not rescue an exclusive conflict." }
          ],
          see: { label: { es: "Romper y reparar la siembra", en: "Break and repair the planting" }, href: "../artifacts/#siembra", note: { es: "Activa un ciclo, inspecciona el bloqueo y vuelve a un orden válido.", en: "Trigger a cycle, inspect the block and return to a valid order." } },
          do: { label: { es: "Practicar validate", en: "Practice validate" }, href: "../labs/#capabilities", commands: ["php bin/coa validate"] },
          verify: [
            { es: "Ubica la validación antes del boot.", en: "Place validation before boot." },
            { es: "Justifica el orden válido a partir del grafo, no de una lista manual.", en: "Justify the valid order from the graph, not from a manual list." }
          ],
          sources: [
            { label: { es: "ContractResolver", en: "ContractResolver" }, href: "https://github.com/getmilpa/plugin" },
            { label: { es: "Plugin metadata", en: "Plugin metadata" }, href: "https://github.com/getmilpa/core" }
          ],
          lastVerified: "2026-07-12"
        },
        {
          id: "version-contrato",
          title: { es: "Una versión es un contrato", en: "A version is a contract" },
          durationMinutes: 20,
          objectives: [
            { es: "Distinguir la versión concreta del proveedor del rango del consumidor", en: "Tell the provider's concrete version apart from the consumer's range" },
            { es: "Elegir entre subir al proveedor y relajar el constraint", en: "Choose between upgrading the provider and relaxing the constraint" }
          ],
          understand: [
            { es: "Una versión es un contrato, no una etiqueta. El proveedor declara la versión concreta que implementa (su contractVersion); el consumidor declara el rango que puede aceptar (su constraint). La asimetría es deliberada: quien implementa afirma un hecho, quien consume expresa tolerancia, y el resolver compara el hecho contra el rango.", en: "A version is a contract, not a label. The provider declares the concrete version it implements (its contractVersion); the consumer declares the range it can accept (its constraint). The asymmetry is deliberate: the implementer states a fact, the consumer expresses tolerance, and the resolver compares the fact against the range." },
            { es: "Cuando el proveedor existe pero su contractVersion cae fuera del rango pedido, el requisito sigue abierto: una implementación fuera de rango no puede sostener la forma esperada. El resolver separa el lado del contrato (MILPA_CONTRACT_VERSION_UNSUPPORTED) del lado de la capacidad (MILPA_CAPABILITY_VERSION_UNSUPPORTED) para que cada uno enseñe su propio camino de actualización.", en: "When the provider exists but its contractVersion falls outside the requested range, the requirement stays open: an out-of-range implementation cannot be trusted to honour the expected shape. The resolver splits the contract side (MILPA_CONTRACT_VERSION_UNSUPPORTED) from the capability side (MILPA_CAPABILITY_VERSION_UNSUPPORTED) so each one teaches its own upgrade path." },
            { es: "Los dos arreglos legítimos son simétricos al contrato: subir el proveedor a una versión que satisfaga el constraint, o relajar el constraint del requirente si la versión instalada es aceptable. Borrar el requisito no cierra el contrato: lo esconde.", en: "The two legitimate fixes mirror the contract: upgrade the provider to a version that satisfies the constraint, or relax the requirer's constraint if the installed version is acceptable. Deleting the requirement doesn't close the contract: it hides it." }
          ],
          see: { label: { es: "Abrir Siembra tu milpa", en: "Open Plant your milpa" }, href: "../artifacts/#siembra", note: { es: "Un requisito abierto bloquea la germinación; un proveedor fuera de rango deja el requisito tan abierto como uno ausente.", en: "An open requirement blocks germination; an out-of-range provider leaves the requirement as open as a missing one." } },
          do: { label: { es: "Practicar validate", en: "Practice validate" }, href: "../labs/#capabilities", commands: ["php bin/coa validate"] },
          verify: [
            { es: "Explica por qué el proveedor declara una versión concreta y el consumidor un rango.", en: "Explain why the provider declares a concrete version and the consumer a range." },
            { es: "Nombra los dos arreglos de un requisito fuera de rango sin silenciar el contrato.", en: "Name the two fixes for an out-of-range requirement without silencing the contract." }
          ],
          sources: [
            { label: { es: "Milpa Resolver", en: "Milpa Resolver" }, href: "https://github.com/getmilpa/resolver" },
            { label: { es: "Milpa Core", en: "Milpa Core" }, href: "https://github.com/getmilpa/core" }
          ],
          lastVerified: "2026-07-12"
        },
        {
          id: "pipeline-gates",
          title: { es: "Una acción, políticas explícitas", en: "One action, explicit policies" },
          durationMinutes: 25,
          objectives: [
            { es: "Separar entrada, acción y política", en: "Separate entry, action and policy" },
            { es: "Distinguir validación automática de decisión humana", en: "Tell automatic validation apart from human decision" }
          ],
          understand: [
            { es: "CLI, HTTP o un agente pueden iniciar trabajo, pero la entrada no debe convertirse en una segunda implementación del dominio. La acción cruza el mismo pipeline y deja la misma clase de evidencia.", en: "A CLI, HTTP or an agent can start work, but the entry point must not become a second implementation of the domain. The action crosses the same pipeline and leaves the same kind of evidence." },
            { es: "Una compuerta humana no reemplaza validaciones automáticas. Interviene cuando la política exige intención, responsabilidad o contexto que una regla mecánica no puede decidir.", en: "A human gate doesn't replace automatic validations. It steps in when policy demands intent, accountability or context that a mechanical rule can't decide." },
            { es: "milpa/command nombra ese mismo principio como átomo: una Operación se declara una vez y se proyecta a coa, MCP y HTTP sin reimplementar el dominio en cada puerta — pero la puerta sí puede cambiar la política, y hoy no todas aplican los mismos scopes.", en: "milpa/command names that same principle as an atom: an Operation is declared once and projected to coa, MCP and HTTP without reimplementing the domain at each door — but the door can change the policy, and today not all of them enforce the same scopes." }
          ],
          see: { label: { es: "Recorrer el pipeline", en: "Walk the pipeline" }, href: "../artifacts/#pipeline", note: { es: "Cambia la puerta de entrada y retira un permiso para localizar exactamente dónde se detiene la acción.", en: "Change the entry door and remove a permission to pinpoint exactly where the action stops." } },
          do: { label: { es: "Operar la compuerta", en: "Operate the gate" }, href: "../artifacts/#compuerta", commands: [] },
          verify: [
            { es: "La entrada no contiene la lógica del caso de uso.", en: "The entry point doesn't contain the use-case logic." },
            { es: "Una aprobación produce una decisión auditable, no un atajo invisible.", en: "An approval produces an auditable decision, not an invisible shortcut." }
          ],
          sources: [
            { label: { es: "Milpa Workflow", en: "Milpa Workflow" }, href: "https://github.com/getmilpa/workflow" },
            { label: { es: "Milpa Orchestrator", en: "Milpa Orchestrator" }, href: "https://github.com/getmilpa/orchestrator" },
            { label: { es: "Ver también: El átomo y sus puertas (milpa/command)", en: "See also: The atom and its doors (milpa/command)" }, href: "../artifacts/index.html#atomo" }
          ],
          lastVerified: verifiedAt
        }
      ]
    },
    {
      id: "construye",
      title: { es: "Construye con Milpa", en: "Build with Milpa" },
      eyebrow: { es: "Del cero al plugin", en: "From zero to plugin" },
      level: { es: "Inicial a intermedio", en: "Beginner to intermediate" },
      audience: { es: "Implementadores", en: "Implementers" },
      durationMinutes: 120,
      summary: { es: "Arranca el skeleton público, crea capacidades y comprueba el resultado con inspección real.", en: "Boot the public skeleton, create capabilities and verify the result with real inspection." },
      prerequisites: ["fundamentos"],
      units: [
        {
          id: "skeleton-boot",
          title: { es: "Arranca un host verificable", en: "Boot a verifiable host" },
          durationMinutes: 25,
          objectives: [
            { es: "Crear el skeleton público", en: "Create the public skeleton" },
            { es: "Leer doctor como evidencia del boot", en: "Read doctor as evidence of the boot" }
          ],
          understand: [
            { es: "El skeleton es un host mínimo. Su trabajo es ensamblar paquetes, configuración y rutas sin introducir una segunda arquitectura.", en: "The skeleton is a minimal host. Its job is to assemble packages, configuration and routes without introducing a second architecture." },
            { es: "Doctor no es una pantalla de bienvenida: comprueba que el kernel arrancó, enumera plugins y rutas y hace visible el estado del contenedor.", en: "Doctor is not a welcome screen: it checks that the kernel booted, lists plugins and routes, and makes the container's state visible." },
            { es: "El host declara además su perfil: la forma arquitectónica que espera de los paquetes instalados. Ese perfil puede quedarse viejo y pedir un mundo que ya no existe; el reporte lo nombra (MILPA_HOST_PROFILE_OUTDATED) y deja claro qué lado envejeció: el perfil, no el código.", en: "The host also declares its profile: the architectural shape it expects from the installed packages. That profile can go stale and ask for a world that no longer exists; the report names it (MILPA_HOST_PROFILE_OUTDATED) and makes clear which side went stale: the profile, not the code." }
          ],
          see: { label: { es: "Inspeccionar el runtime", en: "Inspect the runtime" }, href: "../artifacts/#runtime", note: { es: "Usa la radiografía para relacionar boot, contenedor, dispatcher y registry.", en: "Use the x-ray to relate boot, container, dispatcher and registry." } },
          do: { label: { es: "Ejecutar el laboratorio de boot", en: "Run the boot lab" }, href: "../labs/#doctor", commands: ["composer create-project milpa/skeleton myapp", "cd myapp", "php bin/coa doctor"] },
          verify: [
            { es: "Doctor confirma kernel, plugins, contenedor y rutas.", en: "Doctor confirms kernel, plugins, container and routes." },
            { es: "El servidor público se sirve desde public/.", en: "The public server is served from public/." }
          ],
          sources: [
            { label: { es: "Skeleton", en: "Skeleton" }, href: "https://github.com/getmilpa/skeleton" },
            { label: { es: "Runtime Kernel", en: "Runtime Kernel" }, href: "https://github.com/getmilpa/runtime" }
          ],
          lastVerified: "2026-07-12"
        },
        {
          id: "plugin-request",
          title: { es: "Crea una capacidad y una ruta", en: "Create a capability and a route" },
          durationMinutes: 35,
          objectives: [
            { es: "Generar un plugin con contrato", en: "Generate a plugin with a contract" },
            { es: "Inspeccionar la ruta resultante", en: "Inspect the resulting route" }
          ],
          understand: [
            { es: "El generador reduce trabajo repetitivo, pero el contrato sigue siendo explícito: nombre, capacidades provistas, dependencias y flavor.", en: "The generator cuts repetitive work, but the contract stays explicit: name, provided capabilities, dependencies and flavor." },
            { es: "Después de escribir, inspecciona. Un archivo presente no prueba que el host registró correctamente el plugin o la ruta.", en: "After writing, inspect. A file being present doesn't prove the host registered the plugin or the route correctly." }
          ],
          see: { label: { es: "Explorar el atlas de límites", en: "Explore the atlas of boundaries" }, href: "../artifacts/#atlas", note: { es: "Ubica la nueva pieza en el mapa antes de convertirla en código.", en: "Locate the new piece on the map before turning it into code." } },
          do: { label: { es: "Verificar scaffold e inspect", en: "Verify scaffold and inspect" }, href: "../labs/#route", commands: ["php bin/coa make:plugin Catalog --provides=catalog", "php bin/coa make:controller CatalogPlugin CatalogController --path=/catalog", "php bin/coa inspect:routes"] },
          verify: [
            { es: "El plugin declara catalog en provides.", en: "The plugin declares catalog in provides." },
            { es: "La ruta /catalog aparece en inspect:routes.", en: "The /catalog route appears in inspect:routes." }
          ],
          sources: [
            { label: { es: "Plugin package", en: "Plugin package" }, href: "https://github.com/getmilpa/plugin" },
            { label: { es: "Devtools", en: "Devtools" }, href: "https://github.com/getmilpa/devtools" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "agent-tools",
          title: { es: "Habilita herramientas para agentes", en: "Enable tools for agents" },
          durationMinutes: 30,
          objectives: [
            { es: "Entender el opt-in agent-ready", en: "Understand the agent-ready opt-in" },
            { es: "Registrar e inspeccionar una tool", en: "Register and inspect a tool" }
          ],
          understand: [
            { es: "El skeleton básico no instala Tool Runtime ni MCP Server. agent:enable agrega esas capacidades de forma explícita para mantener pequeño el host base.", en: "The basic skeleton doesn't install Tool Runtime or MCP Server. agent:enable adds those capabilities explicitly to keep the base host small." },
            { es: "Una tool necesita schema, autorización y auditoría; exponer una función al modelo no basta para convertirla en una herramienta gobernada.", en: "A tool needs a schema, authorization and auditing; exposing a function to the model isn't enough to turn it into a governed tool." }
          ],
          see: { label: { es: "Comparar las dos puertas", en: "Compare the two doors" }, href: "../artifacts/#pipeline", note: { es: "La visualización explica el pipeline compartido; no promete un runner CLI genérico que el skeleton no ofrece.", en: "The visualization explains the shared pipeline; it doesn't promise a generic CLI runner that the skeleton doesn't offer." } },
          do: { label: { es: "Habilitar y comprobar tools", en: "Enable and check tools" }, href: "../labs/#tool", commands: ["php bin/coa agent:enable", "php bin/coa make:tool CatalogPlugin SearchCatalog", "php bin/coa inspect:tools"] },
          verify: [
            { es: "agent:enable instala Tool Runtime y MCP Server.", en: "agent:enable installs Tool Runtime and MCP Server." },
            { es: "inspect:tools muestra la tool registrada.", en: "inspect:tools shows the registered tool." }
          ],
          sources: [
            { label: { es: "Tool Runtime", en: "Tool Runtime" }, href: "https://github.com/getmilpa/tool-runtime" },
            { label: { es: "MCP Server", en: "MCP Server" }, href: "https://github.com/getmilpa/mcp-server" }
          ],
          lastVerified: verifiedAt
        },
        {
          id: "consume-design",
          title: { es: "Compón con @milpa/design", en: "Compose with @milpa/design" },
          durationMinutes: 30,
          objectives: [
            { es: "Cargar los seis bundles en orden", en: "Load the six bundles in order" },
            { es: "Separar contrato visual de lógica de producto", en: "Separate the visual contract from product logic" }
          ],
          understand: [
            { es: "Design entrega tokens, motion, primitives, components, artifacts y layouts. No entrega JavaScript: estado, datos y comportamiento siguen perteneciendo a la aplicación.", en: "Design ships tokens, motion, primitives, components, artifacts and layouts. It doesn't ship JavaScript: state, data and behavior still belong to the application." },
            { es: "Consume una versión publicada. Academy puede probar composiciones ac-*, pero no debe duplicar la anatomía de una pieza mui-* ni leer archivos privados del paquete.", en: "Consume a published version. Academy can try out ac-* compositions, but it must not duplicate the anatomy of a mui-* piece or read the package's private files." }
          ],
          see: { label: { es: "Auditar el contrato ejecutable", en: "Audit the executable contract" }, href: "../artifacts/#design-contract", note: { es: "Cambia tema y superficie; el gate calcula contraste en vivo.", en: "Change theme and surface; the gate computes contrast live." } },
          do: { label: { es: "Abrir la guía de contribución", en: "Open the contribution guide" }, href: "https://github.com/getmilpa/milpa-design", commands: [] },
          verify: [
            { es: "Los bundles cargan tokens, motion, primitives, components, artifacts y layouts, en ese orden.", en: "The bundles load tokens, motion, primitives, components, artifacts and layouts, in that order." },
            { es: "La lógica de progreso vive en Academy, no en Design.", en: "Progress logic lives in Academy, not in Design." }
          ],
          sources: [
            { label: { es: "Milpa Design", en: "Milpa Design" }, href: "https://www.npmjs.com/package/@milpa/design" },
            { label: { es: "Gobernanza pública", en: "Public governance" }, href: "https://github.com/getmilpa/milpa-design" }
          ],
          lastVerified: verifiedAt
        }
      ]
    },
    {
      id: "arquitectura",
      title: { es: "Arquitectura auditable", en: "Auditable architecture" },
      eyebrow: { es: "Para profundizar", en: "Go deeper" },
      level: { es: "Intermedio a senior", en: "Intermediate to senior" },
      audience: { es: "Arquitectos y maintainers", en: "Architects and maintainers" },
      durationMinutes: 275,
      summary: { es: "Sigue límites, estado y decisiones desde el mapa conceptual hasta la evidencia ejecutable.", en: "Trace boundaries, state and decisions from the conceptual map to executable evidence." },
      prerequisites: ["fundamentos"],
      units: [
        {
          id: "atlas-limites",
          title: { es: "Atlas de límites", en: "Atlas of boundaries" },
          durationMinutes: 35,
          objectives: [
            { es: "Seguir dependencias entre paquetes", en: "Follow dependencies between packages" },
            { es: "Diferenciar contrato público de detalle interno", en: "Tell a public contract apart from an internal detail" }
          ],
          understand: [
            { es: "Una arquitectura auditable permite seguir una responsabilidad desde la interfaz hasta el paquete que la implementa. El mapa no sustituye al código: indica dónde empezar a verificar.", en: "An auditable architecture lets you trace a responsibility from the interface to the package that implements it. The map doesn't replace the code: it tells you where to start verifying." },
            { es: "El mapa también puede mentir desde el manifiesto: el DriftDetector compara lo que milpa.json declara contra lo que el código trae en #[PluginMetadata]. Cuando divergen, el reporte lo nombra (MILPA_MANIFEST_DRIFT), porque el contrato que enseña es el que corre, no el que se escribe: un milpa.json con drift enseña a humanos y agentes una forma que ya no existe, y toda decisión tomada desde ese manifiesto hereda la brecha. El arreglo es regenerativo, no manual: php coa coa:plugins manifest <Plugin> (comando del host) reescribe el manifiesto desde el código, que es la fuente de verdad.", en: "The map can also lie from the manifest: the DriftDetector compares what milpa.json declares against what the code carries in #[PluginMetadata]. When they diverge, the report names it (MILPA_MANIFEST_DRIFT), because the contract that teaches is the one that runs, not the one that is written: a drifted milpa.json teaches humans and agents a shape that no longer exists, and every decision made from that manifest inherits the gap. The fix is regenerative, not manual: php coa coa:plugins manifest <Plugin> (a host command) rewrites the manifest from the code, which is the source of truth." }
          ],
          see: { label: { es: "Abrir Atlas de límites", en: "Open Atlas of boundaries" }, href: "../artifacts/#atlas", note: { es: "Selecciona un paquete y sigue sus relaciones y fuentes primarias.", en: "Select a package and follow its relationships and primary sources." } },
          do: { label: { es: "Consultar la referencia senior (paquetes fuente)", en: "Browse the senior reference (source packages)" }, href: "https://github.com/getmilpa", commands: [] },
          verify: [
            { es: "Ubica al dueño de boot, capabilities, tools, gates y estado.", en: "Locate the owner of boot, capabilities, tools, gates and state." },
            { es: "Sustenta cada afirmación importante con una fuente primaria.", en: "Back every important claim with a primary source." }
          ],
          sources: [{ label: { es: "Organización getmilpa", en: "getmilpa organization" }, href: "https://github.com/getmilpa" }],
          lastVerified: "2026-07-12"
        },
        {
          id: "runtime-boot",
          title: { es: "Radiografía del runtime", en: "X-ray of the runtime" },
          durationMinutes: 35,
          objectives: [
            { es: "Reconstruir la secuencia de boot", en: "Reconstruct the boot sequence" },
            { es: "Identificar los registries derivados", en: "Identify the derived registries" }
          ],
          understand: [
            { es: "El boot real empieza con una compuerta: el kernel refleja los manifiestos y resuelve el grafo completo a través de milpa/resolver ANTES de que cualquier plugin arranque. Un grafo bloqueado lanza ArchitectureBlockedException con el ResolutionReport completo a bordo — cada error aprendible, cada conflicto, cada ausencia — no solo un mensaje de una línea.", en: "The real boot starts with a gate: the kernel reflects the manifests and resolves the whole graph through milpa/resolver BEFORE any plugin boots. A blocked graph throws ArchitectureBlockedException with the full ResolutionReport on board — every learnable error, every conflict, every miss — not just a one-line message." },
            { es: "Un grafo booteable arranca en el orden que el propio reporte trae: loadOrder[]. La misma resolución que validó el grafo también lo ordenó, así que el orden de boot no es una lista aparte que pueda divergir; los registries y las rutas se derivan después, de un conjunto que ya demostró cerrar.", en: "A bootable graph boots in the order the report itself carries: loadOrder[]. The same resolution that gated the graph also ordered it, so the boot order is not a separate list that could diverge; the registries and routes are derived afterwards, from a set that has already proven to close." }
          ],
          see: { label: { es: "Abrir radiografía del runtime", en: "Open the runtime x-ray" }, href: "../artifacts/#runtime", note: { es: "Avanza fase por fase y contrasta modelo didáctico con implementación auditada.", en: "Advance phase by phase and contrast the teaching model with the audited implementation." } },
          do: { label: { es: "Comprobar doctor", en: "Check doctor" }, href: "../labs/#doctor", commands: ["php bin/coa doctor", "php bin/coa inspect:plugins", "php bin/coa inspect:services"] },
          verify: [
            { es: "Distingue la información disponible antes y después de resolver el grafo.", en: "Tell apart the information available before and after resolving the graph." },
            { es: "Relaciona doctor e inspect como vistas complementarias.", en: "Relate doctor and inspect as complementary views." }
          ],
          sources: [{ label: { es: "Runtime", en: "Runtime" }, href: "https://github.com/getmilpa/runtime" }],
          lastVerified: "2026-07-12"
        },
        {
          id: "superficies-puertas",
          title: { es: "Superficies y sus puertas", en: "Surfaces and their doors" },
          durationMinutes: 30,
          objectives: [
            { es: "Distinguir la superficie habilitada que exige de la no habilitada que no exige nada", en: "Tell the enabled surface that demands apart from the not-enabled one that demands nothing" },
            { es: "Ubicar el adapter como el puente que proyecta un contrato hacia una puerta", en: "Locate the adapter as the bridge that projects a contract to a door" }
          ],
          understand: [
            { es: "Una superficie habilitada proyecta operaciones a través de un conjunto de capacidades. Si una de esas capacidades no tiene proveedor, la superficie tiene una puerta abierta y el runtime la expondría a medio cablear: eso es MILPA_SURFACE_REQUIREMENT_UNMET. Los arreglos son instalar al proveedor o deshabilitar la superficie hasta que exista.", en: "An enabled surface projects operations through a set of capabilities. If one of those capabilities has no provider, the surface has an open door and the runtime would expose it half-wired: that is MILPA_SURFACE_REQUIREMENT_UNMET. The fixes are to install the provider or to disable the surface until one exists." },
            { es: "Una superficie que el host no habilitó no exige nada. Cuando un contrato quiere proyectarse por ella, nada está roto — la proyección simplemente no ocurrirá — pero el desajuste se reporta (MILPA_SURFACE_NOT_ENABLED) para que sea una elección, no un accidente: habilita la superficie si quieres la proyección, o ignora el aviso si la dejaste apagada a propósito.", en: "A surface the host has not enabled demands nothing. When a contract wants to project through it, nothing is broken — the projection simply will not happen — but the mismatch is surfaced (MILPA_SURFACE_NOT_ENABLED) so it is a choice, not an accident: enable the surface if the projection is wanted, or ignore the notice if you left it off on purpose." },
            { es: "Entre el contrato y la puerta hay un adapter: coa, MCP y HTTP son adaptadores del mismo handler. Si el adapter que un contrato espera no está instalado (MILPA_ADAPTER_MISSING), el contrato no puede proyectarse donde el host lo quiere; reimplementar el dominio dentro de la puerta es exactamente lo que el modelo de adapters evita.", en: "Between the contract and the door sits an adapter: coa, MCP and HTTP are adapters of the same handler. If the adapter a contract expects is not installed (MILPA_ADAPTER_MISSING), the contract cannot be projected where the host wants it; reimplementing the domain inside the door is exactly what the adapter model avoids." }
          ],
          see: { label: { es: "Abrir El átomo y sus puertas", en: "Open The atom and its doors" }, href: "../artifacts/#atomo", note: { es: "Una Operación declarada una vez se proyecta a coa, MCP y HTTP mediante adaptadores; el artifact hace visibles las puertas y lo que cada una garantiza.", en: "An Operation declared once is projected to coa, MCP and HTTP through adapters; the artifact makes the doors visible along with what each one guarantees." } },
          do: { label: { es: "Recorrer las tres puertas", en: "Walk the three doors" }, href: "../artifacts/#atomo", commands: [] },
          verify: [
            { es: "Explica por qué una superficie habilitada exige sus capacidades y una no habilitada no exige nada.", en: "Explain why an enabled surface demands its capabilities while a not-enabled one demands nothing." },
            { es: "Ubica el adapter ausente como falla de proyección, no del dominio.", en: "Place the missing adapter as a projection failure, not a domain failure." }
          ],
          sources: [
            { label: { es: "Milpa Resolver", en: "Milpa Resolver" }, href: "https://github.com/getmilpa/resolver" },
            { label: { es: "Ver también: El átomo y sus puertas (milpa/command)", en: "See also: The atom and its doors (milpa/command)" }, href: "../artifacts/index.html#atomo" }
          ],
          lastVerified: "2026-07-12"
        },
        {
          id: "legacy-y-migracion",
          title: { es: "Legacy visible y el plan de migración", en: "Visible legacy and the migration plan" },
          durationMinutes: 35,
          objectives: [
            { es: "Distinguir el legacy tolerado del legacy no permitido", en: "Tell tolerated legacy apart from legacy that is not allowed" },
            { es: "Leer el MigrationPlan como propuesta de solo lectura", en: "Read the MigrationPlan as a read-only proposal" }
          ],
          understand: [
            { es: "Una dependencia puede cerrar a través de un manifiesto con forma legacy. Está permitido, pero jamás es silencioso: el reporte lo nombra (MILPA_LEGACY_CONTRACT_ACTIVE) y el status degrada a legacy_compatible. La compatibilidad legacy se nombra para que siga visible en lugar de decaer en arqueología invisible.", en: "A dependency may close through a legacy-shaped manifest. This is allowed, but never silent: the report names it (MILPA_LEGACY_CONTRACT_ACTIVE) and the status degrades to legacy_compatible. Legacy compatibility is named so it stays visible instead of decaying into invisible archaeology." },
            { es: "allowedLegacyContracts en el perfil del host es una puerta, no una nota: un camino legacy que la allowlist no permite bloquea con MILPA_LEGACY_NOT_ALLOWED en lugar de degradar. Y lo deprecado avisa antes de romper: MILPA_DEPRECATED_CONTRACT_USED funciona hoy, pero la metadata anuncia que esa forma está programada para irse, y migrar antes de la remoción es más barato que después.", en: "allowedLegacyContracts in the host profile is a gate, not a note: a legacy path the allowlist does not permit blocks with MILPA_LEGACY_NOT_ALLOWED instead of degrading. And deprecation warns before it breaks: MILPA_DEPRECATED_CONTRACT_USED works today, but the metadata announces that shape is scheduled to leave, and migrating before removal is cheaper than after." },
            { es: "La salida tiene plan: coa:migrate:plan no cambia nada — solo produce plan. Por paquete lista Detected, Recommended, Steps (con la re-inspección siempre al final), Compatibility y Academy. La línea de compatibilidad es honesta y va verbatim: el plan nunca inventa una fecha límite que el código no declara.", en: "The way out has a plan: coa:migrate:plan changes nothing — it only produces a plan. Per package it lists Detected, Recommended, Steps (with the re-inspect always last), Compatibility and Academy. The compatibility line is honest and goes verbatim: the plan never invents a deadline the code doesn't declare." }
          ],
          see: { label: { es: "Abrir la frontera", en: "Open the frontier" }, href: "../artifacts/#frontera", note: { es: "La misma disciplina: cuando dos representaciones divergen, la divergencia se nombra y se repara desde la fuente de verdad, nunca se deja decaer en silencio.", en: "The same discipline: when two representations diverge, the divergence is named and repaired from the source of truth, never left to decay in silence." } },
          do: { label: { es: "Leer el contrato del plan (comando del host)", en: "Read the plan's contract (host command)" }, href: "https://github.com/getmilpa/resolver", commands: ["php coa coa:migrate:plan"] },
          verify: [
            { es: "Distingue el status legacy_compatible del bloqueo por allowedLegacyContracts.", en: "Tell the legacy_compatible status apart from the block enforced by allowedLegacyContracts." },
            { es: "Explica por qué el plan de migración es de solo lectura y su compatibilidad no inventa fechas.", en: "Explain why the migration plan is read-only and its compatibility invents no dates." }
          ],
          sources: [{ label: { es: "Milpa Resolver", en: "Milpa Resolver" }, href: "https://github.com/getmilpa/resolver" }],
          lastVerified: "2026-07-12"
        },
        {
          id: "riesgos-aceptados",
          title: { es: "Bootear con advertencias: riesgos aceptados", en: "Booting with warnings: accepted risks" },
          durationMinutes: 30,
          objectives: [
            { es: "Leer bootable_with_warnings como estado deliberado del semáforo", en: "Read bootable_with_warnings as a deliberate state of the traffic light" },
            { es: "Aceptar un riesgo con razón, expiración y reloj", en: "Accept a risk with a reason, an expiry and a clock" }
          ],
          understand: [
            { es: "bootable_with_warnings existe a propósito: todas las dependencias requeridas cierran, pero el grafo carga advertencias — capacidades sugeridas sin proveedor o superficies con salvedades declaradas. El host puede bootear con los trade-offs explícitos (MILPA_BOOTABLE_WITH_WARNINGS): cada advertencia se revisa o se registra como riesgo aceptado; ninguna se borra.", en: "bootable_with_warnings exists on purpose: every required dependency closes, but the graph carries warnings — suggested capabilities without providers, or surfaces with declared caveats. The host can boot with the trade-offs made explicit (MILPA_BOOTABLE_WITH_WARNINGS): each warning is reviewed or recorded as an accepted risk; none is erased." },
            { es: "Aceptar un riesgo exige una razón — aceptar sin decir por qué lo silencia, y una advertencia silenciada es exactamente lo que acceptedRisks existe para prevenir — y puede llevar una expiración. Pero el resolver es puro y nunca lee el reloj de pared: quien llama aporta evaluatedAt. Un expiry que corre sin reloj es MILPA_RISK_EXPIRY_UNEVALUATED: un riesgo que crees acotado pero que nadie está haciendo cumplir.", en: "Accepting a risk demands a reason — accepting without saying why silences it, and a silenced warning is exactly what acceptedRisks exists to prevent — and it may carry an expiry. But the resolver is pure and never reads the wall clock: the caller supplies evaluatedAt. An expiry that runs without a clock is MILPA_RISK_EXPIRY_UNEVALUATED: a risk you think is bounded but nobody is enforcing." },
            { es: "Sugerido significa opcional: una capacidad sugerida sin proveedor no bloquea el grafo (MILPA_SUGGESTED_CAPABILITY_MISSING); aplica la ruta de fallback y el mensaje nombra a dónde degrada el runtime, para que la conducta ausente sea visible en lugar de desaparecer.", en: "Suggested means optional: a suggested capability with no provider doesn't block the graph (MILPA_SUGGESTED_CAPABILITY_MISSING); the fallback path applies and the message names where the runtime degrades to, so the absent behaviour stays visible instead of vanishing." }
          ],
          see: { label: { es: "Operar la compuerta", en: "Operate the gate" }, href: "../artifacts/#compuerta", note: { es: "Aceptar un riesgo es una decisión con actor, razón y contexto: la compuerta muestra cómo una decisión así queda auditable en lugar de volverse un atajo invisible.", en: "Accepting a risk is a decision with an actor, a reason and context: the gate shows how such a decision stays auditable instead of becoming an invisible shortcut." } },
          do: { label: { es: "Inspeccionar la arquitectura (comando del host)", en: "Inspect the architecture (host command)" }, href: "https://github.com/getmilpa/resolver", commands: ["php coa coa:inspect architecture"] },
          verify: [
            { es: "Distingue la advertencia revisable del riesgo aceptado con razón.", en: "Tell a reviewable warning apart from a risk accepted with a reason." },
            { es: "Explica por qué un expiry sin evaluatedAt no está acotando nada.", en: "Explain why an expiry without evaluatedAt isn't bounding anything." }
          ],
          sources: [{ label: { es: "Milpa Resolver", en: "Milpa Resolver" }, href: "https://github.com/getmilpa/resolver" }],
          lastVerified: "2026-07-12"
        },
        {
          id: "estado-log",
          title: { es: "El proceso es el log", en: "The process is the log" },
          durationMinutes: 35,
          objectives: [
            { es: "Distinguir evento de snapshot", en: "Tell an event apart from a snapshot" },
            { es: "Reconstruir estado por replay", en: "Reconstruct state by replay" }
          ],
          understand: [
            { es: "Cuando cada transición significativa queda como evento, el estado puede reconstruirse y una decisión puede explicarse. El snapshot acelera lectura; no reemplaza la historia.", en: "When every meaningful transition is recorded as an event, state can be reconstructed and a decision can be explained. The snapshot speeds up reads; it doesn't replace the history." }
          ],
          see: { label: { es: "Ejecutar el replay", en: "Run the replay" }, href: "../artifacts/#event-log", note: { es: "Añade eventos, rebobina y compara estado derivado con la secuencia.", en: "Add events, rewind and compare the derived state against the sequence." } },
          do: { label: { es: "Inspeccionar contratos de event store", en: "Inspect the event store contracts" }, href: "https://github.com/getmilpa/event-store", commands: [] },
          verify: [
            { es: "Deriva el estado mostrado desde eventos ordenados.", en: "Derive the displayed state from ordered events." },
            { es: "Identifica la evidencia perdida al persistir únicamente el último estado.", en: "Identify the evidence lost when persisting only the latest state." }
          ],
          sources: [{ label: { es: "Event Store", en: "Event Store" }, href: "https://github.com/getmilpa/event-store" }],
          lastVerified: verifiedAt
        },
        {
          id: "contrato-ejecutable",
          title: { es: "El contrato visual se ejecuta", en: "The visual contract is executable" },
          durationMinutes: 35,
          objectives: [
            { es: "Leer estructura, estados y a11y como un contrato", en: "Read structure, states and a11y as a contract" },
            { es: "Comprobar paridad dark/light", en: "Check dark/light parity" }
          ],
          understand: [
            { es: "Una clase CSS no es suficiente contrato. Milpa Design documenta anatomía, estados, tokens, accesibilidad, motion y ejemplos, y los gates comprueban que el paquete publicado preserve esas promesas.", en: "A CSS class isn't enough of a contract. Milpa Design documents anatomy, states, tokens, accessibility, motion and examples, and the gates check that the published package preserves those promises." }
          ],
          see: { label: { es: "Medir el contrato", en: "Measure the contract" }, href: "../artifacts/#design-contract", note: { es: "Inspecciona contraste AA y cambia superficie sin alterar el contenido.", en: "Inspect AA contrast and change surface without altering the content." } },
          do: { label: { es: "Consultar @milpa/design", en: "Check @milpa/design" }, href: "https://github.com/getmilpa/milpa-design", commands: ["npm test"] },
          verify: [
            { es: "El componente conserva significado sin depender solo del color.", en: "The component keeps its meaning without relying on color alone." },
            { es: "La versión consumida está fijada y no sigue main accidentalmente.", en: "The consumed version is pinned and doesn't follow main by accident." }
          ],
          sources: [{ label: { es: "Design", en: "Design" }, href: "https://github.com/getmilpa/milpa-design" }],
          lastVerified: verifiedAt
        },
        {
          id: "plan-disco",
          title: { es: "El plan antes del disco", en: "The plan before the disk" },
          durationMinutes: 40,
          objectives: [
            { es: "Separar preflight, escritura y verificación", en: "Separate preflight, writing and verification" },
            { es: "Evitar atribuir --dry-run al CLI público", en: "Avoid attributing --dry-run to the public CLI" }
          ],
          understand: [
            { es: "Los generadores actuales hacen preflight, escriben y verifican ciertos resultados. Internamente producen un GenerationResult inspeccionable, pero el skeleton público no expone --dry-run.", en: "The current generators run preflight, write and verify certain results. Internally they produce an inspectable GenerationResult, but the public skeleton doesn't expose --dry-run." },
            { es: "La lección es revisar alcance y conflictos antes de mutar, no documentar una bandera inexistente.", en: "The lesson is to review scope and conflicts before mutating, not to document a flag that doesn't exist." }
          ],
          see: { label: { es: "Abrir el plan antes del disco", en: "Open the plan before the disk" }, href: "../artifacts/#plan", note: { es: "Explora la secuencia conceptual y conserva visible la diferencia con el CLI publicado.", en: "Explore the conceptual sequence and keep the difference from the published CLI in view." } },
          do: { label: { es: "Generar e inspeccionar", en: "Generate and inspect" }, href: "../labs/#route", commands: ["php bin/coa make:controller CatalogPlugin HealthController --path=/health", "php bin/coa inspect:routes"] },
          verify: [
            { es: "Distingue el plan interno de una bandera --dry-run que el CLI público no expone.", en: "Tell the internal plan apart from a --dry-run flag that the public CLI doesn't expose." },
            { es: "Comprueba el registro resultante después de generar.", en: "Check the resulting registration after generating." }
          ],
          sources: [{ label: { es: "Devtools", en: "Devtools" }, href: "https://github.com/getmilpa/devtools" }],
          lastVerified: verifiedAt
        }
      ]
    },
    {
      id: "disena",
      title: { es: "Diseña con Milpa", en: "Design with Milpa" },
      eyebrow: { es: "Sistema visual", en: "Visual system" },
      level: { es: "Intermedio", en: "Intermediate" },
      audience: { es: "Frontend y diseño", en: "Frontend and design" },
      durationMinutes: 90,
      summary: { es: "Usa el lenguaje visual publicado, compón comportamiento en la aplicación y promueve patrones con evidencia.", en: "Use the published visual language, compose behavior in the application and promote patterns with evidence." },
      prerequisites: ["fundamentos"],
      units: [
        {
          id: "capas-visuales",
          title: { es: "Las seis capas", en: "The six layers" },
          durationMinutes: 25,
          objectives: [
            { es: "Reconocer la cascada publicada", en: "Recognize the published cascade" },
            { es: "Elegir la capa correcta para cada pieza", en: "Choose the right layer for each piece" }
          ],
          understand: [
            { es: "Tokens nombran decisiones; motion define movimiento; primitives resuelven controles; components forman piezas; artifacts expresan contenido; layouts organizan páginas.", en: "Tokens name decisions; motion defines movement; primitives resolve controls; components form pieces; artifacts express content; layouts organize pages." }
          ],
          see: { label: { es: "Inspeccionar contrato visual", en: "Inspect the visual contract" }, href: "../artifacts/#design-contract", note: { es: "Relaciona el selector visible con su contrato y sus gates.", en: "Relate the visible selector to its contract and its gates." } },
          do: { label: { es: "Abrir npm publicado", en: "Open the published npm package" }, href: "https://www.npmjs.com/package/@milpa/design", commands: [] },
          verify: [
            { es: "Ordena las seis capas según su contrato de carga.", en: "Order the six layers by their load contract." },
            { es: "Prioriza tokens semánticos existentes sobre valores visuales nuevos.", en: "Prioritize existing semantic tokens over new visual values." }
          ],
          sources: [{ label: { es: "Design package", en: "Design package" }, href: "https://www.npmjs.com/package/@milpa/design" }],
          lastVerified: verifiedAt
        },
        {
          id: "composicion-app",
          title: { es: "Design da lenguaje; Academy da conducta", en: "Design gives language; Academy gives behavior" },
          durationMinutes: 30,
          objectives: [
            { es: "Mantener lógica fuera del paquete CSS", en: "Keep logic out of the CSS package" },
            { es: "Crear composición local sin duplicar anatomía mui-*", en: "Create a local composition without duplicating mui-* anatomy" }
          ],
          understand: [
            { es: "Milpa Design publica CSS y contratos, no JavaScript. Academy controla rutas, progreso, datos del currículo y verificadores. Sus clases ac-* cosen el caso educativo sin redefinir componentes estables.", en: "Milpa Design publishes CSS and contracts, not JavaScript. Academy controls routing, progress, curriculum data and verifiers. Its ac-* classes stitch the educational case together without redefining stable components." }
          ],
          see: { label: { es: "Abrir la galería", en: "Open the gallery" }, href: "../artifacts/", note: { es: "Las piezas mui-plot, mui-pipeline, mui-gate y mui-replay reciben escenarios y estado desde Academy.", en: "The mui-plot, mui-pipeline, mui-gate and mui-replay pieces receive scenarios and state from Academy." } },
          do: { label: { es: "Comparar artifacts y lógica", en: "Compare artifacts and logic" }, href: "../artifacts/README.md", commands: [] },
          verify: [
            { es: "Separa la lógica Academy del contrato CSS publicado.", en: "Separate Academy's logic from the published CSS contract." },
            { es: "Distingue una composición ac-* específica de un componente genérico.", en: "Tell a specific ac-* composition apart from a generic component." }
          ],
          sources: [{ label: { es: "Design governance", en: "Design governance" }, href: "https://github.com/getmilpa/milpa-design" }],
          lastVerified: verifiedAt
        },
        {
          id: "promocion-patron",
          title: { es: "De candidato local a patrón público", en: "From local candidate to public pattern" },
          durationMinutes: 35,
          objectives: [
            { es: "Aplicar la regla de promoción", en: "Apply the promotion rule" },
            { es: "Reunir evidencia antes de generalizar", en: "Gather evidence before generalizing" }
          ],
          understand: [
            { es: "Academy es laboratorio: puede inventar una composición ac-*. Design decide si sobrevive como mui-* cuando existe un caso real, aparece al menos dos veces, admite contrato, pasa gates y se consume sin hacks.", en: "Academy is a laboratory: it can invent an ac-* composition. Design decides whether it survives as mui-* when there is a real case, it shows up at least twice, it supports a contract, it passes gates and it's consumed without hacks." }
          ],
          see: { label: { es: "Ver el precedente de artifacts", en: "See the artifacts precedent" }, href: "../artifacts/", note: { es: "El cluster nació como composición local y hoy se consume desde @milpa/design@0.9.0.", en: "The cluster started as a local composition and today is consumed from @milpa/design@0.9.0." } },
          do: { label: { es: "Leer cómo contribuir", en: "Read how to contribute" }, href: "https://github.com/getmilpa/milpa-design", commands: [] },
          verify: [
            { es: "Exige dos usos reales o evidencia fuerte antes de promover.", en: "Require two real uses or strong evidence before promoting." },
            { es: "Describe al candidato mediante anatomía, estados, a11y y motion.", en: "Describe the candidate through anatomy, states, a11y and motion." }
          ],
          sources: [{ label: { es: "Design", en: "Design" }, href: "https://github.com/getmilpa/milpa-design" }],
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

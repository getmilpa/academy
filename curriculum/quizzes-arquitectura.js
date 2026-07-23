(function () {
  "use strict";

  globalThis.MilpaQuizBank.register({
    "arquitectura/atlas-limites": {
      passScore: 4,
      questions: [
        {
          id: "arquitectura-atlas-limites-01",
          prompt: {
            es: "`doctor` confirma que el kernel arrancó y `/reports` responde por HTTP, pero `inspect:tools` no muestra `GenerateReport`. ¿Qué límite conviene auditar primero?",
            en: "`doctor` confirms the kernel booted and `/reports` responds over HTTP, but `inspect:tools` doesn't show `GenerateReport`. Which boundary should you audit first?"
          },
          options: [
            { id: "a", text: { es: "El registro y el pipeline de tools en `tool-runtime`, empezando por `ToolRegistry`.", en: "The tool registry and pipeline in `tool-runtime`, starting with `ToolRegistry`." } },
            { id: "b", text: { es: "La secuencia general de boot en `runtime`, porque toda ausencia posterior pertenece al kernel.", en: "The general boot sequence in `runtime`, because any later absence belongs to the kernel." } },
            { id: "c", text: { es: "El event store, porque una tool no existe hasta que deja un evento persistido.", en: "The event store, because a tool doesn't exist until it leaves a persisted event." } }
          ],
          answer: "a",
          explanation: {
            es: "Boot y HTTP ya aportan evidencia positiva sobre otros límites. La ausencia ocurre en el registro especializado de tools; el atlas debe llevar primero a `tool-runtime` y luego seguir sus contratos, sin atribuir todo al kernel.",
            en: "Boot and HTTP already give you positive evidence about other boundaries. The absence sits in the specialized tool registry; the atlas should lead first to `tool-runtime` and then follow its contracts, instead of blaming the kernel for everything."
          }
        },
        {
          id: "arquitectura-atlas-limites-02",
          prompt: {
            es: "Un tutorial afirma: «Core ejecuta y persiste las aprobaciones porque define `VerificationResult`». ¿Cuál es la corrección arquitectónica más precisa?",
            en: "A tutorial claims: \"Core executes and persists approvals because it defines `VerificationResult`.\" What is the most precise architectural correction?"
          },
          options: [
            { id: "a", text: { es: "Mantener la afirmación: quien define un tipo necesariamente es dueño de toda su ejecución y persistencia.", en: "Keep the claim: whoever defines a type necessarily owns all of its execution and persistence." } },
            { id: "b", text: { es: "Separar responsabilidades: Core define el contrato triestado; Workflow implementa la maquinaria y Orchestrator/Event Store aportan proceso e historia según el caso.", en: "Separate the responsibilities: Core defines the three-state contract; Workflow implements the machinery and Orchestrator/Event Store contribute process and history as the case requires." } },
            { id: "c", text: { es: "Mover `VerificationResult` a Academy para que la interfaz y la experiencia educativa tengan un solo dueño.", en: "Move `VerificationResult` into Academy so the interface and the educational experience share a single owner." } }
          ],
          answer: "b",
          explanation: {
            es: "Definir una interfaz no implica poseer cada implementación. El mapa actual distingue el contrato mínimo en Core, la máquina de verificación en Workflow y la coordinación o persistencia en paquetes especializados.",
            en: "Defining an interface doesn't imply owning every implementation. The current map distinguishes the minimal contract in Core, the verification machine in Workflow, and coordination or persistence in specialized packages."
          }
        },
        {
          id: "arquitectura-atlas-limites-03",
          prompt: {
            es: "Una nueva tarjeta del atlas dice que un paquete «es dueño de la autorización», pero solo enlaza a la portada de la organización y no identifica interface, manifest ni archivo. ¿Cómo debe publicarse?",
            en: "A new atlas card says a package \"owns authorization,\" but it only links to the organization's landing page and identifies no interface, manifest or file. How should it be published?"
          },
          options: [
            { id: "a", text: { es: "Como hecho verificado, porque el nombre del paquete hace plausible la responsabilidad.", en: "As a verified fact, because the package name makes the responsibility plausible." } },
            { id: "b", text: { es: "Como detalle interno estable, sin fuente, para no distraer al lector con enlaces.", en: "As a stable internal detail, with no source, so links don't distract the reader." } },
            { id: "c", text: { es: "Como hipótesis pendiente, o no publicarse, hasta terminar en una fuente primaria que sostenga la afirmación.", en: "As a pending hypothesis, or not published at all, until it lands on a primary source that backs the claim." } }
          ],
          answer: "c",
          explanation: {
            es: "El atlas orienta la auditoría, no sustituye evidencia. Una afirmación importante solo se marca verificada cuando puede seguirse hasta un contrato o implementación primaria fechada.",
            en: "The atlas guides the audit; it doesn't replace evidence. An important claim is only marked verified when it can be traced to a dated primary contract or implementation."
          }
        },
        {
          id: "arquitectura-atlas-limites-04",
          prompt: {
            es: "El milpa.json de ReportsPlugin declara que provee `exports`, pero el #[PluginMetadata] del código ya no la declara. Un tutorial cita ese manifiesto como evidencia de la capacidad. ¿Cuál es la lectura correcta?",
            en: "ReportsPlugin's milpa.json declares that it provides `exports`, but the code's #[PluginMetadata] no longer declares it. A tutorial cites that manifest as evidence of the capability. What is the correct reading?"
          },
          options: [
            { id: "a", text: { es: "El manifiesto manda: si milpa.json declara `exports`, la capacidad existe y el mapa puede citarla como hecho verificado.", en: "The manifest rules: if milpa.json declares `exports`, the capability exists and the map can cite it as a verified fact." } },
            { id: "b", text: { es: "Es MILPA_MANIFEST_DRIFT: el contrato que enseña es el que corre, no el que se escribe — toda decisión tomada desde ese manifiesto hereda la brecha, y el arreglo es regenerarlo desde el código con php coa coa:plugins manifest ReportsPlugin (comando del host).", en: "It is MILPA_MANIFEST_DRIFT: the contract that teaches is the one that runs, not the one that is written — every decision made from that manifest inherits the gap, and the fix is to regenerate it from the code with php coa coa:plugins manifest ReportsPlugin (a host command)." } },
            { id: "c", text: { es: "Basta con editar milpa.json a mano para quitar `exports`; mantener sincronizados manifiesto y código es disciplina del editor.", en: "Hand-editing milpa.json to drop `exports` is enough; keeping manifest and code in sync is the editor's discipline." } }
          ],
          answer: "b",
          explanation: {
            es: "El DriftDetector compara lo que milpa.json declara contra lo que el código trae en #[PluginMetadata]; cuando divergen, la fuente de verdad es el código, porque ese es el contrato que corre. Un manifiesto con drift enseña una forma que ya no existe a humanos y agentes por igual. Por eso el arreglo es regenerativo — reescribir el manifiesto desde el código — y no una edición manual que puede volver a divergir en silencio.",
            en: "The DriftDetector compares what milpa.json declares against what the code carries in #[PluginMetadata]; when they diverge, the source of truth is the code, because that is the contract that runs. A drifted manifest teaches humans and agents alike a shape that no longer exists. That is why the fix is regenerative — rewrite the manifest from the code — not a hand edit that can silently diverge again."
          }
        }
      ]
    },
    "arquitectura/runtime-boot": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-runtime-boot-01",
          prompt: {
            es: "El manifest de `BillingPlugin` requiere `payments`, pero ningún plugin la provee. Alguien propone registrar sus rutas de todos modos para que el equipo pueda probarlas. ¿Qué debe hacer el runtime?",
            en: "`BillingPlugin`'s manifest requires `payments`, but no plugin provides it. Someone proposes registering its routes anyway so the team can try them out. What should the runtime do?"
          },
          options: [
            { id: "a", text: { es: "Exponer las rutas y fallar solo cuando una petición use `payments`.", en: "Expose the routes and fail only when a request uses `payments`." } },
            { id: "b", text: { es: "Fallar al resolver el grafo antes de completar boot y antes de exponer registries derivados.", en: "Fail while resolving the graph, before completing boot and before exposing any derived registries." } },
            { id: "c", text: { es: "Inventar una capacidad `payments` vacía para conservar el orden de arranque.", en: "Invent an empty `payments` capability to preserve the boot order." } }
          ],
          answer: "b",
          explanation: {
            es: "Las rutas y servicios solo deben derivarse de un conjunto de plugins válido. Diferir la dependencia ausente hasta atender tráfico convertiría una condición verificable de boot en un fallo tardío.",
            en: "Routes and services must only be derived from a valid set of plugins. Deferring the missing dependency until traffic arrives would turn a verifiable boot condition into a late failure."
          }
        },
        {
          id: "arquitectura-runtime-boot-02",
          prompt: {
            es: "¿Qué información distingue correctamente el momento anterior y posterior a resolver el grafo de plugins?",
            en: "Which information correctly distinguishes the moment before and the moment after the plugin graph is resolved?"
          },
          options: [
            { id: "a", text: { es: "Antes se conocen manifests y contratos `provides/requires`; después se conoce un orden de boot válido derivado de esas relaciones.", en: "Before, you know the manifests and the `provides/requires` contracts; after, you know a valid boot order derived from those relationships." } },
            { id: "b", text: { es: "Antes ya existe el orden de boot definitivo; después solo se ordenan alfabéticamente las rutas.", en: "Before, the definitive boot order already exists; after, the routes are merely sorted alphabetically." } },
            { id: "c", text: { es: "Antes se ejecutan controladores; después se descubren por primera vez los plugins que los contienen.", en: "Before, controllers run; after, the plugins that contain them are discovered for the first time." } }
          ],
          answer: "a",
          explanation: {
            es: "El resolver necesita primero las declaraciones del conjunto. El orden no es una lista manual ni alfabética: es una consecuencia del grafo validado y habilita las fases de registro posteriores.",
            en: "The resolver first needs the declarations of the set. The order is neither a manual nor an alphabetical list: it's a consequence of the validated graph and it enables the later registration phases."
          }
        },
        {
          id: "arquitectura-runtime-boot-03",
          prompt: {
            es: "`php bin/coa doctor` reporta kernel, contenedor y plugins saludables, pero `/catalog` no aparece. ¿Cuál es la siguiente secuencia de diagnóstico con mejor evidencia?",
            en: "`php bin/coa doctor` reports a healthy kernel, container and plugins, but `/catalog` doesn't appear. What is the next diagnostic sequence with the strongest evidence?"
          },
          options: [
            { id: "a", text: { es: "Reinstalar el skeleton; un `doctor` saludable descarta cualquier error de registro.", en: "Reinstall the skeleton; a healthy `doctor` rules out any registration error." } },
            { id: "b", text: { es: "Editar directamente el registry de rutas para agregar `/catalog` y volver a ejecutar `doctor`.", en: "Edit the route registry directly to add `/catalog` and run `doctor` again." } },
            { id: "c", text: { es: "Usar `inspect:plugins` para confirmar el plugin y `inspect:routes` para comprobar el registro específico; revisar servicios si esa traza lo requiere.", en: "Use `inspect:plugins` to confirm the plugin and `inspect:routes` to check the specific registration; review services if that trace calls for it." } }
          ],
          answer: "c",
          explanation: {
            es: "`doctor` da una vista de salud transversal; los comandos `inspect:*` muestran registries concretos. Son evidencias complementarias: boot saludable no demuestra que una ruta particular fue declarada y registrada.",
            en: "`doctor` gives a cross-cutting health view; the `inspect:*` commands show concrete registries. They are complementary evidence: a healthy boot doesn't prove that a particular route was declared and registered."
          }
        }
      ]
    },
    "arquitectura/superficies-puertas": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-superficies-puertas-01",
          prompt: {
            es: "El host habilita la superficie `mcp`, que proyecta operaciones a través de la capacidad `tool-registry` — y ningún proveedor la ofrece. ¿Qué debe hacer el resolver?",
            en: "The host enables the `mcp` surface, which projects operations through the `tool-registry` capability — and no provider offers it. What should the resolver do?"
          },
          options: [
            { id: "a", text: { es: "Reportar MILPA_SURFACE_REQUIREMENT_UNMET: la superficie tiene una puerta abierta y el runtime la expondría a medio cablear.", en: "Report MILPA_SURFACE_REQUIREMENT_UNMET: the surface has an open door and the runtime would expose it half-wired." } },
            { id: "b", text: { es: "Ignorar la ausencia: las superficies solo agregan capacidades, nunca las exigen.", en: "Ignore the absence: surfaces only add capabilities, they never demand them." } },
            { id: "c", text: { es: "Deshabilitar la superficie en silencio y continuar el boot como si nunca hubiera estado habilitada.", en: "Silently disable the surface and continue booting as if it had never been enabled." } }
          ],
          answer: "a",
          explanation: {
            es: "Una superficie habilitada exige sus capacidades: exponerla sin proveedor sería publicarla medio cableada. Los arreglos del catálogo son instalar un paquete que provea la capacidad o deshabilitar la superficie hasta que exista; apagarla en silencio escondería la decisión.",
            en: "An enabled surface demands its capabilities: exposing it without a provider would publish it half-wired. The catalog's fixes are to install a package that provides the capability or to disable the surface until one exists; silently turning it off would hide the decision."
          }
        },
        {
          id: "arquitectura-superficies-puertas-02",
          prompt: {
            es: "Un contrato quiere proyectarse por la superficie `http`, que el host NO habilitó. ¿Cuál es la lectura correcta del reporte?",
            en: "A contract wants to project through the `http` surface, which the host did NOT enable. What is the correct reading of the report?"
          },
          options: [
            { id: "a", text: { es: "Es un bloqueo equivalente al de una capacidad requerida sin proveedor.", en: "It's a block equivalent to a required capability with no provider." } },
            { id: "b", text: { es: "MILPA_SURFACE_NOT_ENABLED: nada está roto — la proyección simplemente no ocurrirá — pero el desajuste se hace visible para que sea una elección, no un accidente.", en: "MILPA_SURFACE_NOT_ENABLED: nothing is broken — the projection simply will not happen — but the mismatch is surfaced so it is a choice, not an accident." } },
            { id: "c", text: { es: "El resolver habilita la superficie automáticamente, porque un contrato la está pidiendo.", en: "The resolver enables the surface automatically, because a contract is asking for it." } }
          ],
          answer: "b",
          explanation: {
            es: "Una superficie no habilitada no exige nada. El código existe para que el host confirme su intención: habilitar la superficie en el perfil si quiere la proyección, o ignorar el aviso si la dejó apagada a propósito. Habilitarla sola sería una decisión invisible.",
            en: "A not-enabled surface demands nothing. The code exists so the host confirms its intent: enable the surface in the profile if the projection is wanted, or ignore the notice if it was left off on purpose. Enabling it by itself would be an invisible decision."
          }
        },
        {
          id: "arquitectura-superficies-puertas-03",
          prompt: {
            es: "Un contrato espera el adapter que lo puentea hacia una superficie y ese adapter no está instalado (MILPA_ADAPTER_MISSING). Alguien propone reimplementar el handler dentro de la puerta. ¿Cuál es la evaluación correcta?",
            en: "A contract expects the adapter that bridges it to a surface and that adapter is not installed (MILPA_ADAPTER_MISSING). Someone proposes reimplementing the handler inside the door. What is the correct assessment?"
          },
          options: [
            { id: "a", text: { es: "Aceptable: cada superficie debería tener su propia implementación del dominio para no depender de adapters.", en: "Acceptable: each surface should carry its own implementation of the domain so it doesn't depend on adapters." } },
            { id: "b", text: { es: "Innecesario: si falta el adapter, la proyección ocurre directa contra el handler.", en: "Unnecessary: if the adapter is missing, the projection happens directly against the handler." } },
            { id: "c", text: { es: "Incorrecto: sin el adapter el contrato no puede proyectarse donde el host lo quiere, y el arreglo es instalar el paquete o plugin que lo aporta — no duplicar el dominio en la puerta.", en: "Incorrect: without the adapter the contract cannot be projected where the host wants it, and the fix is to install the package or plugin that supplies it — not to duplicate the domain at the door." } }
          ],
          answer: "c",
          explanation: {
            es: "El átomo se declara una vez y cada puerta lo proyecta mediante un adapter: coa, MCP y HTTP son adaptadores del mismo handler. Si falta el puente, la proyección no puede ocurrir; reimplementar el dominio en la entrada es exactamente la segunda implementación que el modelo evita.",
            en: "The atom is declared once and each door projects it through an adapter: coa, MCP and HTTP are adapters of the same handler. If the bridge is missing, the projection cannot happen; reimplementing the domain at the entry is exactly the second implementation the model avoids."
          }
        }
      ]
    },
    "arquitectura/legacy-y-migracion": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-legacy-y-migracion-01",
          prompt: {
            es: "Un contrato cierra a través de un manifiesto con forma legacy y el perfil del host lo permite. ¿Qué debe reflejar el reporte de resolución?",
            en: "A contract closes through a legacy-shaped manifest and the host profile permits it. What should the resolution report reflect?"
          },
          options: [
            { id: "a", text: { es: "Status `valid` sin menciones: si el camino está permitido, no hay nada que reportar.", en: "Status `valid` with no mentions: if the path is permitted, there is nothing to report." } },
            { id: "b", text: { es: "MILPA_LEGACY_CONTRACT_ACTIVE y status `legacy_compatible`: permitido, pero jamás silencioso.", en: "MILPA_LEGACY_CONTRACT_ACTIVE and status `legacy_compatible`: allowed, but never silent." } },
            { id: "c", text: { es: "Status `blocked`: cualquier forma legacy impide el boot hasta migrar.", en: "Status `blocked`: any legacy shape prevents boot until it's migrated." } }
          ],
          answer: "b",
          explanation: {
            es: "El legacy tolerado degrada el status a legacy_compatible y queda nombrado en el reporte. La compatibilidad se nombra para que siga visible en lugar de decaer en arqueología invisible: silenciarla convertiría el permiso en deuda oculta, y bloquearla negaría un camino que el host sí permitió.",
            en: "Tolerated legacy degrades the status to legacy_compatible and is named in the report. The compatibility is named so it stays visible instead of decaying into invisible archaeology: silencing it would turn the permission into hidden debt, and blocking it would deny a path the host did allow."
          }
        },
        {
          id: "arquitectura-legacy-y-migracion-02",
          prompt: {
            es: "El perfil del host declara `allowedLegacyContracts: [\"billing\"]` y el contrato `reports` solo puede resolver a través de una forma legacy. ¿Qué resultado corresponde?",
            en: "The host profile declares `allowedLegacyContracts: [\"billing\"]` and the `reports` contract can only resolve through a legacy shape. Which outcome is correct?"
          },
          options: [
            { id: "a", text: { es: "Degrada a `legacy_compatible`: basta con que la allowlist permita al menos un contrato legacy.", en: "It degrades to `legacy_compatible`: it's enough that the allowlist permits at least one legacy contract." } },
            { id: "b", text: { es: "MILPA_LEGACY_NOT_ALLOWED y el grafo bloquea: la allowlist es una puerta, no una nota, y una lista selectiva es una frontera deliberada que el resolver hace cumplir.", en: "MILPA_LEGACY_NOT_ALLOWED and the graph blocks: the allowlist is a gate, not a note, and a selective list is a deliberate boundary the resolver enforces." } },
            { id: "c", text: { es: "El resolver agrega `reports` a la allowlist y anota la ampliación como advertencia.", en: "The resolver adds `reports` to the allowlist and records the expansion as a warning." } }
          ],
          answer: "b",
          explanation: {
            es: "A diferencia del legacy tolerado — que degrada a legacy_compatible — un camino legacy que la allowlist no permite bloquea. Los arreglos son explícitos: agregar el contrato a allowedLegacyContracts de forma consciente, permitir todo con [\"*\"], o migrarlo a la forma canónica para que no necesite permiso legacy.",
            en: "Unlike tolerated legacy — which degrades to legacy_compatible — a legacy path the allowlist does not permit blocks. The fixes are explicit: consciously add the contract to allowedLegacyContracts, permit everything with [\"*\"], or migrate it to the canonical shape so it no longer needs a legacy allowance."
          }
        },
        {
          id: "arquitectura-legacy-y-migracion-03",
          prompt: {
            es: "Un equipo corre `php coa coa:migrate:plan` sobre un host con contratos legacy y deprecados. ¿Qué garantiza ese comando?",
            en: "A team runs `php coa coa:migrate:plan` on a host with legacy and deprecated contracts. What does that command guarantee?"
          },
          options: [
            { id: "a", text: { es: "Ejecuta la migración paso a paso y actualiza los manifiestos afectados.", en: "It executes the migration step by step and updates the affected manifests." } },
            { id: "b", text: { es: "Calcula una fecha límite para cada contrato deprecado a partir de su antigüedad.", en: "It computes a deadline for each deprecated contract based on its age." } },
            { id: "c", text: { es: "No cambia nada — solo produce plan: por paquete lista Detected, Recommended, Steps, Compatibility y Academy, con una compatibilidad honesta que no inventa fechas.", en: "It changes nothing — it only produces a plan: per package it lists Detected, Recommended, Steps, Compatibility and Academy, with an honest compatibility line that invents no dates." } }
          ],
          answer: "c",
          explanation: {
            es: "El plan es lectura pura: el resolver detecta, el advisor propone y nada escribe ni toca la base de datos. Los Steps van numerados con la re-inspección siempre al final, y Compatibility reproduce la cadena honesta del advisor verbatim — un plan que inventara deadlines enseñaría urgencias que el código no declara.",
            en: "The plan is pure reading: the resolver detects, the advisor proposes and nothing writes or touches the database. The Steps are numbered with the re-inspect always last, and Compatibility reproduces the advisor's honest string verbatim — a plan that invented deadlines would teach urgencies the code doesn't declare."
          }
        }
      ]
    },
    "arquitectura/riesgos-aceptados": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-riesgos-aceptados-01",
          prompt: {
            es: "Todas las dependencias requeridas cierran, pero dos capacidades sugeridas no tienen proveedor. ¿Qué status corresponde y qué implica?",
            en: "Every required dependency closes, but two suggested capabilities have no provider. Which status applies and what does it imply?"
          },
          options: [
            { id: "a", text: { es: "`blocked`: cualquier advertencia impide el boot hasta resolverla.", en: "`blocked`: any warning prevents boot until it's resolved." } },
            { id: "b", text: { es: "`valid`: las sugerencias ausentes no aparecen en el reporte para no hacer ruido.", en: "`valid`: missing suggestions don't show up in the report to avoid noise." } },
            { id: "c", text: { es: "`bootable_with_warnings`: el host puede bootear con los trade-offs explícitos, después de revisar cada advertencia o registrarla como riesgo aceptado.", en: "`bootable_with_warnings`: the host can boot with the trade-offs made explicit, after reviewing each warning or recording it as an accepted risk." } }
          ],
          answer: "c",
          explanation: {
            es: "El tercer estado del semáforo existe a propósito: distingue el grafo que cierra con salvedades del grafo bloqueado y del limpio. Las advertencias se revisan — proveyendo las capacidades sugeridas que sí quieres — o se registran como riesgos aceptados en el perfil del host; ninguna se borra.",
            en: "The third state of the traffic light exists on purpose: it tells the graph that closes with caveats apart from the blocked one and the clean one. Warnings are reviewed — providing the suggested capabilities you do want — or recorded as accepted risks in the host profile; none is erased."
          }
        },
        {
          id: "arquitectura-riesgos-aceptados-02",
          prompt: {
            es: "El perfil acepta un riesgo con su razón y `expires: \"2026-09-01\"`, pero la resolución corre sin `evaluatedAt`. ¿Qué debe hacer el resolver?",
            en: "The profile accepts a risk with its reason and `expires: \"2026-09-01\"`, but the resolution runs without `evaluatedAt`. What should the resolver do?"
          },
          options: [
            { id: "a", text: { es: "Confiar en el expiry: la aceptación se da por válida hasta esa fecha.", en: "Trust the expiry: the acceptance is assumed valid until that date." } },
            { id: "b", text: { es: "Señalar MILPA_RISK_EXPIRY_UNEVALUATED: el resolver es puro y nunca lee el reloj de pared, así que sin evaluatedAt no puede saber si la aceptación sigue vigente.", en: "Flag MILPA_RISK_EXPIRY_UNEVALUATED: the resolver is pure and never reads the wall clock, so without evaluatedAt it cannot tell whether the acceptance still holds." } },
            { id: "c", text: { es: "Leer la hora del sistema por única vez para decidir si el riesgo expiró.", en: "Read the system time just this once to decide whether the risk expired." } }
          ],
          answer: "b",
          explanation: {
            es: "Quien llama aporta el reloj (evaluatedAt) y la expiración se evalúa determinísticamente, nunca contra un reloj ambiente. Antes que confiar en un límite que jamás verificó, el resolver señala el descuido: un expiry sin evaluar es un riesgo que crees acotado pero que no se está haciendo cumplir.",
            en: "The caller supplies the clock (evaluatedAt) and the expiry is evaluated deterministically, never against an ambient clock. Rather than trusting a bound it never checked, the resolver flags the oversight: an unevaluated expiry is a risk you think is bounded but is not being enforced."
          }
        },
        {
          id: "arquitectura-riesgos-aceptados-03",
          prompt: {
            es: "La capacidad sugerida `cache` no tiene proveedor y su registro declara un fallback. ¿Qué comportamiento corresponde?",
            en: "The suggested `cache` capability has no provider and its record declares a fallback. Which behavior is correct?"
          },
          options: [
            { id: "a", text: { es: "El grafo bloquea: toda capacidad declarada, sugerida o no, exige proveedor.", en: "The graph blocks: every declared capability, suggested or not, demands a provider." } },
            { id: "b", text: { es: "MILPA_SUGGESTED_CAPABILITY_MISSING: sugerido significa opcional — el grafo cierra, aplica la ruta de fallback y el mensaje nombra a dónde degrada, para que la conducta ausente sea visible.", en: "MILPA_SUGGESTED_CAPABILITY_MISSING: suggested means optional — the graph still closes, the fallback path applies and the message names where it degrades to, so the absent behaviour stays visible." } },
            { id: "c", text: { es: "El resolver convierte el suggests en requires para el siguiente boot y exige el proveedor.", en: "The resolver converts the suggests into a requires for the next boot and demands the provider." } }
          ],
          answer: "b",
          explanation: {
            es: "Un suggests ausente degrada, no bloquea: la degradación declarada se nombra en el mensaje para que la pérdida sea visible en lugar de desaparecer. Los arreglos del catálogo son instalar el proveedor que habilita la sugerencia o aceptar la ausencia como riesgo conocido en el perfil del host.",
            en: "A missing suggests degrades, it doesn't block: the declared degradation is named in the message so the loss stays visible instead of vanishing. The catalog's fixes are to install the provider that enables the suggestion or to accept the absence as a known risk in the host profile."
          }
        }
      ]
    },
    "arquitectura/estado-log": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-estado-log-01",
          prompt: {
            es: "Existe un snapshot válido hasta el evento 80 y el stream contiene eventos 81–100. ¿Cómo se reconstruye el estado sin perder historia?",
            en: "A valid snapshot exists up to event 80 and the stream contains events 81–100. How is the state reconstructed without losing history?"
          },
          options: [
            { id: "a", text: { es: "Tomar el snapshot como base y aplicar en orden los eventos 81–100; hacer replay completo si se necesita validar el snapshot.", en: "Take the snapshot as the base and apply events 81–100 in order; do a full replay if you need to validate the snapshot." } },
            { id: "b", text: { es: "Usar únicamente el evento 100, porque el último evento contiene implícitamente todo el estado.", en: "Use only event 100, because the last event implicitly contains the whole state." } },
            { id: "c", text: { es: "Editar el snapshot con los campos del evento 100 y descartar los eventos intermedios.", en: "Edit the snapshot with the fields from event 100 and discard the intermediate events." } }
          ],
          answer: "a",
          explanation: {
            es: "El snapshot es una optimización de lectura, no el proceso. La proyección sigue siendo un fold ordenado del historial; desde un snapshot válido puede continuarse con la cola de eventos.",
            en: "The snapshot is a read optimization, not the process. The projection is still an ordered fold of the history; from a valid snapshot you can continue with the tail of events."
          }
        },
        {
          id: "arquitectura-estado-log-02",
          prompt: {
            es: "Se registró por error `OrderApproved`, pero la decisión debe revertirse y conservar una auditoría explicable. ¿Qué intervención respeta un log append-only?",
            en: "`OrderApproved` was recorded by mistake, but the decision must be reversed while keeping an explainable audit trail. Which intervention respects an append-only log?"
          },
          options: [
            { id: "a", text: { es: "Borrar `OrderApproved` y renumerar el stream para que parezca que nunca ocurrió.", en: "Delete `OrderApproved` and renumber the stream so it looks like it never happened." } },
            { id: "b", text: { es: "Agregar un evento correctivo o compensatorio con su motivo y dejar que la proyección derive el nuevo estado.", en: "Append a corrective or compensating event with its reason and let the projection derive the new state." } },
            { id: "c", text: { es: "Sobrescribir solo el snapshot; el log puede conservar una historia distinta al estado mostrado.", en: "Overwrite only the snapshot; the log can keep a history that differs from the state shown." } }
          ],
          answer: "b",
          explanation: {
            es: "Una corrección también es parte de la historia. Agregarla conserva orden, actor y causa; borrar el evento o esconder la divergencia en un snapshot destruye la capacidad de explicar el proceso.",
            en: "A correction is part of the history too. Appending it preserves order, actor and cause; deleting the event or hiding the divergence in a snapshot destroys the ability to explain the process."
          }
        },
        {
          id: "arquitectura-estado-log-03",
          prompt: {
            es: "Un sistema guarda únicamente `status = approved`. Meses después se pregunta quién aprobó, desde qué estado y por qué. ¿Qué conclusión es válida?",
            en: "A system stores only `status = approved`. Months later, someone asks who approved, from which state and why. Which conclusion is valid?"
          },
          options: [
            { id: "a", text: { es: "El estado final basta; actor y causa pueden inferirse de forma inequívoca desde `approved`.", en: "The final state is enough; actor and cause can be inferred unambiguously from `approved`." } },
            { id: "b", text: { es: "Un snapshot nuevo puede recuperar automáticamente transiciones que nunca fueron persistidas.", en: "A new snapshot can automatically recover transitions that were never persisted." } },
            { id: "c", text: { es: "La evidencia ya se perdió: hace falta persistir eventos significativos con sus datos para reconstruir y explicar la decisión.", en: "The evidence is already lost: you need to persist meaningful events with their data to reconstruct and explain the decision." } }
          ],
          answer: "c",
          explanation: {
            es: "Una proyección final responde dónde terminó el proceso, no cómo llegó ahí. Replay solo puede reconstruir hechos registrados; no inventa actor, transición ni motivo ausentes.",
            en: "A final projection answers where the process ended up, not how it got there. Replay can only reconstruct recorded facts; it doesn't invent a missing actor, transition or reason."
          }
        }
      ]
    },
    "arquitectura/contrato-ejecutable": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-contrato-ejecutable-01",
          prompt: {
            es: "Un gate muestra aprobado en verde y rechazado en rojo, pero ambos estados tienen el mismo texto y no exponen estado accesible. El contraste de los fondos pasa. ¿Puede considerarse cumplido el contrato?",
            en: "A gate shows approved in green and rejected in red, but both states carry the same text and expose no accessible state. The background contrast passes. Can the contract be considered met?"
          },
          options: [
            { id: "a", text: { es: "Sí; pasar contraste permite usar color como único portador de significado.", en: "Yes; passing contrast lets you use color as the only carrier of meaning." } },
            { id: "b", text: { es: "No; debe expresar el estado también con texto, iconografía o atributos semánticos y verificar interacción y foco según el contrato.", en: "No; it must also express the state through text, iconography or semantic attributes, and verify interaction and focus against the contract." } },
            { id: "c", text: { es: "Sí, si el estado rechazado usa una animación más larga que el aprobado.", en: "Yes, as long as the rejected state uses a longer animation than the approved one." } }
          ],
          answer: "b",
          explanation: {
            es: "AA no reduce accesibilidad a contraste. El significado no puede depender solo del color, y el contrato incluye anatomía, estados, teclado, foco, ARIA y motion reducido.",
            en: "AA doesn't reduce accessibility to contrast. Meaning can't depend on color alone, and the contract covers anatomy, states, keyboard, focus, ARIA and reduced motion."
          }
        },
        {
          id: "arquitectura-contrato-ejecutable-02",
          prompt: {
            es: "Academy se ve correcta hoy cargando CSS desde la rama `main` de Design. ¿Qué cambio hace auditable esa dependencia?",
            en: "Academy looks correct today by loading CSS from Design's `main` branch. Which change makes that dependency auditable?"
          },
          options: [
            { id: "a", text: { es: "Fijar una versión publicada de `@milpa/design` y verificar sus contratos/gates contra esa misma versión.", en: "Pin a published version of `@milpa/design` and verify its contracts/gates against that same version." } },
            { id: "b", text: { es: "Mantener `main`, pero guardar una captura de pantalla para saber cómo se veía.", en: "Stay on `main`, but keep a screenshot to remember how it looked." } },
            { id: "c", text: { es: "Copiar las reglas necesarias a Academy y dejar de registrar de qué versión salieron.", en: "Copy the needed rules into Academy and stop recording which version they came from." } }
          ],
          answer: "a",
          explanation: {
            es: "Una versión fija relaciona el render con un artefacto publicado y repetible. `main` cambia sin que el consumidor lo decida, y copiar CSS rompe trazabilidad y actualización por contrato.",
            en: "A pinned version ties the render to a published, repeatable artifact. `main` changes without the consumer deciding it, and copying CSS breaks traceability and contract-based updates."
          }
        },
        {
          id: "arquitectura-contrato-ejecutable-03",
          prompt: {
            es: "Una clase nueva produce la captura esperada en dark, pero no tiene `*.contract.json`, caso light ni fallback de reduced motion. ¿Cuál es su estado correcto?",
            en: "A new class produces the expected screenshot in dark, but has no `*.contract.json`, no light case and no reduced-motion fallback. What is its correct status?"
          },
          options: [
            { id: "a", text: { es: "Componente público terminado, porque el aspecto dark es la fuente de verdad del sistema dark-first.", en: "A finished public component, because the dark look is the source of truth of the dark-first system." } },
            { id: "b", text: { es: "Token nuevo, porque cualquier clase sin contrato se convierte automáticamente en foundation.", en: "A new token, because any class without a contract automatically becomes foundation." } },
            { id: "c", text: { es: "Candidato local incompleto; no debe publicarse hasta describir el contrato y pasar los gates de calidad.", en: "An incomplete local candidate; it must not be published until it describes the contract and passes the quality gates." } }
          ],
          answer: "c",
          explanation: {
            es: "Dark-first no significa dark-only. Una captura valida un caso, mientras el contrato ejecutable exige estados y promesas verificables, incluida paridad de tema y reduced motion.",
            en: "Dark-first doesn't mean dark-only. A screenshot validates one case, while the executable contract demands verifiable states and promises, including theme parity and reduced motion."
          }
        }
      ]
    },
    "arquitectura/plan-disco": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-plan-disco-01",
          prompt: {
            es: "Una guía propone `php bin/coa make:controller ... --dry-run` para enseñar el plan de escritura. ¿Cómo debe revisarse contra el CLI público actual?",
            en: "A guide proposes `php bin/coa make:controller ... --dry-run` to teach the write plan. How should it be reviewed against the current public CLI?"
          },
          options: [
            { id: "a", text: { es: "Publicarla: si existe un `GenerationResult` interno, toda bandera imaginable está soportada.", en: "Publish it: if an internal `GenerationResult` exists, then every imaginable flag is supported." } },
            { id: "b", text: { es: "Quitar `--dry-run`; explicar preflight/WriteGuard como mecanismo interno y usar solo comandos expuestos, seguidos de `inspect:*`.", en: "Drop `--dry-run`; explain preflight/WriteGuard as an internal mechanism and use only exposed commands, followed by `inspect:*`." } },
            { id: "c", text: { es: "Renombrarla a `--plan` sin comprobar la ayuda, porque comunica mejor la intención.", en: "Rename it to `--plan` without checking the help output, because it communicates the intent better." } }
          ],
          answer: "b",
          explanation: {
            es: "Un resultado inspeccionable dentro del motor no constituye una interfaz CLI. La documentación debe distinguir el modelo conceptual de las banderas públicas realmente soportadas.",
            en: "An inspectable result inside the engine doesn't constitute a CLI interface. The documentation must distinguish the conceptual model from the public flags that are actually supported."
          }
        },
        {
          id: "arquitectura-plan-disco-02",
          prompt: {
            es: "El generador creó `HealthController.php`, pero `/health` no aparece en el host. ¿Qué evidencia debe cerrar la tarea?",
            en: "The generator created `HealthController.php`, but `/health` doesn't appear in the host. Which evidence should close the task?"
          },
          options: [
            { id: "a", text: { es: "La existencia del archivo; escribir es equivalente a registrar correctamente.", en: "The existence of the file; writing is equivalent to registering correctly." } },
            { id: "b", text: { es: "Una revisión visual del nombre del controlador, sin arrancar ni inspeccionar el host.", en: "A visual review of the controller's name, without booting or inspecting the host." } },
            { id: "c", text: { es: "La salida de `php bin/coa inspect:routes` mostrando `/health`, además del resultado de generación.", en: "The output of `php bin/coa inspect:routes` showing `/health`, in addition to the generation result." } }
          ],
          answer: "c",
          explanation: {
            es: "El archivo prueba una mutación en disco, no integración con el runtime. La verificación posterior debe observar el registry que el host realmente construyó.",
            en: "The file proves a mutation on disk, not integration with the runtime. The follow-up verification must observe the registry that the host actually built."
          }
        },
        {
          id: "arquitectura-plan-disco-03",
          prompt: {
            es: "Una generación produciría tres archivos, pero uno ya existe. ¿Qué resultado representa el comportamiento más seguro?",
            en: "A generation would produce three files, but one of them already exists. Which outcome represents the safest behavior?"
          },
          options: [
            { id: "a", text: { es: "El preflight detecta el conflicto antes de escribir el conjunto, lo reporta y permite resolverlo antes de reintentar conscientemente.", en: "Preflight detects the conflict before writing the set, reports it and lets you resolve it before deliberately retrying." } },
            { id: "b", text: { es: "Escribe los dos archivos libres y falla al tercero, dejando al usuario inferir el estado parcial.", en: "It writes the two free files and fails on the third, leaving the user to infer the partial state." } },
            { id: "c", text: { es: "Sobrescribe siempre el archivo existente; la velocidad del scaffold importa más que preservar trabajo.", en: "It always overwrites the existing file; scaffold speed matters more than preserving work." } }
          ],
          answer: "a",
          explanation: {
            es: "Planear el conjunto permite detectar conflictos antes de mutar. WriteGuard y preflight existen para hacer explícito el alcance y evitar escrituras parciales o sobrescrituras accidentales.",
            en: "Planning the whole set lets conflicts be detected before mutating. WriteGuard and preflight exist to make the scope explicit and to avoid partial writes or accidental overwrites."
          }
        }
      ]
    },
    "arquitectura/plan-invocacion": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-plan-invocacion-01",
          prompt: {
            es: "El canal telegram declara `require_confirmation_for_mutating:true` en su PolicyGate, pero `settings_update` trae `mutating:false` en su `#[Tool]`. ¿Por qué `coa:tools inspect` marca el paso Confirm como Dormant y no como Activo en ese canal?",
            en: "The telegram channel declares `require_confirmation_for_mutating:true` in its PolicyGate, but `settings_update` carries `mutating:false` in its `#[Tool]`. Why does `coa:tools inspect` mark the Confirm step as Dormant, not Active, on that channel?"
          },
          options: [
            { id: "a", text: { es: "Porque la regla existe en la policy del canal, pero el propio `mutating:false` del tool la vuelve estáticamente imposible de disparar para esta invocación.", en: "Because the rule exists in the channel's policy, but the tool's own `mutating:false` makes it statically impossible to fire for this invocation." } },
            { id: "b", text: { es: "Porque telegram nunca exige confirmación; el campo `require_confirmation_for_mutating` no tiene ningún efecto real en el plan.", en: "Because telegram never requires confirmation; the `require_confirmation_for_mutating` field has no real effect on the plan." } },
            { id: "c", text: { es: "Porque Dormant es un error del inspector: cualquier canal con `require_confirmation_for_mutating` debería marcar Confirm como Activo sin importar el tool.", en: "Because Dormant is an inspector bug: any channel with `require_confirmation_for_mutating` should mark Confirm as Active regardless of the tool." } }
          ],
          answer: "a",
          explanation: {
            es: "InvocationPlanBuilder describe lo que `call()` haría con ESTE tool: aunque la policy de telegram declara la regla, `mutating:false` hace que ninguna combinación la dispare. Por eso Confirm queda Dormant — la regla existe pero no puede activarse — en vez de Activo o Omitido, que describirían otra cosa.",
            en: "InvocationPlanBuilder describes what `call()` would do with THIS tool: even though telegram's policy declares the rule, `mutating:false` means no combination ever fires it. That's why Confirm stays Dormant — the rule exists but cannot activate — instead of Active or Skipped, which would describe something else entirely."
          }
        },
        {
          id: "arquitectura-plan-invocacion-02",
          prompt: {
            es: "Alguien afirma que `ctx.mode='plan'` y `coa:tools inspect` son intercambiables porque «los dos evitan ejecutar el tool». ¿Cuál es la diferencia arquitectónica correcta entre ambos?",
            en: "Someone claims `ctx.mode='plan'` and `coa:tools inspect` are interchangeable because \"both avoid executing the tool.\" What is the correct architectural difference between the two?"
          },
          options: [
            { id: "a", text: { es: "`ctx.mode='plan'` es una rama dentro de una llamada real que resuelve y valida el tool antes de detenerse; el InvocationPlan no invoca ninguna llamada, solo anota la presencia de cada paso para tool+canal+wiring.", en: "`ctx.mode='plan'` is a branch inside a real call that resolves and validates the tool before stopping; the InvocationPlan invokes no call at all, it only annotates each step's presence for tool+channel+wiring." } },
            { id: "b", text: { es: "Son idénticos: ambos ejecutan resolve, validate y authorize contra el tool real y solo cambia el nombre del comando.", en: "They're identical: both execute resolve, validate and authorize against the real tool, and only the command's name changes." } },
            { id: "c", text: { es: "`ctx.mode='plan'` es la radiografía completa del wiring del host; `coa:tools inspect` es la rama que se detiene antes de ejecutar dentro de una llamada.", en: "`ctx.mode='plan'` is the full x-ray of the host's wiring; `coa:tools inspect` is the branch that stops before executing inside a call." } }
          ],
          answer: "a",
          explanation: {
            es: "El modo plan sigue siendo una invocación: resuelve y valida el tool real antes de bifurcar sin ejecutar. El InvocationPlan es de solo lectura — recorre `InvocationStepKind` y anota Active/Conditional/Dormant/Skipped sin invocar el callback ni mutar nada, para cualquier tool+canal+wiring que se le pida.",
            en: "Plan mode is still an invocation: it resolves and validates the real tool before branching away from execution. The InvocationPlan is read-only — it walks `InvocationStepKind` and annotates Active/Conditional/Dormant/Skipped without invoking the callback or mutating anything, for whatever tool+channel+wiring it's asked about."
          }
        },
        {
          id: "arquitectura-plan-invocacion-03",
          prompt: {
            es: "Un borrador de documentación afirma que `ToolRegistry::call()` audita absolutamente todos los caminos terminales, incluyendo confirmación pendiente y veto. Al correr `coa:tools inspect`, ¿qué revela `AUDIT_SOURCE` sobre esa afirmación?",
            en: "A documentation draft claims `ToolRegistry::call()` audits absolutely every terminal path, including pending confirmation and veto. Running `coa:tools inspect`, what does `AUDIT_SOURCE` reveal about that claim?"
          },
          options: [
            { id: "a", text: { es: "Que la afirmación es correcta: `tool.executed`/`tool.failed` cubren cualquier salida, incluidas plan-mode, confirm y veto.", en: "That the claim is correct: `tool.executed`/`tool.failed` cover every outcome, including plan-mode, confirm and veto." } },
            { id: "b", text: { es: "Que es un modelo aspiracional: `AUDIT_SOURCE` audita validate-fail, authz-fail, rate-limit, cache-hit y éxito/fallo de execute, pero declara explícitamente que NO audita resolve-miss, plan-mode, confirm ni veto.", en: "That it's an aspirational model: `AUDIT_SOURCE` audits validate-fail, authz-fail, rate-limit, cache-hit and execute success/failure, but explicitly declares it does NOT audit resolve-miss, plan-mode, confirm or veto." } },
            { id: "c", text: { es: "Que basta con agregar veto a la lista de eventos auditados en la documentación, sin tocar el código, porque `inspect` reflejará el cambio automáticamente.", en: "That it's enough to add veto to the documented list of audited events, without touching the code, because `inspect` will reflect the change automatically." } }
          ],
          answer: "b",
          explanation: {
            es: "ADR#13 exige que la inspección describa lo que el runtime EJECUTA de verdad, no una aspiración. `AUDIT_SOURCE` nombra sus huecos honestos —resolve-miss, plan-mode, confirm y veto no dejan evento— en vez de afirmar una cobertura total que el código todavía no tiene.",
            en: "ADR#13 requires the inspection to describe what the runtime actually EXECUTES, not an aspiration. `AUDIT_SOURCE` names its honest gaps —resolve-miss, plan-mode, confirm and veto leave no event— instead of claiming a total coverage the code doesn't actually have."
          }
        }
      ]
    },
    "arquitectura/procedencia-firmada": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-procedencia-firmada-01",
          prompt: {
            es: "Un actor con escritura sobre los archivos de gobernanza reescribe el contrato y recomputa todos los `sha256` para que queden consistentes entre sí. ¿Qué verificación lo caza y por qué?",
            en: "An actor with write access to the governance files rewrites the contract and recomputes every `sha256` so they stay self-consistent. Which check catches them, and why?"
          },
          options: [
            { id: "a", text: { es: "La integridad: los hashes recomputados no cuadrarán entre sí.", en: "Integrity: the recomputed hashes won't be self-consistent." } },
            { id: "b", text: { es: "La autenticidad: la firma de una autoridad desplegada prueba QUIÉN escribió la ley; recomputar hashes solo prueba consistencia interna, que el atacante ya satisfizo.", en: "Authenticity: the signature of a deployed authority proves WHO wrote the law; recomputing hashes only proves internal consistency, which the attacker already satisfied." } },
            { id: "c", text: { es: "Ninguna: si los hashes son consistentes, el contrato es confiable.", en: "Neither: if the hashes are consistent, the contract is trustworthy." } }
          ],
          answer: "b",
          explanation: {
            es: "La integridad y la autenticidad responden preguntas distintas. La integridad prueba que el contenido es consistente consigo mismo — algo que cualquiera con escritura recomputa. La autenticidad prueba PROCEDENCIA: que lo firmó alguien con autoridad, vía una firma que el atacante no puede producir. Sin la firma, un contrato íntegro puede ser una mentira coherente.",
            en: "Integrity and authenticity answer different questions. Integrity proves the content is consistent with itself — something anyone with write access recomputes. Authenticity proves PROVENANCE: that someone with authority signed it, via a signature the attacker can't produce. Without the signature, an integral contract can be a coherent lie."
          }
        },
        {
          id: "arquitectura-procedencia-firmada-02",
          prompt: {
            es: "Una compuerta de autenticidad lee su lista de autoridad y su frontera del WORKING TREE. Un solo commit sin firma se agrega a la lista de autoridad (o fija la frontera en HEAD, vaciando el rango que se verifica) y pasa. ¿Qué cierra este fail-open?",
            en: "An authenticity gate reads its authority list and its boundary from the WORKING TREE. A single unsigned commit adds itself to the authority list (or sets the boundary to HEAD, emptying the verified range) and passes. What closes this fail-open?"
          },
          options: [
            { id: "a", text: { es: "Recomputar los hashes más seguido para cazar la deriva antes.", en: "Recompute the hashes more often to catch drift sooner." } },
            { id: "b", text: { es: "Anclar la compuerta a la línea COMMITTEADA — leer la lista de autoridad y la frontera de una referencia confiable como `main`, no del working tree — y validar que la frontera sea ancestro estricto de HEAD, para que el commit juzgado no pueda mover su propio suelo.", en: "Anchor the gate to the COMMITTED line — read the authority list and boundary from a trusted reference like `main`, not the working tree — and validate the boundary is a strict ancestor of HEAD, so the commit under review can't move its own ground." } },
            { id: "c", text: { es: "Firmar los archivos del working tree antes de correr la compuerta.", en: "Sign the working-tree files before running the gate." } }
          ],
          answer: "b",
          explanation: {
            es: "El fail-open nace de confiar el suelo que el commit bajo revisión puede reescribir. Al leer la raíz de confianza de la línea committeada (no del working tree mutable) y exigir que la frontera sea un ancestro real, el commit juzgado queda dentro del rango que se verifica y ya no puede excluirse ni autoautorizarse.",
            en: "The fail-open comes from trusting ground the commit under review can rewrite. By reading the trust root from the committed line (not the mutable working tree) and requiring the boundary to be a real ancestor, the commit being judged stays inside the verified range and can no longer exclude or self-authorize itself."
          }
        },
        {
          id: "arquitectura-procedencia-firmada-03",
          prompt: {
            es: "Ya anclada, la compuerta del propio repo (el productor) todavía pasa para un atacante que YA controla la línea confiable que lee. ¿Está rota, y dónde vive entonces la garantía absoluta?",
            en: "Even anchored, the repo's own gate (the producer) still passes for an attacker who ALREADY controls the trusted line it reads. Is it broken, and where does the absolute guarantee live?"
          },
          options: [
            { id: "a", text: { es: "Está rota: un self-check debería ser absoluto.", en: "It's broken: a self-check should be absolute." } },
            { id: "b", text: { es: "Es el límite irreducible de un self-check: no tiene raíz fuera de banda, así que es fail-closed enraizado en su línea (caza tamper de working-tree y de rama). El muro absoluto es el CONSUMIDOR, cuya raíz vive FUERA del workspace, inalcanzable para los commits que autoriza.", en: "It's the irreducible limit of a self-check: it has no out-of-band root, so it's fail-closed rooted at its line (catching working-tree and branch tampering). The absolute wall is the CONSUMER, whose trust root lives OUTSIDE the workspace, unreachable by the commits it authorizes." } },
            { id: "c", text: { es: "No hay garantía absoluta posible: la procedencia no se puede hacer cumplir.", en: "No absolute guarantee is possible: provenance can't be enforced." } }
          ],
          answer: "b",
          explanation: {
            es: "Un self-check lee todo del repo que revisa, así que no puede resistir a quien ya controla ese repo — y decirlo es honestidad, no derrota. La garantía absoluta la da el consumidor, que pinea su raíz de confianza fuera del workspace: los commits que autoriza no pueden tocarla. Productor enraizado, consumidor absoluto.",
            en: "A self-check reads everything from the repo it inspects, so it can't resist someone who already controls that repo — and saying so is honesty, not defeat. The absolute guarantee comes from the consumer, which pins its trust root outside the workspace: the commits it authorizes can't touch it. Producer rooted, consumer absolute."
          }
        }
      ]
    },
    "disena/capas-visuales": {
      passScore: 3,
      questions: [
        {
          id: "disena-capas-visuales-01",
          prompt: {
            es: "Una página usa controles, cards, ejemplos de código y el shell de documentación. ¿Cuál es el orden contractual de carga?",
            en: "A page uses controls, cards, code examples and the documentation shell. What is the contractual load order?"
          },
          options: [
            { id: "a", text: { es: "tokens → motion → primitives → components → artifacts → layouts", en: "tokens → motion → primitives → components → artifacts → layouts" } },
            { id: "b", text: { es: "tokens → primitives → components → layouts → artifacts → motion", en: "tokens → primitives → components → layouts → artifacts → motion" } },
            { id: "c", text: { es: "layouts → artifacts → components → primitives → motion → tokens", en: "layouts → artifacts → components → primitives → motion → tokens" } }
          ],
          answer: "a",
          explanation: {
            es: "Las capas se construyen de dependencias generales a composiciones de página. El orden canónico también está declarado por `@layer`, pero cargar el paquete en ese orden hace explícito el contrato del consumidor.",
            en: "The layers build up from general dependencies to page compositions. The canonical order is also declared by `@layer`, but loading the package in that order makes the consumer's contract explicit."
          }
        },
        {
          id: "disena-capas-visuales-02",
          prompt: {
            es: "El equipo necesita mostrar un bloque de código dentro del shell de una lección. ¿Dónde debe buscar primero cada pieza?",
            en: "The team needs to show a code block inside a lesson's shell. Where should it look first for each piece?"
          },
          options: [
            { id: "a", text: { es: "`mui-code` en artifacts y `mui-docs` en layouts, componiéndolos sin duplicar sus anatomías.", en: "`mui-code` in artifacts and `mui-docs` in layouts, composing them without duplicating their anatomies." } },
            { id: "b", text: { es: "Ambos en primitives, porque todo elemento visible debe empezar en la capa más baja.", en: "Both in primitives, because every visible element must start in the lowest layer." } },
            { id: "c", text: { es: "Ambos en tokens, agregando variables que dibujen por sí solas el código y la página.", en: "Both in tokens, adding variables that draw the code and the page all by themselves." } }
          ],
          answer: "a",
          explanation: {
            es: "Artifacts expresa contenido especializado; layouts organiza la página. Bajar piezas completas a primitives o tokens confunde responsabilidades y crea dependencias invertidas.",
            en: "Artifacts expresses specialized content; layouts organizes the page. Pushing whole pieces down into primitives or tokens blurs responsibilities and creates inverted dependencies."
          }
        },
        {
          id: "disena-capas-visuales-03",
          prompt: {
            es: "Un producto necesita otra identidad cromática, pero la anatomía de `mui-btn` ya resuelve su caso. ¿Cuál es la intervención inicial más pequeña y gobernable?",
            en: "A product needs a different color identity, but `mui-btn`'s anatomy already solves its case. What is the smallest, most governable first intervention?"
          },
          options: [
            { id: "a", text: { es: "Reescribir cada variante de `.mui-btn` con colores hex distintos dentro del producto.", en: "Rewrite every `.mui-btn` variant with different hex colors inside the product." } },
            { id: "b", text: { es: "Sobrescribir tokens semánticos mediante un theme/skin y validarlos contra `theme.contract.json`.", en: "Override the semantic tokens through a theme/skin and validate them against `theme.contract.json`." } },
            { id: "c", text: { es: "Duplicar `mui-btn` como componente local aunque su estructura no cambie.", en: "Duplicate `mui-btn` as a local component even though its structure doesn't change." } }
          ],
          answer: "b",
          explanation: {
            es: "Si cambia la identidad y no la estructura, la retokenización es el nivel correcto. Conserva contratos y permite que el verificador mida contraste e invariantes del theme completo.",
            en: "If the identity changes and the structure doesn't, retokenization is the right level. It preserves contracts and lets the verifier measure contrast and the invariants of the whole theme."
          }
        }
      ]
    },
    "disena/composicion-app": {
      passScore: 3,
      questions: [
        {
          id: "disena-composicion-app-01",
          prompt: {
            es: "Academy añade un cuestionario que califica respuestas, desbloquea unidades y guarda progreso. ¿Cómo se reparten las responsabilidades?",
            en: "Academy adds a quiz that grades answers, unlocks units and saves progress. How are the responsibilities divided?"
          },
          options: [
            { id: "a", text: { es: "Design publica el CSS y los contratos visuales; Academy implementa preguntas, estado, calificación, persistencia y navegación.", en: "Design publishes the CSS and the visual contracts; Academy implements questions, state, grading, persistence and navigation." } },
            { id: "b", text: { es: "Design debe publicar el banco de preguntas y `localStorage`, porque el cuestionario usa clases `mui-*`.", en: "Design should publish the question bank and `localStorage`, because the quiz uses `mui-*` classes." } },
            { id: "c", text: { es: "Academy debe copiar el CSS de Design para que su JavaScript sea dueño de toda la experiencia.", en: "Academy should copy Design's CSS so its JavaScript owns the whole experience." } }
          ],
          answer: "a",
          explanation: {
            es: "Milpa Design entrega lenguaje visual y cero JavaScript publicado. El comportamiento educativo y sus datos pertenecen a la aplicación que conoce el dominio de aprendizaje.",
            en: "Milpa Design ships a visual language and zero published JavaScript. The educational behavior and its data belong to the application that knows the learning domain."
          }
        },
        {
          id: "disena-composicion-app-02",
          prompt: {
            es: "El cuestionario combina choices, callouts y progreso existentes, pero necesita una distribución específica de lección. ¿Qué estrategia conserva los límites?",
            en: "The quiz combines existing choices, callouts and progress, but needs a lesson-specific layout. Which strategy preserves the boundaries?"
          },
          options: [
            { id: "a", text: { es: "Crear una composición `ac-quiz` que use las anatomías `mui-*` públicas sin redefinirlas.", en: "Create an `ac-quiz` composition that uses the public `mui-*` anatomies without redefining them." } },
            { id: "b", text: { es: "Añadir nuevos slots privados dentro de `.mui-choice` desde Academy y documentarlos como si fueran públicos.", en: "Add new private slots inside `.mui-choice` from Academy and document them as if they were public." } },
            { id: "c", text: { es: "Renombrar todos los `mui-*` usados a `ac-*` y mantener una copia divergente.", en: "Rename every `mui-*` in use to `ac-*` and maintain a divergent copy." } }
          ],
          answer: "a",
          explanation: {
            es: "El prefijo local cose el caso educativo; las piezas publicadas conservan su contrato. Modificar anatomías privadas o copiar componentes hace que Academy dependa de forks invisibles.",
            en: "The local prefix stitches the educational case together; the published pieces keep their contract. Modifying private anatomies or copying components makes Academy depend on invisible forks."
          }
        },
        {
          id: "disena-composicion-app-03",
          prompt: {
            es: "Para reutilizar una tarjeta, alguien propone agregar a `@milpa/design` lógica que lee `localStorage`, conoce rutas de Academy y marca una unidad como aprobada. ¿Qué decisión es correcta?",
            en: "To reuse a card, someone proposes adding logic to `@milpa/design` that reads `localStorage`, knows Academy's routes and marks a unit as passed. Which decision is correct?"
          },
          options: [
            { id: "a", text: { es: "Aceptar: un componente visual es más reusable si contiene reglas específicas del primer producto.", en: "Accept it: a visual component is more reusable if it holds rules specific to the first product." } },
            { id: "b", text: { es: "Rechazar esa lógica del paquete visual; mantenerla en Academy y pasar a la pieza solo estado/markup acorde con su contrato.", en: "Reject that logic in the visual package; keep it in Academy and pass the piece only state/markup that matches its contract." } },
            { id: "c", text: { es: "Mover también el catálogo curricular a Design para evitar parámetros entre capas.", en: "Move the curriculum catalog into Design as well, to avoid passing parameters across layers." } }
          ],
          answer: "b",
          explanation: {
            es: "Rutas, progreso y criterio de aprobación son dominio de Academy. Design puede representar estados, pero no decidirlos ni persistirlos; hacerlo acoplaría el lenguaje visual a una sola aplicación.",
            en: "Routes, progress and the passing criterion are Academy's domain. Design can represent states, but not decide or persist them; doing so would couple the visual language to a single application."
          }
        }
      ]
    },
    "disena/promocion-patron": {
      passScore: 3,
      questions: [
        {
          id: "disena-promocion-patron-01",
          prompt: {
            es: "`ac-knowledge-map` se ve bien y funciona en una sola lección, pero todavía no existe otro uso ni evidencia fuerte de repetición. ¿Qué debe ocurrir?",
            en: "`ac-knowledge-map` looks good and works in a single lesson, but there is no other use yet and no strong evidence of repetition. What should happen?"
          },
          options: [
            { id: "a", text: { es: "Promoverlo de inmediato a `mui-*`; el acabado visual demuestra generalidad.", en: "Promote it to `mui-*` right away; the visual polish demonstrates generality." } },
            { id: "b", text: { es: "Mantenerlo como candidato `ac-*`, observar el caso real y reunir evidencia antes de generalizar.", en: "Keep it as an `ac-*` candidate, observe the real case and gather evidence before generalizing." } },
            { id: "c", text: { es: "Moverlo a foundations para evitar decidir si es patrón o composición.", en: "Move it into foundations to avoid deciding whether it's a pattern or a composition." } }
          ],
          answer: "b",
          explanation: {
            es: "Academy es laboratorio. Un caso real permite aprender, pero no basta por sí solo para afirmar que la pieza merece un contrato público reusable.",
            en: "Academy is a laboratory. A real case lets you learn, but on its own it isn't enough to claim the piece deserves a reusable public contract."
          }
        },
        {
          id: "disena-promocion-patron-02",
          prompt: {
            es: "Una composición aparece en tres pantallas y tiene contrato, pero no puede operarse con teclado y su animación ignora `prefers-reduced-motion`. ¿Está lista para promoción?",
            en: "A composition appears on three screens and has a contract, but can't be operated with the keyboard and its animation ignores `prefers-reduced-motion`. Is it ready for promotion?"
          },
          options: [
            { id: "a", text: { es: "Sí; repetición y contrato sustituyen los gates de accesibilidad.", en: "Yes; repetition and a contract replace the accessibility gates." } },
            { id: "b", text: { es: "Sí, si se publica como experimental sin ejecutar `npm test`.", en: "Yes, if it's published as experimental without running `npm test`." } },
            { id: "c", text: { es: "No; debe cumplir el quality floor y pasar teclado, foco, a11y, motion y los demás gates antes de entrar.", en: "No; it must meet the quality floor and pass keyboard, focus, a11y, motion and the remaining gates before it enters." } }
          ],
          answer: "c",
          explanation: {
            es: "La regla de entrada es acumulativa. Repetición demuestra demanda; no elimina la obligación de que el patrón sea accesible, verificable y consistente con la gobernanza.",
            en: "The entry rule is cumulative. Repetition demonstrates demand; it doesn't remove the obligation for the pattern to be accessible, verifiable and consistent with the governance."
          }
        },
        {
          id: "disena-promocion-patron-03",
          prompt: {
            es: "Un candidato tiene dos usos reales, contrato y gates verdes, pero cada consumidor debe copiar un archivo privado y aplicar selectores internos porque el paquete no lo exporta. ¿Qué falta?",
            en: "A candidate has two real uses, a contract and green gates, but each consumer must copy a private file and apply internal selectors because the package doesn't export it. What is missing?"
          },
          options: [
            { id: "a", text: { es: "Nada; los hacks de consumo son aceptables si están documentados.", en: "Nothing; consumption hacks are acceptable as long as they are documented." } },
            { id: "b", text: { es: "Consumo limpio desde una versión publicada: exportar la pieza y comprobar que funciona sin parches ni acceso a privados.", en: "Clean consumption from a published version: export the piece and confirm it works without patches or access to private internals." } },
            { id: "c", text: { es: "Una cuarta pantalla; el paquete solo puede exportar patrones con cuatro usos.", en: "A fourth screen; the package can only export patterns that have four uses." } }
          ],
          answer: "b",
          explanation: {
            es: "La última condición de promoción es consumibilidad real. Un contrato que solo funciona mediante copias o selectores privados todavía no es un contrato público del paquete.",
            en: "The final promotion condition is real consumability. A contract that only works through copies or private selectors is not yet a public contract of the package."
          }
        }
      ]
    },
    "arquitectura/admision-en-el-edge": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-admision-en-el-edge-01",
          prompt: {
            es: "Un servicio en modo worker recibe el triple de su capacidad. El gate de admisión dentro de la app reporta CERO rechazos, pero los clientes ven latencias de 3–5 s. ¿Qué explica mejor el cero rechazos?",
            en: "A service in worker mode receives triple its capacity. The in-app admission gate reports ZERO rejections, but clients see 3–5 s latencies. What best explains the zero rejections?"
          },
          options: [
            { id: "a", text: { es: "La cola de sobrecarga se forma upstream, en el servidor, esperando un worker libre; el gate vive downstream y nunca ve ese exceso.", en: "The overload queue forms upstream, at the server, waiting for a free worker; the gate lives downstream and never sees that excess." } },
            { id: "b", text: { es: "El gate está deshabilitado; en modo worker el rate limit no aplica.", en: "The gate is disabled; in worker mode the rate limit doesn't apply." } },
            { id: "c", text: { es: "La base de datos absorbe el exceso sin rechazar, por eso el gate no necesita actuar.", en: "The database absorbs the excess without rejecting, so the gate doesn't need to act." } }
          ],
          answer: "a",
          explanation: {
            es: "El backpressure solo lo puede dar quien ve la cola. En modo worker la cola es upstream (en el servidor); el gate, dentro del worker, solo ve lo ya admitido. Por eso registra cero rechazos mientras la latencia trepa: no está roto, está en el lugar equivocado para esa función.",
            en: "Backpressure can only come from whoever sees the queue. In worker mode the queue is upstream (at the server); the gate, inside the worker, only sees what was already admitted. That's why it records zero rejections while latency climbs: it isn't broken, it's in the wrong place for that function."
          }
        },
        {
          id: "arquitectura-admision-en-el-edge-02",
          prompt: {
            es: "Vas a añadir backpressure a un backend con pool de workers sin dejar de proteger las conexiones a la base de datos. ¿Qué arreglo respeta ambas funciones?",
            en: "You're adding backpressure to a worker-pool backend without dropping database-connection protection. Which arrangement respects both functions?"
          },
          options: [
            { id: "a", text: { es: "Un rechazo rápido (503/429 + Retry-After) en el reverse-proxy del edge, y mantener el cap de in-flight de la app para acotar las conexiones de lo que ya pasó el edge.", en: "A fast reject (503/429 + Retry-After) at the edge reverse-proxy, and keep the app's in-flight cap to bound connections for what already passed the edge." } },
            { id: "b", text: { es: "Subir el cap de in-flight del gate de la app hasta que empiece a rechazar bajo carga.", en: "Raise the app gate's in-flight cap until it starts rejecting under load." } },
            { id: "c", text: { es: "Quitar el gate de la app y confiar solo en el edge, que ya rechaza el exceso.", en: "Remove the app gate and rely only on the edge, which already rejects the excess." } }
          ],
          answer: "a",
          explanation: {
            es: "Son dos funciones en dos lugares. El edge da backpressure porque ve la cola; el gate de la app protege el pool de conexiones de un pico ya admitido. Subir el cap no arregla el backpressure (la cola sigue upstream), y quitar el gate deja al motor sin protección: pasado el edge, una ráfaga admitida vuelve a chocar contra max_connections.",
            en: "Two functions in two places. The edge gives backpressure because it sees the queue; the app gate protects the connection pool from an already-admitted spike. Raising the cap doesn't fix backpressure (the queue is still upstream), and removing the gate leaves the engine unprotected: past the edge, an admitted burst hits max_connections again."
          }
        },
        {
          id: "arquitectura-admision-en-el-edge-03",
          prompt: {
            es: "Un equipo llama a su gate de admisión de la aplicación 'nuestro degradado gracioso'. Tras medirlo bajo overload, ¿cuál es la corrección más precisa?",
            en: "A team calls its in-app admission gate 'our graceful degradation'. After measuring it under overload, what's the most precise correction?"
          },
          options: [
            { id: "a", text: { es: "El gate de la app es protección del recurso (acota las conexiones a la BD); el degradado gracioso —el backpressure con Retry-After— vive en el edge, que ve la cola.", en: "The app gate is resource protection (it bounds DB connections); graceful degradation —the backpressure with Retry-After— lives at the edge, which sees the queue." } },
            { id: "b", text: { es: "El gate de la app ES el degradado gracioso; solo necesita un TTL más largo.", en: "The app gate IS graceful degradation; it just needs a longer TTL." } },
            { id: "c", text: { es: "Degradado gracioso y protección del recurso son el mismo mecanismo con dos nombres.", en: "Graceful degradation and resource protection are the same mechanism under two names." } }
          ],
          answer: "a",
          explanation: {
            es: "Confundir las dos funciones es el error de fondo. El gate de la app nunca fue el degradado gracioso: es la barrera que protege el pool de conexiones. El degradado gracioso es dar backpressure al cliente, y eso exige ver la cola —el edge. Nombrar cada función por lo que hace evita pedirle a una capa lo que solo la otra puede dar.",
            en: "Conflating the two functions is the underlying error. The app gate never was graceful degradation: it's the barrier that protects the connection pool. Graceful degradation is giving the client backpressure, and that requires seeing the queue —the edge. Naming each function for what it does keeps you from asking one layer for what only the other can give."
          }
        }
      ]
    },
    "arquitectura/evidencia-bajo-carga": {
      passScore: 3,
      questions: [
        {
          id: "arquitectura-evidencia-bajo-carga-01",
          prompt: {
            es: "El contador de ocupación de un gate pasa todos sus tests unitarios y un benchmark de 20 s. En producción, tras un par de minutos de carga sostenida, la base de datos se satura de conexiones. ¿Qué condición del benchmark habría revelado el defecto?",
            en: "A gate's occupancy counter passes all its unit tests and a 20 s benchmark. In production, after a couple of minutes of sustained load, the database saturates with connections. Which benchmark condition would have revealed the defect?"
          },
          options: [
            { id: "a", text: { es: "Sostener la carga por encima del TTL de seguridad del contador: el TTL fijo lo resetea a mitad de vuelo y readmite de más, algo que solo emerge pasado ese umbral de tiempo.", en: "Sustaining load beyond the counter's safety TTL: the fixed TTL resets it mid-flight and over-admits, which only emerges past that time threshold." } },
            { id: "b", text: { es: "Aumentar el número de aserciones del test unitario del contador.", en: "Increasing the number of assertions in the counter's unit test." } },
            { id: "c", text: { es: "Correr el mismo benchmark de 20 s más veces para reducir el ruido.", en: "Running the same 20 s benchmark more times to reduce noise." } }
          ],
          answer: "a",
          explanation: {
            es: "El defecto es temporal: el TTL expira con slots en vuelo y el contador recuenta desde cero. Un test de lógica y un benchmark corto nunca cruzan el TTL, así que no pueden verlo. Más aserciones o más repeticiones cortas no ayudan; solo la carga sostenida por encima del umbral lo exhibe.",
            en: "The defect is temporal: the TTL expires with slots in flight and the counter recounts from zero. A logic test and a short benchmark never cross the TTL, so they can't see it. More assertions or more short repetitions don't help; only load sustained beyond the threshold exhibits it."
          }
        },
        {
          id: "arquitectura-evidencia-bajo-carga-02",
          prompt: {
            es: "Bajo carga, la base de datos rechaza conexiones aunque el cap de in-flight del gate es menor que max_connections. Al revisar el código, la resolución de tenant —una consulta a la BD— corre ANTES del gate. ¿Cuál es el diagnóstico?",
            en: "Under load, the database refuses connections even though the gate's in-flight cap is below max_connections. Reviewing the code, tenant resolution —a DB query— runs BEFORE the gate. What's the diagnosis?"
          },
          options: [
            { id: "a", text: { es: "El gate no puede proteger un recurso que la petición ya tocó: la consulta de tenant abre conexión antes de la admisión, así que la carga golpea la BD sin límite.", en: "The gate can't protect a resource the request already touched: the tenant query opens a connection before admission, so load hits the DB unbounded." } },
            { id: "b", text: { es: "El cap de in-flight está mal calculado; hay que subirlo por encima de max_connections.", en: "The in-flight cap is miscalculated; it must be raised above max_connections." } },
            { id: "c", text: { es: "La resolución de tenant no usa conexiones; el problema tiene que estar en otro lado.", en: "Tenant resolution doesn't use connections; the problem must be elsewhere." } }
          ],
          answer: "a",
          explanation: {
            es: "La admisión debe preceder a TODO trabajo que consuma el recurso escaso. Si una consulta corre antes del gate, cada petición abre conexión antes de que el gate opine, y el cap deja de acotar el uso real. El arreglo es mover la admisión antes del primer acceso a la BD (y liberar el slot pase lo que pase).",
            en: "Admission must precede ALL work that consumes the scarce resource. If a query runs before the gate, every request opens a connection before the gate weighs in, and the cap stops bounding real usage. The fix is to move admission before the first DB access (and release the slot no matter what)."
          }
        },
        {
          id: "arquitectura-evidencia-bajo-carga-03",
          prompt: {
            es: "Un benchmark refuta la hipótesis de que 'la máquina de capacidad ya degrada gracioso'. ¿Cuál es la lectura correcta del resultado?",
            en: "A benchmark refutes the hypothesis that 'the capacity machine already degrades gracefully'. What's the correct reading of the result?"
          },
          options: [
            { id: "a", text: { es: "Es el valor del experimento: reveló un comportamiento que la hipótesis no explicaba. La herramienta de validación más útil es la que observa lo que el resto de las pruebas no puede.", en: "That's the value of the experiment: it revealed a behavior the hypothesis didn't explain. The most useful validation tool is the one that observes what the rest of the tests can't." } },
            { id: "b", text: { es: "Es un fracaso del benchmark: si refuta la hipótesis, el diseño de la prueba estaba mal.", en: "It's a benchmark failure: if it refutes the hypothesis, the test design was wrong." } },
            { id: "c", text: { es: "Hay que repetir el benchmark hasta que confirme la hipótesis original.", en: "You should rerun the benchmark until it confirms the original hypothesis." } }
          ],
          answer: "a",
          explanation: {
            es: "Un experimento no existe para confirmar lo que ya creíamos, sino para revelar lo que aún no explicamos. Un resultado que refuta la hipótesis cómoda no es un fracaso de la prueba: es exactamente su valor. Repetir hasta 'confirmar' invierte el propósito de la evidencia.",
            en: "An experiment doesn't exist to confirm what we already believed, but to reveal what we don't yet explain. A result that refutes the comfortable hypothesis isn't a test failure: it's precisely its value. Rerunning until it 'confirms' inverts the purpose of evidence."
          }
        }
      ]
    }
  });
})();

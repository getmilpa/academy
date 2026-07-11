(function () {
  "use strict";

  globalThis.MilpaQuizBank.register({
    "arquitectura/atlas-limites": {
      passScore: 3,
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
    }
  });
})();

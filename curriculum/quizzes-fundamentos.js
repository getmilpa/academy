(function () {
  "use strict";

  globalThis.MilpaQuizBank.register({
    "fundamentos/sistema-vivo": {
      passScore: 3,
      questions: [
        {
          id: "sistema-vivo-01",
          prompt: {
            es: "Un equipo prepara dos productos con Milpa. Ambos usan el mismo runtime, pero cada uno necesita plugins, configuración y rutas distintas. ¿Dónde debe vivir esa decisión de composición?",
            en: "A team is preparing two products with Milpa. Both use the same runtime, but each one needs different plugins, configuration and routes. Where should that composition decision live?"
          },
          options: [
            { id: "a", text: { es: "En Core, porque debe conocer todos los productos posibles", en: "In Core, because it must know every possible product" } },
            { id: "b", text: { es: "En el host de cada producto, que decide qué piezas sembrar", en: "In each product's host, which decides what pieces to plant" } },
            { id: "c", text: { es: "En Runtime, mediante condiciones específicas para cada producto", en: "In Runtime, through conditions specific to each product" } },
            { id: "d", text: { es: "En un Workflow global que sustituya la configuración del host", en: "In a global Workflow that replaces the host's configuration" } }
          ],
          answer: "b",
          explanation: {
            es: "El host compone el producto: elige paquetes, plugins, configuración y entradas. Runtime arranca esa composición; Core conserva contratos compartidos y no debe conocer cada aplicación concreta.",
            en: "The host composes the product: it picks packages, plugins, configuration and entry points. Runtime boots that composition; Core keeps the shared contracts and must not know each concrete application."
          }
        },
        {
          id: "sistema-vivo-02",
          prompt: {
            es: "La aplicación necesita búsqueda de catálogo, una capacidad de dominio que no forma parte del arranque ni de los contratos base. ¿Qué ubicación preserva mejor los límites de Milpa?",
            en: "The application needs catalog search, a domain capability that is not part of boot or of the base contracts. Which location best preserves Milpa's boundaries?"
          },
          options: [
            { id: "a", text: { es: "Agregar la búsqueda a Core para que cualquier módulo pueda invocarla", en: "Adding search to Core so any module can call it" } },
            { id: "b", text: { es: "Incorporarla a Runtime porque este ya conoce el contenedor", en: "Folding it into Runtime because it already knows the container" } },
            { id: "c", text: { es: "Aportarla desde un plugin con un contrato explícito", en: "Contributing it from a plugin with an explicit contract" } },
            { id: "d", text: { es: "Implementarla completa dentro de cada entrada HTTP y CLI", en: "Implementing it in full inside each HTTP and CLI entry point" } }
          ],
          answer: "c",
          explanation: {
            es: "Un plugin aporta capacidades de dominio sin ensanchar Core ni Runtime. Declarar su contrato permite que el host la componga y que otros plugins dependan de ella explícitamente.",
            en: "A plugin contributes domain capabilities without widening Core or Runtime. Declaring its contract lets the host compose it and lets other plugins depend on it explicitly."
          }
        },
        {
          id: "sistema-vivo-03",
          prompt: {
            es: "Confirmar una compra requiere reservar inventario, cobrar y enviar una notificación. Cada capacidad ya pertenece a un plugin distinto. ¿Qué pieza debe coordinar la secuencia sin absorber esas responsabilidades?",
            en: "Confirming a purchase requires reserving inventory, charging and sending a notification. Each capability already belongs to a different plugin. Which piece should coordinate the sequence without absorbing those responsibilities?"
          },
          options: [
            { id: "a", text: { es: "Un workflow que orqueste las acciones de los plugins", en: "A workflow that orchestrates the plugins' actions" } },
            { id: "b", text: { es: "Core, agregando un método especial para compras", en: "Core, by adding a special method for purchases" } },
            { id: "c", text: { es: "Runtime, ejecutando consultas de inventario y pagos durante boot", en: "Runtime, by running inventory and payment queries during boot" } },
            { id: "d", text: { es: "El host, duplicando la secuencia en cada puerta de entrada", en: "The host, by duplicating the sequence at each entry door" } }
          ],
          answer: "a",
          explanation: {
            es: "El workflow coordina acciones que cruzan capacidades. Inventario, pago y notificación siguen siendo responsabilidad de sus plugins; ni Core ni Runtime se convierten en dominio de compras.",
            en: "The workflow coordinates actions that cut across capabilities. Inventory, payment and notification remain the responsibility of their plugins; neither Core nor Runtime becomes the purchase domain."
          }
        }
      ]
    },
    "fundamentos/contratos-grafo": {
      passScore: 4,
      questions: [
        {
          id: "contratos-grafo-01",
          prompt: {
            es: "ReportsPlugin declara que requiere ExporterInterface, pero ningún plugin configurado la provee. ¿Qué resultado debe producir `php bin/coa validate`?",
            en: "ReportsPlugin declares that it requires ExporterInterface, but no configured plugin provides it. What result should `php bin/coa validate` produce?"
          },
          options: [
            { id: "a", text: { es: "Instalar automáticamente un exportador y continuar", en: "Automatically install an exporter and carry on" } },
            { id: "b", text: { es: "Fallar antes del boot e identificar la capacidad ausente", en: "Fail before boot and identify the missing capability" } },
            { id: "c", text: { es: "Arrancar y esperar a que la primera petición revele el problema", en: "Boot and wait for the first request to reveal the problem" } },
            { id: "d", text: { es: "Ignorar el requisito porque solo `provides` es obligatorio", en: "Ignore the requirement because only `provides` is mandatory" } }
          ],
          answer: "b",
          explanation: {
            es: "`validate` ejecuta una comprobación estática previa al boot. Un `requires` sin un `provides` correspondiente invalida el grafo y debe producir evidencia concreta, no una falla tardía.",
            en: "`validate` runs a static check ahead of boot. A `requires` without a matching `provides` invalidates the graph and must produce concrete evidence, not a late failure."
          }
        },
        {
          id: "contratos-grafo-02",
          prompt: {
            es: "IdentityPlugin provee `identity`; OrdersPlugin requiere `identity` y provee `orders`; NotificationsPlugin requiere `orders`. ¿Qué orden de boot respeta el grafo?",
            en: "IdentityPlugin provides `identity`; OrdersPlugin requires `identity` and provides `orders`; NotificationsPlugin requires `orders`. Which boot order respects the graph?"
          },
          options: [
            { id: "a", text: { es: "NotificationsPlugin → OrdersPlugin → IdentityPlugin", en: "NotificationsPlugin → OrdersPlugin → IdentityPlugin" } },
            { id: "b", text: { es: "OrdersPlugin → IdentityPlugin → NotificationsPlugin", en: "OrdersPlugin → IdentityPlugin → NotificationsPlugin" } },
            { id: "c", text: { es: "Cualquier orden, porque el contenedor corrige las dependencias después", en: "Any order, because the container fixes the dependencies afterward" } },
            { id: "d", text: { es: "IdentityPlugin → OrdersPlugin → NotificationsPlugin", en: "IdentityPlugin → OrdersPlugin → NotificationsPlugin" } }
          ],
          answer: "d",
          explanation: {
            es: "Cada proveedor debe arrancar antes que su consumidor. El orden se deriva de las aristas `provides`/`requires`; no depende del orden alfabético ni de una lista mantenida a mano.",
            en: "Each provider must boot before its consumer. The order derives from the `provides`/`requires` edges; it doesn't depend on alphabetical order or on a hand-maintained list."
          }
        },
        {
          id: "contratos-grafo-03",
          prompt: {
            es: "PluginA provee `alpha` y requiere `beta`; PluginB provee `beta` y requiere `alpha`. El kernel intenta arrancar ese host. ¿Cuál es el resultado arquitectónicamente correcto?",
            en: "PluginA provides `alpha` and requires `beta`; PluginB provides `beta` and requires `alpha`. The kernel tries to boot that host. What is the architecturally correct result?"
          },
          options: [
            { id: "a", text: { es: "Arrancar primero el plugin que aparezca antes en config/plugins.php", en: "Boot first whichever plugin appears earlier in config/plugins.php" } },
            { id: "b", text: { es: "Arrancar ambos de forma perezosa y resolver el ciclo con la primera petición", en: "Boot both lazily and resolve the cycle on the first request" } },
            { id: "c", text: { es: "Detener el arranque porque no existe un orden topológico válido", en: "Halt boot because no valid topological order exists" } },
            { id: "d", text: { es: "Tratar ambos `requires` como sugerencias y continuar", en: "Treat both `requires` as suggestions and carry on" } }
          ],
          answer: "c",
          explanation: {
            es: "El ciclo impide colocar a cada proveedor antes de su consumidor. El runtime debe rechazar la composición antes de atender tráfico, en lugar de ocultar el problema con orden incidental o resolución tardía.",
            en: "The cycle makes it impossible to place each provider before its consumer. The runtime must reject the composition before serving traffic, instead of hiding the problem behind incidental order or late resolution."
          }
        },
        {
          id: "contratos-grafo-04",
          prompt: {
            es: "CachePlugin y RedisPlugin proveen la capacidad `cache`, que está marcada como exclusiva. RedisPlugin declara priority 10; CachePlugin no declara priority. ¿Qué debe reportar el resolver?",
            en: "CachePlugin and RedisPlugin both provide the `cache` capability, which is marked exclusive. RedisPlugin declares priority 10; CachePlugin declares no priority. What should the resolver report?"
          },
          options: [
            { id: "a", text: { es: "RedisPlugin gana: priority decide entre proveedores múltiples, incluidos los exclusivos", en: "RedisPlugin wins: priority decides among multiple providers, exclusive ones included" } },
            { id: "b", text: { es: "MILPA_CAPABILITY_CONFLICT y el grafo bloquea: un id exclusivo con dos proveedores no se elige en silencio, y priority no rescata un conflicto exclusivo", en: "MILPA_CAPABILITY_CONFLICT and the graph blocks: an exclusive id with two providers is not picked silently, and priority does not rescue an exclusive conflict" } },
            { id: "c", text: { es: "CachePlugin gana por orden alfabético y el conflicto queda anotado como advertencia", en: "CachePlugin wins alphabetically and the conflict is recorded as a warning" } },
            { id: "d", text: { es: "El resolver vuelve la capacidad no exclusiva porque la demanda demuestra que se quieren múltiples proveedores", en: "The resolver turns the capability non-exclusive because the demand proves multiple providers are wanted" } }
          ],
          answer: "b",
          explanation: {
            es: "La exclusividad es una promesa del contrato: un id exclusivo reclamado por dos o más proveedores bloquea el grafo sin importar sus priorities — elegir en silencio sería exactamente la arquitectura invisible que el resolver existe para prevenir. priority decide de forma determinista entre proveedores NO exclusivos: gana la más alta (ausente = 0). Los arreglos son retirar a uno de los proveedores o marcar el id como no exclusivo si múltiples proveedores son la intención.",
            en: "Exclusivity is a promise of the contract: an exclusive id claimed by two or more providers blocks the graph regardless of their priorities — picking silently would be exactly the invisible architecture the resolver exists to prevent. priority decides deterministically among NON-exclusive providers: the highest wins (absent = 0). The fixes are to remove one of the providers or to mark the id non-exclusive if multiple providers are intended."
          }
        }
      ]
    },
    "fundamentos/version-contrato": {
      passScore: 3,
      questions: [
        {
          id: "version-contrato-01",
          prompt: {
            es: "PaymentsPlugin requiere la capacidad `payments` con el constraint `^2.0`. StripePlugin la provee, pero su contractVersion es `1.4`. ¿Qué debe reportar el resolver?",
            en: "PaymentsPlugin requires the `payments` capability with the constraint `^2.0`. StripePlugin provides it, but its contractVersion is `1.4`. What should the resolver report?"
          },
          options: [
            { id: "a", text: { es: "Capacidad ausente: para el resolver no existe ningún proveedor de `payments`", en: "Missing capability: for the resolver there is no `payments` provider at all" } },
            { id: "b", text: { es: "El requisito cierra: el proveedor existe y la versión es una etiqueta informativa", en: "The requirement closes: the provider exists and the version is an informative label" } },
            { id: "c", text: { es: "MILPA_CAPABILITY_VERSION_UNSUPPORTED: el proveedor existe, su contractVersion no satisface el rango y el requisito sigue abierto", en: "MILPA_CAPABILITY_VERSION_UNSUPPORTED: the provider exists, its contractVersion doesn't satisfy the range and the requirement stays open" } },
            { id: "d", text: { es: "El resolver elige en silencio la versión instalada más cercana al rango pedido", en: "The resolver silently picks the installed version closest to the requested range" } }
          ],
          answer: "c",
          explanation: {
            es: "Una versión es un contrato, no una etiqueta: una implementación fuera de rango no puede sostener la forma esperada. El requisito queda tan abierto como si no hubiera proveedor, pero el código distingue el caso para enseñar su propio camino de arreglo.",
            en: "A version is a contract, not a label: an out-of-range implementation cannot be trusted to honour the expected shape. The requirement stays as open as if there were no provider, but the code singles the case out to teach its own fix path."
          }
        },
        {
          id: "version-contrato-02",
          prompt: {
            es: "En los manifiestos de Milpa, el proveedor declara una versión concreta y el consumidor declara un rango. ¿Por qué esa asimetría es deliberada?",
            en: "In Milpa manifests, the provider declares a concrete version and the consumer declares a range. Why is that asymmetry deliberate?"
          },
          options: [
            { id: "a", text: { es: "Porque quien implementa afirma un hecho — esta versión concreta del contrato — y quien consume expresa tolerancia: el rango de formas que acepta", en: "Because the implementer states a fact — this concrete version of the contract — and the consumer expresses tolerance: the range of shapes it accepts" } },
            { id: "b", text: { es: "Es una limitación del parser de manifiestos que se corregirá para permitir rangos en ambos lados", en: "It's a limitation of the manifest parser that will be fixed to allow ranges on both sides" } },
            { id: "c", text: { es: "Es al revés: el proveedor debería declarar el rango y el consumidor la versión exacta", en: "It's the other way around: the provider should declare the range and the consumer the exact version" } },
            { id: "d", text: { es: "Ambos lados deberían declarar rangos para maximizar la compatibilidad automática", en: "Both sides should declare ranges to maximize automatic compatibility" } }
          ],
          answer: "a",
          explanation: {
            es: "El proveedor sabe exactamente qué forma implementa; el consumidor sabe qué formas puede aceptar. El resolver compara el hecho contra el rango: si la contractVersion cae dentro del constraint, el requisito cierra; si cae fuera, sigue abierto.",
            en: "The provider knows exactly which shape it implements; the consumer knows which shapes it can accept. The resolver compares the fact against the range: if the contractVersion falls inside the constraint, the requirement closes; outside, it stays open."
          }
        },
        {
          id: "version-contrato-03",
          prompt: {
            es: "El reporte muestra MILPA_CONTRACT_VERSION_UNSUPPORTED: el contrato está implementado, pero ninguna implementación satisface el constraint. ¿Cuáles son los dos arreglos legítimos?",
            en: "The report shows MILPA_CONTRACT_VERSION_UNSUPPORTED: the contract is implemented, but no implementation satisfies the constraint. What are the two legitimate fixes?"
          },
          options: [
            { id: "a", text: { es: "Subir el proveedor a una versión que satisfaga el constraint, o relajar el constraint si la implementación instalada es aceptable", en: "Upgrade the provider to a version that satisfies the constraint, or relax the constraint if the installed implementation is acceptable" } },
            { id: "b", text: { es: "Eliminar el requisito del perfil para que el resolver deje de revisarlo", en: "Delete the requirement from the profile so the resolver stops checking it" } },
            { id: "c", text: { es: "Forzar el boot: las diferencias de versión se negocian en runtime con la primera petición", en: "Force the boot: version differences get negotiated at runtime with the first request" } },
            { id: "d", text: { es: "Editar a mano el número de versión del manifiesto instalado hasta que entre en el rango", en: "Hand-edit the installed manifest's version number until it fits the range" } }
          ],
          answer: "a",
          explanation: {
            es: "El catálogo nombra los dos lados del desajuste: actualizar al proveedor para que su implementación satisfaga el rango, o relajar el constraint del requirente cuando lo instalado es aceptable. Borrar el requisito o editar números a mano no cierra el contrato: lo esconde.",
            en: "The catalog names both sides of the mismatch: upgrade the provider so its implementation satisfies the range, or relax the requirer's constraint when what's installed is acceptable. Deleting the requirement or hand-editing numbers doesn't close the contract: it hides it."
          }
        }
      ]
    },
    "fundamentos/pipeline-gates": {
      passScore: 3,
      questions: [
        {
          id: "pipeline-gates-01",
          prompt: {
            es: "La ruta HTTP para publicar un artículo valida permisos y aplica reglas distintas al comando CLI que publica el mismo artículo. Ya aparecieron resultados inconsistentes. ¿Qué cambio corrige el límite?",
            en: "The HTTP route for publishing an article checks permissions and applies different rules than the CLI command that publishes the same article. Inconsistent results have already shown up. Which change fixes the boundary?"
          },
          options: [
            { id: "a", text: { es: "Hacer que HTTP y CLI adapten su entrada y despachen la misma acción por el mismo pipeline", en: "Have HTTP and CLI adapt their input and dispatch the same action through the same pipeline" } },
            { id: "b", text: { es: "Copiar la implementación HTTP al comando CLI cada vez que cambie", en: "Copy the HTTP implementation into the CLI command every time it changes" } },
            { id: "c", text: { es: "Mover las dos implementaciones a Runtime y conservarlas separadas", en: "Move both implementations into Runtime and keep them separate" } },
            { id: "d", text: { es: "Eliminar la validación del CLI porque se usa solo de forma interna", en: "Drop the CLI's validation because it's only used internally" } }
          ],
          answer: "a",
          explanation: {
            es: "Las puertas de entrada normalizan transporte e identidad, pero no reimplementan el caso de uso. Una acción compartida atraviesa las mismas políticas y deja evidencia comparable sin importar si empezó en HTTP o CLI.",
            en: "Entry doors normalize transport and identity, but they don't reimplement the use case. A shared action passes through the same policies and leaves comparable evidence regardless of whether it started in HTTP or CLI."
          }
        },
        {
          id: "pipeline-gates-02",
          prompt: {
            es: "Un despliegue pasa schema, permisos y pruebas automáticas. La política de producción exige además que la persona responsable confirme el contexto del cambio. ¿Cómo debe modelarse?",
            en: "A deployment passes schema, permissions and automated tests. Production policy additionally requires the responsible person to confirm the context of the change. How should that be modeled?"
          },
          options: [
            { id: "a", text: { es: "Como otra validación automática que siempre apruebe si las pruebas pasan", en: "As another automated check that always approves if the tests pass" } },
            { id: "b", text: { es: "Omitiendo las validaciones previas y dejando toda la decisión a la persona", en: "By skipping the prior validations and leaving the whole decision to the person" } },
            { id: "c", text: { es: "Como una compuerta humana posterior a las validaciones automáticas", en: "As a human gate that comes after the automated validations" } },
            { id: "d", text: { es: "Como una segunda implementación del despliegue exclusiva para producción", en: "As a second implementation of the deployment, exclusive to production" } }
          ],
          answer: "c",
          explanation: {
            es: "La compuerta humana no reemplaza las comprobaciones mecánicas. Se agrega cuando la política exige intención y responsabilidad contextual después de que los requisitos verificables ya pasaron.",
            en: "The human gate doesn't replace the mechanical checks. It's added when policy demands intent and contextual accountability after the verifiable requirements have already passed."
          }
        },
        {
          id: "pipeline-gates-03",
          prompt: {
            es: "Una persona aprueba una operación sensible. Seis semanas después, auditoría necesita reconstruir por qué continuó el pipeline. ¿Qué evidencia es adecuada?",
            en: "A person approves a sensitive operation. Six weeks later, an audit needs to reconstruct why the pipeline continued. What evidence is adequate?"
          },
          options: [
            { id: "a", text: { es: "Un booleano `approved=true` sin actor ni momento", en: "A boolean `approved=true` with no actor or timestamp" } },
            { id: "b", text: { es: "El estado final del recurso, porque implica que alguien aprobó", en: "The resource's final state, because it implies someone approved" } },
            { id: "c", text: { es: "Un registro que se sobrescriba cada vez que cambie la decisión", en: "A record that gets overwritten every time the decision changes" } },
            { id: "d", text: { es: "Una decisión append-only con resultado, actor y contexto de política", en: "An append-only decision with outcome, actor and policy context" } }
          ],
          answer: "d",
          explanation: {
            es: "Una aprobación es una decisión auditable, no un atajo invisible. El registro debe conservar quién decidió, qué decidió y bajo qué contexto, sin borrar decisiones anteriores.",
            en: "An approval is an auditable decision, not an invisible shortcut. The record must keep who decided, what they decided and under what context, without erasing earlier decisions."
          }
        }
      ]
    },
    "construye/skeleton-boot": {
      passScore: 3,
      questions: [
        {
          id: "skeleton-boot-01",
          prompt: {
            es: "Un servidor nuevo debe exponer el skeleton por HTTP. ¿Qué configuración conserva el límite público previsto por el proyecto?",
            en: "A new server must expose the skeleton over HTTP. Which configuration preserves the public boundary the project intends?"
          },
          options: [
            { id: "a", text: { es: "Usar la raíz del repositorio como document root para acceder a config/", en: "Use the repository root as the document root so config/ is reachable" } },
            { id: "b", text: { es: "Usar `public/` como document root y dejar el resto fuera del alcance web", en: "Use `public/` as the document root and leave everything else out of web reach" } },
            { id: "c", text: { es: "Servir `src/` y redirigir todas las peticiones al primer plugin", en: "Serve `src/` and redirect every request to the first plugin" } },
            { id: "d", text: { es: "Exponer `vendor/` para que Composer resuelva paquetes desde el navegador", en: "Expose `vendor/` so Composer can resolve packages from the browser" } }
          ],
          answer: "b",
          explanation: {
            es: "`public/index.php` es la entrada HTTP. Configurar `public/` como document root evita exponer código, configuración y dependencias que no forman parte de la superficie web.",
            en: "`public/index.php` is the HTTP entry point. Setting `public/` as the document root avoids exposing code, configuration and dependencies that are not part of the web surface."
          }
        },
        {
          id: "skeleton-boot-02",
          prompt: {
            es: "`php bin/coa doctor` informa que el kernel arrancó, enumera plugins configurados y booted, muestra contenedor y dispatcher, y cuenta rutas declaradas. ¿Qué conclusión sí está respaldada?",
            en: "`php bin/coa doctor` reports that the kernel booted, lists configured and booted plugins, shows the container and dispatcher, and counts declared routes. Which conclusion is actually supported?"
          },
          options: [
            { id: "a", text: { es: "Todos los casos de uso y respuestas HTTP ya pasaron pruebas funcionales", en: "Every use case and HTTP response has already passed functional tests" } },
            { id: "b", text: { es: "La aplicación está lista para producción y no requiere observabilidad adicional", en: "The application is production-ready and needs no further observability" } },
            { id: "c", text: { es: "Cada ruta accede correctamente a una base de datos", en: "Every route reaches a database correctly" } },
            { id: "d", text: { es: "La composición pudo bootear y sus RouteProvider declararon las rutas contadas", en: "The composition was able to boot and its RouteProviders declared the counted routes" } }
          ],
          answer: "d",
          explanation: {
            es: "Doctor prueba el arranque y hace visible la composición del kernel. No ejecuta pruebas end-to-end, no garantiza comportamiento de cada endpoint y tampoco certifica preparación para producción.",
            en: "Doctor proves boot and makes the kernel's composition visible. It doesn't run end-to-end tests, doesn't guarantee the behavior of each endpoint and doesn't certify production readiness."
          }
        },
        {
          id: "skeleton-boot-03",
          prompt: {
            es: "Un PR agrega reglas de precios y consultas de catálogo directamente en `public/index.php` porque ahí llega la petición. ¿Qué revisión corresponde?",
            en: "A PR adds pricing rules and catalog queries directly into `public/index.php` because that's where the request lands. What review is appropriate?"
          },
          options: [
            { id: "a", text: { es: "Pedir que la entrada adapte y despache; la capacidad de dominio debe vivir en plugins y servicios", en: "Ask that the entry point adapt and dispatch; the domain capability belongs in plugins and services" } },
            { id: "b", text: { es: "Aceptar el cambio porque el host debe implementar todo el dominio", en: "Accept the change because the host should implement the whole domain" } },
            { id: "c", text: { es: "Mover las reglas a `bin/coa` para compartirlas con HTTP", en: "Move the rules into `bin/coa` to share them with HTTP" } },
            { id: "d", text: { es: "Mover las consultas al kernel para que estén disponibles durante boot", en: "Move the queries into the kernel so they're available during boot" } }
          ],
          answer: "a",
          explanation: {
            es: "El skeleton es un host mínimo. La entrada HTTP construye la petición, arranca y despacha; no debe convertirse en una segunda arquitectura ni apropiarse de capacidades de dominio.",
            en: "The skeleton is a minimal host. The HTTP entry point builds the request, boots and dispatches; it must not become a second architecture or take over domain capabilities."
          }
        }
      ]
    },
    "construye/plugin-request": {
      passScore: 3,
      questions: [
        {
          id: "plugin-request-01",
          prompt: {
            es: "Catalog será una unidad de composición y otros plugins dependerán de su capacidad `catalog`. ¿Qué primer paso hace explícito ese contrato al generar la pieza?",
            en: "Catalog will be a composition unit and other plugins will depend on its `catalog` capability. Which first step makes that contract explicit when generating the piece?"
          },
          options: [
            { id: "a", text: { es: "Crear solo `/catalog` y asumir que la ruta representa la capacidad", en: "Create only `/catalog` and assume the route represents the capability" } },
            { id: "b", text: { es: "Agregar `catalog` como servicio privado de Runtime", en: "Add `catalog` as a private Runtime service" } },
            { id: "c", text: { es: "Generar Catalog con `--provides=catalog`", en: "Generate Catalog with `--provides=catalog`" } },
            { id: "d", text: { es: "Registrar la capacidad en `public/index.php`", en: "Register the capability in `public/index.php`" } }
          ],
          answer: "c",
          explanation: {
            es: "La capacidad se declara en el contrato del plugin, no se infiere de una ruta ni de un archivo. `make:plugin Catalog --provides=catalog` vuelve visible lo que la unidad aporta.",
            en: "The capability is declared in the plugin's contract, not inferred from a route or a file. `make:plugin Catalog --provides=catalog` makes visible what the unit contributes."
          }
        },
        {
          id: "plugin-request-02",
          prompt: {
            es: "El generador creó CatalogController y los archivos esperados para `/catalog`. ¿Qué evidencia completa la verificación de que el host reconoció la ruta?",
            en: "The generator created CatalogController and the expected files for `/catalog`. Which evidence completes the check that the host recognized the route?"
          },
          options: [
            { id: "a", text: { es: "Que el archivo del controller exista y tenga sintaxis PHP válida", en: "That the controller file exists and has valid PHP syntax" } },
            { id: "b", text: { es: "Que el nombre CatalogController aparezca en el historial de Git", en: "That the name CatalogController shows up in the Git history" } },
            { id: "c", text: { es: "Que `php bin/coa inspect:routes` muestre `/catalog` desde el plugin esperado", en: "That `php bin/coa inspect:routes` shows `/catalog` from the expected plugin" } },
            { id: "d", text: { es: "Que Composer haya terminado sin descargar paquetes adicionales", en: "That Composer finished without downloading additional packages" } }
          ],
          answer: "c",
          explanation: {
            es: "La escritura solo prueba que hay archivos. `inspect:routes` arranca la composición real y muestra si el host registró la declaración de ruta, que es la evidencia relevante.",
            en: "Writing only proves there are files. `inspect:routes` boots the real composition and shows whether the host registered the route declaration, which is the evidence that matters."
          }
        },
        {
          id: "plugin-request-03",
          prompt: {
            es: "CatalogPlugin no puede funcionar sin la capacidad `storage`, aportada por StoragePlugin. ¿Cómo se representa esa relación para que pueda validarse antes del tráfico?",
            en: "CatalogPlugin can't work without the `storage` capability, contributed by StoragePlugin. How is that relationship represented so it can be validated before traffic?"
          },
          options: [
            { id: "a", text: { es: "Catalog declara `requires: storage` y Storage declara `provides: storage`", en: "Catalog declares `requires: storage` and Storage declares `provides: storage`" } },
            { id: "b", text: { es: "Catalog busca StoragePlugin por nombre durante su primera petición", en: "Catalog looks up StoragePlugin by name during its first request" } },
            { id: "c", text: { es: "El controller captura la ausencia y devuelve un arreglo vacío", en: "The controller catches the absence and returns an empty array" } },
            { id: "d", text: { es: "La configuración coloca Catalog después de Storage sin declarar contratos", en: "The configuration places Catalog after Storage without declaring contracts" } }
          ],
          answer: "a",
          explanation: {
            es: "La dependencia debe ser una arista explícita del grafo. El orden de boot y la validación se derivan de `requires`/`provides`; el orden incidental o la detección tardía ocultan el contrato.",
            en: "The dependency must be an explicit edge of the graph. Boot order and validation derive from `requires`/`provides`; incidental order or late detection hide the contract."
          }
        }
      ]
    },
    "construye/agent-tools": {
      passScore: 3,
      questions: [
        {
          id: "agent-tools-01",
          prompt: {
            es: "Un equipo parte del skeleton básico y decide exponer herramientas por MCP. ¿Qué acción conserva el carácter opt-in de esa superficie?",
            en: "A team starts from the basic skeleton and decides to expose tools over MCP. Which action preserves the opt-in nature of that surface?"
          },
          options: [
            { id: "a", text: { es: "Suponer que Tool Runtime y MCP Server ya vienen como dependencias obligatorias", en: "Assume Tool Runtime and MCP Server already ship as mandatory dependencies" } },
            { id: "b", text: { es: "Copiar un servidor MCP dentro de Core", en: "Copy an MCP server into Core" } },
            { id: "c", text: { es: "Habilitar explícitamente la superficie con `php bin/coa agent:enable`", en: "Explicitly enable the surface with `php bin/coa agent:enable`" } },
            { id: "d", text: { es: "Convertir cada ruta HTTP en una tool automáticamente", en: "Turn every HTTP route into a tool automatically" } }
          ],
          answer: "c",
          explanation: {
            es: "El host base se mantiene pequeño. `agent:enable` hace explícita la decisión e instala Tool Runtime y MCP Server mediante Composer, sin convertirlos en requisitos universales del skeleton.",
            en: "The base host stays small. `agent:enable` makes the decision explicit and installs Tool Runtime and MCP Server through Composer, without turning them into universal requirements of the skeleton."
          }
        },
        {
          id: "agent-tools-02",
          prompt: {
            es: "`make:tool` escribió SearchCatalog dentro de CatalogPlugin. ¿Qué comprobación demuestra que el kernel la registró en la superficie agent-ready?",
            en: "`make:tool` wrote SearchCatalog inside CatalogPlugin. Which check demonstrates that the kernel registered it on the agent-ready surface?"
          },
          options: [
            { id: "a", text: { es: "Abrir el archivo y confirmar que existe un método público", en: "Open the file and confirm a public method exists" } },
            { id: "b", text: { es: "Ejecutar `php bin/coa inspect:tools` y encontrar la tool registrada", en: "Run `php bin/coa inspect:tools` and find the tool registered" } },
            { id: "c", text: { es: "Ejecutar `inspect:routes` y buscar el nombre de la tool", en: "Run `inspect:routes` and look for the tool's name" } },
            { id: "d", text: { es: "Confirmar que `composer.json` contiene únicamente milpa/core", en: "Confirm that `composer.json` contains only milpa/core" } }
          ],
          answer: "b",
          explanation: {
            es: "La generación no prueba el registro. `inspect:tools` arranca el kernel con el registry disponible y lista las tools que los providers realmente aportaron.",
            en: "Generation doesn't prove registration. `inspect:tools` boots the kernel with the registry available and lists the tools the providers actually contributed."
          }
        },
        {
          id: "agent-tools-03",
          prompt: {
            es: "Un PR expone `DeleteCatalog` al modelo con nombre y método invocable, pero sin contrato de entrada, política de autorización ni rastro auditable. ¿Cuál es la evaluación correcta?",
            en: "A PR exposes `DeleteCatalog` to the model with a name and an invocable method, but with no input contract, authorization policy or auditable trail. What is the correct assessment?"
          },
          options: [
            { id: "a", text: { es: "Está completa porque cualquier método público ya es una tool gobernada", en: "It's complete because any public method is already a governed tool" } },
            { id: "b", text: { es: "Solo falta agregar una descripción más extensa para el modelo", en: "All that's missing is a longer description for the model" } },
            { id: "c", text: { es: "Es segura si el MCP Server corre en localhost", en: "It's safe as long as the MCP Server runs on localhost" } },
            { id: "d", text: { es: "Está incompleta: debe definir schema, autorización y auditoría antes de exponerse", en: "It's incomplete: it must define schema, authorization and auditing before being exposed" } }
          ],
          answer: "d",
          explanation: {
            es: "La invocabilidad no equivale a gobierno. Una operación destructiva necesita entradas contractuales, una decisión explícita de autorización y evidencia que permita reconstruir su ejecución.",
            en: "Invocability is not the same as governance. A destructive operation needs contractual inputs, an explicit authorization decision and evidence that makes its execution reconstructable."
          }
        }
      ]
    },
    "construye/consume-design": {
      passScore: 3,
      questions: [
        {
          id: "consume-design-01",
          prompt: {
            es: "Una página nueva de Academy usa `mui-gate` y el shell de documentación. ¿Qué carga respeta el contrato publicado de @milpa/design?",
            en: "A new Academy page uses `mui-gate` and the documentation shell. Which way of loading respects @milpa/design's published contract?"
          },
          options: [
            { id: "a", text: { es: "Importar solo artifacts.css porque contiene `mui-gate`", en: "Import only artifacts.css because it contains `mui-gate`" } },
            { id: "b", text: { es: "Importar layouts, artifacts, components, primitives, motion y tokens en orden inverso", en: "Import layouts, artifacts, components, primitives, motion and tokens in reverse order" } },
            { id: "c", text: { es: "Leer los CSS internos desde la rama main de GitHub", en: "Read the internal CSS from GitHub's main branch" } },
            { id: "d", text: { es: "Cargar una versión publicada en orden: tokens, motion, primitives, components, artifacts y layouts", en: "Load a published version in order: tokens, motion, primitives, components, artifacts and layouts" } }
          ],
          answer: "d",
          explanation: {
            es: "Las seis capas forman una cascada contractual y se consumen desde una versión publicada. Una pieza de artifacts también depende del vocabulario y de las capas anteriores; el layout se carga al final.",
            en: "The six layers form a contractual cascade and are consumed from a published version. An artifacts piece also depends on the vocabulary and on the earlier layers; the layout loads last."
          }
        },
        {
          id: "consume-design-02",
          prompt: {
            es: "Academy necesita guardar progreso, calificar cuestionarios y decidir qué unidad desbloquear. ¿A qué repositorio pertenece esa lógica?",
            en: "Academy needs to save progress, grade quizzes and decide which unit to unlock. Which repository does that logic belong to?"
          },
          options: [
            { id: "a", text: { es: "A Academy, porque son estado y reglas del producto educativo", en: "To Academy, because these are the state and rules of the educational product" } },
            { id: "b", text: { es: "A @milpa/design, para que el CSS decida el avance del estudiante", en: "To @milpa/design, so the CSS decides the student's progression" } },
            { id: "c", text: { es: "A Runtime, porque cualquier estado de interfaz es parte del boot", en: "To Runtime, because any interface state is part of boot" } },
            { id: "d", text: { es: "A Core, para compartir la rúbrica con todos los hosts", en: "To Core, to share the rubric with every host" } }
          ],
          answer: "a",
          explanation: {
            es: "Milpa Design publica CSS y contratos visuales, no JavaScript de producto. Rutas, datos, progreso y verificadores son conducta de Academy y deben permanecer en la aplicación.",
            en: "Milpa Design publishes CSS and visual contracts, not product JavaScript. Routes, data, progress and verifiers are Academy's behavior and must stay in the application."
          }
        },
        {
          id: "consume-design-03",
          prompt: {
            es: "Una sola lección necesita combinar `mui-card`, `mui-steps` y un resumen de progreso específico de Academy. Todavía no existe un patrón reutilizable general. ¿Qué implementación respeta la gobernanza?",
            en: "A single lesson needs to combine `mui-card`, `mui-steps` and a progress summary specific to Academy. No general reusable pattern exists yet. Which implementation respects the governance?"
          },
          options: [
            { id: "a", text: { es: "Crear localmente una nueva clase `mui-learning-summary` y tratarla como pública", en: "Locally create a new `mui-learning-summary` class and treat it as public" } },
            { id: "b", text: { es: "Copiar la anatomía privada de `mui-card` y renombrar sus selectores", en: "Copy `mui-card`'s private anatomy and rename its selectors" } },
            { id: "c", text: { es: "Componer las piezas publicadas con una clase local `ac-*` sin redefinir su anatomía", en: "Compose the published pieces with a local `ac-*` class without redefining their anatomy" } },
            { id: "d", text: { es: "Editar directamente el CSS instalado dentro de node_modules", en: "Directly edit the installed CSS inside node_modules" } }
          ],
          answer: "c",
          explanation: {
            es: "Academy puede coser su caso educativo con prefijo propio. La composición local consume contratos `mui-*`; no inventa una API pública ni duplica internals antes de reunir evidencia para promover un patrón.",
            en: "Academy can stitch its educational case together with its own prefix. The local composition consumes `mui-*` contracts; it doesn't invent a public API or duplicate internals before gathering evidence to promote a pattern."
          }
        }
      ]
    }
  });
})();

(function () {
  "use strict";

  globalThis.MilpaQuizBank.register({
    "fundamentos/sistema-vivo": {
      passScore: 3,
      questions: [
        {
          id: "sistema-vivo-01",
          prompt: "Un equipo prepara dos productos con Milpa. Ambos usan el mismo runtime, pero cada uno necesita plugins, configuración y rutas distintas. ¿Dónde debe vivir esa decisión de composición?",
          options: [
            { id: "a", text: "En Core, porque debe conocer todos los productos posibles" },
            { id: "b", text: "En el host de cada producto, que decide qué piezas sembrar" },
            { id: "c", text: "En Runtime, mediante condiciones específicas para cada producto" },
            { id: "d", text: "En un Workflow global que sustituya la configuración del host" }
          ],
          answer: "b",
          explanation: "El host compone el producto: elige paquetes, plugins, configuración y entradas. Runtime arranca esa composición; Core conserva contratos compartidos y no debe conocer cada aplicación concreta."
        },
        {
          id: "sistema-vivo-02",
          prompt: "La aplicación necesita búsqueda de catálogo, una capacidad de dominio que no forma parte del arranque ni de los contratos base. ¿Qué ubicación preserva mejor los límites de Milpa?",
          options: [
            { id: "a", text: "Agregar la búsqueda a Core para que cualquier módulo pueda invocarla" },
            { id: "b", text: "Incorporarla a Runtime porque este ya conoce el contenedor" },
            { id: "c", text: "Aportarla desde un plugin con un contrato explícito" },
            { id: "d", text: "Implementarla completa dentro de cada entrada HTTP y CLI" }
          ],
          answer: "c",
          explanation: "Un plugin aporta capacidades de dominio sin ensanchar Core ni Runtime. Declarar su contrato permite que el host la componga y que otros plugins dependan de ella explícitamente."
        },
        {
          id: "sistema-vivo-03",
          prompt: "Confirmar una compra requiere reservar inventario, cobrar y enviar una notificación. Cada capacidad ya pertenece a un plugin distinto. ¿Qué pieza debe coordinar la secuencia sin absorber esas responsabilidades?",
          options: [
            { id: "a", text: "Un workflow que orqueste las acciones de los plugins" },
            { id: "b", text: "Core, agregando un método especial para compras" },
            { id: "c", text: "Runtime, ejecutando consultas de inventario y pagos durante boot" },
            { id: "d", text: "El host, duplicando la secuencia en cada puerta de entrada" }
          ],
          answer: "a",
          explanation: "El workflow coordina acciones que cruzan capacidades. Inventario, pago y notificación siguen siendo responsabilidad de sus plugins; ni Core ni Runtime se convierten en dominio de compras."
        }
      ]
    },
    "fundamentos/contratos-grafo": {
      passScore: 3,
      questions: [
        {
          id: "contratos-grafo-01",
          prompt: "ReportsPlugin declara que requiere ExporterInterface, pero ningún plugin configurado la provee. ¿Qué resultado debe producir `php bin/coa validate`?",
          options: [
            { id: "a", text: "Instalar automáticamente un exportador y continuar" },
            { id: "b", text: "Fallar antes del boot e identificar la capacidad ausente" },
            { id: "c", text: "Arrancar y esperar a que la primera petición revele el problema" },
            { id: "d", text: "Ignorar el requisito porque solo `provides` es obligatorio" }
          ],
          answer: "b",
          explanation: "`validate` ejecuta una comprobación estática previa al boot. Un `requires` sin un `provides` correspondiente invalida el grafo y debe producir evidencia concreta, no una falla tardía."
        },
        {
          id: "contratos-grafo-02",
          prompt: "IdentityPlugin provee `identity`; OrdersPlugin requiere `identity` y provee `orders`; NotificationsPlugin requiere `orders`. ¿Qué orden de boot respeta el grafo?",
          options: [
            { id: "a", text: "NotificationsPlugin → OrdersPlugin → IdentityPlugin" },
            { id: "b", text: "OrdersPlugin → IdentityPlugin → NotificationsPlugin" },
            { id: "c", text: "Cualquier orden, porque el contenedor corrige las dependencias después" },
            { id: "d", text: "IdentityPlugin → OrdersPlugin → NotificationsPlugin" }
          ],
          answer: "d",
          explanation: "Cada proveedor debe arrancar antes que su consumidor. El orden se deriva de las aristas `provides`/`requires`; no depende del orden alfabético ni de una lista mantenida a mano."
        },
        {
          id: "contratos-grafo-03",
          prompt: "PluginA provee `alpha` y requiere `beta`; PluginB provee `beta` y requiere `alpha`. El kernel intenta arrancar ese host. ¿Cuál es el resultado arquitectónicamente correcto?",
          options: [
            { id: "a", text: "Arrancar primero el plugin que aparezca antes en config/plugins.php" },
            { id: "b", text: "Arrancar ambos de forma perezosa y resolver el ciclo con la primera petición" },
            { id: "c", text: "Detener el arranque porque no existe un orden topológico válido" },
            { id: "d", text: "Tratar ambos `requires` como sugerencias y continuar" }
          ],
          answer: "c",
          explanation: "El ciclo impide colocar a cada proveedor antes de su consumidor. El runtime debe rechazar la composición antes de atender tráfico, en lugar de ocultar el problema con orden incidental o resolución tardía."
        }
      ]
    },
    "fundamentos/pipeline-gates": {
      passScore: 3,
      questions: [
        {
          id: "pipeline-gates-01",
          prompt: "La ruta HTTP para publicar un artículo valida permisos y aplica reglas distintas al comando CLI que publica el mismo artículo. Ya aparecieron resultados inconsistentes. ¿Qué cambio corrige el límite?",
          options: [
            { id: "a", text: "Hacer que HTTP y CLI adapten su entrada y despachen la misma acción por el mismo pipeline" },
            { id: "b", text: "Copiar la implementación HTTP al comando CLI cada vez que cambie" },
            { id: "c", text: "Mover las dos implementaciones a Runtime y conservarlas separadas" },
            { id: "d", text: "Eliminar la validación del CLI porque se usa solo de forma interna" }
          ],
          answer: "a",
          explanation: "Las puertas de entrada normalizan transporte e identidad, pero no reimplementan el caso de uso. Una acción compartida atraviesa las mismas políticas y deja evidencia comparable sin importar si empezó en HTTP o CLI."
        },
        {
          id: "pipeline-gates-02",
          prompt: "Un despliegue pasa schema, permisos y pruebas automáticas. La política de producción exige además que la persona responsable confirme el contexto del cambio. ¿Cómo debe modelarse?",
          options: [
            { id: "a", text: "Como otra validación automática que siempre apruebe si las pruebas pasan" },
            { id: "b", text: "Omitiendo las validaciones previas y dejando toda la decisión a la persona" },
            { id: "c", text: "Como una compuerta humana posterior a las validaciones automáticas" },
            { id: "d", text: "Como una segunda implementación del despliegue exclusiva para producción" }
          ],
          answer: "c",
          explanation: "La compuerta humana no reemplaza las comprobaciones mecánicas. Se agrega cuando la política exige intención y responsabilidad contextual después de que los requisitos verificables ya pasaron."
        },
        {
          id: "pipeline-gates-03",
          prompt: "Una persona aprueba una operación sensible. Seis semanas después, auditoría necesita reconstruir por qué continuó el pipeline. ¿Qué evidencia es adecuada?",
          options: [
            { id: "a", text: "Un booleano `approved=true` sin actor ni momento" },
            { id: "b", text: "El estado final del recurso, porque implica que alguien aprobó" },
            { id: "c", text: "Un registro que se sobrescriba cada vez que cambie la decisión" },
            { id: "d", text: "Una decisión append-only con resultado, actor y contexto de política" }
          ],
          answer: "d",
          explanation: "Una aprobación es una decisión auditable, no un atajo invisible. El registro debe conservar quién decidió, qué decidió y bajo qué contexto, sin borrar decisiones anteriores."
        }
      ]
    },
    "construye/skeleton-boot": {
      passScore: 3,
      questions: [
        {
          id: "skeleton-boot-01",
          prompt: "Un servidor nuevo debe exponer el skeleton por HTTP. ¿Qué configuración conserva el límite público previsto por el proyecto?",
          options: [
            { id: "a", text: "Usar la raíz del repositorio como document root para acceder a config/" },
            { id: "b", text: "Usar `public/` como document root y dejar el resto fuera del alcance web" },
            { id: "c", text: "Servir `src/` y redirigir todas las peticiones al primer plugin" },
            { id: "d", text: "Exponer `vendor/` para que Composer resuelva paquetes desde el navegador" }
          ],
          answer: "b",
          explanation: "`public/index.php` es la entrada HTTP. Configurar `public/` como document root evita exponer código, configuración y dependencias que no forman parte de la superficie web."
        },
        {
          id: "skeleton-boot-02",
          prompt: "`php bin/coa doctor` informa que el kernel arrancó, enumera plugins configurados y booted, muestra contenedor y dispatcher, y cuenta rutas declaradas. ¿Qué conclusión sí está respaldada?",
          options: [
            { id: "a", text: "Todos los casos de uso y respuestas HTTP ya pasaron pruebas funcionales" },
            { id: "b", text: "La aplicación está lista para producción y no requiere observabilidad adicional" },
            { id: "c", text: "Cada ruta accede correctamente a una base de datos" },
            { id: "d", text: "La composición pudo bootear y sus RouteProvider declararon las rutas contadas" }
          ],
          answer: "d",
          explanation: "Doctor prueba el arranque y hace visible la composición del kernel. No ejecuta pruebas end-to-end, no garantiza comportamiento de cada endpoint y tampoco certifica preparación para producción."
        },
        {
          id: "skeleton-boot-03",
          prompt: "Un PR agrega reglas de precios y consultas de catálogo directamente en `public/index.php` porque ahí llega la petición. ¿Qué revisión corresponde?",
          options: [
            { id: "a", text: "Pedir que la entrada adapte y despache; la capacidad de dominio debe vivir en plugins y servicios" },
            { id: "b", text: "Aceptar el cambio porque el host debe implementar todo el dominio" },
            { id: "c", text: "Mover las reglas a `bin/coa` para compartirlas con HTTP" },
            { id: "d", text: "Mover las consultas al kernel para que estén disponibles durante boot" }
          ],
          answer: "a",
          explanation: "El skeleton es un host mínimo. La entrada HTTP construye la petición, arranca y despacha; no debe convertirse en una segunda arquitectura ni apropiarse de capacidades de dominio."
        }
      ]
    },
    "construye/plugin-request": {
      passScore: 3,
      questions: [
        {
          id: "plugin-request-01",
          prompt: "Catalog será una unidad de composición y otros plugins dependerán de su capacidad `catalog`. ¿Qué primer paso hace explícito ese contrato al generar la pieza?",
          options: [
            { id: "a", text: "Crear solo `/catalog` y asumir que la ruta representa la capacidad" },
            { id: "b", text: "Agregar `catalog` como servicio privado de Runtime" },
            { id: "c", text: "Generar Catalog con `--provides=catalog`" },
            { id: "d", text: "Registrar la capacidad en `public/index.php`" }
          ],
          answer: "c",
          explanation: "La capacidad se declara en el contrato del plugin, no se infiere de una ruta ni de un archivo. `make:plugin Catalog --provides=catalog` vuelve visible lo que la unidad aporta."
        },
        {
          id: "plugin-request-02",
          prompt: "El generador creó CatalogController y los archivos esperados para `/catalog`. ¿Qué evidencia completa la verificación de que el host reconoció la ruta?",
          options: [
            { id: "a", text: "Que el archivo del controller exista y tenga sintaxis PHP válida" },
            { id: "b", text: "Que el nombre CatalogController aparezca en el historial de Git" },
            { id: "c", text: "Que `php bin/coa inspect:routes` muestre `/catalog` desde el plugin esperado" },
            { id: "d", text: "Que Composer haya terminado sin descargar paquetes adicionales" }
          ],
          answer: "c",
          explanation: "La escritura solo prueba que hay archivos. `inspect:routes` arranca la composición real y muestra si el host registró la declaración de ruta, que es la evidencia relevante."
        },
        {
          id: "plugin-request-03",
          prompt: "CatalogPlugin no puede funcionar sin la capacidad `storage`, aportada por StoragePlugin. ¿Cómo se representa esa relación para que pueda validarse antes del tráfico?",
          options: [
            { id: "a", text: "Catalog declara `requires: storage` y Storage declara `provides: storage`" },
            { id: "b", text: "Catalog busca StoragePlugin por nombre durante su primera petición" },
            { id: "c", text: "El controller captura la ausencia y devuelve un arreglo vacío" },
            { id: "d", text: "La configuración coloca Catalog después de Storage sin declarar contratos" }
          ],
          answer: "a",
          explanation: "La dependencia debe ser una arista explícita del grafo. El orden de boot y la validación se derivan de `requires`/`provides`; el orden incidental o la detección tardía ocultan el contrato."
        }
      ]
    },
    "construye/agent-tools": {
      passScore: 3,
      questions: [
        {
          id: "agent-tools-01",
          prompt: "Un equipo parte del skeleton básico y decide exponer herramientas por MCP. ¿Qué acción conserva el carácter opt-in de esa superficie?",
          options: [
            { id: "a", text: "Suponer que Tool Runtime y MCP Server ya vienen como dependencias obligatorias" },
            { id: "b", text: "Copiar un servidor MCP dentro de Core" },
            { id: "c", text: "Habilitar explícitamente la superficie con `php bin/coa agent:enable`" },
            { id: "d", text: "Convertir cada ruta HTTP en una tool automáticamente" }
          ],
          answer: "c",
          explanation: "El host base se mantiene pequeño. `agent:enable` hace explícita la decisión e instala Tool Runtime y MCP Server mediante Composer, sin convertirlos en requisitos universales del skeleton."
        },
        {
          id: "agent-tools-02",
          prompt: "`make:tool` escribió SearchCatalog dentro de CatalogPlugin. ¿Qué comprobación demuestra que el kernel la registró en la superficie agent-ready?",
          options: [
            { id: "a", text: "Abrir el archivo y confirmar que existe un método público" },
            { id: "b", text: "Ejecutar `php bin/coa inspect:tools` y encontrar la tool registrada" },
            { id: "c", text: "Ejecutar `inspect:routes` y buscar el nombre de la tool" },
            { id: "d", text: "Confirmar que `composer.json` contiene únicamente milpa/core" }
          ],
          answer: "b",
          explanation: "La generación no prueba el registro. `inspect:tools` arranca el kernel con el registry disponible y lista las tools que los providers realmente aportaron."
        },
        {
          id: "agent-tools-03",
          prompt: "Un PR expone `DeleteCatalog` al modelo con nombre y método invocable, pero sin contrato de entrada, política de autorización ni rastro auditable. ¿Cuál es la evaluación correcta?",
          options: [
            { id: "a", text: "Está completa porque cualquier método público ya es una tool gobernada" },
            { id: "b", text: "Solo falta agregar una descripción más extensa para el modelo" },
            { id: "c", text: "Es segura si el MCP Server corre en localhost" },
            { id: "d", text: "Está incompleta: debe definir schema, autorización y auditoría antes de exponerse" }
          ],
          answer: "d",
          explanation: "La invocabilidad no equivale a gobierno. Una operación destructiva necesita entradas contractuales, una decisión explícita de autorización y evidencia que permita reconstruir su ejecución."
        }
      ]
    },
    "construye/consume-design": {
      passScore: 3,
      questions: [
        {
          id: "consume-design-01",
          prompt: "Una página nueva de Academy usa `mui-gate` y el shell de documentación. ¿Qué carga respeta el contrato publicado de @milpa/design?",
          options: [
            { id: "a", text: "Importar solo artifacts.css porque contiene `mui-gate`" },
            { id: "b", text: "Importar layouts, artifacts, components, primitives, motion y tokens en orden inverso" },
            { id: "c", text: "Leer los CSS internos desde la rama main de GitHub" },
            { id: "d", text: "Cargar una versión publicada en orden: tokens, motion, primitives, components, artifacts y layouts" }
          ],
          answer: "d",
          explanation: "Las seis capas forman una cascada contractual y se consumen desde una versión publicada. Una pieza de artifacts también depende del vocabulario y de las capas anteriores; el layout se carga al final."
        },
        {
          id: "consume-design-02",
          prompt: "Academy necesita guardar progreso, calificar cuestionarios y decidir qué unidad desbloquear. ¿A qué repositorio pertenece esa lógica?",
          options: [
            { id: "a", text: "A Academy, porque son estado y reglas del producto educativo" },
            { id: "b", text: "A @milpa/design, para que el CSS decida el avance del estudiante" },
            { id: "c", text: "A Runtime, porque cualquier estado de interfaz es parte del boot" },
            { id: "d", text: "A Core, para compartir la rúbrica con todos los hosts" }
          ],
          answer: "a",
          explanation: "Milpa Design publica CSS y contratos visuales, no JavaScript de producto. Rutas, datos, progreso y verificadores son conducta de Academy y deben permanecer en la aplicación."
        },
        {
          id: "consume-design-03",
          prompt: "Una sola lección necesita combinar `mui-card`, `mui-steps` y un resumen de progreso específico de Academy. Todavía no existe un patrón reutilizable general. ¿Qué implementación respeta la gobernanza?",
          options: [
            { id: "a", text: "Crear localmente una nueva clase `mui-learning-summary` y tratarla como pública" },
            { id: "b", text: "Copiar la anatomía privada de `mui-card` y renombrar sus selectores" },
            { id: "c", text: "Componer las piezas publicadas con una clase local `ac-*` sin redefinir su anatomía" },
            { id: "d", text: "Editar directamente el CSS instalado dentro de node_modules" }
          ],
          answer: "c",
          explanation: "Academy puede coser su caso educativo con prefijo propio. La composición local consume contratos `mui-*`; no inventa una API pública ni duplica internals antes de reunir evidencia para promover un patrón."
        }
      ]
    }
  });
})();

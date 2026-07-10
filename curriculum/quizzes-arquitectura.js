(function (root) {
  "use strict";

  root.MilpaQuizBank.register({
  "arquitectura/atlas-limites": {
    "passScore": 3,
    "questions": [
      {
        "id": "arquitectura-atlas-limites-01",
        "prompt": "`doctor` confirma que el kernel arrancó y `/reports` responde por HTTP, pero `inspect:tools` no muestra `GenerateReport`. ¿Qué límite conviene auditar primero?",
        "options": [
          { "id": "a", "text": "El registro y el pipeline de tools en `tool-runtime`, empezando por `ToolRegistry`." },
          { "id": "b", "text": "La secuencia general de boot en `runtime`, porque toda ausencia posterior pertenece al kernel." },
          { "id": "c", "text": "El event store, porque una tool no existe hasta que deja un evento persistido." }
        ],
        "answer": "a",
        "explanation": "Boot y HTTP ya aportan evidencia positiva sobre otros límites. La ausencia ocurre en el registro especializado de tools; el atlas debe llevar primero a `tool-runtime` y luego seguir sus contratos, sin atribuir todo al kernel."
      },
      {
        "id": "arquitectura-atlas-limites-02",
        "prompt": "Un tutorial afirma: «Core ejecuta y persiste las aprobaciones porque define `VerificationResult`». ¿Cuál es la corrección arquitectónica más precisa?",
        "options": [
          { "id": "a", "text": "Mantener la afirmación: quien define un tipo necesariamente es dueño de toda su ejecución y persistencia." },
          { "id": "b", "text": "Separar responsabilidades: Core define el contrato triestado; Workflow implementa la maquinaria y Orchestrator/Event Store aportan proceso e historia según el caso." },
          { "id": "c", "text": "Mover `VerificationResult` a Academy para que la interfaz y la experiencia educativa tengan un solo dueño." }
        ],
        "answer": "b",
        "explanation": "Definir una interfaz no implica poseer cada implementación. El mapa actual distingue el contrato mínimo en Core, la máquina de verificación en Workflow y la coordinación o persistencia en paquetes especializados."
      },
      {
        "id": "arquitectura-atlas-limites-03",
        "prompt": "Una nueva tarjeta del atlas dice que un paquete «es dueño de la autorización», pero solo enlaza a la portada de la organización y no identifica interface, manifest ni archivo. ¿Cómo debe publicarse?",
        "options": [
          { "id": "a", "text": "Como hecho verificado, porque el nombre del paquete hace plausible la responsabilidad." },
          { "id": "b", "text": "Como detalle interno estable, sin fuente, para no distraer al lector con enlaces." },
          { "id": "c", "text": "Como hipótesis pendiente, o no publicarse, hasta terminar en una fuente primaria que sostenga la afirmación." }
        ],
        "answer": "c",
        "explanation": "El atlas orienta la auditoría, no sustituye evidencia. Una afirmación importante solo se marca verificada cuando puede seguirse hasta un contrato o implementación primaria fechada."
      }
    ]
  },
  "arquitectura/runtime-boot": {
    "passScore": 3,
    "questions": [
      {
        "id": "arquitectura-runtime-boot-01",
        "prompt": "El manifest de `BillingPlugin` requiere `payments`, pero ningún plugin la provee. Alguien propone registrar sus rutas de todos modos para que el equipo pueda probarlas. ¿Qué debe hacer el runtime?",
        "options": [
          { "id": "a", "text": "Exponer las rutas y fallar solo cuando una petición use `payments`." },
          { "id": "b", "text": "Fallar al resolver el grafo antes de completar boot y antes de exponer registries derivados." },
          { "id": "c", "text": "Inventar una capacidad `payments` vacía para conservar el orden de arranque." }
        ],
        "answer": "b",
        "explanation": "Las rutas y servicios solo deben derivarse de un conjunto de plugins válido. Diferir la dependencia ausente hasta atender tráfico convertiría una condición verificable de boot en un fallo tardío."
      },
      {
        "id": "arquitectura-runtime-boot-02",
        "prompt": "¿Qué información distingue correctamente el momento anterior y posterior a resolver el grafo de plugins?",
        "options": [
          { "id": "a", "text": "Antes se conocen manifests y contratos `provides/requires`; después se conoce un orden de boot válido derivado de esas relaciones." },
          { "id": "b", "text": "Antes ya existe el orden de boot definitivo; después solo se ordenan alfabéticamente las rutas." },
          { "id": "c", "text": "Antes se ejecutan controladores; después se descubren por primera vez los plugins que los contienen." }
        ],
        "answer": "a",
        "explanation": "El resolver necesita primero las declaraciones del conjunto. El orden no es una lista manual ni alfabética: es una consecuencia del grafo validado y habilita las fases de registro posteriores."
      },
      {
        "id": "arquitectura-runtime-boot-03",
        "prompt": "`php bin/coa doctor` reporta kernel, contenedor y plugins saludables, pero `/catalog` no aparece. ¿Cuál es la siguiente secuencia de diagnóstico con mejor evidencia?",
        "options": [
          { "id": "a", "text": "Reinstalar el skeleton; un `doctor` saludable descarta cualquier error de registro." },
          { "id": "b", "text": "Editar directamente el registry de rutas para agregar `/catalog` y volver a ejecutar `doctor`." },
          { "id": "c", "text": "Usar `inspect:plugins` para confirmar el plugin y `inspect:routes` para comprobar el registro específico; revisar servicios si esa traza lo requiere." }
        ],
        "answer": "c",
        "explanation": "`doctor` da una vista de salud transversal; los comandos `inspect:*` muestran registries concretos. Son evidencias complementarias: boot saludable no demuestra que una ruta particular fue declarada y registrada."
      }
    ]
  },
  "arquitectura/estado-log": {
    "passScore": 3,
    "questions": [
      {
        "id": "arquitectura-estado-log-01",
        "prompt": "Existe un snapshot válido hasta el evento 80 y el stream contiene eventos 81–100. ¿Cómo se reconstruye el estado sin perder historia?",
        "options": [
          { "id": "a", "text": "Tomar el snapshot como base y aplicar en orden los eventos 81–100; hacer replay completo si se necesita validar el snapshot." },
          { "id": "b", "text": "Usar únicamente el evento 100, porque el último evento contiene implícitamente todo el estado." },
          { "id": "c", "text": "Editar el snapshot con los campos del evento 100 y descartar los eventos intermedios." }
        ],
        "answer": "a",
        "explanation": "El snapshot es una optimización de lectura, no el proceso. La proyección sigue siendo un fold ordenado del historial; desde un snapshot válido puede continuarse con la cola de eventos."
      },
      {
        "id": "arquitectura-estado-log-02",
        "prompt": "Se registró por error `OrderApproved`, pero la decisión debe revertirse y conservar una auditoría explicable. ¿Qué intervención respeta un log append-only?",
        "options": [
          { "id": "a", "text": "Borrar `OrderApproved` y renumerar el stream para que parezca que nunca ocurrió." },
          { "id": "b", "text": "Agregar un evento correctivo o compensatorio con su motivo y dejar que la proyección derive el nuevo estado." },
          { "id": "c", "text": "Sobrescribir solo el snapshot; el log puede conservar una historia distinta al estado mostrado." }
        ],
        "answer": "b",
        "explanation": "Una corrección también es parte de la historia. Agregarla conserva orden, actor y causa; borrar el evento o esconder la divergencia en un snapshot destruye la capacidad de explicar el proceso."
      },
      {
        "id": "arquitectura-estado-log-03",
        "prompt": "Un sistema guarda únicamente `status = approved`. Meses después se pregunta quién aprobó, desde qué estado y por qué. ¿Qué conclusión es válida?",
        "options": [
          { "id": "a", "text": "El estado final basta; actor y causa pueden inferirse de forma inequívoca desde `approved`." },
          { "id": "b", "text": "Un snapshot nuevo puede recuperar automáticamente transiciones que nunca fueron persistidas." },
          { "id": "c", "text": "La evidencia ya se perdió: hace falta persistir eventos significativos con sus datos para reconstruir y explicar la decisión." }
        ],
        "answer": "c",
        "explanation": "Una proyección final responde dónde terminó el proceso, no cómo llegó ahí. Replay solo puede reconstruir hechos registrados; no inventa actor, transición ni motivo ausentes."
      }
    ]
  },
  "arquitectura/contrato-ejecutable": {
    "passScore": 3,
    "questions": [
      {
        "id": "arquitectura-contrato-ejecutable-01",
        "prompt": "Un gate muestra aprobado en verde y rechazado en rojo, pero ambos estados tienen el mismo texto y no exponen estado accesible. El contraste de los fondos pasa. ¿Puede considerarse cumplido el contrato?",
        "options": [
          { "id": "a", "text": "Sí; pasar contraste permite usar color como único portador de significado." },
          { "id": "b", "text": "No; debe expresar el estado también con texto, iconografía o atributos semánticos y verificar interacción y foco según el contrato." },
          { "id": "c", "text": "Sí, si el estado rechazado usa una animación más larga que el aprobado." }
        ],
        "answer": "b",
        "explanation": "AA no reduce accesibilidad a contraste. El significado no puede depender solo del color, y el contrato incluye anatomía, estados, teclado, foco, ARIA y motion reducido."
      },
      {
        "id": "arquitectura-contrato-ejecutable-02",
        "prompt": "Academy se ve correcta hoy cargando CSS desde la rama `main` de Design. ¿Qué cambio hace auditable esa dependencia?",
        "options": [
          { "id": "a", "text": "Fijar una versión publicada de `@milpa/design` y verificar sus contratos/gates contra esa misma versión." },
          { "id": "b", "text": "Mantener `main`, pero guardar una captura de pantalla para saber cómo se veía." },
          { "id": "c", "text": "Copiar las reglas necesarias a Academy y dejar de registrar de qué versión salieron." }
        ],
        "answer": "a",
        "explanation": "Una versión fija relaciona el render con un artefacto publicado y repetible. `main` cambia sin que el consumidor lo decida, y copiar CSS rompe trazabilidad y actualización por contrato."
      },
      {
        "id": "arquitectura-contrato-ejecutable-03",
        "prompt": "Una clase nueva produce la captura esperada en dark, pero no tiene `*.contract.json`, caso light ni fallback de reduced motion. ¿Cuál es su estado correcto?",
        "options": [
          { "id": "a", "text": "Componente público terminado, porque el aspecto dark es la fuente de verdad del sistema dark-first." },
          { "id": "b", "text": "Token nuevo, porque cualquier clase sin contrato se convierte automáticamente en foundation." },
          { "id": "c", "text": "Candidato local incompleto; no debe publicarse hasta describir el contrato y pasar los gates de calidad." }
        ],
        "answer": "c",
        "explanation": "Dark-first no significa dark-only. Una captura valida un caso, mientras el contrato ejecutable exige estados y promesas verificables, incluida paridad de tema y reduced motion."
      }
    ]
  },
  "arquitectura/plan-disco": {
    "passScore": 3,
    "questions": [
      {
        "id": "arquitectura-plan-disco-01",
        "prompt": "Una guía propone `php bin/coa make:controller ... --dry-run` para enseñar el plan de escritura. ¿Cómo debe revisarse contra el CLI público actual?",
        "options": [
          { "id": "a", "text": "Publicarla: si existe un `GenerationResult` interno, toda bandera imaginable está soportada." },
          { "id": "b", "text": "Quitar `--dry-run`; explicar preflight/WriteGuard como mecanismo interno y usar solo comandos expuestos, seguidos de `inspect:*`." },
          { "id": "c", "text": "Renombrarla a `--plan` sin comprobar la ayuda, porque comunica mejor la intención." }
        ],
        "answer": "b",
        "explanation": "Un resultado inspeccionable dentro del motor no constituye una interfaz CLI. La documentación debe distinguir el modelo conceptual de las banderas públicas realmente soportadas."
      },
      {
        "id": "arquitectura-plan-disco-02",
        "prompt": "El generador creó `HealthController.php`, pero `/health` no aparece en el host. ¿Qué evidencia debe cerrar la tarea?",
        "options": [
          { "id": "a", "text": "La existencia del archivo; escribir es equivalente a registrar correctamente." },
          { "id": "b", "text": "Una revisión visual del nombre del controlador, sin arrancar ni inspeccionar el host." },
          { "id": "c", "text": "La salida de `php bin/coa inspect:routes` mostrando `/health`, además del resultado de generación." }
        ],
        "answer": "c",
        "explanation": "El archivo prueba una mutación en disco, no integración con el runtime. La verificación posterior debe observar el registry que el host realmente construyó."
      },
      {
        "id": "arquitectura-plan-disco-03",
        "prompt": "Una generación produciría tres archivos, pero uno ya existe. ¿Qué resultado representa el comportamiento más seguro?",
        "options": [
          { "id": "a", "text": "El preflight detecta el conflicto antes de escribir el conjunto, lo reporta y permite resolverlo antes de reintentar conscientemente." },
          { "id": "b", "text": "Escribe los dos archivos libres y falla al tercero, dejando al usuario inferir el estado parcial." },
          { "id": "c", "text": "Sobrescribe siempre el archivo existente; la velocidad del scaffold importa más que preservar trabajo." }
        ],
        "answer": "a",
        "explanation": "Planear el conjunto permite detectar conflictos antes de mutar. WriteGuard y preflight existen para hacer explícito el alcance y evitar escrituras parciales o sobrescrituras accidentales."
      }
    ]
  },
  "disena/capas-visuales": {
    "passScore": 3,
    "questions": [
      {
        "id": "disena-capas-visuales-01",
        "prompt": "Una página usa controles, cards, ejemplos de código y el shell de documentación. ¿Cuál es el orden contractual de carga?",
        "options": [
          { "id": "a", "text": "tokens → motion → primitives → components → artifacts → layouts" },
          { "id": "b", "text": "tokens → primitives → components → layouts → artifacts → motion" },
          { "id": "c", "text": "layouts → artifacts → components → primitives → motion → tokens" }
        ],
        "answer": "a",
        "explanation": "Las capas se construyen de dependencias generales a composiciones de página. El orden canónico también está declarado por `@layer`, pero cargar el paquete en ese orden hace explícito el contrato del consumidor."
      },
      {
        "id": "disena-capas-visuales-02",
        "prompt": "El equipo necesita mostrar un bloque de código dentro del shell de una lección. ¿Dónde debe buscar primero cada pieza?",
        "options": [
          { "id": "a", "text": "`mui-code` en artifacts y `mui-docs` en layouts, componiéndolos sin duplicar sus anatomías." },
          { "id": "b", "text": "Ambos en primitives, porque todo elemento visible debe empezar en la capa más baja." },
          { "id": "c", "text": "Ambos en tokens, agregando variables que dibujen por sí solas el código y la página." }
        ],
        "answer": "a",
        "explanation": "Artifacts expresa contenido especializado; layouts organiza la página. Bajar piezas completas a primitives o tokens confunde responsabilidades y crea dependencias invertidas."
      },
      {
        "id": "disena-capas-visuales-03",
        "prompt": "Un producto necesita otra identidad cromática, pero la anatomía de `mui-btn` ya resuelve su caso. ¿Cuál es la intervención inicial más pequeña y gobernable?",
        "options": [
          { "id": "a", "text": "Reescribir cada variante de `.mui-btn` con colores hex distintos dentro del producto." },
          { "id": "b", "text": "Sobrescribir tokens semánticos mediante un theme/skin y validarlos contra `theme.contract.json`." },
          { "id": "c", "text": "Duplicar `mui-btn` como componente local aunque su estructura no cambie." }
        ],
        "answer": "b",
        "explanation": "Si cambia la identidad y no la estructura, la retokenización es el nivel correcto. Conserva contratos y permite que el verificador mida contraste e invariantes del theme completo."
      }
    ]
  },
  "disena/composicion-app": {
    "passScore": 3,
    "questions": [
      {
        "id": "disena-composicion-app-01",
        "prompt": "Academy añade un cuestionario que califica respuestas, desbloquea unidades y guarda progreso. ¿Cómo se reparten las responsabilidades?",
        "options": [
          { "id": "a", "text": "Design publica el CSS y los contratos visuales; Academy implementa preguntas, estado, calificación, persistencia y navegación." },
          { "id": "b", "text": "Design debe publicar el banco de preguntas y `localStorage`, porque el cuestionario usa clases `mui-*`." },
          { "id": "c", "text": "Academy debe copiar el CSS de Design para que su JavaScript sea dueño de toda la experiencia." }
        ],
        "answer": "a",
        "explanation": "Milpa Design entrega lenguaje visual y cero JavaScript publicado. El comportamiento educativo y sus datos pertenecen a la aplicación que conoce el dominio de aprendizaje."
      },
      {
        "id": "disena-composicion-app-02",
        "prompt": "El cuestionario combina choices, callouts y progreso existentes, pero necesita una distribución específica de lección. ¿Qué estrategia conserva los límites?",
        "options": [
          { "id": "a", "text": "Crear una composición `ac-quiz` que use las anatomías `mui-*` públicas sin redefinirlas." },
          { "id": "b", "text": "Añadir nuevos slots privados dentro de `.mui-choice` desde Academy y documentarlos como si fueran públicos." },
          { "id": "c", "text": "Renombrar todos los `mui-*` usados a `ac-*` y mantener una copia divergente." }
        ],
        "answer": "a",
        "explanation": "El prefijo local cose el caso educativo; las piezas publicadas conservan su contrato. Modificar anatomías privadas o copiar componentes hace que Academy dependa de forks invisibles."
      },
      {
        "id": "disena-composicion-app-03",
        "prompt": "Para reutilizar una tarjeta, alguien propone agregar a `@milpa/design` lógica que lee `localStorage`, conoce rutas de Academy y marca una unidad como aprobada. ¿Qué decisión es correcta?",
        "options": [
          { "id": "a", "text": "Aceptar: un componente visual es más reusable si contiene reglas específicas del primer producto." },
          { "id": "b", "text": "Rechazar esa lógica del paquete visual; mantenerla en Academy y pasar a la pieza solo estado/markup acorde con su contrato." },
          { "id": "c", "text": "Mover también el catálogo curricular a Design para evitar parámetros entre capas." }
        ],
        "answer": "b",
        "explanation": "Rutas, progreso y criterio de aprobación son dominio de Academy. Design puede representar estados, pero no decidirlos ni persistirlos; hacerlo acoplaría el lenguaje visual a una sola aplicación."
      }
    ]
  },
  "disena/promocion-patron": {
    "passScore": 3,
    "questions": [
      {
        "id": "disena-promocion-patron-01",
        "prompt": "`ac-knowledge-map` se ve bien y funciona en una sola lección, pero todavía no existe otro uso ni evidencia fuerte de repetición. ¿Qué debe ocurrir?",
        "options": [
          { "id": "a", "text": "Promoverlo de inmediato a `mui-*`; el acabado visual demuestra generalidad." },
          { "id": "b", "text": "Mantenerlo como candidato `ac-*`, observar el caso real y reunir evidencia antes de generalizar." },
          { "id": "c", "text": "Moverlo a foundations para evitar decidir si es patrón o composición." }
        ],
        "answer": "b",
        "explanation": "Academy es laboratorio. Un caso real permite aprender, pero no basta por sí solo para afirmar que la pieza merece un contrato público reusable."
      },
      {
        "id": "disena-promocion-patron-02",
        "prompt": "Una composición aparece en tres pantallas y tiene contrato, pero no puede operarse con teclado y su animación ignora `prefers-reduced-motion`. ¿Está lista para promoción?",
        "options": [
          { "id": "a", "text": "Sí; repetición y contrato sustituyen los gates de accesibilidad." },
          { "id": "b", "text": "Sí, si se publica como experimental sin ejecutar `npm test`." },
          { "id": "c", "text": "No; debe cumplir el quality floor y pasar teclado, foco, a11y, motion y los demás gates antes de entrar." }
        ],
        "answer": "c",
        "explanation": "La regla de entrada es acumulativa. Repetición demuestra demanda; no elimina la obligación de que el patrón sea accesible, verificable y consistente con la gobernanza."
      },
      {
        "id": "disena-promocion-patron-03",
        "prompt": "Un candidato tiene dos usos reales, contrato y gates verdes, pero cada consumidor debe copiar un archivo privado y aplicar selectores internos porque el paquete no lo exporta. ¿Qué falta?",
        "options": [
          { "id": "a", "text": "Nada; los hacks de consumo son aceptables si están documentados." },
          { "id": "b", "text": "Consumo limpio desde una versión publicada: exportar la pieza y comprobar que funciona sin parches ni acceso a privados." },
          { "id": "c", "text": "Una cuarta pantalla; el paquete solo puede exportar patrones con cuatro usos." }
        ],
        "answer": "b",
        "explanation": "La última condición de promoción es consumibilidad real. Un contrato que solo funciona mediante copias o selectores privados todavía no es un contrato público del paquete."
      }
    ]
  }
  });
})(typeof globalThis !== "undefined" ? globalThis : this);

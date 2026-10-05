# Incorporar un agente sin delegar la autoridad humana

**Resultado:** entenderás qué puede delegarse, cómo se gobierna una sesión y cómo leer sus pausas. Ejecutar un modelo es una rama opcional del curso.

## Una casa puede operar sin un modelo

Las reglas del taller, sus operaciones y sus pruebas no necesitan inteligencia generativa. El agente añade la posibilidad de interpretar una petición y elegir herramientas del catálogo. No sustituye al servicio ni vuelve correcta una transición que sus pruebas refutaron.

`milpa/ai-gateway` aporta la comunicación y el ciclo modelo ↔ herramientas; `milpa/agent` aporta sesiones y sus mecanismos de gobierno. Antes de adoptar, pregunta qué tarea concreta justifica el agente: consultar disponibilidad y explicar su resultado es más preciso que «hacer inteligente el taller».

```bash
php bin/coa capabilities:enable milpa/ai-gateway --dry-run --json
php bin/coa capabilities:enable milpa/ai-gateway --sign --json
php bin/coa capabilities:enable milpa/agent --dry-run --json
php bin/coa capabilities:enable milpa/agent --sign --json
php bin/coa house:start --json
php bin/coa agent:catalogue --json
```

El último comando permite leer lo que recibiría el agente. El catálogo del humano no debe confundirse con el del modelo: algunas operaciones que gobiernan sesiones se filtran. Su existencia en CLI no implica que el agente pueda llamarlas.

## Configurar el proveedor que elegiste

La elección de un proveedor determina a dónde salen las entradas y qué servicio cobra por el trabajo. Sigue la configuración que documenta la versión instalada. El runtime reconoce variables como `ANTHROPIC_API_KEY` u `OPENAI_API_KEY` para esos proveedores, y un endpoint compatible con OpenAI mediante `MILPA_AGENT_BASE_URL`, `MILPA_AGENT_MODEL` y, cuando haga falta, `MILPA_AGENT_API_KEY`.

Para un endpoint propio, usa su raíz sin agregar `/v1` si así lo exige este runtime. El endpoint declarado tiene prioridad frente a claves de proveedores presentes; recibe la clave específica de `MILPA_AGENT_API_KEY`, no una clave ajena por coincidencia de protocolo. Las credenciales se configuran fuera de archivos versionados.

Consulta `agent:model` y el contrato de las operaciones disponibles para observar lo declarado. Una declaración de modelo no prueba que el servicio externo responda. La evidencia de esta edición del curso no incluye una ejecución de modelo ni llamadas facturables.

Cuando tengas configurado deliberadamente el proveedor, un primer pedido acotado sería:

```bash
php bin/coa agent \
  'Consulta las herramientas del taller y explica cuáles están disponibles. No modifiques el inventario.' \
  --sign
```

El arranque de una sesión puede dejar estado y está sujeto a autorización. Si faltan paquetes, identidad o proveedor, la casa debe decir qué falta. No hay que interpretar un texto plausible como prueba de que consultó el dominio. Lee qué herramientas ejecutó y qué resultados recibió.

## Qué autoridad conserva cada actor

El humano decide propósito, producto, fronteras y cambios destructivos. El modelo interpreta cómo materializar un objetivo dentro de lo permitido. El runtime aplica las condiciones del piso y los permisos de la sesión. Una segunda opinión, cuando está configurada, puede rechazar una llamada que excede lo pedido; no reemplaza el piso no eludible.

El modo `auto` no autoriza por anticipado todo efecto ni elimina la demanda de firma. La intención se evalúa antes de la política que decide cuánta autonomía admite una llamada. «Presta la herramienta vieja» no nombra un id existente; si la operación exige `namedTarget`, esa ambigüedad debe resolverse antes de operar. Una autorización concreta tampoco da permiso para afectar otra herramienta.

`agent:answer` y `agent:mode` permiten al humano gobernar la sesión y se excluyen del catálogo que recibe el propio agente. Una herramienta que permite responder sus propias pausas convertiría la autoridad en una elección del gobernado.

## Leer y atender una pausa

Con una sesión creada:

```bash
php bin/coa agent:sessions --json
php bin/coa agent:show --session='ID_REAL' --json
php bin/coa operation:contract --name=agent:answer --json
```

Obtén el id de la lista, no lo deduzcas de un título. Lee la operación propuesta, sus argumentos y la pregunta que detuvo el trabajo. Responde por el canal autorizado con la intención que realmente sostienes. El contrato puede ofrecer respuesta, contrapropuesta o un sobre de efectos; no significan lo mismo. Una contrapropuesta pide otra propuesta y no concede consentimiento a la anterior.

`agent:answer` registra una respuesta; su descripción dice que no reanuda por sí mismo el loop. Consulta el contrato de `agent` para la continuación con sesión que admite tu versión. Antes de continuar comprueba estado, id y pregunta pendiente. Un «sí» ordinario no siempre satisface una demanda de autorización con prueba verificable; lee la negativa que realmente devuelve el piso.

El historial registra hechos de una sesión. Leer un argumento propuesto o un resultado almacenado no prueba que el cambio se aceptó o promovió. Para afirmar que una herramienta fue prestada, lee también el estado del dominio y la evidencia de ejecución.

## Identidad del residente y trabajo confinado

Un agente residente utiliza su propia clave y un llavero separado. La casa puede darle un asiento mediante `identity:seat`; la invitación produce el comando que su clave debe aceptar con `identity:accept`. El humano que lo sienta y los scopes efectivos quedan identificados. No copies al agente tu llave secreta ni uses la firma humana como identidad permanente del residente.

Las operaciones de desarrollo pueden escribir en un trial workspace durante una sesión gobernada. Una copia limita archivos afectados; no aísla automáticamente la red ni elimina efectos sobre terceros. Lee `sandbox:list`, inspecciona los cambios y consulta `sandbox:promote` antes de adoptarlos. La promoción es una operación gobernada propia. Un test verde en el trial y una promoción aceptada son dos hechos que debes observar.

El curso no exige adoptar herramientas de filesystem o shell generales. Si las necesitas, su adopción es otra decisión de capacidades y efectos, con una superficie de autoridad distinta a listar herramientas.

## Comprobación

Sin un modelo, entrega el diseño de una tarea con objetivo, herramientas permitidas, negativas esperadas y evidencia de cierre. Si ejecutas la rama opcional, entrega además la sesión, llamadas reales y estado resultante. No presentes una explicación del modelo como evidencia suficiente de una mutación.

Continúa con [decidir y operar](10-decidir-y-operar.md).

# Referencia para contenido avanzado — dónde vive la verdad

> Para seniors que quieren auditar la arquitectura y para creadores de
> contenido (tutoriales, workshops, artículos) que necesitan fuentes
> primarias. Regla editorial: **cada afirmación de un tutorial debe poder
> citarse a un archivo de un repo público.** Si no puedes citarla, no la
> afirmes.

## El mapa de temas profundos

Cada fila es un tutorial avanzado en potencia: el tema, la pieza real que
lo implementa, y el ángulo que lo hace interesante para un senior.

| Tema | Dónde vive | El ángulo |
|---|---|---|
| **Pipeline de ejecución de tools** | `tool-runtime` → `ToolRegistry` | Cada llamada pasa por resolver→validar→autorizar→ejecutar→auditar. Las denegaciones explican su causa; los datos sensibles se redactan antes de loggear. Comparar contra el típico "middleware spaghetti". |
| **El seam de verificación (human-in-the-loop)** | `core` (interfaces + `VerificationResult` tri-estado) + `workflow` (la maquinaria) | Por qué el core define solo el *contrato* de verificar (pass/fail/**waived**) y la máquina de estados vive aparte. El waive como dato de primera clase. |
| **State machines data-driven** | `workflow` → `DataDrivenStateMachine` | Estados, transiciones y gates viven en DATOS, no en constantes — cambias un flujo sin redeploy. Identidad como principal opaco (`"member:42"`): el host es dueño de su dominio, la librería no impone modelo de usuarios. |
| **Event sourcing minimalista** | `event-store` (append-only, file/JSONL + in-memory tras una interface) | Log inmutable, replay, proyección como fold. Cero dependencias — ideal para enseñar el patrón sin el peso de un broker. |
| **Orquestación event-sourced de procesos** | `orchestrator` | "Todo es un proceso; un proceso es una máquina de estados; el estado es una proyección del log." Los gates humanos exponen opciones que mapean **1:1** a las transiciones del proceso; la auto-aprobación se rechaza *por construcción*. Tres tools MCP lo operan completo. |
| **MCP sin transporte acoplado** | `mcp-server` → servicio JSON-RPC puro (array in → array out) | El dispatcher no sabe de HTTP ni SSE — el transporte es un adaptador. Eventos vetables por request y de auditoría al responder. Excelente para discutir "puertos y adaptadores" con un caso 2026. |
| **Resolución de plugins estilo package manager** | `plugin` → `ContractResolver`, `PluginManifest`, `LockFileManager` | Ordenamiento topológico (Kahn) por contratos provides/requires, semver contra GitHub releases (sin registry central), lockfile con hash de integridad. Un package manager de juguete... que no es de juguete. |
| **DI con diagnóstico honesto** | `container` | Autowiring con detección de dependencias circulares que reporta la **cadena completa** (`A → B → C → A`), no un "circular dependency detected" inútil. |
| **Componentes render-target-agnósticos** | `live` (definición pura) + `live-web` (HTML/Alpine + seguridad HMAC/CSRF) | La definición del componente no sabe si renderiza HTML, TUI o ANSI. Server-driven UI sin virtual DOM. |
| **Gateway multi-LLM** | `ai-gateway` | Dos proveedores (Anthropic/OpenAI) tras un shape unificado + loop ask-act inmutable. Cómo abstraer LLMs sin caer en el mínimo común denominador. |
| **Theming como contrato ejecutable** | `milpa-design` → `theme.contract.json` + `verify-theme` | Cascade layers como mecanismo (el CSS del consumidor gana sin `!important`); el gate compone superficies translúcidas sobre `--bg` y mide contraste *efectivo* — hasta el glassmorphism se valida matemáticamente. |
| **Docs generadas del código** | `core` → `tools/gen-docs/` | La referencia se genera de DocBlocks (que el CI exige); una fuente, dos audiencias (HTML para humanos, contexto para agentes). |
| **Generación con plan (agent-safe scaffolding)** | `devtools` → Make engine + `WriteGuard` | El motor produce `PlannedFile` en memoria, aplica preflight y `WriteGuard`, escribe y verifica contra reglas del runtime. El skeleton público ejecuta ese ciclo al usar `make:*`; su CLI actual no expone `--dry-run`. |

## Formatos de tutorial que funcionan con este material

1. **"Lee el contrato primero"** — arrancar cada tutorial por el
   `*.contract.json` / interface / manifest, y solo después ver la
   implementación. Enseña el hábito más valioso del ecosistema.
2. **Autopsia comparada** — mismo problema resuelto por Milpa vs framework
   mainstream: p. ej. "registrar una acción invocable" (atributo + pipeline
   vs controlador + middleware ad-hoc). Sin bashing: trade-offs honestos.
3. **Rompe y lee** — provocar el fallo a propósito (ciclo en el grafo, par
   AA que no pasa, gate sin aprobador) y estudiar la *calidad del error*.
   La tesis: un sistema se juzga por cómo falla.
4. **Con agente, en vivo** — darle una tarea real junto con el README y la
   salida de `php bin/coa inspect:plugins`, `inspect:routes` e
   `inspect:commands`; narrar cómo validadores, `WriteGuard` y gates lo
   mantienen productivo y acotado. El framework como demostración de AX
   (agent experience).

## Rutas para probar la arquitectura (a mano o con agentes)

### Ruta A — el corazón (medio día)
1. `composer create-project milpa/skeleton arquitectura-milpa` → leer
   `bin/coa`, el boot del
   kernel y el orden de arranque de plugins.
2. Ejecutar `php bin/coa agent:enable`, escribir un `ToolProvider` con 2
   tools y observar el pipeline con un policy provider propio que deniegue
   una y permita auditar su rama.
3. Cablear una verificación: acción mutante tras un gate; resolverla por
   CLI. Observar el tri-estado.

### Ruta B — procesos y eventos (un día)
1. `event-store`: modelar un contador event-sourced; replay y proyección.
2. `workflow`: definir un flujo de 4 estados con un gate waiveable EN DATOS.
3. `orchestrator`: correr un proceso con decisión humana; intentar la
   auto-aprobación y ver el rechazo por construcción.

### Ruta C — la superficie agente (medio día)
1. En el esqueleto, ejecutar `php bin/coa agent:enable`; luego crear una tool
   con `php bin/coa make:tool` y comprobarla con
   `php bin/coa inspect:tools`.
2. Levantar `bin/mcp-server.php`, conectar un cliente MCP y operarlo:
   listar tools, llamarlas, provocar una denegación de policy.
3. Discusión: qué expone un framework "agent-native" que uno normal no.

### Ruta D — el design system como caso de estudio de gobernanza (medio día)
1. Leer `DESIGN.md` (la constitución) y un contrato de componente.
2. Escribir un skin nivel 1 y pasarlo por `verify-theme`; luego romperlo a
   propósito (un `--surface` translúcido que viole AA compuesto) y leer el
   fallo del gate.
3. Discusión: CI que verifica *intención de diseño*, no solo sintaxis.

## Reglas para creadores de contenido

- **Versiones**: el ecosistema es 0.x — cita versiones exactas y fecha tu
  contenido. No prometas estabilidad que el proyecto mismo no promete.
- **Nada de números mágicos**: la cantidad de paquetes crece; di "la
  familia `milpa/*`" y enlaza a Packagist en vez de contar.
- **La historia es del creador**: la anécdota de la coa y su papá puede
  citarse (es pública, en milpa.lat y DESIGN.md) — con atribución a
  Rodrigo Vicente, y sin dramatizarla más de lo que ya es.
- **Marca**: el wordmark y el símbolo Grano se usan del kit oficial
  (`milpa-design/logo/`), sin recrearlos ni recolorearlos. Apache-2.0
  cubre el código; la marca es aparte.

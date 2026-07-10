# Milpa Academy · Webinar artifacts

Galería estática de artifacts interactivos para el webinar **“Cómo un palo de
madera diseñó un framework”**. Consume directamente las capas publicadas de
`@milpa/design@0.9.0`; no tiene dependencias de runtime ni proceso de build.

## Primitivas didácticas (0.9.0)

Las cuatro piezas didácticas nacieron aquí como patrones `wb-*`, se destilaron
al design system y ahora la galería las consume publicadas con contrato
(cluster “almácigo” de `milpa-artifacts.css`):

| Contrato | Pieza | Dónde se usa |
|---|---|---|
| `mui-plot` | la parcela (celdas con contrato provee/requiere y estados slot/germinating/sown/wilted) | Artifact 1 · semillas y campo |
| `mui-pipeline` | el tubo de etapas (+ canica `--_pipeline-progress`; variante `--vertical`) | Artifact 2 · pipeline conceptual, Artifact 5 · radiografía del runtime |
| `mui-gate` | la compuerta (solicitud, decisión tri-estado, outcome y audit append-only) | Artifact 3 |
| `mui-replay` | el log reproducible (stream, corte con range nativo y proyección) | Artifact 6 |

La galería es el battle-test externo de esas primitivas: los estados viven en
atributos (`data-state`/`data-status`/`aria-current`) y el comportamiento es de
este consumidor, con la lógica pura en `artifacts-core.js`. Lo que queda `wb-*`
es composición específica de cada artifact (shell, zonas, atlas, laboratorio de
contraste, plan), no patrones repetibles.

## Abrir

Desde la raíz del repo `academy`:

```bash
npm run dev
```

Abrir `http://localhost:4325/artifacts/`. La galería usa scripts clásicos con
`defer` (`artifacts-core.js` antes de `artifacts.js`), no módulos ES. También se
puede abrir con `file://`; solo necesita red para cargar el CSS publicado de
`@milpa/design` desde el CDN.

## Inventario

| # | Artifact | Alcance |
|---|---|---|
| 1 | Siembra tu milpa | Grafo `provides/requires`, orden de Kahn y ciclos |
| 2 | Una acción, dos puertas | Pipeline conceptual compartido por CLI y MCP |
| 3 | La compuerta | Decisión triestado, auditoría y anti autoaprobación |
| 4 | Atlas de límites | Paquetes, responsabilidades y flujos entre límites |
| 5 | Radiografía del runtime | Pipeline real de `ToolRegistry::call()` y salidas tempranas |
| 6 | El proceso es el log | Append-only log, replay y proyección por fold |
| 7 | Contrato ejecutable | DTCG → build → contratos/gates → consumidor |
| 8 | El plan antes del disco | `PlannedFile`, inspección, `WriteGuard` y verificación |
| 9 | El átomo y sus puertas | `Operation` declarada una vez, proyectada a coa/MCP/HTTP y su hueco de scopes en HTTP |

Los tres primeros implementan las specs de
`docs/GUION-WEBINAR-JUNIORS.md`. Los restantes desarrollan el mapa de
`docs/REFERENCIA-SENIOR.md` con evidencia de los repos reales.

## Fuentes auditadas

- `docs/GUION-WEBINAR-JUNIORS.md:81-191` — specs de los tres juegos.
- `docs/REFERENCIA-SENIOR.md:14-28` — mapa de arquitectura avanzada.
- `getmilpa-tool-runtime/src/ToolRegistry.php:348-603` — pipeline real.
- `getmilpa-event-store/src/EventStoreInterface.php` — append/replay/streams.
- `getmilpa-orchestrator/src/Reducer.php` — estado como proyección del log.
- `getmilpa-mcp-server/src/JsonRpcService.php` — servicio JSON-RPC sin transporte.
- `getmilpa-devtools/src/Make/` — plan en memoria, `WriteGuard` y verificación.
- `milpa-design/tokens/`, `scripts/` y `*.contract.json` — contrato visual.

La galería distingue explícitamente entre **modelo didáctico** y
**implementación auditada**. En particular, no afirma cobertura universal de
auditoría para todas las salidas tempranas de `ToolRegistry::call()`.

## Verificación

```bash
npm test   # 14 tests de la lógica pura (artifacts-core.test.mjs)
           # + milpa-artifact.test.mjs cubre la hidratación del artifact 9 (átomo)
```

El drag del primer artifact tiene alternativa completa por click/teclado. La
navegación usa enlaces, foco visible y estados ARIA; las animaciones respetan
`prefers-reduced-motion`.

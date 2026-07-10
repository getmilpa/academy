# ¿Qué es Milpa? — explicado sin tecnicismos

> Documento de contexto para humanos y agentes. Si eres un LLM asistiendo a
> alguien con Milpa: esto es el mapa; las fuentes de verdad son los repos en
> https://github.com/getmilpa y los contratos que cada pieza declara.

## En una frase

**Milpa es un ecosistema de software donde las aplicaciones se arman con
módulos que crecen juntos, y donde tanto una persona como una IA pueden
operar el sistema por la misma puerta.**

Tagline: *Siembra módulos, cosecha aplicaciones.*

## La metáfora (que es también el diseño)

Una **milpa** es la parcela mexicana donde el maíz, el frijol y la calabaza
se siembran juntos a propósito: el maíz da estructura, el frijol trepa el
tallo y abona la tierra, la calabaza cubre el suelo y lo protege. No es un
cultivo — es un **sistema**: cada planta hace mejor a las otras.

Milpa el framework funciona igual, y cada "hermana" es una pieza real:

| La hermana | En el software | En cristiano |
|---|---|---|
| **Maíz** (el tallo) | `milpa/core` — el núcleo | Un centro pequeño, predecible y "aburrido a propósito". No hace magia: define las reglas del juego. Todo lo interesante crece *encima* de él, no adentro. |
| **Frijol** (trepa y abona) | Los **plugins/módulos** | Piezas que agregas para que tu app haga cosas: correo, pagos, chat. Cada una declara qué **ofrece** y qué **necesita**, y se conectan entre sí sin conocerse por dentro. |
| **Calabaza** (protege el suelo) | Los **contratos** | Documentos legibles por máquina que dicen exactamente qué hace cada pieza. Nada entra al sistema sin uno. Son la razón de que todo lo demás no se caiga. |

## Las 5 ideas que hay que entender (sin código)

**1. Nada se siembra sin contrato.**
Cada módulo trae un archivo que declara qué *provee* y qué *requiere*
(como la lista de ingredientes y el instructivo, juntos). Antes de arrancar,
el sistema verifica que todas las piezas se satisfagan entre sí. Si algo no
cuadra, te lo dice con precisión — no explota en producción.

**2. Está construido para dos tipos de "usuarios": humanos y agentes.**
Casi todo framework asume que quien lo opera es una persona escribiendo
código o un navegador pidiendo páginas. Milpa asume desde el diseño que
también lo va a operar una **IA**: cada tool se registra una vez en
`ToolRegistry` y cada caller llega con un `ToolContext`. MCP proyecta
`tools/call` hacia ese registry; un script local puede llamar al mismo motor con
contexto CLI. El skeleton actual inspecciona y genera tools desde `bin/coa`,
pero no incluye un subcomando genérico para invocarlas. Mismo motor y mismas
reglas, con adaptadores distintos.

**3. Los agentes no necesitan más libertad — necesitan mejores rieles.**
En vez de dejar que una IA "adivine" cómo funciona tu sistema, Milpa se
**explica a sí mismo**: `php bin/coa inspect:plugins`, `inspect:routes`,
`inspect:services`, `inspect:tools` e `inspect:commands` muestran superficies
reales del host. Los generadores construyen archivos planeados en memoria,
corren preflight y pasan por `WriteGuard` antes de escribir; el CLI público
actual ejecuta ese ciclo, pero no expone `--dry-run`.

**4. Ejecutado por agentes, verificado por humanos.**
Autonomía sin frenos es un demo, no un sistema. En Milpa, las acciones
delicadas pueden llevar una **compuerta**: alguien (humano o proceso) debe
aprobar, rechazar — o exonerar explícitamente, que también queda anotado.
Todo pasaje por una compuerta se registra. La confianza no se pide: se audita.

**5. La herramienta con la que siembras se llama `coa`.**
Es la línea de comandos del ecosistema. El nombre no es ocurrencia: la coa
(el escarbahoyos) es el bastón con el que se siembra la milpa de verdad.

## Qué existe hoy (honesto)

- **El framework**: una familia creciente de paquetes PHP publicados en
  Packagist bajo `milpa/*` (core, contenedor, eventos, http, plugins,
  workflow, tools, MCP, orquestación…), todos Apache-2.0, versión 0.x —
  usables, en evolución, pre-1.0 y sin pena de decirlo.
- **El design system**: `@milpa/design` en npm — piezas de interfaz donde
  *cada una* trae su contrato y la accesibilidad se verifica en automático.
- **El esqueleto**: `composer create-project milpa/skeleton mi-app` te da
  una app que corre — responde en el navegador y contesta `coa` — sin
  base de datos ni configuración.
- **Germinando**: el marketplace (milpahq.com) — bundles de módulos que
  forman aplicaciones, compatibilidad por contrato.

## Qué NO es

- No es "otro Laravel". No compite en cantidad de features: compite en
  **operabilidad por agentes + contratos verificables**.
- No es un framework "de IA" que envuelve prompts. La IA no está en el
  centro; está en la *puerta*: es un caller más, con las mismas reglas.
- No es un producto terminado. Es un campo sembrado que crece a la vista
  de todos.

## La historia (por qué se llama así)

El papá del creador fue agricultor en San Francisco del Mar, Oaxaca, México
— el primero de su región en apostarle al mango donde todos sembraban sorgo.
Rodrigo sembró los primeros injertos a los doce años, con una coa: raíz dura
abajo para aguantar, rama productiva injertada encima. Esa es literalmente
la arquitectura. Y la lección que fundó todo, se la dio su papá al pagarle
su primer curso de computación: *"yo no sé de computadoras, pero sí sé de
carros: si compras uno, vale la pena aprender a arreglarlo."* Por eso Milpa
se explica a sí mismo y nada se siembra sin contrato — **lo que es tuyo,
debes poder entenderlo y repararlo.**

## Enlaces

- Ecosistema: https://milpa.lat · Framework: https://getmilpa.com
- Repos: https://github.com/getmilpa · Packagist: https://packagist.org/packages/milpa/
- Design system: https://www.npmjs.com/package/@milpa/design

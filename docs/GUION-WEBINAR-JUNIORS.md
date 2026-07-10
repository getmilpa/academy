# Guion de webinar — "Cómo un palo de madera diseñó un framework"

> **Audiencia:** juniors, bootcampers, estudiantes de universidad.
> **Duración:** 60 min (45 de contenido + 15 de Q&A y retos).
> **Objetivo:** que entiendan *arquitectura* — módulos, contratos, compuertas,
> agentes — usando Milpa como caso de estudio. NO es un curso de "programar
> en Milpa": es un curso de *pensar sistemas* con un ejemplo vivo.
> **Regla de oro del tono:** cada concepto entra por una historia o una
> interacción, nunca por una definición.

---

## Utilería previa

- [ ] Landing abierta en `milpa.lat` (o local) — el hero con la M germinando.
- [ ] `milpa-design/proof/theme-swap.html` abierto con el cambio
  Milpa/Brutalist/Glass listo.
- [ ] Terminal con una app `milpa/skeleton` ya creada. Si mostrarás tools,
  déjala preparada con `php bin/coa agent:enable` y una tool registrada.
- [ ] La galería de 8 artifacts abierta; prueba en particular
  [`#siembra`](../artifacts/#siembra), [`#pipeline`](../artifacts/#pipeline) y
  [`#compuerta`](../artifacts/#compuerta).
- [ ] Encuestas listas (Mentimeter/Slido/Kahoot o manos alzadas si no hay red).
- [ ] **La coa física si la tienes.** En serio. Es el mejor prop del mundo.

**Mecánica transversal — "los granos":** cada vez que alguien del público
participa (pregunta, responde, adivina), "siembra un grano": se anota en un
marcador visible. Al llegar a 13 granos (los de la M del logo), el grupo
"cosecha" — pausa de meme, sticker, o el premio que quieras. Convierte la
participación en juego colectivo sin competir individualmente.

---

## Bloque 0 · El gancho (min 0–5)

**(Entras sin slides. Solo tú — y si la tienes, la coa en la mano.)**

> "Antes de hablar de software les voy a contar de mi papá. Era agricultor,
> en San Francisco del Mar, Oaxaca. No sabía nada de computadoras. Y aún
> así, la mejor lección de arquitectura de software que he recibido en mi
> vida me la dio él, con una frase sobre... carros. ¿Alguien quiere
> adivinar qué me dijo?"

**INTERACCIÓN:** 2-3 intentos del público (siembran granos). Luego la revelas:

> "'Yo no sé de computadoras, pero sí sé de carros: si compras uno, vale la
> pena aprender a arreglarlo.' Y me pagó mi primer curso. Hoy les voy a
> mostrar cómo esa frase — y este palo (la coa) con el que sembré mangos a
> los 12 años — terminaron diseñando un framework open source. Y de paso,
> ustedes van a salir sabiendo leer la arquitectura de *cualquier* sistema."

**Puente:** "Levanten la mano los que han abierto un proyecto ajeno y no
entendieron NADA." *(Todas las manos suben.)* "Hoy vamos a ver por qué pasa
eso — y cómo se diseña para que no pase."

---

## Bloque 1 · ¿Qué es una arquitectura? (min 5–12)

**La analogía del carro (continuando la historia):**

> "Un carro tiene miles de piezas, y aun así un mecánico de cualquier taller
> puede repararlo. ¿Por qué? Porque las piezas tienen INTERFACES estándar:
> la batería tiene dos bornes, el filtro tiene una rosca. Nadie necesita
> leer el código fuente del alternador. Eso es arquitectura: **decidir las
> formas de las conexiones para que las piezas puedan cambiar sin que el
> sistema muera.**"

**INTERACCIÓN — encuesta rápida:** "¿Qué prefieren heredar de un dev
anterior? (a) 10,000 líneas geniales sin documentar (b) 10,000 líneas
mediocres con contratos claros". Discusión de 1 min con los resultados.

**Cierre del bloque:** "Hoy: un sistema real, open source, que pueden ir a
leer esta noche, diseñado alrededor de UNA idea: nada se siembra sin
contrato."

---

## Bloque 2 · La milpa: módulos que crecen juntos (min 12–22)

**Cuentas la metáfora de las tres hermanas** (maíz = núcleo, frijol =
módulos, calabaza = contratos) **con la landing en pantalla** — scroll para
que vean la M germinar. *(Momento "ooh" garantizado.)*

### 🎮 ARTIFACT 1 — ["Siembra tu milpa"](../artifacts/#siembra) (el grafo de dependencias jugable)

**Qué hay en el artifact** (HTML + `@milpa/design`, una pantalla):
- Un tablero con un **tallo central** (el core) y slots alrededor.
- Cards arrastrables de módulos, cada una mostrando su contrato en chiquito:
  `mail → provee: correo · requiere: cola`, `cola → provee: cola`,
  `tienda → requiere: correo, pagos`, `pagos → provee: pagos · requiere: BD`,
  `BD → provee: BD`, etc.
- Al soltar un módulo: si sus `requiere` están satisfechos por lo ya
  sembrado, la card **germina** (verde olivo, se asienta). Si no, se
  **marchita** (gris) y muestra: `falta: pagos`.
- Botón "arrancar sistema": recorre en orden y muestra la secuencia de
  arranque (proveedores antes que consumidores).
- **Modo caos** (el remate): botón que intenta sembrar `A requiere B` y
  `B requiere A` → el tablero muestra "CICLO: A → B → A" y tiembla.

**Cómo lo usas en vivo:** pides al público que te dicte el orden de siembra
para que la tienda funcione. Se equivocan, se marchita, corrigen. En 5
minutos entendieron: grafos de dependencias, orden topológico y detección
de ciclos — **sin decir ninguna de esas tres palabras hasta el final**,
cuando las revelas: "felicidades, acaban de hacer un ordenamiento
topológico. Así se llama en las entrevistas."

> Dato real para cerrar: "Esto que jugaron es literal lo que hace Milpa al
> arrancar: lee los contratos y ordena los módulos con este mismo algoritmo
> (se llama Kahn). Si hay ciclo, no arranca y te dice dónde."

---

## Bloque 3 · Dos tipos de callers: humanos y agentes (min 22–32)

**Setup:** "Pregunta: ¿para quién están construidos los frameworks que
usan? … Para humanos. ¿Y quién más está operando software hoy?" *(Dejas
que digan: las IAs.)* "Milpa está construido para los dos, por la misma
puerta. Les muestro."

### 🎮 ARTIFACT 2 — ["Una acción, dos puertas"](../artifacts/#pipeline) (el pipeline visible)

**Qué hay en el artifact:**
- Arriba, UNA definición de acción visible (pseudo-tarjeta, no código):
  `enviar_correo · necesita permiso: correo:enviar`.
- Dos botones grandes: **"Llamar como HUMANO (terminal)"** y **"Llamar
  como AGENTE (MCP)"**.
- Al presionar cualquiera, una **canica** recorre el mismo tubo de 5
  estaciones iluminándose una por una:
  `resolver → validar → autorizar → ejecutar → auditar`.
- Toggle travieso: **"quitarle el permiso al caller"** → la canica se
  detiene en `autorizar`, se pone roja, y sale un letrero con la razón
  exacta: `denegado: falta correo:enviar`. La estación `auditar` se
  ilumina igual — **lo denegado también se registra.**

**El punto que remachas:** "Mismo tubo para el humano y para la IA. Y
cuando algo se niega, te dice POR QUÉ. ¿Cuántos de sus sistemas hacen eso?"

> **Alcance que debes decir en voz alta:** este artifact es un modelo
> conceptual y sus botones simulan callers; no son comandos incluidos hoy en
> el skeleton. Para auditar las ramas implementadas y los huecos de cobertura,
> abre [Radiografía del runtime](../artifacts/#runtime). No presentes
> "todo se audita" como garantía universal.

**DEMO EN VIVO (3 min):** terminal con el esqueleto:
```
$ php bin/coa doctor         ← "el sistema se autodiagnostica"
$ php bin/coa inspect:tools  ← "estas son las acciones registradas"
```
`inspect:tools` solo lista tools después del opt-in `agent:enable`; en una app
stock explica que la superficie agent-ready aún no está habilitada. Prepara la
demo antes de la sesión para no depender de Composer en vivo.
> "Los agentes de IA no necesitan más libertad. Necesitan mejores rieles.
> Un framework que se explica a sí mismo es un riel."

---

## Bloque 4 · Contratos: el theme-swap (min 32–40)

**La demo estrella — no requiere artifact nuevo, es el proof real del design
system:**

> "Les voy a demostrar qué compra un contrato. Esta página está construida
> con el design system de Milpa. Cada componente declara su contrato. Ahora
> miren lo que pasa si respeto el contrato pero cambio TODOS los valores…"

**(Click: brutalist. La página entera se transforma. Click: glass. Pausa
dramática.)**

**INTERACCIÓN — predicción:** antes del click preguntas: "¿Qué creen que se
rompa?" (menú, botones, accesibilidad…). Después revelan que NADA se rompió
— y explicas por qué: estructura y piel separadas por contrato; hasta el
contraste de colores se re-verifica en automático.

> "Esto no es un truco de CSS. Es LA idea de la arquitectura: cuando la
> costura entre dos piezas es un contrato, puedes reemplazar una pieza
> entera sin tocar la otra. Aplica a interfaces, a módulos, a servicios, a
> equipos de trabajo."

---

## Bloque 5 · La IA con frenos (min 40–48)

**Setup:** "Última idea, la más importante de la era que les toca:
¿le darían acceso a producción a una IA?" *(Debate de 60 segundos.)*

### 🎮 ARTIFACT 3 — ["La compuerta"](../artifacts/#compuerta) (verificación humana jugable)

**Qué hay en el artifact:**
- Escenario: "El agente **Bot-severo** quiere ejecutar: `borrar 500
  usuarios inactivos`". Se ve la solicitud llegar a una **compuerta** con
  tres botones para el público (por votación): **APROBAR / RECHAZAR /
  EXONERAR (waive)**.
- Gane lo que gane, a la derecha crece un **registro de auditoría** línea
  por línea: quién pidió, qué se decidió, quién decidió, cuándo — y si fue
  *waive*, queda marcado en ámbar: "compuerta exonerada explícitamente".
- Vuelta 2 (el remate): **el agente intenta aprobarse a sí mismo** → la
  compuerta lo rebota sola: `rechazado por construcción: nadie se aprueba
  a sí mismo`. *(Este es real: el orquestador de Milpa lo rechaza por
  diseño.)*

**El punto:** "Ejecutado por agentes, verificado por humanos, todo
trazable. La confianza en sistemas con IA no se pide — se audita. Y
fíjense: la exoneración también es un dato. Hasta el 'me lo salté' queda
escrito."

---

## Bloque 6 · Cosecha y cierre (min 48–52)

**DEMO FINAL (2 min):**
```
$ composer create-project milpa/skeleton mi-app
$ cd mi-app
$ php -S localhost:8000 -t public
# en otra terminal, dentro de mi-app:
$ php bin/coa doctor
```
> "Una app que corre, sin base de datos, sin configurar nada. Todo lo que
> vimos hoy se puede recorrer desde aquí: el skeleton trae el host mínimo y
> los contratos; tools/MCP se habilitan con `agent:enable`, y workflow u
> orquestación viven en paquetes públicos separados. Es Apache-2.0 y pueden
> leerlo TODO. Porque la lección de mi papá aplica: es suyo — aprendan a
> arreglarlo."

**Los retos para llevar** (proyectas el QR al onboarding):
- 🌱 Reto 1: cosecha el esqueleto y hazlo decir tu nombre.
- 🌱 Reto 2: activa agent-ready, declara tu primera tool e inspecciónala.
- 🌱 Reto 3: rompe el grafo de dependencias a propósito y lee el error.
> "Los tres se pueden hacer con ayuda de un agente de IA — de hecho,
> QUEREMOS que los hagan con un agente. El framework está diseñado para
> eso. Instrucciones en el enlace."

**Cierre (la vuelta a la historia):**
> "Mi papá nunca vio este framework. Pero cada vez que alguien corre
> `php bin/coa`, el nombre de su herramienta sigue sembrando. Eso es lo que
> quiero que se lleven: la arquitectura no es diagramas — es decidir qué
> vas a poder reparar dentro de diez años. Siembren bien. Gracias."

## Q&A (min 52–60)

Preguntas frecuentes y respuestas cortas preparadas:
- *"¿Por qué PHP?"* → Porque el ecosistema donde nació es PHP en producción
  real; los conceptos (contratos, pipeline, gates) son agnósticos al lenguaje.
- *"¿Reemplaza a Laravel/Symfony?"* → No compite en features; compite en
  operabilidad por agentes. De hecho usa componentes de Symfony donde tiene
  sentido — eso también es arquitectura: no reinventar lo resuelto.
- *"¿Puedo contribuir siendo junior?"* → Sí: docs, tests, ejemplos y issues
  bien reportados valen oro. Guía de contribución en el repo.

---

## Apéndice — inventario de artifacts disponibles

| # | Nombre | Enseña | Estado |
|---|---|---|---|
| 1 | [Siembra tu milpa](../artifacts/#siembra) | grafo de deps, orden topológico, ciclos | disponible |
| 2 | [Una acción, dos puertas](../artifacts/#pipeline) | pipeline resolve→…→audit, dualidad humano/agente | disponible |
| 3 | [La compuerta](../artifacts/#compuerta) | verificación tri-estado, auditoría, anti auto-aprobación | disponible |
| 4 | [Atlas de límites](../artifacts/#atlas) | paquetes, responsabilidades y flujos | disponible |
| 5 | [Radiografía del runtime](../artifacts/#runtime) | ramas reales de `ToolRegistry::call()` | disponible |
| 6 | [El proceso es el log](../artifacts/#event-log) | append-only, replay y proyección | disponible |
| 7 | [Contrato ejecutable](../artifacts/#design-contract) | tokens, build, contratos y gates | disponible |
| 8 | [El plan antes del disco](../artifacts/#plan) | `PlannedFile`, `WriteGuard` y verificación | disponible |
| — | Theme-swap | contratos / separación estructura-piel | disponible en `milpa-design/proof/theme-swap.html` |
| — | La M germinando | módulos → identidad | disponible en `milpa.lat` |

La galería consume `@milpa/design@0.9.0` publicado. Los tres primeros artifacts
forman el recorrido principal del webinar; los otros cinco permiten extenderlo
a una sesión de arquitectura para ingeniería. Todos deben conservar teclado,
`prefers-reduced-motion` y contraste AA como piso de calidad.

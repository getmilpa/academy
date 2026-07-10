# El Almácigo — Milpa Academy

> El semillero educativo del ecosistema [Milpa](https://milpa.lat). Un
> **almácigo** es donde las plantas germinan protegidas antes del trasplante
> al campo — aquí germinan developers: documentos en lenguaje llano, guiones
> de webinar y **artifacts interactivos** para aprender arquitectura de
> sistemas jugando, con los contratos de verdad.

Repo hermano del framework y del design system (patrón D13: divergir para
converger). Consume `@milpa/design` **publicado, por versión** (CDN pinned) —
cero build, cero dependencias de runtime.

## Estructura

```
index.html            Tablero de rutas y continuidad de aprendizaje
academy.css/js        Composición y comportamiento de la portada
ARCHITECTURE.md        Mapa de límites, flujos, ownership y extensión privada
curriculum/           Catálogo, 45 preguntas, calificación y progreso validado
learn/                Lector curricular sobre el layout mui-docs
labs/                 4 prácticas con validadores de salida testeables
artifacts/            Galería interactiva: 8 artifacts + lógica testeable
webinars/             Kit operativo de facilitación de 60 minutos
docs/                 5 fuentes educativas y de referencia
assets/               Iconos del kit de marca
```

## Correr local

```bash
npm run dev
# abrir http://localhost:4325
```

La galería carga `artifacts-core.js` y `artifacts.js` como scripts clásicos con
`defer`. También funciona al abrir `artifacts/index.html` con `file://` mientras
el navegador tenga acceso al CDN de `@milpa/design`; el servidor local solo da
URLs y navegación más consistentes.

## Verificar

```bash
npm test        # catálogo, quizzes, progreso, labs, artifacts y contratos
```

## Contenido

| Pieza | Audiencia |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Maintainers y agentes que extienden Academy |
| [`docs/QUE-ES-MILPA.md`](./docs/QUE-ES-MILPA.md) | Todos (y agentes) |
| [`docs/GUION-WEBINAR-JUNIORS.md`](./docs/GUION-WEBINAR-JUNIORS.md) | Quien da el webinar |
| [`docs/ONBOARDING.md`](./docs/ONBOARDING.md) | Devs probando el framework |
| [`docs/CONTRIBUIR.md`](./docs/CONTRIBUIR.md) | Contribuidores |
| [`docs/REFERENCIA-SENIOR.md`](./docs/REFERENCIA-SENIOR.md) | Seniors y creadores de contenido |
| [`learn/`](./learn/) | Devs recorriendo el currículo |
| [`labs/`](./labs/) | Implementadores practicando con el CLI real |
| [`artifacts/`](./artifacts/) | La galería — jugar (3) + inspeccionar (5) |
| [`webinars/`](./webinars/) | Facilitadores y equipos de aprendizaje |

## Principios

1. **Cero humo** — cada afirmación es verificable en un repo público; los
   artifacts distinguen "modelo didáctico" de "implementación auditada".
2. **La metáfora es índice, no adorno.**
3. **Aprender no tiene que ser aburrido.**
4. **Dos audiencias siempre** — humanos que leen y agentes que asisten.
5. **El progreso se demuestra** — una unidad exige evaluación 3/3; no se
   completa por autoafirmación.

## El rol de Academy en el ecosistema (gobernanza)

En el mapa de tres palabras (DESIGN.md §6 de milpa-design): **Design System =
el lenguaje visual · Live = el runtime de render · Academy = la aplicación /
el laboratorio.** Academy consume Patterns + Recipes del paquete publicado y
**produce candidatos**: la aplicación compone con prefijo propio (`ac-*`; la
galería histórica conserva `wb-*`) hasta pasar la regla de entrada del design
system (caso real, ≥2 apariciones,
describible con contrato, pasa gates, consumible sin hacks).

> **Academy puede inventar patrones. Design System decide cuáles sobreviven.**

Precedente: el cluster almácigo de `@milpa/design@0.9.0` (`mui-plot`,
`mui-pipeline`, `mui-gate`, `mui-replay`) nació aquí como `wb-*` — y esta
galería es ahora su battle-test externo.

## Público por defecto, privado por composición

El currículo común, los artifacts y las prácticas para construir con Milpa son
públicos y completos en este repo. El material específico de TeamX no se
disfraza como contenido público ni se incluye oculto detrás de un flag: se
mantiene en un **pack privado separado** y se compone como overlay durante el
deploy interno.

Ese overlay puede añadir rutas, escenarios y enlaces de operación propios de
TeamX, pero no reemplaza ni redefine el currículo público. Así, cualquier dev
puede aprender la arquitectura sin credenciales y un integrante de TeamX puede
sumar contexto interno sin filtrarlo al bundle público.

## Destino público

`academy.milpa.lat` (pendiente de deploy) · fuente: `github.com/getmilpa/academy` (pendiente de push)

## Licencia

[Apache-2.0](./LICENSE) — © 2026 Rodrigo Vicente Gómez / TeamX Agency

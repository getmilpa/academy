# Guía de contribución — cómo se siembra en campo ajeno

> Aplica a los repos públicos de https://github.com/getmilpa. La filosofía
> completa vive en los propios repos; esto es el mapa para no perderte.

## La filosofía en dos reglas

1. **Nada se siembra sin contrato.** Toda contribución — código, pieza de
   UI, hasta un theme — pasa por gates automáticos. No es burocracia: es lo
   que permite que el proyecto acepte aportes de gente (y agentes) que no
   conoce, sin morir en el intento.
2. **Cimentar primero.** El proyecto avanza por capas: lo que está abajo se
   endurece antes de construir lo de arriba. Una idea buena *fuera de fase*
   se agradece, se anota y se espera — no se mete con calzador.

## Qué contribuir (y cuándo)

| Tipo | ¿Cuándo? | Fricción |
|---|---|---|
| **Reporte de bug** (con reproducción) | Siempre | Ninguna — es el aporte más valioso que existe |
| **Docs**: typos, claridad, ejemplos | Siempre | Mínima |
| **Tests** que cubran huecos reales | Siempre | Mínima |
| **Fix de bug** (con test que lo demuestre) | Siempre | Baja — el test es el contrato del fix |
| **Feature nueva** | Solo tras validar la idea (abajo) | Media — puede tocar contratos |
| **Cambio de contrato/interface** | Casi nunca sin discusión previa | Alta — implica semver y a todos los consumidores |

## Cómo validar una idea ANTES de escribir código

El error clásico: llegar con 800 líneas de PR sin preguntar. Así se evita:

1. **Busca primero.** Issues existentes, y los documentos de decisión del
   proyecto (los README explican el *porqué* de cada paquete; las decisiones
   grandes están registradas). Muchas ideas ya fueron consideradas — y saber
   *por qué se descartaron* vale más que proponerlas de nuevo.
2. **Abre un issue con mini-spec** (10 líneas bastan):
   - **Problema:** qué duele hoy, con ejemplo concreto.
   - **Propuesta:** qué cambiarías, *en términos del contrato* (¿qué
     provee?, ¿qué requiere?, ¿qué interface toca?).
   - **Alternativas:** qué más consideraste y por qué no.
   - **Alcance:** qué NO incluye tu propuesta.
3. **Espera señal antes del PR grande.** Un "suena bien, adelante" del
   maintainer te ahorra semanas. Para fixes chicos, el PR directo está bien.

**El test del injerto** (para autoevaluar tu idea): ¿tu propuesta es una
*rama que se injerta* (extiende sin tocar la raíz) o quiere *cambiar la
raíz*? Las ramas casi siempre entran; las raíces requieren mucha más
evidencia. Si tu idea necesita tocar el core, pregúntate si puede vivir
como plugin/paquete aparte primero — así lo hace el propio proyecto.

## Convenciones técnicas (los gates que vas a enfrentar)

### Repos PHP (`milpa/*`)
- `declare(strict_types=1)` en todo archivo. Tipos explícitos siempre.
- **DocBlocks obligatorios en símbolos públicos** — el CI lo bloquea si
  falta (las docs de referencia se generan de ahí; tu DocBlock ES la doc).
- PHPStan al nivel del repo + cs-fixer + PHPUnit: verde o no entra.
- Todo cambio de comportamiento trae su test. Fix sin test = fix a medias.
- Los cambios entran por **PR** (hay repos con release automatizado — no
  se versiona a mano, los tags los maneja el pipeline).
- Commits: convencionales (`feat:`, `fix:`, `chore:`, `docs:`…), en inglés
  en los repos públicos del framework, descripción concreta.

### Design system (`milpa-design`)
- `npm test` es la ley: contraste AA (todos los pares), gobernanza de
  tokens (cero valores crudos: todo custom property), capas `@layer`
  correctas, contratos de componente válidos, y cero drift de `dist/`.
- Toda pieza nueva trae su `*.contract.json` y pares de contraste al gate.
- Los estados se estilizan por atributos (`[disabled]`, `[aria-busy]`) —
  **nunca** por clases de estado.
- `dist/` es generado: se edita `tokens/milpa-tokens.json` y se corre
  `npm run build`. Editar dist a mano rompe CI.

## Contribuir con un agente de IA

Bienvenido — el proyecto está diseñado para eso. Reglas de cortesía:

- **Tú firmas, tú respondes.** El PR es tuyo, lo haya escrito quien lo haya
  escrito. Revísalo línea por línea antes de abrirlo; si el reviewer
  pregunta y no sabes qué hace tu propio código, mal.
- Dale contexto real al agente: los README del paquete que tocas y esta guía.
  Si trabaja dentro de una app creada con `milpa/skeleton`, haz que inspeccione
  el sistema real con `php bin/coa inspect:plugins`, `inspect:routes`,
  `inspect:services` e `inspect:commands` antes de editar.
- Los gates no distinguen autores: DocBlocks, tests y PHPStan aplican igual.

## Qué NO hacer

- PRs que mezclan tres temas (uno por PR, chico y enfocado).
- "Refactoricé todo de paso" — no. El diff mínimo es una virtud aquí.
- Dependencias nuevas sin discusión (y jamás copyleft: el árbol es
  MIT/BSD/Apache y así se queda).
- Romper compatibilidad "porque quedaba mejor" — los contratos versionan
  con semver; romperlos tiene proceso, no impulso.

## El camino feliz, resumido

```
idea → buscar → issue con mini-spec → señal del maintainer
     → fork → rama → código + tests + docblocks → gates verdes
     → PR chico y enfocado → review → cosecha 🌽
```

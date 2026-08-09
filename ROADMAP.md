# ROADMAP — El Dojo de Arquitectura

> **Este archivo APUNTA, no copia.** Los frames que gobiernan este rediseño están congelados en el
> greenhouse (`getmilpa/greenhouse`), fechados y verbatim de Rod. Duplicarlos aquí crearía dos
> verdades y la segunda se desactualizaría — que es exactamente el defecto que esta academia acaba
> de reconocer sobre sí misma.

| lo que gobierna | dónde vive |
|---|---|
| **Qué es el Dojo** y por qué la academia cambia de identidad | `greenhouse .milpa/evidence/0038-el-dojo-de-arquitectura.md` |
| **Qué infraestructura se construye — y cuál NO** | `greenhouse .milpa/evidence/0039-infra-del-dojo.md` |
| **Hasta dónde llega el gobierno del greenhouse** sobre este repo | `greenhouse .milpa/decisions/0015-esta-casa-gobierna-la-frontera-con-academy.md` |
| La ley de derivabilidad de la familia | `greenhouse .milpa/decisions/0020-el-templo-gobierna-la-derivabilidad.md` |

## De dónde sale el rediseño

Rod hizo esta academia para enseñarle arquitectura a un junior de su equipo, y midió el defecto que
la refuta: **un LLM puede pasar sus evaluaciones.** Un examen que un modelo aprueba no evalúa
criterio — evalúa recuperación de patrones.

> La pregunta correcta no es *«¿cómo evalúo si sabe arquitectura?»*, sino: **¿cómo construyo un
> entorno donde memorizar respuestas sea barato, pero sostener una decisión sin criterio sea caro?**

## EL FRENO — lo que NO se construye, y es lo primero que hay que leer

> **No hagas `AcademyUser · LessonAttempt · Score · Badges · Progress · Leaderboard`.**
>
> Un LMS modela **cursos y desempeño**. El Dojo mide **si un criterio sobrevive**. Son ontologías
> distintas, y la del LMS es la que se escribe sola porque hay mil ejemplos.
>
> *Si el primer esquema tiene `Score` y `Badges`, la pedagogía ya se rindió antes del primer alumno.*

**Backend, OAuth, perfiles y progreso longitudinal van DESPUÉS**, y el frame lo dice explícitamente:
todo eso es *«después de que la unidad pedagógica exista»*. Construirlos antes es amueblar una casa
cuyos cimientos todavía no se han probado.

## Lo que sí, y en qué orden

```text
ScenarioVersion · Attempt · DecisionChain · Mutation · Adjudication · Evidence
```

Seis entidades — **y quizá ni todas desde el inicio**. Nada de perfiles, rankings ni cursos todavía.

### El primer slice, absurdamente pequeño

> **¿Puede un alumno presentar una decisión estructurada sobre una lección, recibir una mutación que
> ataque uno de sus supuestos, y producir una revisión donde quede verificablemente identificado qué
> parte de su razonamiento cambió?**

Si eso funciona, ya existe la unidad pedagógica nativa de la Academy. **Si no, no hay LMS que lo
arregle.** Puede correr con **un solo mundo escrito a mano**.

Y el check es determinista —un diff dirigido, sin modelo— con cuatro salidas: `LOCALIZÓ`,
`NO LOCALIZÓ`, `RACIONALIZÓ` y `BARRIÓ`. *La cuarta es la que lo hace honesto: sin ella, la salida
más fácil para un alumno sería reescribir la entrega completa y el instrumento aplaudiría.*

## El alumno no es una fila con progreso

```text
Lesson v1 → el alumno encuentra un shortcut → el shortcut queda como evidencia
          → la lección queda REFUTADA → Lesson v2 → el shortcut entra al corpus de mutación
```

> **Si alguien pasa una lección sin demostrar la propiedad que la lección pretendía evaluar, el
> alumno acaba de refutar el instrumento educativo.**

Por eso la graduación es **por propiedad y no por antigüedad** —`Evidence Discipline`,
`Causal Reasoning`, `Authority Recognition`, `Falsification`, `Generalization`, `Discrimination`,
`Calibration`, `Architectural Restraint`—, cada una con evidencia de **varias** lecciones y jamás de
un examen único. El perfil longitudinal **no gamifica: muestra dónde su criterio todavía se rompe.**

## El vocabulario ya está ganado — no se inventa

El veredicto de máquina reusa el cuarteto que tres dominios independientes de esta familia
encontraron por separado:

| Dojo | el riel de citabilidad | la fundación de una app |
|---|---|---|
| `DETERMINED` | `CITABLE` | `founded` |
| `UNSUPPORTED` | `NO CITABLE` | `unfounded` |
| `UNDERDETERMINED` | `INDETERMINADO` | `indeterminate` |
| `INVALID` | `INVÁLIDO` | `invalid` |

## Estado de este repo, medido el 2026-08-09

De los **14 comandos `coa` que enseña, 12 ya no existen**, y nombra 25 veces un paquete retirado.
Se declaró en el portal y en el README en vez de repararse pieza por pieza, porque el rediseño lo
reemplaza. **La arquitectura que explica sigue siendo válida; los comandos concretos, no.**

## Las cinco cosas que la ley de derivabilidad exige de este repo

| | |
|---|---|
| **qué es** | la academia del ecosistema; decide QUÉ enseña. El greenhouse gobierna su frontera, no su contenido |
| **dónde vive** | `github.com/getmilpa/academy`, rama `main`; el sitio se genera desde las fuentes, `site/` NO se edita |
| **cómo se publica** | GitHub Pages vía `.github/workflows/pages.yml` al empujar a `main` → `academy.milpa.lat` |
| **quién decide** | `greenhouse decisions/0015` (frontera) · `evidence/0038-0039` (el rediseño) |
| **cómo se verifica** | `greenhouse scripts/gates/validate-academy-links.php` y `scripts/gates/verify-site-drift.php` |

Apache-2.0 · (c) Rodrigo Vicente - TeamX Agency

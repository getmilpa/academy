# Arquitectura de Milpa Academy

Academy es una aplicación estática y un laboratorio del ecosistema Milpa. Su
responsabilidad es enseñar, conservar progreso local y poner escenarios sobre
contratos existentes. No redefine el framework ni el lenguaje visual.

## Mapa del sistema

~~~mermaid
flowchart LR
  learner[Developer o agente]
  facilitator[Facilitador]

  subgraph public[Academy pública]
    home[Tablero]
    catalog[Catálogo curricular]
    questions[Banco de 57 preguntas]
    grader[Motor de calificación]
    learn[Lector de unidades]
    labs[Labs + verificadores]
    artifacts[Artifacts de arquitectura]
    webinar[Kit de webinar]
    progress[(Progreso local)]
  end

  design[@milpa/design 0.9.0]
  sources[Repos Milpa y contratos]

  learner --> home
  home --> catalog
  catalog --> learn
  questions --> grader
  grader --> learn
  learn --> labs
  learn --> artifacts
  facilitator --> webinar
  webinar --> artifacts
  progress <--> home
  progress <--> learn
  design --> home
  design --> learn
  design --> labs
  design --> artifacts
  design --> webinar
  sources --> catalog
  sources --> labs
  sources --> artifacts
~~~

Un deploy interno puede componer un pack adicional, pero ese contenido no vive
en este grafo público:

~~~mermaid
flowchart LR
  privateRepo[Repo privado TeamX]
  privateDeploy[Deploy interno]
  register[MilpaCurriculum.registerPack]
  publicCatalog[Catálogo público]
  internalView[Academy interna]

  privateRepo --> privateDeploy
  publicCatalog --> privateDeploy
  privateDeploy --> register
  register --> internalView
~~~

## Límites y ownership

| Límite | Es dueño de | No es dueño de |
|---|---|---|
| **curriculum/** | Rutas, preguntas, calificación, progreso, fuentes y contrato de packs | Render visual |
| **learn/** | Routing curricular, lectura y experiencia de evaluación | Contenido privado |
| **labs/** | Comandos educativos, captura y validación de evidencia | Ejecutar shell |
| **artifacts/** | Escenarios, estado y composición didáctica | Piel de mui-plot, mui-pipeline, mui-gate o mui-replay |
| **webinars/** | Agenda, roles, notas, cronómetro y secuencia | Copias de los artifacts |
| **@milpa/design** | Tokens, anatomía, estados visuales, a11y y motion | Datos, routing o lógica Academy |
| **pack privado** | Procesos y contexto TeamX | Reemplazar el currículo público |

## Flujo de una unidad

1. **catalog.js** declara objetivos, explicación, artifact, práctica,
   criterios, fuentes y fecha.
2. **learn.js** resuelve el hash y renderiza la unidad sobre **mui-docs**.
3. El developer abre el artifact o corre los comandos en su checkout.
4. Labs valida texto pegado mediante funciones puras; nunca ejecuta comandos.
5. **quiz-engine.js** califica tres escenarios contra el banco de la unidad.
6. **progress.js** registra intentos y solo marca la unidad cuando la
   evaluación alcanza 3/3.
7. Portada y lector derivan sus contadores desde ese estado validado.

## Decisiones que no deben diluirse

1. **Cero build de runtime.** Academy runtime is static and dependency-light. Authoring may generate static
   artifacts (p.ej. el SSG-lite de contenido). Generated output must be inspectable, deterministic and
   file://-friendly where applicable. Los scripts del sitio son clásicos.
2. **Paquete publicado, no checkout hermano.** Las cinco superficies cargan los
   seis bundles de @milpa/design 0.9.0 en orden contractual.
3. **Academy compone, Design define.** Las clases locales usan prefijo ac-; la
   galería conserva wb- para sus composiciones históricas.
4. **Público completo.** El producto público no es una versión degradada que
   dependa de credenciales TeamX.
5. **Privado separado.** Un pack interno se incorpora durante un deploy
   privado; esconder datos en HTML, JavaScript o CSS público viola el límite.
6. **Evidencia antes que insignias.** Una unidad requiere evaluación aprobada y
   una práctica requiere señales de salida real. Declarar “ya sé” o coincidir
   con success no demuestra aprendizaje ni boot correcto.

## Cambiar el sistema

| Cambio | Archivo principal | Gate mínimo |
|---|---|---|
| Añadir una ruta o unidad | curriculum/catalog.js + quizzes-*.js | Esquema, IDs, grafo, enlaces y evaluación 3/3 |
| Añadir un lab | labs/catalog.js + lab-verifier.js | Caso válido y negativos específicos |
| Añadir un artifact | artifacts/index.html + artifacts-core.js | Lógica pura, fuente y diferencia modelo/implementación |
| Cambiar navegación | HTML de cada superficie | Enlaces, hashes, teclado y móvil |
| Promover un patrón visual | Repo milpa-design | Dos usos, contrato, AA y paquete publicado |
| Añadir TeamX | Repo privado y deploy interno | visibility internal, sin datos en este repo |

## Verificación

La suite ejecutada por **npm test** cubre:

- lógica de los ocho artifacts;
- esquema curricular, unicidad y grafo de prerrequisitos;
- 57 preguntas, cobertura total y calificación positiva/negativa;
- persistencia de intentos y progreso derivado de evaluaciones;
- validadores positivos y negativos de los cuatro labs;
- existencia de enlaces, hashes, IDs y orden de bundles.

La revisión de release también abre portada, lector, labs, artifacts y webinar
en 1440×1000 y 390×844, confirma cero overflow global, imágenes cargadas,
ausencia de excepciones y los flujos de evaluación incompleta, reprobada y
aprobada.

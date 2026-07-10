# Contrato curricular

**catalog.js** es la fuente estructurada que consumen la portada y el lector.
**quiz-bank.js** registra las evaluaciones y **quiz-engine.js** las califica.
Los motores usan JavaScript clásico para funcionar sin build y exponen la misma
API en navegador y Node.

## Unidad pública

Cada ruta declara id, title, level, audience, durationMinutes, summary,
prerequisites y units. Cada unidad completa el ciclo:

1. **understand**: explicación breve.
2. **see**: artifact que hace visible el concepto.
3. **do**: práctica o fuente, con comandos cuando aplica.
4. **verify**: criterios que debe cubrir la evaluación.
5. **sources** y **lastVerified**: procedencia y vigencia.

No se acepta una unidad que solo enlace contenido. La explicación, la práctica
y el criterio de éxito deben seguir siendo útiles aunque el progreso local esté
vacío.

## Evaluación

Cada unidad pública tiene un cuestionario registrado por su clave
trackId/unitId. La rúbrica actual exige:

1. Tres preguntas de opción única por unidad.
2. Escenarios o decisiones, no confirmaciones de “sí entendí”.
3. Al menos dos distractores plausibles y una respuesta inequívoca.
4. Explicación pedagógica después de calificar.
5. Tres respuestas correctas de tres para aprobar.

**progress.js** versión 2 deriva el estado completado únicamente de una
evaluación aprobada. El progreso v1 basado en autoevaluación no se migra.

## Pack interno

El repo público no contiene rutas, URLs, procesos ni credenciales de TeamX.
Un deploy interno puede cargar su catálogo después de
**curriculum/catalog.js**. El lector también carga un pack privado de
evaluaciones después de **quiz-bank.js**:

    <script src="/curriculum/catalog.js"></script>
    <script src="/private/teamx-catalog-pack.js"></script>
    <script src="/curriculum/quiz-bank.js"></script>
    <script src="/private/teamx-quiz-pack.js"></script>
    <script src="/academy.js"></script>

El script privado registra su contenido con la API pública:

    window.MilpaCurriculum.registerPack({
      id: "teamx-private",
      tracks: [
        {
          id: "teamx-onboarding",
          visibility: "internal",
          title: "Onboarding TeamX",
          // Mismo contrato de ruta y unidades del catálogo público.
          units: [/* contenido mantenido en el repo privado */]
        }
      ]
    });

**registerPack** rechaza rutas sin visibility internal, IDs duplicados y rutas
vacías. Esto es una frontera de composición, no un mecanismo de seguridad: el
pack y su deploy deben permanecer en infraestructura privada.

El pack privado de preguntas usa **MilpaQuizBank.register** con las mismas
claves trackId/unitId. Una ruta sin evaluación se puede leer, pero el lector no
permite completarla.

# Lesson candidates

Lecciones cosechadas de sesiones de construcción reales (disciplina del Almácigo: enseñar mientras se construye, capturar la lección fresca). Cada entrada cita la fuente shippeada y el error real que la motivó. Candidatas a artifact de galería y/o unidad de curriculum en el próximo content pass.

## El mapa en la frontera y su clase de fuga (Fase 3, 2026-07-11)

**Concepto:** cuando la lógica pura emite prosa en vez de códigos, localizarla obliga a elegir entre dos arquitecturas: (a) **refactorizar el núcleo a códigos neutros** (lo que hizo `projectOperation` en R1 — el componente presenta, el núcleo decide) o (b) **mapear en la frontera** (el consumidor traduce cada salida del núcleo con mapas código→idioma). La opción (b) preserva la API pero introduce una **clase de fuga**: es hermética solo si CADA punto de consumo pasa por el mapa — un solo punto olvidado renderiza el idioma equivocado.

**El error real (aprendible):** al bilingüizar la galería, `applyGateDecision` localizó el resultado visible (`#gate-result`) pero el push al audit trail siguió usando la prosa cruda del núcleo (`verdict.reason`) — en `/en/`, el flujo de self-approval mostraba una oración completa en español dentro del registro de auditoría. El review lo cazó porque enumeró **todas** las salidas posibles de las 4 funciones y persiguió cada punto de consumo; el smoke de browser no lo había visto porque miró el resultado y no el registro.

**La lección que enseña:** una frontera es un contrato de cobertura total, no de mayoría. Las defensas reales: (1) preferir códigos neutros en el núcleo cuando se puede (la fuga se vuelve imposible por construcción); (2) si se mapea en la frontera, un test que acople los enums del núcleo a las claves del mapa (un estado nuevo sin traducción debe fallar en CI, no fugarse en producción); (3) verificar la superficie completa, no solo el happy path visible.

**Fuente shippeada:** `artifacts/artifacts.js` (mapas `PROJECTION_*_EN`, `AUDITED_FAILURES`, el fix del audit trail), `artifacts/artifacts-core.js` (núcleo neutro), commit `058fdf9`. Precedente del patrón (a): el refactor de `projectOperation` a códigos (R1, Task 4.5).

**Conexión con el curriculum existente:** la compuerta (artifact 03) ya enseña decisiones por construcción; esta lección es su gemela de i18n — misma idea (lo que el sistema garantiza por construcción vs lo que promete por disciplina) aplicada a idiomas. Encaja con "Learnable Errors": el fallo apunta al concepto que violó.

**Estado:** **Graduada** al Almácigo — artifact de galería `#frontera` ("El mapa en la frontera", artifact 10 de 10), construido en la rama `academy/almacigo-frontera`: T1 lógica pura TDD (`frontierProject`/`coupleCheck`, commit `4999989`) · T2 esqueleto SSG + demo interactivo + GA4 `frontier_leak_found` (`744ae33`, con el fix del conteo del portal en `5069e10`). El candidato anotado se realizó tal cual: un toggle es/en sobre una frontera de ocho salidas donde el lector elige la salida sin mapear (`detenido`), ve el literal en español fugarse a la vista en inglés y lo cierra; el test de acople `coupleCheck` es la red que rompe CI. Verificación de release 2-viewport (es/en × 1440/390) limpia — 0 errores de consola, 0 overflow, y la ironía cero comprobada: la lección sobre fugas no fuga (todo el chrome del demo en inglés en `/en/`, solo los códigos crudos del núcleo quedan en español a propósito). Unidad de curriculum con quiz: DIFERIDA (el artifact primero; GA4 dirá si hay tracción).

## Graduar código de lab a paquete público cuesta lo que los gates que el lab nunca corrió (P6, 2026-07-26)

**Concepto:** un lab acumula código que *funciona* —se usa todos los días— sin haber pasado nunca por los gates que un paquete publicado sí debe pasar. El día que ese código se gradúa, la factura llega junta: no son fallas nuevas, son fallas **viejas y ya vividas** que nadie había podido ver porque no había quién las mirara. El costo de graduar no es empaquetar; es correr por primera vez lo que nunca corrió.

**El error real (aprendible):** el tier TUI del lab `milpa-components` llevaba 78 archivos y ~7,940 líneas en uso. La primera corrida de PHPStan nivel 6 sobre él, ya como `milpa/live-tui`, sacó dos bugs reales:

1. `ProgressBarRenderer` leía `$props['value'] ?? 0`, que convierte un `value => null` **explícito** en 0 — y `null` era, según su propio docblock, la forma documentada de pedir el modo indeterminado. El renderer rompía el contrato que él mismo publicaba. El arreglo es `array_key_exists`, porque lo que importa es la **presencia de la clave, no su nulidad**: `??` contesta una pregunta distinta de la que se le estaba haciendo.
2. `StreamTerminal` instalaba un handler de `SIGWINCH` que **sobrevivía a la terminal que lo puso**, porque la bandera que lo rastreaba se escribía y nunca se leía. PHPStan lo marcó como `property.onlyWritten`, que casi nunca es ruido: suele ser una feature a medio hacer.

Corolario del mismo barrido: `RetainedTuiLoop` aceptaba y **documentaba** un `$showHardwareCursor` que nada leía. Un flag público documentado que no hace nada es peor que no tenerlo — se retira, no se finge.

**La lección que enseña:** «funciona» y «está verificado» son afirmaciones distintas, y la distancia entre las dos se paga completa el día de la publicación. Las defensas: (1) correr los gates del destino ANTES de mudarse, no después —el lab puede correr PHPStan aunque no publique—; (2) tratar `property.onlyWritten` y los flags sin lector como hallazgos de diseño, no como avisos cosméticos; (3) desconfiar de `??` en cualquier lugar donde `null` sea un valor con significado propio.

**Fuente shippeada:** `milpa/live-tui` v0.1.0→v0.2.3 (`getmilpa/live-tui`), ADR-0024 (un tier que se sostiene solo no le cobra a sus vecinos), ADR-0026 (una superficie debe ser total sobre su entrada — el corolario de `??` sale de acá).

**Conexión con el curriculum existente:** es la gemela de «El mapa en la frontera»: allá una frontera era un contrato de cobertura total y una salida sin mapear se fugaba; acá un contrato publicado se rompe a sí mismo porque el operador elegido contesta otra pregunta. Las dos son «lo que el sistema garantiza por construcción vs lo que promete por disciplina». Encaja con Learnable Errors.

**Estado:** **Candidata.** Propuesta de artifact: un `?? 0` sobre una barra de progreso donde el lector pone `value => null` —la forma documentada de pedir indeterminado— y ve el 0 aparecer; cambia a `array_key_exists` y el indeterminado vuelve. La red que rompe CI es el test que distingue ausencia de nulidad.

## Preguntar por qué una línea no se puede cubrir encuentra más que escribirla (barrido de cobertura de la familia, 2026-07-27)

**Concepto:** la cobertura tratada como **número** es una meta que se alcanza escribiendo tests. Tratada como **pregunta** —¿por qué *esta* línea no se puede cubrir?— es un instrumento de diagnóstico: hay líneas que no se cubren porque nadie escribió el test, y hay líneas que no se cubren porque **no se puede llegar a ellas**. Las segundas no son deuda de tests: son bugs, código muerto o gates apagados, y sólo se distinguen preguntando.

**El error real (aprendible):** llevar los 26 paquetes de la familia a ≥90% sacó 13 defectos en código ya publicado. Los tres más caros no los encontró un test nuevo, los encontró la pregunta:

1. **`Grapheme` nunca usó ICU.** En un archivo con namespace y sin `use`, `IntlBreakIterator::class` resuelve a `Milpa\Live\Tui\IntlBreakIterator`, que no existe — así que los dos `class_exists(..., false)` daban `false` **siempre**. La segmentación por ICU jamás corrió: un emoji unido por ZWJ se partía en cinco pedazos y toda cuenta de columnas río abajo salía mal. El docblock del archivo decía desde el primer día que se apoyaba en ICU. Las líneas «sin cubrir» eran inalcanzables, no olvidadas.
2. **Cuatro clases publicadas que nadie referenciaba.** `Milpa\Runtime\Events\*` no lo usaba ni su propio kernel —que emite las de `Milpa\Events`— y `Milpa\Runtime\Http\Router` era copia idéntica de `Milpa\Http\Routing\Router`, usada sólo por su propio test. La cobertura que ese test daba era cobertura de código muerto.
3. **22 de 93 tests se saltaban en cada corrida de CI.** `MysqlRepository` —el repositorio que `milpa/data` existe para publicar— necesita un servidor, y sin él los tests reportaban OK sin verificar nada. Agregar un servicio `mysql:8.0` al workflow subió la cobertura de 69.8% a 86.5% **sin escribir un solo test**: no era un hueco, era medición sobre una suite a medio correr.

Y el cuarto, que sólo apareció al **construir encima** del paquete: los dos loops de `live-tui` traían su propio `match` de teclas —once secuencias contra las 41 que el paquete ya publica en `KeyMatcher`— y ya había derivado: conocían ↑ y ↓ pero no ← ni →. Tab navegaba, la flecha no producía un solo byte.

**La lección que enseña:** un número de cobertura no defiende nada por sí solo; lo que defiende es el hábito de preguntar por cada línea que falta. Las defensas: (1) ante una línea inalcanzable, arreglar el código, no inventar el test que la alcance; (2) un test que se salta es un test que no existe — un skip silencioso miente igual que un assert que no corre; (3) el ratchet, no la meta: el piso es el número de hoy y sólo puede subir, porque un número que nadie lee es un número que nadie defiende; (4) construir algo real encima es el gate que ningún analizador reemplaza.

**Fuente shippeada:** los 26 paquetes de `getmilpa/*` con piso de cobertura en CI (`tools/coverage-floor.php` en cada uno). Defectos citados: `getmilpa-live-tui@dfb636a` (ICU) y `@cf02a72` (KeyMatcher), `getmilpa-runtime@fc28c97` (duplicados muertos), `getmilpa-data@360fc81` (los 22 tests que se saltaban), `getmilpa-tool-runtime@91c6bf9` (el prefijo más largo), `getmilpa-workflow@c650d80` (TypeError en API pública), `getmilpa-skeleton@4b786fd` (el CLI que salía 0 con un typo).

**Conexión con el curriculum existente:** es la contraparte medible de la lección de arriba. Aquella dice que graduar cuesta los gates que no se corrieron; ésta dice **cómo se leen** esos gates cuando por fin corren. Juntas forman el arco: correrlos, y después preguntarles.

**Estado:** **Candidata.** Propuesta de artifact: un panel de cobertura con tres líneas rojas idénticas donde el lector tiene que clasificarlas —falta un test / es inalcanzable / el test se saltó— y sólo una de las tres se arregla escribiendo un test. La trampa del demo es que las tres se ven exactamente igual en el reporte.

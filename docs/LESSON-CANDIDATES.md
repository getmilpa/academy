# Lesson candidates

Lecciones cosechadas de sesiones de construcción reales (disciplina del Almácigo: enseñar mientras se construye, capturar la lección fresca). Cada entrada cita la fuente shippeada y el error real que la motivó. Candidatas a artifact de galería y/o unidad de curriculum en el próximo content pass.

## El mapa en la frontera y su clase de fuga (Fase 3, 2026-07-11)

**Concepto:** cuando la lógica pura emite prosa en vez de códigos, localizarla obliga a elegir entre dos arquitecturas: (a) **refactorizar el núcleo a códigos neutros** (lo que hizo `projectOperation` en R1 — el componente presenta, el núcleo decide) o (b) **mapear en la frontera** (el consumidor traduce cada salida del núcleo con mapas código→idioma). La opción (b) preserva la API pero introduce una **clase de fuga**: es hermética solo si CADA punto de consumo pasa por el mapa — un solo punto olvidado renderiza el idioma equivocado.

**El error real (aprendible):** al bilingüizar la galería, `applyGateDecision` localizó el resultado visible (`#gate-result`) pero el push al audit trail siguió usando la prosa cruda del núcleo (`verdict.reason`) — en `/en/`, el flujo de self-approval mostraba una oración completa en español dentro del registro de auditoría. El review lo cazó porque enumeró **todas** las salidas posibles de las 4 funciones y persiguió cada punto de consumo; el smoke de browser no lo había visto porque miró el resultado y no el registro.

**La lección que enseña:** una frontera es un contrato de cobertura total, no de mayoría. Las defensas reales: (1) preferir códigos neutros en el núcleo cuando se puede (la fuga se vuelve imposible por construcción); (2) si se mapea en la frontera, un test que acople los enums del núcleo a las claves del mapa (un estado nuevo sin traducción debe fallar en CI, no fugarse en producción); (3) verificar la superficie completa, no solo el happy path visible.

**Fuente shippeada:** `artifacts/artifacts.js` (mapas `PROJECTION_*_EN`, `AUDITED_FAILURES`, el fix del audit trail), `artifacts/artifacts-core.js` (núcleo neutro), commit `058fdf9`. Precedente del patrón (a): el refactor de `projectOperation` a códigos (R1, Task 4.5).

**Conexión con el curriculum existente:** la compuerta (artifact 03) ya enseña decisiones por construcción; esta lección es su gemela de i18n — misma idea (lo que el sistema garantiza por construcción vs lo que promete por disciplina) aplicada a idiomas. Encaja con "Learnable Errors": el fallo apunta al concepto que violó.

**Estado:** anotada; pendiente de content pass (artifact interactivo candidato: un toggle es/en sobre una frontera con N salidas donde el lector descubre el punto sin mapear).

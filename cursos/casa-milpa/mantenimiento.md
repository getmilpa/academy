**Español** · [English](en/mantenimiento.md)

# Evidencia y mantenimiento del curso

Este archivo permite revisar qué se comprobó, qué quedó fuera y cómo repetir la comprobación cuando cambien Milpa o los ejemplos. La ejecución del autor demuestra una ruta técnica reproducible; la evaluación de comprensión de un alumno nuevo requiere además la prueba de transferencia de la unidad 11.

## Pregunta que ordenó la construcción

**Antes:** la primera intención era escribir el temario y después producir ejercicios.

**Pregunta arquitectónica:** ¿puede un ingeniero recién llegado fundar una casa y ejecutar su primera operación de dominio siguiendo la documentación?

**Afirmación excesiva:** un curso redactado prueba por sí mismo comprensión humana, operación en producción y dominio de toda la familia de paquetes.

**Slice refutable:** una instalación nueva, fundación real, adopción de persistencia, plugin de dominio y transición con rechazo verificable. Si la ruta exige argumentos desconocidos o no puede arrancar, la hipótesis técnica falla antes de ampliar el temario.

**Evidencia observable:** estado de fundación, archivos y acta, plugin registrado, pruebas de invariantes, persistencia entre procesos y negativas de acceso.

**Fuera del slice:** publicación, llamadas de modelos, concurrencia, todas las integraciones externas y una evaluación con participantes nuevos.

**Después:** el primer movimiento cambió a recorrer una instalación nueva. Ese recorrido permitió corregir la documentación alrededor de firmas, registro, efectos y exposición antes de presentar el curso completo. La evaluación con un alumno nuevo queda como siguiente medición de adopción.

## Entorno comprobado

Comprobación realizada el 4 de octubre de 2026, hora de Ciudad de México. El acta del laboratorio quedó fechada en UTC el 5 de octubre; ambas fechas corresponden a la misma ejecución.

| Componente | Versión |
| --- | --- |
| PHP | 8.3.35 |
| Composer | 2.10.3 |
| GnuPG | 2.4.9 |
| Template `milpa/framework` | 0.55.1 |
| `milpa/app-runtime` | 0.207.2 |
| `milpa/command` | 0.28.0 |
| `milpa/console` | 0.24.0 |
| `milpa/data` | 0.3.2 |
| `milpa/devtools` | 0.41.1 |
| `milpa/auth` | 0.11.0 |
| `milpa/mcp-server` | 0.7.0 |
| PHPUnit | 11.5.56 |
| PHPStan | 2.2.17 |

Los paquetes del laboratorio fueron distribuciones de Composer, sin symlinks a repositorios hermanos. La firma de laboratorio utilizó un llavero temporal propio, sin modificar claves del usuario. Los tokens de HTTP se revocaron al finalizar; la evidencia conserva resultados, no secretos.

## Resultados observados

| Recorrido | Resultado |
| --- | --- |
| `composer create-project` | Instalación y stamp de procedencia completados |
| `house:start` y `foundation` iniciales | Casa que arranca y fundación ausente |
| Previsualización de fundación | Nombra constitución y acta sin fundar |
| Fundación firmada | `founded=true`, constitución y acta escritas |
| `capabilities:enable milpa/data` | Persistencia instalada sin un proveedor adicional |
| Generador CRUD opcional | Cinco archivos generados y verificación de forma; registro separado |
| Registro de plugin con metadata incompleta | Rechazo sin escribir la declaración; arreglo validado después |
| Registro del plugin final `Prestamos` | Casa arranca y aporta cuatro operaciones |
| Pruebas del servicio | Tres pruebas y 15 assertions pasan |
| Análisis estático del plugin y las pruebas | Sin errores al nivel 6 de la casa |
| Alta no firmada | Rechazada; colección sin la herramienta propuesta |
| Alta préstamo y devolución firmados | Estado esperado en ejecuciones distintas |
| Segundo préstamo | `ya_prestada`, código CLI 1, estado conserva el préstamo |
| HTTP sin identidad | 401 |
| HTTP con scope ajeno | 403 |
| HTTP con `herramientas:read` | 200 y colección del dominio |
| Pantalla `shell` sin TTY | Muestra el catálogo y termina |
| MCP initialize y tools/list | Handshake y cuatro herramientas del dominio |
| MCP tools/call de lectura | Devuelve la misma colección de la casa |
| MCP escritura sin autoridad presentada | `isError=true`; lectura posterior conserva el estado |

MCP respondió con versión de protocolo `2025-06-18`; el cliente de comprobación envió la inicialización y conservó el pipe abierto para cada respuesta. Una prueba anterior que cerraba inmediatamente STDIN produjo salida de proceso sin respuestas, por lo que no se contó como handshake exitoso.

La ruta de fundación inicial del laboratorio usó un objetivo de consultar disponibilidad y dos fronteras. La edición del curso hace explícita además la frontera secuencial y extiende el objetivo a operar disponibilidad. Esos son valores de entrada, no cambios de esquema. Una segunda casa nueva repitió el comando editorial completo: la previsualización dejó la casa sin fundar y la llamada firmada escribió los valores de esta edición. En ella se repitieron copia, registro, tres pruebas, análisis estático y la secuencia de alta, negativa sin firma, préstamo, rechazo duplicado y devolución.

Esa repetición corrigió dos instrucciones antes del cierre: `plugins:register` no declara `dry_run`, y el catálogo de `milpa/devtools` instalado no ofrece `update`. El curso consulta el contrato de registro y usa `composer update --dry-run` para previsualizar dependencias. También conserva el nombre exacto de cada operación en vez de asumir que todos los proveedores usan puntos internos.

La suite completa del template con las capacidades de laboratorio ejecutó 195 tests y 653 assertions, sin failures ni errors, con 43 skips por ramas opcionales o condiciones no aplicables y un PHP warning. El warning proviene de `ApplicationTest::testWhenTheGraphDoesNotCloseTheDoctorPrintsTheLearnableError`, que provoca un arranque con `config/boot.php` ausente; se registró como condición del test existente, no como una ejecución completamente libre de warnings. Los tres tests propios del ejemplo no tuvieron warnings ni skips.

## Protocolo para una nueva edición

1. Crea una casa en un directorio nuevo desde la versión del template que vas a documentar. Conserva el lock y las versiones.
2. Sigue las unidades 01 y 02 exactamente, con un llavero apropiado para ese laboratorio y los valores de fundación escritos en el curso. Comprueba ausencia de escritura en la previsualización.
3. Adopta `milpa/data`, copia los archivos de ejemplo y ejecuta sus pruebas. Registra el plugin por el camino gobernado.
4. Ejecuta alta, préstamo, rechazo duplicado y devolución, leyendo desde otro proceso. Comprueba el rechazo no firmado antes de la alta firmada.
5. Ejecuta análisis estático y el estándar de código de la familia sobre los archivos del ejemplo.
6. Adopta auth, expón sólo la lectura y ejecuta la matriz HTTP 401 403 200. Revoca las credenciales de prueba.
7. Si verificas MCP, conserva el pipe y comprueba respuestas, no sólo salida de proceso. Prueba lectura y negativa de escritura.
8. Revisa todos los enlaces locales y los comandos contra los contratos instalados. Mantén los ejemplos fuera de los plugins de arranque del template.
9. Registra fallos, cambios de argumento y diferencias de versión. Reescribe la enseñanza que dependa de ellos.
10. Da la ruta a una persona que no conozca Milpa y registra dónde pide ayuda; ajusta el curso con esa evidencia.

## Cobertura que sigue abierta

La edición no demuestra ejecución de proveedores de modelos, promoción de un sandbox con agente, ceremonia de passkeys, compilación del motor de gobernanza, migración entre backends, restauración en producción ni concurrencia de préstamos. Las unidades correspondientes explican contratos y decisiones y señalan cuándo obtener evidencia adicional.

El código de dominio es un ejercicio limitado. No adoptes una garantía de concurrencia o de auditoría porque haya pasado una prueba secuencial. Para expandir el curso elige una pregunta abierta y su prueba refutable antes de añadir otro catálogo de capacidades.

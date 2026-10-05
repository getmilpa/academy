# Ejemplo de una casa de préstamos

Este código se copia a una casa creada por el alumno. No forma parte de los plugins que el template activa. Sigue primero las unidades [02](../../02-fundar.md), [04](../../04-capacidades-y-plugins.md) y [06](../../06-primer-dominio.md).

Requiere `milpa/data`. El caso está limitado a un operador y llamadas secuenciales: `find` seguido de `save` no es una transición atómica para concurrencia.

| Archivo | Responsabilidad |
| --- | --- |
| [Herramienta](src/Plugins/Prestamos/Entities/Herramienta.php) | Entidad inmutable que puede persistirse |
| [PrestamosService](src/Plugins/Prestamos/Domain/PrestamosService.php) | Alta y transiciones con rechazos explícitos |
| [Prestamos](src/Plugins/Prestamos/Prestamos.php) | Ciclo de vida, operaciones y configuración del repositorio |
| [Pruebas](tests/PrestamosServiceTest.php) | Reglas secuenciales y persistencia entre instancias |

Las escrituras se limitan a CLI, TUI y MCP. La lectura puede exponerse por HTTP con `herramientas:read` y la política conectada. Ninguna operación implementa pagos, personas, eliminación o notificaciones.

La colección predeterminada es `var/herramientas.json`; la configuración opcional es `prestamos.storage`. Las pruebas crean sus propios repositorios y no escriben en la colección de tu casa.

Desde la casa, después de copiar y registrar:

```bash
vendor/bin/phpunit tests/PrestamosServiceTest.php
php bin/coa herramientas:agregar --nombre='Coa' --sign --json
php bin/coa herramientas:listar --json
```

Continúa con los comandos de la unidad 06 usando el id que recibiste. En una segunda ejecución del alta tendrás otra herramienta: el ejemplo no promete deduplicación por nombre ni idempotencia del alta.

Apache-2.0 · © Rodrigo Vicente — TeamX Agency.

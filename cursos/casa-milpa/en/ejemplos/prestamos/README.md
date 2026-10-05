[Español](../../../ejemplos/prestamos/README.md) · **English**

# Example of a lending house

This code is copied into a house created by the student. It is not part of the plugins the template activates. Follow units [02](../../02-fundar.md), [04](../../04-capacidades-y-plugins.md) and [06](../../06-primer-dominio.md) first.

It requires `milpa/data`. The case is limited to one operator and sequential calls: `find` followed by `save` is not an atomic transition for concurrency.

| File | Responsibility |
| --- | --- |
| [Herramienta](../../../ejemplos/prestamos/src/Plugins/Prestamos/Entities/Herramienta.php) | Immutable entity that can be persisted |
| [PrestamosService](../../../ejemplos/prestamos/src/Plugins/Prestamos/Domain/PrestamosService.php) | Addition and transitions with explicit rejections |
| [Prestamos](../../../ejemplos/prestamos/src/Plugins/Prestamos/Prestamos.php) | Lifecycle, operations and configuration of the repository |
| [Tests](../../../ejemplos/prestamos/tests/PrestamosServiceTest.php) | Sequential rules and persistence between instances |

Writes are limited to CLI, TUI and MCP. The read can be exposed over HTTP with `herramientas:read` and the policy connected. No operation implements payments, people, deletion or notifications.

The default collection is `var/herramientas.json`; the optional configuration is `prestamos.storage`. The tests create their own repositories and do not write to your house's collection.

From the house, after copying and registering:

```bash
vendor/bin/phpunit tests/PrestamosServiceTest.php
php bin/coa herramientas:agregar --nombre='Coa' --sign --json
php bin/coa herramientas:listar --json
```

Continue with the commands of unit 06 using the id you received. On a second run of the addition you will have another tool: the example does not promise deduplication by name or idempotence of the addition.

Apache-2.0 · © Rodrigo Vicente — TeamX Agency.

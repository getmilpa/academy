**Español** · [English](en/referencias.md)

# Glosario y referencias del curso

## Vocabulario

| Término | Significado en este recorrido |
| --- | --- |
| Casa | Aplicación concreta que creas con Milpa y fundas para un dominio |
| Dominio | Problema, vocabulario y reglas que la casa atiende |
| Fundación | Constitución explícita que declara dominio, objetivo, fronteras y autoridades |
| Acta | Registro de la decisión de fundación |
| Capacidad | Comportamiento o infraestructura que la casa puede adoptar |
| Paquete | Código distribuido por Composer; puede aportar contratos, proveedores o plugins |
| Plugin | Componente con ciclo de vida que la casa declara y activa |
| Proveedor | Implementación de `CommandProvider` que devuelve operaciones |
| Operación | Unidad declarada de capacidad con handler, entrada y contratos adicionales |
| Handler | Callable que recibe la entrada y produce el resultado de una operación |
| Superficie | Forma de presentar e invocar capacidades, como CLI, TUI, MCP o HTTP |
| Perfil de efectos | Techo declarado de mutación, externalidad, reversibilidad, autoridad y sujeto |
| Subject | De qué está hecho el cambio: datos, configuración o ejecutables, entre otros niveles |
| Scope | Alcance que una política usa para juzgar una identidad |
| Intención | Relación entre lo pedido por el humano y una llamada concreta |
| Consentimiento | Autorización concreta que satisface una demanda bajo su prueba y alcance |
| Gate | Mecanismo del sustrato que retiene un paso hasta que cumpla condiciones |
| Sesión | Trabajo del agente cuyo estado se conserva a partir de hechos registrados |
| Trial workspace | Espacio de trabajo de prueba cuyos cambios todavía no se adoptaron en la casa |
| ADR | Registro de una decisión arquitectónica y sus razones y consecuencias |
| Evidencia | Resultado observable que respalda una afirmación y permite revisar sus límites |
| Slice | Recorrido pequeño que puede refutar una hipótesis concreta |
| Puerto | Contrato que separa al dominio de una implementación de persistencia o integración |

## Fuentes y responsabilidades

El curso se elaboró leyendo la documentación y el código de los repositorios locales de Milpa y comprobando la ruta principal con paquetes publicados. Los enlaces siguientes identifican sus fuentes públicas; sus ramas pueden evolucionar después de la edición comprobada.

| Tema | Fuente |
| --- | --- |
| Punto de partida y límites de extensión | [README de framework](https://github.com/getmilpa/framework/blob/main/README.md) |
| Versiones y cambios del template | [CHANGELOG de framework](https://github.com/getmilpa/framework/blob/main/CHANGELOG.md) |
| Aportar documentación y preservar el arranque | [CONTRIBUTING](https://github.com/getmilpa/framework/blob/main/CONTRIBUTING.md) |
| Relato de origen y filosofía de diseño | [Constitución del sistema de diseño](https://github.com/getmilpa/milpa-design/blob/main/DESIGN.md) |
| Contratos comunes | [milpa/core](https://github.com/getmilpa/core/blob/main/README.md) |
| Operación y perfil de efectos | [milpa/command](https://github.com/getmilpa/command/blob/main/README.md) |
| Proyecciones y consentimiento | [milpa/console](https://github.com/getmilpa/console/blob/main/README.md) |
| Kernel y configuración | [milpa/runtime](https://github.com/getmilpa/runtime/blob/main/README.md) |
| Activación y ciclo de vida | [milpa/plugin](https://github.com/getmilpa/plugin/blob/main/README.md) |
| Capacidades de la casa y sesiones | [milpa/app-runtime](https://github.com/getmilpa/app-runtime/blob/main/README.md) |
| Entidades y repositorios | [milpa/data](https://github.com/getmilpa/data/blob/main/README.md) |
| Identidad y políticas HTTP | [milpa/auth](https://github.com/getmilpa/auth/blob/main/README.md) |
| Transporte MCP | [milpa/mcp-server](https://github.com/getmilpa/mcp-server/blob/main/README.md) |
| Gobierno del agente | [milpa/agent](https://github.com/getmilpa/agent/blob/main/README.md) |
| Comunicación con modelos | [milpa/ai-gateway](https://github.com/getmilpa/ai-gateway/blob/main/README.md) |
| Motor de gobernanza | [milpa/governance](https://github.com/getmilpa/governance/blob/main/README.md) |

## Leer la implementación desde una casa instalada

Estas ubicaciones pertenecen a la estructura comprobada; verifica que existan en tu versión. Son puntos de lectura, no archivos para personalizar dentro de `vendor/`.

| Pregunta | Ubicación |
| --- | --- |
| ¿Qué valida la fundación? | `vendor/milpa/app-runtime/src/Support/Foundation.php` |
| ¿Qué acepta el rito? | `vendor/milpa/app-runtime/src/Operations/FoundationOperations.php` |
| ¿Qué declara una operación? | `vendor/milpa/command/src/Operation.php` |
| ¿Cómo se representa el techo? | `vendor/milpa/command/src/Effect/EffectProfile.php` |
| ¿Qué exige consentimiento en el contrato? | `vendor/milpa/console/src/Consent.php` |
| ¿Qué hace la puerta local sin firma? | `vendor/milpa/app-runtime/src/Console/UnsignedTerminal.php` |
| ¿Quién conecta políticas y Bearer? | `src/Http/IdentityWiring.php` |
| ¿Cómo llega identidad a HTTP? | `src/Http/IdentityChain.php` |
| ¿Qué se expone por HTTP? | `src/Plugins/OperationsHttpPlugin/OperationsHttpPlugin.php` y `config/http.php` |
| ¿Qué garantiza un repositorio básico? | `vendor/milpa/data/src/RepositoryInterface.php` |
| ¿Qué declara y acepta una sesión? | `vendor/milpa/app-runtime/src/Operations/SessionOperations.php` |

Cuando una guía antigua y tu casa difieran, consulta el contrato y el código de la versión instalada, conserva la evidencia y revisa si debes actualizar. No mezcles argumentos de una edición, declaraciones de otra y un resultado de una tercera sin registrar esa diferencia.

**Español** · [English](en/11-tu-propia-casa.md)

# Construir tu propia casa y cerrar el recorrido

**Resultado:** transferirás el método a un dominio nuevo y otra persona podrá evaluar lo que construiste.

## Elegir un dominio pequeño

Elige un problema que puedas describir con vocabulario propio y una transición visible. Por ejemplo, una lista de tareas que permite completar una pendiente, un inventario que registra una entrada o una biblioteca personal que marca un libro como leído. Evita usar el taller como una plantilla que sólo cambia nombres: la regla debe corresponder al nuevo dominio.

Define quién opera, qué debe perdurar y una frontera que mantenga el primer recorrido comprobable. Si necesitas múltiples operadores desde el primer día, esa concurrencia pasa al primer slice; no heredes la implementación secuencial del taller y declares que la resolviste.

## Recorrido de transferencia

1. Escribe tu primera intención de construcción y la pregunta que podría reordenarla.
2. Crea una casa nueva con Composer y registra versiones y estado sin fundar.
3. Funda con tu dominio, objetivo, fronteras y autoridad humana. Lee el acta.
4. Adopta sólo las capacidades necesarias y revisa los cambios declarados.
5. Implementa una entidad y un servicio con al menos una regla y un rechazo observable.
6. Declara dos o más operaciones, con schemas, efectos y restricciones adecuados.
7. Registra el plugin y comprueba catálogo, ejecución y persistencia entre procesos.
8. Comprueba que una llamada no autorizada no cambia datos.
9. Si expones HTTP, prueba identidad ausente, scope incorrecto y acceso permitido.
10. Registra una decisión y evidencia. Cierra la afirmación que probaste y conserva lo diferido.

Los archivos del ejemplo muestran una forma de conectar piezas; no son un generador de cualquier negocio. Puedes reemplazar el repositorio por un puerto específico, agregar políticas por recurso o diseñar otro modelo de error cuando tu pregunta lo exija. Conserva la separación entre declaración de capacidades, reglas y superficies.

## Evaluación final

| Criterio | Evidencia mínima | No es suficiente |
| --- | --- | --- |
| Identidad de la casa | Fundación fundada y acta coherente con el propósito | Una carpeta que arranca |
| Fronteras | Restricciones que se ven en código y en pruebas pertinentes | Sólo una lista en prosa |
| Arquitectura | Explicación de entrada, handler, dominio y persistencia | Un diagrama sin relacionarlo con archivos |
| Capacidades | Diff de adopciones, proveedores y plugins activos | Código instalado en `vendor/` |
| Regla del dominio | Caso permitido y violación rechazada sin cambio indebido | Sólo el camino feliz |
| Persistencia | Lectura desde un proceso o instancia nuevo | Estado en memoria del primer proceso |
| Efectos | Contratos explícitos que concuerdan con las acciones | `mutating=false` usado como garantía genérica |
| Autoridad | Negativa observable y control positivo autorizado | Una firma sin comprobar el resultado |
| Superficie de red si la hay | Exposición elegida y prueba 401 403 200 | Un endpoint público que devuelve datos |
| Evolución | Decisión, evidencia y pregunta abierta | Un cierre que promete más de lo medido |

La rama de agente se evalúa aparte: proveedor elegido, identidad propia del actor, catálogo disponible, llamadas reales y evidencia del estado final. Completar la casa de dominio no requiere consumir un modelo ni instalar todas las capacidades de Milpa.

## Entrega para otro ingeniero

Incluye un README de tu casa que responda qué hace, qué queda fuera, cómo instalarla, cómo fundarla si todavía no lo está, qué operaciones usar y dónde están sus datos. Añade un comando para ejecutar las pruebas y describe qué garantiza cada grupo. No distribuyas claves o tokens con el ejemplo.

Pide a otra persona que haga el recorrido desde un checkout nuevo. Registra el primer punto donde necesita una explicación externa. Esa observación mide si tu documentación sirve a un recién llegado; que el autor complete sus propios comandos sólo prueba una parte.

Tu cierre puede decir: «La casa registra y completa tareas secuencialmente; las pruebas comprueban que una tarea ausente se rechaza y el estado perdura entre procesos. No hemos probado concurrencia». Esa afirmación permite una evaluación concreta y orienta el siguiente trabajo.

## Preguntas para comprobar comprensión

- ¿Qué cambió al fundar y qué sigue siendo responsabilidad del dominio?
- ¿Qué diferencia un paquete instalado de un plugin que arranca?
- ¿Qué parte del flujo debe rechazar una regla de negocio y qué parte un caller sin scope?
- ¿Qué efecto tendría un controller que edita libremente el estado protegido por tus operaciones?
- ¿Por qué una lectura sin efectos clasificados puede pedir más controles?
- ¿Qué cambia al actualizar `vendor/` y qué no cambia en el template copiado?
- ¿Qué evidencia falta para hacer la siguiente afirmación sobre tu producto?

Puedes responderlas señalando archivos, contratos y resultados. Cuando otro ingeniero pueda reconstruir ese razonamiento y operar tu dominio, el recorrido habrá logrado su propósito.

Consulta [el glosario y las fuentes](referencias.md) y [la evidencia de esta edición](mantenimiento.md).

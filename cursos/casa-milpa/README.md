**Español** · [English](en/README.md)

# Construir y fundar una casa Milpa

Este curso acompaña a un ingeniero desde su primera lectura de Milpa hasta una casa fundada que opera un dominio propio. Al terminar podrás explicar qué decidiste construir, qué queda fuera, dónde vive cada responsabilidad y qué evidencia demuestra que tus operaciones funcionan. El recorrido utiliza PHP y Composer; puedes seguirlo sin un proveedor de modelos, una base de datos externa ni un cliente MCP.

Milpa organiza una aplicación alrededor de capacidades declaradas como operaciones. Una casa tiene un propósito y autoridades; sus plugins aportan comportamiento; las superficies presentan ese comportamiento a personas y herramientas. Estas piezas permiten que un agente opere la aplicación, pero el humano conserva las decisiones de producto y los límites de autoridad.

El proyecto del curso es un **taller que presta herramientas**, operado secuencialmente por una persona. Registra una herramienta, consulta disponibilidad, presta y devuelve. No lleva personas, pagos, reservas ni préstamos concurrentes. Elegimos una frontera pequeña para poder demostrar sus reglas antes de agregar infraestructura.

## Resultado y requisitos

Necesitas PHP 8.3 o superior, Composer, Git y GnuPG. Las extensiones exigidas por los paquetes las revisa Composer. Para SQLite o MySQL necesitarás su extensión PDO cuando elijas ese backend. Con el almacenamiento JSON del curso no necesitas un servidor de base de datos.

El curso se comprobó con `milpa/framework` 0.55.1 y dependencias publicadas, incluyendo `milpa/app-runtime` 0.207.2, `milpa/command` 0.28.0 y `milpa/data` 0.3.2. Consulta [la evidencia y el protocolo de mantenimiento](mantenimiento.md) para distinguir el recorrido ejecutado de las ramas opcionales. Guarda tu `composer.lock`: el template y los paquetes del runtime se versionan por separado.

## Recorrido

| Unidad | Pregunta que resuelve | Entrega del alumno |
| --- | --- | --- |
| [00 Entender Milpa](00-entender-milpa.md) | ¿Qué problema organiza y cuándo conviene una casa? | Explicación del dominio y evaluación de encaje |
| [01 Crear y observar](01-crear-y-observar.md) | ¿Qué existe antes de fundar? | Instalación y mapa de su estado real |
| [02 Fundar](02-fundar.md) | ¿Qué es esta casa y quién decide? | Constitución y acta de fundación |
| [03 Leer la arquitectura](03-arquitectura.md) | ¿Cómo llega una petición al dominio? | Mapa de responsabilidades y flujo |
| [04 Hacer crecer la casa](04-capacidades-y-plugins.md) | ¿Qué diferencia instalar, declarar y activar? | Capacidad adoptada y plugin registrado |
| [05 Delimitar el dominio](05-dominio-y-evidencia.md) | ¿Qué afirmación merece una prueba antes de más código? | Hipótesis, fronteras y casos de rechazo |
| [06 Implementar operaciones](06-primer-dominio.md) | ¿Cómo trabaja el dominio sin depender de una superficie? | Cuatro operaciones y pruebas de sus reglas |
| [07 Gobernar los efectos](07-efectos-y-autoridad.md) | ¿Qué cambia una llamada y con qué autoridad? | Contratos revisados y una negativa comprobada |
| [08 Elegir superficies](08-superficies.md) | ¿Quién puede llegar a cada operación? | Lectura HTTP protegida y mapa CLI TUI MCP |
| [09 Incorporar un agente](09-agentes.md) | ¿Cómo delegar sin delegar la autoridad humana? | Diseño de una tarea y lectura de sus pausas |
| [10 Decidir y operar](10-decidir-y-operar.md) | ¿Cómo evoluciona una casa sin olvidar por qué existe? | Decisión con evidencia y plan de operación |
| [11 Construir tu propia casa](11-tu-propia-casa.md) | ¿Puedes transferir lo aprendido a otro dominio? | Casa propia y evaluación final |

Lee en orden la primera vez. Cada unidad incluye un punto de comprobación: si el resultado cambia, conserva la salida y vuelve al contrato de la operación. Copiar un comando sin reconocer lo que autoriza no cumple el ejercicio.

## Cómo usar los ejemplos

El [ejemplo completo](ejemplos/prestamos/README.md) vive en `cursos/casa-milpa/ejemplos/prestamos`, dentro del repositorio [`getmilpa/academy`](https://github.com/getmilpa/academy). Es material didáctico: **no se carga al arrancar el template**. Lo copiarás explícitamente a la casa que crees en la unidad 06. Así el punto de partida de Milpa sigue siendo pequeño y el dominio pertenece a la casa del alumno.

Los comandos con `--sign` autorizan una llamada concreta con tu clave. Las lecturas no lo necesitan. Los comandos de laboratorio que muestran claves o tokens usan valores propios del alumno; no hay credenciales compartidas en este repositorio.

Al final consulta el [glosario y las referencias](referencias.md). Para el uso inmediato de una operación, el contrato que tu propia casa devuelve es más preciso que un ejemplo correspondiente a otra versión.

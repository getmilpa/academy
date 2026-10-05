**Español** · [English](en/00-entender-milpa.md)

# Entender Milpa antes de instalar

**Resultado:** podrás explicar para qué sirve una casa, cómo se relaciona con la familia Milpa y qué problemas debes resolver en tu dominio.

## De una necesidad interna a una familia de herramientas

Milpa creció a partir del trabajo de TeamX y de la necesidad de entender, reparar y hacer evolucionar sus propios sistemas. Su nombre remite a una forma de cultivo en la que distintas especies conviven; el vocabulario de casa, herramientas, capacidades y crecimiento expresa una relación con el software que puede cuidarse y comprenderse. La coa da nombre a la terminal con la que trabajas la casa.

La [constitución del sistema de diseño](https://github.com/getmilpa/milpa-design/blob/main/DESIGN.md) relaciona esa idea con la experiencia de Rodrigo Vicente sembrando injertos en Oaxaca y con la enseñanza de aprender a reparar lo propio. Esa historia ayuda a leer la intención del proyecto: preservar una estructura comprensible y dejar espacio para extensiones. No es una especificación técnica ni una garantía de lo que hace cada versión.

La evolución técnica visible en los repositorios separó los contratos centrales de sus implementaciones, extrajo paquetes que una aplicación puede adoptar y convirtió `milpa/framework` en un punto de partida de Composer. El trabajo cotidiano ya no necesita copiar todo un sistema interno: una casa adopta los paquetes que su dominio requiere. Los paquetes tienen versiones y dependencias propias; el template conserva el arranque y las decisiones iniciales de la aplicación.

La arquitectura actual pone una `Operation` como unidad pública de capacidad. Se declara una vez y se proyecta a distintas superficies. Esto permite que un ingeniero, una interfaz de terminal o un cliente de herramientas descubran el mismo comportamiento. La disponibilidad efectiva depende de los paquetes presentes, los plugins activos y los límites declarados por la casa.

## Casa dominio y capacidad

Una **casa** es una aplicación concreta construida con Milpa. Tiene raíz de archivos, configuración, plugins y un propósito. Una instalación recién creada puede arrancar antes de estar fundada; ese arranque demuestra vida técnica, no una decisión de producto.

El **dominio** es el problema que la casa se compromete a atender. En el taller hablamos de herramientas, disponibilidad, préstamo y devolución. Esas palabras deben orientar el código y sus pruebas. Milpa no conoce por sí mismo cuándo una herramienta puede prestarse: esa regla la implementa el dominio.

Una **capacidad** es algo que la casa puede hacer. `milpa/data` aporta persistencia; un plugin del taller aporta la capacidad de prestar. Un **plugin** tiene ciclo de vida y puede contribuir operaciones, rutas u otras integraciones. Un paquete puede aportar contratos o proveedores sin ser un plugin que arranca. Confundir los dos lleva a asumir que instalar código lo puso a funcionar.

Una **operación** declara nombre, descripción, entrada y handler, junto con efectos y restricciones. `herramientas.prestar` cuenta qué puede invocarse; el servicio de préstamos ejecuta la transición; una superficie lo presenta como comando o herramienta. El catálogo se deriva de lo que la casa aporta, no de una lista de comandos escrita aparte.

## Las preguntas que organiza

| Pregunta | Pieza que ayuda a responder | Responsabilidad que conserva la casa |
| --- | --- | --- |
| ¿Qué somos y qué queda fuera? | Fundación y acta | Definir el propósito y hacer valer las fronteras |
| ¿Qué podemos hacer ahora? | Catálogo de operaciones y capacidades | Adoptar y revisar código apropiado al dominio |
| ¿Qué corre al arrancar? | Configuración de plugins y activación | Revisar las declaraciones y las dependencias |
| ¿Quién puede ejecutar una llamada? | Identidad, políticas y consentimiento | Conectar las políticas a cada entrada relevante |
| ¿Qué puede cambiar? | Perfil de efectos | Declararlo con honestidad y verificar el comportamiento |
| ¿Por qué cambiamos algo? | Decisiones y evidencia | Conservar el razonamiento y sus límites |

La filosofía se vuelve útil cuando cambia un comportamiento verificable. Si una lectura declara efectos desconocidos, el sistema puede exigir controles que esa lectura no necesita. Si un préstamo no tiene prueba de rechazo, su invariante sigue siendo una promesa. Si una frontera aparece en la constitución pero un controller ofrece un camino que la evade, la casa todavía no la hace valer.

## Encaje y fronteras

Milpa es un buen punto de partida cuando quieres hacer explícitas las capacidades de una aplicación, extenderla mediante plugins y operar desde varias superficies. También sirve para construir una casa que un agente pueda descubrir y operar bajo reglas de autoridad.

El punto de partida no ofrece todos los elementos de cualquier producto. Tu dominio puede necesitar transacciones, relaciones complejas, colas, procesos de larga duración, flujos continuos o una experiencia visual especializada. Esas necesidades merecen diseño e integración propios. Los repositorios básicos de `milpa/data` no son un ORM relacional ni un puerto transaccional. Las señales de ejecución de operaciones no convierten automáticamente los datos de tu negocio en un sistema con event sourcing.

La visión de una familia extensible permite incorporar capacidades gradualmente. Ideas como redes de casas, Stations o mercados de capacidades deben leerse con su estado documentado; no son requisitos ni prestaciones necesarias para terminar este curso. La evidencia de esta ruta será una casa local que persiste y gobierna un dominio pequeño.

## Comprobación

Escribe un párrafo con el dominio que quieres atender y tres acciones con significado para sus usuarios. Después indica una necesidad que Milpa aporta y otra que debes diseñar tú. Para el taller, una respuesta suficiente distingue persistencia de la regla de préstamo y reconoce que la concurrencia está fuera del primer ejercicio.

Continúa con [crear y observar](01-crear-y-observar.md).

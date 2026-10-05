**Español** · [English](en/06-primer-dominio.md)

# Implementar el primer dominio

**Resultado:** operarás cuatro capacidades del taller desde la terminal, con estado durable y pruebas de sus reglas.

## Instalar el ejemplo en tu casa

Trabaja desde la raíz de `mi-taller`, con la casa fundada y `milpa/data` instalado. Necesitas tener disponible el directorio de este curso, por ejemplo desde un clon de `getmilpa/academy` (`git clone https://github.com/getmilpa/academy.git`) hecho fuera de `mi-taller`. Establece su ruta real:

```bash
export CURSO_ROOT='/ruta/al/repositorio/academy/cursos/casa-milpa'
test -f "$CURSO_ROOT/ejemplos/prestamos/src/Plugins/Prestamos/Prestamos.php"
```

La comprobación debe terminar con código 0. No uses literalmente `/ruta/al/...`; reemplázalo por el directorio que contiene los archivos del curso. Puedes leer el ejemplo completo [aquí](ejemplos/prestamos/README.md).

En una casa sin un plugin llamado `Prestamos`, copia:

```bash
cp -R "$CURSO_ROOT/ejemplos/prestamos/src/Plugins/Prestamos" src/Plugins/
cp "$CURSO_ROOT/ejemplos/prestamos/tests/PrestamosServiceTest.php" tests/
vendor/bin/phpunit tests/PrestamosServiceTest.php
php bin/coa operation:contract --name=plugins:register --json
php bin/coa plugins:register --name=Prestamos --sign --json
php bin/coa plugins:list --json
```

Las pruebas deben pasar. El registro debe indicar que la casa arranca con el plugin. No copies sobre un plugin propio del mismo nombre: el ejemplo enseña a construir una casa nueva; una integración en un dominio existente exige revisar sus diferencias.

## Leer las tres responsabilidades

[`Herramienta.php`](ejemplos/prestamos/src/Plugins/Prestamos/Entities/Herramienta.php) es un objeto inmutable y plano que implementa `EntityInterface`. `id()`, `toArray()` y `fromArray()` permiten la persistencia. La entidad no sabe si llegó de CLI, HTTP o una prueba.

[`PrestamosService.php`](ejemplos/prestamos/src/Plugins/Prestamos/Domain/PrestamosService.php) contiene las reglas. Recibe `RepositoryInterface<Herramienta>`, valida el nombre y decide qué transición es posible. Cuando guarda una entidad nueva, recupera la herramienta por el id que devuelve `save()`: la entidad original era inmutable y su id no cambia por arte de la persistencia.

[`Prestamos.php`](ejemplos/prestamos/src/Plugins/Prestamos/Prestamos.php) cumple `PluginInterface` y `CommandProvider`. La metadata identifica al plugin. `operations()` declara los cuatro átomos y sus perfiles; los handlers delegan al servicio. El repositorio se crea al ejecutar, usando `Config` y la raíz del kernel.

No hay un controller paralelo con reglas duplicadas. La lectura admite HTTP; las escrituras admiten CLI, TUI y MCP. Todas declaran scopes para que las superficies con política puedan juzgar al caller. La implementación del servicio sigue siendo responsable de las reglas de negocio.

## Primera operación y persistencia

Consulta el contrato y agrega una herramienta:

```bash
php bin/coa operation:contract --name=herramientas:agregar --json
php bin/coa herramientas:agregar --nombre='Taladro' --sign --json
php bin/coa herramientas:listar --json
```

El alta devuelve una herramienta con id asignado. Usa **ese id** en los siguientes comandos; `1` sólo corresponde a la primera alta de una colección vacía:

```bash
php bin/coa herramientas:prestar --id=1 --sign --json
php bin/coa herramientas:listar --json
php bin/coa herramientas:prestar --id=1 --sign --json
php bin/coa herramientas:listar --json
php bin/coa herramientas:devolver --id=1 --sign --json
```

El segundo préstamo debe fallar con `ya_prestada`. En la versión comprobada el envelope de CLI refleja también esa negativa como `ok=false` y termina con código 1. Lo fundamental es el resultado del dominio y que la lectura posterior conserve `prestada=true`. La devolución lo cambia a `false`.

Ejecuta además un nombre compuesto sólo de espacios y un id inexistente. Deben devolver `nombre_invalido` y `herramienta_ausente` sin crear nuevas herramientas.

## Elegir dónde viven los datos

Por omisión el plugin utiliza `var/herramientas.json`, una colección de este dominio. Puedes agregar una clave propia al arreglo de `config/app.php`, conservando sus claves existentes:

```php
'prestamos' => [
    'storage' => [
        'driver' => 'file',
        'path' => dirname(__DIR__) . '/var/herramientas.json',
    ],
],
```

Para pruebas usamos `InMemoryRepository`; su estado desaparece al terminar el proceso. Para este ejercicio usamos `FileRepository`; su estado se conserva. `RepositoryFactory` puede elegir SQLite o MySQL con las claves que el README de `milpa/data` documenta.

Cambiar el driver no migra por sí mismo los datos del archivo anterior. Planea el traslado, prueba la lectura del destino y conserva el origen hasta verificarlo. Tampoco agrega transacciones al contrato básico. Si usas archivos, asigna una colección independiente a cada tipo de entidad; no reutilices el archivo de tokens para herramientas.

## Verificar una regla antes de una superficie

[`PrestamosServiceTest.php`](ejemplos/prestamos/tests/PrestamosServiceTest.php) comprueba el rechazo sin mutación, las entradas inválidas y la persistencia entre instancias. No prueba préstamos concurrentes ni la política HTTP. Esas son otras afirmaciones y necesitan otras pruebas.

Puedes ejecutar análisis estático sobre lo que acabas de incorporar:

```bash
vendor/bin/phpstan analyse src/Plugins/Prestamos tests/PrestamosServiceTest.php --no-progress
```

## Comprobación

Debes tener un plugin activo, una herramienta recuperable desde procesos distintos, un préstamo duplicado rechazado y tres pruebas pasando. Conserva salidas y el diff. Explica qué cambiaría si reemplazaras las operaciones con una edición libre de `prestada`: habrías agregado un camino que evade el contrato del dominio.

Continúa con [efectos y autoridad](07-efectos-y-autoridad.md).

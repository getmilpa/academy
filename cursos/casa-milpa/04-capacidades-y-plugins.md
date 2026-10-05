**Español** · [English](en/04-capacidades-y-plugins.md)

# Hacer crecer la casa con capacidades y plugins

**Resultado:** distinguirás código instalado, declarado, activo y expuesto, y adoptarás sólo lo necesario para el taller.

## Cuatro estados que conviene separar

Un paquete instalado por Composer tiene código disponible en `vendor/`. Un proveedor declarado en `config/operations.php` puede aportar operaciones de ese paquete. Un plugin declarado en `config/plugins.php` participa en el arranque si su estado de activación lo permite. Una operación expuesta por HTTP además está nombrada en `config/http.php` y admite esa superficie.

Estos estados no son sinónimos. Un paquete de contratos puede no aportar operaciones. Un plugin registrado puede estar desactivado. Una operación que aparece en la terminal puede prohibir HTTP. Una ruta directa de un plugin sigue su propia declaración y no la lista de exposición del proyector de operaciones.

La casa lee su lista de plugins, no escanea indiscriminadamente cualquier clase para ejecutarla. La activación se conserva en `storage/plugins.json`. `config/plugins.php` registra la intención de adoptar el plugin; el almacén registra si está prendido. Las herramientas administrativas trabajan sobre esas mismas fuentes.

## Adoptar persistencia

Consulta y previsualiza:

```bash
php bin/coa capabilities --json
php bin/coa capabilities:enable milpa/data --dry-run --json
```

El resultado informa el comando de Composer y los cambios previstos. Luego adopta:

```bash
php bin/coa capabilities:enable milpa/data --sign --json
composer show milpa/data
```

`capabilities:enable` instala por el camino que la casa conoce y declara los proveedores o plugins que el manifiesto de la capacidad señala. `milpa/data` ofrece persistencia sin tener que agregar un proveedor de comandos propio al catálogo. El hecho de que `registered` sea una lista vacía puede ser correcto: la adopción no siempre aporta operaciones nuevas.

Si instalas manualmente con Composer, eres responsable de completar las declaraciones que necesita esa capacidad. No copies nombres de proveedores de una versión que no tienes. Consulta el manifiesto y el README del paquete instalado.

## Herramientas de desarrollo opcionales

El taller no necesita un generador para entender sus reglas. Puedes adoptar `milpa/devtools` si quieres explorar scaffolding y diagnósticos:

```bash
php bin/coa capabilities:enable milpa/devtools --dry-run --json
php bin/coa capabilities:enable milpa/devtools --sign --json
php bin/coa operation:contract --name=make --json
php bin/coa doctor --json
```

Un ejercicio separado permite leer lo que el generador propone:

```bash
php bin/coa make --what=crud --plugin=InventarioDemo --name=Item \
  --fields='name:string:120, lent:bool' --dry-run --json
```

Si decides generar ese experimento, repite la llamada sin `--dry-run` y con `--sign`, revisa los archivos y los postconditions. El andamiaje crea la estructura y verifica su forma; no declara necesariamente el plugin en `config/plugins.php`. Regístralo sólo cuando hayas revisado qué expone:

```bash
php bin/coa operation:contract --name=plugins:register --json
php bin/coa plugins:register --name=InventarioDemo --sign --json
php bin/coa plugins:list --json
```

El CRUD generado no constituye el dominio de préstamos. Si permite editar directamente un booleano de disponibilidad, no modela la regla de prestar y devolver. Mantén este experimento en una casa aparte o sin registrar cuando trabajes el proyecto central. En la unidad 06 usarás un servicio de dominio y operaciones específicas.

`plugins:register` no ofrece `dry_run` en el contrato comprobado. La lectura del contrato permite revisar lo que autorizarás; no agregues una bandera de previsualización que la operación no declara.

## Registrar el plugin propio

`plugins:register` toma el nombre de una clase que ya existe en `src/Plugins/` y agrega su declaración después de comprobar el arranque. No instala un paquete remoto. El plugin entra desde la siguiente petición o comando; el proceso que acaba de registrarlo ya había arrancado con la lista anterior.

Si el arranque propuesto falla, el resultado explica por qué y qué no se escribió. En el ejemplo del curso comprobamos precisamente este control: una metadata incompleta fue rechazada antes de modificar la declaración. El arreglo fue completar el contrato de la clase, no forzar su registro.

Consulta el contrato antes de desactivar, desinstalar o eliminar. Desactivar un plugin cambia el comportamiento disponible; no es una prueba de que sus datos se borraron. El significado de instalar y desinstalar pertenece al ciclo de vida que su implementación aporta. Nombra el plugin concreto que quieres afectar.

## Comprobación

Para cada adopción anota qué cambió en `composer.json`, `composer.lock`, `config/operations.php` y `config/plugins.php`. No todos deben cambiar. Explica por qué una entidad puede usar `milpa/data` sin que el paquete aporte un nuevo comando, y por qué un scaffold puede existir sin arrancar.

Continúa con [delimitar el dominio](05-dominio-y-evidencia.md).

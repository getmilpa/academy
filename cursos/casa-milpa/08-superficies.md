# Elegir las superficies de la casa

**Resultado:** expondrás una lectura HTTP con acceso comprobado y entenderás qué significa que una operación aparezca en CLI, TUI o MCP.

## Una operación varias entradas

La declaración de operaciones evita escribir un catálogo de capacidades distinto por superficie. Cada proyección conserva una forma nativa: nombre de comando en CLI, formulario en TUI, herramienta MCP y ruta en HTTP. La misma declaración no significa acceso irrestricto ni idéntica identidad en todas ellas.

| Superficie | Entrada del taller | Frontera relevante |
| --- | --- | --- |
| CLI | `herramientas:listar` | Lectura local; escrituras firmadas |
| TUI | `php bin/coa shell` | Navegación del catálogo; una llamada que necesita firma vuelve a CLI |
| MCP | `herramientas_listar` en el cliente | Pipe stdio local y autoridad presentada al proceso |
| HTTP | `GET /taller/herramientas` | Exposición expresa y caller con `herramientas:read` |

`shell` y `chat` son pantallas que conversan; no son operaciones de dominio. En un destino sin terminal interactiva imprimen un frame y salen. En la TUI, Enter abre la operación y Esc vuelve. Si la puerta no puede firmar, informa la línea exacta de terminal que la autoriza; pulsar un botón no sustituye la identidad.

## Conectar la identidad HTTP

El taller ya usa `milpa/data`. Adopta la identidad:

```bash
php bin/coa capabilities:enable milpa/auth --dry-run --json
php bin/coa capabilities:enable milpa/auth --sign --json
php bin/coa operation:contract --name=token:new --json
```

La casa conecta en `config/boot.php` la política con `milpa/auth` y el almacén y verificador de Bearer con `milpa/data`. `App\Http\IdentityWiring` registra esas piezas. `App\Http\IdentityChain` las lleva a la petición antes del handler. Mantén ese recorrido al incorporar middleware propio.

En este ejercicio el almacén de tokens usa su archivo propio, `storage/tokens.json`, si no configuraste otro. El archivo de herramientas pertenece a `prestamos.storage`; no compartas la colección de archivo entre entidades diferentes.

La adopción de auth puede declarar también la puerta de passkeys. No necesitas completar esa ceremonia para comprobar Bearer. En un navegador, la identidad de passkey puede ser otro principal. El Bearer se procesa primero y un token rechazado no se blanquea con una cookie. Las escrituras autenticadas por cookie tienen las condiciones de JSON y origen que la cadena implementa; una aplicación que modifica ese recorrido necesita volver a probarlas.

## Exponer sólo la lectura

Edita `config/http.php` y nombra la operación interna:

```php
<?php
declare(strict_types=1);

return ['expose' => ['herramientas.listar']];
```

Si ya tenías operaciones expuestas, revisa la lista completa antes de reemplazarla. El nombre usa un punto; el path lo declara la operación. Como admite HTTP y tiene `path: '/taller/herramientas'`, produce esa ruta de lectura. Las escrituras del ejemplo no admiten HTTP y no las agregamos aquí.

El host rechaza exponer operaciones con scopes o permisos si falta la política correspondiente. Tener el paquete instalado sin conectar el verificador tampoco produce una identidad válida; es un problema de configuración del servidor. No elimines los scopes para hacer que el arranque deje de protestar.

## Probar negativa y positiva

Arranca `php -S localhost:8000 -t public` en otra terminal. Sin identidad:

```bash
curl -i http://localhost:8000/taller/herramientas
# HTTP 401
```

Acuña un token de lectura y uno con un scope ajeno:

```bash
php bin/coa token:new --actor='curso-lector' \
  --scopes='["herramientas:read"]' --sign --json
php bin/coa token:new --actor='curso-sin-lectura' \
  --scopes='["otro:read"]' --sign --json
```

El secreto se muestra una vez; el almacén guarda su hash. Conserva el id para revocar después. No incluyas el secreto en tu evidencia ni en un archivo versionado. Captura el token mediante entrada de tu terminal o tu gestor de secretos; el siguiente ejemplo de Bash o Zsh permite pegarlo sin escribirlo en el comando:

```bash
read -r -s MILPA_READ_TOKEN
curl -i -H "Authorization: Bearer $MILPA_READ_TOKEN" \
  http://localhost:8000/taller/herramientas
# HTTP 200 y la colección
unset MILPA_READ_TOKEN
```

Repite con el token de `otro:read` y espera HTTP 403. La ausencia de identidad, una identidad sin alcance y una identidad admitida son tres casos diferentes. Esa comprobación positiva evita que un middleware que rechaza absolutamente todo parezca correcto por pasar sólo negativas.

Cuando termines, consulta ids y revoca los dos tokens:

```bash
php bin/coa token:list --json
php bin/coa token:revoke --id='ID_REAL_DEL_TOKEN' --sign --json
```

Sustituye el marcador por cada id real. La revocación se aplica en la siguiente petición. `token:list` no recupera el secreto.

## Descubrir el mismo dominio desde MCP

MCP es opcional:

```bash
php bin/coa capabilities:enable milpa/mcp-server --dry-run --json
php bin/coa capabilities:enable milpa/mcp-server --sign --json
```

Configura tu cliente MCP para ejecutar PHP con la ruta absoluta de `mi-taller/bin/coa` y el argumento `mcp`. Muchos clientes aceptan una estructura de este tipo; ajusta su formato documentado:

```json
{
  "mcpServers": {
    "mi-taller": {
      "command": "php",
      "args": ["/ruta/absoluta/mi-taller/bin/coa", "mcp"]
    }
  }
}
```

`bin/mcp-server.php` permanece como entrada compatible y delega en `coa mcp`. STDOUT contiene mensajes JSON-RPC, uno por línea; la salida para personas va a STDERR. El cliente mantiene abierto el pipe durante el diálogo. Un pipe cerrado inmediatamente después de enviar mensajes puede terminar el supervisor antes de que recibas respuestas; comprobar sólo código de salida 0 no demuestra un handshake.

Pide `tools/list` y encuentra `herramientas_listar`, `herramientas_agregar`, `herramientas_prestar` y `herramientas_devolver`. Invoca la lectura con argumentos vacíos. La prueba del curso obtuvo la colección del mismo archivo que CLI. `mcp` es una entrada de transporte; no lo busques como una operación de dominio en `operation:contract`.

Sin una identidad presentada, las lecturas por el pipe local pueden ejecutarse como `stdio`; una escritura que perdura se rechaza y devuelve la línea firmada que debe autorizarla. Que la herramienta aparezca en `tools/list` no garantiza que ese caller pueda ejecutarla. El runtime también puede recibir un token válido por `MILPA_TOKEN` en el entorno del proceso; su identidad y scopes se juzgan en la puerta correspondiente. Una demanda de firma no se resuelve devolviendo desde el mismo cliente un texto de confirmación.

No uses la presencia de `MILPA_TOKEN` como prueba de que se verificó: prueba la identidad y el acceso efectivos, incluyendo un control positivo y otro con scope ajeno. La semántica del host local debe revisarse antes de reutilizar su transporte como un servicio remoto.

## Comprobación

Conserva los tres resultados HTTP sin secretos. Explica el recorrido identidad → política → handler → servicio. Si activaste MCP, conserva el nombre de la herramienta, el resultado real de lectura y el rechazo de una escritura no autorizada. No necesitas MCP para continuar al cierre del curso.

Continúa con [incorporar un agente](09-agentes.md).

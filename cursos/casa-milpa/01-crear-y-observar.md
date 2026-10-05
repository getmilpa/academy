**Español** · [English](en/01-crear-y-observar.md)

# Crear y observar una casa

**Resultado:** tendrás una aplicación que arranca y sabrás preguntar por su estado antes de modificarla.

## Preparar el entorno

Comprueba las herramientas:

```bash
php --version
composer --version
git --version
gpg --version
```

PHP debe ser 8.3 o superior. Composer verifica extensiones y restricciones de los paquetes. Si falla la resolución, conserva el mensaje y atiende el requisito que nombra; instalar un paquete ignorando requisitos de plataforma no demuestra un arranque válido.

Crea una casa en una carpeta nueva:

```bash
composer create-project milpa/framework mi-taller
cd mi-taller
php bin/coa house:start --json
php bin/coa foundation --json
php bin/coa list
```

`house:start` ofrece el estado y siguientes pasos que esta casa conoce. `foundation` informa que aún no está fundada y enseña el rito. `list` muestra el catálogo disponible. En la versión comprobada, `list --json` sigue imprimiendo una lista legible: no asumas que cualquier bandera de cualquier comando produce el mismo formato.

Para reproducir específicamente el punto de partida del curso puedes pasar la versión del template:

```bash
composer create-project milpa/framework mi-taller 0.55.1
```

Eso fija el template; los rangos de Composer todavía resuelven paquetes compatibles al instalar. El archivo `composer.lock` registra cuáles recibiste. Guarda ambos cuando registres evidencia.

## Ver la primera página

En una terminal de la casa ejecuta:

```bash
php -S localhost:8000 -t public
```

En otra terminal:

```bash
curl -i http://localhost:8000/
```

Debes obtener HTTP 200 y una página de la casa. Detén el servidor con `Ctrl+C` al terminar. El servidor integrado de PHP permite este ejercicio local; la unidad de operación aborda el despliegue de una casa.

El plugin inicial sirve la página y el sistema de diseño. Todavía no definiste tu negocio. La presencia de una interfaz visible y la presencia de un dominio son comprobaciones diferentes.

## Leer el árbol

| Ubicación | Qué decide o conserva |
| --- | --- |
| `bin/coa` | Entrada de terminal que arranca y proyecta las operaciones |
| `public/index.php` | Entrada HTTP de la aplicación |
| `config/boot.php` | Contenedor, raíz y lista de plugins activos |
| `config/plugins.php` | Clases de plugins que la casa declara |
| `config/operations.php` | Proveedores de operaciones adoptados de paquetes |
| `config/app.php` | Configuración propia de la casa |
| `config/http.php` | Operaciones que eliges exponer por HTTP |
| `src/Plugins/` | Implementación de los plugins de esta casa |
| `storage/` y `var/` | Estado escrito durante la operación |
| `.milpa/foundation.json` | Constitución de la casa, cuando la fundes |
| `.milpa/framework.json` | Procedencia del template y archivos registrados |
| `vendor/` | Código instalado por Composer |

No edites `vendor/` para convertir un cambio en parte de tu casa: la siguiente instalación puede reemplazarlo. Si un comportamiento debe cambiar, identifica si pertenece al dominio, a la configuración o a un paquete y actúa en esa fuente.

## Preguntar antes de actuar

La operación que enseña contratos usa el argumento `name`:

```bash
php bin/coa operation:contract --name=foundation:found --json
php bin/coa capabilities --json
php bin/coa plugins:list --json
```

El contrato muestra entrada, efectos y superficies de una operación. `capabilities` distingue lo presente de lo que podrías adoptar. Una sugerencia de instalación no significa que esa capacidad ya opere. Si un comando no existe, vuelve al catálogo: algunos proveedores no ofrecen sus operaciones hasta que sus dependencias están presentes.

Muchos nombres internos usan puntos, como `plugins.list`; la terminal los proyecta con dos puntos, como `plugins:list`. Otros proveedores declaran directamente un nombre con dos puntos, como `foundation:found`. En archivos que nombran operaciones conserva el nombre exacto que el contrato informa.

## Comprobación

Conserva las versiones de PHP y del template, la salida de `foundation`, el código HTTP de `/` y una lista de tres operaciones disponibles. Explica por qué la casa puede responder y seguir sin fundarse. Si tu salida contradice un ejemplo del curso, identifica la versión y consulta el contrato en vez de adivinar argumentos.

Continúa con [fundar](02-fundar.md).

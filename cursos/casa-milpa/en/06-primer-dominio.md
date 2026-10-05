[Español](../06-primer-dominio.md) · **English**

# Implementing the first domain

**Outcome:** you will operate four capabilities of the workshop from the terminal, with durable state and tests of their rules.

## Install the example in your house

Work from the root of `mi-taller`, with the house founded and `milpa/data` installed. You need the directory of this course to be available, for example from a clone of `getmilpa/academy` (`git clone https://github.com/getmilpa/academy.git`) made outside `mi-taller`. Set its real path:

```bash
export CURSO_ROOT='/ruta/al/repositorio/academy/cursos/casa-milpa'
test -f "$CURSO_ROOT/ejemplos/prestamos/src/Plugins/Prestamos/Prestamos.php"
```

The check must finish with code 0. Do not use `/ruta/al/...` literally; replace it with the directory that contains the course's files. You can read the complete example [here](ejemplos/prestamos/README.md).

In a house without a plugin called `Prestamos`, copy:

```bash
cp -R "$CURSO_ROOT/ejemplos/prestamos/src/Plugins/Prestamos" src/Plugins/
cp "$CURSO_ROOT/ejemplos/prestamos/tests/PrestamosServiceTest.php" tests/
vendor/bin/phpunit tests/PrestamosServiceTest.php
php bin/coa operation:contract --name=plugins:register --json
php bin/coa plugins:register --name=Prestamos --sign --json
php bin/coa plugins:list --json
```

The tests must pass. The registration must indicate that the house boots with the plugin. Do not copy over a plugin of your own with the same name: the example teaches how to build a new house; an integration into an existing domain requires reviewing its differences.

## Read the three responsibilities

[`Herramienta.php`](../ejemplos/prestamos/src/Plugins/Prestamos/Entities/Herramienta.php) is an immutable, flat object that implements `EntityInterface`. `id()`, `toArray()` and `fromArray()` allow persistence. The entity does not know whether it came from CLI, HTTP or a test.

[`PrestamosService.php`](../ejemplos/prestamos/src/Plugins/Prestamos/Domain/PrestamosService.php) contains the rules. It receives `RepositoryInterface<Herramienta>`, validates the name and decides which transition is possible. When it saves a new entity, it retrieves the tool by the id `save()` returns: the original entity was immutable and its id does not change by the magic of persistence.

[`Prestamos.php`](../ejemplos/prestamos/src/Plugins/Prestamos/Prestamos.php) fulfils `PluginInterface` and `CommandProvider`. The metadata identifies the plugin. `operations()` declares the four atoms and their profiles; the handlers delegate to the service. The repository is created at execution time, using `Config` and the kernel's root.

There is no parallel controller with duplicated rules. The read admits HTTP; the writes admit CLI, TUI and MCP. All of them declare scopes so that surfaces with a policy can judge the caller. The service's implementation remains responsible for the business rules.

## First operation and persistence

Consult the contract and add a tool:

```bash
php bin/coa operation:contract --name=herramientas:agregar --json
php bin/coa herramientas:agregar --nombre='Taladro' --sign --json
php bin/coa herramientas:listar --json
```

Adding returns a tool with an assigned id. Use **that id** in the following commands; `1` only corresponds to the first addition to an empty collection:

```bash
php bin/coa herramientas:prestar --id=1 --sign --json
php bin/coa herramientas:listar --json
php bin/coa herramientas:prestar --id=1 --sign --json
php bin/coa herramientas:listar --json
php bin/coa herramientas:devolver --id=1 --sign --json
```

The second loan must fail with `ya_prestada`. In the checked version the CLI envelope also reflects that refusal as `ok=false` and finishes with code 1. What matters is the domain's result and that the subsequent read keeps `prestada=true`. The return changes it to `false`.

Also run a name made only of spaces and a non-existent id. They must return `nombre_invalido` and `herramienta_ausente` without creating new tools.

## Choosing where the data lives

By default the plugin uses `var/herramientas.json`, a collection of this domain. You can add a key of your own to the array in `config/app.php`, keeping its existing keys:

```php
'prestamos' => [
    'storage' => [
        'driver' => 'file',
        'path' => dirname(__DIR__) . '/var/herramientas.json',
    ],
],
```

For tests we use `InMemoryRepository`; its state disappears when the process ends. For this exercise we use `FileRepository`; its state is kept. `RepositoryFactory` can choose SQLite or MySQL with the keys the `milpa/data` README documents.

Changing the driver does not by itself migrate the data in the previous file. Plan the move, test the read at the destination and keep the origin until you verify it. Nor does it add transactions to the basic contract. If you use files, assign an independent collection to each type of entity; do not reuse the tokens file for tools.

## Verifying a rule before a surface

[`PrestamosServiceTest.php`](../ejemplos/prestamos/tests/PrestamosServiceTest.php) checks rejection without mutation, invalid inputs and persistence between instances. It does not test concurrent loans or the HTTP policy. Those are other claims and need other tests.

You can run static analysis on what you just incorporated:

```bash
vendor/bin/phpstan analyse src/Plugins/Prestamos tests/PrestamosServiceTest.php --no-progress
```

## Checkpoint

You must have an active plugin, a tool retrievable from different processes, a duplicate loan rejected and three tests passing. Keep the outputs and the diff. Explain what would change if you replaced the operations with a free edit of `prestada`: you would have added a path that evades the domain's contract.

Continue with [effects and authority](07-efectos-y-autoridad.md).

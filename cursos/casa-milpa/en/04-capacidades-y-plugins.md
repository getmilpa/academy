[Español](../04-capacidades-y-plugins.md) · **English**

# Growing the house with capabilities and plugins

**Outcome:** you will tell installed, declared, active and exposed code apart, and you will adopt only what the workshop needs.

## Four states worth separating

A package installed by Composer has code available in `vendor/`. A provider declared in `config/operations.php` can contribute operations from that package. A plugin declared in `config/plugins.php` takes part in the boot if its activation state allows it. An operation exposed over HTTP is, in addition, named in `config/http.php` and admits that surface.

These states are not synonyms. A contracts package may contribute no operations. A registered plugin may be deactivated. An operation that appears in the terminal may forbid HTTP. A plugin's direct route follows its own declaration and not the exposure list of the operation projector.

The house reads its list of plugins; it does not indiscriminately scan any class in order to execute it. Activation is kept in `storage/plugins.json`. `config/plugins.php` records the intent to adopt the plugin; the store records whether it is switched on. The administrative tools work on those same sources.

## Adopting persistence

Query and preview:

```bash
php bin/coa capabilities --json
php bin/coa capabilities:enable milpa/data --dry-run --json
```

The result reports the Composer command and the planned changes. Then adopt:

```bash
php bin/coa capabilities:enable milpa/data --sign --json
composer show milpa/data
```

`capabilities:enable` installs through the path the house knows and declares the providers or plugins the capability's manifest names. `milpa/data` offers persistence without having to add a command provider of its own to the catalogue. `registered` being an empty list can be correct: adoption does not always contribute new operations.

If you install manually with Composer, you are responsible for completing the declarations that capability needs. Do not copy provider names from a version you do not have. Consult the manifest and the README of the installed package.

## Optional development tools

The workshop does not need a generator to understand its rules. You can adopt `milpa/devtools` if you want to explore scaffolding and diagnostics:

```bash
php bin/coa capabilities:enable milpa/devtools --dry-run --json
php bin/coa capabilities:enable milpa/devtools --sign --json
php bin/coa operation:contract --name=make --json
php bin/coa doctor --json
```

A separate exercise lets you read what the generator proposes:

```bash
php bin/coa make --what=crud --plugin=InventarioDemo --name=Item \
  --fields='name:string:120, lent:bool' --dry-run --json
```

If you decide to generate that experiment, repeat the call without `--dry-run` and with `--sign`, review the files and the postconditions. The scaffolding creates the structure and verifies its shape; it does not necessarily declare the plugin in `config/plugins.php`. Register it only when you have reviewed what it exposes:

```bash
php bin/coa operation:contract --name=plugins:register --json
php bin/coa plugins:register --name=InventarioDemo --sign --json
php bin/coa plugins:list --json
```

The generated CRUD is not the lending domain. If it allows a boolean of availability to be edited directly, it does not model the rule of lending and returning. Keep this experiment in a separate house, or unregistered, while you work on the central project. In unit 06 you will use a domain service and specific operations.

`plugins:register` does not offer `dry_run` in the checked contract. Reading the contract lets you review what you will authorize; do not add a preview flag the operation does not declare.

## Registering your own plugin

`plugins:register` takes the name of a class that already exists in `src/Plugins/` and adds its declaration after checking the boot. It does not install a remote package. The plugin comes in from the next request or command; the process that just registered it had already booted with the previous list.

If the proposed boot fails, the result explains why and what was not written. In the course's example we checked precisely this control: incomplete metadata was rejected before the declaration was modified. The fix was to complete the class's contract, not to force its registration.

Consult the contract before deactivating, uninstalling or deleting. Deactivating a plugin changes the behaviour available; it is not proof that its data was erased. The meaning of installing and uninstalling belongs to the lifecycle its implementation contributes. Name the specific plugin you want to affect.

## Checkpoint

For each adoption, note what changed in `composer.json`, `composer.lock`, `config/operations.php` and `config/plugins.php`. Not all of them have to change. Explain why an entity can use `milpa/data` without the package contributing a new command, and why a scaffold can exist without booting.

Continue with [bounding the domain](05-dominio-y-evidencia.md).

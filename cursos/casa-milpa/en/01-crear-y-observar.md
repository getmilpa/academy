[Español](../01-crear-y-observar.md) · **English**

# Creating and observing a house

**Outcome:** you will have an application that boots and you will know how to ask about its state before modifying it.

## Prepare the environment

Check the tools:

```bash
php --version
composer --version
git --version
gpg --version
```

PHP must be 8.3 or higher. Composer verifies the packages' extensions and constraints. If resolution fails, keep the message and attend to the requirement it names; installing a package while ignoring platform requirements does not demonstrate a valid boot.

Create a house in a new folder:

```bash
composer create-project milpa/framework mi-taller
cd mi-taller
php bin/coa house:start --json
php bin/coa foundation --json
php bin/coa list
```

`house:start` offers the state and next steps this house knows. `foundation` reports that it is not founded yet and teaches the rite. `list` shows the available catalogue. In the checked version, `list --json` still prints a readable list: do not assume that any flag of any command produces the same format.

To reproduce specifically the course's starting point you can pass the template version:

```bash
composer create-project milpa/framework mi-taller 0.55.1
```

That pins the template; Composer's ranges still resolve compatible packages at install time. The `composer.lock` file records which ones you received. Keep both when you record evidence.

## See the first page

In one terminal of the house run:

```bash
php -S localhost:8000 -t public
```

In another terminal:

```bash
curl -i http://localhost:8000/
```

You should get HTTP 200 and a page of the house. Stop the server with `Ctrl+C` when you finish. PHP's built-in server allows this local exercise; the operations unit covers deploying a house.

The initial plugin serves the page and the design system. You have not defined your business yet. The presence of a visible interface and the presence of a domain are different checks.

## Read the tree

| Location | What it decides or keeps |
| --- | --- |
| `bin/coa` | Terminal entry that boots and projects the operations |
| `public/index.php` | HTTP entry of the application |
| `config/boot.php` | Container, root and list of active plugins |
| `config/plugins.php` | Plugin classes the house declares |
| `config/operations.php` | Operation providers adopted from packages |
| `config/app.php` | The house's own configuration |
| `config/http.php` | Operations you choose to expose over HTTP |
| `src/Plugins/` | Implementation of this house's plugins |
| `storage/` and `var/` | State written during operation |
| `.milpa/foundation.json` | The house's constitution, once you found it |
| `.milpa/framework.json` | Provenance of the template and recorded files |
| `vendor/` | Code installed by Composer |

Do not edit `vendor/` to make a change part of your house: the next installation can replace it. If a behaviour must change, identify whether it belongs to the domain, the configuration or a package, and act on that source.

## Ask before acting

The operation that teaches contracts uses the `name` argument:

```bash
php bin/coa operation:contract --name=foundation:found --json
php bin/coa capabilities --json
php bin/coa plugins:list --json
```

The contract shows an operation's input, effects and surfaces. `capabilities` tells what is present apart from what you could adopt. An installation suggestion does not mean that capability already operates. If a command does not exist, go back to the catalogue: some providers do not offer their operations until their dependencies are present.

Many internal names use dots, such as `plugins.list`; the terminal projects them with colons, such as `plugins:list`. Other providers directly declare a name with colons, such as `foundation:found`. In files that name operations, keep the exact name the contract reports.

## Checkpoint

Keep the PHP and template versions, the output of `foundation`, the HTTP code of `/` and a list of three available operations. Explain why the house can respond and still be unfounded. If your output contradicts an example in the course, identify the version and consult the contract instead of guessing arguments.

Continue with [found](02-fundar.md).

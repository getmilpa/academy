[Español](../README.md) · **English**

# Building and founding a Milpa house

This course takes an engineer from a first reading of Milpa to a founded house that operates a domain of its own. By the end you will be able to explain what you decided to build, what stays out, where each responsibility lives and what evidence shows that your operations work. The route uses PHP and Composer; you can follow it without a model provider, an external database or an MCP client.

Milpa organizes an application around capabilities declared as operations. A house has a purpose and authorities; its plugins contribute behaviour; the surfaces present that behaviour to people and tools. These pieces let an agent operate the application, but the human keeps the product decisions and the limits of authority.

The course project is a **workshop that lends tools**, operated sequentially by one person. It registers a tool, checks availability, lends and takes back. It does not handle people, payments, reservations or concurrent loans. We chose a small boundary so that its rules can be demonstrated before adding infrastructure.

> **About this English edition.** It is a translation of the Spanish course. Commands, operation names, paths and quoted output are shown exactly as the house prints them, and the example's code keeps its Spanish identifiers: `herramientas` are tools, `agregar` is to add, `listar` to list, `prestar` to lend, `devolver` to return, and `Prestamos` (loans) is the plugin. The values passed to commands are also left as written.

## Outcome and requirements

You need PHP 8.3 or higher, Composer, Git and GnuPG. Composer checks the extensions the packages require. For SQLite or MySQL you will need their PDO extension when you choose that backend. With the JSON storage the course uses you do not need a database server.

The course was checked with `milpa/framework` 0.55.1 and published dependencies, including `milpa/app-runtime` 0.207.2, `milpa/command` 0.28.0 and `milpa/data` 0.3.2. See [the evidence and the maintenance protocol](mantenimiento.md) to tell the executed route apart from the optional branches. Keep your `composer.lock`: the template and the runtime packages are versioned separately.

## Route

| Unit | Question it answers | What the student delivers |
| --- | --- | --- |
| [00 Understanding Milpa](00-entender-milpa.md) | What problem does it organize, and when does a house fit? | An explanation of the domain and an assessment of fit |
| [01 Create and observe](01-crear-y-observar.md) | What exists before founding? | An installation and a map of its real state |
| [02 Found](02-fundar.md) | What is this house and who decides? | Constitution and founding acta |
| [03 Reading the architecture](03-arquitectura.md) | How does a request reach the domain? | A map of responsibilities and flow |
| [04 Growing the house](04-capacidades-y-plugins.md) | What is the difference between installing, declaring and activating? | An adopted capability and a registered plugin |
| [05 Bounding the domain](05-dominio-y-evidencia.md) | Which claim deserves a test before more code? | Hypothesis, boundaries and rejection cases |
| [06 Implementing operations](06-primer-dominio.md) | How does the domain work without depending on a surface? | Four operations and tests of their rules |
| [07 Governing effects](07-efectos-y-autoridad.md) | What does a call change, and with what authority? | Reviewed contracts and a verified refusal |
| [08 Choosing surfaces](08-superficies.md) | Who can reach each operation? | A protected HTTP read and a CLI TUI MCP map |
| [09 Bringing in an agent](09-agentes.md) | How do you delegate without delegating human authority? | The design of a task and a reading of its pauses |
| [10 Deciding and operating](10-decidir-y-operar.md) | How does a house evolve without forgetting why it exists? | A decision with evidence and an operating plan |
| [11 Building your own house](11-tu-propia-casa.md) | Can you transfer what you learned to another domain? | A house of your own and a final assessment |

Read in order the first time. Each unit includes a checkpoint: if the result changes, keep the output and go back to the operation's contract. Copying a command without recognizing what it authorizes does not complete the exercise.

## How to use the examples

The [complete example](ejemplos/prestamos/README.md) lives in `cursos/casa-milpa/ejemplos/prestamos`, inside the [`getmilpa/academy`](https://github.com/getmilpa/academy) repository. It is teaching material: **it is not loaded when the template boots**. You will copy it explicitly into the house you create in unit 06. That way Milpa's starting point stays small and the domain belongs to the student's house.

Commands with `--sign` authorize one specific call with your key. Reads do not need it. The lab commands that show keys or tokens use the student's own values; there are no shared credentials in this repository.

At the end, see the [glossary and references](referencias.md). For the immediate use of an operation, the contract your own house returns is more precise than an example that belongs to another version.

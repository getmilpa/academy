[Español](../10-decidir-y-operar.md) · **English**

# Deciding and operating a house that evolves

**Outcome:** you will record a decision with limits of evidence and tell package updates apart from template updates.

## Doctrine that can be checked

Doctrine guides who decides, what must be explained and which claims must be sustained with evidence. Its operational value appears when a condition is not met and a real mechanism rejects the step. A title of "governed" or a file of rules does not demonstrate that mechanism.

Three habits make it possible to keep that difference: formulating a question that changes the order of construction, testing a small claim and interpreting the close according to what was actually observed. If the evidence only shows sequential calls, do not conclude that the domain handles concurrency. If the test only observes the service, do not conclude that HTTP requires the correct scope.

The public contracts you can extend as an application are operations and their effects. Gate, foundation and session history are pieces of the substrate with their own responsibilities. There is no generic public contract for any plugin to declare a new gate of the floor. For a policy of your domain, use its defined integration points and test the entries that enforce it.

## Recording a decision

Keep the house's decisions under `.milpa/decisions/` and their evidence under `.milpa/evidence/`. Follow the existing numbering after the acta. You can create a file such as `0002-disponibilidad-secuencial.md` with this structure:

```markdown
# Sequential availability in the first workshop

Status: accepted by the human product authority

Question: does a tool keep its availability and reject a second loan?

Context: the first workshop is operated by one person, with sequential calls.

Decision: use the operations agregar, listar, prestar and devolver; local file persistence.

Boundaries: no people, payments, reservations or concurrent loans.

Evidence: service tests, CLI across processes and HTTP 401 403 200 test.

Consequence: before accepting concurrency we need a tested atomic transition.

Open question: does the next real use require multiple simultaneous operators?
```

This is a readable record of the house, **not the input format of the `milpa/governance` engine**. Write author, date, commands and concrete references to the evidence. An empty file or the name of a test that was not run does not sustain the decision.

For an amendment of purpose or boundaries, record what changes and why, keep the initial acta and review the parts that enforce the change. Do not found again to overwrite what came before. If a new decision replaces another, keep both documents and the relationship between them.

## When to adopt the governance engine

`milpa/governance` is a specialized capability that validates and compiles a corpus of decisions and a profile. It is a pure engine: it receives objects; it does not by itself read all the files of a house. The host must provide a governance repository and integrate its verifications into the chosen flow.

An adoption can begin with `composer require milpa/governance`, but that installation does not automatically connect the product's enforcement. The package uses its format of ADRs and profile under `.milpa/governance/`, and offers `GovernanceValidator`, `GovernanceCompiler` and `GovernanceRepositoryInterface`. Follow its [README](https://github.com/getmilpa/governance/blob/main/README.md) and test the real integration before declaring it active.

The validator checks references, substitutions and gates declared as enforced against admitted mechanisms. An admitted `boundTo` proves the validity of the declaration under that contract; the host must still execute the mechanism it cites. An integration test that breaks the condition and observes the rejection closes that claim.

You do not need this engine to finish the workshop. The freshly founded house already has a constitution; a more complex administration is adopted when the question and the evidence justify it.

## Observing the operation

Before diagnosing, ask about the state:

```bash
php bin/coa house:start --json
php bin/coa house:context --json
php bin/coa routes:list --json
php bin/coa stack --json
php bin/coa plugins:list --json
```

`stack` describes services the plugins declared and their observed availability; it does not start containers just because someone opened the page. An empty listing means there are no declarations in that catalogue, not that you checked the absence of every possible dependency in your code.

If an operation disappears, review the package present, the declared provider, the active plugin and the admitted surface. If HTTP returns 401 or 403, review identity and scope; if it fails at boot with a protected operation, review the connected policy. If it returns 428 for an unclassified read, review its effect profile. If the domain returns `ya_prestada`, a business rule is working: it is not an authentication fault.

With `milpa/devtools`, `doctor` contributes a diagnosis. The contracts report the arguments and the evidence of other tools such as repair or validation. Do not run every repair blindly or interpret a catalogue that boots as proof of connectivity to a remote database.

## Updating packages and birth files

The packages under `vendor/` are updated through Composer. Review contract changes, run the tests and keep the lock. Preview the resolution with Composer:

```bash
composer update --dry-run
```

The files copied by `composer create-project` are not replaced just by updating a package. For them the house keeps provenance:

```bash
php bin/coa framework:provenance --json
php bin/coa framework:diff --json
php bin/coa operation:contract --name=framework:apply --json
```

`framework:diff` can consult the registry to compare versions and does not write changes. Review which files remain original and which you customized. Applying a new template avoids overwriting customizations and declares effects on the executable; decide the version and the specific application after reviewing the diff. Keep a verifiable backup and test the boot and the domain afterwards.

## Before serving a real use

A lab workshop does not demonstrate a multi-user operation. To serve that use, define per-resource access, an atomic transition if there is concurrency, an audit of facts, backups and tested restoration. Configure the web server and PHP for the environment, TLS when there are credentials over the network, a durable location for data and secrets outside the public tree. Those decisions come from concrete requirements of the use you accept.

Also test what happens with a dependency that is down. Listing the catalogue must remain available if it does not require that dependency. A route that does need it must return an understandable failure and record the cause without exposing secrets. "The process booted" and "the domain is ready to serve" are different pieces of evidence.

## Checkpoint

Deliver a decision with evidence, an open question and a brief recovery plan. Demonstrate that you can tell a runtime update apart from a template update. For backups, an existing copy is not enough: restore to another location and read the expected state.

Continue with [building your own house](11-tu-propia-casa.md).

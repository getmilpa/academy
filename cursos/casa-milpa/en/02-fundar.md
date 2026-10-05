[Español](../02-fundar.md) · **English**

# Founding the house and declaring its authorities

**Outcome:** your house will have a domain, an objective, boundaries and an acta that lets the founding decision be read.

## Decide before writing

The foundation answers what exists here and who decides about it. For the exercise:

- Domain: lending tools.
- Objective: register tools and operate their availability in a local workshop.
- Boundaries: no payments, no personal data and no concurrent loans.
- Authorities: human for product and destructive changes.

The boundaries reduce the first claim you must prove. They keep an availability exercise from also becoming an application for people, reservations or billing. Later you will be able to revise a boundary with a decision and evidence; founding does not prevent evolving.

## Identity for write calls

The terminal door of the checked version requires a signed call for changes that last, or a continuation with a live authorization from its sequence. Being at a terminal does not by itself constitute that authorization. A signature identifies who authorized **this call**, with its operation and arguments.

Look up your keys:

```bash
gpg --list-secret-keys --keyid-format long
```

If you do not have a signing key yet, create one with your identity and follow GnuPG's dialogue to protect it:

```bash
gpg --quick-gen-key 'Tu Nombre <tu-correo@ejemplo.com>' ed25519 sign never
```

If you have several keys, select your signing key as `default-key` in the GnuPG configuration that corresponds to your keyring, keeping the existing options. Use the full fingerprint that `gpg --list-secret-keys` returns. A key visible with `--list-secret-keys` is not always the one the default selection will choose.

`GNUPGHOME` lets you use a separate keyring. If you use it, the process that runs `coa` must receive the same value. A `No secret key` error is resolved by checking the selected key, its signing capability and the effective keyring. It is not resolved by lending your human key to an agent.

## Preview and found

Read the contract and run the preview first:

```bash
php bin/coa operation:contract --name=foundation:found --json
php bin/coa foundation:found \
  --domain='Préstamos de herramientas' \
  --objective='Registrar herramientas y operar su disponibilidad en un taller local' \
  --boundaries='["Sin pagos","Sin datos personales","Sin préstamos concurrentes"]' \
  --dry-run --json
```

The preview reports what it would write: the constitution and the acta. It must not turn the house into a founded one. Ask `foundation` again if you want to check.

When that data describes your decision, make the call:

```bash
php bin/coa foundation:found \
  --domain='Préstamos de herramientas' \
  --objective='Registrar herramientas y operar su disponibilidad en un taller local' \
  --boundaries='["Sin pagos","Sin datos personales","Sin préstamos concurrentes"]' \
  --sign --json
php bin/coa foundation --json
```

GnuPG may ask for your key's passphrase. `--sign` authorizes what you are invoking; it does not grant a general authorization for other operations. The terminal output may include an authorization line in addition to the JSON. An automated consumer must handle those channels and not assume that all the combined output is a single JSON object.

## Read what was left

You will find `.milpa/foundation.json`, with schema `milpa.foundation/v1`, domain, objective, boundaries, authorities and date, and an acta under `.milpa/decisions/`. In a freshly created house it will be `0001-fundacion.md`. The date is recorded in UTC: it may correspond to the next day relative to your local time.

In this schema the forms of authority the foundation accepts are human; do not invent values such as `agent` or `committee` because they sound suitable. The default authorities include `product` and `destructive_changes`. A plugin may have its own roles or permissions, but that does not alter this file's contract.

The foundation reader tells apart absence or placeholder, invalid data and a schema it cannot interpret. It does not confuse any of those states with a founded house. `foundation:found` is a one-time rite and rejects a second founding. To evolve, write an amendment decision; do not use the rite again or delete the history so that it accepts.

## A declaration needs an implementation

Writing `Sin pagos` records a boundary. It does not automatically analyse every handler to guarantee that none charges. The house must avoid adopting capabilities and inputs that contradict that boundary, and its tests must demonstrate the restrictions it implemented.

The signature does not prove that the code is correct either, or that a key has any product authority. Identity, authorization, contract and evidence are related pieces that answer different questions. In units 07 and 09 you will learn to read them together without confusing them.

## Checkpoint

The output of `foundation` must show `founded: true`. Read the acta, compare the objective with what you authorized and keep the diff of the files written. Formulate a test that enforces a boundary: for example, the domain will not accept an empty name and will not store a borrower because personal data is out of scope.

Continue with [the architecture](03-arquitectura.md).

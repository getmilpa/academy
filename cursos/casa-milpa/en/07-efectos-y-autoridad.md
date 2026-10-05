[Español](../07-efectos-y-autoridad.md) · **English**

# Governing effects and authority

**Outcome:** you will be able to review an operation's ceiling and tell identity, permissions, consent and intent apart.

## What a call can do

`mutating` reports whether an operation modifies. It does not report whether it writes local data, changes code or sends information to third parties. The effect profile declares the reasonable worst case for that operation; not only the typical path it suits you to show.

| Axis | Question | Workshop example |
| --- | --- | --- |
| `mutation` | What change lasts? | A loan writes persistent state |
| `externality` | Whom does it reach outside here? | The exercise does not communicate with third parties |
| `reversibility` | What recovery is proven? | Manual recovery, with no promise of guaranteed rollback |
| `authority` | Whose authority does it spend? | The write acts on behalf of the operator |
| `subject` | What is the change made of? | Tool data, not executables |

In the example, `Persistent`, `None`, `ManualRecovery`, `WriteAsUser` and `Data` describe the writes. `EffectProfile::readOnly()` classifies the read. Returning a tool has its own meaning; we do not declare it as a universal rollback of any loan because that would require another contract and other evidence.

`Guaranteed` needs a `rollbackContract` and a recovery that has actually been tested. A read uses `NotApplicable`: no effect occurred that needs reverting. If the future handler sends notifications, its externality will no longer be `None`; if it installs code, the subject will no longer be `Data`.

## The unknown does not reduce controls

An operation without `effects` carries an unclassified profile, with the ceiling of every axis. It is not interpreted as harmless because `mutating` is `false`. Declaring `mutating=true` together with `Mutation::None` is rejected by the constructor; there are not two compatible versions of that fact.

When profiles are combined, the ceiling keeps the highest level of each axis. A high risk does not disappear by averaging it with a read. A reduction of the ceiling requires the mechanism and the evidence its producer admits; adding `dry_run` to the schema does not automatically prove that nothing changes. Only call `--dry-run` on operations whose contract offers it and whose implementation enforces it. The course's domain does not offer that flag.

## Identity permissions consent and intent

**Identity** says who presents the call. The **authorization policy** decides whether that identity may use the capability. **Scopes** or a **semantic permission** declare what that policy must judge. **Consent** satisfies a specific demand for authorization for effects that require it. **Intent** asks whether the operation and the target correspond to what the human asked for.

Having a write scope does not prove that the human asked to lend tool 7. Having the intent does not hand over a scope the caller does not have. A signature binds an authorization to a call, but it does not make a business precondition true. If the tool is already lent, the service must reject it even when the caller has all the authority needed.

`namedTarget: 'id'` tells a session's floor that the selection of an existing tool must be named in the human's request. It is not an SQL filter or a validation of who owns the object. If your domain requires that a person only operate their own tools, implement a per-resource policy in addition to the global scope.

## The terminal door

The checked runtime prevents an unsigned call from producing persistent changes. The behaviour observed was:

```bash
php bin/coa herramientas:agregar --nombre='Sin autorización' --json
# Unsigned call rejected; it does not create a tool.
php bin/coa herramientas:listar --json
```

Run the authorized write with `--sign`. Some sequences can continue with their signed receipt while it is still live; do not generalize that receipt to any command. Consult the contract and the state of the sequence you are actually continuing.

There is also a demand for consent that belongs to the contract itself, for example `requiresConfirmation` or privileged changes to the executable. The surface doors and the session floor add conditions on the caller and the invocation. That is why reading only `requiresConfirmation=false` does not allow you to conclude that a terminal write is free.

## Practical review

```bash
php bin/coa operation:contract --name=herramientas:listar --json
php bin/coa operation:contract --name=herramientas:prestar --json
php bin/coa operation:contract --name=capabilities:enable --json
```

Compare the effect of reading tools with that of adopting an executable package. Verify surfaces, scopes, named target and evidence. Look in the code for the actions that justify each classification. The contract makes possible a review another person can refute; it is not an infallible detector of what a handler does.

## Checkpoint

Keep a rejected unsigned write call and the subsequent read that demonstrates the absence of change. Then run the signed call. Explain why the signature must not allow a second loan and why an agent's automatic mode cannot manufacture your consent.

Continue with [choosing surfaces](08-superficies.md).

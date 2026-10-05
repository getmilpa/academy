[Español](../mantenimiento.md) · **English**

# Evidence and maintenance of the course

This file makes it possible to review what was checked, what was left out and how to repeat the check when Milpa or the examples change. The author's execution demonstrates a reproducible technical route; assessing a new student's understanding also requires the transfer test of unit 11.

## The question that ordered the construction

**Before:** the first intention was to write the syllabus and then produce exercises.

**Architectural question:** can a newly arrived engineer found a house and execute their first domain operation by following the documentation?

**Excessive claim:** a written course proves by itself human understanding, operation in production and mastery of the whole family of packages.

**Refutable slice:** a new installation, a real founding, adoption of persistence, a domain plugin and a transition with a verifiable rejection. If the route demands unknown arguments or cannot boot, the technical hypothesis fails before the syllabus is extended.

**Observable evidence:** founding state, files and acta, registered plugin, invariant tests, persistence between processes and access refusals.

**Outside the slice:** publication, model calls, concurrency, all external integrations and an assessment with new participants.

**After:** the first move changed to walking through a new installation. That walk made it possible to correct the documentation around signatures, registration, effects and exposure before presenting the complete course. The assessment with a new student remains as the next measurement of adoption.

## Checked environment

Check carried out on 4 October 2026, Mexico City time. The lab's acta was dated in UTC on 5 October; both dates correspond to the same execution.

| Component | Version |
| --- | --- |
| PHP | 8.3.35 |
| Composer | 2.10.3 |
| GnuPG | 2.4.9 |
| Template `milpa/framework` | 0.55.1 |
| `milpa/app-runtime` | 0.207.2 |
| `milpa/command` | 0.28.0 |
| `milpa/console` | 0.24.0 |
| `milpa/data` | 0.3.2 |
| `milpa/devtools` | 0.41.1 |
| `milpa/auth` | 0.11.0 |
| `milpa/mcp-server` | 0.7.0 |
| PHPUnit | 11.5.56 |
| PHPStan | 2.2.17 |

The lab's packages were Composer distributions, without symlinks to sibling repositories. The lab signature used a temporary keyring of its own, without modifying the user's keys. The HTTP tokens were revoked at the end; the evidence keeps results, not secrets.

## Observed results

| Route | Result |
| --- | --- |
| `composer create-project` | Installation and provenance stamp completed |
| Initial `house:start` and `foundation` | A house that boots and an absent foundation |
| Founding preview | Names constitution and acta without founding |
| Signed founding | `founded=true`, constitution and acta written |
| `capabilities:enable milpa/data` | Persistence installed without an additional provider |
| Optional CRUD generator | Five files generated and shape verification; separate registration |
| Registering a plugin with incomplete metadata | Rejection without writing the declaration; fix validated afterwards |
| Registering the final `Prestamos` plugin | The house boots and contributes four operations |
| Service tests | Three tests and 15 assertions pass |
| Static analysis of the plugin and the tests | No errors at the house's level 6 |
| Unsigned addition | Rejected; collection without the proposed tool |
| Signed addition, loan and return | Expected state across different executions |
| Second loan | `ya_prestada`, CLI code 1, state keeps the loan |
| HTTP without identity | 401 |
| HTTP with a foreign scope | 403 |
| HTTP with `herramientas:read` | 200 and the domain's collection |
| `shell` screen without TTY | Shows the catalogue and ends |
| MCP initialize and tools/list | Handshake and four tools of the domain |
| MCP tools/call for a read | Returns the same collection of the house |
| MCP write without presented authority | `isError=true`; subsequent read keeps the state |

MCP answered with protocol version `2025-06-18`; the checking client sent the initialization and kept the pipe open for each response. An earlier test that closed STDIN immediately produced a process exit without responses, so it was not counted as a successful handshake.

The lab's initial founding route used an objective of checking availability and two boundaries. The course's edition also makes the sequential boundary explicit and extends the objective to operating availability. Those are input values, not schema changes. A second new house repeated the complete editorial command: the preview left the house unfounded and the signed call wrote this edition's values. In it, copy, registration, three tests, static analysis and the sequence of addition, unsigned refusal, loan, duplicate rejection and return were repeated.

That repetition corrected two instructions before the close: `plugins:register` does not declare `dry_run`, and the catalogue of the installed `milpa/devtools` does not offer `update`. The course consults the registration contract and uses `composer update --dry-run` to preview dependencies. It also keeps the exact name of each operation instead of assuming that all providers use internal dots.

The template's complete suite with the lab's capabilities ran 195 tests and 653 assertions, with no failures or errors, with 43 skips for optional branches or conditions that did not apply and one PHP warning. The warning comes from `ApplicationTest::testWhenTheGraphDoesNotCloseTheDoctorPrintsTheLearnableError`, which provokes a boot with `config/boot.php` absent; it was recorded as a condition of the existing test, not as an execution completely free of warnings. The example's own three tests had no warnings or skips.

## Protocol for a new edition

1. Create a house in a new directory from the version of the template you are going to document. Keep the lock and the versions.
2. Follow units 01 and 02 exactly, with a keyring appropriate for that lab and the founding values written in the course. Check the absence of writing in the preview.
3. Adopt `milpa/data`, copy the example files and run their tests. Register the plugin through the governed path.
4. Run addition, loan, duplicate rejection and return, reading from another process. Check the unsigned rejection before the signed addition.
5. Run static analysis and the family's code standard on the example's files.
6. Adopt auth, expose only the read and run the HTTP 401 403 200 matrix. Revoke the test credentials.
7. If you verify MCP, keep the pipe and check responses, not only process output. Test a read and a write refusal.
8. Review all local links and the commands against the installed contracts. Keep the examples out of the template's boot plugins.
9. Record failures, argument changes and version differences. Rewrite the teaching that depends on them.
10. Give the route to a person who does not know Milpa and record where they ask for help; adjust the course with that evidence.

## Coverage that remains open

The edition does not demonstrate execution of model providers, promotion of a sandbox with an agent, the passkey ceremony, compilation of the governance engine, migration between backends, restoration in production or concurrency of loans. The corresponding units explain contracts and decisions and point out when to obtain additional evidence.

The domain code is a limited exercise. Do not adopt a guarantee of concurrency or of audit because a sequential test passed. To expand the course, choose an open question and its refutable test before adding another catalogue of capabilities.

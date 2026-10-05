[Español](../referencias.md) · **English**

# Glossary and references of the course

## Vocabulary

| Term | Meaning in this route |
| --- | --- |
| House | The concrete application you create with Milpa and found for a domain |
| Domain | The problem, vocabulary and rules the house serves |
| Foundation | The explicit constitution that declares domain, objective, boundaries and authorities |
| Acta | The record of the founding decision |
| Capability | Behaviour or infrastructure the house can adopt |
| Package | Code distributed by Composer; it can contribute contracts, providers or plugins |
| Plugin | A component with a lifecycle that the house declares and activates |
| Provider | An implementation of `CommandProvider` that returns operations |
| Operation | A declared unit of capability with handler, input and additional contracts |
| Handler | A callable that receives the input and produces the result of an operation |
| Surface | A way of presenting and invoking capabilities, such as CLI, TUI, MCP or HTTP |
| Effect profile | The declared ceiling of mutation, externality, reversibility, authority and subject |
| Subject | What the change is made of: data, configuration or executables, among other levels |
| Scope | The reach a policy uses to judge an identity |
| Intent | The relationship between what the human asked for and a specific call |
| Consent | A specific authorization that satisfies a demand under its proof and reach |
| Gate | A mechanism of the substrate that holds a step until it meets conditions |
| Session | An agent's work whose state is kept from recorded facts |
| Trial workspace | A test work space whose changes have not yet been adopted into the house |
| ADR | A record of an architectural decision and its reasons and consequences |
| Evidence | An observable result that supports a claim and lets its limits be reviewed |
| Slice | A small route that can refute a specific hypothesis |
| Port | A contract that separates the domain from an implementation of persistence or integration |

## Sources and responsibilities

The course was prepared by reading the documentation and the code of Milpa's local repositories and checking the main route with published packages. The following links identify their public sources; their branches may evolve after the checked edition.

| Topic | Source |
| --- | --- |
| Starting point and limits of extension | [framework README](https://github.com/getmilpa/framework/blob/main/README.md) |
| Versions and changes of the template | [framework CHANGELOG](https://github.com/getmilpa/framework/blob/main/CHANGELOG.md) |
| Contributing documentation and preserving the boot | [CONTRIBUTING](https://github.com/getmilpa/framework/blob/main/CONTRIBUTING.md) |
| Origin story and design philosophy | [Design system's constitution](https://github.com/getmilpa/milpa-design/blob/main/DESIGN.md) |
| Common contracts | [milpa/core](https://github.com/getmilpa/core/blob/main/README.md) |
| Operation and effect profile | [milpa/command](https://github.com/getmilpa/command/blob/main/README.md) |
| Projections and consent | [milpa/console](https://github.com/getmilpa/console/blob/main/README.md) |
| Kernel and configuration | [milpa/runtime](https://github.com/getmilpa/runtime/blob/main/README.md) |
| Activation and lifecycle | [milpa/plugin](https://github.com/getmilpa/plugin/blob/main/README.md) |
| The house's capabilities and sessions | [milpa/app-runtime](https://github.com/getmilpa/app-runtime/blob/main/README.md) |
| Entities and repositories | [milpa/data](https://github.com/getmilpa/data/blob/main/README.md) |
| Identity and HTTP policies | [milpa/auth](https://github.com/getmilpa/auth/blob/main/README.md) |
| MCP transport | [milpa/mcp-server](https://github.com/getmilpa/mcp-server/blob/main/README.md) |
| Governing the agent | [milpa/agent](https://github.com/getmilpa/agent/blob/main/README.md) |
| Communication with models | [milpa/ai-gateway](https://github.com/getmilpa/ai-gateway/blob/main/README.md) |
| Governance engine | [milpa/governance](https://github.com/getmilpa/governance/blob/main/README.md) |

## Reading the implementation from an installed house

These locations belong to the checked structure; verify that they exist in your version. They are reading points, not files to customize inside `vendor/`.

| Question | Location |
| --- | --- |
| What does the foundation validate? | `vendor/milpa/app-runtime/src/Support/Foundation.php` |
| What does the rite accept? | `vendor/milpa/app-runtime/src/Operations/FoundationOperations.php` |
| What does an operation declare? | `vendor/milpa/command/src/Operation.php` |
| How is the ceiling represented? | `vendor/milpa/command/src/Effect/EffectProfile.php` |
| What does consent require in the contract? | `vendor/milpa/console/src/Consent.php` |
| What does the local door do without a signature? | `vendor/milpa/app-runtime/src/Console/UnsignedTerminal.php` |
| Who connects policies and Bearer? | `src/Http/IdentityWiring.php` |
| How does identity reach HTTP? | `src/Http/IdentityChain.php` |
| What is exposed over HTTP? | `src/Plugins/OperationsHttpPlugin/OperationsHttpPlugin.php` and `config/http.php` |
| What does a basic repository guarantee? | `vendor/milpa/data/src/RepositoryInterface.php` |
| What does a session declare and accept? | `vendor/milpa/app-runtime/src/Operations/SessionOperations.php` |

When an old guide and your house differ, consult the contract and the code of the installed version, keep the evidence and review whether you should update. Do not mix arguments from one edition, declarations from another and a result from a third without recording that difference.

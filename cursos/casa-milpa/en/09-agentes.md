[Español](../09-agentes.md) · **English**

# Bringing in an agent without delegating human authority

**Outcome:** you will understand what can be delegated, how a session is governed and how to read its pauses. Running a model is an optional branch of the course.

## A house can operate without a model

The workshop's rules, its operations and its tests do not need generative intelligence. The agent adds the possibility of interpreting a request and choosing tools from the catalogue. It does not replace the service or make correct a transition its tests refuted.

`milpa/ai-gateway` contributes the communication and the model ↔ tools cycle; `milpa/agent` contributes sessions and their governing mechanisms. Before adopting, ask what specific task justifies the agent: checking availability and explaining the result is more precise than "making the workshop intelligent".

```bash
php bin/coa capabilities:enable milpa/ai-gateway --dry-run --json
php bin/coa capabilities:enable milpa/ai-gateway --sign --json
php bin/coa capabilities:enable milpa/agent --dry-run --json
php bin/coa capabilities:enable milpa/agent --sign --json
php bin/coa house:start --json
php bin/coa agent:catalogue --json
```

The last command lets you read what the agent would receive. The human's catalogue must not be confused with the model's: some operations that govern sessions are filtered out. Their existence in CLI does not imply that the agent can call them.

## Configuring the provider you chose

The choice of a provider determines where the inputs go and which service charges for the work. Follow the configuration the installed version documents. The runtime recognizes variables such as `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` for those providers, and an OpenAI-compatible endpoint through `MILPA_AGENT_BASE_URL`, `MILPA_AGENT_MODEL` and, when needed, `MILPA_AGENT_API_KEY`.

For an endpoint of your own, use its root without adding `/v1` if this runtime requires it that way. The declared endpoint takes priority over provider keys that are present; it receives the specific key of `MILPA_AGENT_API_KEY`, not someone else's key by coincidence of protocol. Credentials are configured outside versioned files.

Consult `agent:model` and the contract of the available operations to observe what is declared. A model declaration does not prove that the external service responds. The evidence of this edition of the course does not include a model execution or billable calls.

When you have deliberately configured the provider, a first bounded request would be:

```bash
php bin/coa agent \
  'Consulta las herramientas del taller y explica cuáles están disponibles. No modifiques el inventario.' \
  --sign
```

Starting a session can leave state and is subject to authorization. If packages, identity or provider are missing, the house must say what is missing. A plausible text is not to be interpreted as proof that it consulted the domain. Read which tools it executed and what results it received.

## What authority each actor keeps

The human decides purpose, product, boundaries and destructive changes. The model interprets how to materialize an objective within what is permitted. The runtime applies the conditions of the floor and the session's permissions. A second opinion, when configured, can reject a call that exceeds what was asked; it does not replace the floor that cannot be bypassed.

`auto` mode does not authorize every effect in advance or remove the demand for a signature. Intent is evaluated before the policy that decides how much autonomy a call admits. "Presta la herramienta vieja" (lend the old tool) does not name an existing id; if the operation requires `namedTarget`, that ambiguity must be resolved before operating. A specific authorization does not give permission to affect another tool either.

`agent:answer` and `agent:mode` let the human govern the session and are excluded from the catalogue the agent itself receives. A tool that lets it answer its own pauses would turn authority into a choice of the governed.

## Reading and attending to a pause

With a session created:

```bash
php bin/coa agent:sessions --json
php bin/coa agent:show --session='ID_REAL' --json
php bin/coa operation:contract --name=agent:answer --json
```

Get the id from the list; do not deduce it from a title. Read the proposed operation, its arguments and the question that stopped the work. Answer through the authorized channel with the intent you actually hold. The contract may offer an answer, a counter-proposal or an effects envelope; they do not mean the same thing. A counter-proposal asks for another proposal and does not grant consent to the previous one.

`agent:answer` records an answer; its description says it does not by itself resume the loop. Consult the contract of `agent` for the continuation with a session that your version admits. Before continuing, check state, id and pending question. An ordinary "yes" does not always satisfy a demand for authorization with verifiable proof; read the refusal the floor actually returns.

The history records facts of a session. Reading a proposed argument or a stored result does not prove that the change was accepted or promoted. To claim that a tool was lent, also read the domain's state and the evidence of execution.

## The resident's identity and confined work

A resident agent uses its own key and a separate keyring. The house can give it a seat through `identity:seat`; the invitation produces the command its key must accept with `identity:accept`. The human who seats it and the effective scopes are identified. Do not copy your secret key to the agent or use the human signature as the resident's permanent identity.

Development operations can write to a trial workspace during a governed session. A copy limits the files affected; it does not automatically isolate the network or eliminate effects on third parties. Read `sandbox:list`, inspect the changes and consult `sandbox:promote` before adopting them. Promotion is a governed operation of its own. A green test in the trial and an accepted promotion are two facts you must observe.

The course does not require adopting general filesystem or shell tools. If you need them, their adoption is another decision about capabilities and effects, with a surface of authority different from listing tools.

## Checkpoint

Without a model, deliver the design of a task with objective, permitted tools, expected refusals and closing evidence. If you run the optional branch, also deliver the session, real calls and resulting state. Do not present a model's explanation as sufficient evidence of a mutation.

Continue with [deciding and operating](10-decidir-y-operar.md).

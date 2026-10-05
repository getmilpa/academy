[Español](../11-tu-propia-casa.md) · **English**

# Building your own house and closing the route

**Outcome:** you will transfer the method to a new domain, and another person will be able to assess what you built.

## Choosing a small domain

Choose a problem you can describe with a vocabulary of its own and a visible transition. For example, a task list that lets a pending one be completed, an inventory that records an entry or a personal library that marks a book as read. Avoid using the workshop as a template where only the names change: the rule must correspond to the new domain.

Define who operates, what must last and a boundary that keeps the first route checkable. If you need multiple operators from the first day, that concurrency moves into the first slice; do not inherit the workshop's sequential implementation and declare that you solved it.

## Transfer route

1. Write your first intention of construction and the question that could reorder it.
2. Create a new house with Composer and record versions and the unfounded state.
3. Found with your domain, objective, boundaries and human authority. Read the acta.
4. Adopt only the capabilities needed and review the declared changes.
5. Implement an entity and a service with at least one rule and one observable rejection.
6. Declare two or more operations, with suitable schemas, effects and restrictions.
7. Register the plugin and check catalogue, execution and persistence between processes.
8. Check that an unauthorized call does not change data.
9. If you expose HTTP, test absent identity, wrong scope and permitted access.
10. Record a decision and evidence. Close the claim you tested and keep what is deferred.

The example's files show one way of connecting pieces; they are not a generator for any business. You can replace the repository with a specific port, add per-resource policies or design another error model when your question requires it. Keep the separation between declaration of capabilities, rules and surfaces.

## Final assessment

| Criterion | Minimum evidence | Not enough |
| --- | --- | --- |
| Identity of the house | A founded foundation and an acta coherent with the purpose | A folder that boots |
| Boundaries | Restrictions visible in code and in pertinent tests | Only a list in prose |
| Architecture | An explanation of entry, handler, domain and persistence | A diagram not related to files |
| Capabilities | Diff of adoptions, providers and active plugins | Code installed in `vendor/` |
| Domain rule | A permitted case and a violation rejected without undue change | Only the happy path |
| Persistence | A read from a new process or instance | In-memory state of the first process |
| Effects | Explicit contracts that agree with the actions | `mutating=false` used as a generic guarantee |
| Authority | An observable refusal and an authorized positive control | A signature without checking the result |
| Network surface if there is one | A chosen exposure and a 401 403 200 test | A public endpoint that returns data |
| Evolution | Decision, evidence and open question | A close that promises more than was measured |

The agent branch is assessed separately: chosen provider, the actor's own identity, available catalogue, real calls and evidence of the final state. Completing the domain house does not require consuming a model or installing all of Milpa's capabilities.

## Handover to another engineer

Include a README of your house that answers what it does, what stays out, how to install it, how to found it if it is not yet founded, which operations to use and where its data is. Add a command to run the tests and describe what each group guarantees. Do not distribute keys or tokens with the example.

Ask another person to follow the route from a new checkout. Record the first point where they need an outside explanation. That observation measures whether your documentation serves a newcomer; the author completing their own commands only proves one part.

Your close can say: "The house registers and completes tasks sequentially; the tests check that an absent task is rejected and the state lasts between processes. We have not tested concurrency". That claim allows a concrete assessment and guides the next piece of work.

## Questions to check understanding

- What changed on founding, and what is still the domain's responsibility?
- What tells an installed package apart from a plugin that boots?
- Which part of the flow must reject a business rule, and which part a caller without scope?
- What effect would a controller have that freely edits the state protected by your operations?
- Why can a read without classified effects ask for more controls?
- What changes when you update `vendor/`, and what does not change in the copied template?
- What evidence is missing to make the next claim about your product?

You can answer them by pointing to files, contracts and results. When another engineer can reconstruct that reasoning and operate your domain, the route will have achieved its purpose.

See [the glossary and the sources](referencias.md) and [the evidence of this edition](mantenimiento.md).

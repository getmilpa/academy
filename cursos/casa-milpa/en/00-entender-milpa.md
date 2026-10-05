[Español](../00-entender-milpa.md) · **English**

# Understanding Milpa before installing

**Outcome:** you will be able to explain what a house is for, how it relates to the Milpa family and which problems you must solve in your own domain.

## From an internal need to a family of tools

Milpa grew out of TeamX's work and the need to understand, repair and evolve its own systems. Its name refers to a way of farming in which different species live together; the vocabulary of house, tools, capabilities and growth expresses a relationship with software that can be cared for and understood. The coa gives its name to the terminal you work the house with.

The [design system's constitution](https://github.com/getmilpa/milpa-design/blob/main/DESIGN.md) relates that idea to Rodrigo Vicente's experience planting grafts in Oaxaca and to the lesson of learning to repair what is your own. That story helps to read the project's intent: preserving an understandable structure and leaving room for extensions. It is not a technical specification or a guarantee of what each version does.

The technical evolution visible in the repositories separated the central contracts from their implementations, extracted packages an application can adopt and turned `milpa/framework` into a Composer starting point. Day-to-day work no longer needs to copy a whole internal system: a house adopts the packages its domain requires. The packages have their own versions and dependencies; the template keeps the boot and the application's initial decisions.

The current architecture puts an `Operation` as the public unit of capability. It is declared once and projected to different surfaces. This lets an engineer, a terminal interface or a tool client discover the same behaviour. What is actually available depends on the packages present, the active plugins and the limits the house declares.

## House domain and capability

A **house** is a concrete application built with Milpa. It has a file root, configuration, plugins and a purpose. A freshly created installation can boot before it is founded; that boot shows technical life, not a product decision.

The **domain** is the problem the house commits to serving. In the workshop we talk about tools, availability, lending and returning. Those words should guide the code and its tests. Milpa does not know by itself when a tool can be lent: the domain implements that rule.

A **capability** is something the house can do. `milpa/data` contributes persistence; a workshop plugin contributes the capability to lend. A **plugin** has a lifecycle and can contribute operations, routes or other integrations. A package can contribute contracts or providers without being a plugin that boots. Confusing the two leads to assuming that installing code put it to work.

An **operation** declares a name, description, input and handler, along with effects and restrictions. `herramientas.prestar` tells what can be invoked; the lending service executes the transition; a surface presents it as a command or a tool. The catalogue is derived from what the house contributes, not from a list of commands written separately.

## The questions it organizes

| Question | Piece that helps answer it | Responsibility the house keeps |
| --- | --- | --- |
| What are we and what stays out? | Foundation and acta | Defining the purpose and enforcing the boundaries |
| What can we do now? | Catalogue of operations and capabilities | Adopting and reviewing code appropriate to the domain |
| What runs at boot? | Plugin configuration and activation | Reviewing the declarations and the dependencies |
| Who can execute a call? | Identity, policies and consent | Connecting the policies to each relevant entry |
| What can change? | Effect profile | Declaring it honestly and verifying the behaviour |
| Why did we change something? | Decisions and evidence | Keeping the reasoning and its limits |

The philosophy becomes useful when it changes a verifiable behaviour. If a read declares unknown effects, the system may demand controls that read does not need. If a loan has no rejection test, its invariant is still a promise. If a boundary appears in the constitution but a controller offers a path around it, the house does not enforce it yet.

## Fit and boundaries

Milpa is a good starting point when you want to make an application's capabilities explicit, extend it through plugins and operate it from several surfaces. It also serves to build a house an agent can discover and operate under rules of authority.

The starting point does not offer every element of any product. Your domain may need transactions, complex relations, queues, long-running processes, continuous flows or a specialized visual experience. Those needs deserve their own design and integration. The basic repositories of `milpa/data` are not a relational ORM or a transactional port. The execution signals of operations do not automatically turn your business data into an event-sourced system.

The vision of an extensible family allows capabilities to be incorporated gradually. Ideas such as networks of houses, Stations or capability markets should be read with their documented status; they are not requirements or features needed to finish this course. The evidence of this route will be a local house that persists and governs a small domain.

## Checkpoint

Write a paragraph with the domain you want to serve and three actions that mean something to its users. Then name one need Milpa contributes and another you must design yourself. For the workshop, a sufficient answer tells persistence apart from the lending rule and recognizes that concurrency is outside the first exercise.

Continue with [create and observe](01-crear-y-observar.md).

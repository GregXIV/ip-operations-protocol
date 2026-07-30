---
type: index
status: v0.1-draft
---

# IP Operations Protocol — v0.1 Specification

> **Working draft (v0.1), published by an independent maintainer under CC-BY-4.0.** Companion to the executive summary.

This vault contains the full v0.1 technical specification for the IP Operations Protocol — a standard for data exchange between corporate IP departments, service providers, external counsel, and registers performing operational work on patent and other IP assets.

For non-technical strategic framing, read the executive summary document. For implementation detail, navigate this vault.

## How to read this vault

Start at [Scope](01%20-%20Front%20Matter/Scope.md) and [Non-Scope](01%20-%20Front%20Matter/Non-Scope.md) — knowing what the protocol covers and explicitly does not cover is the most important context for everything else. Then [Reference Standards](01%20-%20Front%20Matter/Reference%20Standards.md) for how this protocol relates to existing WIPO and ISO standards. Then [Conventions](01%20-%20Front%20Matter/Conventions.md) for naming, types, and structural patterns used throughout.

Then either:

- **For the spec's substance**, read [Common Envelope](02%20-%20Foundational%20Structures/Common%20Envelope.md) then the foundational structures, then the messages organized by category. Each message is one file.
- **For an operational walkthrough**, read [EP Post-Grant Flow Walkthrough](04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md) which threads through the full set of messages in a realistic sequence.
- **For unresolved design decisions**, see [Ratified Decisions](05%20-%20Decisions/Ratified%20Decisions.md), [Open Questions for Consortium](05%20-%20Decisions/Open%20Questions%20for%20Consortium.md), and [Deferred to v1-x](05%20-%20Decisions/Deferred%20to%20v1-x.md).

## Vault map

### [Front matter](01%20-%20Front%20Matter/Scope.md)
- [Scope](01%20-%20Front%20Matter/Scope.md)
- [Non-Scope](01%20-%20Front%20Matter/Non-Scope.md)
- [Reference Standards](01%20-%20Front%20Matter/Reference%20Standards.md)
- [Relationship to WIPO](01%20-%20Front%20Matter/Relationship%20to%20WIPO.md)
- [Conventions](01%20-%20Front%20Matter/Conventions.md)

### Foundational structures
- [Common Envelope](02%20-%20Foundational%20Structures/Common%20Envelope.md) — shared by all messages
- Asset and entity model: [Asset Reference](02%20-%20Foundational%20Structures/Asset%20Reference.md), [Entity Reference](02%20-%20Foundational%20Structures/Entity%20Reference.md), [Document Reference](02%20-%20Foundational%20Structures/Document%20Reference.md)
- Actor model: [Actor Reference](02%20-%20Foundational%20Structures/Actor%20Reference.md), [Actor Role Declaration](02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md), [User Context](02%20-%20Foundational%20Structures/User%20Context.md)
- Authority model: [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md), [Data Assertion](02%20-%20Foundational%20Structures/Data%20Assertion.md)
- Workstream model: [Workstream](02%20-%20Foundational%20Structures/Workstream.md), [Milestone](02%20-%20Foundational%20Structures/Milestone.md)
- Common sub-structures: [Outcome Details](02%20-%20Foundational%20Structures/Outcome%20Details.md), [Evidence Collection](02%20-%20Foundational%20Structures/Evidence%20Collection.md)

### Messages

**Bootstrap and discovery:** [Asset Bootstrap](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md), [Asset Match Inquiry](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md), [Asset Match Response](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md)

**Workstream lifecycle:** [Goal Decomposition](03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md), [Orchestration Committed](03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md), [Workstream Completed](03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md), [Workstream Abandoned](03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Abandoned.md)

**Milestone lifecycle:** [Milestone Started](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md), [Milestone Completed](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md), [Milestone Failed](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md), [Milestone Abandoned](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Abandoned.md)

**Deliverable handoff:** [Service Deliverable](03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md), [Deliverable Acknowledged](03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md)

**Prepared-action handoff:** [Artifact Ready](03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md), [Client Action Completed](03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)

**Payments:** [Payment Authorized](03%20-%20Messages/Payments/Payment%20Authorized.md), [Payment Executed](03%20-%20Messages/Payments/Payment%20Executed.md)

**Subscriptions:** [Service Subscription Started](03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md), [Service Subscription Terminated](03%20-%20Messages/Subscriptions/Service%20Subscription%20Terminated.md)

**Steady-state events:** [Service Finding](03%20-%20Messages/Steady-State%20Events/Service%20Finding.md), [Register Event](03%20-%20Messages/Steady-State%20Events/Register%20Event.md)

**Disputes:** [Asset Authority Dispute](03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md), [Action Confirmation Dispute](03%20-%20Messages/Disputes/Action%20Confirmation%20Dispute.md), [Identity Resolution Dispute](03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md), [Dispute Resolution Decision](03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md)

**Generic:** [Record Update](03%20-%20Messages/Generic/Record%20Update.md)

### Worked examples
- [EP Post-Grant Flow Walkthrough](04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md)
- [Phase-by-Phase Reference](04%20-%20Worked%20Examples/Phase-by-Phase%20Reference.md)

### Decisions and open items
- [Ratified Decisions](05%20-%20Decisions/Ratified%20Decisions.md)
- [Open Questions for Consortium](05%20-%20Decisions/Open%20Questions%20for%20Consortium.md)
- [Deferred to v1-x](05%20-%20Decisions/Deferred%20to%20v1-x.md)

### Reference
- [Glossary](../Glossary.md)

## Spec status

This is **v0.1**, a working draft published by an independent maintainer. The protocol is tractable for implementation; the design decisions reserved for a future governance body are recorded in [Open Questions for Consortium](05%20-%20Decisions/Open%20Questions%20for%20Consortium.md), each ratified with a recommended default for v0.1 and reopenable when a consortium forms. v1.0 will lock those decisions.

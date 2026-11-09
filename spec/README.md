---
type: index
status: v0.9-draft
---

# IP Operations Protocol — v0.9 Specification

> **Working draft (v0.9), published by an independent maintainer under CC-BY-4.0.** Companion to the executive summary.

This vault contains the full v0.9 technical specification for the IP Operations Protocol — a standard for data exchange between corporate IP departments, service providers, external counsel, and registers performing operational work on patent and other IP assets.

For non-technical strategic framing, read the executive summary document. For implementation detail, navigate this vault.

## How to read this vault

Start at [Scope](01%20-%20Front%20Matter/Scope.md) and [Non-Scope](01%20-%20Front%20Matter/Non-Scope.md) — knowing what the protocol covers and explicitly does not cover is the most important context for everything else. Then [Reference Standards](01%20-%20Front%20Matter/Reference%20Standards.md) for how this protocol relates to existing WIPO and ISO standards. Then [Conventions](01%20-%20Front%20Matter/Conventions.md) for naming, types, and structural patterns used throughout.

Then either:

- **For the spec's substance**, read [Common Envelope](02%20-%20Foundational%20Structures/Common%20Envelope.md) then the foundational structures, then the messages organized by category. Each message is one file.
- **For an operational walkthrough**, read [EP Post-Grant Flow Walkthrough](04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md) which threads through the 0.1 set of messages in a realistic sequence, then [Exclusive Delivery and Open Services Walkthrough](04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md) for the messages added in 0.2 and 0.3.
- **For unresolved design decisions**, see [Ratified Decisions](05%20-%20Decisions/Ratified%20Decisions.md), [Open Questions for Consortium](05%20-%20Decisions/Open%20Questions%20for%20Consortium.md), and [Deferred to v1-x](05%20-%20Decisions/Deferred%20to%20v1-x.md).

## Vault map

### [Front matter](01%20-%20Front%20Matter/Scope.md)
- [Scope](01%20-%20Front%20Matter/Scope.md)
- [Non-Scope](01%20-%20Front%20Matter/Non-Scope.md)
- [Reference Standards](01%20-%20Front%20Matter/Reference%20Standards.md)
- [Relationship to WIPO](01%20-%20Front%20Matter/Relationship%20to%20WIPO.md)
- [Conventions](01%20-%20Front%20Matter/Conventions.md)
- [Conformance](01%20-%20Front%20Matter/Conformance.md) — the profiles an implementation can claim: the orchestrator profile (added in 0.5) and the provider profile (added in 0.6, with a litigation module since 0.7)

### Foundational structures
- [Common Envelope](02%20-%20Foundational%20Structures/Common%20Envelope.md) — shared by all messages
- Asset and entity model: [Asset Reference](02%20-%20Foundational%20Structures/Asset%20Reference.md), [Entity Reference](02%20-%20Foundational%20Structures/Entity%20Reference.md), [Document Reference](02%20-%20Foundational%20Structures/Document%20Reference.md)
- Actor model: [Actor Reference](02%20-%20Foundational%20Structures/Actor%20Reference.md), [Actor Role Declaration](02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md), [User Context](02%20-%20Foundational%20Structures/User%20Context.md)
- Authority model: [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md), [Data Assertion](02%20-%20Foundational%20Structures/Data%20Assertion.md)
- Workstream model: [Workstream](02%20-%20Foundational%20Structures/Workstream.md), [Milestone](02%20-%20Foundational%20Structures/Milestone.md)
- Price and timing (added in 0.2): [Agreed Price](02%20-%20Foundational%20Structures/Agreed%20Price.md), [Service Level](02%20-%20Foundational%20Structures/Service%20Level.md), and since 0.6 [Deadline](02%20-%20Foundational%20Structures/Deadline.md)
- Asset identification profile: [Asset Identification and Resolution](02%20-%20Foundational%20Structures/Asset%20Identification%20and%20Resolution.md)
- Common sub-structures: [Outcome Details](02%20-%20Foundational%20Structures/Outcome%20Details.md), [Evidence Collection](02%20-%20Foundational%20Structures/Evidence%20Collection.md)

### Messages

44 message types in 12 categories. The thirteen added in 0.2, the two added in 0.3, the two added in 0.5 and the one added in 0.6 are marked.

**Bootstrap and discovery:** [Asset Bootstrap](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md), [Asset Match Inquiry](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md), [Asset Match Response](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md)

**Workstream lifecycle:** [Work Requested](03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) (0.2), [Request Declined](03%20-%20Messages/Workstream%20Lifecycle/Request%20Declined.md) (0.3), [Goal Decomposition](03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md), [Orchestration Committed](03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md), [Workstream Completed](03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md), [Workstream Abandoned](03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Abandoned.md)

**Milestone lifecycle:** [Milestone Started](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md), [Milestone Completed](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md), [Milestone Failed](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md), [Milestone Abandoned](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Abandoned.md)

**Work instruction (0.2):** [Work Instruction](03%20-%20Messages/Work%20Instruction/Work%20Instruction.md), [Instruction Accepted](03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md), [Instruction Declined](03%20-%20Messages/Work%20Instruction/Instruction%20Declined.md), [Mandate Instruction](03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) (0.6)

**Procurement (0.2):** [Bid Invitation](03%20-%20Messages/Procurement/Bid%20Invitation.md), [Conflict Check Attested](03%20-%20Messages/Procurement/Conflict%20Check%20Attested.md), [Requester Disclosed](03%20-%20Messages/Procurement/Requester%20Disclosed.md) (0.3), [Bid Submitted](03%20-%20Messages/Procurement/Bid%20Submitted.md), [Bid Withdrawn](03%20-%20Messages/Procurement/Bid%20Withdrawn.md), [Bid Declined](03%20-%20Messages/Procurement/Bid%20Declined.md), [Award Proposed](03%20-%20Messages/Procurement/Award%20Proposed.md), [Award Confirmed](03%20-%20Messages/Procurement/Award%20Confirmed.md), [Award Declined](03%20-%20Messages/Procurement/Award%20Declined.md)

**Deliverable handoff:** [Service Deliverable](03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md), [Deliverable Acknowledged](03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md)

**Prepared-action handoff:** [Artifact Ready](03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md), [Client Action Completed](03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)

**Payments:** [Payment Authorized](03%20-%20Messages/Payments/Payment%20Authorized.md), [Payment Executed](03%20-%20Messages/Payments/Payment%20Executed.md), [Invoice Issued](03%20-%20Messages/Payments/Invoice%20Issued.md) (0.2), [Invoice Disputed](03%20-%20Messages/Payments/Invoice%20Disputed.md) (0.5), [Invoice Cancelled](03%20-%20Messages/Payments/Invoice%20Cancelled.md) (0.5)

**Subscriptions:** [Service Subscription Started](03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md), [Service Subscription Terminated](03%20-%20Messages/Subscriptions/Service%20Subscription%20Terminated.md)

**Steady-state events:** [Service Finding](03%20-%20Messages/Steady-State%20Events/Service%20Finding.md), [Register Event](03%20-%20Messages/Steady-State%20Events/Register%20Event.md)

**Disputes:** [Asset Authority Dispute](03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md), [Action Confirmation Dispute](03%20-%20Messages/Disputes/Action%20Confirmation%20Dispute.md), [Identity Resolution Dispute](03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md), [Dispute Resolution Decision](03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md)

**Generic:** [Record Update](03%20-%20Messages/Generic/Record%20Update.md)

### Worked examples
- [EP Post-Grant Flow Walkthrough](04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md)
- [Phase-by-Phase Reference](04%20-%20Worked%20Examples/Phase-by-Phase%20Reference.md)
- [Exclusive Delivery and Open Services Walkthrough](04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md) (added in 0.2)

### Decisions and open items
- [Ratified Decisions](05%20-%20Decisions/Ratified%20Decisions.md)
- [Open Questions for Consortium](05%20-%20Decisions/Open%20Questions%20for%20Consortium.md)
- [Deferred to v1-x](05%20-%20Decisions/Deferred%20to%20v1-x.md)

### Reference
- [Glossary](../Glossary.md)

## Spec status

This is **v0.9**, a working draft published by an independent maintainer. v0.2 extended v0.1 by addition only: thirteen messages, two foundational structures, optional fields and vocabulary values, recorded in [Ratified Decisions](05%20-%20Decisions/Ratified%20Decisions.md) under *Version 0.2.0*. v0.3 adds two messages and the description of rights still to be created, and relaxes three rules of v0.2: a workstream no longer needs an existing asset, a document reference no longer needs one either, and an invoice line no longer needs a milestone. It is recorded under *Version 0.3.0*. v0.4 extends v0.3 by addition only: a bid invitation can describe a right still to be created and name the requester, and a subscription invoice line can state its billing period. No message type is added and no rule is changed; it is recorded under *Version 0.4.0*. v0.5 extends v0.4 by addition only: invoices can be disputed and cancelled, a message can name the actor that recorded it for its originator, records named by URI are resolvable from their issuer, and a [Conformance](01%20-%20Front%20Matter/Conformance.md) page carries an orchestrator profile; it is recorded under *Version 0.5.0*. v0.6 lets a provider instructed directly by its client conform: a provider profile on the Conformance page, a direct engagement between client and provider without an orchestrator, a [Mandate Instruction](03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) that covers a whole matter and lets the provider add milestones within its scope, a [Deadline](02%20-%20Foundational%20Structures/Deadline.md) structure for court-ordered and statutory time limits and hearings, a conflict check for instructions and requests as well as invitations, and a confidentiality marking on the envelope. It relaxes three rules and tightens three, each recorded under *Version 0.6.0*. v0.7 adds the litigation module and mandate pricing: proceedings with their forum, docket number and parties on a workstream, the role of each asset in a dispute, court document types with the dates of service and receipt, a court or another non-actor as the originator of a document, and in a price a rate table per role or timekeeper, a budget distinct from a cap, a flat fee per period and a statutory fee schedule as a floor. It relaxes two rules (a Work Instruction recorded by its provider needs no invented clocks, and a document's originator may be an Entity Reference) and adds one sender rule for every actor (data minimisation for natural persons), each recorded under *Version 0.7.0*. v0.8 completes invoicing for firms: an invoice line can carry a time entry (hours, rate, timekeeper and role from the rate table, task and activity codes) or an expense, and its VAT category in the terms of EN 16931; an invoice can carry a breakdown per category, amounts passed on at cost outside the VAT base, its issue date, a buyer reference, the tax identifiers of both parties, a billing file, and its share of a charge invoiced to several payors; a structured EN 16931 invoice document wins over the message; and a payment names the invoices it settles. All of it is optional. It relaxes one rule (a disputed line may be named by `lineId`), tightens none, ratifies the seventh open question, and adds invoicing requirements to both role profiles, each recorded under *Version 0.8.0*. v0.9 fixes what a provider-side implementation of 0.8 found: a workstream or a request for advisory work, such as a freedom-to-operate opinion, may name no asset; `proceedings` and `assetRoles` are recorded under the status claim; patch paths are relative to `sectionPath`; no schema alternative depends on `format` alone, which a second validator now checks in CI; and every example patent number is fictional. It relaxes three rules and tightens two, neither in a schema, each recorded under *Version 0.9.0*. The protocol is tractable for implementation; the design decisions reserved for a future governance body are recorded in [Open Questions for Consortium](05%20-%20Decisions/Open%20Questions%20for%20Consortium.md), the six v0.1 questions each ratified with a recommended default and reopenable when a consortium forms, and a seventh, added in 0.3, ratified in 0.8 with its answer. No question is open. v1.0 will lock those decisions.

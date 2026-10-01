---
type: front-matter
status: v0.2
---

# Non-Scope

The following topics are explicitly outside the protocol's scope. Each exists for a specific reason — replicating work governed elsewhere, or expanding the protocol into domains where standardization is premature, contested, or unnecessary for operational interoperability.

The protocol references these topics where necessary but does not define or constrain them.

## Identity and entity resolution

Each actor maintains its own identity graph and resolution logic. The protocol carries [resolution context](../02%20-%20Foundational%20Structures/Entity%20Reference.md) within messages but does not standardize how identity graphs are maintained or shared between actors.

Bilateral or future arrangements may exchange identity information outside this protocol.

The reasoning: cross-actor identity exchange would turn the consortium conversation into a corporate-identity governance debate, which is a different problem with different stakeholders. See [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for the optional `crossActorReferences` field that surfaces but does not standardize this.

## Authentication and authorization

Implementations select authentication mechanisms (OAuth, mTLS, signed JWTs, etc.) appropriate to their commercial and regulatory context.

The protocol identifies actors through [actorUris](../02%20-%20Foundational%20Structures/Actor%20Reference.md) in messages but does not standardize how those actors prove they are who they claim to be. That is a transport-layer concern.

## Transport

The protocol defines message shapes and authority semantics. **Transport** — synchronous APIs, asynchronous queues, signed payloads, mail-based exchanges, portal-based exchanges — is an implementation choice.

WIPO ST.96 made the choice to constrain transport (XML over specific channels) and gained limited adoption outside specific office workflows. ePCT made the opposite choice and is mostly an EPO thing. This protocol takes the ST.96-pre-transport approach: define the data, leave the wire to implementations.

## Document content

Documents referenced by the protocol are governed by their issuing bodies and by relevant WIPO and office-specific standards.

The protocol carries [references and access semantics](../02%20-%20Foundational%20Structures/Document%20Reference.md), not document internals. A patent application is whatever the office accepts; a granted text is what the office published. The protocol references these through [Document Reference](../02%20-%20Foundational%20Structures/Document%20Reference.md) but does not define their internal structure.

This is the appropriate scope demarcation — WIPO ST.96 already handles document-internal structure for documents that have it.

## Commercial terms

[Cost messages](../03%20-%20Messages/Payments/Payment%20Authorized.md) carry amounts, currencies, allocation metadata, and references to commercial agreements. The protocol does **not** standardize pricing models or contractual terms.

It does standardize how a binding price, a bid and an award are **exchanged**, because those are operational messages between the same actors as every other message. A price is carried as an amount with optional line items — see [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md). How a supplier arrives at it stays its own business.

What stays out of scope:

- **How bids are scored or ranked.** Only the result is exchanged, as [Award Proposed](../03%20-%20Messages/Procurement/Award%20Proposed.md) and [Bid Declined](../03%20-%20Messages/Procurement/Bid%20Declined.md).
- **Subscription pricing of a platform.** Only the fact and terms of one subscription are exchanged, in [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md).
- **Conflict-check methods.** Only the attestation is exchanged, in [Conflict Check Attested](../03%20-%20Messages/Procurement/Conflict%20Check%20Attested.md).
- **The consequence of a missed service level.** Only the clock is exchanged — see [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md).

Pricing is competitive and confidential. Trying to standardize it would either produce a watered-down cost message or a multi-year argument about whether hourly billing should be in the spec. Service providers may expose whatever cost structures their commercial contracts support; the protocol just carries the resulting numbers cleanly.

This section was amended in 0.2 (see [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md), decision 29). In 0.1 it excluded "pricing models, billing structures, or contractual terms" and the protocol carried only resulting amounts.

## Identity governance, registry sharing, schema evolution governance

These are out of scope for the protocol but in scope for the consortium's governance model. See [Relationship to WIPO](Relationship%20to%20WIPO.md) for the consortium's governance posture.

## Why these exclusions matter

The exclusions above are stated as a single coherent principle: **the protocol standardizes the IP-operations data layer and nothing else**.

Stating the exclusion as one principle rather than five separate rules is what gives the consortium a tool: when someone proposes adding something, the question becomes "is this IP-operations data, or is it one of the out-of-scope categories?" Answering that question is much easier than re-debating each topic on its merits.

Until 0.2 the principle spoke of the *patent-operations* data layer. The asset model has covered trademarks, designs and other IP rights from the start, so the wording now says IP operations.

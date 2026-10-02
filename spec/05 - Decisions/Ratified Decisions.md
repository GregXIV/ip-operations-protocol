---
type: decisions
status: v0.2
---

# Ratified Decisions

> Decisions made during v0.1 design that are positioned as defaults; subject to consortium ratification but recommended as-is.

The protocol's design accumulated 28 open positions across the per-message and consolidation work. Most are conservative-direction choices that simplify v0.1 and are easy to revisit in v1.x. Listed here as recommended ratifications.

## Asset reference

1. **Protocol-assigned URI is canonical.** Office identifiers are descriptive; the protocol-assigned URN is stable across the asset's lifetime.
2. **Identifier change history is append-mostly.** Old identifiers remain valid historical references but may be flagged superseded; never deleted.

## Actor reference

3. **Actor type extensibility is controlled.** Standard actor types are enumerated in the spec; custom types use namespaced URNs.
4. **Role enumeration is flat for v0.1.** Hierarchical role taxonomies deferred to v1.x.

## Authority claim

5. **Authority claims are stored in record's `_authority` meta-section.** No separate registry; claims live with the records they govern.
6. **Joint authority claim type not in v0.1.** v0.1 supports `exclusive`, `sourceOfTruth`, and `advisory`. Joint-claim semantics deferred to v1.x.
7. **Single claim reference per assertion.** [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md) cites exactly one [Authority Claim](../02%20-%20Foundational%20Structures/Authority%20Claim.md). Multi-claim assertions deferred.

## Identity resolution

8. **Identity confidence level is optional in v0.1 with strong recommendation.** Receivers may apply their own policy on low-confidence resolutions.
9. **Identity dispute severity is calibrated per-actor.** No global severity ranking; each actor decides.

## Document reference

10. **Document content hash is optional.** Strong recommendation for high-stakes documents (deliverables, evidence). Required only by receiver policy.
11. **Document storage broker is not in v0.1.** No protocol-mandated content distribution mechanism. Storage is federated; receivers fetch on demand.
12. **Document type extensibility is controlled.** Standard types enumerated; custom types use namespaced URNs.

## Workstream and milestone

13. **Milestone category extensibility is controlled.** Standard categories enumerated; custom categories use namespaced URNs.
14. **Execution mode is fixed in v0.1.** `serviceProviderManaged`, `selfService`, `thirdPartyRfp`. Custom modes deferred.
15. **Chain execution policy is `strict` only in v0.1.** Optimistic and manual policies deferred.

## Bootstrap and discovery

16. **Bootstrap is producer-initiated.** No on-demand asset creation; assets enter the protocol when an authorized producer publishes [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md).
17. **Acknowledgment vs. acceptance distinction in [Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md) retained.** `simpleAcknowledgment`, `acceptance`, `conditionalAcceptance`, `objection` enum values.

## Workstream lifecycle

18. **No built-in retry mechanism.** Retries are modeled as new [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) proposals.
19. **Subscription modification uses terminate-and-restart.** No in-place subscription modification message in v0.1.
20. **No separate auto-resolution dispute message.** Auto-resolution through retroactive late-arriving events uses standard [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md).

## Naming and structure (consolidation)

21. **Renamed `IdentityResolutionDecision` to [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md).** Now handles all three dispute types uniformly.
22. **Status assertions move to envelope-level `assertions` array.** Per-message `statusAssertion` and similar fields eliminated; everything goes through the standard array.
23. **[Outcome Details](../02%20-%20Foundational%20Structures/Outcome%20Details.md) and [Evidence Collection](../02%20-%20Foundational%20Structures/Evidence%20Collection.md) extracted as foundationals.** Common shapes pulled out; per-message specs reference rather than redefine.
24. **UserContext field naming standardized.** Single `userContext` field name; qualifying prefixes only when two distinct contexts appear in one message.

## Adding RecordUpdate

25. **[Record Update](../03%20-%20Messages/Generic/Record%20Update.md) added as 23rd message.** Lightweight envelope for data-only updates that don't naturally fit operational messages. Used sparingly.

## Other

26. **Generic `serviceProviderManaged` execution mode rather than vendor-specific.** Implementations map the generic enum to whichever provider is configured as default.
27. **`partiallyConfirmed` outcome in [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) deferred to v1.x.** v0.1 supports `confirmed`, `confirmedWithEnrichment`, `denied`, `unknown`, `disputedResolution`. Partial confirmation deferred.
28. **Asset bootstrap acceptance is implicit.** Receivers create local replicas without explicit acknowledgment; [Asset Match Inquiry](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md)/[Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) handles validation.

## Version 0.2.0 (ratified 2026-10-01 and 2026-10-02)

29. **The protocol is extended for work requests, work instructions, invoices and procurement.** Ratified by the maintainer on 2026-10-01 and released as version 0.2.0, a minor and purely additive version: thirteen messages, two foundational structures ([Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md), [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md)), new optional fields on [Workstream](../02%20-%20Foundational%20Structures/Workstream.md) and [Milestone](../02%20-%20Foundational%20Structures/Milestone.md), and new vocabulary values. Nothing existing is renamed or removed; a 0.1 receiver keeps working and treats the additions as unknown. The *Commercial terms* section of [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) is amended with it: pricing models and contractual terms stay out of scope, while how a binding price, a bid and an award are exchanged is in scope. Decision 14 stands as it is — the execution modes remain fixed. The procurement messages, beginning with [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), give `thirdPartyRfp` its mechanics.
30. **A catalogue order may be the commitment in one step.** [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) carries an optional `preAuthorized` flag. When it is set and the request names an `offerReference`, the orchestrator's [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) counts as committed without a separate [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md), provided every `agreedPrice` in it matches the offer. If a price differs, the flag has no effect and the requester commits as usual.

Decisions 31 to 36 follow the recommendations of the extension proposal. They were ratified by the maintainer on 2026-10-02.

31. **`orchestrator` is a role.** It was a glossary word in 0.1. [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) is addressed to the orchestrator, and addressing needs a role a receiver can check. Listed in [Actor Role Declaration](../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md).
32. **The actor type list is open in the schema.** Decision 3 allows custom actor types as namespaced URNs, but the 0.1 schema held the standard types as a closed enumeration. Since 0.2 the schema accepts the standard types, now including `softwareService`, and any namespaced URN. See [Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md).
33. **One invoice message.** [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) serves supplier invoices and the customer invoice alike. Payee and payor say which it is.
34. **A small core line item vocabulary.** Five standard line item types in `urn:ipproto:lineItem:` — `professionalFee`, `translation`, `officialFee`, `handling`, `disbursement` — with custom types through namespaced URNs. See [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md).
35. **A missed service level is derived, not announced.** No message reports a missed [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md); each party derives it from timestamps. A message can be added later without breaking anything.
36. **The guiding principle speaks of IP operations.** The principle in [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) read "patent-operations data layer" in 0.1. The asset model already covers trademarks and designs, so the wording is "IP-operations data layer".

## See also

- [Open Questions for Consortium](Open%20Questions%20for%20Consortium.md) — decisions left explicitly open
- [Deferred to v1-x](Deferred%20to%20v1-x.md) — features deliberately scoped out of v0.1

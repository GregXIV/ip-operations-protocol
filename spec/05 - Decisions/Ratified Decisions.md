---
type: decisions
status: v0.1
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

## See also

- [Open Questions for Consortium](Open%20Questions%20for%20Consortium.md) — decisions left explicitly open
- [Deferred to v1-x](Deferred%20to%20v1-x.md) — features deliberately scoped out of v0.1

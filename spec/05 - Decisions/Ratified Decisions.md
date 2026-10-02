---
type: decisions
status: v0.4
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

29. **The protocol is extended for work requests, work instructions, invoices and procurement.** Ratified by the maintainer on 2026-10-01 and released as version 0.2.0, a minor and purely additive version: thirteen messages, two foundational structures ([Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md), [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md)), new optional fields on [Workstream](../02%20-%20Foundational%20Structures/Workstream.md) and [Milestone](../02%20-%20Foundational%20Structures/Milestone.md), and new vocabulary values. Nothing existing is renamed or removed; a 0.1 receiver that degrades on unknown values, as [VERSIONING](../../VERSIONING.md) requires, keeps working and treats the additions as unknown. A receiver that validates strictly against the 0.1 schemas rejects the 0.2 values `softwareService` and `revenueShare` (this sentence was corrected in 0.3). The *Commercial terms* section of [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) is amended with it: pricing models and contractual terms stay out of scope, while how a binding price, a bid and an award are exchanged is in scope. Decision 14 stands as it is — the execution modes remain fixed. The procurement messages, beginning with [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), give `thirdPartyRfp` its mechanics.
30. **A catalogue order may be the commitment in one step.** [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) carries an optional `preAuthorized` flag. When it is set and the request names an `offerReference`, the orchestrator's [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) counts as committed without a separate [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md), provided every `agreedPrice` in it matches the offer. If a price differs, the flag has no effect and the requester commits as usual.

Decisions 31 to 36 follow the recommendations of the extension proposal. They were ratified by the maintainer on 2026-10-02.

31. **`orchestrator` is a role.** It was a glossary word in 0.1. [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) is addressed to the orchestrator, and addressing needs a role a receiver can check. Listed in [Actor Role Declaration](../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md).
32. **The actor type list is open in the schema.** Decision 3 allows custom actor types as namespaced URNs, but the 0.1 schema held the standard types as a closed enumeration. Since 0.2 the schema accepts the standard types, now including `softwareService`, and any namespaced URN. See [Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md).
33. **One invoice message.** [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) serves supplier invoices and the customer invoice alike. Payee and payor say which it is.
34. **A small core line item vocabulary.** Five standard line item types in `urn:ipproto:lineItem:` — `professionalFee`, `translation`, `officialFee`, `handling`, `disbursement` — with custom types through namespaced URNs. See [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md).
35. **A missed service level is derived, not announced.** No message reports a missed [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md); each party derives it from timestamps. A message can be added later without breaking anything.
36. **The guiding principle speaks of IP operations.** The principle in [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) read "patent-operations data layer" in 0.1. The asset model already covers trademarks and designs, so the wording is "IP-operations data layer".

## Version 0.3.0 (ratified 2026-10-02)

Follow-up decisions to 0.2.0, agreed by the maintainer on 2026-10-02. Version 0.3.0 is a minor version under the pre-1.0 rule of [VERSIONING](../../VERSIONING.md) and not purely additive: decisions 37, 40 and 45 relax rules a 0.2 receiver could rely on.

37. **A request and a workstream may describe rights still to be created.** [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) and [Workstream](../02%20-%20Foundational%20Structures/Workstream.md) carry `prospectiveRights` next to `assetReferences`, and at least one of the two is required. In 0.2 at least one asset was required, so a first filing or a drafting job could not be requested. Decision 16 stands: a prospective right is not an asset, and the asset a filing creates enters the protocol through [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md). The orchestrator then adds it to the workstream.
38. **A request can be declined inside the protocol.** [Request Declined](../03%20-%20Messages/Workstream%20Lifecycle/Request%20Declined.md) is the orchestrator's answer to a request it will not serve, with a reason category and an optional narrative. A declined request creates no workstream.
39. **A withheld requester is disclosed by a message.** [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md) carries the requester's [Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md) from the orchestrator to one bidder. It is sent only where the [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md) withheld the identity, only after that bidder attested `clear`, and never to a bidder that attested `conflict`.
40. **An invoice line refers to a milestone or to a subscription.** Each line of [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) carries exactly one of `milestoneReference` and `subscriptionReference`. In 0.2 every line needed a milestone, so a subscription could not be invoiced line by line.
41. **The tax treatment vocabulary is open and provisional.** `taxed`, `reverseCharge`, `exempt` and `outsideScope` stay as standard values of `taxTreatment`; custom values use namespaced URNs. The values are not settled by this decision: nobody who issues invoices has reviewed them. See [Open Questions for Consortium](Open%20Questions%20for%20Consortium.md), question 7.
42. **Free-text messaging is outside the protocol.** Decided on 2026-10-01 with the 0.2.0 extension and written into [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) in 0.3.
43. **The requester identifies a beneficiary that is not an actor.** Its identifier is the `resolvedEntityUri` the requester gives in the beneficiary's [Entity Reference](../02%20-%20Foundational%20Structures/Entity%20Reference.md). The `ultimateBeneficiary` role declaration is optional in that case. See [Workstream](../02%20-%20Foundational%20Structures/Workstream.md).
44. **A revenue share is exchanged between provider and contract holder only.** The `commercialTerms` that carry `sharePercent` do not travel to the subscriber, whose message for the same subscription states its own terms. See [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md).

45. **A Document Reference need not name an asset.** `assetReferences` in [Document Reference](../02%20-%20Foundational%20Structures/Document%20Reference.md) is required only where the document relates to an existing asset. This follows from decision 37: the draft a drafting job delivers, or the invoice for a subscription without assets, relates to none. In 0.2 the field was always required.
46. **`subscriptionFee` is a sixth standard line item type.** It names the recurring fee of a subscription on an invoice line that carries a `subscriptionReference` (decision 40). This extends decision 34, whose five types all describe work on a milestone. See [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md).

## Version 0.4.0 (ratified 2026-10-02)

The six points that 0.3.0 left open, decided by the maintainer on 2026-10-02. Version 0.4.0 is a minor version and purely additive: three optional fields and three clarifications. No rule of 0.3 is relaxed or tightened, and a 0.3 message remains valid.

47. **A subscription may have one start message per audience.** Decision 44 is confirmed as written. Under one `subscriptionReference` the copy of [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) between the application's provider and the contract holder carries the terms with `sharePercent`, and the copy addressed to the subscriber states the subscriber's own terms. Keeping `sharePercent` out of the subscriber's copy is a rule the sender follows, not one a schema enforces.
48. **The orchestrator records a resulting asset; what is to be filed stays with the corporate claim.** On a [Workstream](../02%20-%20Foundational%20Structures/Workstream.md) the orchestrator's claim covers adding an asset URI to `assetReferences` and to the `resultingAssetReferences` of a prospective right, provided an [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md) exists whose `triggeringReference` names that workstream or one of its milestones. That is recording a fact. Adding, removing or otherwise altering `prospectiveRights` entries, and removing asset references, stay under the corporate claim over goal and chain. This completes decision 37, which had the orchestrator add the asset without saying under whose claim.
49. **A Bid Invitation may describe rights still to be created.** [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md) carries an optional `scope.prospectiveRights` with the entries of [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md). While `requesterIdentityWithheld` is true, `applicant` is left out of every entry, so that the invitation cannot reveal who is asking before the conflict check; the parties a bidder needs for the check are in `conflictParties`, as before. `scope` still requires neither `assetReferences` nor `prospectiveRights`, so a 0.3 invitation that describes the work in `scopeText` alone stays valid.
50. **A subscription line may state its billing period.** A line of [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) that carries `subscriptionReference` may carry `billingPeriod`, with `from` and `to` as ISO dates, both inclusive, `to` not before `from`. The field is not allowed on a milestone line. This extends decision 40.
51. **The reason categories of Request Declined are confirmed.** The closed list of 0.3.0 stands: `serviceNotOffered`, `offerNotAvailable`, `requesterNotEligible`, `conflictOfInterest`, `noSupplierAvailable`, `insufficientInformation`, `other`. No change to [Request Declined](../03%20-%20Messages/Workstream%20Lifecycle/Request%20Declined.md) or its schema; this confirms the list that decision 38 left to the 0.3.0 text. The points listed under question 7 of [Open Questions for Consortium](Open%20Questions%20for%20Consortium.md), on the tax treatment vocabulary, are not decided by this and remain open.
52. **A Bid Invitation names the requester where its identity is not withheld.** [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md) carries an optional `requester`, a full [Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md) of the same shape as in [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md). A 0.4 sender includes it when the requester's identity is not withheld. It is absent while `requesterIdentityWithheld` is true. It is not required in the other case, because a 0.3 invitation without it must stay valid. Requester Disclosed (decision 39) remains the message for the withheld case.

## Version 0.4.1 (ratified 2026-10-02)

Three rules for the sender of a [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), decided by the maintainer on 2026-10-02, after 0.4.0 was tagged, on points its build had left open. They are prose: no schema, no schema identifier and nothing on the wire changes, and `protocolVersion` stays `0.4`. Released as a patch version although it is more than editorial; the changelog says why.

53. **Every applicant is a conflict party.** An applicant of a prospective right who is neither the requester nor the beneficiary is listed in the invitation's `conflictParties`, with role `other` unless another role describes it. A bidder therefore sees every party it would act for before it bids, also while the requester's identity is withheld and `applicant` is left out of the entries (decision 49). No field is added to [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md).
54. **A withheld invitation does not name the requester indirectly.** While `requesterIdentityWithheld` is true, no [Entity Reference](../02%20-%20Foundational%20Structures/Entity%20Reference.md) in the invitation carries the requester as its source (`source.sourceActorUri`) or names it in any other field. The orchestrator re-states such a reference under its own name or without a source actor. This is a rule the sender follows; the schema cannot check it. It completes decisions 49 and 52, which keep `applicant` and `requester` out of a withheld invitation.
55. **The sender may limit the intended jurisdictions on an invitation.** The `intendedJurisdictions` of an entry in `scope.prospectiveRights` may be limited to the jurisdictions the invitation covers; the sender is not required to show the full filing plan to a bidder. [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) and [Workstream](../02%20-%20Foundational%20Structures/Workstream.md) keep the full list. This replaces a sentence of the 0.4.0 text, which said that the entry is not cut down to the invitation.

## See also

- [Open Questions for Consortium](Open%20Questions%20for%20Consortium.md) — decisions left explicitly open
- [Deferred to v1-x](Deferred%20to%20v1-x.md) — features deliberately scoped out of v0.1

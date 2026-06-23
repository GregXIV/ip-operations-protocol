---
type: message
category: disputes
status: v0.1
---

# Asset Authority Dispute

> Two actors hold incompatible authority claims over the same section of a record.

## Purpose

Surfaces a conflict between [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md)s. The protocol does not auto-resolve — it routes the dispute to a designated resolver and waits for [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md).

Common cases: corporate disputes a service provider's claim of contractual authorization; service provider disputes a corporate's revocation; two service providers both claim primary engagement.

## Producer

Any actor that detects the conflict — typically the actor whose claim is being challenged or the orchestrator that observed the conflict during message processing.

## Recipients

The competing claimant; the routed resolver; other actors with relevant interest.

## Payload

### `disputeReference`
Type: URI, required

`urn:ipproto:dispute:{uuid}`.

### `disputedRecord`
Type: URI, required

The record under dispute (asset, workstream, milestone, subscription).

### `disputedSectionPath`
Type: JSON Pointer string, required

The section in conflict.

### `competingClaims`
Type: array of [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) references, required (exactly 2 in v0.1)

The two conflicting claims. Each carries its full authority basis and effective dates.

### `conflictType`
Type: enumeration, required

- `overlappingExclusive` — two `exclusive` claims over the same section
- `sourceOfTruthChallenge` — an actor disputes another's `sourceOfTruth` claim
- `supersessionDispute` — a claim purports to supersede another improperly
- `expiredClaim` — a claim is being exercised past its `effectiveTo`
- `delegationChainBroken` — a delegated claim references an upstream that no longer holds

### `disputeNarrative`
Type: string, required

Human-readable description of why the conflict exists.

### `disputeRoutingTarget`
Type: structured, required

Where to route for resolution:
- `targetActorUri` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI
- `targetRoleDeclaration` — [Actor Role Declaration](../../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) URI
- `routingBasis` — narrative

### `disputeImpact`
Type: structured, required

What is blocked while dispute is open:
- `blockedAssertions` — array of pending data assertions held back
- `blockedMilestones` — array of milestoneUris whose progress is blocked
- `blockedWorkstreams` — array of workstreamUris paused

### `proposedResolution`
Type: structured, optional

The disputing actor's proposal:
- `resolutionType` — `revokeClaim`, `narrowClaimScope`, `extendClaimTimebound`, `transferClaim`, `acknowledgeJointHolding`, `other`
- `resolutionDescription` — narrative

### `responseDeadline`
Type: ISO 8601 datetime, required

## Worked example

```json
{
  "payload": {
    "disputeReference": "urn:ipproto:dispute:auth-001-...",
    "disputedRecord": "urn:ipproto:asset:7c4f9a82-...",
    "disputedSectionPath": "/serviceEngagements",
    "competingClaims": [
      "urn:ipproto:authorityClaim:dm-engagement-001",
      "urn:ipproto:authorityClaim:lawfirm-x-engagement-002"
    ],
    "conflictType": "overlappingExclusive",
    "disputeNarrative": "Both Meridian IP Group and external counsel Lawfirm X claim exclusive engagement over EP post-grant validation. Northwind Industries appears to have authorized both independently.",
    "disputeRoutingTarget": {
      "targetActorUri": "urn:ipproto:actor:northwind-industries",
      "targetRoleDeclaration": "urn:ipproto:roleDeclaration:northwind-industries-decisionAuthority"
    },
    "disputeImpact": {
      "blockedMilestones": ["urn:ipproto:milestone:m2-doc-prep"],
      "blockedWorkstreams": ["urn:ipproto:workstream:8a4b1c92-..."]
    },
    "responseDeadline": "2026-05-15T17:00:00Z"
  }
}
```

## Behavior on receipt

The routed resolver investigates and produces [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md). Until decision arrives, blocked work remains paused. Auto-resolution (e.g., when one claim's `effectiveTo` is reached during the dispute window) is permitted but produces a [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md) for audit.

## Related messages

- Resolved by [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md)
- May surface from [Asset Match Response](../Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) disagreements or [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) conflicts

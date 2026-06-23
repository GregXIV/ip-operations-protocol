---
type: message
category: disputes
status: v0.1
---

# Dispute Resolution Decision

> Resolves an [Asset Authority Dispute](Asset%20Authority%20Dispute.md), [Action Confirmation Dispute](Action%20Confirmation%20Dispute.md), or [Identity Resolution Dispute](Identity%20Resolution%20Dispute.md).

## Purpose

The closing message in the dispute machinery. Whoever holds the routing target's authority makes a decision and publishes it. The decision triggers downstream state changes — claims revoked, milestones unblocked, assertions accepted or rejected.

Renamed from `IdentityResolutionDecision` during consolidation; now handles all three dispute types uniformly.

## Producer

The actor at the dispute's `disputeRoutingTarget`. Typically the corporate (decision authority) or the service provider's case team.

## Recipients

All actors involved in the original dispute; orchestrator; other actors with material interest in the outcome.

## Payload

### `disputeReference`
Type: disputeUri, required

The dispute being resolved.

### `decidedAt`
Type: ISO 8601 datetime, required

### `decisionUserContext`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), strongly recommended

For decisions on material disputes, often required by compliance.

### `decisionType`
Type: enumeration, required

Type-specific resolution categories:

For [Asset Authority Dispute](Asset%20Authority%20Dispute.md):
- `claimUpheld`, `claimRevoked`, `claimNarrowed`, `claimTransferred`, `claimsCoexistAsAdvisory`

For [Action Confirmation Dispute](Action%20Confirmation%20Dispute.md):
- `acknowledgeRegisterArrival`, `actionRequiresReExecution`, `actionAcknowledgedAdministrative`, `actionDisputed`

For [Identity Resolution Dispute](Identity%20Resolution%20Dispute.md):
- `oneResolutionDesignatedCanonical`, `bothResolutionsRetained`, `resolutionDeferredToBilateral`, `resolutionRequiresHumanInvestigation`

### `decisionDetails`
Type: [Outcome Details](../../02%20-%20Foundational%20Structures/Outcome%20Details.md), required

Structured details per decision type:
- `claimUpheld` / `claimRevoked` — `affectedClaim`, `successorClaim` (when transferred), `effectiveDate`
- `acknowledgeRegisterArrival` — `lateArrivedRegisterEvent` (URI), `lateArrivalNarrative`
- `oneResolutionDesignatedCanonical` — `canonicalResolutionActor`, `canonicalResolvedEntityUri`, `scopeOfDesignation`

### `decisionRationale`
Type: string, required

Narrative supporting the decision. Used in audit and downstream review.

### `cascadeActions`
Type: array, optional

Downstream actions resulting from the decision:
- `actionType` — `releaseBlockedMilestone`, `applyHeldAssertion`, `terminateClaim`, `recordResolutionForRouting`, `produceCorrectiveMessage`
- `actionTarget` — URI of affected entity
- `actionTiming` — when the cascade fires

## Worked example — authority dispute upheld

```json
{
  "userContext": {"userIdentifier": "counsel@northwind.example", "roleAtActor": "Senior IP Counsel"},
  "payload": {
    "disputeReference": "urn:ipproto:dispute:auth-001-...",
    "decidedAt": "2026-05-13T15:30:00Z",
    "decisionType": "claimRevoked",
    "decisionDetails": {
      "outcomeType": "claimRevoked",
      "details": {
        "affectedClaim": "urn:ipproto:authorityClaim:lawfirm-x-engagement-002",
        "effectiveDate": "2026-05-13T15:30:00Z"
      }
    },
    "decisionRationale": "Northwind Industries confirms Meridian IP Group's engagement as exclusive for EP post-grant validation per MSA 2024-EU. Lawfirm X engagement was authorized in error.",
    "cascadeActions": [
      {"actionType": "releaseBlockedMilestone", "actionTarget": "urn:ipproto:milestone:m2-doc-prep"},
      {"actionType": "terminateClaim", "actionTarget": "urn:ipproto:authorityClaim:lawfirm-x-engagement-002"}
    ]
  }
}
```

## Worked example — late register arrival

```json
{
  "payload": {
    "disputeReference": "urn:ipproto:dispute:conf-001-...",
    "decisionType": "acknowledgeRegisterArrival",
    "decisionDetails": {
      "outcomeType": "acknowledgeRegisterArrival",
      "details": {
        "lateArrivedRegisterEvent": "urn:ipproto:registerEvent:postGrantFiling-2026-...",
        "lateArrivalNarrative": "EPO confirmed all three filings 8 days after expected window. Cause: EPO internal processing backlog. No administrative correction required."
      }
    },
    "decisionRationale": "Register event arrived late but within tolerance. Action confirmed as performed.",
    "cascadeActions": [
      {"actionType": "releaseBlockedMilestone", "actionTarget": "urn:ipproto:milestone:m3-client-filing"},
      {"actionType": "applyHeldAssertion", "actionTarget": "urn:ipproto:assertion:filing-status-confirmed"}
    ]
  }
}
```

## Behavior on receipt

The decision is applied: claims are revoked, assertions accepted or rejected, milestones released or terminated. The cascade actions execute. Audit trail preserves the full dispute history including original claims, the dispute itself, and the decision.

## Related messages

- Closes [Asset Authority Dispute](Asset%20Authority%20Dispute.md), [Action Confirmation Dispute](Action%20Confirmation%20Dispute.md), or [Identity Resolution Dispute](Identity%20Resolution%20Dispute.md)
- Often triggers [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) revocation or new claim creation
- May trigger [Workstream Abandoned](../Workstream%20Lifecycle/Workstream%20Abandoned.md) for unresolvable disputes

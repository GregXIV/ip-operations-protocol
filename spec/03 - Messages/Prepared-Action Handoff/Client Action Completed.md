---
type: message
category: prepared-action-handoff
status: v0.1
---

# Client Action Completed

> Receiver claims they performed the external action announced in [Artifact Ready](Artifact%20Ready.md).

## Purpose

The corporate's claim that the action happened, with structured evidence. Note that this claim is not the source of truth — the register or external system is. The protocol carries the corporate's claim immediately so the workstream can advance optimistically, then waits for the register confirmation as the authoritative event.

## Producer

The actor with `clientExecutor` role (typically the corporate).

## Recipients

The original [Artifact Ready](Artifact%20Ready.md) producer; the orchestrator.

## Payload

### `artifactReadyReference`
Type: messageUri, required

### `actionPerformedAt`
Type: ISO 8601 datetime, required

May be earlier than `producedAt`.

### `performingUserContext`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), strongly recommended

For high-stakes filings, often required by compliance.

### `evidence`
Type: [Evidence Collection](../../02%20-%20Foundational%20Structures/Evidence%20Collection.md), required

Evidence supporting the claimed action. Evidence types match those declared in the original [Artifact Ready](Artifact%20Ready.md)'s `expectedConfirmation`.

### `actionOutcome`
Type: enumeration, required

- `successfullyPerformed`
- `partiallyPerformed`
- `couldNotPerform`
- `performedWithDeviation`

### `outcomeDetails`
Type: [Outcome Details](../../02%20-%20Foundational%20Structures/Outcome%20Details.md), conditional

Required when `actionOutcome != successfullyPerformed`. Per outcome:
- `partiallyPerformed`: `completedAspects`, `incompleteAspects`
- `couldNotPerform`: `obstacleDescription`
- `performedWithDeviation`: `deviationDescription`, `deviationsAcknowledged`

## Worked example — successful filing

```json
{
  "userContext": {
    "userIdentifier": "counsel@northwind.example",
    "roleAtActor": "Senior IP Counsel"
  },
  "payload": {
    "artifactReadyReference": "urn:ipproto:message:ar-001-...",
    "actionPerformedAt": "2026-06-12T14:30:00Z",
    "evidence": {
      "evidenceItems": [
        {
          "evidenceType": "urn:ipproto:evidence:epoConfirmationNumber",
          "evidenceContent": {"confirmationNumber": "EPO-FILING-2026-12345-DE", "evidenceCapturedAt": "2026-06-12T14:31:00Z"},
          "evidenceProvenance": {"captureMethod": "automatedSystemExport"}
        },
        {
          "evidenceType": "urn:ipproto:evidence:epoConfirmationNumber",
          "evidenceContent": {"confirmationNumber": "EPO-FILING-2026-12346-FR"}
        },
        {
          "evidenceType": "urn:ipproto:evidence:epoConfirmationNumber",
          "evidenceContent": {"confirmationNumber": "EPO-FILING-2026-12347-GB"}
        },
        {
          "evidenceType": "urn:ipproto:evidence:epoSignedReceipt",
          "evidenceContent": {"documentReference": "urn:ipproto:document:epo-receipt-bundle-..."}
        }
      ]
    },
    "actionOutcome": "successfullyPerformed"
  }
}
```

## Worked example — partial outcome

```json
{
  "payload": {
    "actionOutcome": "partiallyPerformed",
    "outcomeDetails": {
      "outcomeType": "partiallyPerformed",
      "details": {
        "completedAspects": [
          {"jurisdiction": "DE", "status": "filed"},
          {"jurisdiction": "FR", "status": "filed"}
        ],
        "incompleteAspects": [
          {"jurisdiction": "GB", "status": "filingFailed", "obstacleDescription": "EPO terminal returned validation error on GB submission."}
        ]
      }
    }
  }
}
```

## Behavior on receipt

The orchestrator marks the milestone as `inProgress` (optimistic state — claim received, register confirmation pending) and starts the divergence-detection timer per the original `expectedRegisterEventWindow`. If the corresponding [Register Event](../Steady-State%20Events/Register%20Event.md) arrives within the window, the milestone transitions to `completed`. If not, [Action Confirmation Dispute](../Disputes/Action%20Confirmation%20Dispute.md) fires.

For partial outcomes, the orchestrator routes to remediation — corrected [Artifact Ready](Artifact%20Ready.md) for the failed portion or new [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) revising the milestone.

## Related messages

- Pairs with [Artifact Ready](Artifact%20Ready.md)
- Followed by [Register Event](../Steady-State%20Events/Register%20Event.md) (authoritative confirmation)
- Divergence: [Action Confirmation Dispute](../Disputes/Action%20Confirmation%20Dispute.md)

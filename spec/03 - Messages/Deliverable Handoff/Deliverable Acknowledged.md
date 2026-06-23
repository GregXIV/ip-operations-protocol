---
type: message
category: deliverable-handoff
status: v0.1
---

# Deliverable Acknowledged

> Receiver acknowledges a [Service Deliverable](Service%20Deliverable.md) for review.

## Purpose

The acknowledgment is the gating event that releases dependent milestones to proceed. The protocol distinguishes:

- **Acknowledgment** — "I have seen this and the workstream may proceed"
- **Acceptance** — stronger claim that the receiver endorses the deliverable's content

Both are supported through the `acknowledgmentType` enumeration.

## Producer

The actor with `deliverableRecipient` role.

## Recipients

The deliverable's producer; the orchestrator if it differs.

## Payload

### `deliverableReference`
Type: deliverableUri, required

### `acknowledgmentType`
Type: enumeration, required

- `simpleAcknowledgment` — seen, no endorsement implied
- `acceptance` — content endorsed
- `conditionalAcceptance` — accepted subject to specified conditions
- `objection` — acknowledged but objected to; workstream may proceed only if producer addresses or decisionAuthority overrides

### `acknowledgedAt`
Type: ISO 8601 datetime, required

### `receiverUserContext`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), strongly recommended

Required for `acceptance` and `conditionalAcceptance` by typical compliance practice.

### `reviewSummary`
Type: string, optional

### `annotations`
Type: array, optional

Each entry:
- `annotationType` — `comment`, `suggestion`, `objection`, `correctionRequest`, `clarificationRequest`
- `annotationScope` — `documentLocation` (page/line), `structuredContentPath` (JSON Pointer), or `general`
- `annotationText` — narrative
- `requestedResolution` — narrative
- `severityLevel` — `informational`, `nonBlocking`, `blocking`

### `conditions`
Type: array, conditional

Required when `acknowledgmentType = conditionalAcceptance`. Each: `conditionDescription`, `conditionType` (`modificationRequired`, `additionalInformationRequired`, `actionRequired`, `timingConstraint`), `conditionExpiresAt`.

### `objectionDetails`
Type: structured, conditional

Required when `acknowledgmentType = objection`.

### `downstreamMilestoneRelease`
Type: structured, required

- `releasedMilestones` — array of milestoneUris now permitted to proceed
- `blockedMilestones` — array still blocked, with `blockingReason`

## Worked example — simple acknowledgment

```json
{
  "userContext": {"userIdentifier": "counsel@northwind.example", "roleAtActor": "Senior IP Counsel"},
  "payload": {
    "deliverableReference": "urn:ipproto:deliverable:val-an-001-...",
    "acknowledgmentType": "simpleAcknowledgment",
    "acknowledgedAt": "2026-05-06T11:15:00Z",
    "reviewSummary": "Analysis reviewed; recommendations align with strategy. Proceeding.",
    "downstreamMilestoneRelease": {
      "releasedMilestones": ["urn:ipproto:milestone:m2-doc-prep"]
    }
  }
}
```

## Worked example — conditional acceptance

```json
{
  "payload": {
    "deliverableReference": "urn:ipproto:deliverable:val-an-001-...",
    "acknowledgmentType": "conditionalAcceptance",
    "acknowledgedAt": "2026-05-06T11:15:00Z",
    "annotations": [
      {
        "annotationType": "correctionRequest",
        "annotationScope": {"structuredContentPath": "/recommendedJurisdictions/3"},
        "annotationText": "IT excluded from scope.",
        "severityLevel": "blocking"
      }
    ],
    "conditions": [
      {
        "conditionDescription": "Reduce scope to DE, FR, GB.",
        "conditionType": "modificationRequired",
        "conditionExpiresAt": "2026-05-08T17:00:00Z"
      }
    ],
    "downstreamMilestoneRelease": {
      "blockedMilestones": [
        {"milestoneUri": "urn:ipproto:milestone:m2-doc-prep", "blockingReason": "Scope modification required."}
      ]
    }
  }
}
```

## Behavior on receipt

The producer applies modifications if conditions require them; the orchestrator may produce a new [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) for material changes. Released milestones move to `ready` state.

## Related messages

- Acknowledges [Service Deliverable](Service%20Deliverable.md)
- May trigger new [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) for material modifications

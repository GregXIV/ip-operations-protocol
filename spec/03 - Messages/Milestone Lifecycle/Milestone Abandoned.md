---
type: message
category: milestone-lifecycle
status: v0.1
---

# Milestone Abandoned

> Milestone terminated by decision rather than failure.

## Purpose

Distinct from [Milestone Failed](Milestone%20Failed.md) because abandonment is a deliberate decision rather than an attempted-and-failed outcome.

Common cases: corporate withdrawing scope, strategic redirection, cascading abandonment when an upstream milestone failed.

## Producer

The actor with appropriate authority. For corporate-withdrawal abandonments, the corporate. For cascading abandonments, the orchestrator.

## Payload

### `milestoneReference`
Type: milestoneUri, required

### `abandonedAt`
Type: ISO 8601 datetime, required

### `abandonmentReason`
Type: structured, required

- `reasonCategory` — enumeration: `corporateWithdrawal`, `strategicRedirection`, `cascadingFromUpstream`, `disputeUnresolvable`, `assetStatusChange`, `other`
- `reasonNarrative` — string
- `decisionAuthority` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI
- `decisionUserContext` — [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), recommended

### `partialOutputs`
Type: structured, optional

Same shape as in [Milestone Failed](Milestone%20Failed.md).

### `abandonmentImpact`
Type: structured, required

- `cascadingAbandonments` — milestoneUris abandoned as consequence
- `releasedResources` — narrative
- `unwindObligations` — array (refunds, cancellations, notifications)

## Worked example — corporate withdraws IT validation

```json
{
  "userContext": {
    "userIdentifier": "counsel@northwind.example",
    "roleAtActor": "Senior IP Counsel"
  },
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:m2-translation-IT",
    "abandonedAt": "2026-05-15T10:30:00Z",
    "abandonmentReason": {
      "reasonCategory": "corporateWithdrawal",
      "reasonNarrative": "Q2 review concluded IT exposure below validation threshold.",
      "decisionAuthority": "urn:ipproto:actor:northwind-industries"
    },
    "abandonmentImpact": {
      "cascadingAbandonments": ["urn:ipproto:milestone:m3-it-filing"],
      "releasedResources": "Italian translator capacity returned to pool."
    }
  }
}
```

## Behavior on receipt

Receivers terminate work, settle obligations. Cascading abandonments propagate as separate Milestone Abandoned messages with `reasonCategory = cascadingFromUpstream`.

## Related messages

- Closes a milestone (started or not)
- May trigger cascading [Milestone Abandoned](Milestone%20Abandoned.md) events
- Distinct from [Milestone Failed](Milestone%20Failed.md) (attempted-and-failed)

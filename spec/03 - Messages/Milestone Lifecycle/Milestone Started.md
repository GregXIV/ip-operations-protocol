---
type: message
category: milestone-lifecycle
status: v0.1
---

# Milestone Started

> Primary actor begins work on a milestone.

## Purpose

Sent by the actor with `primary` assignment when they begin work. Transitions the [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) from `ready` to `inProgress`. Under `manual` chain execution policy this triggers work; under `strict` and `optimistic` policies it accompanies work that has begun.

## Producer

The actor with `primary` assignment on the milestone.

## Recipients

The actor with `accountableTo` assignment (typically the corporate); other actors with active interest.

## Payload

### `milestoneReference`
Type: milestoneUri, required

### `startedAt`
Type: ISO 8601 datetime, required

May differ slightly from `producedAt` if message is async.

### `actualResources`
Type: structured, optional

- `assignedUsers` — array of [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md) entries
- `expectedCompletionEstimate` — `estimatedCompletionDate`, `confidenceLevel`

### `startupNotes`
Type: string, optional

## Worked example

```json
{
  "userContext": {
    "userIdentifier": "validation-analyst@meridian-ip-group.example",
    "roleAtActor": "Senior Validation Analyst"
  },
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:m1-validation-analysis",
    "startedAt": "2026-04-29T13:30:00Z",
    "actualResources": {
      "assignedUsers": [
        {"userIdentifier": "validation-analyst@meridian-ip-group.example", "roleAtActor": "Senior Validation Analyst"}
      ],
      "expectedCompletionEstimate": {
        "estimatedCompletionDate": "2026-05-04T17:00:00Z",
        "confidenceLevel": "high"
      }
    }
  }
}
```

The envelope's `assertions` array carries the [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) transitioning `/milestoneStatus` from `ready` to `inProgress`.

## Behavior on receipt

Receivers update their milestone replicas. The corporate's dashboard surfaces "work in progress" with the assigned users for visibility.

## Related messages

- Eventually closed by [Milestone Completed](Milestone%20Completed.md), [Milestone Failed](Milestone%20Failed.md), or [Milestone Abandoned](Milestone%20Abandoned.md)
- Some milestones reach [Milestone Completed](Milestone%20Completed.md) with `awaitingExternalAction` state, leading to [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md)

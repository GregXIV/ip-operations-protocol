---
type: message
category: work-instruction
status: v0.2
---

# Instruction Accepted

> A work provider accepts a [Work Instruction](Work%20Instruction.md).

## Purpose

Added in 0.2. Binds both sides to the instruction's price and service levels and commits the milestone.

## Producer

The actor with `workProvider` role to whom the instruction was addressed.

## Recipients

The work requester that sent the instruction.

## Payload

### `instructionReference`
Type: messageUri, required

The [Work Instruction](Work%20Instruction.md) being accepted.

### `acceptedAt`
Type: ISO 8601 datetime, required

Measured against the `acknowledgement` service level.

### `responsibleUser`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), optional

The person at the provider who is responsible for the work.

## Worked example

```json
{
  "correlation": {
    "correlatedToMessageUri": "urn:ipproto:message:wi-001-...",
    "workstreamUri": "urn:ipproto:workstream:b-agent-es-001",
    "milestoneUri": "urn:ipproto:milestone:b1-es-validation-agent"
  },
  "payload": {
    "instructionReference": "urn:ipproto:message:wi-001-...",
    "acceptedAt": "2026-10-27T14:02:00Z",
    "responsibleUser": {"userIdentifier": "l.ortega@fabrikam-patentes.example", "roleAtActor": "European Patent Attorney"}
  }
}
```

## Behavior on receipt

The milestone moves to `committed` with the provider as `primary` actor and the instruction's `agreedPrice` and `serviceLevels`. Once its dependencies are satisfied it is `ready`, and the provider begins with [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md).

Acceptance is of the instruction as sent. A provider that wants a different price or a later date declines and says why.

## Related messages

- Answers [Work Instruction](Work%20Instruction.md)
- Followed by [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md)
- The alternative: [Instruction Declined](Instruction%20Declined.md)

---
type: message
category: work-instruction
status: v0.2
---

# Instruction Declined

> A work provider declines a [Work Instruction](Work%20Instruction.md), with the reason.

## Purpose

Added in 0.2. Tells the requester at once that the work must go elsewhere, and why — a conflict needs a different answer than a full desk.

## Producer

The actor with `workProvider` role to whom the instruction was addressed.

## Recipients

The work requester that sent the instruction.

## Payload

### `instructionReference`
Type: messageUri, required

The [Work Instruction](Work%20Instruction.md) being declined.

### `declineReason`
Type: structured, required

- `reasonCategory` — enumeration, required: `conflictOfInterest`, `noCapacity`, `outsideCompetence`, `priceNotAccepted`, `serviceLevelNotFeasible`, `other`
- `reasonNarrative` — optional string

A provider that declines for a conflict states the category and nothing that would breach the confidence it owes to another client.

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
    "declineReason": {
      "reasonCategory": "serviceLevelNotFeasible",
      "reasonNarrative": "Translation of 21 pages cannot be delivered by 6 November; earliest delivery 12 November."
    }
  }
}
```

## Behavior on receipt

Nothing is committed. The milestone stays as it was, without a `primary` actor. The requester instructs another provider with a new [Work Instruction](Work%20Instruction.md), or changes the terms and instructs the same provider again.

The parent milestone, if there is one, is not touched: the customer's workstream does not learn of the decline.

## Related messages

- Answers [Work Instruction](Work%20Instruction.md)
- The alternative: [Instruction Accepted](Instruction%20Accepted.md)

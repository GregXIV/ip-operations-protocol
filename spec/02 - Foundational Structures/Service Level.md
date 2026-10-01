---
type: foundational
status: v0.2
---

# Service Level

> A clock on one step of the work: what is measured and when it runs out.

Added in 0.2. Carried on a [Milestone](Milestone.md) as `serviceLevels` and in a [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md).

The protocol carries the clock, not the consequence. Whether a missed level leads to a reminder, an escalation or a re-award is for the parties' contract.

## Structure

### `serviceLevelKind`
Type: URI, required

What the clock measures. Standard kinds in `urn:ipproto:serviceLevel:` namespace:

- `acknowledgement` — the receiver answers: an instruction is accepted or declined, an award is confirmed or declined
- `delivery` — the work's deliverable is handed over
- `bidResponse` — bids are submitted in answer to a [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md)
- `introduction` — the requester and the awarded supplier are put in direct contact after an award stands

Custom kinds allowed through namespaced URNs.

### `dueAt`
Type: ISO 8601 datetime, required

The moment the clock runs out.

### `agreedDurationHours`
Type: decimal, optional

The agreed length of the clock in hours. Informational: `dueAt` is the moment that counts.

### `agreementReference`
Type: string, optional

The terms the level comes from.

## Worked example

```json
[
  {
    "serviceLevelKind": "urn:ipproto:serviceLevel:acknowledgement",
    "dueAt": "2026-10-28T17:00:00Z",
    "agreedDurationHours": 24
  },
  {
    "serviceLevelKind": "urn:ipproto:serviceLevel:delivery",
    "dueAt": "2026-11-06T17:00:00Z",
    "agreedDurationHours": 240,
    "agreementReference": "meridian-agent-terms-v4#validation"
  }
]
```

## Behavior

**Met or missed is derived, not announced.** No message reports a missed Service Level. Each party derives it from the timestamps of the messages it already has:

| Kind | Met by |
|---|---|
| `acknowledgement` | [Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md) or [Instruction Declined](../03%20-%20Messages/Work%20Instruction/Instruction%20Declined.md); [Award Confirmed](../03%20-%20Messages/Procurement/Award%20Confirmed.md) or [Award Declined](../03%20-%20Messages/Procurement/Award%20Declined.md) |
| `delivery` | [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md), or [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) where no deliverable is handed over |
| `bidResponse` | [Bid Submitted](../03%20-%20Messages/Procurement/Bid%20Submitted.md) |
| `introduction` | The first message the awarded supplier sends on the milestone, typically [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md) |

A message for a missed level can be added in a later version without breaking anything.

**Deadlines in messages repeat the clock.** Where a message carries its own deadline field, it states the `dueAt` of the matching Service Level on the milestone:

- `responseDeadline` of a [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) and `confirmationDeadline` of an [Award Proposed](../03%20-%20Messages/Procurement/Award%20Proposed.md) — the `acknowledgement` level
- `bidDeadline` of a [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md) — the `bidResponse` level

**The consequence is out of scope.** A receiver does not reject a message because it arrives after `dueAt`. What follows from lateness is settled between the parties.

## See also

- [Milestone](Milestone.md) — carries `serviceLevels`
- [Agreed Price](Agreed%20Price.md) — the price agreed together with the clock
- [Conventions](../01%20-%20Front%20Matter/Conventions.md) — the `urn:ipproto:serviceLevel:` namespace

---
type: message
category: generic
status: v0.1
---

# Record Update

> Data-only updates that don't naturally fit any operational message.

## Purpose

Added during consolidation. Most changes to records flow through operational messages — a [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md) carries assertions, an [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) carries authorization, a [Register Event](../Steady-State%20Events/Register%20Event.md) carries legal status. But some updates are genuinely data-only: a typo correction in a matter reference, an updated cost-center allocation due to internal restructuring, a refreshed responsible-person assignment.

For those cases, RecordUpdate provides a lightweight envelope. Used sparingly — most changes still flow through operational messages.

## Producer

Any actor with appropriate authority over the section being updated.

## Recipients

Actors with relevant interest in the updated record.

## Payload

### `updatedRecord`
Type: URI, required

The record being updated. Typically an [asset](../../02%20-%20Foundational%20Structures/Asset%20Reference.md), [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), or subscription URI.

### `updateNarrative`
Type: string, required

Brief explanation of why the update is being made. Required to discourage RecordUpdate as a substitute for operational messages where one would be more appropriate.

### `updateCategory`
Type: enumeration, required

- `correction` — fixing an error in prior data
- `internalReorganization` — corporate restructuring affects internal references
- `routineMaintenance` — periodic updates to non-operational sections
- `metadataRefresh` — non-substantive metadata
- `other` — narrative required to be specific

### `assertions`
Type: array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) structures, required

The assertions being made — the actual content change. Carried in the envelope's `assertions` array, but RecordUpdate is the only message whose payload is essentially nothing-but-assertions.

## Worked example — internal reference correction

```json
{
  "userContext": {"userIdentifier": "ip-operations@northwind.example", "roleAtActor": "IP Operations"},
  "payload": {
    "updatedRecord": "urn:ipproto:asset:7c4f9a82-...",
    "updateNarrative": "Cost center allocation updated due to Q3 internal reorganization. Northwind Industries Coatings Active became Northwind Industries Performance Materials.",
    "updateCategory": "internalReorganization"
  },
  "assertions": [
    /* Data Assertion replacing /internalReferences/costCenter */
  ]
}
```

## Behavior on receipt

Receivers apply the asserted change to their replicas. Because RecordUpdate carries no operational context, downstream cascades do not fire automatically — receivers may apply their own logic but the protocol does not specify cascades.

## When NOT to use RecordUpdate

- When the change is meaningfully tied to a workstream → use [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) or [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md)
- When the change is a register-driven legal status update → use [Register Event](../Steady-State%20Events/Register%20Event.md)
- When the change is a deliverable-substantiated assertion → use [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md)
- When the change is in dispute → use the dispute machinery

If unsure, prefer the operational message. RecordUpdate is for cases where no operational message naturally fits.

## See also

- [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) — the structure carrying the actual change
- [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) — claim governing the section being updated

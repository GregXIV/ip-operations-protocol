---
type: message
category: procurement
status: v0.2
---

# Award Confirmed

> One side confirms a proposed award. When both sides have confirmed, the award stands and the milestone is committed.

## Purpose

Added in 0.2. An award binds two parties, so each confirms it once: the bidder that it takes the work on its bid, the requester that it awards. The second confirmation to arrive makes the award stand.

## Producer

Each side, once: the bidder named in the [Award Proposed](Award%20Proposed.md), and the work requester that proposed it.

## Recipients

The other side, and the orchestrator.

## Payload

### `awardReference`
Type: messageUri, required

The [Award Proposed](Award%20Proposed.md) being confirmed.

### `confirmedBy`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), required

The person who confirms. Required: an award commits the actor to cost or to work.

### `confirmingRole`
Type: URI, required

The role in which the sender confirms, in the `urn:ipproto:role:` namespace: `bidder` or `workRequester`.

## Worked example — the bidder confirms

```json
{
  "originatingActor": "urn:ipproto:actor:woodgrove-ip",
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:ap-001-..."},
  "payload": {
    "awardReference": "urn:ipproto:message:ap-001-...",
    "confirmedBy": {"userIdentifier": "m.hale@woodgrove-ip.example", "roleAtActor": "Partner"},
    "confirmingRole": "urn:ipproto:role:bidder"
  }
}
```

## Worked example — the requester confirms

```json
{
  "originatingActor": "urn:ipproto:actor:northwind-industries",
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:ap-001-..."},
  "payload": {
    "awardReference": "urn:ipproto:message:ap-001-...",
    "confirmedBy": {"userIdentifier": "counsel@northwind.example", "roleAtActor": "Senior IP Counsel"},
    "confirmingRole": "urn:ipproto:role:workRequester"
  }
}
```

## Behavior on receipt

One confirmation alone changes nothing. When both the bidder and the requester have confirmed the same `awardReference`:

- **The award stands and commits the milestone.** The milestone is `committed`, with the winner as `primary` actor in the role `workProvider`, the bid's `price` as `agreedPrice`, and the bid's `committedTurnaroundDays` as its `delivery` service level.
- **No [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) is needed** for the milestone.
- The orchestrator records the transition on the milestone and starts the `introduction` clock, where one is agreed.
- The winner's `bidder` role declaration ends. The requester closes the remaining bids with [Bid Declined](Bid%20Declined.md).

Work then runs through the ordinary milestone messages, beginning with [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md).

A second Award Confirmed from the same side for the same award has no effect.

## Related messages

- Confirms [Award Proposed](Award%20Proposed.md)
- The alternative for the bidder: [Award Declined](Award%20Declined.md)
- Followed by [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md)

## See also

- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md), [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md), [Service Level](../../02%20-%20Foundational%20Structures/Service%20Level.md)

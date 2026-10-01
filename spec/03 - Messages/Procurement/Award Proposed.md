---
type: message
category: procurement
status: v0.2
---

# Award Proposed

> A work requester proposes to award the milestone to one bid.

## Purpose

Added in 0.2. Names the bid the requester has chosen and sets a deadline for the bidder to confirm. The award does not stand yet: it stands when both sides have sent [Award Confirmed](Award%20Confirmed.md).

## Producer

The actor with `workRequester` role.

## Recipients

The bidder whose bid is chosen.

## Payload

### `bidReference`
Type: bidUri, required

The bid the award is proposed on. The bid must still be binding.

### `confirmationDeadline`
Type: ISO 8601 datetime, required

By when the bidder must confirm or decline. Repeats the `dueAt` of the `acknowledgement` service level on the milestone.

### `rank`
Type: integer, optional

Present only when a runner-up is promoted after the first award fell through: the rank of the bid now proposed, `2` for the second choice. Absent on the first proposal.

Later messages refer to this proposal by its `messageUri`, as `awardReference`.

## Worked example

```json
{
  "userContext": {"userIdentifier": "counsel@northwind.example", "roleAtActor": "Senior IP Counsel"},
  "payload": {
    "bidReference": "urn:ipproto:bid:woodgrove-c1-001",
    "confirmationDeadline": "2026-11-12T17:00:00Z"
  }
}
```

## Worked example — runner-up promoted

```json
{
  "payload": {
    "bidReference": "urn:ipproto:bid:tailspin-c1-001",
    "confirmationDeadline": "2026-11-17T17:00:00Z",
    "rank": 2
  }
}
```

## Behavior on receipt

The bidder answers before `confirmationDeadline` with [Award Confirmed](Award%20Confirmed.md) or [Award Declined](Award%20Declined.md). The requester confirms on its side with its own Award Confirmed.

If the bidder declines, or the deadline passes without its confirmation, the proposal lapses. The requester may then send a new Award Proposed to the next ranked bid, with `rank`.

`rank` is the only trace of the ranking that travels, and it travels only to the bidder it concerns.

## Related messages

- Follows [Bid Submitted](Bid%20Submitted.md)
- Answered by [Award Confirmed](Award%20Confirmed.md) or [Award Declined](Award%20Declined.md)
- The other bids are closed with [Bid Declined](Bid%20Declined.md)

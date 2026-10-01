---
type: message
category: procurement
status: v0.2
---

# Bid Declined

> A work requester declines a bid, with its reasons.

## Purpose

Added in 0.2. Tells a bidder that its bid will not be awarded, so that the bid no longer binds it, and gives it reasons it can learn from.

## Producer

The actor with `workRequester` role.

## Recipients

The bidder whose bid is declined.

## Payload

### `bidReference`
Type: bidUri, required

The `bidReference` established in [Bid Submitted](Bid%20Submitted.md).

### `declineReasons`
Type: array of structured entries, required (at least one)

Each entry:
- `reasonCategory` — enumeration, required: `price`, `turnaround`, `staffing`, `scopeFit`, `anotherBidAwarded`, `requestWithdrawn`, `other`
- `reasonNarrative` — optional string

## Worked example

```json
{
  "userContext": {"userIdentifier": "counsel@northwind.example", "roleAtActor": "Senior IP Counsel"},
  "payload": {
    "bidReference": "urn:ipproto:bid:tailspin-c1-001",
    "declineReasons": [
      {"reasonCategory": "anotherBidAwarded"},
      {"reasonCategory": "turnaround", "reasonNarrative": "Committed turnaround of 45 days exceeds the term we need to keep."}
    ]
  }
}
```

## Behavior on receipt

The bid no longer binds the bidder, whatever its `bindingUntil` says. The bidder's `bidder` role declaration for the milestone ends.

**Ranking stays private.** The message says that a bid was declined and why. It does not say where the bid ranked, how many bids there were, who won, or at what price.

A requester that may still want to promote a bid as runner-up does not decline it yet. Bids are typically declined once the award stands.

## Related messages

- Declines a [Bid Submitted](Bid%20Submitted.md)
- The other outcome of the requester's decision: [Award Proposed](Award%20Proposed.md)

---
type: message
category: procurement
status: v0.2
---

# Bid Withdrawn

> A bidder withdraws a bid it has submitted.

## Purpose

Added in 0.2. Takes a bid out of the bidding before an award stands, with the reason.

## Producer

The bidder that submitted the bid.

## Recipients

The work requester.

## Payload

### `bidReference`
Type: bidUri, required

The `bidReference` established in [Bid Submitted](Bid%20Submitted.md).

### `withdrawalReason`
Type: structured, required

- `reasonCategory` — enumeration, required: `conflictOfInterest`, `noCapacity`, `pricingError`, `scopeChanged`, `other`
- `reasonNarrative` — optional string

## Worked example

```json
{
  "payload": {
    "bidReference": "urn:ipproto:bid:tailspin-c1-001",
    "withdrawalReason": {
      "reasonCategory": "noCapacity",
      "reasonNarrative": "The proposed lead attorney is no longer available within the stated turnaround."
    }
  }
}
```

## Behavior on receipt

The bid can no longer be awarded. The bidder's `bidder` role declaration for the milestone ends, unless it submits a new bid before the deadline.

The protocol records the withdrawal. Whether a bidder may withdraw a bid that is still binding without consequence is for the terms under which it was invited.

A bid cannot be withdrawn once its award stands. From then on the milestone is committed, and stepping back is a matter of [Milestone Abandoned](../Milestone%20Lifecycle/Milestone%20Abandoned.md) or [Milestone Failed](../Milestone%20Lifecycle/Milestone%20Failed.md).

## Related messages

- Withdraws a [Bid Submitted](Bid%20Submitted.md)
- After [Award Proposed](Award%20Proposed.md), the bidder uses [Award Declined](Award%20Declined.md) instead

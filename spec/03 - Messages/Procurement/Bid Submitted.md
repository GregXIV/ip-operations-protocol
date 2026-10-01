---
type: message
category: procurement
status: v0.2
---

# Bid Submitted

> A bidder submits a binding bid in answer to a [Bid Invitation](Bid%20Invitation.md).

## Purpose

Added in 0.2. Carries a supplier's offer for one milestone: a binding price on the invitation's line items, a committed turnaround, and optionally who would do the work.

## Producer

The actor with `bidder` role on the milestone, after it has attested `clear` in [Conflict Check Attested](Conflict%20Check%20Attested.md).

## Recipients

The work requester. The orchestrator carries the bid and does not change it.

## Payload

### `bidReference`
Type: URI, required

Stable identifier `urn:ipproto:bid:{uuid}`. The award and decline messages refer to the bid by it.

### `invitationReference`
Type: messageUri, required

The [Bid Invitation](Bid%20Invitation.md) the bid answers.

### `price`
Type: [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md), required

With two fields that are optional elsewhere required here:

- `lineItems` — one line for each line item type of the invitation's `lineItemTemplate`
- `bindingUntil` — how long the bid holds

### `committedTurnaroundDays`
Type: decimal, required

The number of days from the award to delivery that the bidder commits to. Becomes the `delivery` service level of the milestone when the award stands.

### `staffing`
Type: array of structured entries, optional

Who would do the work. Each entry: `roleAtActor`, optional `qualification`, optional `userContext` ([User Context](../../02%20-%20Foundational%20Structures/User%20Context.md)) where the bidder names the person.

### `comments`
Type: string, optional

## Worked example

```json
{
  "userContext": {"userIdentifier": "m.hale@woodgrove-ip.example", "roleAtActor": "Partner"},
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:bi-001-..."},
  "payload": {
    "bidReference": "urn:ipproto:bid:woodgrove-c1-001",
    "invitationReference": "urn:ipproto:message:bi-001-...",
    "price": {
      "amount": 9800.00,
      "currency": "EUR",
      "priceBasis": "capped",
      "lineItems": [
        {"lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 9200.00, "quantity": 23, "note": "Hours at blended rate, capped"},
        {"lineItemType": "urn:ipproto:lineItem:disbursement", "amount": 600.00}
      ],
      "officialFeesIncluded": false,
      "bindingUntil": "2026-11-30T17:00:00Z"
    },
    "committedTurnaroundDays": 30,
    "staffing": [
      {"roleAtActor": "Lead attorney", "qualification": "European Patent Attorney, 14 years in opposition practice"},
      {"roleAtActor": "Associate", "qualification": "European Patent Attorney"}
    ],
    "comments": "Reply to be filed two weeks before the term set by the Opposition Division."
  }
}
```

## Behavior on receipt

**A bid is binding** until `bindingUntil`. Until then the requester may award on it with [Award Proposed](Award%20Proposed.md).

**A later bid replaces an earlier one.** A Bid Submitted for the same invitation by the same bidder, under a new `bidReference`, replaces that bidder's earlier bid. Only the latest bid can be awarded.

A bid that arrives after `bidDeadline` is not rejected by the protocol. Whether the requester still considers it is the requester's choice.

The requester compares bids and ranks them by its own method. Neither the method nor the ranking is exchanged.

## Related messages

- Answers [Bid Invitation](Bid%20Invitation.md); requires a `clear` [Conflict Check Attested](Conflict%20Check%20Attested.md)
- Taken back by [Bid Withdrawn](Bid%20Withdrawn.md)
- Answered by [Award Proposed](Award%20Proposed.md) or [Bid Declined](Bid%20Declined.md)

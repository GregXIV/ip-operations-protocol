---
type: foundational
status: v0.3
---

# Agreed Price

> A binding price for a unit of work, as opposed to the estimates a milestone carries.

Added in 0.2. A [Milestone](Milestone.md) has always carried `estimates` — what the orchestrator expects the work to cost. An Agreed Price is what the parties are bound to: the catalogue price a customer ordered at, the price in an instruction to a provider, the price of a bid.

A price is carried as an amount with optional line items. How a supplier arrives at the amount stays its own business; the protocol standardizes how the price is exchanged, not how it is made (see [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md)).

Used as `agreedPrice` on a [Milestone](Milestone.md) and in a [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md), and as the `price` of a [Bid Submitted](../03%20-%20Messages/Procurement/Bid%20Submitted.md).

## Structure

### `amount`
Type: decimal, required

The price, in `currency`. What the amount stands for follows from `priceBasis`.

### `currency`
Type: ISO 4217 code, required

### `priceBasis`
Type: enumeration, required

- `fixed` — `amount` is the price of the work
- `capped` — `amount` is the ceiling; the amount invoiced may be lower, never higher
- `hourly` — `amount` is the agreed rate per hour; the total follows from the hours worked

Closed enumeration.

### `lineItems`
Type: array of structured entries, optional

Breaks the price into lines, so that prices and bids can be compared line by line. Each entry:
- `lineItemType` — URI, required. The kind of line
- `amount` — decimal, required, in the price's `currency`
- `quantity` — optional decimal: pages, words, classes, hours
- `note` — optional string

Standard line item types in `urn:ipproto:lineItem:` namespace:

- `professionalFee` — the supplier's fee for its own work
- `translation` — translation cost
- `officialFee` — fees of an office or other authority
- `handling` — a charge for passing work or payments on
- `disbursement` — other costs passed through at cost: couriers, certified copies, legalization
- `subscriptionFee` — the recurring fee of a subscription, such as an application licence or a watch service (added in 0.3). Used on invoice lines that carry a `subscriptionReference`

Custom line item types allowed through namespaced URNs. The same vocabulary names the `lineItemTemplate` of a [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md) and the lines of an [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md).

For `fixed` and `capped` prices the line item amounts add up to `amount`. An `hourly` price has no sum to check.

### `officialFeesIncluded`
Type: boolean, required

- `true` — official fees are inside `amount`. If line items are given, an `officialFee` line shows their share
- `false` — official fees are passed through at cost on top of `amount` and appear as `officialFee` lines of the invoice. No `officialFee` line is part of the price

### `bindingUntil`
Type: ISO 8601 datetime, optional

How long an offer or a bid holds. Required in a bid. Absent on a price that is already agreed.

### `agreementReference`
Type: string, optional

The catalogue entry, terms version or contract the price comes from. In a catalogue order it names the offer the customer accepted — the `offerReference` of [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md).

## Worked example — catalogue price on a milestone

```json
{
  "amount": 2140.00,
  "currency": "EUR",
  "priceBasis": "fixed",
  "lineItems": [
    {"lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 620.00},
    {"lineItemType": "urn:ipproto:lineItem:translation", "amount": 1180.00, "quantity": 21, "note": "Full specification into Spanish, 21 pages"},
    {"lineItemType": "urn:ipproto:lineItem:officialFee", "amount": 260.00},
    {"lineItemType": "urn:ipproto:lineItem:handling", "amount": 80.00}
  ],
  "officialFeesIncluded": true,
  "agreementReference": "meridian-catalogue-2026#ep-validation"
}
```

## Worked example — price of a bid

```json
{
  "amount": 9800.00,
  "currency": "EUR",
  "priceBasis": "capped",
  "lineItems": [
    {"lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 9200.00, "quantity": 23, "note": "Hours at blended rate, capped"},
    {"lineItemType": "urn:ipproto:lineItem:disbursement", "amount": 600.00}
  ],
  "officialFeesIncluded": false,
  "bindingUntil": "2026-11-30T17:00:00Z"
}
```

## Behavior

An Agreed Price does not replace `estimates`. A milestone may carry both; once `agreedPrice` is present it is the figure that invoices and payments are measured against.

A milestone gains its Agreed Price on one of three paths:

- **Catalogue order.** The orchestrator's [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) carries one `agreedPrice` per milestone. The customer commits, or has pre-authorized the order (see [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md)).
- **Instruction.** A [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) carries the price; [Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md) binds both sides to it.
- **Award.** A bid's `price` becomes the milestone's `agreedPrice` when both sides have sent [Award Confirmed](../03%20-%20Messages/Procurement/Award%20Confirmed.md).

The protocol does not compare prices, score them or check them against a benchmark. It carries them.

## See also

- [Milestone](Milestone.md) — carries `agreedPrice` beside `estimates`
- [Service Level](Service%20Level.md) — the clock agreed together with the price
- [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) — why pricing models stay out while binding prices are exchanged
- [Conventions](../01%20-%20Front%20Matter/Conventions.md) — the `urn:ipproto:lineItem:` namespace

---
type: foundational
status: v0.8
---

# Agreed Price

> A binding price for a unit of work, as opposed to the estimates a milestone carries.

Added in 0.2. A [Milestone](Milestone.md) has always carried `estimates` — what the orchestrator expects the work to cost. An Agreed Price is what the parties are bound to: the catalogue price a customer ordered at, the price in an instruction to a provider, the price of a bid.

A price is carried as an amount with optional line items. How a supplier arrives at the amount stays its own business; the protocol standardizes how the price is exchanged, not how it is made (see [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md)).

Used as `agreedPrice` on a [Milestone](Milestone.md), in a [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) and in a [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md), and as the `price` of a [Bid Submitted](../03%20-%20Messages/Procurement/Bid%20Submitted.md).

Since 0.7 a price can also carry what a mandate for a whole matter usually needs: rates per role or per person, a budget beside the price, a flat fee per period, and a statutory fee schedule as a floor (decisions 82 to 85). Each is optional, and a 0.6 price is a valid 0.7 price.

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
- `hourly` — `amount` is the agreed rate per hour; the total follows from the hours worked. With a `rateTable`, `amount` is the rate for time the table does not cover (since 0.7)
- `periodicFlat` — `amount` is a flat fee for each period of `periodicity`, for as long as the agreement runs: a monthly fee for conducting a matter, a retainer. Added in 0.7

Closed enumeration. `periodicFlat` was added in 0.7 (decision 82); a 0.6 receiver that validates strictly rejects it.

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
- `officialFee` — fees of an office or other authority, including the fees of a court (stated in 0.7)
- `handling` — a charge for passing work or payments on
- `disbursement` — other costs passed through at cost: couriers, certified copies, legalization
- `subscriptionFee` — the recurring fee of a subscription, such as an application licence or a watch service (added in 0.3). Used on invoice lines that carry a `subscriptionReference`

Custom line item types allowed through namespaced URNs. The same vocabulary names the `lineItemTemplate` of a [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md) and the lines of an [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md).

For `fixed` and `capped` prices the line item amounts add up to `amount`. An `hourly` price has no sum to check, and neither has a `periodicFlat` price: its lines, where given, break down the fee of one period and add up to `amount`.

### `periodicity`
Type: enumeration, conditional

Added in 0.7. Required when `priceBasis` is `periodicFlat`, and not used otherwise. How often the flat fee falls due:

- `monthly`
- `quarterly`
- `semiAnnual`
- `annual`

Closed enumeration. When the first period starts and how a part period is charged are terms of the agreement (`agreementReference`), not of the price.

### `rateTable`
Type: array of structured entries, optional

Added in 0.7 (decision 83). The rates for time-based work, per role or per person. Used with `priceBasis` `hourly` and `capped`; a `fixed` or `periodicFlat` price does not carry one. Each entry:

- `rateRole` — URI, conditional: the role whose time the rate applies to. Standard values in `urn:ipproto:rateRole:` (see below); custom roles through namespaced URNs
- `timekeeper` — string, conditional: the provider's own identifier for one person, such as initials or a staff number
- `rate` — decimal, required, in the price's `currency`
- `rateUnit` — enumeration, optional: `hour` (the default) or `day`
- `note` — optional string

Each entry has `rateRole`, `timekeeper` or both; with both, the rate applies to that person in that role. A timekeeper entry takes precedence over a role entry for the same person.

Standard rate roles in `urn:ipproto:rateRole:`: `partner`, `counsel`, `seniorAssociate`, `associate`, `patentAttorney`, `trainee`, `paralegal`, `technicalExpert`.

How the table relates to `amount`:

- `hourly`: `amount` is the rate for time of a role or person the table does not list. Where the table covers every role the provider will bill, `amount` repeats the highest rate of the table, so that no time is charged above the table.
- `capped`: `amount` stays the ceiling. The table says how time is valued below it.

A timekeeper is named by the provider's own identifier, not by a full name, unless the requester needs the name for its own purposes; see *Natural persons* in [Entity Reference](Entity%20Reference.md).

Since 0.8 an invoice line that charges time names the same `timekeeper` and `rateRole`, so that the payor can check its `unitPrice` against this table (see *Line detail* in [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md); decision 95).

### `budget`
Type: structured, optional

Added in 0.7 (decision 84). An amount the parties expect the work to cost and have agreed what happens when it is reached. It is not the price:

- `amount` — decimal, required, in the price's `currency`
- `onExceeding` — enumeration, required:
  - `notify` — the provider tells the requester before the budget is exceeded and carries on
  - `approvalRequired` — the provider does no work that would exceed the budget until the requester has agreed a new one
- `note` — optional string

Closed enumeration for `onExceeding`.

A budget differs from a cap. Under `capped` the amount invoiced may never exceed `amount`, whatever is agreed later. A budget limits nothing that is invoiced: work done within the budget, or after the requester agreed to exceed it, is charged at the price. It also differs from the `estimates` of a [Milestone](Milestone.md), which are one side's expectation and bind nobody. A budget is carried beside an `hourly`, `capped` or `periodicFlat` price; a `fixed` price needs none. Under a `capped` price a budget, where given, is below the cap.

How the provider tells the requester that the budget is about to be reached stays outside the protocol, as free-text messaging does (decision 42). A new budget the parties agree is a change to the price: a [Data Assertion](Data%20Assertion.md) on the `agreedPrice` of the milestone, or a new [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) for the workstream.

### `statutoryFeeFloor`
Type: structured, optional

Added in 0.7 (decision 85). Some jurisdictions set the fees of counsel by a statutory fee schedule, which the parties may not undercut in some proceedings, or which a court applies when it awards costs. A price may name such a schedule as its floor:

- `feeSchedule` — URI, required: the schedule, as a namespaced URN of the authority that defines it, with its version where the authority versions it. The protocol defines no standard values
- `valueOfMatter` — structured, optional, with `amount` and `currency`: the value on which the schedule computes the fee, where it does
- `note` — optional string

The fee charged under the price is not below what the schedule yields for the work done. Where the price would yield less, the schedule governs. The protocol does not compute the statutory fee and does not check it; the schedule is named so that both parties, and a court assessing costs, know which floor applies.

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

## Worked example — a mandate priced by the hour, with a rate table and a budget

Added in 0.7. The price of a [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) for a dispute before a court: time at the rates of the table, a budget for the first instance after which the client wants to be asked, and a statutory fee schedule as the floor. The schedule's URN is fictional.

```json
{
  "amount": 520.00,
  "currency": "EUR",
  "priceBasis": "hourly",
  "rateTable": [
    {"rateRole": "urn:ipproto:rateRole:partner", "rate": 520.00},
    {"rateRole": "urn:ipproto:rateRole:associate", "rate": 340.00},
    {"rateRole": "urn:ipproto:rateRole:patentAttorney", "rate": 410.00},
    {"rateRole": "urn:ipproto:rateRole:paralegal", "rate": 140.00},
    {"timekeeper": "WG-017", "rateRole": "urn:ipproto:rateRole:associate", "rate": 380.00, "note": "Senior associate, agreed individually"}
  ],
  "budget": {"amount": 85000.00, "onExceeding": "approvalRequired", "note": "First instance up to and including the oral hearing"},
  "statutoryFeeFloor": {
    "feeSchedule": "urn:example-bar:feeSchedule:2026",
    "valueOfMatter": {"amount": 1500000.00, "currency": "EUR"}
  },
  "officialFeesIncluded": false,
  "agreementReference": "woodgrove-engagement-terms-2026#litigation"
}
```

## Worked example — a flat fee per month

Added in 0.7.

```json
{
  "amount": 2500.00,
  "currency": "EUR",
  "priceBasis": "periodicFlat",
  "periodicity": "monthly",
  "lineItems": [
    {"lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 2500.00, "note": "Conduct of the matter, per month"}
  ],
  "budget": {"amount": 30000.00, "onExceeding": "notify"},
  "officialFeesIncluded": false
}
```

## Behavior

An Agreed Price does not replace `estimates`. A milestone may carry both; once `agreedPrice` is present it is the figure that invoices and payments are measured against.

A milestone gains its Agreed Price on one of three paths:

- **Catalogue order.** The orchestrator's [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) carries one `agreedPrice` per milestone. The customer commits, or has pre-authorized the order (see [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md)).
- **Instruction.** A [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) carries the price; [Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md) binds both sides to it.
- **Award.** A bid's `price` becomes the milestone's `agreedPrice` when both sides have sent [Award Confirmed](../03%20-%20Messages/Procurement/Award%20Confirmed.md).

**Under a mandate.** Since 0.7 a [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) may carry the price of the whole matter. Where that price is `hourly`, `capped` or `periodicFlat`, a milestone the provider adds within the mandate's scope is charged under it and needs no `agreedPrice` of its own. A milestone that is to be charged otherwise, a fixed fee for one filing, carries its own.

The protocol does not compare prices, score them or check them against a benchmark. It carries them.

## See also

- [Milestone](Milestone.md) — carries `agreedPrice` beside `estimates`
- [Service Level](Service%20Level.md) — the clock agreed together with the price
- [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) — a price for a whole matter
- [Non-Scope](../01%20-%20Front%20Matter/Non-Scope.md) — why pricing models stay out while binding prices are exchanged
- [Conventions](../01%20-%20Front%20Matter/Conventions.md) — the `urn:ipproto:lineItem:` and `urn:ipproto:rateRole:` namespaces

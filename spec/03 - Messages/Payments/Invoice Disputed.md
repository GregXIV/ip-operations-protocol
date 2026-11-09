---
type: message
category: payments
status: v0.8
---

# Invoice Disputed

> A payor disputes an [Invoice Issued](Invoice%20Issued.md), with the reason.

## Purpose

Added in 0.5. Tells the payee that the payor does not accept an invoice as issued, and why. Until 0.5 the message set carried the invoice and its payment, and nothing in between: a payor that would not pay an invoice had no way to say so in the protocol.

**Acceptance has no message.** An invoice that the payor does not dispute stands. Where the parties pay through the protocol, [Payment Authorized](Payment%20Authorized.md) is the payor's affirmative step; where payment is made outside it, for instance by the payor's ERP system, the protocol records only the absence of a dispute. See the payment note of the orchestrator profile in [Conformance](../../01%20-%20Front%20Matter/Conformance.md).

## Producer

The actor with `payor` assignment that received the invoice.

## Recipients

The payee that issued the invoice. The message belongs to the workstream of the invoice and, like the invoice, is not addressed to anyone outside it (see the addressing rule of [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md)).

## Payload

### `invoiceReference`
Type: URI, required

The `invoiceReference` of the [Invoice Issued](Invoice%20Issued.md) being disputed. The envelope's `correlatedToMessageUri` names that message.

### `disputedAt`
Type: ISO 8601 datetime, required

When the payor decided to dispute the invoice.

### `disputeReason`
Type: structured, required

- `reasonCategory` — enumeration, required:
  - `amountNotAgreed` — a line or the total departs from the `agreedPrice` of the milestone or from the `commercialTerms` of the subscription
  - `workNotCompleted` — a line charges a milestone that is not complete, or a deliverable the payor has not accepted
  - `notOrderedByPayor` — the invoice charges work or a subscription the payor did not order, or is addressed to the wrong payor
  - `duplicateInvoice` — the charge was invoiced before
  - `taxTreatmentIncorrect` — the tax treatment, rate or amount is wrong
  - `formalDefect` — the invoice lacks what the payor needs to process it, such as the payor's own tax identification number or an order reference
  - `other`
- `reasonNarrative` — optional string. Strongly recommended: the payee acts on it

Closed enumeration.

### `disputedLines`
Type: array, optional (at least one entry when present)

The lines the dispute concerns, where it does not concern the whole invoice. Each entry:
- `lineIndex` — integer, conditional. The position of the line in the invoice's `invoiceLines`, counted from 0
- `lineId` — string, conditional. Added in 0.8. The `lineId` the payee gave the line
- `note` — optional string

Each entry names its line by `lineIndex`, `lineId` or both. Until 0.8 invoice lines carried no identifier of their own, so a line was named by its position in the message that issued it, and `lineIndex` was required. Since 0.8 an invoice line may carry a `lineId` (decision 95), and a line that has one may be named by it (decision 96). `lineIndex` keeps working for every invoice, with or without `lineId`s. Where an entry carries both, they name the same line; a payee that finds they do not follows `lineId`. A line without a `lineId` can only be named by `lineIndex`.

### `disputedAmount`
Type: money, optional

The part of `totalAmount` the payor disputes, in the invoice's currency. Absent where the dispute concerns the whole invoice or no amount (a formal defect).

## Worked example

The orchestrator cannot book an agent's invoice that applies the reverse charge without stating the orchestrator's VAT identification number.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:fabrikam-patentes", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "correlation": {
    "correlatedToMessageUri": "urn:ipproto:message:invoiceIssued-example-0001",
    "workstreamUri": "urn:ipproto:workstream:b-agent-es-001"
  },
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:fabrikam-2026-3381",
    "disputedAt": "2026-11-11T09:15:00Z",
    "disputeReason": {
      "reasonCategory": "formalDefect",
      "reasonNarrative": "The invoice applies the reverse charge but the document does not state our VAT identification number. We cannot book it as it stands."
    }
  }
}
```

The full message is `invoice-disputed.example.json` in `schemas/examples/`.

## Worked example — a time entry disputed by its `lineId`

Added in 0.8. The client accepts four of the six hours an associate charged for a section of the statement of claim and disputes the rest. The line is named by its `lineId`, and by its position as well, so that a payee that does not use `lineId`s still finds it. The disputed amount includes the tax on the two hours.

```json
{
  "originatingActor": "urn:ipproto:actor:northwind-industries",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:woodgrove-ip", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "confidentiality": {"level": "confidential"},
  "correlation": {
    "correlatedToMessageUri": "urn:ipproto:message:invoiceIssued-example-0010",
    "workstreamUri": "urn:ipproto:workstream:inf-0001"
  },
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:woodgrove-2027-0042",
    "disputedAt": "2027-02-10T08:40:00Z",
    "disputeReason": {
      "reasonCategory": "amountNotAgreed",
      "reasonNarrative": "We agreed four hours for this section of the statement of claim. We accept 4.0 of the 6.0 hours charged."
    },
    "disputedLines": [
      {"lineId": "T-0002", "lineIndex": 1, "note": "2.0 hours above the agreed estimate"}
    ],
    "disputedAmount": {"amount": 904.40, "currency": "EUR"}
  }
}
```

The full message is `invoice-disputed-by-line-id.example.json` in `schemas/examples/`.

## Behavior on receipt

The payee either cancels the invoice with [Invoice Cancelled](Invoice%20Cancelled.md), and issues a corrected one where something is still owed, or holds to it. Holding to it needs no message; the parties settle the disagreement between themselves, as before. The protocol does not decide who is right.

A dispute ends in one of three ways: the payee cancels the invoice; the payor authorizes payment of the invoice as issued, where payment runs through the protocol; or the parties settle outside the protocol and the invoice is paid outside it. The protocol has no message that withdraws a dispute.

A payor may dispute the same invoice again, for another reason. Each Invoice Disputed stands on its own.

## Related messages

- Answers [Invoice Issued](Invoice%20Issued.md)
- Answered by [Invoice Cancelled](Invoice%20Cancelled.md), where the payee accepts the dispute
- Distinct from the messages under Disputes, such as [Asset Authority Dispute](../Disputes/Asset%20Authority%20Dispute.md), which concern authority over records, identity resolution and unconfirmed actions, not the commercial terms between two actors

---
type: message
category: payments
status: v0.5
---

# Invoice Disputed

> A payor disputes an [Invoice Issued](Invoice%20Issued.md), with the reason.

## Purpose

Added in 0.5. Tells the payee that the payor does not accept an invoice as issued, and why. Until 0.5 the message set carried the invoice and its payment, and nothing in between: a payor that would not pay an invoice had no way to say so in the protocol.

**Acceptance has no message.** An invoice that the payor does not dispute stands. Where the parties pay through the protocol, [Payment Authorized](Payment%20Authorized.md) is the payor's affirmative step; where payment is made outside it, for instance by the payor's ERP system, the protocol records only the absence of a dispute.

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
- `lineIndex` — integer, required. The position of the line in the invoice's `invoiceLines`, counted from 0
- `note` — optional string

Invoice lines carry no identifier of their own, so a line is named by its position in the message that issued it.

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

## Behavior on receipt

The payee either cancels the invoice with [Invoice Cancelled](Invoice%20Cancelled.md), and issues a corrected one where something is still owed, or holds to it. Holding to it needs no message; the parties settle the disagreement between themselves, as before. The protocol does not decide who is right.

A dispute ends in one of three ways: the payee cancels the invoice; the payor authorizes payment of the invoice as issued, where payment runs through the protocol; or the parties settle outside the protocol and the invoice is paid outside it. The protocol has no message that withdraws a dispute.

A payor may dispute the same invoice again, for another reason. Each Invoice Disputed stands on its own.

## Related messages

- Answers [Invoice Issued](Invoice%20Issued.md)
- Answered by [Invoice Cancelled](Invoice%20Cancelled.md), where the payee accepts the dispute
- Distinct from the messages under Disputes, such as [Asset Authority Dispute](../Disputes/Asset%20Authority%20Dispute.md), which concern authority over records, identity resolution and unconfirmed actions, not the commercial terms between two actors

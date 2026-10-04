---
type: message
category: payments
status: v0.5
---

# Invoice Cancelled

> A payee cancels an [Invoice Issued](Invoice%20Issued.md) it issued, and names the replacement where there is one.

## Purpose

Added in 0.5. Withdraws an invoice from what the payor owes. Until 0.5 an invoice, once announced, could not be taken back in the protocol: a payee that found an error, or accepted a payor's objection, could only send a second invoice and leave the payor to work out which one counted.

An invoice is never changed. A correction is a cancellation and a new [Invoice Issued](Invoice%20Issued.md) with a new `invoiceReference` and normally a new `invoiceNumber`.

## Producer

The payee of the invoice.

## Recipients

The payor of the invoice.

## Payload

### `invoiceReference`
Type: URI, required

The `invoiceReference` of the [Invoice Issued](Invoice%20Issued.md) being cancelled. Where the cancellation answers an [Invoice Disputed](Invoice%20Disputed.md), the envelope's `correlatedToMessageUri` names that message; otherwise it names the Invoice Issued.

### `cancelledAt`
Type: ISO 8601 datetime, required

### `cancellationReason`
Type: structured, required

- `reasonCategory` — enumeration, required:
  - `issuedInError` — the payee found the error itself: wrong payor, wrong amount, a duplicate
  - `disputeAccepted` — the payee accepts an [Invoice Disputed](Invoice%20Disputed.md)
  - `workAbandoned` — the milestone or subscription charged was abandoned or terminated, and the charge falls away
  - `other`
- `reasonNarrative` — optional string

Closed enumeration.

### `replacementInvoiceReference`
Type: URI, optional

The `invoiceReference` of the [Invoice Issued](Invoice%20Issued.md) that replaces the cancelled one, where the payee issues a replacement. The payee assigns that reference, so it may name it before the replacement is sent.

### `cancellationDocument`
Type: [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URI, optional

Where the law that applies to the payee requires a document to cancel an invoice, such as a credit note, that document, of document type `urn:ipproto:doctype:creditNote` (added in 0.5). As with the invoice, the document is what counts in the legal sense; this message is its structured announcement.

## Worked example

The agent accepts the dispute over its invoice and issues a credit note and a replacement.

```json
{
  "originatingActor": "urn:ipproto:actor:fabrikam-patentes",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:meridian-ip-group", "expectedRole": "urn:ipproto:role:payor"}
  ],
  "correlation": {
    "correlatedToMessageUri": "urn:ipproto:message:invoiceDisputed-example-0001",
    "workstreamUri": "urn:ipproto:workstream:b-agent-es-001"
  },
  "payload": {
    "invoiceReference": "urn:ipproto:invoice:fabrikam-2026-3381",
    "cancelledAt": "2026-11-12T16:00:00Z",
    "cancellationReason": {
      "reasonCategory": "disputeAccepted",
      "reasonNarrative": "Reissued with the payor's VAT identification number as FP-2026-3402."
    },
    "replacementInvoiceReference": "urn:ipproto:invoice:fabrikam-2026-3402",
    "cancellationDocument": "urn:ipproto:document:fabrikam-cn-2026-0117"
  }
}
```

The full message is `invoice-cancelled.example.json` in `schemas/examples/`.

## Behavior on receipt

The payor removes the invoice from what it owes and does not pay it. An invoice already paid is not undone by this message; a refund is settled between the parties.

A cancelled invoice stays cancelled. It is not reinstated; a payee that wants the charge back issues a new invoice.

## Related messages

- Cancels [Invoice Issued](Invoice%20Issued.md)
- May answer [Invoice Disputed](Invoice%20Disputed.md)
- A replacement follows as a new [Invoice Issued](Invoice%20Issued.md)

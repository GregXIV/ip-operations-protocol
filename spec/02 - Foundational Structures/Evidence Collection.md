---
type: foundational
status: v0.1
---

# Evidence Collection

> Common sub-structure for messages carrying supporting documents or attestations.

Extracted during consolidation. Used in [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md), [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md), [Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md), [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md), and [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md).

## Structure

### `evidenceItems`
Type: array of structured entries, required (at least one when collection is included)

Each item:
- `evidenceType` — URI in `urn:ipproto:evidence:` namespace. Standard types: `epoConfirmationNumber`, `epoSignedReceipt`, `bankingTransactionReference`, `officeFeeReceipt`, `screenshotOfReceipt`, `signedPdfReceipt`, `registerHyperlink`. Custom types in namespaced URNs.
- `evidenceContent` — structured, type-specific. Sub-fields vary: `documentReference` (when evidence is a document), `confirmationNumber` (string identifier), `transactionReference` (banking reference), `evidenceNarrative` (narrative description), `evidenceCapturedAt` (ISO 8601 datetime)
- `evidenceProvenance` — optional, structured: `captureMethod` (`automatedSystemExport`, `manualEntry`, `screenshot`, `signedReceipt`), `captureUserContext` (optional [User Context](User%20Context.md)), `integrityHash` (when available)

## Worked example — banking and office evidence

```json
{
  "evidenceItems": [
    {
      "evidenceType": "urn:ipproto:evidence:bankingTransactionReference",
      "evidenceContent": {
        "transactionReference": "DM-TX-2026-07-02-09431",
        "evidenceCapturedAt": "2026-07-02T11:25:00Z",
        "bankingProvider": "the firm's commercial bank"
      },
      "evidenceProvenance": {
        "captureMethod": "automatedSystemExport"
      }
    },
    {
      "evidenceType": "urn:ipproto:evidence:officeFeeReceipt",
      "evidenceContent": {
        "documentReference": "urn:ipproto:document:epo-fee-receipt-...",
        "evidenceCapturedAt": "2026-07-02T11:30:00Z"
      }
    }
  ]
}
```

## Worked example — confirmation evidence

```json
{
  "evidenceItems": [
    {
      "evidenceType": "urn:ipproto:evidence:epoConfirmationNumber",
      "evidenceContent": {
        "confirmationNumber": "EPO-FILING-2026-12345-DE",
        "evidenceCapturedAt": "2026-06-12T14:31:00Z"
      },
      "evidenceProvenance": {
        "captureMethod": "automatedSystemExport"
      }
    }
  ]
}
```

## Behavior

The protocol does not validate evidence content — the integrity, completeness, and accuracy of evidence are determined by receivers based on their own policies. Evidence that proves insufficient on review may trigger an [Action Confirmation Dispute](../03%20-%20Messages/Disputes/Action%20Confirmation%20Dispute.md) or other dispute event.

## See also

The messages that use Evidence Collection:
- [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)
- [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md)
- [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md) (for producer attestation evidence)
- [Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md) (for finding source evidence)
- [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) (for source documents)

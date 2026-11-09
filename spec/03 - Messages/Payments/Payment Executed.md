---
type: message
category: payments
status: v0.8
---

# Payment Executed

> Payment agent confirms execution of an authorized payment.

## Purpose

The agent's claim that the payment was executed, with banking-system evidence. The execution itself is outside the protocol; the claim is structured.

## Producer

The actor with `paymentAgent` role.

## Recipients

The original payor; the orchestrator.

Since 0.8 also the payee, where the payee is an actor and the payment settles its invoices (decision 104). It is the only message in which the payee learns, through the protocol, that its invoice was paid.

## Payload

### `paymentReference`
Type: paymentUri, required

The `paymentReference` established in [Payment Authorized](Payment%20Authorized.md).

### `authorizationReference`
Type: messageUri, required

The [Payment Authorized](Payment%20Authorized.md) this responds to.

### `executedAt`
Type: ISO 8601 datetime, required

### `executingUserContext`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), strongly recommended

For high-value payments often required by compliance.

### `executedAmount`
Type: structured, required

- `amount` — should match authorized; if not, `executionDeviation` required
- `currency` — should match authorized

### `executionDeviation`
Type: structured, optional

When executed amount differs from authorized:
- `originalAmount`, `executedAmount`, `deviationReason`
- `deviationApprovalReference` — when approval obtained
- `requiresPostExecutionApproval` — boolean

### `invoiceReferences`
Type: array of structured entries, optional (at least one entry when present)

Added in 0.8 (decision 104). The invoices the payment settled, with the same shape as in [Payment Authorized](Payment%20Authorized.md): `invoiceReference` (required) and `appliedAmount` (optional money). Normally repeated from the authorization. Where the payment executed only partly, `appliedAmount` states what reached each invoice.

### `executionEvidence`
Type: [Evidence Collection](../../02%20-%20Foundational%20Structures/Evidence%20Collection.md), required

Evidence per the authorized message's `expectedConfirmation`.

### `executionOutcome`
Type: enumeration, required

- `successfullyExecuted`
- `executionFailed`
- `executionPartial`
- `executionPending`

### `failureDetails`
Type: structured, conditional

Required when `executionOutcome != successfullyExecuted`:
- `failureCategory` — `insufficientFunds`, `bankingSystemError`, `payeeRejection`, `complianceHold`, `currencyConversionFailure`, `other`
- `failureNarrative`, `recoverable`, `suggestedRemediation`

## Worked example — successful execution

```json
{
  "userContext": {"userIdentifier": "treasury-ops@meridian-ip-group.example", "roleAtActor": "Treasury Operations"},
  "payload": {
    "paymentReference": "urn:ipproto:payment:p-001-grant-fee-...",
    "authorizationReference": "urn:ipproto:message:pa-001-...",
    "executedAt": "2026-07-02T11:25:00Z",
    "executedAmount": {"amount": 1080.00, "currency": "EUR"},
    "executionEvidence": {
      "evidenceItems": [
        {
          "evidenceType": "urn:ipproto:evidence:bankingTransactionReference",
          "evidenceContent": {
            "transactionReference": "DM-TX-2026-07-02-09431",
            "evidenceCapturedAt": "2026-07-02T11:25:00Z",
            "bankingProvider": "the firm's commercial bank"
          },
          "evidenceProvenance": {"captureMethod": "automatedSystemExport"}
        },
        {
          "evidenceType": "urn:ipproto:evidence:officeFeeReceipt",
          "evidenceContent": {
            "documentReference": "urn:ipproto:document:epo-fee-receipt-..."
          }
        }
      ]
    },
    "executionOutcome": "successfullyExecuted"
  }
}
```

## Worked example — execution failure

```json
{
  "payload": {
    "paymentReference": "urn:ipproto:payment:p-001-grant-fee-...",
    "executedAmount": {"amount": 0.00, "currency": "EUR"},
    "executionOutcome": "executionFailed",
    "failureDetails": {
      "failureCategory": "complianceHold",
      "failureNarrative": "Cost center authorization expired 2026-06-30; payment cannot execute.",
      "recoverable": true,
      "suggestedRemediation": "Northwind Industries to issue updated PaymentAuthorized with current fiscal-year cost-center allocation."
    }
  }
}
```

## Worked example — an invoice paid, reported to the payee

Added in 0.8. The orchestrator pays the agent's replacement invoice and tells the agent, naming the invoice. The full message is `payment-executed-invoice.example.json` in `schemas/examples/`.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:fabrikam-patentes", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "payload": {
    "paymentReference": "urn:ipproto:payment:meridian-ap-2026-11873",
    "authorizationReference": "urn:ipproto:message:paymentAuthorized-example-0002",
    "executedAt": "2026-12-04T14:02:00Z",
    "executedAmount": {"amount": 1490.00, "currency": "EUR"},
    "invoiceReferences": [
      {"invoiceReference": "urn:ipproto:invoice:fabrikam-2026-3402", "appliedAmount": {"amount": 1490.00, "currency": "EUR"}}
    ],
    "executionEvidence": {"evidenceItems": ["…"]},
    "executionOutcome": "successfullyExecuted"
  }
}
```

## Behavior on receipt

For office-fee payments, the milestone holds in `inProgress` until the corresponding [Register Event](../Steady-State%20Events/Register%20Event.md) confirms receipt. For non-office payments, the milestone typically completes at PaymentExecuted directly.

For failures, the milestone does not advance; the corporate must re-authorize. The protocol does not auto-retry.

**Payment status of an invoice is not tracked.** Since 0.8 a payment names the invoices it settles, and a payee that receives Payment Executed can match it. The protocol does not go further: it has no payee-side message that confirms receipt, and it keeps no status of an invoice as paid, part paid or overdue. Where the payor pays outside the protocol, as most do (see the payment note in [Conformance](../../01%20-%20Front%20Matter/Conformance.md)), the payee learns of the payment from its bank, and the protocol records only that the invoice was not disputed. A payee-side Payment Received was considered and not added (decision 104).

## Related messages

- Answers [Payment Authorized](Payment%20Authorized.md)
- Office-fee payments confirmed by [Register Event](../Steady-State%20Events/Register%20Event.md)
- Divergence: [Action Confirmation Dispute](../Disputes/Action%20Confirmation%20Dispute.md)

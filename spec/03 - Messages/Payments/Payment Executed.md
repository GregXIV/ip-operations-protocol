---
type: message
category: payments
status: v0.1
---

# Payment Executed

> Payment agent confirms execution of an authorized payment.

## Purpose

The agent's claim that the payment was executed, with banking-system evidence. The execution itself is outside the protocol; the claim is structured.

## Producer

The actor with `paymentAgent` role.

## Recipients

The original payor; the orchestrator.

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

## Behavior on receipt

For office-fee payments, the milestone holds in `inProgress` until the corresponding [Register Event](../Steady-State%20Events/Register%20Event.md) confirms receipt. For non-office payments, the milestone typically completes at PaymentExecuted directly.

For failures, the milestone does not advance; the corporate must re-authorize. The protocol does not auto-retry.

## Related messages

- Answers [Payment Authorized](Payment%20Authorized.md)
- Office-fee payments confirmed by [Register Event](../Steady-State%20Events/Register%20Event.md)
- Divergence: [Action Confirmation Dispute](../Disputes/Action%20Confirmation%20Dispute.md)

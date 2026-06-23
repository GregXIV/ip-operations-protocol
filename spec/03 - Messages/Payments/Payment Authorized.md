---
type: message
category: payments
status: v0.1
---

# Payment Authorized

> Payor authorizes a payment to be made on their behalf.

## Purpose

The corporate (or any payor) authorizes the payment agent (typically the service provider) to execute a payment. Carries everything needed for the agent to execute and for finance systems on both sides to reconcile.

## Producer

The actor with `payor` assignment.

## Recipients

The actor with `paymentAgent` role.

## Payload

### `paymentReference`
Type: URI, required

`urn:ipproto:payment:{uuid}`. Used in the corresponding [Payment Executed](Payment%20Executed.md) and any reconciliation events.

### `paymentPurpose`
Type: structured, required

- `purposeCategory` — URI: `officeFee`, `translationFee`, `representationFee`, `serviceProviderFee`, `thirdPartyCounselFee`, `custom` — all in `urn:ipproto:paymentPurpose:` namespace
- `purposeNarrative` — string
- `relatedMilestoneUri` — milestoneUri (most payments are milestone-scoped)
- `relatedSubscriptionUri` — when subscription-scoped

### `paymentAmount`
Type: structured, required

- `amount` — decimal
- `currency` — ISO 4217
- `amountBreakdown` — optional array of components
- `taxHandling` — optional structured

### `payee`
Type: structured, required

Two forms:
- Office fees: `payeeType: "officeAuthority"`, `officeCode`, `payeeIdentifier`
- Other: `payeeType: "actor"`, `payeeActorReference`, `payeeAccountReference`

### `paymentAgent`
Type: structured, required

- `agentActorReference` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md)
- `agentRoleDeclaration` — [Actor Role Declaration](../../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md)
- `executionAuthorityReference` — optional reference to underlying authorization

### `payorReferences`
Type: structured, required

- `purchaseOrderReference` — optional
- `costCenterReference` — optional
- `internalMatterReference` — optional
- `costAllocationDetails` — optional structured (free-form for finance systems)
- `payorTaxIdentification` — optional

### `executionWindow`
Type: structured, required

- `executeNotBefore` — optional
- `executeBy` — required
- `urgency` — `routine`, `expedited`, `urgent`

### `expectedConfirmation`
Type: structured, required

Same shape as in [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md).

### `expectedExternalConfirmation`
Type: structured, optional

For payments where an external system (typically the office's register) confirms receipt. Same shape as in [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md).

## Worked example — Phase 6 grant fee authorization

```json
{
  "userContext": {"userIdentifier": "counsel@northwind.example", "roleAtActor": "Senior IP Counsel"},
  "payload": {
    "paymentReference": "urn:ipproto:payment:p-001-grant-fee-...",
    "paymentPurpose": {
      "purposeCategory": "urn:ipproto:paymentPurpose:officeFee",
      "purposeNarrative": "EP grant fee for application 21712345.6",
      "relatedMilestoneUri": "urn:ipproto:milestone:m4-grant-fee"
    },
    "paymentAmount": {
      "amount": 1080.00,
      "currency": "EUR",
      "amountBreakdown": [{"componentDescription": "EP grant fee", "componentAmount": 1080.00, "componentCurrency": "EUR"}]
    },
    "payee": {
      "payeeType": "officeAuthority",
      "officeCode": "EP",
      "payeeIdentifier": "urn:ipproto:officePaymentEndpoint:epo:fee"
    },
    "paymentAgent": {
      "agentActorReference": "urn:ipproto:actor:meridian-ip-group",
      "agentRoleDeclaration": "urn:ipproto:roleDeclaration:dm-payment-agent-...",
      "executionAuthorityReference": "Northwind Industries-DM-MSA-2024-EU#payment-mandate"
    },
    "payorReferences": {
      "purchaseOrderReference": "Northwind Industries-PO-2026-04473",
      "costCenterReference": "Northwind Industries-CC-IP-COATINGS-DE",
      "internalMatterReference": "Northwind Industries-2021-0473-EP"
    },
    "executionWindow": {
      "executeBy": "2026-08-20T17:00:00Z",
      "urgency": "routine"
    },
    "expectedConfirmation": {
      "confirmationMessageType": "paymentExecuted",
      "confirmationDeadline": "2026-08-25T17:00:00Z",
      "evidenceExpectations": {
        "evidenceTypes": ["urn:ipproto:evidence:bankingTransactionReference", "urn:ipproto:evidence:officeFeeReceipt"],
        "evidenceMandatory": "required"
      }
    },
    "expectedExternalConfirmation": {
      "expectedRegisterEventType": "urn:ipproto:registerEvent:grantFeeReceived",
      "expectedRegisterEventWindow": {"minimumDelayDays": 1, "expectedDelayDays": 5, "maximumDelayDays": 21},
      "divergenceHandling": {
        "divergenceMessageType": "actionConfirmationDispute",
        "divergenceRoutingTarget": "urn:ipproto:actor:meridian-ip-group"
      }
    }
  }
}
```

## Behavior on receipt

The agent executes the payment through their banking infrastructure and produces [Payment Executed](Payment%20Executed.md). Without authorization, the agent has no authority to make the payment on the corporate's behalf.

## Related messages

- Followed by [Payment Executed](Payment%20Executed.md)
- Office-fee payments: confirmed by [Register Event](../Steady-State%20Events/Register%20Event.md)
- Divergence: [Action Confirmation Dispute](../Disputes/Action%20Confirmation%20Dispute.md)

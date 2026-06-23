---
type: message
category: subscriptions
status: v0.1
---

# Service Subscription Terminated

> Subscription is ended.

## Purpose

Terminates a subscription. Distinct from natural expiry — a subscription with `scopeEndDate` simply expires; this message is for early termination by decision (or for explicit closing of a naturally-completing subscription).

## Producer

The contract holder or subscriber depending on termination basis.

## Recipients

All actors involved.

## Payload

### `subscriptionReference`
Type: subscriptionUri, required

### `terminationDate`
Type: ISO 8601 datetime, required

### `terminationReason`
Type: structured, required

- `reasonCategory` — `subscriberWithdrawal`, `providerWithdrawal`, `assetStatusChange`, `commercialDispute`, `delegationCessation`, `policyChange`, `scopeNaturalCompletion`, `other`
- `reasonNarrative` — string
- `terminationInitiator` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI
- `terminationUserContext` — [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), recommended

### `effectiveTerminationTiming`
Type: structured, required

- `terminationType` — `immediate`, `endOfPeriod`, `customDate`, `gracefulShutdown`
- `effectiveDate` — ISO 8601 datetime
- `gracePeriodHandling` — optional structured

### `finalSettlement`
Type: structured, optional

- `outstandingObligations` — array (each: `obligationType` — `refund`/`proRataInvoice`/`terminationFee`/`noObligation`, amounts, due dates, owners)
- `finalReportProduction` — optional structured

### `postTerminationObligations`
Type: array, optional

Obligations surviving termination — audit-trail retention, late-arriving findings forwarding.

## Worked example — natural completion

```json
{
  "payload": {
    "subscriptionReference": "urn:ipproto:subscription:opposition-watch-001",
    "terminationDate": "2027-05-12T23:59:59Z",
    "terminationReason": {
      "reasonCategory": "scopeNaturalCompletion",
      "reasonNarrative": "EP opposition window closed 2027-05-12 with no oppositions filed.",
      "terminationInitiator": "urn:ipproto:actor:meridian-ip-group"
    },
    "effectiveTerminationTiming": {
      "terminationType": "customDate",
      "effectiveDate": "2027-05-12T23:59:59Z"
    },
    "finalSettlement": {
      "outstandingObligations": [
        {"obligationType": "noObligation", "obligationDescription": "Subscription prepaid; no refund."}
      ],
      "finalReportProduction": {
        "finalReportRequired": true,
        "finalReportDeliverableType": "urn:ipproto:deliverable:oppositionWatchSummary"
      }
    },
    "postTerminationObligations": [
      {
        "obligationType": "auditTrailRetention",
        "obligationDescription": "Watch findings retained for 7 years post-termination per MSA Section 8.3.",
        "obligationOwner": "urn:ipproto:actor:meridian-ip-group",
        "obligationDueUntil": "2034-05-12"
      }
    ]
  }
}
```

## Behavior on receipt

Receivers update subscription status. In-flight findings detected before termination but not yet delivered are forwarded per the post-termination obligations.

## Related messages

- Closes [Service Subscription Started](Service%20Subscription%20Started.md)
- May follow [Workstream Abandoned](../Workstream%20Lifecycle/Workstream%20Abandoned.md) for asset-status changes

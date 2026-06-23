---
type: message
category: steady-state-events
status: v0.1
---

# Service Finding

> Subscription produces a finding.

## Purpose

What subscriptions produce. Findings vary widely by subscription type — renewal monitoring deadline-approaching findings, competitor watch new-publication findings, opposition watch opposition-filed findings. The structure is uniform; what varies is the structured content the finding carries.

High-volume — every active subscription produces findings continuously. Designed for efficient processing.

## Producer

The subscription's operator (or contract holder when there is no operator delegation).

## Recipients

Per the subscription's `findingsConfiguration.findingRecipients`.

## Payload

### `findingReference`
Type: URI, required

`urn:ipproto:finding:{uuid}`.

### `producingSubscription`
Type: subscriptionUri, required

### `findingCategory`
Type: URI, required

Standard categories grouped by subscription type, in `urn:ipproto:finding:` namespace:
- Renewal: `renewalDeadlineApproaching`, `renewalDecisionRequired`, `renewalPaymentDue`, `renewalLapse`, `renewalRestoration`
- Opposition: `oppositionFiled`, `oppositionGroundsPublished`, `oppositionResponseDeadline`, `oppositionWindowClosed`
- Competitor: `competitorPublication`, `competitorGrant`, `competitorAssignment`, `competitorOpposition`
- Portfolio: `portfolioStatusChange`, `portfolioOwnershipChange`, `portfolioDeadlineApproaching`
- FTO: `ftoRiskIdentified`, `ftoStatusChange`

### `relatedAssetReferences`
Type: array of [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URIs, required

### `findingSeverity`
Type: enumeration, required

`informational`, `recommendation`, `warning`, `critical`.

### `findingTimestamp`
Type: ISO 8601 datetime, required

### `findingContent`
Type: structured, required

Category-specific content. Schemas live in a companion catalog document.

### `findingSource`
Type: structured, required

- `sourceType` — `registerEvent`, `automatedAnalysis`, `humanReview`, `combinedSourceDerivation`
- `sourceDocumentReferences` — optional [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) array
- `sourceRegisterEventReferences` — optional registerEvent message URIs
- `analysisUserContext` — optional for human review

### `recommendedActions`
Type: array, optional

Each entry: `actionDescription`, `actionCategory` (`urn:ipproto:findingAction:initiateWorkstream`, `authorizePayment`, `requestDeliverable`), `recommendedDeadline`, optional `recommendedExecutor`.

## Worked example — renewal deadline approaching

```json
{
  "payload": {
    "findingReference": "urn:ipproto:finding:renewal-de-2027-...",
    "producingSubscription": "urn:ipproto:subscription:renewal-mon-001",
    "findingCategory": "urn:ipproto:finding:renewalDeadlineApproaching",
    "relatedAssetReferences": ["urn:ipproto:asset:de-validation-..."],
    "findingSeverity": "warning",
    "findingTimestamp": "2027-01-15T08:00:00Z",
    "findingContent": {
      "targetAsset": "urn:ipproto:asset:de-validation-...",
      "renewalYear": 7,
      "deadlineDate": "2027-04-15",
      "daysUntilDeadline": 90,
      "currentRenewalFee": {"amount": 220.00, "currency": "EUR", "jurisdiction": "DE"},
      "lateRenewalSurcharge": {"amount": 50.00, "currency": "EUR", "graceWindowEndDate": "2027-10-15"},
      "recommendedAction": "Authorize payment of 7th-year renewal fee for DE validation."
    },
    "findingSource": {
      "sourceType": "automatedAnalysis"
    },
    "recommendedActions": [
      {
        "actionDescription": "Authorize payment of DE 7th-year renewal fee",
        "actionCategory": "urn:ipproto:findingAction:authorizePayment",
        "recommendedDeadline": "2027-04-01T17:00:00Z",
        "recommendedExecutor": "urn:ipproto:actor:northwind-industries"
      }
    ]
  }
}
```

## Worked example — opposition filed

```json
{
  "payload": {
    "findingCategory": "urn:ipproto:finding:oppositionFiled",
    "findingSeverity": "critical",
    "findingContent": {
      "targetAsset": "urn:ipproto:asset:7c4f9a82-...",
      "opponent": { /* Entity Reference for Henkel AG */ },
      "oppositionFilingDate": "2027-02-08",
      "oppositionDocumentReference": "urn:ipproto:document:opposition-notice-...",
      "responseDeadline": "2027-06-08"
    },
    "findingSource": {
      "sourceType": "registerEvent",
      "sourceRegisterEventReferences": ["urn:ipproto:registerEvent:opp-filed-..."]
    },
    "recommendedActions": [
      {
        "actionDescription": "Initiate opposition response workstream",
        "actionCategory": "urn:ipproto:findingAction:initiateWorkstream",
        "recommendedDeadline": "2027-03-01T17:00:00Z"
      }
    ]
  }
}
```

## Behavior on receipt

Critical-severity findings bypass aggregation and surface immediately. Recommended actions can trigger automated [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) proposals.

## Related messages

- Produced by [Service Subscription Started](../Subscriptions/Service%20Subscription%20Started.md)'s configured cadence
- Often references [Register Event](Register%20Event.md) as source
- May trigger [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) for follow-up workstreams

## See also

- ServiceFinding and [Register Event](Register%20Event.md) are not redundant. ServiceFinding carries operational interpretation, severity, and recommended actions; Register Event carries the legalStatus authority claim that no service provider can carry.

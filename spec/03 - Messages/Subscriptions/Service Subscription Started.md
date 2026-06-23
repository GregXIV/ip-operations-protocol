---
type: message
category: subscriptions
status: v0.1
---

# Service Subscription Started

> Long-running service is enrolled.

## Purpose

Establishes a subscription's parameters, authority claims, and finding cadence. Typically the closing milestone of a workstream that includes subscription enrollment (renewal monitoring, opposition watch enrolled in Phase 7 of the EP post-grant flow).

Subscriptions persist beyond the workstream that started them — they become first-class entities with their own audit trail, findings, and status.

## Producer

The actor providing the subscription (`subscriptionProvider` or `subscriptionContractHolder`).

## Recipients

The subscriber, optional operator (in delegation chains), payor.

## Payload

### `subscriptionReference`
Type: URI, required

`urn:ipproto:subscription:{uuid}`.

### `subscriptionType`
Type: URI, required

Standard types in `urn:ipproto:subscription:` namespace:
- `renewalMonitoring`, `oppositionWatch`, `portfolioMonitoring`, `competitorWatch`, `ftoMonitoring`, `correspondenceForwarding`, `custom`

### `subscriptionScope`
Type: structured, required

- `scopedAssetReferences` — array of [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URIs
- `scopedDefinition` — type-specific structured definition
- `scopeStartDate` — ISO 8601 datetime
- `scopeEndDate` — optional (omitted for indefinite)

### `actorAssignments`
Type: array, required

Each entry: `actorUri`, `roleDeclarationUri`, `assignmentType` (`subscriptionProvider`, `subscriptionContractHolder`, `subscriptionOperator`, `subscriber`, `payor`, `accountableTo`).

For delegation patterns (Meridian IP Group holds, D&A operates), separate `subscriptionContractHolder` and `subscriptionOperator` entries.

### `cadence`
Type: structured, required

- `cadenceType` — `eventDriven`, `periodic`, `hybrid`
- `periodicSchedule` — conditional: `intervalUnit`, `intervalCount`, `firstFindingDate`
- `eventTriggers` — conditional: array of `triggerType` (URN), `triggerScope`

### `commercialTerms`
Type: structured, required

- `feeStructure` — `flatPeriodicFee`, `perFindingFee`, `tieredFee`, `custom`
- `feeAmount` — type-specific
- `billingCadence` — `inAdvance`, `inArrears`, `perFinding`, `custom`
- `commercialAgreementReference` — string

### `findingsConfiguration`
Type: structured, required

- `findingDeliveryMethod` — `serviceFinding`, `aggregatedReport`, `notificationOnly`
- `findingSeverityThresholds` — optional per-severity routing
- `findingRecipients` — array, each: `actorUri`, `roleDeclarationUri`, optional `findingFilter`

### `subscriptionAuthorityClaims`
Type: array of [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) structures, required

## Worked example — Phase 7 renewal monitoring

```json
{
  "payload": {
    "subscriptionReference": "urn:ipproto:subscription:renewal-mon-001",
    "subscriptionType": "urn:ipproto:subscription:renewalMonitoring",
    "subscriptionScope": {
      "scopedAssetReferences": [
        "urn:ipproto:asset:de-validation-...",
        "urn:ipproto:asset:fr-validation-...",
        "urn:ipproto:asset:gb-validation-..."
      ],
      "scopedDefinition": {
        "renewalCoverage": "fullPatentTerm",
        "advanceWarningDays": 90,
        "decisionPointWarningDays": 30,
        "automaticPaymentAuthorized": false
      },
      "scopeStartDate": "2026-08-02T00:00:00Z"
    },
    "actorAssignments": [
      {"actorUri": "urn:ipproto:actor:meridian-ip-group", "roleDeclarationUri": "...", "assignmentType": "subscriptionProvider"},
      {"actorUri": "urn:ipproto:actor:northwind-industries", "roleDeclarationUri": "...", "assignmentType": "subscriber"},
      {"actorUri": "urn:ipproto:actor:northwind-industries", "roleDeclarationUri": "...", "assignmentType": "payor"}
    ],
    "cadence": {
      "cadenceType": "hybrid",
      "periodicSchedule": {"intervalUnit": "month", "intervalCount": 1, "firstFindingDate": "2026-09-01T00:00:00Z"},
      "eventTriggers": [
        {"triggerType": "urn:ipproto:trigger:renewalDeadlineApproaching", "triggerScope": {"warningDays": 90}}
      ]
    },
    "commercialTerms": {
      "feeStructure": "flatPeriodicFee",
      "feeAmount": {"amount": 280.00, "currency": "EUR", "period": "annual", "perAssetBasis": true},
      "billingCadence": "inAdvance",
      "commercialAgreementReference": "Northwind Industries-DM-MSA-2024-EU#renewal-monitoring"
    },
    "findingsConfiguration": {
      "findingDeliveryMethod": "serviceFinding",
      "findingSeverityThresholds": {
        "critical": {"deliveryOverride": "immediate"},
        "informational": {"deliveryOverride": "monthlyAggregated"}
      },
      "findingRecipients": [
        {"actorUri": "urn:ipproto:actor:northwind-industries", "roleDeclarationUri": "..."}
      ]
    }
  }
}
```

## Worked example — opposition watch with delegation

For a delegation chain where Meridian IP Group holds the contract and D&A operates:

```json
{
  "payload": {
    "subscriptionReference": "urn:ipproto:subscription:opposition-watch-001",
    "subscriptionType": "urn:ipproto:subscription:oppositionWatch",
    "actorAssignments": [
      {"actorUri": "urn:ipproto:actor:meridian-ip-group", "roleDeclarationUri": "...", "assignmentType": "subscriptionContractHolder"},
      {"actorUri": "urn:ipproto:actor:meridian-associates", "roleDeclarationUri": "...", "assignmentType": "subscriptionOperator"},
      {"actorUri": "urn:ipproto:actor:northwind-industries", "roleDeclarationUri": "...", "assignmentType": "subscriber"}
    ]
  }
}
```

The operator's [Actor Role Declaration](../../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) carries the delegation chain showing D&A operates under Meridian IP Group's contract.

## Behavior on receipt

The subscriber adds the subscription to their replica. The provider begins producing [Service Finding](../Steady-State%20Events/Service%20Finding.md) events according to the cadence configuration.

## Related messages

- Begins a stream of [Service Finding](../Steady-State%20Events/Service%20Finding.md) events
- Closes through [Service Subscription Terminated](Service%20Subscription%20Terminated.md) or scope end

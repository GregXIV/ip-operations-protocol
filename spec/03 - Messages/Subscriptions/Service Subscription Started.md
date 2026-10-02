---
type: message
category: subscriptions
status: v0.4
---

# Service Subscription Started

> Long-running service is enrolled.

## Purpose

Establishes a subscription's parameters, authority claims, and finding cadence. Typically the closing milestone of a workstream that includes subscription enrollment (renewal monitoring, opposition watch enrolled in Phase 7 of the EP post-grant flow).

Subscriptions persist beyond the workstream that started them — they become first-class entities with their own audit trail, findings, and status.

## Producer

The actor providing the subscription (`subscriptionProvider` or `subscriptionContractHolder`).

## Recipients

The subscriber, the optional operator (in delegation chains) and the payor.

One message addressed to all of them is the simple case. It is not the only one. A subscription may have one start message per audience: each is a complete Service Subscription Started under the same `subscriptionReference`, addressed to its own recipients. This is how terms that concern one audience are kept from another, as with a revenue share (see *Who sees a revenue share* below). Stated in 0.4; until then this section read as if one message always went to all recipients.

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

- `feeStructure` — `flatPeriodicFee`, `perFindingFee`, `tieredFee`, `revenueShare`, `custom`
- `feeAmount` — type-specific
- `billingCadence` — `inAdvance`, `inArrears`, `perFinding`, `custom`
- `commercialAgreementReference` — string
- `planReference` — optional string
- `trial` — optional structured: `trialEndsAt`, `afterTrial`

Three parts were added in 0.2, all optional:

- **`revenueShare`** as a value of `feeStructure`. The provider is paid a share of what customers are billed. `feeAmount` then carries `sharePercent`, a number from 0 to 100.
- **`planReference`.** The plan or tier the subscription is on, as an identifier of the provider's own catalogue. The protocol does not define tiers.
- **`trial`.** `trialEndsAt` is the ISO 8601 datetime the trial ends. `afterTrial` says what follows: `convertsToPaid` — the subscription continues on the stated terms — or `endsUnlessConfirmed` — it ends unless the subscriber confirms.

With these an application can be a supplier without a further message. The application is an actor of type `softwareService` (see [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md)); a customer's licence for it is a subscription; a step it performs in a workstream is an ordinary milestone with the application as `primary` actor.

A subscription an actor holds with a platform operator for the use of the platform itself is not exchanged between actors and is not protocol matter.

**Who sees a revenue share.** Clarified in 0.3 and confirmed in 0.4 (see [Ratified Decisions](../../05%20-%20Decisions/Ratified%20Decisions.md), decisions 44 and 47). A revenue share is a term between the application's provider and the contract holder. A subscription with a revenue share therefore has two start messages under the same `subscriptionReference`:

- **The copy between the application's provider and the contract holder** carries the terms between those two, with `sharePercent`. It is addressed to those two actors and to nobody else.
- **The copy addressed to the subscriber** states the subscriber's own terms, that is, what the subscriber pays, and carries no `sharePercent`.

Both copies are complete messages and validate against the same schema; `commercialTerms` is required in each. They describe the same subscription, with the same `subscriptionReference`, type and scope, and differ in their `commercialTerms` and in their recipients. A receiver does not conclude from its own copy what the other one says.

Keeping `sharePercent` out of the subscriber's copy is a rule the sender follows, not one a schema enforces: a schema sees one message and cannot tell which audience it is for.

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

## Worked example — application licence with revenue share and trial

Added in 0.2. A customer licenses a translation application through a contract holder. The application's provider is paid 70 percent of what the customer is billed; the first month is a trial that converts. This is the copy between contract holder and provider. The subscriber's copy for the same subscription follows it.

```json
{
  "payload": {
    "subscriptionReference": "urn:ipproto:subscription:litware-translate-nw-001",
    "subscriptionType": "urn:litware-translate:subscription:translationWorkbench",
    "actorAssignments": [
      {"actorUri": "urn:ipproto:actor:meridian-ip-group", "roleDeclarationUri": "...", "assignmentType": "subscriptionContractHolder"},
      {"actorUri": "urn:ipproto:actor:litware-translate", "roleDeclarationUri": "...", "assignmentType": "subscriptionOperator"},
      {"actorUri": "urn:ipproto:actor:northwind-industries", "roleDeclarationUri": "...", "assignmentType": "subscriber"}
    ],
    "commercialTerms": {
      "feeStructure": "revenueShare",
      "feeAmount": {"sharePercent": 70},
      "billingCadence": "inArrears",
      "commercialAgreementReference": "meridian-app-terms-2026#revenue-share",
      "planReference": "litware-translate#professional",
      "trial": {"trialEndsAt": "2026-12-16T00:00:00Z", "afterTrial": "convertsToPaid"}
    }
  }
}
```

The copy addressed to the subscriber, under the same `subscriptionReference`. It states what the subscriber pays and says nothing about the share:

```json
{
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:northwind-industries", "expectedRole": "urn:ipproto:role:subscriber"}
  ],
  "payload": {
    "subscriptionReference": "urn:ipproto:subscription:litware-translate-nw-001",
    "subscriptionType": "urn:litware-translate:subscription:translationWorkbench",
    "actorAssignments": [
      {"actorUri": "urn:ipproto:actor:meridian-ip-group", "roleDeclarationUri": "...", "assignmentType": "subscriptionContractHolder"},
      {"actorUri": "urn:ipproto:actor:litware-translate", "roleDeclarationUri": "...", "assignmentType": "subscriptionOperator"},
      {"actorUri": "urn:ipproto:actor:northwind-industries", "roleDeclarationUri": "...", "assignmentType": "subscriber"}
    ],
    "commercialTerms": {
      "feeStructure": "flatPeriodicFee",
      "feeAmount": {"amount": 245.00, "currency": "EUR", "period": "monthly"},
      "billingCadence": "inArrears",
      "commercialAgreementReference": "meridian-app-terms-2026#subscriber",
      "planReference": "litware-translate#professional",
      "trial": {"trialEndsAt": "2026-12-16T00:00:00Z", "afterTrial": "convertsToPaid"}
    }
  }
}
```

## Behavior on receipt

The subscriber adds the subscription to their replica. The provider begins producing [Service Finding](../Steady-State%20Events/Service%20Finding.md) events according to the cadence configuration.

## Related messages

- Begins a stream of [Service Finding](../Steady-State%20Events/Service%20Finding.md) events
- Closes through [Service Subscription Terminated](Service%20Subscription%20Terminated.md) or scope end

---
type: message
category: workstream-lifecycle
status: v0.1
---

# Workstream Completed

> All milestones have reached terminal status; workstream closes normally.

## Purpose

Sent when all milestones in the workstream have reached terminal status (`completed`, `failed`, or `abandoned`). The aggregated outcome and final state are captured for audit.

## Producer

Typically the orchestrator that originally proposed the workstream, but any actor with appropriate authority.

## Recipients

All actors involved in the workstream.

## Payload

### `workstreamReference`
Type: workstreamUri, required

### `completionSummary`
Type: structured, required

- `completionOutcome` — enumeration: `fullSuccess`, `partialSuccess`, `mixedOutcome`
- `aggregatedActuals` — `totalActualCost`, `totalEstimatedCost`, `totalActualDays`, `totalEstimatedDays`, `varianceNotes`
- `outputArtifacts` — array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs
- `subscriptionsCreated` — array of subscription URIs that persist beyond workstream
- `derivedAssetsCreated` — optional array (national validations, etc.)

### `completionAssertions`
Type: array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) structures, required

### `postCompletionState`
Type: structured, required

- `assetStateNotes` — narrative
- `outstandingObligations` — array (each: `obligationType`, `obligationDescription`, `obligationOwner`)
- `auditCompletionDate`

## Worked example — full success

```json
{
  "payload": {
    "workstreamReference": "urn:ipproto:workstream:8a4b1c92-...",
    "completionSummary": {
      "completionOutcome": "fullSuccess",
      "aggregatedActuals": {
        "totalActualCost": {"amount": 5340, "currency": "EUR"},
        "totalEstimatedCost": {"amount": 5460, "currency": "EUR"},
        "totalActualDays": 28,
        "totalEstimatedDays": 30,
        "varianceNotes": "Cost slightly under estimate."
      },
      "outputArtifacts": [
        "urn:ipproto:document:validation-analysis-...",
        "urn:ipproto:document:epo-form-2004-...",
        "urn:ipproto:document:grant-fee-payment-receipt-..."
      ],
      "subscriptionsCreated": [
        "urn:ipproto:subscription:renewal-mon-...",
        "urn:ipproto:subscription:opposition-watch-..."
      ],
      "derivedAssetsCreated": [
        "urn:ipproto:asset:de-validation-...",
        "urn:ipproto:asset:fr-validation-...",
        "urn:ipproto:asset:gb-validation-..."
      ]
    },
    "postCompletionState": {
      "assetStateNotes": "EP grant validated in DE, FR, GB. Renewal monitoring active. Opposition watch active through 2027-05-12.",
      "outstandingObligations": [
        {
          "obligationType": "renewalDeadline",
          "obligationDescription": "DE first renewal due 2027-04-15",
          "obligationOwner": "urn:ipproto:actor:meridian-ip-group"
        }
      ]
    }
  }
}
```

## Behavior on receipt

Receivers update their workstream replicas. Subscriptions created persist beyond workstream completion (they were enrolled in subscription milestones). Derived assets become first-class assets in their own right.

## Related messages

- Closes a workstream proposed in [Goal Decomposition](Goal%20Decomposition.md) and committed in [Orchestration Committed](Orchestration%20Committed.md)
- Distinct from [Workstream Abandoned](Workstream%20Abandoned.md) (early termination)

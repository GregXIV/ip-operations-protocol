---
type: message
category: workstream-lifecycle
status: v0.1
---

# Workstream Abandoned

> Workstream terminates before completion.

## Purpose

Sent when a workstream is terminated before all milestones reach terminal status. Distinct from [Workstream Completed](Workstream%20Completed.md) with `mixedOutcome` because abandonment is an early termination decision, not the natural end of the chain.

## Producer

Any actor with appropriate authority — typically the corporate (`decisionAuthority`) but can be the orchestrator in cascading-abandonment scenarios or in deadlock cases.

## Recipients

All actors involved in the workstream.

## Payload

### `workstreamReference`
Type: workstreamUri, required

### `abandonmentReason`
Type: structured, required

- `reasonType` — enumeration: `corporateWithdrawal`, `disputeDeadlock`, `forceMajeure`, `assetStatusChange`, `externalEvent`, `policyChange`, `other`
- `reasonNarrative` — string
- `abandonmentInitiator` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI
- `abandonmentUserContext` — [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), strongly recommended

### `milestoneStateAtAbandonment`
Type: array, required

For each milestone: `milestoneUri`, `statusAtAbandonment`, `dispositionAfterAbandonment` (`completedBeforeAbandonment`, `inProgressAtAbandonment`, `cancelled`, `partialDeliverableRetained`).

### `partialOutcomes`
Type: structured, optional

What was produced before abandonment that survives:
- `outputArtifacts` — [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs
- `subscriptionsCreated` — subscription URIs that continue
- `costsIncurred` — actual cost despite incompleteness

### `abandonmentAssertions`
Type: array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) structures, required

### `unwindObligations`
Type: array, optional

Obligations triggered by abandonment — partial-work invoices, refunds, notification duties. Each entry: `obligationType`, `obligationDescription`, `obligationOwner`, `dueBy`.

## Worked example — assetStatusChange

```json
{
  "userContext": {
    "userIdentifier": "counsel@northwind.example",
    "roleAtActor": "Senior IP Counsel"
  },
  "payload": {
    "workstreamReference": "urn:ipproto:workstream:8a4b1c92-...",
    "abandonmentReason": {
      "reasonType": "assetStatusChange",
      "reasonNarrative": "Underlying EP application withdrawn 2026-06-20. Validation workstream no longer applicable.",
      "abandonmentInitiator": "urn:ipproto:actor:northwind-industries"
    },
    "milestoneStateAtAbandonment": [
      {"milestoneUri": "urn:ipproto:milestone:m1-validation-analysis", "statusAtAbandonment": "completed", "dispositionAfterAbandonment": "completedBeforeAbandonment"},
      {"milestoneUri": "urn:ipproto:milestone:m2-doc-prep", "statusAtAbandonment": "inProgress", "dispositionAfterAbandonment": "cancelled"}
    ],
    "partialOutcomes": {
      "outputArtifacts": ["urn:ipproto:document:validation-analysis-..."],
      "costsIncurred": {"amount": 1850, "currency": "EUR"}
    },
    "unwindObligations": [
      {
        "obligationType": "partialWorkInvoice",
        "obligationDescription": "Invoice for validation analysis (completed) and document prep partial.",
        "obligationOwner": "urn:ipproto:actor:meridian-ip-group",
        "dueBy": "2026-07-15"
      }
    ]
  }
}
```

## Behavior on receipt

Receivers terminate in-flight milestones, stop pending work, settle invoices per unwind obligations. Subscriptions created during the workstream may continue if their `partialOutcomes.subscriptionsCreated` lists them; otherwise they terminate.

## Related messages

- Replaces [Workstream Completed](Workstream%20Completed.md) when workstream ends early
- May trigger [Service Subscription Terminated](../Subscriptions/Service%20Subscription%20Terminated.md) for in-flight subscriptions

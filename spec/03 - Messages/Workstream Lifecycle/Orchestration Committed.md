---
type: message
category: workstream-lifecycle
status: v0.2
---

# Orchestration Committed

> Corporate authorizes the workstream proposed in [Goal Decomposition](Goal%20Decomposition.md).

## Purpose

Authorizes the workstream to begin, with any modifications the authorizer applies. Once committed, the workstream's status moves from `proposed` to `committed` and milestones whose dependencies are satisfied move to `ready`.

Since 0.2 work is also committed on three paths that do not use this message:

- a pre-authorized catalogue order whose prices match the offer — see *One-step catalogue order* in [Work Requested](Work%20Requested.md)
- an instruction accepted by the provider — [Instruction Accepted](../Work%20Instruction/Instruction%20Accepted.md)
- an award confirmed by both sides — [Award Confirmed](../Procurement/Award%20Confirmed.md)

## Producer

The actor with `decisionAuthority` role on the workstream — typically the corporate.

## Recipients

The orchestrator that produced the [Goal Decomposition](Goal%20Decomposition.md), plus other actors who need to know the workstream is live.

## Payload

### `proposalReference`
Type: messageUri, required

The [Goal Decomposition](Goal%20Decomposition.md) being committed.

### `commitmentDecision`
Type: enumeration, required

- `committed` — accepted as-is
- `committedWithModifications` — accepted with specified modifications
- `committedWithRouteSelection` — one of the proposed delivery routes selected
- `rejected` — declined; no workstream created
- `deferred` — held without commitment; deferral expiry set

### `modifications`
Type: array, conditional

Required when `commitmentDecision = committedWithModifications`. Each modification:
- `modificationType` — enumeration: `addMilestone`, `removeMilestone`, `modifyMilestone`, `modifyDependency`, `modifyExecutionMode`, `modifyActorAssignment`, `modifyEstimate`, `modifyGoalConstraint`
- `targetMilestoneUri` — when applicable
- `modificationContent` — structured, the change
- `modificationRationale` — narrative
- `modificationUserContext` — [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md)

### `selectedRoute`
Type: structured, conditional

Required when `commitmentDecision = committedWithRouteSelection`. The `routeName` of the selected route.

### `commitmentAssertions`
Type: array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) structures, required

Establish the corporate's commitment and authorizing claims. At minimum: assertion over `/workstreamStatus = "committed"`, assertions over each milestone's status, plus authority claims authorizing actors and execution modes.

### `rejectionReason`, `deferralExpiry`
Conditional based on `commitmentDecision`.

## Worked example — committedWithRouteSelection

```json
{
  "userContext": {
    "userIdentifier": "counsel@northwind.example",
    "roleAtActor": "Senior IP Counsel"
  },
  "payload": {
    "proposalReference": "urn:ipproto:message:gd-001-...",
    "commitmentDecision": "committedWithRouteSelection",
    "selectedRoute": {"routeName": "Balanced"},
    "commitmentAssertions": [
      /* Data Assertion for /workstreamStatus = "committed" */
    ]
  }
}
```

## Worked example — committedWithModifications

```json
{
  "payload": {
    "proposalReference": "urn:ipproto:message:gd-001-...",
    "commitmentDecision": "committedWithModifications",
    "modifications": [
      {
        "modificationType": "modifyMilestone",
        "targetMilestoneUri": "urn:ipproto:milestone:m1-validation-analysis",
        "modificationContent": {
          "scopeOverride": {"validationCountries": ["DE", "FR", "GB"]}
        },
        "modificationRationale": "Drop IT and ES per Q2 portfolio review."
      }
    ]
  }
}
```

## Behavior on receipt

The orchestrator updates the workstream record, transitions milestones to ready states where dependencies are satisfied, and notifies actor assignments. Work begins.

For `rejected` or `deferred`, the orchestrator handles accordingly; for `deferred`, monitors the deferral expiry.

## Related messages

- Answers [Goal Decomposition](Goal%20Decomposition.md)
- Triggers [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md) events for ready milestones
- Workstream eventually closes through [Workstream Completed](Workstream%20Completed.md) or [Workstream Abandoned](Workstream%20Abandoned.md)

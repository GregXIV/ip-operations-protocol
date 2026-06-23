---
type: message
category: workstream-lifecycle
status: v0.1
---

# Goal Decomposition

> Orchestrator proposes a workstream — the moment the protocol does what nothing else in IP currently does.

## Purpose

Decomposes a goal into a milestone chain proposal, with each milestone carrying its proposed actor assignments, execution mode, estimated cost and duration, and dependencies. Delivered to the corporate (and other actors with relevant interest) as a proposal. The corporate authorizes through [Orchestration Committed](Orchestration%20Committed.md).

This is the structured, machine-readable proposal of how patent operations work will be performed, with explicit accountability and cost transparency. The standards-layer flip in any user-facing UI most prominently surfaces this message.

## Producer

The orchestrator after [Asset Match Response](../Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) returns confirmation. Typically a service provider's orchestrator; can be a corporate's own orchestrator for internal workstreams.

## Recipients

The actor with `decisionAuthority` role on the workstream. Typically the corporate. Other actors with relevant interest (other service providers in the chain, the corporate's external counsel) may also be addressed.

## Payload

### `proposedWorkstream`
Type: full [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md) structure, required

With `workstreamStatus = "proposed"` and a complete milestone chain. All milestones in `proposed` status.

### `proposalRationale`
Type: structured, required

The orchestrator's reasoning:
- `analyticsSummary` — narrative
- `dataInputs` — array. Each entry: `inputType` (`portfolioHistory`, `competitorPattern`, `marketData`, `costAnalysis`, `legalRequirement`, `policyConstraint`, `userPreference`), `inputDescription`, optional `inputDocumentUri`
- `alternativesConsidered` — optional array of alternatives with rationaleAgainst

### `deliveryRouteSimulations`
Type: array, optional

Fast Track / Balanced / Cost Optimized route comparisons. Each entry: `routeName`, `routeMilestoneOverrides`, `routeEstimates` (totalCost, totalDays), `routeTradeoffs`.

### `acceptanceConstraints`
Type: structured, optional

What the orchestrator considers the bounds of acceptable modification:
- `noFurtherModificationWithoutReProposal` — boolean
- `protectedMilestones` — array of milestoneUris essential to the chain
- `costFloorPerMilestone` — operational viability floors

### `responseDeadline`
Type: ISO 8601 datetime, required

By when the corporate must respond before the proposal expires.

## Worked example skeleton

```json
{
  "payload": {
    "proposedWorkstream": {
      "workstreamUri": "urn:ipproto:workstream:8a4b1c92-...",
      "workstreamType": "urn:ipproto:workstream:epPostGrantValidation",
      "assetReferences": ["urn:ipproto:asset:7c4f9a82-..."],
      "goalStatement": {
        "goalText": "Validate the EP grant in DE, FR, GB; pay grant fee; enroll renewal monitoring; enroll opposition watch.",
        "goalConstraints": {"costCeiling": {"amount": 18000, "currency": "EUR"}}
      },
      "milestoneChain": {
        "chainExecutionPolicy": "strict",
        "milestones": [
          /* validation analysis (m1) */,
          /* document preparation (m2) */,
          /* client filing (m3) */,
          /* grant fee payment (m4) */,
          /* renewal monitoring enrollment (m5) */,
          /* opposition watch enrollment (m6) */
        ]
      },
      "workstreamStatus": "proposed"
    },
    "proposalRationale": {
      "analyticsSummary": "Validation in DE, FR, GB recommended based on portfolio history (87% of recent validations), competitor activity (top 3 competitors validate same), and product market data (92% revenue exposure).",
      "dataInputs": [
        {"inputType": "portfolioHistory", "inputDescription": "Northwind Industries EP validations 2021-2025"},
        {"inputType": "competitorPattern", "inputDescription": "Top 3 competitor EP validations 2023-2025"},
        {"inputType": "marketData", "inputDescription": "Revenue exposure 2024"}
      ],
      "alternativesConsidered": [
        {"alternativeName": "DE+FR only", "rationaleAgainst": "Drops 31% revenue exposure"},
        {"alternativeName": "Unitary Patent", "rationaleAgainst": "Policy preference for national validation"}
      ]
    },
    "deliveryRouteSimulations": [
      {"routeName": "Fast Track", "routeEstimates": {"totalCost": {"amount": 6260, "currency": "EUR"}, "totalDays": 24}},
      {"routeName": "Balanced", "routeEstimates": {"totalCost": {"amount": 5460, "currency": "EUR"}, "totalDays": 30}},
      {"routeName": "Cost Optimized", "routeEstimates": {"totalCost": {"amount": 4880, "currency": "EUR"}, "totalDays": 38}}
    ],
    "responseDeadline": "2026-05-05T17:00:00Z"
  }
}
```

## Behavior on receipt

The corporate's authorized user reviews the proposal. They commit through [Orchestration Committed](Orchestration%20Committed.md) with one of: as-is acceptance, modifications, route selection, rejection, or deferral.

If conditions change before commitment (cost estimates wrong, actor unavailable, deadline shifted), the orchestrator may publish a superseding GoalDecomposition. Commitment of a superseded proposal triggers a dispute event.

## Related messages

- Answered by [Orchestration Committed](Orchestration%20Committed.md)
- Built on [Asset Match Response](../Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) confirmation
- Resulting workstream tracked through [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md) etc.

## See also

- [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md)
- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md)
- [EP Post-Grant Flow Walkthrough](../../04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md)

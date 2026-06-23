---
type: message
category: milestone-lifecycle
status: v0.1
---

# Milestone Failed

> Milestone attempted but did not produce required outcome.

## Purpose

Distinct from [Milestone Abandoned](Milestone%20Abandoned.md) because failure is an attempted-and-failed outcome; abandonment is a decision not to continue.

Common cases: translation services unable to meet deadline, search returning insufficient results, external dependency unavailable too long.

## Producer

The actor with `primary` assignment.

## Recipients

The accountable actor (typically the corporate); the orchestrator for re-design decisions.

## Payload

### `milestoneReference`
Type: milestoneUri, required

### `failedAt`
Type: ISO 8601 datetime, required

### `failureReason`
Type: structured, required

- `reasonCategory` — enumeration: `technicalFailure`, `externalDependencyUnavailable`, `dataInsufficient`, `qualityThresholdNotMet`, `deadlineMissed`, `policyViolation`, `humanError`, `other`
- `reasonNarrative` — string
- `recoverable` — boolean
- `suggestedRemediation` — narrative

### `partialOutputs`
Type: structured, optional

- `producedDocuments` — partial deliverables
- `costsIncurred` — actual cost despite failure

### `failureImpact`
Type: structured, required

- `affectedDownstreamMilestones` — array of milestoneUris now blocked
- `affectedDeadlines` — array of deadline references at risk
- `requiredAction` — enumeration: `escalateToCorporate`, `retryAutomatic`, `redesignWorkstream`, `abandonWorkstream`, `noActionRequired`

## Worked example

```json
{
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:m2-translation-FR",
    "failedAt": "2026-05-20T17:00:00Z",
    "failureReason": {
      "reasonCategory": "deadlineMissed",
      "reasonNarrative": "Certified French translator availability constrained.",
      "recoverable": true,
      "suggestedRemediation": "Engage alternate translator (Cabinet Lefèvre) for expedited delivery; +€600."
    },
    "partialOutputs": {"costsIncurred": {"amount": 200, "currency": "EUR"}},
    "failureImpact": {
      "affectedDownstreamMilestones": ["urn:ipproto:milestone:m3-fr-filing"],
      "requiredAction": "escalateToCorporate"
    }
  }
}
```

## Behavior on receipt

Receivers update milestone replicas. The corporate (or other accountable actor) decides on remediation. The orchestrator may produce a new [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) for the affected portion if redesign is chosen.

The protocol does not auto-recover failures — recovery is always explicit.

## Related messages

- Closes a milestone started by [Milestone Started](Milestone%20Started.md)
- May trigger new [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) for redesign
- Distinct from [Milestone Abandoned](Milestone%20Abandoned.md) (decision-driven termination)

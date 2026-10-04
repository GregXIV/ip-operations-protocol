---
type: message
category: milestone-lifecycle
status: v0.5
---

# Milestone Abandoned

> Milestone terminated by decision rather than failure.

## Purpose

Distinct from [Milestone Failed](Milestone%20Failed.md) because abandonment is a deliberate decision rather than an attempted-and-failed outcome.

Common cases: corporate withdrawing scope, strategic redirection, cascading abandonment when an upstream milestone failed.

## Producer

The actor with appropriate authority. For corporate-withdrawal abandonments, the corporate. For cascading abandonments, the orchestrator. Where a provider did not perform, the work requester that ends its milestone (stated in 0.5; see below).

## Payload

### `milestoneReference`
Type: milestoneUri, required

### `abandonedAt`
Type: ISO 8601 datetime, required

### `abandonmentReason`
Type: structured, required

- `reasonCategory` — enumeration: `corporateWithdrawal`, `strategicRedirection`, `cascadingFromUpstream`, `disputeUnresolvable`, `assetStatusChange`, `other`
- `reasonNarrative` — string
- `decisionAuthority` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI
- `decisionUserContext` — [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), recommended

### `partialOutputs`
Type: structured, optional

Same shape as in [Milestone Failed](Milestone%20Failed.md).

### `abandonmentImpact`
Type: structured, required

- `cascadingAbandonments` — milestoneUris abandoned as consequence
- `releasedResources` — narrative
- `unwindObligations` — array (refunds, cancellations, notifications)

## Worked example — corporate withdraws IT validation

```json
{
  "userContext": {
    "userIdentifier": "counsel@northwind.example",
    "roleAtActor": "Senior IP Counsel"
  },
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:m2-translation-IT",
    "abandonedAt": "2026-05-15T10:30:00Z",
    "abandonmentReason": {
      "reasonCategory": "corporateWithdrawal",
      "reasonNarrative": "Q2 review concluded IT exposure below validation threshold.",
      "decisionAuthority": "urn:ipproto:actor:northwind-industries"
    },
    "abandonmentImpact": {
      "cascadingAbandonments": ["urn:ipproto:milestone:m3-it-filing"],
      "releasedResources": "Italian translator capacity returned to pool."
    }
  }
}
```

## When the provider does not perform

Stated in 0.5. A work requester that ends a milestone because its provider did not perform, for instance missed the delivery level and stopped answering, or delivered work the requester will not accept again, sends Milestone Abandoned, not [Milestone Failed](Milestone%20Failed.md). Failure is reported by the actor that attempted the work; the requester's step is a decision to stop:

- the producer is the work requester, here typically the orchestrator in the workstream it shares with the provider;
- `decisionAuthority` is the work requester itself, and `decisionUserContext` names the person who decided;
- `reasonCategory` is `other`, and `reasonNarrative` says that the provider did not perform and how (the missed level, the rejected deliverable);
- the message is addressed to the provider.

Where the requester gives the work to another provider, that is a new [Work Instruction](../Work%20Instruction/Work%20Instruction.md) in a new workstream; the abandoned workstream is closed with [Workstream Abandoned](../Workstream%20Lifecycle/Workstream%20Abandoned.md). In the workstream above, where the requester is itself the primary actor towards its customer, the milestone goes on and nothing needs to be said; only if the requester cannot deliver at all does it report there, as primary actor, with Milestone Failed or Milestone Abandoned of its own.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:fabrikam-patentes", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "correlation": {"workstreamUri": "urn:ipproto:workstream:b-agent-es-001"},
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:b1-es-validation-agent",
    "abandonedAt": "2026-11-20T10:55:00Z",
    "abandonmentReason": {
      "reasonCategory": "other",
      "reasonNarrative": "Provider did not perform: the delivery level fell due on 2026-11-16 without a deliverable or an answer to two reminders. The work requester ends the milestone and instructs another provider.",
      "decisionAuthority": "urn:ipproto:actor:meridian-ip-group",
      "decisionUserContext": {"userIdentifier": "operations-desk@meridian-ip-group.example", "roleAtActor": "Case Manager"}
    },
    "abandonmentImpact": {
      "cascadingAbandonments": [],
      "releasedResources": "The validation is re-instructed to another agent in a new workstream."
    }
  }
}
```

The full message is `milestone-abandoned-provider-not-performing.example.json` in `schemas/examples/`.

## Behavior on receipt

Receivers terminate work, settle obligations. Cascading abandonments propagate as separate Milestone Abandoned messages with `reasonCategory = cascadingFromUpstream`.

## Related messages

- Closes a milestone (started or not)
- May trigger cascading [Milestone Abandoned](Milestone%20Abandoned.md) events
- Distinct from [Milestone Failed](Milestone%20Failed.md) (attempted-and-failed)

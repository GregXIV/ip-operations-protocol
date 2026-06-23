---
type: message
category: milestone-lifecycle
status: v0.1
---

# Milestone Completed

> Milestone work finishes successfully.

## Purpose

Sent by the primary actor when work concludes successfully. Two important variants:

- **Definitive completion** — work is done and final
- **Awaiting external action** — work is done from the actor's perspective but depends on external confirmation; status moves to `awaitingExternalAction` rather than `completed`. The actual transition to `completed` happens later when the external action is observed (typically through a [Register Event](../Steady-State%20Events/Register%20Event.md)).

## Producer

The actor with `primary` assignment.

## Recipients

The accountable actor (typically the corporate), other actors with interest.

## Payload

### `milestoneReference`
Type: milestoneUri, required

### `completedAt`
Type: ISO 8601 datetime, required

### `actuals`
Type: structured, required

- `actualCost` — `amount`, `currency`, optional `costBreakdown`
- `actualDuration` — integer days
- `varianceFromEstimate` — optional narrative

### `outputs`
Type: structured, required

- `producedDocuments` — array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs
- `producedSubscriptions` — array of subscription URIs (when milestone enrolled subscriptions)
- `producedAssertions` — array of substantive [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) URIs

### `completionType`
Type: enumeration, required

- `definitiveCompletion`
- `awaitingExternalAction` — pairs with [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md)

### `acknowledgmentRequired`
Type: boolean, optional

When true, the milestone is not considered fully concluded until a [Deliverable Acknowledged](../Deliverable%20Handoff/Deliverable%20Acknowledged.md) arrives.

## Worked example — definitive completion

```json
{
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:m1-validation-analysis",
    "completedAt": "2026-05-04T16:25:00Z",
    "actuals": {
      "actualCost": {"amount": 720, "currency": "EUR"},
      "actualDuration": 4,
      "varianceFromEstimate": "Completed 1 day under expected."
    },
    "outputs": {
      "producedDocuments": ["urn:ipproto:document:9c2e4f81-validation-analysis"]
    },
    "completionType": "definitiveCompletion",
    "acknowledgmentRequired": true
  }
}
```

The envelope's `assertions` array carries the assertion setting `/milestoneStatus` to `completed`.

## Worked example — awaitingExternalAction

```json
{
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:m2-doc-prep",
    "completedAt": "2026-05-25T14:00:00Z",
    "outputs": {
      "producedDocuments": [
        "urn:ipproto:document:epo-terminal-doc-de",
        "urn:ipproto:document:epo-terminal-doc-fr",
        "urn:ipproto:document:epo-terminal-doc-gb"
      ]
    },
    "completionType": "awaitingExternalAction"
  }
}
```

Followed by [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md) for client execution; the actual transition to `completed` happens after [Client Action Completed](../Prepared-Action%20Handoff/Client%20Action%20Completed.md) and the subsequent [Register Event](../Steady-State%20Events/Register%20Event.md) confirming the action landed.

## Related messages

- Triggered by prior [Milestone Started](Milestone%20Started.md)
- Closes the milestone unless `awaitingExternalAction`
- May produce [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md) (in tandem)
- May produce [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md) (when `awaitingExternalAction`)

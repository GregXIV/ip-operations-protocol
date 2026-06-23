---
type: message
category: disputes
status: v0.1
---

# Action Confirmation Dispute

> Expected register confirmation did not arrive within the window.

## Purpose

The protocol's most common dispute. Fires when a [Client Action Completed](../Prepared-Action%20Handoff/Client%20Action%20Completed.md) or [Payment Executed](../Payments/Payment%20Executed.md) claims an action happened but the corresponding [Register Event](../Steady-State%20Events/Register%20Event.md) does not arrive within the `expectedRegisterEventWindow`. Surfaces the divergence for resolution rather than letting the workstream proceed on the actor's claim alone.

## Producer

Typically the orchestrator detecting the timeout. Can be any actor monitoring the divergence window.

## Recipients

The original action-claiming actor; the routed resolver (typically the service provider's case team); the orchestrator.

## Payload

### `disputeReference`
Type: URI, required

`urn:ipproto:dispute:{uuid}`.

### `claimingMessage`
Type: messageUri, required

The original [Client Action Completed](../Prepared-Action%20Handoff/Client%20Action%20Completed.md) or [Payment Executed](../Payments/Payment%20Executed.md) whose register confirmation is missing.

### `expectedConfirmation`
Type: structured, required

What was expected (carried from the original [Artifact Ready](../Prepared-Action%20Handoff/Artifact%20Ready.md) or [Payment Authorized](../Payments/Payment%20Authorized.md)):
- `expectedRegisterEventType` — URI
- `expectedActorReference` — register actor URI
- `windowStartedAt` — when monitoring began
- `windowExpectedAt` — expected arrival
- `windowExpiredAt` — when window closed without confirmation

### `divergenceDetectedAt`
Type: ISO 8601 datetime, required

### `partialEvidence`
Type: structured, optional

What evidence was provided that proved insufficient:
- `originalEvidence` — array of evidence items from the original message
- `evidenceGaps` — narrative description

### `disputeRoutingTarget`
Type: same shape as in [Asset Authority Dispute](Asset%20Authority%20Dispute.md), required

### `disputeImpact`
Type: same shape, required

### `investigativeActions`
Type: array, optional

Recommended investigation steps:
- `actionDescription` — narrative
- `actionExecutor` — proposed actor
- `expectedOutcome` — what success looks like

### `responseDeadline`
Type: ISO 8601 datetime, required

## Worked example

```json
{
  "payload": {
    "disputeReference": "urn:ipproto:dispute:conf-001-...",
    "claimingMessage": "urn:ipproto:message:cac-001-...",
    "expectedConfirmation": {
      "expectedRegisterEventType": "urn:ipproto:registerEvent:postGrantFilingReceived",
      "expectedActorReference": "urn:ipproto:actor:epo",
      "windowStartedAt": "2026-06-12T14:30:00Z",
      "windowExpectedAt": "2026-06-15T14:30:00Z",
      "windowExpiredAt": "2026-06-26T14:30:00Z"
    },
    "divergenceDetectedAt": "2026-06-26T14:35:00Z",
    "partialEvidence": {
      "originalEvidence": [{"evidenceType": "urn:ipproto:evidence:epoConfirmationNumber", "confirmationNumber": "EPO-FILING-2026-12345-DE"}],
      "evidenceGaps": "Confirmation numbers received but no register-side intentionToValidate event detected for any of the three jurisdictions."
    },
    "disputeRoutingTarget": {
      "targetActorUri": "urn:ipproto:actor:meridian-ip-group",
      "targetRoleDeclaration": "urn:ipproto:roleDeclaration:dm-case-team"
    },
    "investigativeActions": [
      {"actionDescription": "Direct EPO inquiry on filing status using captured confirmation numbers.", "actionExecutor": "urn:ipproto:actor:meridian-ip-group"}
    ],
    "responseDeadline": "2026-07-03T17:00:00Z"
  }
}
```

## Behavior on receipt

Routed resolver investigates. Common resolutions: late register event eventually arrives (resolved by [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md) with `acknowledgeRegisterArrival`), action did not actually happen (resolution requires re-execution), administrative gap requiring office-side correction.

If the register event arrives during the dispute window, the dispute can be auto-resolved with a [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md) capturing the late arrival.

## Related messages

- Resolved by [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md)
- Triggered by missing [Register Event](../Steady-State%20Events/Register%20Event.md) after [Client Action Completed](../Prepared-Action%20Handoff/Client%20Action%20Completed.md) or [Payment Executed](../Payments/Payment%20Executed.md)

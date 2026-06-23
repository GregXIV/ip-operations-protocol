---
type: message
category: prepared-action-handoff
status: v0.1
---

# Artifact Ready

> Actor announces a prepared artifact awaiting external action.

## Purpose

Models the case where one actor prepares an artifact for another to act on through a system outside the protocol — EPO terminal filing, USPTO EFS submission, payment authorization through a banking portal, court filing.

The protocol's most novel pair (with [Client Action Completed](Client%20Action%20Completed.md)). Nothing in current IP standards models this seam at the operational level. Formalizes the three-party handoff (preparer / client-executor / register-confirmer) that current practice handles entirely through email.

## Producer

The actor that prepared the artifact, typically alongside or immediately after [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md) with `completionType: awaitingExternalAction`.

## Recipients

The actor expected to perform the external action (`clientExecutor` role) — usually the corporate.

## Payload

### `artifactReference`
Type: structured, required

- `documentReferences` — array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs (rendered artifact)
- `structuredArtifactContent` — optional structured representation: `schemaIdentifier`, `content`, `schemaConformanceLevel`

### `actionDeclaration`
Type: structured, required

- `actionCategory` — URI: `urn:ipproto:action:officeFiling`, `urn:ipproto:action:officeFeePayment`, `urn:ipproto:action:bankPayment`, `urn:ipproto:action:courtFiling`, `urn:ipproto:action:registrationAction`, `urn:ipproto:action:custom`
- `actionTarget` — `targetSystem` (URN), `targetUri` (URL), `targetCredentialIssuer` (optional)
- `actionInstructions` — `steps` array. Each step: `stepNumber`, `stepDescription`, optional `stepReference` (document/section), optional `stepValidation`
- `actionDeadline` — `deadlineDate`, `deadlineSource` (URI), `deadlineImpact` (`bindingLegal`, `proceduralRequirement`, `internalSchedule`, `advisory`)

### `expectedConfirmation`
Type: structured, required

- `confirmationMessage` — enumeration: `clientActionCompleted` (default), `paymentExecuted`, `custom`
- `confirmationDeadline` — ISO 8601 datetime
- `evidenceExpectations` — `evidenceTypes` array, `evidenceMandatory` (`required`, `recommended`, `optional`)

### `expectedRegisterConfirmation`
Type: structured, required

The protocol-level expectation about register confirmation:
- `expectedRegisterEventType` — URI for the register event signaling action landed
- `expectedRegisterEventWindow` — `minimumDelayDays`, `expectedDelayDays`, `maximumDelayDays`
- `divergenceHandling` — `divergenceMessageType` (typically `actionConfirmationDispute`), `divergenceRoutingTarget`, `escalationPath`

## Worked example — Phase 4 EPO terminal filing

```json
{
  "payload": {
    "artifactReference": {
      "documentReferences": [
        "urn:ipproto:document:epo-terminal-doc-de",
        "urn:ipproto:document:epo-terminal-doc-fr",
        "urn:ipproto:document:epo-terminal-doc-gb"
      ]
    },
    "actionDeclaration": {
      "actionCategory": "urn:ipproto:action:officeFiling",
      "actionTarget": {
        "targetSystem": "urn:ipproto:system:epoTerminal",
        "targetUri": "https://my.epo.org/applications/EP21712345"
      },
      "actionInstructions": {
        "steps": [
          {"stepNumber": 1, "stepDescription": "Log in to MyEPO with representative credentials."},
          {"stepNumber": 2, "stepDescription": "Navigate to post-grant validation submission."},
          {"stepNumber": 3, "stepDescription": "Upload prepared DE validation package.", "stepReference": {"documentReference": "urn:ipproto:document:epo-terminal-doc-de"}, "stepValidation": "EPO confirmation number displayed."},
          {"stepNumber": 4, "stepDescription": "Repeat upload for FR and GB."},
          {"stepNumber": 5, "stepDescription": "Submit and capture confirmation receipts."}
        ]
      },
      "actionDeadline": {
        "deadlineDate": "2026-08-28T23:59:59+02:00",
        "deadlineSource": "urn:ipproto:deadline:epoR713ResponseDeadline",
        "deadlineImpact": "bindingLegal"
      }
    },
    "expectedConfirmation": {
      "confirmationMessage": "clientActionCompleted",
      "confirmationDeadline": "2026-06-30T17:00:00Z",
      "evidenceExpectations": {
        "evidenceTypes": ["urn:ipproto:evidence:epoConfirmationNumber", "urn:ipproto:evidence:epoSignedReceipt"],
        "evidenceMandatory": "required"
      }
    },
    "expectedRegisterConfirmation": {
      "expectedRegisterEventType": "urn:ipproto:registerEvent:postGrantFilingReceived",
      "expectedRegisterEventWindow": {"minimumDelayDays": 1, "expectedDelayDays": 3, "maximumDelayDays": 14},
      "divergenceHandling": {
        "divergenceMessageType": "actionConfirmationDispute",
        "divergenceRoutingTarget": "urn:ipproto:actor:meridian-ip-group",
        "escalationPath": "If register confirmation does not arrive within 14 days, Meridian IP Group's case team investigates with EPO directly."
      }
    }
  }
}
```

## Behavior on receipt

The receiver performs the action through their external system, captures evidence, and produces [Client Action Completed](Client%20Action%20Completed.md). The protocol's monitoring window for the expected register event begins running.

## Related messages

- Pairs with [Client Action Completed](Client%20Action%20Completed.md)
- Followed by [Register Event](../Steady-State%20Events/Register%20Event.md) (the authoritative confirmation)
- Divergence detected: [Action Confirmation Dispute](../Disputes/Action%20Confirmation%20Dispute.md) fires

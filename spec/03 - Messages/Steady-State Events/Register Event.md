---
type: message
category: steady-state-events
status: v0.1
---

# Register Event

> Register or register-observer publishes a register event.

## Purpose

The register-side counterpart to [Service Finding](Service%20Finding.md). Where ServiceFinding is service-provider-produced based on subscriptions, RegisterEvent is what registers (or actors observing registers on their behalf) produce based on actual register publications.

The two messages have similar structural roles but different authority semantics — RegisterEvents carry the legalStatus authority that ServiceFindings cannot carry.

## Producer

A register actor (the EPO, USPTO, etc.) directly, or an observer acting under `registerObserverDelegated` authority.

## Recipients

Subscribers and other interested actors.

## Payload

### `registerEventReference`
Type: URI, required

`urn:ipproto:registerEvent:{uuid}`.

### `publishingRegister`
Type: structured, required

- `registerActorUri` — [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) URI of the authoritative register
- `observerActorUri` — optional, when published by an observer rather than the register itself

### `registerEventCategory`
Type: URI, required

Standard categories aligned with ST.27 where applicable, in `urn:ipproto:registerEvent:` namespace:

- Application lifecycle: `applicationFiled`, `applicationPublished`, `searchReportPublished`, `examinationRequested`
- Grant procedures: `intentionToGrant`, `grantFeeReceived`, `decisionToGrant`, `grantPublished`, `postGrantFilingReceived`
- Oppositions: `oppositionFiled`, `oppositionGroundsPublished`, `oppositionDecisionPublished`
- Renewal lifecycle: `renewalFeeReceived`, `lapse`, `restoration`
- Ownership: `assignmentRecorded`, `licenseRecorded`, `securityInterestRecorded`
- Correction/republication: `republicationCorrection`, `limitationPublished`, `revocationPublished`

### `st27Mapping`
Type: structured, optional

WIPO ST.27 mapping. Sub-fields: `st27Code`, `st27Subcategory`, `st27Version`. Strongly recommended where mapping is unambiguous.

### `relatedAssetReferences`
Type: array of [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URIs, required

### `registerPublicationDate`
Type: ISO 8601 date, required

The date the register published the event. Distinct from `producedAt` (lag between register publication and protocol message).

### `registerEventContent`
Type: structured, required

Category-specific content. Schemas live in the companion catalog document.

## Worked example — Phase 0 Rule 71(3) detection

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "originatingRoleDeclaration": "urn:ipproto:roleDeclaration:reg-observer-001",
  "payload": {
    "registerEventReference": "urn:ipproto:registerEvent:r71-3-detection-...",
    "publishingRegister": {
      "registerActorUri": "urn:ipproto:actor:epo",
      "observerActorUri": "urn:ipproto:actor:meridian-ip-group"
    },
    "registerEventCategory": "urn:ipproto:registerEvent:intentionToGrant",
    "st27Mapping": {
      "st27Code": "A06",
      "st27Subcategory": "intentionToGrant",
      "st27Version": "1.6"
    },
    "relatedAssetReferences": ["urn:ipproto:asset:7c4f9a82-..."],
    "registerPublicationDate": "2026-04-28",
    "registerEventContent": {
      "targetAsset": "urn:ipproto:asset:7c4f9a82-...",
      "intentionDate": "2026-04-28",
      "responseDeadline": "2026-08-28",
      "druckexemplarReference": "urn:ipproto:document:druckexemplar-...",
      "formReference": "urn:ipproto:document:f8e2c91a-form-2004c",
      "proposedTextLanguage": "en"
    }
  }
}
```

The envelope's `assertions` array carries the [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) over `/legalStatus/events` populating the legal status.

## Worked example — grant fee received

```json
{
  "payload": {
    "registerEventCategory": "urn:ipproto:registerEvent:grantFeeReceived",
    "st27Mapping": {"st27Code": "A12", "st27Subcategory": "feeReceived"},
    "relatedAssetReferences": ["urn:ipproto:asset:7c4f9a82-..."],
    "registerPublicationDate": "2026-07-08",
    "registerEventContent": {
      "targetAsset": "urn:ipproto:asset:7c4f9a82-...",
      "feeReceivedDate": "2026-07-05",
      "feeAmount": {"amount": 1080.00, "currency": "EUR"},
      "feePaymentReference": "EPO-FEE-2026-0734291"
    }
  }
}
```

This event arrives within the expected window after [Payment Executed](../Payments/Payment%20Executed.md), confirming the fee landed on the register. The orchestrator detects the matching event and transitions the milestone to `completed`.

## Behavior on receipt

Receivers update legal-status replicas from the carried assertion. Subscribers may produce derivative [Service Finding](Service%20Finding.md) events with operational interpretation.

## Related messages

- May trigger [Asset Bootstrap](../Bootstrap%20and%20Discovery/Asset%20Bootstrap.md) (register-detection origin)
- Confirms [Client Action Completed](../Prepared-Action%20Handoff/Client%20Action%20Completed.md) and [Payment Executed](../Payments/Payment%20Executed.md) when expected
- Source for [Service Finding](Service%20Finding.md) events in subscriptions

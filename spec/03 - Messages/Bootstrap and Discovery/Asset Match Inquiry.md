---
type: message
category: bootstrap
status: v0.1
---

# Asset Match Inquiry

> Validates an asset against another actor's authoritative record.

## Purpose

Sent by an actor that has bootstrapped an asset and wants to validate the bootstrap against another actor's authoritative record. The most common case is the orchestrator inquiring with the corporate's IPMS to confirm the corporate recognizes the asset and authorizes operation.

The same structure supports other directions: corporate inquiring with external counsel to confirm representation, service provider inquiring with another service provider about delegation chains.

## Producer

The actor wanting to validate the asset against an authoritative record. Typically the orchestrator that produced an [Asset Bootstrap](Asset%20Bootstrap.md).

## Recipients

The actor expected to confirm or deny. Identified through the `addressedTo` array.

## Payload

### `assetReference`
Type: [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URI, required

The asset being inquired about.

### `inquiryType`
Type: enumeration, required

- `recognitionAndAuthorization` — does the receiver recognize this asset and confirm authority?
- `enrichment` — receiver is asked to enrich the asset record with additional sections under their authority
- `correspondenceMatch` — does this asset correspond to a record in the receiver's system?
- `authorityVerification` — does the receiver confirm the asset's registered authority claims?

### `inquiryScope`
Type: array of section paths, required

For `recognitionAndAuthorization`, typically `[""]` (the whole asset). For `enrichment`, specific sections.

### `assertedResolution`
Type: structured, optional

The inquirer's understanding of how the asset's entities resolve. Sub-field: `entityReferences` array — for each entity to validate, an [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md).

### `responseDeadline`
Type: ISO 8601 datetime, optional

When response is expected.

### `operationalContext`
Type: structured, optional

Why the inquiry is being made:
- `workstreamUri` — relevant workstream
- `triggeringEventUri` — original trigger
- `urgency` — `routine`, `expedited`, `urgent`

## Worked example — Phase 0a

```json
{
  "payload": {
    "assetReference": "urn:ipproto:asset:7c4f9a82-...",
    "inquiryType": "recognitionAndAuthorization",
    "inquiryScope": [""],
    "assertedResolution": {
      "entityReferences": [
        { /* EntityReference for Northwind Industries SE assignee with Meridian IP Group's resolution */ }
      ]
    },
    "responseDeadline": "2026-04-30T17:00:00Z",
    "operationalContext": {
      "workstreamUri": "urn:ipproto:workstream:8a4b1c92-proposed",
      "triggeringEventUri": "urn:ipproto:registerEvent:r71-3-detection-...",
      "urgency": "expedited"
    }
  }
}
```

## Behavior on receipt

The receiver looks up the asset in their replica using the URI. If not present, the response indicates so. If present, the receiver validates against their own record and produces an [Asset Match Response](Asset%20Match%20Response.md).

Until response arrives, the inquirer's downstream workflow may be blocked depending on the inquiry type — a `recognitionAndAuthorization` inquiry typically blocks until response.

## Related messages

- Triggered by [Asset Bootstrap](Asset%20Bootstrap.md)
- Answered by [Asset Match Response](Asset%20Match%20Response.md)
- May surface [Asset Authority Dispute](../Disputes/Asset%20Authority%20Dispute.md) or [Identity Resolution Dispute](../Disputes/Identity%20Resolution%20Dispute.md) on disagreement

## See also

- [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md)
- [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md)

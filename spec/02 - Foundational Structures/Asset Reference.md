---
type: foundational
status: v0.1
---

# Asset Reference

> Canonical structure for referring to a patent or other IP asset.

Used wherever the protocol needs to identify an asset — within messages, within authority claims, within data assertions, within document references.

## Structure

### `assetUri`
Type: URI, required

Stable protocol identifier of the form `urn:ipproto:asset:{uuid}`. Assigned at first appearance of the asset in the protocol (typically by [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md)). The same asset always uses the same URI across all subsequent messages.

Two actors may independently bootstrap the same asset and produce two URIs initially; reconciliation merges them via [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) and [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md).

### `assetType`
Type: enumeration, required

One of: `patent`, `utilityModel`, `designRegistration`, `trademark`, `plantVariety`, `geographicalIndication`, `otherIp`. Drives type-specific defaults elsewhere in the protocol.

### `identifiers`
Type: array of structured entries, required (at least one)

Each identifier carries:
- `scheme` — URI naming the identifier system (`urn:ipproto:scheme:office-application`, `urn:ipproto:scheme:office-publication`, `urn:ipproto:scheme:internalReference`, etc.)
- `officeCode` — ST.3 code where applicable (`EP`, `US`, `JP`, `WO`, `DE`)
- `value` — the identifier value as published or recorded
- `kindCode` — ST.16 kind code where applicable (`A1`, `B1`, `T2`)
- `referenceType` — enumeration: `application`, `publication`, `grant`, `internalReference`
- `issueDate` — ISO 8601 date when this identifier was issued

Multiple identifiers per asset are common — an EP application has an EP application number, an EP publication number, and the corresponding national derivations.

### `relationships`
Type: array, optional

Relationships to other assets. Each entry: `relatedAssetUri`, `relationshipType` (enumeration: `parent`, `divisional`, `continuation`, `nationalPhase`, `validation`, `priorityClaim`, free-form URN), `effectiveDate`.

For the EP-and-national family pattern, the EP grant is the parent of national validations through `validation` relationships; the validations reference back through `nationalPhase`.

### `displayLabel`
Type: string, optional

Human-readable label for UI rendering. `EP 21712345.6`, `Northwind Industries-2021-0473-EP`. Not authoritative — receivers compute display labels from identifiers when needed.

## Worked example

```json
{
  "assetUri": "urn:ipproto:asset:7c4f9a82-3e15-4d0a-9f62-1b8c5e23a4d8",
  "assetType": "patent",
  "identifiers": [
    {
      "scheme": "urn:ipproto:scheme:office-application",
      "officeCode": "EP",
      "value": "21712345.6",
      "referenceType": "application",
      "issueDate": "2021-04-15"
    },
    {
      "scheme": "urn:ipproto:scheme:office-publication",
      "officeCode": "EP",
      "value": "EP3987654",
      "kindCode": "A1",
      "referenceType": "publication",
      "issueDate": "2022-10-20"
    }
  ],
  "displayLabel": "EP 21712345.6"
}
```

## Behavior

The protocol's URI is canonical. Office identifiers are descriptive — they may change over an asset's life (an application becomes a publication, a publication becomes a grant), and the protocol-assigned URI remains stable through those transitions.

Identifiers are append-mostly: new identifiers are added as they become known; old identifiers are not removed (they remain valid historical references) but may be flagged superseded.

## Open decisions

See [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md) for asset-reference decisions ratified for v0.1.

## See also

- [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md) — first appearance of the asset in the protocol
- [Asset Match Inquiry](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md) / [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) — validation of an asset against a corporate record
- [Authority Claim](Authority%20Claim.md) — claims over sections of asset records
- [Workstream](Workstream.md) — operational work on assets

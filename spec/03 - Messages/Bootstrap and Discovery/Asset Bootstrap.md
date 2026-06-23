---
type: message
category: bootstrap
status: v0.1
---

# Asset Bootstrap

> An asset's first appearance in the protocol.

## Purpose

Origins from a register adapter (Phase 0 of the EP post-grant flow), from a corporate IPMS introducing an asset, from a service provider creating an asset from a draft, or from an export from another protocol-conformant system. Whoever produces the bootstrap asserts the asset's existence and provides the initial register-derived or origin-derived data.

## Producer

Any actor with appropriate authority to introduce a new asset:
- Register adapter (with `registerObserverDelegated` claim basis) — register-detection origin
- Corporate IPMS adapter (with `internalDeclaration` claim basis) — corporate-introduction origin
- Service provider — service-provider-initialization origin
- Migration system — protocol-migration origin

## Recipients

Any actor with relevant interest. The originator addresses recipients explicitly through the [Common Envelope](../../02%20-%20Foundational%20Structures/Common%20Envelope.md)'s `addressedTo` array. Receiving actors that recognize the asset's resolved assignee or any of the identifiers as relevant create a local replica.

## Payload

### `asset`
Type: full [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) structure, required

The asset being bootstrapped, with all known identifiers.

### `bootstrapBasis`
Type: structured, required

- `basisType` — enumeration: `registerDetection`, `corporateIntroduction`, `serviceProviderInitialization`, `protocolMigration`, `manualEntry`
- `triggeringReference` — optional URI to the triggering event

### `initialAssertions`
Type: array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) structures, required

Assertions that populate the asset record at bootstrap. Register-initiated bootstraps include `/legalStatus`, `/identifiers`, `/assignees`. Corporate-initiated bootstraps include `/internalReferences`.

### `initialAuthorityClaims`
Type: array of [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) structures, required

Claims establishing the initial authority registry.

### `subscriptionInvitations`
Type: array, optional

Invitations to specific actors to subscribe. Each entry: `invitedActor`, `invitationScope` (array of section paths), `invitationBasis` (free-form structured).

## Worked example — Phase 0 register-initiated bootstrap

```json
{
  "messageUri": "urn:ipproto:message:a8e2c91a-...",
  "messageType": "urn:ipproto:message:assetBootstrap",
  "protocolVersion": "0.1",
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "originatingRoleDeclaration": "urn:ipproto:roleDeclaration:reg-observer-001",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:northwind-industries", "expectedRole": "urn:ipproto:role:assetOwner"},
    {"actorUri": "urn:ipproto:actor:meridian-ip-group", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "producedAt": "2026-04-28T07:15:30Z",
  "payload": {
    "asset": { /* full Asset Reference */ },
    "bootstrapBasis": {
      "basisType": "registerDetection",
      "triggeringReference": "urn:ipproto:registerEvent:r71-3-detection-..."
    },
    "initialAssertions": [
      /* DataAssertion for /legalStatus/events */,
      /* DataAssertion for /assignees */
    ],
    "initialAuthorityClaims": [
      /* AuthorityClaim from EPO over /legalStatus */
    ],
    "subscriptionInvitations": [
      {
        "invitedActor": "urn:ipproto:actor:northwind-industries",
        "invitationScope": ["/legalStatus/events", "/assignees"],
        "invitationBasis": {
          "narrative": "Resolved assignee Northwind Industries SE matches monitored subscriber profile."
        }
      }
    ]
  }
}
```

## Behavior on receipt

Receiving actors create a local replica of the asset, apply initial assertions to populate sections, and store the authority registry. The protocol does not require explicit acknowledgment — validation happens through follow-up [Asset Match Inquiry](Asset%20Match%20Inquiry.md) / [Asset Match Response](Asset%20Match%20Response.md).

If a receiving actor already has the asset under a different protocol URI (independent bootstrap), an asset-identity-reconciliation event fires through the dispute machinery.

## Related messages

- Often paired with [Register Event](../Steady-State%20Events/Register%20Event.md) in register-detection origin
- Followed by [Asset Match Inquiry](Asset%20Match%20Inquiry.md) from orchestrator to corporate
- Acknowledged through [Asset Match Response](Asset%20Match%20Response.md)

## See also

- [EP Post-Grant Flow Walkthrough](../../04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md) — Phase 0 walkthrough
- [Common Envelope](../../02%20-%20Foundational%20Structures/Common%20Envelope.md)
- [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md)

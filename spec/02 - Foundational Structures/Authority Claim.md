---
type: foundational
status: v0.1
---

# Authority Claim

> Declares which actor has the right to make assertions over which sections of which records.

The protocol's authority model is **explicit-claim** rather than CRDT-style merge. Conflicts surface as named events (see [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md)) rather than being silently resolved.

Authority claims are themselves stored within the records they govern, in a meta-section. Asset records have an `_authority` section listing all claims; subscription records, workstream records, and milestone records similarly.

## Structure

### `claimUri`
Type: URI, required

Stable identifier of the form `urn:ipproto:authorityClaim:{uuid}`.

### `recordUri`
Type: URI, required

The record this claim applies to. Typically an [asset](Asset%20Reference.md), [Workstream](Workstream.md), [Milestone](Milestone.md), or subscription URI.

### `sectionPath`
Type: JSON Pointer string (RFC 6901), required

The section of the record this claim covers. `/legalStatus`, `/internalReferences`, `/serviceEngagements`, `/legalStatus/events`. Empty string `""` claims the whole record.

### `claimant`
Type: structured, required

Who holds the claim:
- `actorUri` — [Actor Reference](Actor%20Reference.md)
- `roleDeclarationUri` — [Actor Role Declaration](Actor%20Role%20Declaration.md) under which the claim is held

### `claimType`
Type: enumeration, required

- `exclusive` — the claimant is the only actor authorized to make assertions over this section. Other actors' assertions are rejected.
- `sourceOfTruth` — the claimant is authoritative for this section; other actors may assert but the source-of-truth's assertions override.
- `advisory` — the claimant may make assertions but they are advisory; other actors with stronger claim types take precedence.

### `claimBasis`
Type: URI, required

Why the claimant has this authority. URN-namespaced bases:

- `urn:ipproto:basis:registerSourceOfTruth` — the claimant is a register and authoritative by virtue of being the office
- `urn:ipproto:basis:registerObserverDelegated` — the claimant is observing on behalf of the register
- `urn:ipproto:basis:contractualOwnership` — the claimant owns the asset (corporate ownership claim)
- `urn:ipproto:basis:contractualService` — the claimant has been engaged contractually to perform services
- `urn:ipproto:basis:operationalDelegation` — the claimant has been delegated by another actor with authority
- `urn:ipproto:basis:internalDeclaration` — the claimant declares its own internal authority (always limited to its own internal sections)
- `urn:ipproto:basis:protocolPrimitive` — the protocol's own internal claims (rare, used for system-level records)

### `effectiveFrom`
Type: ISO 8601 datetime, required

### `effectiveTo`
Type: ISO 8601 datetime, optional

When the claim expires. Omitted for indefinite claims.

### `claimAgreementReference`
Type: string, optional

Reference to the underlying contract or agreement supporting the claim. `Northwind Industries-DM-MSA-2024-EU#payment-mandate`.

### `supersedes`
Type: array of claimUris, optional

Prior claims this one supersedes. When authority transfers (an asset is assigned to a new owner; a service contract is reassigned to a new provider), the new claim supersedes the old.

## Worked example

```json
{
  "claimUri": "urn:ipproto:authorityClaim:northwind-industries-internal-claim-...",
  "recordUri": "urn:ipproto:asset:7c4f9a82-...",
  "sectionPath": "/internalReferences",
  "claimant": {
    "actorUri": "urn:ipproto:actor:northwind-industries",
    "roleDeclarationUri": "urn:ipproto:roleDeclaration:..."
  },
  "claimType": "exclusive",
  "claimBasis": "urn:ipproto:basis:internalDeclaration",
  "effectiveFrom": "2026-04-28T08:42:00Z",
  "claimAgreementReference": null
}
```

## Behavior

Authority claims are themselves data assertions and follow the same dispute/resolution machinery. A new claim that does not properly supersede an existing claim, or that conflicts with a `sourceOfTruth` or `exclusive` claim, triggers an [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) surfacing the conflict for resolution by the routed actor.

Multiple `advisory` claims over the same section are permitted; the protocol does not constrain how multiple advisory views are reconciled (typically up to the receiver's policy).

## See also

- [Data Assertion](Data%20Assertion.md) — the structure governed by authority claims
- [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) — conflicts surface here
- [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md) — disputes resolve here

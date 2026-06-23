---
type: message
category: disputes
status: v0.1
---

# Identity Resolution Dispute

> Two actors hold incompatible resolutions of the same entity literal.

## Purpose

Surfaces a disagreement about how a literal entity reference resolves. Per [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md), identity resolution is per-actor — but when two actors' resolutions are incompatible AND the disagreement materially affects operational decisions, the dispute is surfaced for explicit resolution.

The protocol does NOT auto-adjudicate identity. The dispute mechanism just makes the disagreement visible.

## Producer

The actor that observes the disagreement. Often the orchestrator reading two messages with conflicting resolutions of the same literal.

## Recipients

Both disputing actors; routed resolver if applicable.

## Payload

### `disputeReference`
Type: URI, required

`urn:ipproto:dispute:{uuid}`.

### `disputedLiteral`
Type: structured, required

The literal at the heart of the dispute:
- `literal` — the literal `value` and `source` from [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md)
- `appearanceContext` — where the literal appeared (which messages, which records)

### `competingResolutions`
Type: array of structured entries, required (exactly 2 in v0.1)

Each entry: `assertingActorUri`, `resolvedEntityUri` (asserter-specific URI), `resolutionMethod`, `confidenceLevel`, `resolutionBasis` (narrative).

### `materialImpact`
Type: structured, required

Why this resolution dispute matters:
- `impactDescription` — narrative
- `affectedAssertions` — assertions that depend on resolution
- `affectedDecisions` — narrative

### `disputeNarrative`
Type: string, required

### `disputeRoutingTarget`
Type: structured, optional

Often omitted — the protocol may route to no specific actor, leaving each disputing actor to maintain their own view. When routed, typically to the corporate (the asset owner) or to a designated identity resolution authority.

### `responseDeadline`
Type: ISO 8601 datetime, optional

## Worked example

```json
{
  "payload": {
    "disputeReference": "urn:ipproto:dispute:idres-001-...",
    "disputedLiteral": {
      "literal": {
        "value": "Northwind Industries SE",
        "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo", "sourcePublicationDate": "2026-04-28"}
      },
      "appearanceContext": {"appearedInMessages": ["urn:ipproto:message:bootstrap-001-..."], "appearedInRecords": ["urn:ipproto:asset:7c4f9a82-..."]}
    },
    "competingResolutions": [
      {
        "assertingActorUri": "urn:ipproto:actor:meridian-ip-group",
        "resolvedEntityUri": "urn:meridian-ip-group:entity:northwind-industries-se",
        "resolutionMethod": "deterministicIdentifier",
        "confidenceLevel": "exact",
        "resolutionBasis": "Matched on legalName and jurisdictionCode."
      },
      {
        "assertingActorUri": "urn:ipproto:actor:northwind-industries",
        "resolvedEntityUri": "urn:northwind-industries:entity:northwind-industries-se-coatings-licensing",
        "resolutionMethod": "humanReview",
        "confidenceLevel": "high",
        "resolutionBasis": "Internal entity graph identifies licensing-active subsidiary Northwind Industries Coatings Licensing as the operative entity for this asset family."
      }
    ],
    "materialImpact": {
      "impactDescription": "Routing of opposition watch findings depends on which entity is treated as canonical.",
      "affectedAssertions": ["urn:ipproto:assertion:..."]
    },
    "disputeNarrative": "Meridian IP Group resolves to top-level Northwind Industries SE; Northwind Industries resolves to operating subsidiary Northwind Industries Coatings Licensing."
  }
}
```

## Behavior on receipt

Each disputing actor maintains their own resolution. The protocol's response options:
1. Both actors retain their own resolutions; dispute is informational only
2. Bilateral arrangement establishes mapping (out-of-protocol)
3. [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md) designates one resolution as canonical for routing purposes within a specific scope

The protocol does NOT force a global identity resolution.

## Related messages

- May surface from [Asset Match Response](../Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) with `disputedResolution` outcome
- Resolved by [Dispute Resolution Decision](Dispute%20Resolution%20Decision.md) (or left open for actor-internal handling)
- See [Open Questions for Consortium](../../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for the v0.1 scope of identity disputes

---
type: foundational
status: v0.6
---

# Entity Reference

> Carries identity resolution context for organizations and individuals named in records.

Used wherever an entity is referenced — assignees, applicants, inventors, representatives, opponents, examiners. The structure is uniform across these contexts; what differs is the schemes available for stable identifiers.

The protocol's identity resolution is **per-actor graph maintenance with explicit dispute mechanism**, not cross-actor identity exchange. Each actor resolves literals to entities in their own graph; the protocol carries resolution context within messages but does not standardize how graphs are maintained or shared.

## Structure

### `literal`
Type: structured, required

The entity reference exactly as observed:
- `value` — the literal string as published. Never modified. `Northwind Industries SE`, `Müller, Klaus`. Whitespace, punctuation, case preserved.
- `source` — structured. Sub-fields:
  - `sourceType` — enumeration: `register`, `corporateRecord`, `selfDeclaration`, `derivedDocument`, `other`
  - `sourceActorUri` — optional [Actor Reference](Actor%20Reference.md) URI of the publishing actor
  - `sourcePublicationDate` — optional ISO 8601 date
  - `sourceDocumentReference` — optional [Document Reference](Document%20Reference.md) URI

### `resolution`
Type: structured, optional

The asserter's resolution of the literal to an entity in their graph. Omitted when the asserter has no resolution and is just passing through the literal.

- `resolvedEntityUri` — required, the asserter's stable identifier for the resolved entity. Asserter-specific URI: `urn:meridian-ip-group:entity:northwind-industries-se`, `urn:northwind-industries:entity:northwind-industries-se-licensing-active`. Two actors resolving the same literal will use different URIs unless they have explicit bilateral agreement.
- `resolvedAt` — required, ISO 8601 datetime
- `confidenceLevel` — optional, enumeration: `exact`, `high`, `medium`, `low`
- `resolutionMethod` — optional, enumeration: `deterministicIdentifier`, `attributeMatching`, `humanReview`, `priorAssertion`, `automated`
- `resolutionBasis` — optional, free-form structured. Audit material; protocol does not constrain shape.

### `identifiers`
Type: array, optional

Added in 0.6. Identifiers of the entity that the asserter knows, so that a receiver, for instance a provider running a conflict check, can match the entity without relying on the name alone. Each entry has the shape of an identifier in [Actor Reference](Actor%20Reference.md): `scheme`, `value`, optional `verifiedAt`, and `registrationAuthority`, required with `urn:ipproto:scheme:companyRegister`. Typical schemes are `urn:ipproto:scheme:lei`, `urn:ipproto:scheme:vat` and `urn:ipproto:scheme:companyRegister`.

Unlike `resolution`, which is the asserter's own view, an identifier is a public fact about the entity. Unlike `crossActorReferences`, it names no other actor's graph.

### `aliases`
Type: array of strings, optional

Added in 0.6. Other names under which the entity is known: former names, trading names, transliterations. Each is recorded as found. `literal.value` stays the name as observed in the source.

### `crossActorReferences`
Type: array, optional

When the asserter knows other actors' identifiers for the same entity (through bilateral arrangements), those identifiers can be carried alongside. Each entry: `actorUri`, `entityUriInActor`.

This is the **only** field in the protocol where cross-actor identity information is carried, and is strictly opt-in. Most messages omit it. See [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for v0.1 disposition.

## Worked example — resolved entity reference

```json
{
  "literal": {
    "value": "Northwind Industries SE",
    "source": {
      "sourceType": "register",
      "sourceActorUri": "urn:ipproto:actor:epo",
      "sourcePublicationDate": "2026-04-28"
    }
  },
  "resolution": {
    "resolvedEntityUri": "urn:meridian-ip-group:entity:northwind-industries-se",
    "resolvedAt": "2026-04-28T07:15:30Z",
    "confidenceLevel": "exact",
    "resolutionMethod": "deterministicIdentifier",
    "resolutionBasis": {
      "matchedFields": ["legalName", "jurisdictionCode"],
      "lookupTable": "meridian-corporate-entity-graph-v3"
    }
  }
}
```

## Worked example — with identifiers and aliases

```json
{
  "literal": {"value": "Wingtip Components GmbH", "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo"}},
  "identifiers": [
    {"scheme": "urn:ipproto:scheme:companyRegister", "value": "HRB 000000", "registrationAuthority": "RA000000"}
  ],
  "aliases": ["Wingtip Components", "Wingtip Komponenten GmbH"]
}
```

## Worked example — unresolved literal

```json
{
  "literal": {
    "value": "Northwind Industries SE",
    "source": {
      "sourceType": "register",
      "sourceActorUri": "urn:ipproto:actor:epo",
      "sourcePublicationDate": "2026-04-28"
    }
  }
}
```

## Behavior

The protocol does not validate or contest resolution decisions. If two actors hold incompatible resolutions of the same literal, the conflict surfaces as an [Identity Resolution Dispute](../03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md) but is not auto-adjudicated.

Receivers consume entity references with three behavior options:
1. Accept the asserter's resolution into their own graph
2. Apply their own resolution and surface the difference
3. Pass through unresolved, deferring resolution to a downstream consumer

## See also

- [Identity Resolution Dispute](../03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md) — how disagreements surface
- [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md) — how disagreements resolve
- [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for `confidenceLevel` and `crossActorReferences` decisions

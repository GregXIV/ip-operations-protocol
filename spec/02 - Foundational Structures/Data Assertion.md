---
type: foundational
status: v0.1
---

# Data Assertion

> A claim being made about the value of a section of a record.

Data assertions are the protocol's primitive for changing data. Every value in a record was, at some point, asserted by an authorized actor. The chain of assertions over time is the audit trail.

## Structure

### `assertionUri`
Type: URI, required

Stable identifier of the form `urn:ipproto:assertion:{uuid}`.

### `recordUri`
Type: URI, required

The record this assertion applies to. Same shape as in [Authority Claim](Authority%20Claim.md).

### `sectionPath`
Type: JSON Pointer string (RFC 6901), required

The section being asserted. `/legalStatus/events`, `/assignees`, `/internalReferences/matterReference`.

### `asserter`
Type: structured, required

Who is making the assertion:
- `actorUri` — [Actor Reference](Actor%20Reference.md)
- `roleDeclarationUri` — [Actor Role Declaration](Actor%20Role%20Declaration.md)

### `assertionContent`
Type: structured, required

What the assertion says. Two forms:

**`fullValue`** — the assertion sets the section to a complete value, replacing any prior content:
```json
{
  "contentType": "fullValue",
  "value": "Northwind Industries-2021-0473-EP"
}
```

**`patches`** — the assertion modifies the section through JSON Patch operations (RFC 6902, subset):
```json
{
  "contentType": "patches",
  "operations": [
    {"op": "add", "path": "/-", "value": {...}},
    {"op": "replace", "path": "/0/status", "value": "completed"},
    {"op": "remove", "path": "/2"},
    {"op": "test", "path": "/0/status", "value": "completed"}
  ]
}
```

The supported operations are `add`, `remove`, `replace`, `test`. The `move` and `copy` operations are NOT supported — they introduce ambiguity in assertion ordering and audit. If a value needs to move, the assertion uses `add`+`remove` explicitly.

### `claimReference`
Type: [Authority Claim](Authority%20Claim.md) URI, required

The authority claim under which this assertion is made. The claim must cover the asserted section and be effective at the assertion time.

### `assertedAt`
Type: ISO 8601 datetime, required

### `supersedes`
Type: array of assertionUris, optional

Prior assertions this one supersedes. Most assertions supersede the most recent prior assertion on the same section; explicit supersedes is used when the chain branches or when superseding non-immediate predecessors.

### `evidenceReference`
Type: array, optional

Documents or other evidence supporting the assertion. Each entry is a [Document Reference](Document%20Reference.md) URI.

## Worked example — full value

```json
{
  "assertionUri": "urn:ipproto:assertion:e2c1f8a3-...",
  "recordUri": "urn:ipproto:asset:7c4f9a82-...",
  "sectionPath": "/internalReferences/matterReference",
  "asserter": {
    "actorUri": "urn:ipproto:actor:northwind-industries",
    "roleDeclarationUri": "..."
  },
  "assertionContent": {
    "contentType": "fullValue",
    "value": "Northwind Industries-2021-0473-EP"
  },
  "claimReference": "urn:ipproto:authorityClaim:northwind-industries-internal-claim-...",
  "assertedAt": "2026-04-28T08:42:11Z"
}
```

## Worked example — patches

```json
{
  "assertionUri": "urn:ipproto:assertion:8e4f1a2c-...",
  "recordUri": "urn:ipproto:asset:7c4f9a82-...",
  "sectionPath": "/legalStatus/events",
  "asserter": {
    "actorUri": "urn:ipproto:actor:epo",
    "roleDeclarationUri": "..."
  },
  "assertionContent": {
    "contentType": "patches",
    "operations": [
      {
        "op": "add",
        "path": "/-",
        "value": {
          "eventType": "intentionToGrant",
          "wipoSt27Code": "A06",
          "publicationDate": "2026-04-28",
          "responseDeadline": "2026-08-28"
        }
      }
    ]
  },
  "claimReference": "urn:ipproto:authorityClaim:7c1d4b82-...",
  "assertedAt": "2026-04-28T07:15:00Z"
}
```

## Behavior on conflict

When a new assertion conflicts with the current state under an `exclusive` or `sourceOfTruth` claim held by another actor, the assertion is rejected and an [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) event fires.

When two assertions arrive for the same section under the same claim within the time tolerance, last-writer-wins by `assertedAt` timestamp.

## See also

- [Authority Claim](Authority%20Claim.md) — assertions cite claims as basis
- [Common Envelope](Common%20Envelope.md) — assertions are typically carried in the envelope's `assertions` array
- [Conventions](../01%20-%20Front%20Matter/Conventions.md) — JSON Pointer (RFC 6901) and JSON Patch (RFC 6902) usage

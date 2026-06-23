---
type: profile
status: v0.1
---

# Asset Identification and Resolution

> A normative profile companion to [Asset Reference](Asset%20Reference.md): how an asset is uniquely identified, how office numbers are represented, and how observed identifiers resolve to one canonical asset.

## Purpose and scope

This profile answers a single question the operational layer must answer before any other work can proceed: *given some office numbers, which asset is this, and what is the one identifier everything else should point to?*

It does **not** define a new numbering scheme. It builds on the WIPO numbering standards already in use — [ST.3](../01%20-%20Front%20Matter/Reference%20Standards.md) for office codes and ST.16 for kind codes — and adds only the operational structure around them: a stable canonical handle, a descriptive record of every office number, and an explicit, auditable resolution model.

The profile is normative for any actor that bootstraps, references, or resolves assets — orchestrators, service providers, IPMS vendors, and registers alike.

## 1. Canonical identity

Every asset has exactly one canonical identifier: `urn:ipproto:asset:{uuid}` (the `assetUri`).

- **Assigned once.** Minted at the asset's first appearance in the protocol (an [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md)), and never reassigned.
- **Immutable for life.** Office numbers change as an asset moves from application to publication to grant to national validations; the `assetUri` does not.
- **Opaque.** It encodes no meaning. It is a join key, not a number to be parsed. All semantics live in the descriptive identifiers below.

The `assetUri` is what messages, schemas, authority claims, and audit trails reference. It is the asset's identity; the office numbers are how the world outside the protocol names it.

## 2. Identifier representation

Each office number is recorded as an entry in the Asset Reference `identifiers[]` array. The entry is a thin descriptive wrapper around an existing standard:

| Field | Carries | Leans on |
|---|---|---|
| `scheme` *(required)* | Which identifier system the value belongs to | URN namespace (see vocabulary below) |
| `officeCode` *(optional)* | Issuing office / jurisdiction | WIPO ST.3 |
| `value` *(required)* | The number exactly as published or recorded | office-native |
| `kindCode` *(optional)* | Document kind (A1, B1, T3 …) | WIPO ST.16 |
| `referenceType` *(optional)* | `application` · `publication` · `grant` · `internalReference` | protocol enum |
| `issueDate` *(optional)* | When the identifier was issued | ISO 8601 |

**`value` is recorded verbatim.** The number is stored as the office published it. Any normalized or canonicalized form (e.g. a DOCDB-style representation) is a *derived view* an actor may compute, never a replacement for the published value.

**Identifiers are append-mostly.** As an asset progresses, new identifiers accrue. A superseded identifier is flagged (via the relationship and document-status mechanisms), not deleted — historical references must keep resolving.

### Scheme vocabulary (v0.1)

A small recommended set is seeded; the field stays open to namespaced custom schemes, following the same lightweight, opt-in, not-enforced pattern as custom milestone categories.

Seeded recommended schemes:

- `urn:ipproto:scheme:office-application` — an application number
- `urn:ipproto:scheme:office-publication` — a publication or grant number
- `urn:ipproto:scheme:docdb-family` — a DOCDB family identifier (see §3)
- `urn:ipproto:scheme:internal-reference` — an actor-internal matter or docket reference

Custom schemes use `urn:ipproto:scheme:{namespace}:{name}`. The protocol does not validate scheme values beyond requiring the field; unknown schemes degrade gracefully to "unknown" rather than being rejected.

### Worked example

An EP asset, partway through its life, carrying application, publication, and grant identifiers plus a national validation:

```json
{
  "assetUri": "urn:ipproto:asset:7c4f9a82-3e15-4d0a-9f62-1b8c5e23a4d8",
  "assetType": "patent",
  "identifiers": [
    { "scheme": "urn:ipproto:scheme:office-application", "officeCode": "EP", "value": "21712345.6", "referenceType": "application", "issueDate": "2021-04-15" },
    { "scheme": "urn:ipproto:scheme:office-publication", "officeCode": "EP", "value": "EP3987654", "kindCode": "A1", "referenceType": "publication", "issueDate": "2022-10-20" },
    { "scheme": "urn:ipproto:scheme:office-publication", "officeCode": "EP", "value": "EP3987654", "kindCode": "B1", "referenceType": "grant", "issueDate": "2026-07-08" },
    { "scheme": "urn:ipproto:scheme:office-publication", "officeCode": "DE", "value": "DE602022001234", "kindCode": "T3", "referenceType": "grant" },
    { "scheme": "urn:ipproto:scheme:docdb-family", "value": "78451203" }
  ],
  "displayLabel": "EP 3 987 654 B1"
}
```

The `assetUri` is identical regardless of which identifiers are present; the identifiers are the descriptive view that grows around it. The `docdb-family` identifier is the home for an asset's family id — assets sharing the same `docdb-family` value are members of one family (see §3).

## 3. Family and relationships

Cross-asset links are carried in the Asset Reference `relationships[]` array, each entry referencing a related asset by its own `assetUri` with a `relationshipType` (`parent`, `divisional`, `continuation`, `nationalPhase`, `validation`, `priorityClaim`, …) and an optional `effectiveDate`.

**DOCDB family is the canonical family backbone for v0.1.** Family membership and relationships are anchored on the DOCDB (simple/extended) family model, available through EPO OPS. National registers — including JPO and other national sources — provide *enrichment*: additional identifiers, status, and links layered onto the DOCDB-anchored family. This keeps v0.1 to a single consistent family model and avoids premature multi-family reconciliation. Treating national families as co-equal is deferred to a later version, to be revisited once real usage shows where the DOCDB backbone is insufficient.

### Family-derived relationships

A resolver asserts family **membership** — a structural fact from the family lookup — not prosecution **semantics**. Membership is expressed by the shared `docdb-family` identifier on each member (§2). A resolver MAY additionally emit explicit relationships of type `urn:ipproto:relationship:docdbFamilyMember` (structural, undirected). It MUST NOT assign semantic relationship types it has not verified: `validation`, `nationalPhase`, `divisional`, and the rest are claims about prosecution and require additional, authority-bearing evidence. Promoting a family member from structural membership to a typed semantic relationship is an enrichment step, recorded with its own provenance.

## 4. Resolution model

Resolution is the operation of turning observed identifiers into a canonical `assetUri`. It is a **lookup against authoritative sources, not a number-grammar parser.**

1. **Observed.** One or more identifiers arrive — from a register feed, an IPMS export, or a counterparty message.
2. **Lookup.** The resolver queries authoritative sources to find the asset and its family: EPO OPS / DOCDB as the backbone, JPO and national registers as enrichment.
3. **Canonical.** If the asset is already known, the existing `assetUri` is reused; on first sighting, a new one is minted.

### Resolution provenance (required)

Every resolution records its confidence and method, mirroring how [Entity Reference](Entity%20Reference.md) already treats identity resolution. This makes a weak or automated match visible and auditable rather than silent. It is schematized as the `Resolution Provenance` structure (`urn:ipproto:schema:0.1:resolutionProvenance`); a resolver's full emission — the Asset Reference plus its provenance — validates as `Resolved Asset` (`urn:ipproto:schema:0.1:resolvedAsset`). The fields:

- `resolvedAssetUri` — the canonical asset the identifiers were resolved to
- `resolvedAt` — ISO 8601 datetime
- `confidenceLevel` — `exact` · `high` · `medium` · `low`
- `resolutionMethod` — `deterministicIdentifier` · `familyLookup` · `attributeMatching` · `humanReview` · `priorAssertion`
- `resolutionBasis` — narrative or structured basis for the match

The **derivation rubric** — which evidence yields which `confidenceLevel` and `resolutionMethod` — is implementation-defined in v0.1; a canonical rubric is deferred to a governance body. Recommended baseline: `deterministicIdentifier` + `exact` for a direct ST.3/ST.16 hit; `familyLookup` for a match resolved via the DOCDB family; `priorAssertion` when an existing store already binds the identifier to an `assetUri`; `attributeMatching` or `humanReview` with `high`/`medium`/`low` as confidence degrades. A resolver SHOULD document its rubric.

Not every identifier type resolves directly. Family lookup commonly keys on a **publication** number; resolving from a bare application number may require a pre-step (e.g. application → publication via a register search). A resolver documents which inputs it supports; an unsupported input is a documented limitation, not a conformance failure.

As with identity, resolution is **per-actor**: the protocol does not force a single global resolution. Each actor maintains its own resolved view; the provenance record is what lets divergence be detected.

## 5. Reconciliation — no silent merge

When two actors independently bootstrap the same asset into two different `assetUri`s, the protocol does **not** quietly merge them.

The divergence surfaces as an [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) (or an [Identity Resolution Dispute](../03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md) when the disagreement is about entity rather than asset identity) and closes with a [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md). The decision designates the canonical `assetUri` for the relevant scope and preserves the full audit trail of how two views became one. Bilateral cross-references between an actor's local identifiers may additionally be carried using the Entity Reference `crossActorReferences` pattern, which is out-of-protocol-validation.

This is the same posture the protocol takes everywhere: authority is claimed and reconciled explicitly, never assumed.

## 6. Conformance

An actor or resolver conforms to this profile when it:

1. assigns and reuses a single stable `assetUri` per asset, never reassigning it;
2. records office numbers as `identifiers[]` entries using ST.3 office codes and ST.16 kind codes, with `value` stored verbatim;
3. never deletes a superseded identifier, flagging it instead;
4. records confidence and method on every resolution; and
5. reconciles a divergent canonical identifier through the dispute path rather than overwriting.

Two levels are recognised. A **representational** conformance covers points 1–3 (any actor referencing assets). A **resolving** conformance adds 4–5 (any actor that performs lookup-based resolution, e.g. an orchestrator or a conversion service).

## Profile decisions (v0.1)

Ratified by the maintainer for v0.1, reopenable when a governance body forms:

- **Scheme vocabulary** — seed a small recommended set; keep the field open to namespaced custom schemes.
- **Resolution provenance** — confidence level and method are required on every resolution.
- **Family backbone** — DOCDB family anchors v0.1; national registers enrich; co-equal national families deferred.
- **Family-derived relationships** — resolvers assert structural family membership (shared `docdb-family` identifier; optional `docdbFamilyMember` relationship), never unverified semantic types.
- **Confidence rubric** — the fields are required; the derivation rubric is implementation-defined for v0.1 with a recommended baseline; a canonical rubric is deferred.

## See also

- [Asset Reference](Asset%20Reference.md) — the structure this profile governs
- [Entity Reference](Entity%20Reference.md) — the parallel per-actor resolution model for entities
- [Asset Match Inquiry](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md) · [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) — how resolution is validated across actors
- [Relationship to WIPO](../01%20-%20Front%20Matter/Relationship%20to%20WIPO.md) · [Reference Standards](../01%20-%20Front%20Matter/Reference%20Standards.md)

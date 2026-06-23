# Changelog

All notable changes to the IP Operations Protocol are recorded here.
This project aims to follow semantic-ish versioning at the specification level.

## [0.1.0] — 2026-06 (working draft)

First public release of the working draft.

### Specification
- Common Envelope and foundational structures: Asset / Entity / Document references,
  Actor model (Actor Reference, Role Declaration, User Context), Authority model
  (Authority Claim, Data Assertion), Workstream and Milestone, Outcome Details,
  Evidence Collection.
- Profile: Asset Identification and Resolution — canonical `assetUri`, descriptive
  identifier representation on ST.3/ST.16, DOCDB-anchored family model (family membership
  via a shared `docdb-family` identifier; resolvers assert membership, not unverified
  prosecution semantics), lookup-based resolution with required confidence/method (recommended
  baseline rubric; canonical rubric deferred), and no-silent-merge reconciliation.
- 26 messages across bootstrap/discovery, workstream lifecycle, milestone lifecycle,
  deliverable handoff, prepared-action handoff, payments, subscriptions,
  steady-state events, disputes, and a generic record update.
- Worked example: EP post-grant flow walkthrough.

### Decisions
- 28 ratified defaults for v0.1.
- 6 open questions ratified with recommended defaults by the maintainer,
  reopenable when a governance body forms.
- Deferred-to-v1.x scope recorded.

### Publication
- Governance narrative set to independent-maintainer, opening to a consortium as
  adoption grows; "consortium exists" assertions removed from public-facing text.
- Licenses applied: CC-BY-4.0 (spec), Apache-2.0 (schemas).
- Obsidian wikilinks converted to relative Markdown links for rendering.

### Schemas
- JSON Schemas (draft 2020-12) for the envelope, all 12 foundational structures, and all 26
  messages, plus Resolution Provenance and Resolved Asset (the resolver's emission),
  under `schemas/`, packaged as
  `@ipproto/schemas` with version-pinned URN `$id`s.
- Thirteen complete validated examples (messages + resolver structures); a reference validator (ajv); generated
  TypeScript types (`schemas/types/ipproto.d.ts`).

### Pending before tagging a public release
- Insert full canonical license texts (CC-BY-4.0 legal code, Apache-2.0).
- Complete governance-language sweep of remaining in-passing "consortium" mentions
  in message/foundational files.

# Changelog

All notable changes to the IP Operations Protocol are recorded here.
This project aims to follow semantic-ish versioning at the specification level.

## [0.2.0] — 2026-10 (working draft)

A minor version: additions only. Nothing existing is renamed or removed, so a 0.1
receiver keeps working and treats the additions as unknown. Ratified by the maintainer
on 2026-10-01 (Ratified Decisions 29 and 30) and 2026-10-02 (31 to 36). The protocol
now has 39 message types in 12 categories.

### Added
- **Messages (13).** `workRequested` (workstream lifecycle), with `requestMode`,
  `offerReference` and the `preAuthorized` flag of the one-step catalogue order;
  `workInstruction`, `instructionAccepted`, `instructionDeclined` (new category
  *Work Instruction*); `invoiceIssued` (payments), one message for supplier and
  customer invoices; `bidInvitation`, `conflictCheckAttested`, `bidSubmitted`,
  `bidWithdrawn`, `bidDeclined`, `awardProposed`, `awardConfirmed`, `awardDeclined`
  (new category *Procurement*), which give the execution mode `thirdPartyRfp` its mechanics.
- **Foundational structures (2).** Agreed Price, a binding price beside a milestone's
  estimates; Service Level, a clock on one step of the work.
- **Fields, all optional.** `agreedPrice`, `serviceLevels` and `parentMilestoneUri` on
  Milestone, the last with the addressing rule that keeps a delegated milestone's
  messages out of the parent workstream; `instructingCapacity` and `beneficiary` on
  Workstream; `planReference` and `trial` on the `commercialTerms` of Service
  Subscription Started.
- **Vocabulary values.** Actor type `softwareService`; roles `orchestrator`, `bidder`,
  `ultimateBeneficiary`; document types `filingReceipt`, `officialFeeReceipt`, `invoice`;
  fee structure `revenueShare` with `sharePercent`.
- **Namespaces.** `urn:ipproto:lineItem:` (`professionalFee`, `translation`,
  `officialFee`, `handling`, `disbursement`) and `urn:ipproto:serviceLevel:`
  (`acknowledgement`, `delivery`, `bidResponse`, `introduction`).
- **Worked example.** Exclusive Delivery and Open Services Walkthrough: two linked
  workstreams, and a panel procurement from request to award.
- **Decisions.** Ratified Decisions 29 (the 0.2.0 extension), 30 (one-step catalogue
  order) and 31 to 36: `orchestrator` as a role, the open actor type list, one invoice
  message, the core line item vocabulary, missed service levels derived rather than
  announced, and the guiding principle's wording.
- **Schemas.** Schemas for the 13 messages and the 2 structures; 18 further validated
  examples (31 in all).

### Changed
- **Non-Scope, Commercial terms.** Pricing models and contractual terms stay out of
  scope. How a binding price, a bid and an award are exchanged is now in scope.
- **Guiding principle.** "patent-operations data layer" now reads "IP-operations data
  layer", in Non-Scope and in GOVERNANCE.md.
- **Actor type in the schema.** The closed enumeration is opened to namespaced custom
  URNs, as Ratified Decision 3 already stated.
- **Schema identifiers.** Every schema `$id` is re-issued as
  `urn:ipproto:schema:0.2:<name>`, since VERSIONING.md forbids reusing an identifier
  across versions. The `0.1` identifiers keep naming the 0.1.0 set. `protocolVersion`
  in new messages is `0.2`.
- **Generated TypeScript types** regenerated from the 0.2 schemas.

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

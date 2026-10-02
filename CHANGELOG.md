# Changelog

All notable changes to the IP Operations Protocol are recorded here.
This project aims to follow semantic-ish versioning at the specification level.

## [0.3.0] — 2026-10 (working draft)

Follow-up to 0.2.0, agreed by the maintainer on 2026-10-02 (Ratified Decisions 37 to 44).
It makes first filings and drafting jobs requestable, closes three gaps in the 0.2.0
message set and corrects what the repository says about compatibility. The protocol now
has 41 message types in 12 categories.

A minor version under the pre-1.0 rule of VERSIONING.md, and **not purely additive**: two
rules a 0.2 receiver could rely on are relaxed.

### Compatibility
- **A 0.2 message remains valid under 0.3.** The eighteen examples written for 0.2.0 and
  the thirteen written for 0.1.0 validate unchanged against the 0.3 schemas.
- **A 0.2 receiver must be changed if it relies on one of two things.** `assetReferences`
  is no longer always present on Workstream and Work Requested, and `milestoneReference`
  is no longer present on every line of Invoice Issued.
- **Strict validators.** As between 0.1 and 0.2, a receiver keeps working across a minor
  version only if it degrades on unknown message types, fields and values, as
  VERSIONING.md requires. A receiver that validates strictly against the 0.2 schemas
  rejects the two new messages, a request or workstream without assets, an invoice line
  without a milestone and a custom tax treatment.

### Added
- **Messages (2).** `requestDeclined` (workstream lifecycle): the orchestrator declines a
  `workRequested`, with a reason in the `reasonCategory` plus `reasonNarrative` shape.
  `requesterDisclosed` (procurement): the orchestrator discloses a withheld requester to
  one bidder after that bidder's `clear` conflict attestation; never sent after `conflict`.
- **Fields.** `prospectiveRights` on Workstream and Work Requested: the rights the work
  is to create, each with `assetType`, `workingTitle`, optional `intendedJurisdictions`
  and `applicant`, and on a workstream `resultingAssetReferences` once Asset Bootstrap has
  introduced the asset. `subscriptionReference` on the lines of Invoice Issued.
- **Open question.** Open Questions for Consortium, question 7: the tax treatment
  vocabulary of invoices. Open, not ratified.
- **Decisions.** Ratified Decisions 37 to 44.
- **Schemas.** Schemas for the two messages, `prospectiveRight` in the common defs, and
  five further validated examples (36 in all). The type generator,
  `schemas/generate-types.mjs`, with `npm run generate-types`.

### Changed
- **Workstream and Work Requested.** At least one of `assetReferences` and
  `prospectiveRights` is required; in 0.2 `assetReferences` was always required.
  Ratified Decision 16 stands: an asset still enters the protocol only through Asset
  Bootstrap.
- **Invoice Issued, lines.** A line carries exactly one of `milestoneReference` and
  `subscriptionReference`; in 0.2 every line needed a milestone.
- **Invoice Issued, tax.** `taxTreatment` keeps `taxed`, `reverseCharge`, `exempt` and
  `outsideScope` as standard values and now accepts custom values as namespaced URNs. The
  vocabulary is marked provisional: nobody who issues invoices has reviewed it.
- **Non-Scope.** Free-text messaging between parties is stated as outside the protocol
  (decided on 2026-10-01, left out of the 0.2.0 text).
- **Clarifications, no schema change.** A beneficiary that is not a protocol actor is
  identified by the requester in its Entity Reference, and the `ultimateBeneficiary` role
  declaration is optional in that case. The commercial terms that carry `sharePercent`
  are exchanged between the application's provider and the contract holder only.
- **Schema identifiers.** Every schema `$id` is re-issued as
  `urn:ipproto:schema:0.3:<name>`. The `0.2` identifiers keep naming the 0.2.0 set.
  `protocolVersion` in new messages is `0.3`.
- **Generated TypeScript types** regenerated from the 0.3 schemas.

### Fixed
- **Compatibility wording.** The repository said that a 0.1 receiver keeps working under
  0.2. That holds only for a receiver that degrades on unknown values; a strict 0.1
  validator rejects the 0.2 values `softwareService` and `revenueShare`. Corrected in the
  0.2.0 entry below, in Ratified Decision 29, Conventions, Common Envelope, README and the
  walkthrough; VERSIONING.md now states what its compatibility rule promises.
- **Links.** 54 broken relative links in the root `Glossary.md` and
  `Asset-Identification-and-Resolution.md`, and a stray line `EOF` at the end of the EP
  Post-Grant Flow Walkthrough.

### Known limits
- **Document Reference still requires at least one asset reference.** A document of a
  workstream that has no asset yet, such as a draft application, has no valid Document
  Reference until the asset exists.
- **No standard line item type for a subscription fee.** A subscription line of an
  invoice uses a custom namespaced type.

## [0.2.0] — 2026-10 (working draft)

A minor version: additions only. Nothing existing is renamed or removed. A 0.1 receiver
that degrades on unknown message types, fields and values, as VERSIONING.md requires,
keeps working and treats the additions as unknown. A receiver that validates strictly
against the 0.1 schemas does not keep working: it rejects the new message types and the
0.2 values `softwareService` (actor type) and `revenueShare` (fee structure), which the
0.1 schemas hold as closed enumerations. (This paragraph was corrected with 0.3.0; it
used to say without qualification that a 0.1 receiver keeps working.) Ratified by the maintainer
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

# IP Operations Protocol

A standard for **operational data exchange between actors working on patent and other IP assets** — corporate IP departments, service providers, external counsel, and registers.

**Version:** 0.9 (working draft) · **Spec license:** CC-BY-4.0 · **Schema license:** Apache-2.0 · **Status:** open for implementation feedback

---

## What this is

WIPO standards describe *what is in patent records* (ST.96), *how documents are numbered* (ST.13, ST.16), and *what legal-status events mean* (ST.27). They do not describe the **multi-actor operational layer above the asset model** — the messages exchanged when work is actually being done on an asset: bootstrapping it from a register, decomposing a goal into a milestone chain, handing an artifact between a service provider and an applicant, authorizing a payment, running a renewal-monitoring subscription, or resolving a dispute over who has authority to edit a record section.

That operational layer is what current practice handles in inboxes and bilateral contracts, and it is what the first wave of agentic IP procurement and execution will need as structured, machine-readable exchange. **This protocol specifies it.**

Since version 0.2 it also covers how work is requested, instructed and invoiced, and how it is procured through binding bids and an award. Version 0.3 lets a request describe a right that does not exist yet, such as a first filing. Version 0.4 carries that description into the bid invitation, lets an invitation name the requester, and gives subscription invoice lines a billing period. Version 0.5 lets a payor dispute an invoice and a payee cancel one, names an actor that records a message for another, says how records named by URI are resolved, and adds a conformance profile for orchestrators. Version 0.6 lets a provider instructed directly by its client conform: a provider profile, a mandate that covers a whole matter, typed deadlines, a conflict check for instructions as well as invitations, and a confidentiality marking. Version 0.7 adds a litigation module (proceedings and their parties, the role of each patent in a dispute, court documents and when they were served) and mandate pricing (rate tables, budgets, flat fees per period, a statutory fee floor). Version 0.8 completes invoicing for firms: time entries with hours, rates and timekeepers, VAT categories per line in the terms of EN 16931 with a breakdown, court fees passed on at cost, tax identifiers, invoices shared between several payors, and payments that name the invoices they settle. Version 0.9 fixes what a provider-side implementation found: advisory work without an asset, the claim over proceedings, relative patch paths, and dates that validate without format checking. In all: 44 message types in 12 categories.

The protocol is transport-agnostic and does not constrain implementation language or platform.

## Relationship to existing standards

This protocol does **not** replace, extend, or compete with WIPO standards. It consumes data conformant to them, produces events that align with their categorizations, and references them wherever operationally feasible. It is complementary work that closes a gap WIPO has not addressed. See [spec/01 - Front Matter/Relationship to WIPO.md](spec/01%20-%20Front%20Matter/Relationship%20to%20WIPO.md) and [spec/01 - Front Matter/Reference Standards.md](spec/01%20-%20Front%20Matter/Reference%20Standards.md).

## Read the spec

Start here, in order:

1. [Scope](spec/01%20-%20Front%20Matter/Scope.md) and [Non-Scope](spec/01%20-%20Front%20Matter/Non-Scope.md) — what the protocol covers and deliberately does not
2. [Reference Standards](spec/01%20-%20Front%20Matter/Reference%20Standards.md) and [Relationship to WIPO](spec/01%20-%20Front%20Matter/Relationship%20to%20WIPO.md)
3. [Conventions](spec/01%20-%20Front%20Matter/Conventions.md)
4. [Common Envelope](spec/02%20-%20Foundational%20Structures/Common%20Envelope.md), then the foundational structures, then the messages

For an operational walkthrough, read the [EP Post-Grant Flow Walkthrough](spec/04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md), which threads the 0.1 message set in a realistic sequence, and the [Exclusive Delivery and Open Services Walkthrough](spec/04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md) for the request, instruction, invoice and procurement messages added in 0.2 and 0.3.

Full table of contents: [spec/README.md](spec/README.md).

## Repository layout

```
ip-operations-protocol/
├── README.md            ← you are here (public landing)
├── LICENSE              ← CC-BY-4.0 (specification text)
├── NOTICE               ← copyright, which licence covers which part
├── PATENTS.md           ← the maintainer's patent commitment (OWFa 1.0)
├── CITATION.cff         ← how to cite the protocol
├── GOVERNANCE.md        ← how decisions are made and how that opens up over time
├── CONTRIBUTING.md      ← how to contribute (DCO sign-off, contributor commitment)
├── SECURITY.md          ← how to report a security problem privately
├── VERSIONING.md        ← version scheme, compatibility rule, how history is kept
├── AUTHORS.md           ← authorship and provenance
├── CHANGELOG.md         ← version history
├── VERSION
├── spec/                ← the v0.9 specification (this is the normative content)
└── schemas/             ← JSON Schemas + validated example messages (Apache-2.0) — in progress
```

## Status and roadmap

This is **v0.9**, published for implementation feedback. v0.2 extended v0.1 by addition only. v0.3 adds to v0.2 and relaxes three of its rules: a workstream no longer needs an existing asset, a document reference no longer needs one either, and an invoice line no longer needs a milestone. v0.4 extends v0.3 by addition only: three optional fields, no new message type, no changed rule. A 0.3 message is valid under 0.4, and a 0.3 receiver needs no change. v0.5 extends v0.4 by addition only: two message types, one envelope field, one identifier field, one tax treatment value, two identifier schemes, a conformance page, and clarifications; no rule of 0.4 is relaxed. A 0.4 message is valid under 0.5. v0.6 adds a message type, a structure, optional fields and vocabulary values, relaxes three rules (Conflict Check Attested no longer needs a Bid Invitation, may list parties with their roles, and conflict party roles are open to namespaced URNs) and tightens three (`protocolVersion` must match `^\d+\.\d+$`, and affected and constraining deadlines must be Deadline structures); every published example of 0.5 is valid under 0.6. v0.7 adds optional fields and vocabulary values and a litigation module of the provider profile, relaxes two rules (a Work Instruction recorded by its provider needs no service levels or response deadline that were not agreed, and a document's originator may be an Entity Reference) and adds one sender rule (data minimisation for natural persons); every published example of 0.6 is valid under 0.7. v0.8 adds optional invoice and payment fields, vocabulary values and invoicing requirements to both role profiles, relaxes one rule (a disputed invoice line may be named by `lineId` instead of `lineIndex`) and tightens none; every published example of 0.7 is valid under 0.8. v0.9 relaxes three rules (a workstream and a request may name no asset, and date fields no longer depend on `format` to validate) and tightens two without a schema change (`proceedings` and `assetRoles` are recorded under the status claim, and patch paths are relative to `sectionPath`); every published example of 0.8 is valid under 0.9. A receiver built for an earlier version keeps working if it degrades on unknown message types and values; a receiver that validates strictly against the 0.1 or 0.2 schema set rejects some newer messages, one that validates strictly against the 0.3 set accepts 0.4 messages, because unknown fields pass, and one that validates strictly against the 0.4 set rejects the two new 0.5 messages and the tax treatment `notStated` (see [CHANGELOG.md](CHANGELOG.md) and [VERSIONING.md](VERSIONING.md)). The design decisions reserved for a future governance body are recorded in [Open Questions for Consortium](spec/05%20-%20Decisions/Open%20Questions%20for%20Consortium.md); each of the six v0.1 questions has been ratified with a recommended default and is reopenable when a consortium forms; a seventh, on the tax vocabulary of invoices, was added in 0.3 and ratified in 0.8. No question is open. Features deliberately scoped out of v0.1 are listed in [Deferred to v1.x](spec/05%20-%20Decisions/Deferred%20to%20v1-x.md). v1.0 will lock the open decisions.

## License

The **specification text** (everything under `spec/` and this README) is licensed under [Creative Commons Attribution 4.0 International (CC-BY-4.0)](LICENSE) — you may share and adapt it, including commercially, with attribution.

The **JSON Schemas and reference implementation** (everything under `schemas/`) are licensed under the [Apache License 2.0](schemas/LICENSE), whose explicit patent grant is deliberate for a standard in the patent domain.

The specification is **royalty free to implement**: the maintainer makes the Open Web Foundation Agreement 1.0 (OWFa 1.0) for the versions listed in [PATENTS.md](PATENTS.md). [NOTICE](NOTICE) says which licence covers which part of the repository.

## Citation

> IP Operations Protocol, v0.9. Dr. Jonas Block, 2026. Licensed CC-BY-4.0. https://github.com/GregXIV/ip-operations-protocol

[CITATION.cff](CITATION.cff) holds the same in machine-readable form; GitHub offers it under *Cite this repository*.

## Governance

Maintained by an independent maintainer, published openly so adoption can grow. Governance is intended to open to a consortium as the protocol is adopted; see [GOVERNANCE.md](GOVERNANCE.md).

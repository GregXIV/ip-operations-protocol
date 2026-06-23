# IP Operations Protocol

A standard for **operational data exchange between actors working on patent and other IP assets** — corporate IP departments, service providers, external counsel, and registers.

**Version:** 0.1 (working draft) · **Spec license:** CC-BY-4.0 · **Schema license:** Apache-2.0 · **Status:** open for implementation feedback

---

## What this is

WIPO standards describe *what is in patent records* (ST.96), *how documents are numbered* (ST.13, ST.16), and *what legal-status events mean* (ST.27). They do not describe the **multi-actor operational layer above the asset model** — the messages exchanged when work is actually being done on an asset: bootstrapping it from a register, decomposing a goal into a milestone chain, handing an artifact between a service provider and an applicant, authorizing a payment, running a renewal-monitoring subscription, or resolving a dispute over who has authority to edit a record section.

That operational layer is what current practice handles in inboxes and bilateral contracts, and it is what the first wave of agentic IP procurement and execution will need as structured, machine-readable exchange. **This protocol specifies it.**

The protocol is transport-agnostic and does not constrain implementation language or platform.

## Relationship to existing standards

This protocol does **not** replace, extend, or compete with WIPO standards. It consumes data conformant to them, produces events that align with their categorizations, and references them wherever operationally feasible. It is complementary work that closes a gap WIPO has not addressed. See [spec/01 - Front Matter/Relationship to WIPO.md](spec/01%20-%20Front%20Matter/Relationship%20to%20WIPO.md) and [spec/01 - Front Matter/Reference Standards.md](spec/01%20-%20Front%20Matter/Reference%20Standards.md).

## Read the spec

Start here, in order:

1. [Scope](spec/01%20-%20Front%20Matter/Scope.md) and [Non-Scope](spec/01%20-%20Front%20Matter/Non-Scope.md) — what the protocol covers and deliberately does not
2. [Reference Standards](spec/01%20-%20Front%20Matter/Reference%20Standards.md) and [Relationship to WIPO](spec/01%20-%20Front%20Matter/Relationship%20to%20WIPO.md)
3. [Conventions](spec/01%20-%20Front%20Matter/Conventions.md)
4. [Common Envelope](spec/02%20-%20Foundational%20Structures/Common%20Envelope.md), then the foundational structures, then the messages

For an operational walkthrough, read the [EP Post-Grant Flow Walkthrough](spec/04%20-%20Worked%20Examples/EP%20Post-Grant%20Flow%20Walkthrough.md), which threads the full message set in a realistic sequence.

Full table of contents: [spec/README.md](spec/README.md).

## Repository layout

```
ip-operations-protocol/
├── README.md            ← you are here (public landing)
├── LICENSE              ← CC-BY-4.0 (specification text)
├── GOVERNANCE.md        ← how decisions are made and how that opens up over time
├── VERSIONING.md        ← version scheme, compatibility rule, how history is kept
├── AUTHORS.md           ← authorship and provenance
├── CHANGELOG.md         ← version history
├── VERSION
├── spec/                ← the v0.1 specification (this is the normative content)
└── schemas/             ← JSON Schemas + validated example messages (Apache-2.0) — in progress
```

## Status and roadmap

This is **v0.1**, published for implementation feedback. The design decisions reserved for a future governance body are recorded in [Open Questions for Consortium](spec/05%20-%20Decisions/Open%20Questions%20for%20Consortium.md); each has been ratified with a recommended default for v0.1 and is reopenable when a consortium forms. Features deliberately scoped out of v0.1 are listed in [Deferred to v1.x](spec/05%20-%20Decisions/Deferred%20to%20v1-x.md). v1.0 will lock the open decisions.

## License

The **specification text** (everything under `spec/` and this README) is licensed under [Creative Commons Attribution 4.0 International (CC-BY-4.0)](LICENSE) — you may share and adapt it, including commercially, with attribution.

The **JSON Schemas and reference implementation** (everything under `schemas/`) are licensed under the [Apache License 2.0](schemas/LICENSE), whose explicit patent grant is deliberate for a standard in the patent domain.

## Citation

> IP Operations Protocol, v0.1. Dr. Jonas Block, 2026. Licensed CC-BY-4.0. https://github.com/GregXIV/ip-operations-protocol

## Governance

Maintained by an independent maintainer, published openly so adoption can grow. Governance is intended to open to a consortium as the protocol is adopted; see [GOVERNANCE.md](GOVERNANCE.md).

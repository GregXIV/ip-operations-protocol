# Governance

## Current model

The IP Operations Protocol is maintained by **a single independent maintainer**. It is published under open licenses (CC-BY-4.0 for the specification, Apache-2.0 for schemas and reference implementation) so that adoption can grow without gatekeeping.

This is a deliberate posture, not a placeholder. An independent, openly licensed specification with clear authorship and a dated publication record is neutral prior art: it closes an operational gap, references existing standards with respect, and does not advance any single vendor's schema. That is the posture that earns cooperative engagement from standards bodies.

## How decisions are made today

For v0.1, the maintainer is the ratifier. Decisions fall into three records under [`spec/05 - Decisions/`](spec/05%20-%20Decisions/):

- **Ratified Decisions** — settled defaults for v0.1.
- **Open Questions for Consortium** — decisions that materially benefit from multi-stakeholder input. For v0.1 these have been ratified with recommended defaults and are explicitly **reopenable** when a governance body forms.
- **Deferred to v1.x** — features deliberately out of v0.1 scope.

## How this opens up

As implementers adopt the protocol, governance is intended to broaden into a **consortium** of founding members — preferably anchored by corporate IP stakeholders rather than service providers, for credibility and neutrality. When that body forms:

- The Open Questions are reopened for consortium ratification ahead of v1.0.
- A designated WIPO liaison role (initially held by the maintainer) is intended to rotate to a corporate member, time-bounded with rotation provisions.
- A lightweight, opt-in registry for custom namespaced extensions may be convened.

Nothing in this document asserts that a consortium currently exists. It describes the intended path.

## Contributing

Implementation feedback, issues, and proposals are welcome via the repository. Substantive protocol changes are evaluated against the single scoping principle in [Non-Scope](spec/01%20-%20Front%20Matter/Non-Scope.md): *the protocol standardizes the patent-operations data layer and nothing else.*

## WIPO coordination

The maintainer intends to coordinate with WIPO working groups where alignment opportunities arise, particularly around ST.27 evolution and any future WIPO work on the operational layer. See [Relationship to WIPO](spec/01%20-%20Front%20Matter/Relationship%20to%20WIPO.md).

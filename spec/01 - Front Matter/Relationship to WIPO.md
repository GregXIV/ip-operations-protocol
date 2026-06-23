---
type: front-matter
status: v0.1
---

# Relationship to WIPO

This protocol does not replace, extend, or compete with existing WIPO standards.

## What WIPO standards cover

WIPO standards describe IP data, documents, and office-to-applicant filing:

- **ST.3** — country and office codes (administrative)
- **ST.6, ST.13, ST.16** — patent document and application numbering
- **ST.27** — legal status events
- **ST.37** — authority files describing each office's data
- **ST.96** — XML representation of IP information for inter-office and office-to-applicant exchange
- **ePCT** — electronic procedural exchange under the Patent Cooperation Treaty

These standards address **what is in patent records**, **how documents are structured**, and **how offices communicate with applicants**.

## What this protocol covers

The **multi-actor operational layer above the asset model** — messages exchanged between corporate IP departments, service providers, external counsel, and registers about *work being done* on assets.

This layer is not addressed by current WIPO standards.

## How they fit together

The protocol consumes data conformant to WIPO standards, produces events that align with WIPO event categorizations, and references WIPO-governed structures wherever doing so is operationally feasible.

| Layer | Standard |
|---|---|
| Document content | WIPO ST.96, office-specific schemas |
| Bibliographic data | WIPO ST.96 (aligned), this protocol's [Asset Reference](../02%20-%20Foundational%20Structures/Asset%20Reference.md) |
| Legal status events | WIPO ST.27 (aligned), this protocol's [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) |
| Operational messages between actors | This protocol — **the gap WIPO does not address** |

The protocol's contribution is the bottom row.

## Coordination with WIPO

The maintainer of this protocol intends to coordinate with WIPO working groups where alignment opportunities arise, and to convene a governance body (consortium) as adoption grows. Sustained coordination requires a designated WIPO liaison — initially the maintainer — whose role includes attending the relevant working group sessions and communicating decisions; the role is intended to rotate to a corporate member once a consortium forms.

Practical reasons this matters:

1. **ST.27 evolution** — as ST.27 evolves, this protocol's [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) alignment must evolve with it. Active liaison is the only way to keep alignment from drifting.
2. **Future ST.x for operational layer** — if WIPO eventually addresses the operational layer this protocol covers, alignment with the consortium's prior work is the cooperative outcome. Active liaison is what makes that happen rather than fragmentation.
3. **Authority files (ST.37)** — actors may publish authority files describing their data shapes. Coordination with ST.37 keeps this clean rather than fragmented.

## Why this framing matters

WIPO working groups will read the framing in this document as cooperative; if the protocol instead positioned itself ambiguously, those same groups would read it as encroachment, and the path to eventual WIPO endorsement would close.

The posture is "complementary work that closes a gap WIPO has not addressed, with explicit coordination and respect for prior art." That is the posture that gets endorsed; vendor-driven schemas competing with established standards do not.

## See also

- [Reference Standards](Reference%20Standards.md) for the technical referencing modes
- [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md) for the WIPO liaison role decision

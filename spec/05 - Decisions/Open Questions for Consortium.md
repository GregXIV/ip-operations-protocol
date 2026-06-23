---
type: decisions
status: v0.1
---

# Open Questions for Consortium

> Decisions reserved for a future governance body (consortium).
>
> **v0.1 status:** all six questions below have been ratified by the maintainer with their recommended defaults, and are reopenable when a consortium forms. The original framing is preserved as the record for that future discussion.

These are questions where consortium-member input materially affects how the protocol should be specified, and where unilateral disposition would be inappropriate. Each has a recommended default but is positioned for consortium discussion before v1.0 ratification.

## 1. UserContext requirement for high-authority messages

**Default:** [User Context](../02%20-%20Foundational%20Structures/User%20Context.md) is optional everywhere with strong recommendation for high-authority messages (commitments, payments, dispute decisions).

**The question:** Should UserContext be MUST rather than SHOULD for some message types?

**Why this is for the consortium:** Compliance posture varies across corporate IP departments. Some require auditable user context for every authorization; others run pure-system integration without user context. Making this MUST in the protocol forces a posture; making it SHOULD lets each consortium member calibrate.

**Recommendation:** Each consortium member designates which message types they require UserContext on, communicated bilaterally. Protocol stays SHOULD.

## 2. Cross-actor identity references

**Default:** [Entity Reference](../02%20-%20Foundational%20Structures/Entity%20Reference.md) supports `crossActorReferences` field, marked as out-of-protocol-validation. Bilateral arrangements may use it; the protocol does not validate or enforce.

**The question:** Should crossActorReferences be in v0.1 at all?

**Why this is for the consortium:** Cross-actor identity exchange touches corporate procurement, security, and data-handling policies. Some organizations cannot share their internal identifier graphs across counterparties; for them, the field's mere presence creates compliance friction. Other organizations explicitly want it for operational efficiency.

**Recommendation:** Keep the field in v0.1 with explicit "out-of-protocol-validation" marking and a note that bilateral arrangements govern its use. Re-evaluate at v1.0 based on consortium experience.

## 3. WIPO liaison role designation

**Default:** Consortium commits to WIPO liaison; specific role and member designation deferred to consortium kickoff.

**The question:** Who at the consortium represents to WIPO working groups?

**Why this is for the consortium:** WIPO engagement requires sustained attention from someone with technical authority to commit the consortium and time to attend working group sessions. The right person is probably from a founding-member organization with existing WIPO standing rather than a service provider.

**Recommendation:** Assign at consortium kickoff. Make the role time-bounded with rotation provisions. Prefer a corporate member over a service provider for credibility.

## 4. Custom milestone category governance

**Default:** Custom milestone categories permitted through namespaced URNs.

**The question:** Should the consortium maintain a public registry of custom category extensions?

**Why this is for the consortium:** A registry helps interoperability — knowing what custom categories other actors use prevents reinvention and surfaces convergence opportunities. But registry maintenance is consortium operational overhead.

**Recommendation:** Lightweight registry maintained by the consortium; opt-in publication; not enforced.

## 5. Dispute escalation paths beyond peer resolution

**Default:** [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md) is the closing message; if disputes remain unresolved, parties escalate outside the protocol.

**The question:** Should the protocol define an arbitration or third-party-resolver mechanism?

**Why this is for the consortium:** The protocol's authority model is explicit-claim, not third-party-arbitrated. Adding arbitration would significantly extend scope. But for some consortium members, having a defined escalation may be a compliance requirement.

**Recommendation:** Out of scope for v0.1. Consortium members handle escalation through underlying contracts. Re-evaluate for v1.0 based on dispute frequency and consortium experience.

## 6. Subscription cadence definition for hybrid subscriptions

**Default:** [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) supports `eventDriven`, `periodic`, `hybrid` cadences. Hybrid is loosely structured.

**The question:** Should the consortium standardize hybrid cadence configurations for common subscription types (renewal monitoring, opposition watch)?

**Why this is for the consortium:** Standard cadence configurations would help clients compare offerings across service providers. But cadence is also a competitive differentiator; standardizing constrains.

**Recommendation:** Defer to v1.x. Consortium can publish recommended cadence patterns as non-normative guidance.

## See also

- [Ratified Decisions](Ratified%20Decisions.md) — decisions positioned as defaults
- [Deferred to v1-x](Deferred%20to%20v1-x.md) — features deliberately scoped out

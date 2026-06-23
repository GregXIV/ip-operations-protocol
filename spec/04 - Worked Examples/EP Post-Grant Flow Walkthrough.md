---
type: worked-example
status: v0.1
---

# EP Post-Grant Flow Walkthrough

> Threads through the protocol's full set of messages in a realistic operational sequence.

This walkthrough shows the protocol in motion, taking a single asset (a fictional Northwind Industries EP application reaching grant) through the full post-grant lifecycle from register detection through long-running monitoring.

The walkthrough is not the *only* sequence the protocol supports — many other operational scenarios use different message subsets. But this is the most operationally common sequence in patent operations and exercises most of the protocol's surface.

## Scenario setup

**Asset:** EP application 21712345.6, owned by Northwind Industries SE, prosecuted by Meridian IP Group & Co. S.à r.l. as service provider. Filing date 2021-04-15.

**Trigger:** EPO publishes Rule 71(3) intention to grant on 2026-04-28 with response deadline 2026-08-28. Druckexemplar (proposed text) attached.

**Actors:**
- Northwind Industries SE — corporate IP department, owner
- Meridian IP Group & Co. S.à r.l. — service provider, contractually engaged for prosecution and post-grant
- Meridian IP Group & Associates — Meridian IP Group's legal arm, eventually performs opposition watch under operational delegation
- EPO — register source of truth
- the firm's commercial bank — Meridian IP Group's banking provider for office fee execution

**Goal:** Validate the EP grant in DE, FR, GB; pay the grant fee; enroll renewal monitoring; enroll opposition watch.

## Phase 0 — Register detection and bootstrap

Meridian IP Group's register adapter polls the EPO register and detects the Rule 71(3) communication.

**[Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md)** is published by Meridian IP Group's adapter under `registerObserverDelegated` authority, claiming `intentionToGrant` (ST.27 code A06) for the asset. The envelope carries a [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md) over `/legalStatus/events` adding the new event. Recipients are addressed by subscription invitation rather than specific actor URIs.

**[Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md)** is published immediately — first appearance of the asset in the protocol. The asset is created with all known identifiers (EP application number, EPO publication number) and initial assertions populating `/legalStatus/events`, `/identifiers`, `/assignees`. The envelope carries authority claims: the EPO's `sourceOfTruth` claim over `/legalStatus`, asserted by Meridian IP Group under delegated authority.

**Subscription invitations** in the bootstrap message route to the resolved assignee — Northwind Industries SE — and to Meridian IP Group itself (as the actor recognized as service provider for Northwind Industries EP assets).

Northwind Industries's IPMS adapter receives both messages, creates a local replica of the asset, and recognizes the resolved assignee literal `"Northwind Industries SE"` against its corporate entity graph.

## Phase 0a — Asset matching

Meridian IP Group's orchestrator follows the bootstrap with an **[Asset Match Inquiry](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md)** to Northwind Industries, asking for `recognitionAndAuthorization` over the asset. The inquiry carries Meridian IP Group's `assertedResolution` of the assignee (resolved to `urn:meridian-ip-group:entity:northwind-industries-se`) for Northwind Industries to confirm against its own resolution.

Northwind Industries's adapter, with human review by IP counsel K. Müller, produces **[Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md)** with `confirmedWithEnrichment`. The response:
- Confirms the asset
- Enriches the asset with `/internalReferences` (matter reference `Northwind Industries-2021-0473-EP`, responsible person, authorized budget)
- Asserts Northwind Industries's `internalDeclaration` claim over `/internalReferences`
- Asserts Northwind Industries's `contractualService` claim authorizing Meridian IP Group over `/serviceEngagements`

The asset is now valid in the protocol with multi-actor authority.

## Phase 1 — Goal decomposition

Meridian IP Group's orchestrator produces **[Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md)** proposing a six-milestone workstream:

1. **Validation analysis** — Meridian IP Group (`primary`), Northwind Industries (`accountableTo`, `payor`)
2. **Document preparation** — Meridian IP Group
3. **Client filing at EPO terminal** — Northwind Industries (`clientExecutor`), Meridian IP Group (`accountableTo`)
4. **Grant fee payment** — Meridian IP Group (`paymentAgent`), Northwind Industries (`payor`)
5. **Renewal monitoring enrollment** — Meridian IP Group (`subscriptionProvider`), Northwind Industries (`subscriber`)
6. **Opposition watch enrollment** — Meridian IP Group & Associates (`subscriptionOperator`) under Meridian IP Group's contract

Each milestone carries its own actor assignments, execution mode, estimates, and dependencies. The proposal includes three delivery route simulations (Fast Track / Balanced / Cost Optimized).

## Phase 2 — Orchestration committed

K. Müller at Northwind Industries reviews the proposal and produces **[Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md)** with `committedWithRouteSelection`, choosing the Balanced route. The user context is captured for compliance audit.

The workstream transitions from `proposed` to `committed`. Milestones with no dependencies (validation analysis, m1) move to `ready`.

## Phase 3 — Validation analysis (m1)

Meridian IP Group's senior validation analyst begins work, producing **[Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md)**.

After 4 days of analysis, the analyst finalizes the validation analysis. Meridian IP Group produces:
- **[Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md)** carrying the validation analysis report (PDF) plus structured content (recommended jurisdictions, costs, rationale). The deliverable carries assertions populating asset sections substantiated by the analysis.
- **[Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md)** with `completionType: definitiveCompletion`

K. Müller reviews and produces **[Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md)** with `simpleAcknowledgment`, releasing m2 (document preparation) to begin.

## Phase 4 — Document preparation and client filing

Meridian IP Group prepares EPO terminal filings for DE, FR, GB. **[Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md)** for m2 fires with `completionType: awaitingExternalAction` because the next step is Northwind Industries's external EPO terminal action.

**[Artifact Ready](../03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md)** is produced, addressed to Northwind Industries as `clientExecutor`. The message carries:
- The three prepared documents
- Action instructions for the EPO terminal
- The action deadline (2026-08-28)
- Expected confirmation: a [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md) from Northwind Industries
- Expected register confirmation: a [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) of category `postGrantFilingReceived` within 1-14 days

K. Müller at Northwind Industries logs into MyEPO, performs the three filings, captures EPO confirmation numbers and signed receipts, and produces **[Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)** with `successfullyPerformed`. Evidence is the confirmation numbers plus the signed receipts.

The orchestrator marks m3 as `inProgress` (optimistic) and starts a 14-day divergence-detection window for the expected register event.

## Phase 5 — Register confirmation

Two days later, Meridian IP Group's register adapter detects the EPO publication of `postGrantFilingReceived` for all three jurisdictions. **[Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md)** is published.

The orchestrator matches the register event against the expected confirmation. m3 transitions to `completed`. m4 (grant fee payment) becomes `ready`.

## Phase 6 — Grant fee payment

K. Müller produces **[Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md)** authorizing Meridian IP Group's payment agent role to pay the EP grant fee (€1,080) within the response deadline. The authorization carries cost-center allocation, PO reference, and matter reference for Northwind Industries's finance reconciliation.

Meridian IP Group's treasury operations user executes the payment through the firm's commercial bank and produces **[Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md)** with `successfullyExecuted`. Evidence is the banking transaction reference plus the EPO fee receipt.

The orchestrator holds m4 in `inProgress` until the corresponding `grantFeeReceived` register event arrives.

Five days later, **[Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md)** of category `grantFeeReceived` arrives. m4 transitions to `completed`.

## Phase 7 — Subscription enrollment

m5 (renewal monitoring) becomes `ready`. Meridian IP Group produces **[Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md)** for renewal monitoring on the now-derived national assets (DE, FR, GB validations, which become first-class assets in their own right via assignments in [Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md)).

The renewal monitoring subscription:
- Hybrid cadence: monthly periodic + event-driven (deadline-approaching warnings)
- Flat periodic fee structure
- Severity-based delivery (critical findings immediate, informational monthly aggregated)

m5 transitions to `completed`.

m6 (opposition watch) becomes `ready`. Here the delegation pattern: Meridian IP Group holds the contract; Meridian IP Group & Associates operates. **[Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md)** is produced with separate `subscriptionContractHolder` (Meridian IP Group) and `subscriptionOperator` (D&A) entries. The operator's [Actor Role Declaration](../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) carries the delegation chain.

m6 transitions to `completed`.

## Phase 8 — Workstream closes

All milestones in terminal status. The orchestrator produces **[Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md)** with `fullSuccess`:
- Total actual cost €5,340 (vs. €5,460 estimated)
- Output artifacts: validation analysis, EPO forms, fee receipt, validation confirmations
- Subscriptions created: renewal monitoring, opposition watch (these persist beyond workstream)
- Derived assets: DE validation, FR validation, GB validation (these become first-class assets)

## Steady state — subscriptions producing findings

The protocol now enters steady state. The two subscriptions produce findings indefinitely.

Example **[Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md)** events generated over time:
- 90 days before first DE renewal due date: `renewalDeadlineApproaching` finding from renewal monitoring (warning severity)
- Opposition window closes 9 months after grant publication: `oppositionWindowClosed` finding from opposition watch (informational)
- Monthly aggregated reports for non-critical findings

If an opposition is ever filed, an **[Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md)** of category `oppositionFiled` (critical severity) bypasses aggregation, surfaces immediately to Northwind Industries, and recommends initiating an opposition response workstream.

## Optional disputes

The walkthrough above is the happy path. The protocol's dispute machinery handles divergence:

- **If Northwind Industries doesn't recognize the asset** → [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) with `denied`, possibly [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) if conflict
- **If two service providers claim engagement** → [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md) surfaces, Northwind Industries resolves through [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md)
- **If the post-grant filing register event doesn't arrive within 14 days** → [Action Confirmation Dispute](../03%20-%20Messages/Disputes/Action%20Confirmation%20Dispute.md) fires, Meridian IP Group's case team investigates
- **If Northwind Industries and Meridian IP Group resolve "Northwind Industries SE" to different entities for routing** → [Identity Resolution Dispute](../03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md) surfaces, often left informational unless it materially affects routing

## What this walkthrough demonstrates

The protocol covers the full operational lifecycle from register detection through long-running monitoring. Every handoff between actors is structured. Every authority claim is explicit. Every action that depends on external system confirmation has a divergence-detection mechanism. Every dispute has a defined surfacing and resolution path.

In current practice, much of this operational sequence is handled through email, phone calls, ad-hoc spreadsheets, and individual contractual judgment. The protocol turns it into queryable, auditable structure.

## See also

- [Phase-by-Phase Reference](Phase-by-Phase%20Reference.md) — quick reference index of which messages fire in which phase
- The individual message specs — each linked above
EOF
---
type: worked-example
status: v0.1
---

# Phase-by-Phase Reference

> Quick reference index of which messages fire in which phase of the [EP Post-Grant Flow Walkthrough](EP%20Post-Grant%20Flow%20Walkthrough.md).

## Phase 0 — Register detection and bootstrap

| Producer | Message |
|---|---|
| Meridian IP Group (register adapter) | [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) (intentionToGrant) |
| Meridian IP Group (register adapter) | [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md) |

Asset is created. Subscription invitations route to Northwind Industries.

## Phase 0a — Asset matching

| Producer | Message |
|---|---|
| Meridian IP Group (orchestrator) | [Asset Match Inquiry](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md) |
| Northwind Industries (IPMS adapter, with K. Müller) | [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md) (confirmedWithEnrichment) |

Asset is multi-party recognized; corporate enrichment captured.

## Phase 1 — Goal decomposition

| Producer | Message |
|---|---|
| Meridian IP Group (orchestrator) | [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) |

Six-milestone workstream proposed.

## Phase 2 — Orchestration committed

| Producer | Message |
|---|---|
| Northwind Industries (K. Müller) | [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md) (committedWithRouteSelection) |

Workstream becomes `committed`. Validation analysis (m1) becomes `ready`.

## Phase 3 — Validation analysis (m1)

| Producer | Message |
|---|---|
| Meridian IP Group (Validation Analyst) | [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md) |
| Meridian IP Group | [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md) |
| Meridian IP Group | [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) (definitiveCompletion, m1) |
| Northwind Industries (K. Müller) | [Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md) (simpleAcknowledgment) |

m1 closes. m2 becomes `ready`.

## Phase 4 — Document preparation and client filing

| Producer | Message |
|---|---|
| Meridian IP Group | [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md) (m2) |
| Meridian IP Group | [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) (awaitingExternalAction, m2) |
| Meridian IP Group | [Artifact Ready](../03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md) |
| Northwind Industries (K. Müller) | [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md) (successfullyPerformed) |

m2 closes; m3 (client filing) is now `inProgress` optimistically.

## Phase 5 — Register confirmation

| Producer | Message |
|---|---|
| Meridian IP Group (register adapter) | [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) (postGrantFilingReceived) |

m3 transitions to `completed`. m4 becomes `ready`.

## Phase 6 — Grant fee payment

| Producer | Message |
|---|---|
| Northwind Industries (K. Müller) | [Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md) |
| Meridian IP Group (Treasury Operations) | [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md) (successfullyExecuted) |
| Meridian IP Group (register adapter) | [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md) (grantFeeReceived) |

m4 transitions to `completed`. m5 becomes `ready`.

## Phase 7 — Subscription enrollment

| Producer | Message |
|---|---|
| Meridian IP Group | [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) (renewal monitoring) |
| Meridian IP Group | [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) (opposition watch, with D&A delegation) |

m5 and m6 close.

## Phase 8 — Workstream closes

| Producer | Message |
|---|---|
| Meridian IP Group (orchestrator) | [Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md) (fullSuccess) |

Workstream closes. Subscriptions persist. Derived national assets persist.

## Steady state — subscriptions producing findings

Indefinite. Examples:

| Producer | Message | Trigger |
|---|---|---|
| Meridian IP Group | [Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md) (renewalDeadlineApproaching) | 90 days before renewal due |
| D&A (operator) | [Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md) (oppositionWindowClosed) | 9 months post-grant |
| D&A (operator) | [Service Finding](../03%20-%20Messages/Steady-State%20Events/Service%20Finding.md) (oppositionFiled) | If opposition is ever filed |

## Total message count for the happy-path scenario

19 messages exchanged in Phases 0-8 (excluding subsequent steady-state findings).

## See also

- [EP Post-Grant Flow Walkthrough](EP%20Post-Grant%20Flow%20Walkthrough.md) — full narrative

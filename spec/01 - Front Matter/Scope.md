---
type: front-matter
status: v0.1
---

# Scope

This protocol standardizes the data exchange between actors performing operational work on patent and other intellectual property assets.

## What the protocol covers

The protocol's scope is the **operational layer** — the messages flowing between corporate IP departments, service providers, external counsel, and registers when work is being done on assets that exist in the world.

Specifically:

- **Asset bootstrapping** from registers and from corporate IP management systems — see [Asset Bootstrap](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md), [Asset Match Inquiry](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Inquiry.md), [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md)
- **Decomposition of operational goals into milestone chains** — see [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md), [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md)
- **Authorization and execution of milestones** across multiple actors — see [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md), [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md), [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md), [Milestone Abandoned](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Abandoned.md)
- **Handoffs between actors and external systems** — see [Artifact Ready](../03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md), [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)
- **Long-running service subscriptions** for renewal monitoring, opposition watch, portfolio monitoring — see [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md), [Service Subscription Terminated](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Terminated.md)
- **Payment authorization and execution** for office fees, professional fees, third-party counsel — see [Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md), [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md)
- **Register events** carrying legal status changes — see [Register Event](../03%20-%20Messages/Steady-State%20Events/Register%20Event.md)
- **Authority assertions** over sections of asset records — see [Authority Claim](../02%20-%20Foundational%20Structures/Authority%20Claim.md), [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md)
- **Dispute mechanics** for conflicts that cannot be auto-resolved — see [Asset Authority Dispute](../03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md), [Action Confirmation Dispute](../03%20-%20Messages/Disputes/Action%20Confirmation%20Dispute.md), [Identity Resolution Dispute](../03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md), [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md)

The protocol is **transport-agnostic** and does not constrain implementation language or platform.

## What this is for

The protocol formalizes patterns that current practice handles either ad hoc or not at all. Three operational realities motivate this:

1. **Multi-actor handoffs are not standardized today.** Service providers prepare artifacts, applicants execute external actions, registers confirm — and the chain of accountability lives in inboxes, not in structured data.
2. **Authority over sections of asset records is unclear when multiple actors edit them.** Who owns what section of the record, what claims override what, how conflicts surface — these are usually governed by individual contracts and ad-hoc judgment.
3. **AI-agent-readable patent operations require structured exchange.** The first wave of agentic procurement and execution will need protocol-level interoperability that current standards do not provide.

## Adjacent topics — see [Non-Scope](Non-Scope.md)

This protocol does **not** cover identity governance, authentication, transport protocols, document content standards, or commercial terms. Those are handled elsewhere or are explicitly out of scope. See [Non-Scope](Non-Scope.md) for the full list.

## Reference standards — see [Reference Standards](Reference%20Standards.md)

The protocol incorporates, aligns with, or scopes around several existing standards. WIPO ST.3, ST.13, ST.16, ST.27, ST.96, ST.37, plus ISO 8601 and ISO 4217. See [Reference Standards](Reference%20Standards.md) for which mode applies to each.

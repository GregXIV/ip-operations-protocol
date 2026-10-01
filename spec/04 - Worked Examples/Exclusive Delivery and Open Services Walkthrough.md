---
type: worked-example
status: v0.2
---

# Exclusive Delivery and Open Services Walkthrough

> Threads the messages added in 0.2 through two sequences: an order that an orchestrator delivers through an agent the customer never sees, and a piece of work a customer awards to a supplier of its own choice.

The [EP Post-Grant Flow Walkthrough](EP%20Post-Grant%20Flow%20Walkthrough.md) starts from a register event and one service provider that does the work itself. This walkthrough starts from the customer's request and shows the two ways the work can be sourced:

- **Exclusive delivery.** The orchestrator is the customer's only counterparty. It sells at a catalogue price and passes the work on to agents in a second workstream.
- **Open services.** The customer invites suppliers to bid, and the supplier that wins becomes the customer's counterparty.

Both use the 0.1 lifecycle messages unchanged. What 0.2 adds is the request in front of them, the instruction and the invoice beside them, and the procurement family between request and work.

## Part 1 — Exclusive delivery: two linked workstreams

### Scenario setup

**Asset:** European patent EP 3 987 654, granted to Northwind Industries SE.

**Goal:** Validate the patent in Spain and Italy.

**Actors:**
- Contoso Legal LLP — a law firm and the customer. It orders for its client and is `workRequester`, `decisionAuthority` and `payor`
- Northwind Industries SE — the client the work is for: the `ultimateBeneficiary`. It takes no part in the exchange
- Meridian IP Group & Co. S.à r.l. — the `orchestrator`. Sells the validation at a catalogue price and is the customer's only counterparty
- Fabrikam Patentes S.L. — Meridian IP Group's agent in Spain, `workProvider` in the second workstream

A second agent covers Italy in the same way and is not shown.

**Two workstreams:**

| | Workstream A | Workstream B |
|---|---|---|
| Shared by | Contoso Legal and Meridian IP Group | Meridian IP Group and Fabrikam Patentes |
| Meridian IP Group is | `orchestrator`, `primary` actor of each milestone | `workRequester`, `payor` |
| Milestones | `a1-es-validation`, `a2-it-validation` | `b1-es-validation-agent` |
| Link | — | `b1` carries `parentMilestoneUri` = `a1` |
| Price | Catalogue price, per country | Agent's price |

No message of workstream B is addressed to Contoso Legal, so the customer never sees the agent. No message of workstream A is addressed to Fabrikam Patentes, so the agent never sees the catalogue price.

### Phase 1 — The customer orders

Contoso Legal sends **[Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md)** to Meridian IP Group, addressed to its `orchestrator` role:

- `requestMode: catalogueOrder`, with `offerReference` naming the catalogue price for EP validation
- `requestedWork`: an office filing in ES and one in IT
- `instructingCapacity: onBehalf`, with Northwind Industries SE as `beneficiary`
- `preAuthorized: true`

### Phase 2 — The plan comes back committed

Meridian IP Group's orchestrator produces **[Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md)** for workstream A, correlated to the request. One milestone per country, Meridian IP Group as `primary` actor of each, and a binding price each:

```json
{
  "milestoneUri": "urn:ipproto:milestone:a1-es-validation",
  "milestoneTitle": "EP validation in Spain",
  "actorAssignments": [
    {"actorUri": "urn:ipproto:actor:meridian-ip-group", "roleDeclarationUri": "...", "assignmentType": "primary"},
    {"actorUri": "urn:ipproto:actor:contoso-legal", "roleDeclarationUri": "...", "assignmentType": "accountableTo"},
    {"actorUri": "urn:ipproto:actor:contoso-legal", "roleDeclarationUri": "...", "assignmentType": "payor"}
  ],
  "executionMode": "serviceProviderManaged",
  "serviceProviderActorUri": "urn:ipproto:actor:meridian-ip-group",
  "milestoneStatus": "committed",
  "agreedPrice": {
    "amount": 2140.00,
    "currency": "EUR",
    "priceBasis": "fixed",
    "officialFeesIncluded": true,
    "agreementReference": "meridian-catalogue-2026#ep-validation"
  },
  "serviceLevels": [
    {"serviceLevelKind": "urn:ipproto:serviceLevel:delivery", "dueAt": "2026-11-10T17:00:00Z"}
  ]
}
```

The workstream carries `instructingCapacity: onBehalf` and the beneficiary from the request.

Because the order was pre-authorized and both prices match the offer, the **one-step rule** applies: the workstream and its milestones are issued `committed`, and Contoso Legal sends no [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md).

Had a price differed from the offer, the Goal Decomposition would have been issued as `proposed` and Contoso Legal would have committed in the usual way. The same holds for a request without `preAuthorized`.

### Phase 3 — The orchestrator instructs an agent

Meridian IP Group opens workstream B and sends **[Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md)** to Fabrikam Patentes. Here Meridian IP Group acts as `workRequester`. The instruction names milestone `b1-es-validation-agent` and carries:

- the instruction text and Meridian IP Group's own reference
- the `agreedPrice` between orchestrator and agent: EUR 1,490.00 fixed, official fees included
- two `serviceLevels`: `acknowledgement` within 24 hours, `delivery` by 6 November
- the granted text as `providedDocuments`
- `expectedDeliverables`: the translation, a `filingReceipt`, an `officialFeeReceipt`

The envelope's assertions establish the milestone record for the agent, with `parentMilestoneUri` pointing at `a1-es-validation`. Fabrikam Patentes's role declaration carries the delegation:

```json
{
  "roleDeclarationUri": "urn:ipproto:roleDeclaration:fabrikam-work-provider-b",
  "actorUri": "urn:ipproto:actor:fabrikam-patentes",
  "role": "urn:ipproto:role:workProvider",
  "scope": {
    "scopeType": "workstream",
    "scopeUri": "urn:ipproto:workstream:b-agent-es-001",
    "effectiveFrom": "2026-10-27T08:15:00Z"
  },
  "delegationChain": [
    {
      "delegatingActorUri": "urn:ipproto:actor:meridian-ip-group",
      "delegatedRoleUri": "urn:ipproto:role:workProvider",
      "delegationBasis": "urn:ipproto:basis:partnerNetworkAgreement",
      "delegationReference": "meridian-agent-terms-v4"
    }
  ]
}
```

Fabrikam Patentes checks capacity and conflicts — against Northwind Industries SE, the beneficiary — and answers with **[Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md)** six hours later, inside the acknowledgement clock. Milestone `b1` is `committed`. No Goal Decomposition and no Orchestration Committed is exchanged in workstream B.

Had the agent answered with **[Instruction Declined](../03%20-%20Messages/Work%20Instruction/Instruction%20Declined.md)**, Meridian IP Group would have instructed another agent. Workstream A would not have noticed.

### Phase 4 — The agent works and delivers

In workstream B, all between Fabrikam Patentes and Meridian IP Group:

- **[Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md)** for `b1`
- **[Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md)** with the translation, the OEPM filing receipt (document type `filingReceipt`) and the fee receipt (`officialFeeReceipt`)
- **[Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md)** for `b1`

Meridian IP Group checks the deliverable and accepts it with **[Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md)** (`acceptance`).

### Phase 5 — The orchestrator reports to the customer

Meridian IP Group mirrors progress into workstream A under its own name:

- **[Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md)** for `a1` when the agent has started
- **[Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md)** for `a1` once it has accepted the agent's deliverable, with the filing receipt among the outputs

Contoso Legal sees a milestone performed by Meridian IP Group. Nothing in these messages refers to workstream B.

### Phase 6 — The agent invoices and is paid

Fabrikam Patentes sends **[Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md)** to Meridian IP Group: three lines on milestone `b1` — professional fee, translation, official fee — EUR 1,490.00 in total, as agreed in the instruction.

Meridian IP Group, the `payor` of `b1`, authorizes the payment with **[Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md)**; its payment agent executes it and reports **[Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md)**. Both messages are as in 0.1.

### Phase 7 — The customer receives one invoice

When both countries are done, Meridian IP Group sends one **[Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md)** to Contoso Legal: the lines of `a1` and `a2` at the catalogue prices, EUR 4,520.00 in total. The agents' invoices do not appear in it.

### Phase 8 — Close

Meridian IP Group closes each workstream with its own **[Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md)**: workstream B towards Fabrikam Patentes, workstream A towards Contoso Legal.

### Messages of Part 1

For Spain; Italy repeats the workstream B rows with the second agent.

| Workstream | Producer | Message | New in 0.2 |
|---|---|---|---|
| — | Contoso Legal | [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) | Yes |
| A | Meridian IP Group (orchestrator) | [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) with `agreedPrice`, issued `committed` | Field |
| B | Meridian IP Group (work requester) | [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) | Yes |
| B | Fabrikam Patentes | [Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md) | Yes |
| B | Fabrikam Patentes | [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md) (b1) | No |
| A | Meridian IP Group | [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md) (a1) | No |
| B | Fabrikam Patentes | [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md) | No |
| B | Fabrikam Patentes | [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) (b1) | No |
| B | Meridian IP Group | [Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md) (acceptance) | No |
| A | Meridian IP Group | [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) (a1) | No |
| B | Fabrikam Patentes | [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) | Yes |
| B | Meridian IP Group | [Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md) | No |
| B | Meridian IP Group (payment agent) | [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md) | No |
| A | Meridian IP Group | [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) | Yes |
| B | Meridian IP Group | [Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md) | No |
| A | Meridian IP Group | [Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md) | No |

### One level further down

Delegation nests with the same pieces. If Meridian IP Group passes a task to Meridian IP Group & Associates, and that firm passes part of it to an agent, then the task of Meridian IP Group & Associates is a milestone in a second workstream, and the agent's part is a milestone in a third workstream that points at it through `parentMilestoneUri`. Each workstream is shared by exactly the two actors that deal with each other.

## Part 2 — Open services: a panel procurement

### Scenario setup

**Asset:** the same European patent. Wingtip Components GmbH has filed an opposition against it.

**Goal:** Representation of the proprietor in the opposition proceedings.

**Actors:**
- Northwind Industries SE — the customer, acting in its own capacity (`workRequester`)
- Meridian IP Group — the `orchestrator`. It carries the messages between customer and suppliers and does not change them
- Woodgrove IP and Tailspin Legal — two firms of Northwind Industries's panel, each a `bidder`
- Wingtip Components GmbH — the adverse party. Not an actor in the exchange

One workstream, one milestone `c1-opposition-response` in execution mode `thirdPartyRfp`.

### The sequence

| Step | Producer | Message | What it carries |
|---|---|---|---|
| 1 | Northwind Industries | [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) | `requestMode: panel`, `instructingCapacity: own` |
| 2 | Meridian IP Group | [Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), one to each panel firm | Scope, `lineItemTemplate` of professional fee and disbursement, `bidDeadline`, `audience: panel`, `conflictParties`: Northwind Industries SE as beneficiary, Wingtip Components GmbH as adverse party |
| 3 | Woodgrove IP, Tailspin Legal | [Conflict Check Attested](../03%20-%20Messages/Procurement/Conflict%20Check%20Attested.md) | `outcome: clear`, attested by a named person |
| 4 | Woodgrove IP | [Bid Submitted](../03%20-%20Messages/Procurement/Bid%20Submitted.md) | EUR 9,800.00 capped, on the template's lines, `bindingUntil` 30 November, 30 days turnaround |
| 4 | Tailspin Legal | [Bid Submitted](../03%20-%20Messages/Procurement/Bid%20Submitted.md) | Its own price on the same lines, 45 days turnaround |
| 5 | Northwind Industries | [Award Proposed](../03%20-%20Messages/Procurement/Award%20Proposed.md) to Woodgrove IP | The bid, `confirmationDeadline` |
| 6 | Woodgrove IP | [Award Confirmed](../03%20-%20Messages/Procurement/Award%20Confirmed.md) | `confirmingRole: bidder` |
| 6 | Northwind Industries | [Award Confirmed](../03%20-%20Messages/Procurement/Award%20Confirmed.md) | `confirmingRole: workRequester` |
| 7 | Northwind Industries | [Bid Declined](../03%20-%20Messages/Procurement/Bid%20Declined.md) to Tailspin Legal | `anotherBidAwarded`, `turnaround` |
| 8 | Woodgrove IP | [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md) | Work begins; the existing messages take over |

After step 6 both sides have confirmed. The award stands and commits the milestone: `c1` is `committed`, Woodgrove IP is its `primary` actor, and the bid's price is its `agreedPrice`. No Orchestration Committed is sent.

Three clocks ran on the milestone as [Service Levels](../02%20-%20Foundational%20Structures/Service%20Level.md): `bidResponse` until the bid deadline, `acknowledgement` until the confirmation deadline, and `introduction` from the moment the award stood.

### What did not travel

- **The ranking.** Tailspin Legal learns that its bid was declined and why. It does not learn where it ranked, who won, or at what price.
- **The scoring.** How Northwind Industries compared the two bids is its own business.
- **The conflict check.** Each firm attested an outcome. How it checked is its professional duty and stays with it.

### The variants

- **Direct quote.** The same sequence with `requestMode: directQuote`, `audience: single` and one invited firm.
- **Open RFP.** The same sequence with `requestMode: openRfp`, `audience: open` and every eligible supplier invited.
- **A bidder steps back.** [Bid Withdrawn](../03%20-%20Messages/Procurement/Bid%20Withdrawn.md) before an award is proposed, [Award Declined](../03%20-%20Messages/Procurement/Award%20Declined.md) after. The requester then proposes the award to its next choice, with `rank: 2`.
- **A law firm requests for a client.** `instructingCapacity: onBehalf`. The client is the `beneficiary` among the `conflictParties`; the law firm's own identity may be withheld from bidders until they have attested `clear`.

## What this walkthrough demonstrates

Work can be passed on without a relay message and without showing the customer who performs it: two workstreams, one link, and an addressing rule. A binding price sits beside the estimate on every milestone, and the invoice refers back to it. A customer can ask several suppliers for binding bids and award one of them, and the award commits the milestone as a commitment message would.

None of this changed a 0.1 message. A receiver built for 0.1 follows the lifecycle messages of both parts as before and treats the rest as unknown.

## See also

- [EP Post-Grant Flow Walkthrough](EP%20Post-Grant%20Flow%20Walkthrough.md) — the 0.1 sequence from register detection to steady state
- [Milestone](../02%20-%20Foundational%20Structures/Milestone.md) — *Passing work on* and the addressing rule
- [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md), [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md)
- [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md) — decisions 29 and 30

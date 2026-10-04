---
type: front-matter
status: v0.5
---

# Conformance

> What an implementation does to conform, and the profiles it can claim.

Added in 0.5. Until 0.5 the only conformance section of the protocol was the asset identification profile. An implementation that orchestrates work, the most common position, had nothing to measure itself against except every "required" and "must" on every page. This page gathers the rules into profiles.

A profile is a list of requirements, each pointing at the page that states it. It adds no rule of its own except where a requirement says so. Where this page and the page it cites disagree, the cited page is right and this page is corrected. "Decision *n*" refers to [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md).

## Claiming conformance

A claim names the protocol version and the profile: "conforms to the orchestrator profile of IPOP 0.5". It covers the general requirements below and the requirements of the profile. A conditional module of a profile is part of the claim when the implementation performs what the module covers, and not applicable otherwise.

A conformance check reads each requirement against the implementation and records it as **met**, **partly met**, **not met** or **not applicable**, with the evidence. Not applicable is open to the conditional modules, and to a requirement on a flow the implementation does not perform at all; it is not open to a flow the implementation performs without the message the requirement names.

## Profiles

| Profile | Who claims it | Requirements |
|---|---|---|
| Asset identification, representational | any actor that references assets | [Asset Identification and Resolution](../02%20-%20Foundational%20Structures/Asset%20Identification%20and%20Resolution.md), section 6, points 1 to 3 |
| Asset identification, resolving | any actor that resolves assets by lookup | the same section, points 1 to 5 |
| Orchestrator | an actor in the role `orchestrator`: it answers work requests, passes the work to providers and invoices its customers | the general requirements and the orchestrator profile below |

## General requirements

They hold for every actor that produces protocol messages, whatever profile it claims.

| ID | Requirement | Stated in |
|---|---|---|
| G1 | Every message it produces is valid against the schema of its `messageType` in the schema set of the version its `protocolVersion` names. | [Conventions](Conventions.md), *Optional fields*; `schemas/README.md` |
| G2 | The envelope: `messageUri` of the form `urn:ipproto:message:{uuid}` assigned by the originator; `messageType` of the form `urn:ipproto:message:{type}`; `protocolVersion`; `originatingActor` and `originatingRoleDeclaration` naming the actor that acts and the role under which it acts; `addressedTo`; `producedAt` as a date-time with zone. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md) |
| G3 | `userContext` names a user of the originating actor, and is included in messages that bind the actor to decisions or costs. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md); [User Context](../02%20-%20Foundational%20Structures/User%20Context.md), *When to include* |
| G4 | A message entered on another actor's behalf keeps that actor as originator and names the recording actor in `recordedBy`. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md), `recordedBy` |
| G5 | URIs assigned by the protocol have the form `urn:ipproto:{type}:{value}` and are not parsed. Custom values of a vocabulary are namespaced URNs that name the defining authority; a closed enumeration takes no custom value. | [Conventions](Conventions.md), *URIs*, *Extensibility* |
| G6 | `xAt` fields are date-times with zone, `xDate` fields dates; amounts are decimals with an ISO 4217 currency; jurisdictions are ST.3 codes. | [Conventions](Conventions.md); [Reference Standards](Reference%20Standards.md) |
| G7 | As receiver: an unknown field, vocabulary value or message type of the same MAJOR version is treated as unknown, not as an error; a different MAJOR version is surfaced as a mismatch. | [VERSIONING](../../VERSIONING.md), rules 1 to 3 |
| G8 | The records it issued and names by URI (Actor References, Actor Role Declarations, Document References, Authority Claims) are resolvable, at least by the actors that produced or received a message naming them. | [Conventions](Conventions.md), *Record resolution* |
| G9 | Every change to a protocol record is made under an Authority Claim and conveyed by a Data Assertion. | [Conventions](Conventions.md), *Authority and assertions*; [Authority Claim](../02%20-%20Foundational%20Structures/Authority%20Claim.md); [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md) |

## Orchestrator profile

The orchestrator stands between a customer and the providers who do the work. In the terms of [Milestone](../02%20-%20Foundational%20Structures/Milestone.md), *Passing work on*, it shares one workstream with its customer, in which it is the primary actor of each milestone, and one workstream with each provider, in which it is the work requester. The walkthrough [Exclusive Delivery and Open Services](../04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md) shows the whole sequence.

### Core requirements

**Requests**

| ID | Requirement | Stated in |
|---|---|---|
| OR-R1 | Every [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) addressed to it is answered: with a [Goal Decomposition](../03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) for a catalogue order, with [Bid Invitations](../03%20-%20Messages/Procurement/Bid%20Invitation.md) for the procurement modes (see the procurement module), or with [Request Declined](../03%20-%20Messages/Workstream%20Lifecycle/Request%20Declined.md) and one of its seven reason categories. A refusal is never left without a message. | Work Requested, *Behavior on receipt*; Request Declined |
| OR-R2 | A Goal Decomposition is issued `committed` only under the one-step rule: the request is pre-authorized, names an offer, and every `agreedPrice` matches it. Otherwise it is issued `proposed` and committed by [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md). | Work Requested, *One-step catalogue order*; decision 30 |
| OR-R3 | `instructingCapacity`, `beneficiary` and `prospectiveRights` of the request are carried into the workstream unchanged. | Work Requested, *Behavior on receipt* |

**Workstreams and passing work on**

| ID | Requirement | Stated in |
|---|---|---|
| OR-W1 | Each workstream is shared by exactly the two actors that deal with each other. The customer's workstream has the orchestrator as primary actor of its milestones; each provider's workstream has the orchestrator as work requester. | [Milestone](../02%20-%20Foundational%20Structures/Milestone.md), *Passing work on*; walkthrough, *One level further down* |
| OR-W2 | A milestone in a provider's workstream names the milestone it serves through `parentMilestoneUri`, and the delegation is recorded in the provider's role declaration (`delegationChain`). | Milestone, *Passing work on*; [Actor Role Declaration](../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) |
| OR-W3 | Addressing rule: no message of a provider's workstream is addressed to an actor of the customer's workstream that is not also an actor of the provider's. The customer never sees the provider. | Milestone, *Addressing rule* |
| OR-W4 | When a provider's milestone is started, completed, failed or abandoned, the orchestrator decides what that means for the customer's milestone and reports it in the customer's workstream with the ordinary lifecycle messages, under its own name. | Milestone, *Passing work on* |
| OR-W5 | Each workstream holds at least the corporate claim over goal and chain and the orchestrator's claim over status and resulting assets. | [Workstream](../02%20-%20Foundational%20Structures/Workstream.md), `authorityRegistry` |
| OR-W6 | Each workstream is closed with [Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md) or [Workstream Abandoned](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Abandoned.md): the customer's and each provider's. | walkthrough, *Phase 8* |

**Instructing providers**

| ID | Requirement | Stated in |
|---|---|---|
| OR-I1 | Work is given to a provider with a [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) from the work requester to the work provider, with all its required fields. | Work Instruction |
| OR-I2 | The instruction states only agreed clocks: at least one agreed [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md), and a `responseDeadline` that repeats the `dueAt` of the `acknowledgement` level. No invented level. | Work Instruction; Service Level; decision 60 |
| OR-I3 | Each expected deliverable names a deliverable type or a document type; no placeholder stands in for a deliverable the terms do not name. | Work Instruction; decision 60 |
| OR-I4 | The `agreedPrice` follows [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md): for a fixed price the lines add up to `amount`, and where official fees are included and lines are given, an `officialFee` line shows their share. | Agreed Price |
| OR-I5 | The provider's answer is [Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md) or [Instruction Declined](../03%20-%20Messages/Work%20Instruction/Instruction%20Declined.md) with its closed reason category, correlated to the instruction. Where the orchestrator enters the answer for the provider, G4 applies. | Instruction Accepted; Instruction Declined |

**Milestone lifecycle**

| ID | Requirement | Stated in |
|---|---|---|
| OR-L1 | Start, completion, failure and abandonment of every milestone are expressed with [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md), [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md), [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md) and [Milestone Abandoned](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Abandoned.md), by the actor the page names as producer. | Milestone Lifecycle pages; walkthrough, *Phase 4* and *Phase 5* |
| OR-L2 | A provider's milestone that the orchestrator ends because the provider did not perform is abandoned by the orchestrator as `decisionAuthority`, not failed on the provider's behalf. | Milestone Abandoned, *When the provider does not perform*; decision 62 |
| OR-L3 | A missed service level is derived from the clocks, not announced, and its consequences stay outside the protocol. | Service Level, *Behavior*; decision 35 |

**Deliverables**

| ID | Requirement | Stated in |
|---|---|---|
| OR-D1 | A deliverable received with `acknowledgmentRequired` is answered with [Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md), from the deliverable recipient to the producer; `conditions` with a conditional acceptance, `objectionDetails` with an objection; `receiverUserContext` as the page recommends. | Deliverable Acknowledged; [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md), `acknowledgmentExpectation` |
| OR-D2 | Documents named in its messages are described by [Document References](../02%20-%20Foundational%20Structures/Document%20Reference.md) with a document type, originator, origination date and at least one storage location, resolvable under G8. | Document Reference |

**Invoices**

| ID | Requirement | Stated in |
|---|---|---|
| OR-V1 | The orchestrator invoices its customer with [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) in the customer's workstream, with lines on the customer's milestones. A provider's invoice stays in the provider's workstream and is never passed to the customer. | Invoice Issued, *Recipients* and second worked example; decision 33 |
| OR-V2 | Each invoice line carries exactly one of `milestoneReference` and `subscriptionReference`; `totalAmount` is the sum of the lines plus tax; `taxTreatment` states the treatment, and `notStated` only where the sender does not know it. | Invoice Issued; decision 61 |
| OR-V3 | An invoice it will not accept as issued is disputed with [Invoice Disputed](../03%20-%20Messages/Payments/Invoice%20Disputed.md); an invoice of its own that it withdraws is cancelled with [Invoice Cancelled](../03%20-%20Messages/Payments/Invoice%20Cancelled.md). An invoice is never changed. | Invoice Disputed; Invoice Cancelled; decision 57 |

### Conditional modules

| Module | Applies when the orchestrator | Requirements |
|---|---|---|
| Procurement | puts work to bidders (direct quote, panel, open RFP) | OR-P1: the procurement messages as the pages describe them, with the five rules of the procurement family ([Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), *The procurement sequence*). OR-P2: the sender rules of a Bid Invitation, including decisions 53 to 55. OR-P3: a withheld requester is disclosed only with [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md), only after a `clear` attestation. |
| Payments | authorizes or executes payments through the protocol | OR-PA1: [Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md) from the payor, [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md) from the payment agent. |
| Subscriptions | sells or operates subscriptions | OR-S1: [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) and [Terminated](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Terminated.md), one start message per audience where a revenue share applies (decision 47); subscription invoice lines under OR-V2. |
| Assets | names assets in its messages | OR-A1: the representational asset identification profile. Where it resolves assets by lookup, the resolving profile. |

### Outside the profile

Transport, authentication and signing ([Non-Scope](Non-Scope.md)); free-text messaging between the parties (decision 42); the consequences of a missed service level (decision 35); how the orchestrator ranks bids or chooses a provider.

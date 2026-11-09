---
type: front-matter
status: v0.7
---

# Conformance

> What an implementation does to conform, and the profiles it can claim.

Added in 0.5. Until 0.5 the only conformance section of the protocol was the asset identification profile. An implementation that orchestrates work, the most common position, had nothing to measure itself against except every "required" and "must" on every page. This page gathers the rules into profiles. Since 0.6 it carries a second role profile, for the provider that does the work, whether an orchestrator passes the work on or the client instructs it directly.

A profile is a list of requirements, each pointing at the page that states it. It adds no rule of its own except where a requirement says so. Where this page and the page it cites disagree, the cited page is right and this page is corrected. "Decision *n*" refers to [Ratified Decisions](../05%20-%20Decisions/Ratified%20Decisions.md).

## Claiming conformance

A claim names the protocol version and the profile: "conforms to the orchestrator profile of IPOP 0.7", "conforms to the provider profile of IPOP 0.7 with the litigation module". An actor that plays both roles, such as a firm that does part of its work and passes the rest on, may claim both. It covers the general requirements below and the requirements of the profile. A conditional module of a profile is part of the claim when the implementation performs what the module covers, and not applicable otherwise.

A conformance check reads each requirement against the implementation and records it as **met**, **partly met**, **not met** or **not applicable**, with the evidence. Not applicable is open to the conditional modules, and to a requirement on a flow the implementation does not perform at all; it is not open to a flow the implementation performs without the message the requirement names.

## Profiles

| Profile | Who claims it | Requirements |
|---|---|---|
| Asset identification, representational | any actor that references assets | [Asset Identification and Resolution](../02%20-%20Foundational%20Structures/Asset%20Identification%20and%20Resolution.md), section 6, points 1 to 3 |
| Asset identification, resolving | any actor that resolves assets by lookup | the same section, points 1 to 5 |
| Orchestrator | an actor in the role `orchestrator`: it answers work requests, passes the work to providers and invoices its customers | the general requirements and the orchestrator profile below |
| Provider | an actor in the role `workProvider`: counsel, an agent or another supplier that does the work, instructed by an orchestrator or directly by its client. Added in 0.6 | the general requirements and the provider profile below |

## General requirements

They hold for every actor that produces protocol messages, whatever profile it claims.

| ID | Requirement | Stated in |
|---|---|---|
| G1 | Every message it produces is valid against the schema of its `messageType` in the schema set of the version its `protocolVersion` names. | [Conventions](Conventions.md), *Optional fields*; `schemas/README.md` |
| G2 | The envelope: `messageUri` of the form `urn:ipproto:message:{uuid}` assigned by the originator; `messageType` of the form `urn:ipproto:message:{type}`; `protocolVersion`; `originatingActor` and `originatingRoleDeclaration` naming the actor that acts and the role under which it acts; `addressedTo`; `producedAt` as a date-time with zone. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md) |
| G3 | `userContext` names only a user of the originating actor. It is strongly recommended in messages that bind the actor to decisions or costs. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md); [User Context](../02%20-%20Foundational%20Structures/User%20Context.md), *When to include* |
| G4 | A message entered on another actor's behalf keeps that actor as originator and names the recording actor in `recordedBy`. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md), `recordedBy` |
| G5 | URIs assigned by the protocol have the form `urn:ipproto:{type}:{value}` and are not parsed. Custom values of a vocabulary are namespaced URNs that name the defining authority; a closed enumeration takes no custom value. | [Conventions](Conventions.md), *URIs*, *Extensibility* |
| G6 | `xAt` fields are date-times with zone, `xDate` fields dates; amounts are decimals with an ISO 4217 currency; jurisdictions are ST.3 codes. | [Conventions](Conventions.md); [Reference Standards](Reference%20Standards.md) |
| G7 | As receiver: an unknown field, vocabulary value or message type of the same MAJOR version is treated as unknown, not as an error; a different MAJOR version is surfaced as a mismatch. | [VERSIONING](../../VERSIONING.md), rules 1 to 3 |
| G8 | The records it issued and names by URI (Actor References, Actor Role Declarations, Document References, Authority Claims) are resolvable, at least by the actors that produced or received a message naming them. | [Conventions](Conventions.md), *Record resolution* |
| G9 | Every change to a protocol record is made under an Authority Claim and conveyed by a Data Assertion. | [Conventions](Conventions.md), *Authority and assertions*; [Authority Claim](../02%20-%20Foundational%20Structures/Authority%20Claim.md); [Data Assertion](../02%20-%20Foundational%20Structures/Data%20Assertion.md) |
| G10 | An Actor Reference it issued does not change once published; a change of legal name or jurisdiction after that takes a new actor URI. | [Actor Reference](../02%20-%20Foundational%20Structures/Actor%20Reference.md), *Behavior* |
| G11 | A message marked `privileged`, as sender or receiver: not broadcast, no bootstrap subscription invitations, records it names resolved only for its originator and addressees, not forwarded, its workstream's assets not resolved against third-party lookup services. Added in 0.6. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md), `confidentiality`; [Asset Identification and Resolution](../02%20-%20Foundational%20Structures/Asset%20Identification%20and%20Resolution.md), §4; decisions 76 and 77 |
| G12 | An Entity Reference that names a natural person carries no more personal data than the work needs: no national identity number, tax number or date of birth for matching, no identifier an office, court or register does not need for the work. A timekeeper in a rate table is named by the provider's own identifier. Added in 0.7. | [Entity Reference](../02%20-%20Foundational%20Structures/Entity%20Reference.md), *Natural persons*; decision 92 |

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

**Journal**

| ID | Requirement | Stated in |
|---|---|---|
| OR-J1 | Every action between two organizations that the orchestrator performs or carries, and for which the protocol has a message, is recorded as that message, whether or not it is transmitted to another system. This holds where all parties work on the orchestrator's own platform, including open services under the procurement module: an invitation, a bid, an award and their answers are messages even when no message leaves the platform. | [Conventions](Conventions.md), *Event-sourced flow*; decision 67 |
| OR-J2 | A recorded message names as originator the organization that acted, not the platform: a customer's award is the customer's message, a provider's bid the provider's. Where someone else entered it, G4 applies. | [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md); decision 67 |
| OR-J3 | The parties to a recorded message, its originator and the actors it is addressed to, can obtain it. | decision 67 |

### Conditional modules

| Module | Applies when the orchestrator | Requirements |
|---|---|---|
| Procurement | puts work to bidders (direct quote, panel, open RFP), also where requester and bidders all work on its own platform (OR-J1) | OR-P1: the procurement messages as the pages describe them, with the five rules of the procurement family ([Bid Invitation](../03%20-%20Messages/Procurement/Bid%20Invitation.md), *The procurement sequence*). OR-P2: the sender rules of a Bid Invitation, including decisions 53 to 55. OR-P3: a withheld requester is disclosed only with [Requester Disclosed](../03%20-%20Messages/Procurement/Requester%20Disclosed.md), only after a `clear` attestation (or, since 0.6, `clearedAfterReview`). |
| Payments | authorizes or executes payments through the protocol | OR-PA1: [Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md) from the payor, [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md) from the payment agent. See the payment note below. |
| Subscriptions | sells or operates subscriptions | OR-S1: [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) and [Terminated](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Terminated.md), one start message per audience where a revenue share applies (decision 47); subscription invoice lines under OR-V2. |
| Assets | names assets in its messages | OR-A1: the representational asset identification profile. Where it resolves assets by lookup, the resolving profile. |

### Payment note

Payment Authorized and Payment Executed carry a payment that the parties make through the protocol. Many orchestrators pay their providers and collect from their customers in an ERP or accounting system that is not part of the exchange. For such an orchestrator the payments module is not applicable: it writes neither message, and the absence is not a gap. Its invoices still fall under OR-V1 to OR-V3, so an invoice it will not pay as issued is disputed and an invoice it withdraws is cancelled; an undisputed invoice stands. Should the ERP later be connected, it may report a payment with Payment Executed as payment agent, and the module then applies to what it reports.

### Outside the profile

Transport, authentication and signing ([Non-Scope](Non-Scope.md)); free-text messaging between the parties (decision 42); the consequences of a missed service level (decision 35); how the orchestrator ranks bids or chooses a provider.

## Provider profile

Added in 0.6 (decision 68). The provider does the work: counsel, a patent attorney's office, an agent, a translator. It is instructed in one of two ways, and its core requirements are the same in both:

- **Under an orchestrator.** The orchestrator passes it a milestone in a workstream the two share (see [Milestone](../02%20-%20Foundational%20Structures/Milestone.md), *Passing work on*). The provider never deals with the orchestrator's customer.
- **In a direct engagement.** The client instructs it directly, without an orchestrator or a tender. Client and provider share one workstream, and the provider holds the status claim there (see [Workstream](../02%20-%20Foundational%20Structures/Workstream.md), *Direct engagement*).

A provider that bids on invitations, passes part of its work on, pays or is paid through the protocol, names assets, or conducts proceedings before a court, adds the conditional modules below. Litigation is a module and not a core requirement: a provider that never goes to court claims the profile without it (decision 94).

### Core requirements

**Instructions**

| ID | Requirement | Stated in |
|---|---|---|
| PR-I1 | Every [Work Instruction](../03%20-%20Messages/Work%20Instruction/Work%20Instruction.md) and [Mandate Instruction](../03%20-%20Messages/Work%20Instruction/Mandate%20Instruction.md) addressed to it is answered with [Instruction Accepted](../03%20-%20Messages/Work%20Instruction/Instruction%20Accepted.md) or with [Instruction Declined](../03%20-%20Messages/Work%20Instruction/Instruction%20Declined.md) and its closed reason category, correlated to the instruction. This includes an instruction it recorded itself from the client's letter or e-mail. A [Work Requested](../03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md) addressed to it directly is declined with [Request Declined](../03%20-%20Messages/Workstream%20Lifecycle/Request%20Declined.md) or taken on through an instruction. A refusal is never left without a message. | Instruction Accepted; Instruction Declined; Work Requested, *Behavior on receipt* |
| PR-I2 | Under a mandate it acts within `mandateScope`. A milestone it adds lies inside that scope; it changes neither the goal nor a milestone the client set. | Mandate Instruction, *Milestones under a mandate*; [Workstream](../02%20-%20Foundational%20Structures/Workstream.md), `authorityRegistry`; decision 71 |
| PR-I3 | Where it records the outcome of its conflict check, it does so with [Conflict Check Attested](../03%20-%20Messages/Procurement/Conflict%20Check%20Attested.md), naming the instruction, mandate or request as subject, the checked parties with their roles, and no detail of a hit; addressed to the requester or kept as an internal record. | Conflict Check Attested; decision 73 |

**Workstreams**

| ID | Requirement | Stated in |
|---|---|---|
| PR-W1 | In a direct engagement, the workstream is shared by exactly the client and the provider. The client holds the corporate claim over goal and chain; the provider holds the claim over status updates and resulting assets and, under a mandate, the mandate claim. Where the provider creates the workstream by recording the client's instruction, the instruction stays the client's message. | Workstream, *Direct engagement*; decisions 69 and 75 |
| PR-W2 | Each workstream in which it holds the claim over status updates is closed with [Workstream Completed](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Completed.md), unless the client ends it with [Workstream Abandoned](../03%20-%20Messages/Workstream%20Lifecycle/Workstream%20Abandoned.md). | Workstream, *Direct engagement* |

**Milestone lifecycle**

| ID | Requirement | Stated in |
|---|---|---|
| PR-L1 | Start, completion and failure of every milestone of which it is the `primary` actor are reported with [Milestone Started](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Started.md), [Milestone Completed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) and [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md), to the work requester. | Milestone Lifecycle pages |
| PR-L2 | It sends Milestone Failed only for its own work, and never on another provider's behalf. | Milestone Failed, *Producer*; decision 62 |
| PR-L3 | A deadline set by a court, a statute or an office, or a hearing, that it reports to the client is expressed as a [Deadline](../02%20-%20Foundational%20Structures/Deadline.md), never as a [Service Level](../02%20-%20Foundational%20Structures/Service%20Level.md). | Deadline; decisions 60 and 72 |

**Deliverables**

| ID | Requirement | Stated in |
|---|---|---|
| PR-D1 | Work products are handed over with [Service Deliverable](../03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md), each document described by a [Document Reference](../02%20-%20Foundational%20Structures/Document%20Reference.md) with a document type, originator, origination date and at least one storage location, resolvable under G8. | Service Deliverable; Document Reference |

**Invoices**

| ID | Requirement | Stated in |
|---|---|---|
| PR-V1 | It invoices with [Invoice Issued](../03%20-%20Messages/Payments/Invoice%20Issued.md) in the workstream it shares with its work requester, with lines on the milestones of that workstream or on a subscription; never on the milestones of a workstream it is not an actor of. Each line carries exactly one of `milestoneReference` and `subscriptionReference`, and `totalAmount` is the sum of the lines plus tax. | Invoice Issued; decisions 33, 40 and 61 |
| PR-V2 | An invoice is never changed. A correction is an [Invoice Cancelled](../03%20-%20Messages/Payments/Invoice%20Cancelled.md) and a new Invoice Issued. An [Invoice Disputed](../03%20-%20Messages/Payments/Invoice%20Disputed.md) that it accepts is answered with Invoice Cancelled, reason `disputeAccepted`, and a new invoice where one is due. | Invoice Cancelled; Invoice Disputed; decision 57 |

**Journal**

| ID | Requirement | Stated in |
|---|---|---|
| PR-J1 | Every action between it and another organization, for which the protocol has a message, is recorded as that message, also where the action took place outside the protocol: a client's instruction by letter, an acceptance by telephone. An action of the other party is recorded as that party's message under G4, with `recordedFrom` strongly recommended. | [Conventions](Conventions.md), *Event-sourced flow*; [Common Envelope](../02%20-%20Foundational%20Structures/Common%20Envelope.md), `recordedBy` and `recordedFrom`; decisions 67 and 75 |

**Addressing and confidence**

| ID | Requirement | Stated in |
|---|---|---|
| PR-C1 | No message of a workstream is addressed to an actor that is not an actor of that workstream. Under an orchestrator, it never addresses the orchestrator's customer. | [Milestone](../02%20-%20Foundational%20Structures/Milestone.md), *Addressing rule* |
| PR-C2 | It never discloses its client, or the client's matter, to a third party through the protocol: not to another provider, not to a bidder, not to a lookup service. Parties a provider further down must check are re-stated in its own instruction. | Work Instruction, `conflictParties`; Common Envelope, `confidentiality`; Asset Identification and Resolution, §4 |

### Conditional modules

| Module | Applies when the provider | Requirements |
|---|---|---|
| Bidder-side procurement | bids on [Bid Invitations](../03%20-%20Messages/Procurement/Bid%20Invitation.md) | PR-P1: before it bids, it attests its conflict check with [Conflict Check Attested](../03%20-%20Messages/Procurement/Conflict%20Check%20Attested.md) for the invitation, and bids only after `clear` or `clearedAfterReview`. PR-P2: bids with [Bid Submitted](../03%20-%20Messages/Procurement/Bid%20Submitted.md) and withdraws with [Bid Withdrawn](../03%20-%20Messages/Procurement/Bid%20Withdrawn.md); answers an [Award Proposed](../03%20-%20Messages/Procurement/Award%20Proposed.md) with [Award Confirmed](../03%20-%20Messages/Procurement/Award%20Confirmed.md) or [Award Declined](../03%20-%20Messages/Procurement/Award%20Declined.md). PR-P3: while the requester's identity is withheld, it addresses its messages for the requester to the orchestrator. |
| Sub-delegation | passes part of its work on to another provider | PR-S1: it does so as an orchestrator does, and requirements OR-W1 to OR-W4 and OR-I1 to OR-I5 of the orchestrator profile apply to it in the orchestrator's place: a second workstream, `parentMilestoneUri` and the delegation chain, the addressing rule, a Work Instruction or a Mandate Instruction with agreed clocks only. PR-S2: the parties the provider further down must check are carried in the instruction's `conflictParties`. |
| Payments | authorizes or executes payments through the protocol | PR-PA1: as OR-PA1 of the orchestrator profile. The payment note there applies: a provider that is paid and collects in an accounting system outside the exchange writes no payment message, and the module is not applicable to it. |
| Assets | names assets in its messages | PR-A1: the representational asset identification profile. A provider is never required to resolve assets; where it does resolve by lookup, the resolving profile applies, and assets of a privileged workstream are not resolved against third-party lookup services (G11). |
| Litigation | conducts proceedings before a court or a tribunal for its client. Added in 0.7 (decision 94). A provider may record an opposition before an office in `proceedings` as well; the module then applies to what it records | PR-LT1: each proceeding of the workstream is an entry in `proceedings` of the [Workstream](../02%20-%20Foundational%20Structures/Workstream.md), with its type, its forum as an Entity Reference, the forum's docket number once assigned, and the parties with their `partyRole`; the parties are also conflict parties. PR-LT2: where an asset plays a role in the dispute, `assetRoles` states it, each `assetUri` an entry of `assetReferences`. PR-LT3: court documents are [Document References](../02%20-%20Foundational%20Structures/Document%20Reference.md) of the court document types; a court or another party that is not an actor is the `originator` as an Entity Reference; a document from whose service a period runs carries `servedAt`. PR-LT4: a time limit set by the court or running from service is a [Deadline](../02%20-%20Foundational%20Structures/Deadline.md) whose trigger names the served document; a hearing is a Deadline of kind `hearing`. PR-LT5: a message that carries `proceedings` or `assetRoles` is marked at least `confidential` and goes only to actors of the workstream; work passed on carries only what the provider further down needs, re-stated under its own name. |

### Outside the profile

How the provider runs its conflict check (only its outcome is exchanged); how it computes a deadline from its basis and trigger; its internal time recording and billing method, beyond the rates, budget and fee floor it agrees in an [Agreed Price](../02%20-%20Foundational%20Structures/Agreed%20Price.md); the conduct of a proceeding and the content of pleadings; and, as for the orchestrator, transport, free-text messaging and the consequences of a missed service level or deadline.

---
type: reference
status: v0.2
---

# Glossary

> Quick reference for terms used throughout the protocol spec.

## A

**Actor** — An organization participating in the protocol. Corporate IP department, service provider, external counsel, register, payment institution. See [Actor Reference](02%20-%20Foundational%20Structures/Actor%20Reference.md).

**Agreed price** — A binding price for a milestone, as opposed to an estimate. Carried as an amount with optional line items. Added in 0.2. See [Agreed Price](spec/02%20-%20Foundational%20Structures/Agreed%20Price.md).

**Advisory claim** — An [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md) type where the claimant may make assertions but other actors with stronger claim types take precedence.

**Asset** — A patent or other IP asset existing in the world. Multiple workstreams may operate on the same asset. See [Asset Reference](02%20-%20Foundational%20Structures/Asset%20Reference.md).

**Assertion** — A claim being made about the value of a section of a record. The protocol's primitive for changing data. See [Data Assertion](02%20-%20Foundational%20Structures/Data%20Assertion.md).

**Award** — The choice of one bid for a milestone. Proposed by the work requester, it stands when both sides have confirmed, and then commits the milestone. Added in 0.2. See [Award Proposed](spec/03%20-%20Messages/Procurement/Award%20Proposed.md), [Award Confirmed](spec/03%20-%20Messages/Procurement/Award%20Confirmed.md).

**Authority claim** — A declaration that an actor has the right to make assertions over a section of a record. The protocol's primitive for governing data. See [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md).

## B

**Beneficiary** — The party the work is for when the work requester acts on someone else's behalf, as a law firm does for its client. Holds the role `ultimateBeneficiary`; suppliers check conflicts against it. Added in 0.2. See [Workstream](spec/02%20-%20Foundational%20Structures/Workstream.md).

**Bid** — A supplier's binding offer for one milestone, with a price that holds until `bindingUntil`. Added in 0.2. See [Bid Submitted](spec/03%20-%20Messages/Procurement/Bid%20Submitted.md).

**Bidder** — The role of an actor invited to bid, scoped to one milestone. Added in 0.2. See [Bid Invitation](spec/03%20-%20Messages/Procurement/Bid%20Invitation.md).

**Bootstrap** — An asset's first appearance in the protocol. See [Asset Bootstrap](03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Bootstrap.md).

## C

**Catalogue order** — A request for work at a catalogue price. With `preAuthorized` it is the commitment in one step. Added in 0.2. See [Work Requested](spec/03%20-%20Messages/Workstream%20Lifecycle/Work%20Requested.md).

**Claim type** — The strength of an [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md). One of `exclusive`, `sourceOfTruth`, `advisory`.

**Client executor** — An actor that performs an external action announced through [Artifact Ready](03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md). Typically the corporate.

**Common envelope** — Shared structure wrapping every message. See [Common Envelope](02%20-%20Foundational%20Structures/Common%20Envelope.md).

**Conformance level** — How strictly a structured representation conforms to a referenced schema. `strict`, `extended`, `partial`.

## D

**Decision authority** — The role authorizing workstream commitment. Typically the corporate's IP counsel.

**Definitive completion** — A [Milestone Completed](03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Completed.md) variant where work is final, no external action pending.

**Delegation chain** — When an [Actor Role Declaration](02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) references upstream contractual authority. Used for the contract-holder/operator pattern.

**Deliverable** — Output from a service provider. See [Service Deliverable](03%20-%20Messages/Deliverable%20Handoff/Service%20Deliverable.md).

**Derived asset** — An asset that comes into being through a workstream operation (e.g., a national validation derived from an EP grant).

**Dispute** — Surfaces conflicts that cannot be auto-resolved. Three types: [Asset Authority Dispute](03%20-%20Messages/Disputes/Asset%20Authority%20Dispute.md), [Action Confirmation Dispute](03%20-%20Messages/Disputes/Action%20Confirmation%20Dispute.md), [Identity Resolution Dispute](03%20-%20Messages/Disputes/Identity%20Resolution%20Dispute.md).

## E

**Effective period** — The time window during which an [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md) or [Actor Role Declaration](02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) is in force.

**Entity** — An organization or individual referenced in records. See [Entity Reference](02%20-%20Foundational%20Structures/Entity%20Reference.md).

**Event-sourced** — The protocol's data model. Records are populated by sequences of events; current state is the result of applying events in order.

**Evidence** — Documents or attestations supporting a claim. See [Evidence Collection](02%20-%20Foundational%20Structures/Evidence%20Collection.md).

**Exclusive claim** — An [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md) type where the claimant is the only actor authorized to make assertions over a section.

**Execution mode** — How a milestone is performed. `serviceProviderManaged`, `selfService`, `thirdPartyRfp`.

## F

**Federated** — The protocol's content storage model. Documents and structured content live wherever the originating actor stores them; receivers fetch on demand.

**Finding** — A subscription's output. See [Service Finding](03%20-%20Messages/Steady-State%20Events/Service%20Finding.md).

## G

**Goal decomposition** — The orchestrator's breakdown of a goal into a milestone chain. See [Goal Decomposition](03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md).

## H

**Hybrid cadence** — Subscription cadence combining periodic and event-driven findings.

## I

**IPMS** — IP Management System. Corporate-side tool for managing the IP portfolio. Connects to the protocol through an adapter.

**Instructing capacity** — Whether a work requester asks for work for itself (`own`) or for another party (`onBehalf`). Added in 0.2. See [Workstream](spec/02%20-%20Foundational%20Structures/Workstream.md).

**Identity resolution** — The protocol's per-actor process of resolving entity literals to entities in the actor's graph. Not standardized at cross-actor level.

## J

**JSON Patch** — RFC 6902 mechanism for partial updates. The protocol uses a subset (add, remove, replace, test). See [Data Assertion](02%20-%20Foundational%20Structures/Data%20Assertion.md).

**JSON Pointer** — RFC 6901 mechanism for referencing sections of structured documents. Used for [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md) and [Data Assertion](02%20-%20Foundational%20Structures/Data%20Assertion.md) section paths.

## L

**LEI** — Legal Entity Identifier (ISO 17442). Recommended cross-actor identifier for corporate actors.

**Line item** — One typed line of a price, a bid or an invoice, in the `urn:ipproto:lineItem:` namespace. Added in 0.2. See [Agreed Price](spec/02%20-%20Foundational%20Structures/Agreed%20Price.md).

**Literal** — An entity reference exactly as observed, before resolution. See [Entity Reference](02%20-%20Foundational%20Structures/Entity%20Reference.md).

## M

**Milestone** — A unit of work within a workstream. See [Milestone](02%20-%20Foundational%20Structures/Milestone.md).

**Milestone chain** — The DAG of milestones in a workstream. See [Workstream](02%20-%20Foundational%20Structures/Workstream.md).

## O

**Operator** — In subscription delegation, the actor performing operational work under a contract holder's authority. See `subscriptionOperator` role.

**Optimistic state** — A milestone's `inProgress` state after a [Client Action Completed](03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md) or [Payment Executed](03%20-%20Messages/Payments/Payment%20Executed.md) but before the corresponding register confirmation arrives.

**Orchestrator** — The actor that produces [Goal Decomposition](03%20-%20Messages/Workstream%20Lifecycle/Goal%20Decomposition.md) proposals. Typically a service provider. Since 0.2 also a role, `orchestrator`: it decomposes a goal, routes the work to providers and holds the workstream together. See [Actor Role Declaration](spec/02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md).

## P

**Parent milestone link** — The optional `parentMilestoneUri` of a milestone. Links it to the milestone in another workstream on whose behalf it is performed; the way work is passed on without showing the customer who performs it. Added in 0.2. See [Milestone](spec/02%20-%20Foundational%20Structures/Milestone.md).

**Payor** — The actor financially responsible for a milestone. May or may not be the same as the corporate.

**Payment agent** — The actor authorized to execute payments on the payor's behalf.

**Prepared-action handoff** — The protocol's pattern for actions performed through external systems. Pairs [Artifact Ready](03%20-%20Messages/Prepared-Action%20Handoff/Artifact%20Ready.md) with [Client Action Completed](03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md).

**Procurement** — The sequence of invitation, conflict attestation, bids and award behind the execution mode `thirdPartyRfp`. Added in 0.2. See [Bid Invitation](spec/03%20-%20Messages/Procurement/Bid%20Invitation.md).

**Primary** — A milestone actor assignment indicating the actor performing the work.

## R

**Record** — Any protocol-managed entity with sections under authority claims. Assets, workstreams, milestones, subscriptions.

**Register** — An office's authoritative database of patent records. The protocol's `sourceOfTruth` for legal status.

**Register-detection origin** — When an asset enters the protocol because a register adapter detected its publication.

**Register observer** — An actor monitoring a register on behalf of others. May act under `registerObserverDelegated` authority.

**Resolution** — An actor's mapping of an entity literal to an entity in their graph. See [Entity Reference](02%20-%20Foundational%20Structures/Entity%20Reference.md).

**Role declaration** — Declaration that an actor is operating under a specific role within a specific scope. See [Actor Role Declaration](02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md).

## S

**Section path** — A JSON Pointer (RFC 6901) identifying a section of a record. Used in [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md) and [Data Assertion](02%20-%20Foundational%20Structures/Data%20Assertion.md).

**Service level** — A clock on one step of the work: what is measured and when it runs out. The protocol carries the clock, not the consequence. Added in 0.2. See [Service Level](spec/02%20-%20Foundational%20Structures/Service%20Level.md).

**Software service** — The actor type `softwareService`: an application that performs work without a person in the loop. Added in 0.2. See [Actor Reference](spec/02%20-%20Foundational%20Structures/Actor%20Reference.md).

**Source of truth claim** — An [Authority Claim](02%20-%20Foundational%20Structures/Authority%20Claim.md) type where the claimant is authoritative; other actors may assert but the source-of-truth's assertions override.

**Subscription** — A long-running service. See [Service Subscription Started](03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md).

## U

**Ultimate beneficiary** — The role of the beneficiary of a workstream. See *Beneficiary*.

**URN** — Uniform Resource Name. The protocol's stable identifier scheme. Form: `urn:ipproto:{type}:{value}`.

**User context** — Identification of the human at an actor organization who originated a message or made a decision. See [User Context](02%20-%20Foundational%20Structures/User%20Context.md).

## W

**Work instruction** — The message by which a work requester instructs a provider to perform one milestone at an agreed price. Added in 0.2. See [Work Instruction](spec/03%20-%20Messages/Work%20Instruction/Work%20Instruction.md).

**Workstream** — A first-class entity representing operational work being performed. See [Workstream](02%20-%20Foundational%20Structures/Workstream.md).

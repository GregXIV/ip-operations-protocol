---
type: message
category: work-instruction
status: v0.7
---

# Work Instruction

> A work requester instructs a work provider to perform one milestone, at an agreed price and under agreed service levels.

## Purpose

Added in 0.2. Carries everything a provider needs to take on a piece of work: what is to be done, at what price, by when, with which documents, and what is expected back.

It serves two patterns. **Passing work on:** an orchestrator, or a provider that passes part of its matter on, gives an agent one milestone. The instruction lives in a second workstream that the two share; its milestone points at the customer-facing milestone through `parentMilestoneUri` (see [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md), *Passing work on*). The customer is not addressed and does not see the agent. **Direct engagement:** a client instructs a provider directly with one piece of work, without an orchestrator; the two share one workstream and there is no parent milestone (see [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), *Direct engagement*). Until 0.6 this page described the first pattern only. Where the client instructs a whole matter rather than one milestone, it uses a [Mandate Instruction](Mandate%20Instruction.md).

## Producer

The actor with `workRequester` role in the workstream the instruction belongs to. In the delegation pattern this is the orchestrator of the customer's workstream, acting as work requester towards the agent; in a direct engagement it is the client. A provider may record a client's instruction given outside the protocol on the client's behalf, with `recordedBy` (see [Common Envelope](../../02%20-%20Foundational%20Structures/Common%20Envelope.md)).

## Recipients

The actor with `workProvider` role. Never the actors of a parent workstream, unless they are also actors of this one.

## Payload

### `milestoneReference`
Type: milestoneUri, required

The milestone the provider is asked to perform. The envelope's `correlation.workstreamUri` names its workstream. The envelope's `assertions` establish the milestone record for the provider, including `parentMilestoneUri` where the work is performed on behalf of a milestone in another workstream.

### `instruction`
Type: structured, required

- `instructionText` — what is to be done
- `instructionConstraints` — optional structured: the requester's own reference to quote, formal requirements, anything the provider must observe

### `agreedPrice`
Type: [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md), required

The price the requester offers for the work. Binding on both sides once the instruction is accepted. Since 0.7 the price may carry a rate table, a budget, a flat fee per period and a statutory fee floor (see [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md)).

### `serviceLevels`
Type: array of [Service Level](../../02%20-%20Foundational%20Structures/Service%20Level.md) structures, conditional (at least one entry)

The clocks on the work. Typically `acknowledgement` and `delivery`. Required, as since 0.2, unless the instruction is recorded by its provider (see *Recorded by the provider* below); then present only where clocks were agreed. Relaxed in 0.7 (decision 86).

### `providedDocuments`
Type: array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs, required

What the provider is given to work from. An empty array when nothing is provided.

### `expectedDeliverables`
Type: array of structured entries, required (at least one)

What the requester expects back. Each entry names a deliverable type, a document type, or both:
- `deliverableType` — URI in the `urn:ipproto:deliverable:` namespace of [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md)
- `documentType` — URI in the `urn:ipproto:doctype:` namespace of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md): `filingReceipt`, `officialFeeReceipt`, `translation`, `invoice`

### `responseDeadline`
Type: ISO 8601 datetime, conditional

By when the provider must accept or decline. Repeats the `dueAt` of the `acknowledgement` service level. Required, as since 0.2, unless the instruction is recorded by its provider (see *Recorded by the provider* below). Relaxed in 0.7 (decision 86).

### Recorded by the provider

Added in 0.7 (decision 86). A client that instructs its counsel directly with one piece of work, by letter or e-mail, has usually agreed no clock for the answer and none for the delivery. The provider records the instruction on the client's behalf (`recordedBy` names the provider, the addressee) and answers it, often in the same act. Decision 60 forbids inventing a service level, and a response deadline for an instruction already answered describes nothing. In that case, and only in it:

- `serviceLevels` is present only where clocks were agreed, and then with at least one entry
- `responseDeadline` is present only where the client set one, and then repeats the `dueAt` of an `acknowledgement` level where one is given

Everything else stays required. `expectedDeliverables` keeps its rule: a single piece of work always has an output the provider can name, a filing receipt, a draft, an opinion, and decision 60 forbids only placeholders. `agreedPrice` stays required; a price agreed by reference to the provider's terms is stated with `agreementReference`.

The schema checks the presence of `recordedBy`; that it names the addressee is a rule of this page. An instruction sent by its requester itself, and every instruction passing work on to a provider further down, keeps the required clocks (requirement OR-I2 of [Conformance](../../01%20-%20Front%20Matter/Conformance.md)). Where the client instructs a whole matter, a [Mandate Instruction](Mandate%20Instruction.md) fits better, and there all clocks have been optional since 0.6.

### `conflictParties`
Type: array of structured entries, optional

Added in 0.6. The parties the provider checks for conflicts of interest before it accepts, each with `partyRole` and `party` as in [Bid Invitation](../Procurement/Bid%20Invitation.md). The requester lists the beneficiary, the opposing party where there is one, and every applicant of a prospective right who is neither the requester nor the beneficiary. Where the work is passed on, the requester carries the parties of the parent workstream down, so that a provider further down can check them too; it re-states them under its own name where the original source would reveal the customer to a provider that is not to see it.

## Worked example — validation in Spain passed to an agent

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:fabrikam-patentes", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:b-agent-es-001",
    "milestoneUri": "urn:ipproto:milestone:b1-es-validation-agent"
  },
  "payload": {
    "milestoneReference": "urn:ipproto:milestone:b1-es-validation-agent",
    "instruction": {
      "instructionText": "Validate EP 0 000 000 in Spain: translate the specification into Spanish, file the translation at the OEPM and pay the publication fee.",
      "instructionConstraints": {"requesterReference": "MIG-2026-1042-ES"}
    },
    "agreedPrice": {
      "amount": 1490.00,
      "currency": "EUR",
      "priceBasis": "fixed",
      "lineItems": [
        {"lineItemType": "urn:ipproto:lineItem:professionalFee", "amount": 380.00},
        {"lineItemType": "urn:ipproto:lineItem:translation", "amount": 850.00, "quantity": 21},
        {"lineItemType": "urn:ipproto:lineItem:officialFee", "amount": 260.00}
      ],
      "officialFeesIncluded": true,
      "agreementReference": "meridian-agent-terms-v4#rates-es"
    },
    "serviceLevels": [
      {"serviceLevelKind": "urn:ipproto:serviceLevel:acknowledgement", "dueAt": "2026-10-28T17:00:00Z", "agreedDurationHours": 24},
      {"serviceLevelKind": "urn:ipproto:serviceLevel:delivery", "dueAt": "2026-11-06T17:00:00Z", "agreedDurationHours": 240}
    ],
    "providedDocuments": ["urn:ipproto:document:ep0000000-b1-granted-text"],
    "expectedDeliverables": [
      {"deliverableType": "urn:ipproto:deliverable:preparedTranslation", "documentType": "urn:ipproto:doctype:translation"},
      {"documentType": "urn:ipproto:doctype:filingReceipt"},
      {"documentType": "urn:ipproto:doctype:officialFeeReceipt"}
    ],
    "responseDeadline": "2026-10-28T17:00:00Z"
  },
  "assertions": [
    /* Data Assertion over /parentMilestoneUri = "urn:ipproto:milestone:a1-es-validation" */
  ]
}
```

## Behavior on receipt

The provider runs its own checks — capacity, competence, conflicts against the beneficiary where one is named and against the `conflictParties` where given — and answers with [Instruction Accepted](Instruction%20Accepted.md) or [Instruction Declined](Instruction%20Declined.md) before `responseDeadline`.

An accepted instruction commits the milestone. No [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) and no [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) is exchanged for it: the instruction is the proposal and the acceptance is the commitment.

An instruction that is neither accepted nor declined by the deadline binds nobody. The requester may instruct another provider.

## Related messages

- Answered by [Instruction Accepted](Instruction%20Accepted.md) or [Instruction Declined](Instruction%20Declined.md)
- The conflict check may be recorded with [Conflict Check Attested](../Procurement/Conflict%20Check%20Attested.md), whose subject is then the instruction (since 0.6)
- [Mandate Instruction](Mandate%20Instruction.md) — the instruction for a whole matter
- Work then runs through [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md), [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md), [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md) and [Deliverable Acknowledged](../Deliverable%20Handoff/Deliverable%20Acknowledged.md), unchanged
- Invoiced through [Invoice Issued](../Payments/Invoice%20Issued.md)

## See also

- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) — `parentMilestoneUri` and the addressing rule
- [Actor Role Declaration](../../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) — the `delegationChain` records the delegation
- [Exclusive Delivery and Open Services Walkthrough](../../04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md)

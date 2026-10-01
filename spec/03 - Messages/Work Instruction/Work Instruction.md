---
type: message
category: work-instruction
status: v0.2
---

# Work Instruction

> A work requester instructs a work provider to perform one milestone, at an agreed price and under agreed service levels.

## Purpose

Added in 0.2. Carries everything a provider needs to take on a piece of work: what is to be done, at what price, by when, with which documents, and what is expected back.

This is how an orchestrator passes work on to an agent. The instruction lives in a second workstream that the orchestrator and the agent share; its milestone points at the customer-facing milestone through `parentMilestoneUri` (see [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md), *Passing work on*). The customer is not addressed and does not see the agent.

## Producer

The actor with `workRequester` role in the workstream the instruction belongs to. In the delegation pattern this is the orchestrator of the customer's workstream, acting as work requester towards the agent.

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

The price the requester offers for the work. Binding on both sides once the instruction is accepted.

### `serviceLevels`
Type: array of [Service Level](../../02%20-%20Foundational%20Structures/Service%20Level.md) structures, required (at least one)

The clocks on the work. Typically `acknowledgement` and `delivery`.

### `providedDocuments`
Type: array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs, required

What the provider is given to work from. An empty array when nothing is provided.

### `expectedDeliverables`
Type: array of structured entries, required (at least one)

What the requester expects back. Each entry names a deliverable type, a document type, or both:
- `deliverableType` — URI in the `urn:ipproto:deliverable:` namespace of [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md)
- `documentType` — URI in the `urn:ipproto:doctype:` namespace of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md): `filingReceipt`, `officialFeeReceipt`, `translation`, `invoice`

### `responseDeadline`
Type: ISO 8601 datetime, required

By when the provider must accept or decline. Repeats the `dueAt` of the `acknowledgement` service level.

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
      "instructionText": "Validate EP 3 987 654 in Spain: translate the specification into Spanish, file the translation at the OEPM and pay the publication fee.",
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
    "providedDocuments": ["urn:ipproto:document:ep3987654-b1-granted-text"],
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

The provider runs its own checks — capacity, competence, conflicts against the beneficiary where one is named — and answers with [Instruction Accepted](Instruction%20Accepted.md) or [Instruction Declined](Instruction%20Declined.md) before `responseDeadline`.

An accepted instruction commits the milestone. No [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) and no [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) is exchanged for it: the instruction is the proposal and the acceptance is the commitment.

An instruction that is neither accepted nor declined by the deadline binds nobody. The requester may instruct another provider.

## Related messages

- Answered by [Instruction Accepted](Instruction%20Accepted.md) or [Instruction Declined](Instruction%20Declined.md)
- Work then runs through [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md), [Service Deliverable](../Deliverable%20Handoff/Service%20Deliverable.md), [Milestone Completed](../Milestone%20Lifecycle/Milestone%20Completed.md) and [Deliverable Acknowledged](../Deliverable%20Handoff/Deliverable%20Acknowledged.md), unchanged
- Invoiced through [Invoice Issued](../Payments/Invoice%20Issued.md)

## See also

- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) — `parentMilestoneUri` and the addressing rule
- [Actor Role Declaration](../../02%20-%20Foundational%20Structures/Actor%20Role%20Declaration.md) — the `delegationChain` records the delegation
- [Exclusive Delivery and Open Services Walkthrough](../../04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md)

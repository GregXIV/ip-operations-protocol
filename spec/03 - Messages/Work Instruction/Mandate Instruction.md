---
type: message
category: work-instruction
status: v0.7
---

# Mandate Instruction

> A work requester instructs a work provider to handle a whole matter: one workstream, within a stated scope, rather than one milestone.

## Purpose

Added in 0.6. A [Work Instruction](Work%20Instruction.md) gives a provider one milestone, with its price, its clocks and its deliverables fixed in advance. That fits work passed on piece by piece. It does not fit a client that instructs its counsel or its agent with a matter, such as an opposition, a prosecution or a dispute, whose steps nobody can list on the first day. The mandate is that instruction: it covers a workstream, states what the provider is to achieve and within which limits, and lets the provider add the milestones the matter needs as it develops (see *Milestones under a mandate* below).

A mandate is the usual instruction of a **direct engagement**: the client and the provider deal with each other without an orchestrator, and share one workstream (see [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), *Direct engagement*). It can also pass a matter on to a provider further down; the rules of passing work on then apply as for a Work Instruction (see [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md), *Passing work on*).

## Producer

The actor with `workRequester` role in the workstream: the client, or a law firm acting for its client.

**Recorded by the provider.** Most mandates are given by letter, by e-mail or in a meeting, not by a message. The provider may then record the mandate on the client's behalf: the message stays the client's (`originatingActor` is the client), and the envelope's `recordedBy` names the provider, with `recordedFrom` saying how the instruction came in. This is the addressee recording the other party's message, which [Common Envelope](../../02%20-%20Foundational%20Structures/Common%20Envelope.md), `recordedBy`, allows. The example `mandate-instruction-recorded.example.json` in `schemas/examples/` shows it.

## Recipients

The actor with `workProvider` role. Never an actor of a parent workstream unless it is also an actor of this one.

## Payload

### `workstreamReference`
Type: workstreamUri, required

The workstream the mandate covers. The envelope's `correlation.workstreamUri` names the same workstream. Where the mandate opens the workstream, the envelope's `assertions` establish its record: goal, instructing capacity and beneficiary, assets or rights still to be created, and the first milestones where any are known.

### `instruction`
Type: structured, required

- `instructionText` — what the provider is to achieve
- `instructionConstraints` — optional structured: the client's own reference, formal requirements, anything the provider must observe

### `mandateScope`
Type: structured, required

The limits within which the provider acts and may add milestones:
- `scopeText` — string, required: the matter in words
- `milestoneCategories` — array of URIs in the `urn:ipproto:milestoneCategory:` namespace, optional: the kinds of work the provider may add. Absent means any kind of work that serves the goal
- `jurisdictionCodes` — array of ST.3 codes, optional: where the provider may act. Absent means no limit beyond the goal
- `assetReferences` — array of [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URIs, optional: the assets the mandate covers
- `prospectiveRights` — array, optional: the rights still to be created that the mandate covers, with the entries of [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md)
- `excludedWork` — string, optional: what the mandate does not cover, in words
- `validUntil` — ISO 8601 date, optional: the last day on which the provider may add a milestone under the mandate

### `conflictParties`
Type: array of structured entries, optional

The parties the provider checks for conflicts of interest before it accepts. Each entry has `partyRole` and `party`, as in [Bid Invitation](../Procurement/Bid%20Invitation.md). A mandate on behalf of a beneficiary lists the beneficiary; one in a dispute lists the opposing party as `adverseParty`. An applicant of a prospective right who is neither the requester nor the beneficiary is listed, as in a Bid Invitation.

### `agreedPrice`
Type: [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md), optional

The price agreed for the mandate, where one is agreed. Since 0.7 it can carry what a mandate usually needs: rates per role or per timekeeper (`rateTable`), a `budget` beside the price, a flat fee per period (`priceBasis` `periodicFlat`), and a statutory fee schedule as the floor (`statutoryFeeFloor`); see [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md) and decisions 82 to 85. 0.6 left these to a later version.

A milestone added under the mandate is charged under the mandate's price where that price is `hourly`, `capped` or `periodicFlat`, and needs no `agreedPrice` of its own. A milestone to be charged otherwise, such as a fixed fee for one filing, carries its own.

### `serviceLevels`
Type: array of [Service Level](../../02%20-%20Foundational%20Structures/Service%20Level.md) structures, optional

Clocks agreed for the mandate, where any are agreed. Decision 60 applies: a level nobody agreed is not stated. A mandate recorded by the provider in the same act as its acceptance usually has none.

### `responseDeadline`
Type: ISO 8601 datetime, optional

By when the provider must accept or decline. Where an `acknowledgement` level is given, it repeats its `dueAt`.

### `deadlines`
Type: array of [Deadline](../../02%20-%20Foundational%20Structures/Deadline.md) structures, optional

The deadlines known when the mandate is given: the time limit to answer a statement, a hearing already set.

### `providedDocuments`
Type: array of [Document Reference](../../02%20-%20Foundational%20Structures/Document%20Reference.md) URIs, optional

What the provider is given to work from.

### `expectedDeliverables`
Type: array of structured entries, optional

What the client expects back, where known, with the entries of [Work Instruction](Work%20Instruction.md).

## Worked example — a mandate for an opposition, recorded by the provider

The client instructs its counsel by e-mail to oppose a competitor's European patent. Counsel records the mandate on the client's behalf and then accepts it.

```json
{
  "originatingActor": "urn:ipproto:actor:northwind-industries",
  "originatingRoleDeclaration": "urn:ipproto:roleDeclaration:northwind-requester-opp-001",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:woodgrove-ip", "expectedRole": "urn:ipproto:role:workProvider"}
  ],
  "recordedBy": {
    "actorUri": "urn:ipproto:actor:woodgrove-ip",
    "userContext": {"userIdentifier": "docketing@woodgrove-ip.example", "roleAtActor": "Docketing"}
  },
  "recordedFrom": {
    "channel": "email",
    "sourceDocument": "urn:ipproto:document:woodgrove-mandate-email-2026-11-02",
    "receivedAt": "2026-11-02T08:41:00Z"
  },
  "confidentiality": {"level": "privileged"},
  "correlation": {"workstreamUri": "urn:ipproto:workstream:opp-ep9900001-001"},
  "payload": {
    "workstreamReference": "urn:ipproto:workstream:opp-ep9900001-001",
    "instruction": {
      "instructionText": "File and conduct an opposition against XX 0 000 001 B1 up to the decision of the Opposition Division.",
      "instructionConstraints": {"requesterReference": "NW-LEGAL-2026-077"}
    },
    "mandateScope": {
      "scopeText": "Opposition against XX 0 000 001 B1 at first instance, including oral proceedings.",
      "milestoneCategories": [
        "urn:ipproto:milestoneCategory:priorArtSearch",
        "urn:ipproto:milestoneCategory:responseDrafting",
        "urn:ipproto:milestoneCategory:officeFiling",
        "urn:ipproto:milestoneCategory:officeFeePayment",
        "urn:ipproto:milestoneCategory:correspondenceHandling"
      ],
      "jurisdictionCodes": ["EP"],
      "excludedWork": "Appeal proceedings."
    },
    "conflictParties": [
      {"partyRole": "beneficiary", "party": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration"}}}},
      {"partyRole": "adverseParty", "party": {"literal": {"value": "Wingtip Components GmbH", "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo"}}}}
    ],
    "deadlines": [
      {
        "deadlineUri": "urn:ipproto:deadline:opp-ep9900001-period",
        "deadlineKind": "statutory",
        "title": "Opposition period",
        "basis": {"legalProvision": "Article 99(1) EPC"},
        "trigger": {"eventType": "urn:ipproto:deadlineTrigger:publication", "triggerDate": "2026-06-17"},
        "dueDate": "2027-03-17",
        "jurisdictionCode": "EP",
        "status": "open"
      }
    ]
  }
}
```

## Worked example — a mandate for an infringement action, priced by the hour

Added in 0.7. The client instructs its counsel to bring an infringement action before a court. The envelope's assertions open the workstream with the proceeding and the role of each patent (see [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), `proceedings` and `assetRoles`, and the litigation module of the provider profile). The full message is `mandate-instruction-litigation-rate-table.example.json` in `schemas/examples/`; the price is the first worked example of [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md).

```json
{
  "payload": {
    "workstreamReference": "urn:ipproto:workstream:inf-0001",
    "instruction": {"instructionText": "Bring an infringement action on XX 0 000 002 B1 against the Opposing Party before the Court, first instance."},
    "mandateScope": {
      "scopeText": "Infringement action at first instance, including a counterclaim for revocation if one is raised, up to the decision.",
      "milestoneCategories": [
        "urn:ipproto:milestoneCategory:pleadingDrafting",
        "urn:ipproto:milestoneCategory:courtFiling",
        "urn:ipproto:milestoneCategory:hearingAttendance",
        "urn:ipproto:milestoneCategory:correspondenceHandling"
      ],
      "excludedWork": "Appeal; enforcement of the decision."
    },
    "agreedPrice": {"amount": 520.00, "currency": "EUR", "priceBasis": "hourly", "rateTable": ["…"], "budget": {"amount": 85000.00, "onExceeding": "approvalRequired"}, "officialFeesIncluded": false}
  }
}
```

## Behavior on receipt

The provider runs its own checks, including its conflict check against `conflictParties` and the beneficiary, and answers with [Instruction Accepted](Instruction%20Accepted.md) or [Instruction Declined](Instruction%20Declined.md), whose `instructionReference` names the mandate. It may record the outcome of the conflict check with [Conflict Check Attested](../Procurement/Conflict%20Check%20Attested.md), whose subject is then the mandate.

An accepted mandate commits the workstream. No [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) and no [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) is exchanged for it. From the acceptance the provider holds the claims that [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), *Direct engagement*, gives it.

## Milestones under a mandate

Ratified in 0.6 (decision 71). Under an accepted mandate the provider may add milestones to the workstream as the matter develops: a reply to a new submission, a further search, the attendance of a hearing once it is set. It does so with a [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md) on the workstream's `milestoneChain`, made under its mandate claim (see [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), `authorityRegistry`), and carried in a message of the workstream addressed to the client, typically a [Record Update](../Generic/Record%20Update.md) or the [Milestone Started](../Milestone%20Lifecycle/Milestone%20Started.md) of the new milestone.

- A milestone added under the mandate lies inside `mandateScope`: its category among `milestoneCategories` where these are listed, its jurisdiction among `jurisdictionCodes` where these are listed, its subject among the mandate's assets and rights where these are listed, and the date of the assertion not after `validUntil`.
- It is `committed` when it is added. The mandate is the client's authorization; no Goal Decomposition and no Orchestration Committed is exchanged for it.
- The provider is its `primary` actor, and the client its `accountableTo` actor.
- The goal stays the client's. Changing `goalStatement`, adding or removing assets or rights still to be created, and removing or altering milestones the client set, stay under the corporate claim over goal and chain.

A milestone outside the scope is not covered by the mandate claim, whatever the provider asserts. The provider asks the client to widen the mandate, which the client does with a new Mandate Instruction for the same workstream, or the client adds the milestone itself.

## Related messages

- Answered by [Instruction Accepted](Instruction%20Accepted.md) or [Instruction Declined](Instruction%20Declined.md)
- May be preceded by [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md) addressed to the provider directly, and followed by [Conflict Check Attested](../Procurement/Conflict%20Check%20Attested.md)
- Work then runs through the milestone lifecycle, deliverables and invoices as under a [Work Instruction](Work%20Instruction.md)

## See also

- [Work Instruction](Work%20Instruction.md) — the instruction for one milestone
- [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md) — *Direct engagement*, and the claims under a mandate
- [Deadline](../../02%20-%20Foundational%20Structures/Deadline.md)
- [Conformance](../../01%20-%20Front%20Matter/Conformance.md) — the provider profile

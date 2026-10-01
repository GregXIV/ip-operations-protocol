---
type: message
category: procurement
status: v0.2
---

# Bid Invitation

> An orchestrator invites suppliers to bid on one milestone.

## Purpose

Added in 0.2. Opens the procurement sequence behind the execution mode `thirdPartyRfp`. States the scope, the lines a bid must price, the deadline, and the parties a bidder must check for conflicts before it bids.

The same message serves all three paths of open services. A direct quote is the sequence with one invited supplier, a panel with a few, an open RFP with every eligible one.

## The procurement sequence

The eight procurement messages run between three actors. A [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md) opens the sequence and the existing milestone messages close it; everything between is in this category.

| Step | Message | Sender to receiver |
|---|---|---|
| 1 | Bid Invitation | Orchestrator to bidders |
| 2 | [Conflict Check Attested](Conflict%20Check%20Attested.md) | Bidder to orchestrator |
| 3 | [Bid Submitted](Bid%20Submitted.md) | Bidder to work requester |
| 3a | [Bid Withdrawn](Bid%20Withdrawn.md) | Bidder to work requester |
| 4 | [Award Proposed](Award%20Proposed.md) | Work requester to bidder |
| 5 | [Award Confirmed](Award%20Confirmed.md) | Each side, once |
| 5a | [Award Declined](Award%20Declined.md) | Bidder to work requester |
| 6 | [Bid Declined](Bid%20Declined.md) | Work requester to the other bidders |

The orchestrator carries the messages between requester and bidders and does not change them.

Five rules hold across the family:

1. **Identity before attestation.** A bidder learns the beneficiary and the adverse party at the latest with the invitation's `conflictParties`. The requester's own identity may be withheld until [Conflict Check Attested](Conflict%20Check%20Attested.md) returns `clear`.
2. **A bid is binding** until its `bindingUntil`. A [Bid Submitted](Bid%20Submitted.md) for the same invitation replaces the earlier bid of that bidder.
3. **The award commits the milestone.** After both confirmations the milestone is `committed`, with the winner as `primary` actor and the bid's price as `agreedPrice`. No separate [Orchestration Committed](../Workstream%20Lifecycle/Orchestration%20Committed.md) is needed for it.
4. **Clocks.** `bidDeadline`, `confirmationDeadline` and the introduction deadline are [Service Levels](../../02%20-%20Foundational%20Structures/Service%20Level.md) on the milestone.
5. **Ranking stays private.** Only its outcome travels, as [Award Proposed](Award%20Proposed.md) and [Bid Declined](Bid%20Declined.md).

How bids are scored or ranked, and how a conflict check is carried out, are outside the protocol (see [Non-Scope](../../01%20-%20Front%20Matter/Non-Scope.md)).

## Producer

The actor with `orchestrator` role on the workstream.

## Recipients

The invited suppliers, each under a `bidder` role declaration scoped to the milestone. Each bidder receives the invitation on its own; an invitation does not tell a bidder who else was invited.

## Payload

### `requestReference`
Type: URI, required

The `requestReference` of the [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md) the invitation follows from.

### `milestoneReference`
Type: milestoneUri, required

The milestone to be awarded. Its execution mode is `thirdPartyRfp`.

### `scope`
Type: structured, required

- `scopeText` — what is to be done, required
- `milestoneCategory` — optional URI
- `jurisdictionCode` — optional ST.3 code
- `assetReferences` — optional array of [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URIs. Left out while the requester's identity is withheld and an asset would reveal it

### `lineItemTemplate`
Type: array of URIs, required (at least one)

The line item types a bid must price, in the `urn:ipproto:lineItem:` namespace of [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md). Every bid prices the same lines, which is what makes bids comparable.

### `bidDeadline`
Type: ISO 8601 datetime, required

Repeats the `dueAt` of the `bidResponse` service level on the milestone.

### `audience`
Type: enumeration, required

- `single` — one supplier is invited (direct quote)
- `panel` — the suppliers of a panel are invited
- `open` — every eligible supplier is invited

Tells a bidder what kind of competition it is in, not who the competitors are. Closed enumeration.

### `conflictParties`
Type: array of structured entries, required

The parties a bidder checks for conflicts of interest. Each entry:
- `partyRole` — enumeration: `beneficiary`, `adverseParty`, `other`
- `party` — [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md)

`beneficiary` is the party the work is for: the `beneficiary` of the workstream, or the requester itself when it instructs in its own capacity. An empty array states that there is no party to check.

### `requesterIdentityWithheld`
Type: boolean, optional

`true` when the requester acts on behalf of a beneficiary and its own identity is not disclosed to bidders yet. It follows once the bidder has attested `clear`. Absent means not withheld.

## Worked example — panel invitation

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:woodgrove-ip", "expectedRole": "urn:ipproto:role:bidder"}
  ],
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:c-opposition-defence-001",
    "milestoneUri": "urn:ipproto:milestone:c1-opposition-response"
  },
  "payload": {
    "requestReference": "urn:ipproto:request:req-2026-1107",
    "milestoneReference": "urn:ipproto:milestone:c1-opposition-response",
    "scope": {
      "scopeText": "Represent the patent proprietor in EPO opposition proceedings: analyse the notice of opposition, draft and file the reply, up to and excluding oral proceedings.",
      "milestoneCategory": "urn:ipproto:milestoneCategory:responseDrafting",
      "jurisdictionCode": "EP",
      "assetReferences": ["urn:ipproto:asset:7c4f9a82-..."]
    },
    "lineItemTemplate": [
      "urn:ipproto:lineItem:professionalFee",
      "urn:ipproto:lineItem:disbursement"
    ],
    "bidDeadline": "2026-11-09T17:00:00Z",
    "audience": "panel",
    "conflictParties": [
      {"partyRole": "beneficiary", "party": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration"}}}},
      {"partyRole": "adverseParty", "party": {"literal": {"value": "Wingtip Components GmbH", "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo"}}}}
    ]
  }
}
```

## Behavior on receipt

The bidder checks conflicts against `conflictParties` and answers with [Conflict Check Attested](Conflict%20Check%20Attested.md). If the outcome is `clear` and it wants the work, it submits a bid before `bidDeadline`. A supplier that does not want to bid need not answer.

While `requesterIdentityWithheld` is `true`, the bidder addresses its messages for the work requester to the orchestrator, with `expectedRole` `workRequester`. The orchestrator passes them on unchanged. After a `clear` attestation the orchestrator makes the requester's [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md) known to the bidder.

## Related messages

- Follows [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md) with `requestMode` `directQuote`, `panel` or `openRfp`
- Answered by [Conflict Check Attested](Conflict%20Check%20Attested.md), then [Bid Submitted](Bid%20Submitted.md)

## See also

- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) — execution mode `thirdPartyRfp`
- [Ratified Decisions](../../05%20-%20Decisions/Ratified%20Decisions.md) — decision 14 on execution modes, decision 29 on the procurement family
- [Exclusive Delivery and Open Services Walkthrough](../../04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md)

---
type: message
category: procurement
status: v0.4
---

# Bid Invitation

> An orchestrator invites suppliers to bid on one milestone.

## Purpose

Added in 0.2. Opens the procurement sequence behind the execution mode `thirdPartyRfp`. States the scope, the lines a bid must price, the deadline, and the parties a bidder must check for conflicts before it bids.

The same message serves all three paths of open services. A direct quote is the sequence with one invited supplier, a panel with a few, an open RFP with every eligible one.

## The procurement sequence

The nine procurement messages run between three actors. A [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md) opens the sequence and the existing milestone messages close it; everything between is in this category.

| Step | Message | Sender to receiver |
|---|---|---|
| 1 | Bid Invitation | Orchestrator to bidders |
| 2 | [Conflict Check Attested](Conflict%20Check%20Attested.md) | Bidder to orchestrator |
| 2a | [Requester Disclosed](Requester%20Disclosed.md) | Orchestrator to the bidder, only where the requester's identity was withheld |
| 3 | [Bid Submitted](Bid%20Submitted.md) | Bidder to work requester |
| 3a | [Bid Withdrawn](Bid%20Withdrawn.md) | Bidder to work requester |
| 4 | [Award Proposed](Award%20Proposed.md) | Work requester to bidder |
| 5 | [Award Confirmed](Award%20Confirmed.md) | Each side, once |
| 5a | [Award Declined](Award%20Declined.md) | Bidder to work requester |
| 6 | [Bid Declined](Bid%20Declined.md) | Work requester to the other bidders |

The orchestrator carries the messages between requester and bidders and does not change them.

Five rules hold across the family:

1. **Identity before attestation.** A bidder learns the beneficiary and the adverse party at the latest with the invitation's `conflictParties`. The requester's own identity is either stated in the invitation's `requester` (added in 0.4) or withheld until [Conflict Check Attested](Conflict%20Check%20Attested.md) returns `clear`; the orchestrator then discloses it with [Requester Disclosed](Requester%20Disclosed.md) (added in 0.3). A bidder that attests `conflict` never learns it. See *Who carries the requester* below.
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
- `prospectiveRights` — optional array of structured entries (at least one entry when present). Added in 0.4. The rights the work is to create or prepare where no asset exists yet, with the entries of [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md): `assetType`, `workingTitle`, optional `intendedJurisdictions`, optional `applicant`. `resultingAssetReferences` is not used in an invitation

Neither `assetReferences` nor `prospectiveRights` is required. A 0.3 invitation for a first filing carried the mark or the working title in `scopeText` alone, and such an invitation remains valid. A 0.4 sender that invites bids on a right still to be created describes it in `prospectiveRights`, with the entries of the request.

**No applicant while the requester is withheld.** While `requesterIdentityWithheld` is `true`, `applicant` is left out of every entry, so that the invitation cannot reveal who is asking before the conflict check. The schema enforces this. It does not hide a party from the bidder's conflict check: an applicant the bidder would act for is among the `conflictParties` (see there).

**Two kinds of jurisdiction.** `scope.jurisdictionCode` is the invitation's own jurisdiction: where the work of this milestone is done. The `intendedJurisdictions` of an entry describe the right: the jurisdictions in which protection is sought. The request and the workstream keep the full list. On an invitation the sender may limit the list of an entry to the jurisdictions the invitation covers; it is not required to show the full filing plan to a bidder, and a bidder does not read the list as complete. A first filing in two jurisdictions is two milestones and two invitations; each carries the entry with its own jurisdiction alone or with both, as the sender chooses, and its own `jurisdictionCode`. A bid prices the work in `jurisdictionCode` only. Where `jurisdictionCode` is absent, as for a drafting job that is not tied to an office, `scopeText` says what the work covers, and `intendedJurisdictions` do not widen it.

That the sender may limit the list was stated in 0.4.1. The 0.4.0 text of this paragraph said that the entry is not cut down to the invitation.

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

**Every applicant is a conflict party.** Stated in 0.4.1. An applicant of a prospective right who is neither the requester nor the beneficiary is listed here, with `partyRole` `other` unless one of the other two roles describes it. A bidder therefore sees every party it would act for before it bids, also while the requester's identity is withheld and `applicant` is left out of the entries of `scope.prospectiveRights`. An applicant who is the beneficiary is listed as `beneficiary` already. An applicant who is the requester becomes known with the requester: from `requester`, or from [Requester Disclosed](Requester%20Disclosed.md).

**A withheld requester is not named indirectly.** Stated in 0.4.1. While `requesterIdentityWithheld` is `true`, no [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md) in the invitation carries the requester as its source (`literal.source.sourceActorUri`) or names it in any other field. A request often states the beneficiary on the requester's own declaration, with the requester as the source actor; copied unchanged into the invitation, that reference would give the requester away. The orchestrator re-states such a reference under its own name or without a source actor. This is a rule the sender follows. The schema cannot check it, because it does not know which actor the requester is.

### `requesterIdentityWithheld`
Type: boolean, optional

`true` when the requester acts on behalf of a beneficiary and its own identity is not disclosed to bidders yet. It follows in a [Requester Disclosed](Requester%20Disclosed.md) once the bidder has attested `clear`. Absent means not withheld.

While it is `true`, the invitation carries no `requester` and no `applicant` in `scope.prospectiveRights`. The schema rejects an invitation that has either. Nor does such an invitation name the requester in the source of an Entity Reference or anywhere else; that part the sender has to see to itself (see `conflictParties`, stated in 0.4.1).

### `requester`
Type: [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md), optional; absent while `requesterIdentityWithheld` is `true`

Added in 0.4. The work requester, as the full structure and not only its URI: the bidder may never have dealt with this actor. The same shape as `requester` in [Requester Disclosed](Requester%20Disclosed.md).

A 0.4 sender includes it whenever the requester's identity is not withheld. The schema does not require it in that case, because a 0.3 invitation has no such field and must remain valid. A receiver therefore does not treat a missing `requester` as an error. An invitation with neither `requester` nor `requesterIdentityWithheld: true` is the invitation of a 0.3 sender, and the bidder learns the requester as it did under 0.3, from the milestone it is invited to bid on.

## Who carries the requester

Two messages can tell a bidder who the work requester is. Which one does depends on whether the identity is withheld.

| | Identity not withheld | Identity withheld |
|---|---|---|
| `requesterIdentityWithheld` | absent or `false` | `true` |
| `requester` in the Bid Invitation | present from a 0.4 sender; absent from a 0.3 sender | absent; the schema rejects it |
| `applicant` in `scope.prospectiveRights` | may be present | absent; the schema rejects it |
| An applicant who is neither requester nor beneficiary | among the `conflictParties` | among the `conflictParties` |
| The requester as the source of an Entity Reference | allowed | not allowed; a rule for the sender, which the schema cannot check |
| [Requester Disclosed](Requester%20Disclosed.md) | not sent | sent to each bidder after its `clear` attestation, never after `conflict` |
| The bidder knows the requester | from the invitation | from the disclosure, if it attested `clear`; otherwise never |
| The bidder addresses the requester | directly, from the start | through the orchestrator until the disclosure, directly after it |

In both messages `requester` is the same full [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md). In 0.3 the first column had no field: Requester Disclosed covered the withheld case, and an invitation that withheld nothing did not name the requester at all.

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

## Worked example — first filing, requester withheld

Added in 0.4. A law firm asks its panel, for a client, to draft and file a first patent application. The firm's identity is withheld until the conflict check. The right to be created is described without an applicant; the client is among the `conflictParties`. So is the group company in whose name the application is to be filed: an applicant who is neither requester nor beneficiary is a conflict party. Neither reference names the law firm as its source: one has no source actor, the other is re-stated by the orchestrator under its own name. The sender has limited `intendedJurisdictions` to the jurisdiction this invitation covers; what else the client plans to file is not shown.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:tailspin-legal", "expectedRole": "urn:ipproto:role:bidder"}
  ],
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:f-patent-first-filing-001",
    "milestoneUri": "urn:ipproto:milestone:f1-ep-application"
  },
  "payload": {
    "requestReference": "urn:ipproto:request:req-2026-1231",
    "milestoneReference": "urn:ipproto:milestone:f1-ep-application",
    "scope": {
      "scopeText": "Draft a European patent application from the invention disclosure and file it at the EPO.",
      "milestoneCategory": "urn:ipproto:milestoneCategory:officeFiling",
      "jurisdictionCode": "EP",
      "prospectiveRights": [
        {"assetType": "patent", "workingTitle": "Rotor blade coating", "intendedJurisdictions": ["EP"]}
      ]
    },
    "lineItemTemplate": [
      "urn:ipproto:lineItem:professionalFee",
      "urn:ipproto:lineItem:officialFee"
    ],
    "bidDeadline": "2026-12-09T17:00:00Z",
    "audience": "panel",
    "conflictParties": [
      {"partyRole": "beneficiary", "party": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration"}}}},
      {"partyRole": "other", "party": {"literal": {"value": "Northwind Industries Coatings Holding GmbH", "source": {"sourceType": "other", "sourceActorUri": "urn:ipproto:actor:meridian-ip-group"}}}}
    ],
    "requesterIdentityWithheld": true
  }
}
```

## Worked example — first filing, requester not withheld

Added in 0.4. A company asks its panel for the registration of a new word mark and instructs for itself. Nothing is withheld: the invitation names the requester, and the right to be created carries its applicant. The request covers the European Union and the United States; this invitation is the one for the EUIPO, and its sender has chosen to show the full list.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:woodgrove-ip", "expectedRole": "urn:ipproto:role:bidder"}
  ],
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:d-trademark-filing-001",
    "milestoneUri": "urn:ipproto:milestone:d1-em-filing"
  },
  "payload": {
    "requestReference": "urn:ipproto:request:req-2026-1188",
    "milestoneReference": "urn:ipproto:milestone:d1-em-filing",
    "scope": {
      "scopeText": "File an application for the word mark NORTHWIND AERO at the EUIPO and see it through to registration, excluding opposition proceedings.",
      "milestoneCategory": "urn:ipproto:milestoneCategory:officeFiling",
      "jurisdictionCode": "EM",
      "prospectiveRights": [
        {
          "assetType": "trademark",
          "workingTitle": "NORTHWIND AERO",
          "intendedJurisdictions": ["EM", "US"],
          "applicant": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration", "sourceActorUri": "urn:ipproto:actor:northwind-industries"}}}
        }
      ]
    },
    "lineItemTemplate": [
      "urn:ipproto:lineItem:professionalFee",
      "urn:ipproto:lineItem:officialFee"
    ],
    "bidDeadline": "2026-11-25T17:00:00Z",
    "audience": "panel",
    "conflictParties": [
      {"partyRole": "beneficiary", "party": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration", "sourceActorUri": "urn:ipproto:actor:northwind-industries"}}}}
    ],
    "requesterIdentityWithheld": false,
    "requester": {
      "actorUri": "urn:ipproto:actor:northwind-industries",
      "actorType": "corporateIpDepartment",
      "identifiers": [
        {"scheme": "urn:ipproto:scheme:internalReference", "value": "meridian-customer-00127"}
      ],
      "legalName": "Northwind Industries SE",
      "jurisdictionCode": "DE"
    }
  }
}
```

## Behavior on receipt

The bidder checks conflicts against `conflictParties` and answers with [Conflict Check Attested](Conflict%20Check%20Attested.md). If the outcome is `clear` and it wants the work, it submits a bid before `bidDeadline`. A supplier that does not want to bid need not answer.

Where the invitation names the `requester`, the bidder addresses its messages for the work requester to that `actorUri` from the start.

While `requesterIdentityWithheld` is `true`, the bidder addresses its messages for the work requester to the orchestrator, with `expectedRole` `workRequester`. The orchestrator passes them on unchanged. After a `clear` attestation the orchestrator sends the bidder a [Requester Disclosed](Requester%20Disclosed.md) with the requester's [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md), and the bidder addresses the requester directly from then on. In 0.2 this step had no message.

## Related messages

- Follows [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md) with `requestMode` `directQuote`, `panel` or `openRfp`
- Answered by [Conflict Check Attested](Conflict%20Check%20Attested.md), then [Bid Submitted](Bid%20Submitted.md)
- [Requester Disclosed](Requester%20Disclosed.md) follows a `clear` attestation where `requesterIdentityWithheld` is `true`; where it is not, the invitation's own `requester` names the requester

## See also

- [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md) — execution mode `thirdPartyRfp`
- [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md) — *Work on a right that does not exist yet*: what a prospective right is and how the workstream picks up the asset a filing creates
- [Ratified Decisions](../../05%20-%20Decisions/Ratified%20Decisions.md) — decision 14 on execution modes, decision 29 on the procurement family
- [Exclusive Delivery and Open Services Walkthrough](../../04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md)

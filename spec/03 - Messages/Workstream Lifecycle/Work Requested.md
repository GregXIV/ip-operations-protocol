---
type: message
category: workstream-lifecycle
status: v0.4
---

# Work Requested

> A work requester places an order or asks for work — the message that opens a workstream from the customer's side.

## Purpose

Added in 0.2. States what the requester wants done, on which assets or for which rights still to be created, in which countries, for whom, and by which route it is to be sourced. Before 0.2 the protocol began with the orchestrator's [Goal Decomposition](Goal%20Decomposition.md); the customer's own request had no message.

The request does not create a workstream. The orchestrator creates it in answer.

## Producer

The actor with `workRequester` role: a corporate IP department, or a law firm acting for a client.

## Recipients

The actor with `orchestrator` role.

## Payload

### `requestReference`
Type: URI, required

Stable identifier `urn:ipproto:request:{uuid}`. Later messages refer to the request by it: the `triggeringEvent.eventReference` of the resulting [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md) the `requestReference` of a [Bid Invitation](../Procurement/Bid%20Invitation.md), and that of a [Request Declined](Request%20Declined.md).

### `goalStatement`
Type: structured, required

Same shape as in [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md): `goalText`, optional `goalCategory`, optional `goalConstraints`.

### `assetReferences`
Type: array of [Asset Reference](../../02%20-%20Foundational%20Structures/Asset%20Reference.md) URIs, conditional (at least one entry)

The existing assets the work is on. Required unless `prospectiveRights` is present. In 0.2 the field was required without exception.

### `prospectiveRights`
Type: array of structured entries, conditional (at least one entry)

Added in 0.3. The rights the work is to create or prepare where no asset exists yet: a first filing, or an application to be drafted. Required unless `assetReferences` is present. Same shape as in [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md): `assetType`, `workingTitle`, optional `intendedJurisdictions`, optional `applicant`. `resultingAssetReferences` is not used in a request.

An `applicant` who is neither the requester nor the beneficiary is a further party a supplier would act for. Where the request leads to bids, the orchestrator lists it among the `conflictParties` of every [Bid Invitation](../Procurement/Bid%20Invitation.md) (stated in 0.4.1).

A request may carry both fields, for instance a subsequent filing that claims priority from an existing application.

### `requestedWork`
Type: array of structured entries, required (at least one)

The pieces of work asked for. Each entry:
- `milestoneCategory` — URI, required, in the `urn:ipproto:milestoneCategory:` namespace of [Milestone](../../02%20-%20Foundational%20Structures/Milestone.md)
- `jurisdictionCode` — ST.3 code, optional. Omitted when the work is not tied to one jurisdiction

The orchestrator typically answers with one milestone per entry.

### `instructingCapacity`
Type: enumeration, required

- `own` — the requester asks for itself
- `onBehalf` — the requester asks for another party, named in `beneficiary`

### `beneficiary`
Type: [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md), conditional

Required when `instructingCapacity == onBehalf`. The party the work is for. Carried on into the workstream; suppliers check conflicts against it.

### `requestMode`
Type: enumeration, required

How the work is to be sourced:

- `catalogueOrder` — the requester orders at a catalogue price. Leads into goal decomposition with one binding price per milestone
- `directQuote` — one supplier is asked for a binding price
- `panel` — a few suppliers of the requester's panel are asked
- `openRfp` — every eligible supplier may bid

The last three lead into the [procurement messages](../Procurement/Bid%20Invitation.md). They are the same sequence with one, a few, or all eligible suppliers invited.

Closed enumeration.

### `offerReference`
Type: string, optional

Names the catalogue price being accepted, as an identifier of the orchestrator's catalogue. Used with `catalogueOrder`.

### `preAuthorized`
Type: boolean, optional

The requester commits in advance to the order at the named offer. See *One-step catalogue order* below. Has an effect only together with `offerReference`.

### `responseDeadline`
Type: ISO 8601 datetime, optional

By when the requester expects the orchestrator's answer.

## Worked example — catalogue order on behalf of a client

A law firm orders the validation of its client's European patent in Spain and Italy at the catalogue price, and pre-authorizes the order.

```json
{
  "originatingActor": "urn:ipproto:actor:contoso-legal",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:meridian-ip-group", "expectedRole": "urn:ipproto:role:orchestrator"}
  ],
  "userContext": {"userIdentifier": "a.reyes@contoso-legal.example", "roleAtActor": "Patent Attorney"},
  "payload": {
    "requestReference": "urn:ipproto:request:req-2026-1042",
    "goalStatement": {
      "goalText": "Validate the granted European patent in Spain and Italy.",
      "goalCategory": "urn:ipproto:goal:epPostGrantValidation"
    },
    "assetReferences": ["urn:ipproto:asset:7c4f9a82-..."],
    "requestedWork": [
      {"milestoneCategory": "urn:ipproto:milestoneCategory:officeFiling", "jurisdictionCode": "ES"},
      {"milestoneCategory": "urn:ipproto:milestoneCategory:officeFiling", "jurisdictionCode": "IT"}
    ],
    "instructingCapacity": "onBehalf",
    "beneficiary": {
      "literal": {
        "value": "Northwind Industries SE",
        "source": {"sourceType": "selfDeclaration", "sourceActorUri": "urn:ipproto:actor:contoso-legal"}
      }
    },
    "requestMode": "catalogueOrder",
    "offerReference": "meridian-catalogue-2026#ep-validation",
    "preAuthorized": true,
    "responseDeadline": "2026-10-28T17:00:00Z"
  }
}
```

## Worked example — first filing through a panel

Added in 0.3. A company asks its panel for the registration of a new word mark. No asset exists, so the request describes the right to be created.

```json
{
  "originatingActor": "urn:ipproto:actor:northwind-industries",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:meridian-ip-group", "expectedRole": "urn:ipproto:role:orchestrator"}
  ],
  "payload": {
    "requestReference": "urn:ipproto:request:req-2026-1188",
    "goalStatement": {
      "goalText": "Register the word mark NORTHWIND AERO in the European Union and the United States.",
      "goalCategory": "urn:ipproto:goal:trademarkFiling"
    },
    "prospectiveRights": [
      {
        "assetType": "trademark",
        "workingTitle": "NORTHWIND AERO",
        "intendedJurisdictions": ["EM", "US"],
        "applicant": {
          "literal": {
            "value": "Northwind Industries SE",
            "source": {"sourceType": "selfDeclaration", "sourceActorUri": "urn:ipproto:actor:northwind-industries"}
          }
        }
      }
    ],
    "requestedWork": [
      {"milestoneCategory": "urn:ipproto:milestoneCategory:officeFiling", "jurisdictionCode": "EM"},
      {"milestoneCategory": "urn:ipproto:milestoneCategory:officeFiling", "jurisdictionCode": "US"}
    ],
    "instructingCapacity": "own",
    "requestMode": "panel",
    "responseDeadline": "2026-11-20T17:00:00Z"
  }
}
```

## One-step catalogue order

Ratified on 2026-10-01 (see [Ratified Decisions](../../05%20-%20Decisions/Ratified%20Decisions.md), decision 30).

A catalogue order normally takes three steps: the request, the orchestrator's [Goal Decomposition](Goal%20Decomposition.md), and the requester's [Orchestration Committed](Orchestration%20Committed.md). When the requester already knows the price, the third step adds nothing.

**Rule.** When `preAuthorized` is `true` and the request names an `offerReference`, the orchestrator's Goal Decomposition counts as committed without a separate Orchestration Committed, provided every `agreedPrice` in it matches the offer.

- The orchestrator shows that it applied the rule by issuing the Goal Decomposition with the workstream and its milestones in status `committed`, correlated to the request.
- An `agreedPrice` matches when its `agreementReference` names the offer and its amount is the price the offer states for that piece of work.
- If a price differs, the flag has no effect. The orchestrator issues the Goal Decomposition as `proposed`, and the requester commits as usual.
- A requester that receives a `committed` Goal Decomposition whose prices do not match the offer treats it as `proposed`.

The pre-authorization covers the named offer and nothing else: not added milestones, not a changed scope, not a later price list.

## Behavior on receipt

For `catalogueOrder`, the orchestrator answers with a [Goal Decomposition](Goal%20Decomposition.md) whose envelope `correlation.correlatedToMessageUri` points at the request. The workstream's `triggeringEvent` is of type `clientRequest` with the `requestReference` as `eventReference`. Each milestone carries an `agreedPrice`.

For `directQuote`, `panel` and `openRfp`, the orchestrator creates the workstream with its milestones in execution mode `thirdPartyRfp` and sends a [Bid Invitation](../Procurement/Bid%20Invitation.md) per milestone. Since 0.4 the invitation can carry the request's `prospectiveRights` in its `scope`, without `applicant` while the requester's identity is withheld. The orchestrator may limit an entry's `intendedJurisdictions` there to the jurisdictions the invitation covers; the request and the workstream keep the full list (stated in 0.4.1). A Goal Decomposition may share the workstream with the requester but is not what commits it: the award does.

`instructingCapacity`, `beneficiary` and `prospectiveRights` are copied into the workstream unchanged. How the workstream later picks up the asset that a filing creates is described in [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md), *Work on a right that does not exist yet*.

A request the orchestrator will not serve is answered with [Request Declined](Request%20Declined.md), added in 0.3. In 0.2 there was no message for it.

## Related messages

- Answered by [Goal Decomposition](Goal%20Decomposition.md) (catalogue order) or followed by [Bid Invitation](../Procurement/Bid%20Invitation.md) (the other three modes)
- Declined with [Request Declined](Request%20Declined.md)
- [Orchestration Committed](Orchestration%20Committed.md) — the regular commitment, skipped under the one-step rule

## See also

- [Workstream](../../02%20-%20Foundational%20Structures/Workstream.md) — `instructingCapacity`, `beneficiary` and `prospectiveRights`
- [Agreed Price](../../02%20-%20Foundational%20Structures/Agreed%20Price.md)
- [Exclusive Delivery and Open Services Walkthrough](../../04%20-%20Worked%20Examples/Exclusive%20Delivery%20and%20Open%20Services%20Walkthrough.md)

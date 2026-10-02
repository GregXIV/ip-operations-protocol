---
type: message
category: workstream-lifecycle
status: v0.3
---

# Request Declined

> An orchestrator declines a [Work Requested](Work%20Requested.md), with the reason.

## Purpose

Added in 0.3. Tells the requester that the orchestrator will not act on the request, and why. In 0.2 a request the orchestrator could not serve had no answer in the message set.

A declined request creates no workstream.

## Producer

The actor with `orchestrator` role to whom the request was addressed.

## Recipients

The work requester that sent the request.

## Payload

### `requestReference`
Type: URI, required

The `requestReference` of the [Work Requested](Work%20Requested.md) being declined.

### `declineReason`
Type: structured, required

- `reasonCategory` — enumeration, required:
  - `serviceNotOffered` — the orchestrator does not offer the requested work, or not in the requested jurisdiction
  - `offerNotAvailable` — the named `offerReference` is unknown, has ended or does not cover the request
  - `requesterNotEligible` — the requester may not order from this orchestrator, for instance because no agreement is in place
  - `conflictOfInterest` — the orchestrator itself cannot act in the matter
  - `noSupplierAvailable` — no eligible supplier can be instructed or invited
  - `insufficientInformation` — the request does not say enough to act on
  - `other`
- `reasonNarrative` — optional string

Closed enumeration. An orchestrator that declines for a conflict states the category and nothing that would breach the confidence it owes to another client.

## Worked example

A law firm orders at a catalogue price that is no longer offered.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:contoso-legal", "expectedRole": "urn:ipproto:role:workRequester"}
  ],
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:wr-1203-..."},
  "payload": {
    "requestReference": "urn:ipproto:request:req-2026-1203",
    "declineReason": {
      "reasonCategory": "offerNotAvailable",
      "reasonNarrative": "The offer meridian-catalogue-2025#ep-validation ended on 31 December 2025. The current offer is meridian-catalogue-2026#ep-validation."
    }
  }
}
```

## Behavior on receipt

The request is closed. Nothing was committed and no workstream exists. A requester that still wants the work sends a new [Work Requested](Work%20Requested.md) with a new `requestReference`, to the same orchestrator with what was missing or to another one.

Request Declined answers a request for which no workstream was created. Once the orchestrator has created the workstream, because a [Goal Decomposition](Goal%20Decomposition.md) was issued or a [Bid Invitation](../Procurement/Bid%20Invitation.md) went out, the work is ended with [Workstream Abandoned](Workstream%20Abandoned.md) instead.

A decline is an answer in the sense of the request's `responseDeadline`.

## Related messages

- Answers [Work Requested](Work%20Requested.md)
- The alternatives: [Goal Decomposition](Goal%20Decomposition.md) for a catalogue order, [Bid Invitation](../Procurement/Bid%20Invitation.md) for the three procurement modes
- [Instruction Declined](../Work%20Instruction/Instruction%20Declined.md) — the same step one level down, where a provider declines an instruction

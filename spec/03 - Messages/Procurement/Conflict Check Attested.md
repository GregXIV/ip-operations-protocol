---
type: message
category: procurement
status: v0.6
---

# Conflict Check Attested

> A provider attests the outcome of its conflict check against the parties of the work it is asked to take: in a [Bid Invitation](Bid%20Invitation.md), a [Work Instruction](../Work%20Instruction/Work%20Instruction.md), a [Mandate Instruction](../Work%20Instruction/Mandate%20Instruction.md) or a [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md).

## Purpose

Added in 0.2. A supplier may only take work it is allowed to take. Before it bids, or before it accepts an instruction, it checks the beneficiary, the adverse party and every other party it would act for or against, and attests the result.

The protocol exchanges the attestation, not the method. How a firm runs its conflict check is its own professional duty and stays outside the protocol.

Until 0.6 the message answered a Bid Invitation only, and a provider instructed directly had no way to state a clear check before it accepted. Since 0.6 it attests the check for any of the four subjects below, and may keep the attestation as an internal record that it sends to nobody. The message stays in the Procurement category, where it was added; it serves both paths.

## Producer

The actor asked to take the work: the actor with `bidder` role on the milestone of a Bid Invitation, or, since 0.6, the actor with `workProvider` role to whom a Work Instruction or a Mandate Instruction is addressed, or the provider to whom a Work Requested is addressed directly.

## Recipients

The actor that asked: the orchestrator that sent the invitation, or the work requester that sent the instruction or the request.

**Internal record.** Added in 0.6. A provider may record its attestation without sending it, as part of the journal of its own actions. `addressedTo` is then an empty array. Nothing follows from such a record for anyone else, and the protocol does not require that it be shown to the requester.

## Payload

### `subjectReference`
Type: structured, conditional

Added in 0.6. What the attestation is about:
- `subjectType` — enumeration, required: `bidInvitation`, `workInstruction`, `mandateInstruction`, `request`
- `reference` — URI, required: the `messageUri` of the invitation or the instruction, or the `requestReference` of the request

Required unless `invitationReference` is present.

### `invitationReference`
Type: messageUri, conditional

The [Bid Invitation](Bid%20Invitation.md) the attestation answers. Required until 0.6; since 0.6 required unless `subjectReference` is present (decision 73). A 0.6 sender attesting for an invitation gives `subjectReference` with `subjectType` `bidInvitation` and may give `invitationReference` as well, for receivers of 0.5; where both are present they name the same invitation.

### `checkedParties`
Type: array, required (at least one)

The parties the provider checked. Normally the `conflictParties` of the subject, as the provider resolved them, and the beneficiary where one is named. A provider cannot attest without knowing whom it checks: identity comes before attestation.

Each entry is either an [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md), as until 0.6, or, since 0.6, a structured entry:
- `partyRole` — the role of the party in the work, with the values of `conflictParties` in [Bid Invitation](Bid%20Invitation.md)
- `party` — [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md)

A 0.6 sender uses the structured entry.

### `checkedAt`
Type: ISO 8601 datetime, optional

Added in 0.6. When the check was run. A check goes stale as the provider takes on new clients; the receiver may ask for a new one where much time has passed.

### `outcome`
Type: enumeration, required

- `clear` — no conflict; the provider may bid or accept
- `clearedAfterReview` — added in 0.6: the check found a possible conflict, and a person responsible for conflicts at the provider reviewed it and released the work. It has the effect of `clear`
- `conflict` — a conflict exists; the provider will not bid or accept

Closed enumeration. Wherever this specification speaks of a `clear` attestation, `clearedAfterReview` counts as `clear`. Neither `conflict` nor `clearedAfterReview` carries any detail. The provider owes its other clients confidence and does not say whom a hit concerned, or why it was released.

### `attestedBy`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), required

The person at the provider who attests. Required here, unlike the envelope's optional `userContext`: an attestation is a professional statement and needs a name. For `clearedAfterReview` it is the person who released the work.

## Worked example — before a bid

```json
{
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:bi-001-..."},
  "payload": {
    "subjectReference": {"subjectType": "bidInvitation", "reference": "urn:ipproto:message:bi-001-..."},
    "invitationReference": "urn:ipproto:message:bi-001-...",
    "checkedParties": [
      {"partyRole": "beneficiary", "party": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration"}}}},
      {"partyRole": "adverseParty", "party": {"literal": {"value": "Wingtip Components GmbH", "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo"}}}}
    ],
    "checkedAt": "2026-10-27T09:12:00Z",
    "outcome": "clear",
    "attestedBy": {"userIdentifier": "conflicts@woodgrove-ip.example", "roleAtActor": "Conflicts Partner"}
  }
}
```

## Worked example — before accepting a mandate, kept as an internal record

```json
{
  "originatingActor": "urn:ipproto:actor:woodgrove-ip",
  "addressedTo": [],
  "confidentiality": {"level": "privileged"},
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:mi-001-...", "workstreamUri": "urn:ipproto:workstream:opp-ep9900001-001"},
  "payload": {
    "subjectReference": {"subjectType": "mandateInstruction", "reference": "urn:ipproto:message:mi-001-..."},
    "checkedParties": [
      {"partyRole": "beneficiary", "party": {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration"}}}},
      {"partyRole": "adverseParty", "party": {"literal": {"value": "Wingtip Components GmbH", "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo"}}}}
    ],
    "checkedAt": "2026-11-02T10:05:00Z",
    "outcome": "clearedAfterReview",
    "attestedBy": {"userIdentifier": "conflicts@woodgrove-ip.example", "roleAtActor": "Conflicts Partner"}
  }
}
```

## Behavior on receipt

**For a Bid Invitation.** On `clear` or `clearedAfterReview`, the orchestrator admits the bidder to the bidding. If the requester's identity was withheld, the orchestrator now discloses it to this bidder with [Requester Disclosed](Requester%20Disclosed.md) (added in 0.3). If it was not, nothing follows here: since 0.4 the invitation already named the requester in its `requester` field. On `conflict`, the bidder is out of the sequence for this milestone and its `bidder` role declaration ends. No further message is owed, and a withheld requester identity stays withheld from this bidder. A bid from a bidder that has not attested `clear` or `clearedAfterReview` for the invitation is not considered.

**For an instruction or a request.** The attestation tells the requester that the provider checked before it answers. It does not answer the instruction: the provider still accepts with [Instruction Accepted](../Work%20Instruction/Instruction%20Accepted.md) or declines with [Instruction Declined](../Work%20Instruction/Instruction%20Declined.md), reason `conflictOfInterest`, or declines a request with [Request Declined](../Workstream%20Lifecycle/Request%20Declined.md). In a direct engagement the client is known to the provider from the start, so nothing like [Requester Disclosed](Requester%20Disclosed.md) follows.

## Related messages

- Answers [Bid Invitation](Bid%20Invitation.md); since 0.6 also precedes the answer to [Work Instruction](../Work%20Instruction/Work%20Instruction.md), [Mandate Instruction](../Work%20Instruction/Mandate%20Instruction.md) and [Work Requested](../Workstream%20Lifecycle/Work%20Requested.md)
- Followed by [Requester Disclosed](Requester%20Disclosed.md) where the subject is a Bid Invitation, the outcome is `clear` or `clearedAfterReview`, and the requester's identity was withheld
- Precedes [Bid Submitted](Bid%20Submitted.md) or [Instruction Accepted](../Work%20Instruction/Instruction%20Accepted.md)

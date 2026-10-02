---
type: message
category: procurement
status: v0.4
---

# Conflict Check Attested

> A bidder attests the outcome of its conflict check against the parties named in a [Bid Invitation](Bid%20Invitation.md).

## Purpose

Added in 0.2. A supplier may only take work it is allowed to take. Before it bids, it checks the beneficiary and the adverse party against its own clients and attests the result.

The protocol exchanges the attestation, not the method. How a firm runs its conflict check is its own professional duty and stays outside the protocol.

## Producer

The actor with `bidder` role on the milestone.

## Recipients

The orchestrator that sent the invitation.

## Payload

### `invitationReference`
Type: messageUri, required

The [Bid Invitation](Bid%20Invitation.md) the attestation answers.

### `checkedParties`
Type: array of [Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md) structures, required (at least one)

The parties the bidder checked. Normally the invitation's `conflictParties`, as the bidder resolved them. A bidder cannot attest without knowing whom it checks: identity comes before attestation.

### `outcome`
Type: enumeration, required

- `clear` — no conflict; the bidder may bid
- `conflict` — a conflict exists; the bidder will not bid

Closed enumeration. A `conflict` outcome carries no detail. The bidder owes its other clients confidence and does not say whom the conflict is with.

### `attestedBy`
Type: [User Context](../../02%20-%20Foundational%20Structures/User%20Context.md), required

The person at the bidder who attests. Required here, unlike the envelope's optional `userContext`: an attestation is a professional statement and needs a name.

## Worked example

```json
{
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:bi-001-..."},
  "payload": {
    "invitationReference": "urn:ipproto:message:bi-001-...",
    "checkedParties": [
      {"literal": {"value": "Northwind Industries SE", "source": {"sourceType": "selfDeclaration"}}},
      {"literal": {"value": "Wingtip Components GmbH", "source": {"sourceType": "register", "sourceActorUri": "urn:ipproto:actor:epo"}}}
    ],
    "outcome": "clear",
    "attestedBy": {"userIdentifier": "conflicts@woodgrove-ip.example", "roleAtActor": "Conflicts Partner"}
  }
}
```

## Behavior on receipt

On `clear`, the orchestrator admits the bidder to the bidding. If the requester's identity was withheld, the orchestrator now discloses it to this bidder with [Requester Disclosed](Requester%20Disclosed.md) (added in 0.3). If it was not, nothing follows here: since 0.4 the invitation already named the requester in its `requester` field.

On `conflict`, the bidder is out of the sequence for this milestone and its `bidder` role declaration ends. No further message is owed, and a withheld requester identity stays withheld from this bidder.

A bid from a bidder that has not attested `clear` for the invitation is not considered.

## Related messages

- Answers [Bid Invitation](Bid%20Invitation.md)
- Followed by [Requester Disclosed](Requester%20Disclosed.md) where the outcome is `clear` and the requester's identity was withheld
- Precedes [Bid Submitted](Bid%20Submitted.md)

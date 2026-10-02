---
type: message
category: procurement
status: v0.4
---

# Requester Disclosed

> An orchestrator discloses the work requester to a bidder that has attested a clear conflict check.

## Purpose

Added in 0.3. A [Bid Invitation](Bid%20Invitation.md) may withhold the requester's identity, typically that of a law firm instructing for a client (`requesterIdentityWithheld`). 0.2 said that the identity follows once the bidder has attested `clear`, but had no message for it. This is that message.

It is the message for the withheld case, and only for that case. Where nothing is withheld, the invitation itself names the requester in its `requester` field, added in 0.4.

## Producer

The orchestrator that sent the invitation.

## Recipients

The one bidder whose attestation the message follows. Each bidder receives its own disclosure; a disclosure to one bidder tells no other bidder anything.

## Payload

### `invitationReference`
Type: messageUri, required

The [Bid Invitation](Bid%20Invitation.md) whose requester is disclosed.

### `requester`
Type: [Actor Reference](../../02%20-%20Foundational%20Structures/Actor%20Reference.md), required

The work requester, as the full structure and not only its URI: the bidder may never have dealt with this actor. Since 0.4 a [Bid Invitation](Bid%20Invitation.md) that withholds nothing carries the same structure under the same name.

The disclosure carries the requester and nothing else. An applicant who is a third party needs no disclosure: it was among the invitation's `conflictParties` from the start (stated in 0.4.1).

## When it is sent

1. **Only when the identity was withheld.** The invitation carried `requesterIdentityWithheld: true`, and therefore no `requester`. An invitation that withholds nothing needs no disclosure, and the message is not sent: since 0.4 such an invitation names the requester itself.
2. **Only after a `clear` attestation.** It follows that bidder's [Conflict Check Attested](Conflict%20Check%20Attested.md) with outcome `clear` for the invitation. The envelope's `correlation.correlatedToMessageUri` names the attestation.
3. **Never after `conflict`.** A bidder that attested `conflict` leaves the sequence without learning who the requester is.

## The requester in the invitation and in the disclosure

| | Identity not withheld | Identity withheld |
|---|---|---|
| `requester` in the [Bid Invitation](Bid%20Invitation.md) | present from a 0.4 sender; absent from a 0.3 sender | absent; the schema rejects it |
| Requester Disclosed | not sent | sent to each bidder after its `clear` attestation, never after `conflict` |
| The bidder knows the requester | from the invitation | from this message |

The full comparison, with the fields of the invitation, is on the [Bid Invitation](Bid%20Invitation.md) page under *Who carries the requester*.

## Worked example

A law firm asked for bids on behalf of its client. One of the invited firms has attested `clear` and now learns who instructs.

```json
{
  "originatingActor": "urn:ipproto:actor:meridian-ip-group",
  "addressedTo": [
    {"actorUri": "urn:ipproto:actor:tailspin-legal", "expectedRole": "urn:ipproto:role:bidder"}
  ],
  "correlation": {
    "workstreamUri": "urn:ipproto:workstream:e-fto-opinion-001",
    "milestoneUri": "urn:ipproto:milestone:e1-fto-opinion",
    "correlatedToMessageUri": "urn:ipproto:message:cca-e1-..."
  },
  "payload": {
    "invitationReference": "urn:ipproto:message:bi-e1-...",
    "requester": {
      "actorUri": "urn:ipproto:actor:contoso-legal",
      "actorType": "externalCounsel",
      "identifiers": [
        {"scheme": "urn:ipproto:scheme:internalReference", "value": "meridian-customer-00418"}
      ],
      "legalName": "Contoso Legal LLP",
      "jurisdictionCode": "GB"
    }
  }
}
```

## Behavior on receipt

The bidder now knows whom it would work for. From here on it addresses its messages for the work requester to the requester's `actorUri`. Until the disclosure it addressed them to the orchestrator with `expectedRole` `workRequester`, as [Bid Invitation](Bid%20Invitation.md) describes.

A bidder that, knowing the requester, cannot or does not want to act does not bid; no message is owed. If it has already bid, it withdraws with [Bid Withdrawn](Bid%20Withdrawn.md).

## Related messages

- Follows [Conflict Check Attested](Conflict%20Check%20Attested.md) with outcome `clear`
- Refers to a [Bid Invitation](Bid%20Invitation.md) with `requesterIdentityWithheld: true`
- Precedes [Bid Submitted](Bid%20Submitted.md)

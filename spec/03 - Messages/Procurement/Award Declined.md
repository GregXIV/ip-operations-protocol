---
type: message
category: procurement
status: v0.2
---

# Award Declined

> A bidder declines a proposed award, with the reason.

## Purpose

Added in 0.2. Lets the requester move to the next bid at once instead of waiting for the confirmation deadline to pass.

## Producer

The bidder named in the [Award Proposed](Award%20Proposed.md).

## Recipients

The work requester, and the orchestrator.

## Payload

### `awardReference`
Type: messageUri, required

The [Award Proposed](Award%20Proposed.md) being declined.

### `declineReason`
Type: structured, required

- `reasonCategory` — enumeration, required: `conflictOfInterest`, `noCapacity`, `bidExpired`, `scopeChanged`, `other`
- `reasonNarrative` — optional string

## Worked example

```json
{
  "correlation": {"correlatedToMessageUri": "urn:ipproto:message:ap-001-..."},
  "payload": {
    "awardReference": "urn:ipproto:message:ap-001-...",
    "declineReason": {
      "reasonCategory": "conflictOfInterest",
      "reasonNarrative": "A conflict arose after the bid was submitted."
    }
  }
}
```

## Behavior on receipt

The proposal lapses and the milestone stays uncommitted. The requester may send [Award Proposed](Award%20Proposed.md) to the next ranked bid, with `rank`.

The protocol records the decline. Whether a bidder may decline an award on a bid that is still binding without consequence is for the terms under which it was invited.

## Related messages

- Declines [Award Proposed](Award%20Proposed.md)
- The alternative: [Award Confirmed](Award%20Confirmed.md)

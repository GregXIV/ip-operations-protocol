---
type: message
category: bootstrap
status: v0.1
---

# Asset Match Response

> Answer to an [Asset Match Inquiry](Asset%20Match%20Inquiry.md).

## Purpose

Sent by the actor that received the inquiry. Carries the response, optional enrichment data, and any disagreements with the inquirer's resolution.

## Producer

The actor that received the [Asset Match Inquiry](Asset%20Match%20Inquiry.md).

## Recipients

The original inquirer, plus other actors that should know the outcome (typically those addressed in the inquiry).

## Payload

### `inquiryReference`
Type: messageUri, required

The inquiry being responded to.

### `responseOutcome`
Type: enumeration, required

- `confirmed` — recognized and confirmed
- `confirmedWithEnrichment` — confirmed plus additional data over corporate-authoritative sections
- `denied` — not recognized or refuses to confirm
- `unknown` — cannot determine without further investigation
- `disputedResolution` — recognized but disagrees with inquirer's entity resolution

### `outcomeDetails`
Type: [Outcome Details](../../02%20-%20Foundational%20Structures/Outcome%20Details.md), required

Per outcome type:
- `confirmed` — empty or narrative
- `confirmedWithEnrichment` — `enrichmentAssertions` array of [Data Assertion](../../02%20-%20Foundational%20Structures/Data%20Assertion.md)
- `denied` — `denialReason` (`notOwned`, `recentlyAssigned`, `abandoned`, `outOfScope`, `unknownAsset`, `authorityRefused`), narrative
- `unknown` — `expectedResolutionWindow`, optional `routedTo`
- `disputedResolution` — `competingResolution` ([Entity Reference](../../02%20-%20Foundational%20Structures/Entity%20Reference.md) from receiver's view), automatically triggers [Identity Resolution Dispute](../Disputes/Identity%20Resolution%20Dispute.md)

### `additionalAuthorityClaims`
Type: array of [Authority Claim](../../02%20-%20Foundational%20Structures/Authority%20Claim.md) structures, optional

New claims the receiver registers. For `confirmedWithEnrichment`, typically an `internalDeclaration` claim over enriched sections plus a `contractualService` claim authorizing the inquirer's operation.

## Worked example — confirmedWithEnrichment

```json
{
  "userContext": { /* corporate user */ },
  "payload": {
    "inquiryReference": "urn:ipproto:message:c2e8f1a3-...",
    "responseOutcome": "confirmedWithEnrichment",
    "outcomeDetails": {
      "outcomeType": "confirmedWithEnrichment",
      "details": {
        "enrichmentAssertions": [
          /* Data Assertion for /internalReferences/matterReference */,
          /* Data Assertion for /internalReferences/responsiblePerson */,
          /* Data Assertion for /internalReferences/authorizedBudget */
        ]
      }
    },
    "additionalAuthorityClaims": [
      /* Corporate claim over /internalReferences */,
      /* Corporate claim authorizing Meridian IP Group over /serviceEngagements */
    ]
  }
}
```

## Worked example — denied

```json
{
  "payload": {
    "inquiryReference": "urn:ipproto:message:c2e8f1a3-...",
    "responseOutcome": "denied",
    "outcomeDetails": {
      "outcomeType": "denied",
      "details": {
        "denialReason": "recentlyAssigned",
        "narrative": "Asset assigned to Northwind Industries Coatings Holding GmbH on 2026-03-15. Assignment recordal pending."
      }
    }
  }
}
```

## Behavior on receipt

For `confirmed` or `confirmedWithEnrichment`, the inquirer's workstream proceeds. The orchestrator publishes the [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md).

For `denied`, the orchestrator routes to a different actor (where indicated) or closes the matter. May trigger [Asset Authority Dispute](../Disputes/Asset%20Authority%20Dispute.md).

For `disputedResolution`, [Identity Resolution Dispute](../Disputes/Identity%20Resolution%20Dispute.md) fires automatically.

For `unknown`, the inquirer waits for the `expectedResolutionWindow` to expire before treating as `denied`.

## Related messages

- Answers [Asset Match Inquiry](Asset%20Match%20Inquiry.md)
- May surface [Asset Authority Dispute](../Disputes/Asset%20Authority%20Dispute.md) or [Identity Resolution Dispute](../Disputes/Identity%20Resolution%20Dispute.md)
- Enables [Goal Decomposition](../Workstream%20Lifecycle/Goal%20Decomposition.md) when confirmed

---
type: foundational
status: v0.1
---

# Outcome Details

> Common sub-structure for messages that carry an enumerated outcome with type-specific details.

Extracted during consolidation. Used in [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md), [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md), [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md), [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md), and the dispute messages — every message that has an outcome enumeration plus per-outcome detail.

## Structure

### `outcomeType`
Type: enumeration, required

The outcome enumeration value. The valid values are message-specific and defined in each message specification.

### `details`
Type: structured, required

The outcome-specific detail. Sub-structure varies by outcomeType.

## Worked example — denial outcome from [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md)

```json
{
  "outcomeType": "denied",
  "details": {
    "denialReason": "recentlyAssigned",
    "narrative": "Asset was assigned to Northwind Industries Coatings Holding GmbH on 2026-03-15."
  }
}
```

## Worked example — partial outcome from [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)

```json
{
  "outcomeType": "partiallyPerformed",
  "details": {
    "completedAspects": [
      {"jurisdiction": "DE", "status": "filed"},
      {"jurisdiction": "FR", "status": "filed"}
    ],
    "incompleteAspects": [
      {"jurisdiction": "GB", "status": "filingFailed"}
    ]
  }
}
```

## Behavior

The structure is uniform across all messages that use it. The `details` field is intentionally free-form within the structure — the per-outcome shape is defined in the message specification rather than the foundational, since outcome details are message-specific.

## See also

The messages that use OutcomeDetails:
- [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md)
- [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md)
- [Payment Executed](../03%20-%20Messages/Payments/Payment%20Executed.md)
- [Milestone Failed](../03%20-%20Messages/Milestone%20Lifecycle/Milestone%20Failed.md)
- [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md)

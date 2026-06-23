---
type: foundational
status: v0.1
---

# User Context

> Identifies the human at an actor organization who originated a message or made a decision.

Used for compliance, audit, and routing. Optional in most messages but strongly recommended for messages that bind the actor to material decisions or costs.

## Structure

### `userIdentifier`
Type: string, required when User Context is included

Identifier of the user within their organization. Typically an email address, employee ID, or LDAP identifier. Form is actor-specific; the protocol does not constrain it.

### `displayLabel`
Type: string, optional

Human-readable name for UI rendering. `K. Müller`, `Dr. Klaus Müller`.

### `roleAtActor`
Type: string, optional

The user's role at their organization. `Senior IP Counsel`, `Treasury Operations`, `Validation Analyst`. Free-form description; not enumerated by the protocol.

### `automatedAgentIndicator`
Type: boolean, optional

When `true`, indicates the message was produced by an automated system rather than a human. Default `false` (or absent, treated as `false`).

For agentic operation — AI agents acting under delegated authority — this field surfaces the automation explicitly. Receivers may apply different policies to automated vs. human-originated messages (e.g., requiring human confirmation for high-value authorizations).

## Worked example

```json
{
  "userIdentifier": "counsel@northwind.example",
  "displayLabel": "K. Müller",
  "roleAtActor": "Senior IP Counsel",
  "automatedAgentIndicator": false
}
```

## When to include

UserContext is **strongly recommended** in:

- [Orchestration Committed](../03%20-%20Messages/Workstream%20Lifecycle/Orchestration%20Committed.md) — the user authorizing the workstream
- [Payment Authorized](../03%20-%20Messages/Payments/Payment%20Authorized.md) — the user authorizing the payment
- [Client Action Completed](../03%20-%20Messages/Prepared-Action%20Handoff/Client%20Action%20Completed.md) — the user who performed the external action
- [Deliverable Acknowledged](../03%20-%20Messages/Deliverable%20Handoff/Deliverable%20Acknowledged.md) — the user who reviewed and acknowledged
- [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md) — the user who resolved the dispute

UserContext is **optional** elsewhere. Pure-system messages (register events, automated finding production, status pings) often have no meaningful user context.

## Open question

Whether to require UserContext for high-authority messages is one of the [Open Questions for Consortium](../05%20-%20Decisions/Open%20Questions%20for%20Consortium.md). The current default is "optional with strong recommendation"; the consortium may tighten this to "required" for messages that bind actors to material commitments.

## See also

- [Actor Reference](Actor%20Reference.md) — the organization the user belongs to
- [Common Envelope](Common%20Envelope.md) — where userContext appears in every message

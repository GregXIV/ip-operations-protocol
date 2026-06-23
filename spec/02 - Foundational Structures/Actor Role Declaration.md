---
type: foundational
status: v0.1
---

# Actor Role Declaration

> Declares the role under which an actor is performing within a specific scope.

An actor can act under multiple roles simultaneously across different scopes. Meridian IP Group is `workProvider` for one workstream and `paymentAgent` for another and `subscriptionContractHolder` for a third. The role declaration ties an actor + role + scope into a single referenceable structure.

## Structure

### `roleDeclarationUri`
Type: URI, required

Stable identifier of the form `urn:ipproto:roleDeclaration:{uuid}`.

### `actorUri`
Type: [Actor Reference](Actor%20Reference.md) URI, required

Which actor is acting under this role.

### `role`
Type: URI, required

The role itself, in `urn:ipproto:role:` namespace. Standard roles:

- `workProvider` — performs operational work in a workstream
- `workRequester` — requests work be performed
- `decisionAuthority` — has authority to authorize work
- `assetOwner` — owns the asset
- `payor` — pays for work
- `paymentAgent` — executes payments on behalf of payor
- `clientExecutor` — performs external action on prepared artifacts
- `deliverableRecipient` — receives a deliverable for review
- `subscriptionProvider` — provides a subscription service
- `subscriptionContractHolder` — holds the subscription contract
- `subscriptionOperator` — operates the subscription (under delegation)
- `subscriber` — subscribes to a service
- `registerSourceOfTruth` — the register itself (the office)
- `registerObserver` — observes a register on behalf of others
- `registerObserverDelegated` — observer authorized to publish events on the register's authority
- `identityResolver` — resolves identity disputes
- `protocolPrimitive` — the protocol's own internal authority

Custom roles allowed through namespaced URNs.

### `scope`
Type: structured, required

What the role applies to:
- `scopeType` — enumeration: `asset`, `workstream`, `milestone`, `subscription`, `global`
- `scopeUri` — URI of the scoped entity
- `effectiveFrom` — ISO 8601 datetime
- `effectiveTo` — optional ISO 8601 datetime

### `delegationChain`
Type: array, optional

When the role is delegated. Each entry: `delegatingActorUri`, `delegatedRoleUri`, `delegationBasis` (URN), `delegationReference` (optional, contractual reference).

The Meridian IP Group & Associates pattern — D&A operates under Meridian IP Group's contract — is modeled here. The role declaration for D&A's `subscriptionOperator` role carries a delegation chain showing Meridian IP Group as the upstream contract holder.

## Worked example

```json
{
  "roleDeclarationUri": "urn:ipproto:roleDeclaration:da-opp-watch-operator-...",
  "actorUri": "urn:ipproto:actor:meridian-associates",
  "role": "urn:ipproto:role:subscriptionOperator",
  "scope": {
    "scopeType": "subscription",
    "scopeUri": "urn:ipproto:subscription:opposition-watch-001",
    "effectiveFrom": "2026-08-02T15:30:00Z"
  },
  "delegationChain": [
    {
      "delegatingActorUri": "urn:ipproto:actor:meridian-ip-group",
      "delegatedRoleUri": "urn:ipproto:role:subscriptionContractHolder",
      "delegationBasis": "urn:ipproto:basis:partnerNetworkAgreement",
      "delegationReference": "DM-DA-PNA-2024"
    }
  ]
}
```

## Behavior

Receivers reading a message check the originator's role declaration to verify the originator is acting within the declared scope and time window. Messages produced under expired or out-of-scope role declarations are rejected as protocol violations.

The delegation chain is informational — the protocol does not validate that delegations are mutually consistent across actors (this is a contract-management concern), but receivers can use the chain for compliance and audit.

## See also

- [Actor Reference](Actor%20Reference.md) — the actor identified in `actorUri`
- [Authority Claim](Authority%20Claim.md) — claims often reference role declarations as their basis
- [Service Subscription Started](../03%20-%20Messages/Subscriptions/Service%20Subscription%20Started.md) for delegation patterns

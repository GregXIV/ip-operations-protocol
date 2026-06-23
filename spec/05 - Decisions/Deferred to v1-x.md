---
type: decisions
status: v0.1
---

# Deferred to v1.x

> Features and scope deliberately deferred from v0.1.

These are not omissions — they are deliberate scope limitations to keep v0.1 tractable for implementation and consortium ratification. Each is in scope for the protocol's eventual maturity but not yet.

## Authority and claims

- **Joint authority claims.** Multiple actors holding joint authority over the same section. v0.1 supports single-claim-per-section; joint claims deferred.
- **Hierarchical role taxonomies.** v0.1 has flat enumerated roles; hierarchical structures deferred.
- **Multi-claim assertions.** Assertions citing multiple authority claims simultaneously deferred.

## Identity

- **Cross-actor identity exchange standardization.** Beyond the optional `crossActorReferences` field, no standardized exchange mechanism. Deferred.
- **Identity verification levels with protocol-assigned semantics.** v0.1 has confidenceLevel as informational; verification semantics deferred.

## Documents

- **Document storage broker.** Mandated content distribution mechanism deferred. Storage remains federated.
- **Versioned schema registry for structured deliverables.** v0.1 supports `schemaIdentifier`; registry mechanics deferred.

## Workstreams

- **Optimistic and manual chain execution policies.** v0.1 supports `strict` only. Other policies deferred.
- **In-place subscription modification.** v0.1 uses terminate-and-restart. Modification message deferred.
- **Built-in retry message.** v0.1 retries through new Goal Decomposition. Deferred.

## Disputes

- **Auto-resolution dispute message.** v0.1 uses standard [Dispute Resolution Decision](../03%20-%20Messages/Disputes/Dispute%20Resolution%20Decision.md) for all resolutions including auto-detected. Deferred.
- **Arbitration and third-party-resolver mechanism.** Out of v0.1 scope. Consortium members handle through underlying contracts.

## Asset matching

- **`partiallyConfirmed` outcome in [Asset Match Response](../03%20-%20Messages/Bootstrap%20and%20Discovery/Asset%20Match%20Response.md).** v0.1 binary on confirmation per inquiry item. Partial confirmation deferred.

## Subscriptions

- **Standardized hybrid cadence configurations.** v0.1 leaves hybrid loosely structured. Standardization deferred.
- **Subscription modification message.** Use terminate-and-restart in v0.1. Deferred.

## Sync

- **Sync at actor-introduction time.** When a new actor joins an existing workstream, sync of prior state is out of v0.1 scope — handled by transport layer (the v1.6 Sync Protocol).
- **Replay protocol for recovery from message loss.** Out of v0.1; transport-layer concern.

## Governance

- **Custom extension registry mechanics.** Lightweight registry recommended at consortium kickoff but not yet specified in protocol terms.
- **Versioning and migration protocol.** v0.1 → v1.0 migration approach deferred to consortium working draft.

## See also

- [Ratified Decisions](Ratified%20Decisions.md)
- [Open Questions for Consortium](Open%20Questions%20for%20Consortium.md)

# Implementations

Implementations that have reported their conformance, each with a report in the form of the
[Implementation Report Template](spec/06%20-%20Implementations/Implementation%20Report%20Template.md).
A report is the implementer's statement with its evidence; the maintainer records it and does
not certify it. To add one, use the *Implementation report* issue form or open a pull request.

| Implementation | Implementer | Protocol version | Profiles | Report |
|---|---|---|---|---|
| Reference resolver (`resolver.guardianlabs.io`) | the maintainer | v0.8.0 | Asset identification: representational (partly met); resolving (not claimed) | [below](#reference-resolver) |

## Reference resolver

| Field | Content |
|---|---|
| Implementation | The reference resolver of this project, at `https://resolver.guardianlabs.io`. The source is not public. |
| Implementer | the maintainer |
| Protocol version | `v0.8.0`: the resolver validates every emission against `@ipproto/schemas` 0.8.0 before it answers |
| Profiles | Asset identification and resolution, representational and resolving ([Asset Identification and Resolution](spec/02%20-%20Foundational%20Structures/Asset%20Identification%20and%20Resolution.md), section 6) |
| Date | 2026-11-19 |
| Contact | the repository's issues |

It turns observed office identifiers into an Asset Reference with its Resolution Provenance
(`resolvedAsset`), reading patent families through one rate-limited, read-only gateway.

| Point | Result | Evidence | Note |
|---|---|---|---|
| 1 | met | resolution probe: stored identifiers resolve to the same `assetUri` across calls, restarts and redeploys; since 2026-11-15 a store key carries the reference class, office, number without kind code and asset type, so an application number and a publication number cannot meet on one `assetUri`, and no binding is ever remapped | |
| 2 | met | schema: every emission is validated against `resolvedAsset` before it is returned, and one that fails is an error, never an answer; message trace: an observed number is copied into `identifiers[].value` unchanged, and any normalization happens only in the lookup | |
| 3 | not met | message trace: no identifier is ever flagged as superseded | The Asset Reference has no field that flags a superseded identifier; adding one is a MINOR change, so this point cannot be met in 0.8 or 0.9 |
| 4 | met | schema: `confidenceLevel` and `resolutionMethod` are required in every `resolvedAsset`, and every emission is validated | The rubric that derives them is documented with the resolver |
| 5 | partly met | message trace: when the numbers of one asset are bound to different `assetUri`s, the resolver answers with all of them and remaps nothing | It emits no Asset Authority Dispute, so the dispute path is detected but not taken |

**Result.** Points 1, 2 and 4 are met; 3 is not met and 5 is partly met. The resolver
therefore conforms to neither level in full and claims neither: the representational level
needs point 3, the resolving level points 3 and 5.

**Gaps and questions.** Point 3 waits for a field in the protocol (an identifier status and
the identifier that supersedes it). Point 5 waits for the resolver to emit an Asset Authority
Dispute. The report is redone when the resolver moves to a newer protocol version.

# Versioning and Compatibility

This document defines how the IP Operations Protocol is versioned, how versions
relate to the `protocolVersion` carried in every message, and how history is kept
understandable over time.

## Version scheme

The protocol uses **semantic versioning adapted for a data/message standard**:
`MAJOR.MINOR.PATCH`.

| Bump | Meaning | Examples |
|---|---|---|
| **MAJOR** | A change a conforming receiver built for the previous version could **misinterpret**. Breaking. | Removing or renaming a field; changing a field's type or required-ness in a way that breaks parsing; changing the semantics of an existing message. |
| **MINOR** | A **backward-compatible addition**. Old receivers keep working. | A new message type; a new optional field; a new enum/vocabulary value; a new namespaced extension. |
| **PATCH** | Editorial only. No behavioral change. | Typo fixes, clarified prose, non-normative examples, formatting. |

`0.x` is pre-1.0: minor-looking changes may still break, because the surface is
still settling. v1.0 is the first version with the compatibility guarantees below
fully in force.

## The `protocolVersion` field

Every message carries `protocolVersion` (see Common Envelope). It states the
version the message conforms to.

**Compatibility rule (generalized from the spec's graceful-degradation principle):**

1. Receivers interoperate with any message sharing their **MAJOR** version.
2. Within the same MAJOR, a receiver encountering an **unknown MINOR addition**
   (a field, message type, or vocabulary value it does not recognize) **degrades
   gracefully to "unknown"** rather than failing — exactly as it already does for
   unknown URN-namespaced vocabulary values.
3. A **MAJOR mismatch** is a hard boundary. A receiver should not attempt to
   process a message from a different MAJOR version; it surfaces the mismatch
   rather than guessing.

## Releases and history

- **Every released version is an annotated Git tag** (`v0.1.0`) and a **GitHub
  Release** with human-readable notes. Releases are the canonical, immutable
  history.
- **Released tags are never moved or rewritten.** Implementers build against them.
  A correction to a released version is a new PATCH release, not an edit to the old tag.
- **`CHANGELOG.md`** follows the *Keep a Changelog* convention (Added / Changed /
  Deprecated / Removed / Fixed per version) so the history reads cleanly.
- **Decision records** live under `spec/05 - Decisions/` (Ratified / Open /
  Deferred). These carry the *why* behind changes — the most valuable history to
  preserve. Entries are dated; as the set grows, prefer one decision per file.
- **Permanent citable snapshots:** each GitHub Release is intended to mint a
  Zenodo DOI, giving every version an immutable, citable archive record.

## Versioned, stable URLs

When the spec and schemas are hosted:

- The rendered spec and the schemas are available at **version-pinned paths**
  (e.g. `…/v0.1/…`) that never change, plus a `…/latest/` pointer to the newest
  release.
- **Each JSON Schema's `$id` embeds its version and is never reused across
  versions.** Reusing a `$id` across versions causes validators to cache the wrong
  shape. The version is part of the schema's identity.

## Deprecation

- Elements are **deprecated, not deleted.** A deprecated element is marked as such
  and remains valid within its MAJOR line.
- Removal happens only across a **MAJOR** boundary, after a deprecation period.
- This mirrors the protocol's existing append-mostly treatment of identifiers:
  superseded values are flagged, not erased.

## Discoverability (related)

For machine resolution of the protocol's `urn:ipproto:` handles, a **stable,
versioned schema/resolution endpoint** is the protocol-native discovery mechanism:
a predictable URL mapping `{version, messageType}` to its JSON Schema. This is
designed alongside the schemas and is the resource that emerging agent-discovery
conventions (e.g. a `/.well-known/` catalog) would later point to. See the project
board for status.

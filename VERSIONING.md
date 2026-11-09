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
| **MINOR** | A **backward-compatible addition**. Old receivers keep working, provided they degrade on what they do not know (rule 2 below). | A new message type; a new optional field; a new enum/vocabulary value; a new namespaced extension. |
| **PATCH** | Editorial only. No behavioral change, for receivers or for senders. | Typo fixes, clarified prose, non-normative examples, formatting. |

`0.x` is pre-1.0: minor-looking changes may still break, because the surface is
still settling. v1.0 is the first version with the compatibility guarantees below
fully in force. A pre-1.0 MINOR may relax or tighten a rule where its scope needs
it; each such change is recorded as a ratified decision and named in the
changelog's *Compatibility* section (0.3 and 0.6 did so).

**No normative change in a PATCH.** A rule that changes what a sender or a
receiver does is released as a MINOR, even when no schema changes. Version 0.4.1
broke this: it added three sender rules for the Bid Invitation as a patch, and
its changelog says so. That is recorded as a mistake and will not be repeated
(Ratified Decision 80).

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

**What rule 2 does and does not promise.** Rule 2 is a duty of the receiver.
"Old receivers keep working" holds for a receiver that follows it, and only for
such a receiver. A receiver that validates incoming messages strictly against the
schema set of its own version, and rejects whatever fails, does not follow it:

- Unknown **fields** pass such a validator, because the schemas leave
  `additionalProperties` open.
- Unknown **values** of a closed enumeration and unknown **message types** do not.
  A strict 0.1 validator rejects a 0.2 message that uses the actor type
  `softwareService` or the fee structure `revenueShare`, because the 0.1 schemas
  hold both lists as closed enumerations.

An implementation that validates therefore treats a failure caused by a value or
message type from a newer MINOR version as "unknown", not as an error.

## Releases and history

- **Every released version is an annotated Git tag** (`v0.1.0`) and a **GitHub
  Release** with human-readable notes. Releases are the canonical, immutable
  history.
- **Released tags are never moved or rewritten.** Implementers build against them.
  A correction to a released version is a new PATCH release, not an edit to the old tag.
- One recorded exception: on 2026-10-30 the tags v0.1.0–v0.5.0 were re-created once as a
  metadata correction (commit and tag author fields only); the released contents are unchanged.
- **Release checksums.** Since 0.6 every release publishes a SHA-256 checksum of its
  contents, so that an implementer who pins a release can verify what it pinned
  independently of tag objects (Ratified Decision 81). The release step:
  1. Tag the release.
  2. Run `scripts/release-checksums.sh v<version>`. It prints a `SHA256SUMS` manifest, one
     SHA-256 per file of the tagged tree with paths sorted bytewise, and a last line with
     the tag, its commit and the SHA-256 of the manifest. The manifest depends only on the
     files of the tag, so anyone can recompute it from a checkout or an extracted archive.
  3. Attach the manifest as `SHA256SUMS` to the GitHub Release, and put the commit and the
     manifest digest in the release notes.
  4. Add the last line to `RELEASES.sha256` in the first commit after the tag.
  `RELEASES.sha256` carries the digests of every release from v0.1.0 on. Pin a release by
  tag, commit and manifest digest, and map each `protocolVersion` to the schema set of the
  release you pinned.
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

Since 0.5 the specification also says how a receiver resolves the records that
messages name only by URI (actor references, role declarations, document
references, authority claims): from the actor that issued them, over a transport
of the actors' choice, with a recommended HTTPS shape. See *Record resolution* in
[Conventions](spec/01%20-%20Front%20Matter/Conventions.md).

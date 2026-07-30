# IP Operations Protocol — Command Document

> Single source of truth. One project, four surfaces. You glance here instead of holding the whole board in your head.
> **Last updated:** 2026-06-22 · **Maintainer:** [you] · **Spec status:** v0.1 draft

---

## 0. How to use this

This document is the board. It holds current state, what blocks what, and what's queued — so you don't have to. When you sit down, read **§7 What I need from you next** and **§2 the one-line status of each surface**, then close it again. I keep the rest current as we work.

When you need to act, work top-down: settle the decisions in **§5** (they're gating), then the canonical artifacts in **§3** unblock everything else.

---

## 1. The frame (so it stays settled)

There is **one project: the IP Operations Protocol**. Everything else is a *surface* where the protocol is proven, adopted, or endorsed — not a separate initiative.

- **WIPO** — endorsement / prior-art provenance channel
- **Dennemeyer IP Lounge** — adoption + the heaviest real-world stress test
- **AI law firm** — adoption (consumer of the standard, not a driver)
- **guardao / guardianlabs** — proving ground + sample-data source + converter host

If a task doesn't prove, adopt, or endorse the standard, it's noise this quarter.

---

## 2. Surfaces — one-line status

| Surface | Role | State | Next action | Blocked by |
|---|---|---|---|---|
| **The standard** | The product | ✅ **Published (private)** at github.com/GregXIV/ip-operations-protocol — name + citation URL filled, licensed, governance-reframed, `VERSIONING.md` shipped | Verify render → full license texts + governance sweep → flip public (WIPO stage) | — |
| **WIPO** | Endorsement | Contact warm, awaiting your expert feedback | Send finished spec + 1-page position note | WIPO position note (queued); spec now publishable |
| **IP Lounge** | Adoption + stress test | User-data-only today; IFI Claims available internally | Build converter (see §4), read-only first | Converter service; mapping not yet built |
| **Converter service** | Proving infra | Not started | Stand up on guardianlabs Coolify vs. EPO/JPO sample data | Schemas (§3 item 2) |
| **AI law firm** | Adoption (driving consumer) | **Active, unblocked** — schemas + generated types + validator ready; `law-firm-adoption-brief.md` written for the parallel session | Wire in per the brief (depend on `@ipproto/schemas`, types, CI validation) | — (confirm first workflow to finalize conformance profile) |
| **guardao / monetization** | Sample data + later test cases | Kept separate intentionally; EPO OPS + JPO connected | Use as sample-data source for converter | — |

---

## 3. Canonical artifacts (build once, every surface consumes)

The vault is currently five "projects" of writing in your head. It's really **three artifacts**, mostly *extracted* from the existing vault rather than written fresh.

1. **Public spec** — repo + rendered site, licensed and dated.
   - *Source:* the vault, near-verbatim. Main change is the governance-language softening (§5.2).
   - *Consumed by:* WIPO, open-source adopters, Dennemeyer, law firm.
   - *Status:* ✅ **packaged this session.** Repo scaffolded (README landing, LICENSE, GOVERNANCE, AUTHORS, NOTICE, CHANGELOG, VERSION), governance reframed in WIPO-facing text, Obsidian wikilinks converted to relative links (renders on GitHub). Delivered as `ip-operations-protocol-v0.1.zip`. Remaining before public push: full canonical license texts + governance sweep of remaining files.

2. **JSON Schemas + validated example messages.**
   - *Source:* foundational structures + message catalog → schemas; the EP Post-Grant Flow Walkthrough → the conformance corpus.
   - *Consumed by:* converter, IP Lounge, anyone implementing.
   - *Status:* ✅ **complete this session.** Full protocol surface schematized: envelope + 12 foundationals + **all 26 messages** (40 schema files) as `@ipproto/schemas`, version-pinned URN `$id`s, 11 validated example messages, reference validator (ajv), generated TypeScript types covering every message + structure. Validation proven (valid passes; missing-required/bad-format rejected).

3. **One-page position notes** (same spec underneath, audience-specific framing): WIPO / Dennemeyer leadership / law firm.
   - *Status:* not started. The WIPO one is the time-sensitive one.

**Discoverability + versioning (added 2026-06-22).**
- ✅ `VERSIONING.md` shipped in the repo: SemVer-adapted scheme, `protocolVersion` compatibility rule, tags + GitHub Releases as immutable history, versioned schema `$id`s, deprecate-don't-delete.
- *Make-AI-find-it plan:* public GitHub repo + canonical hosted URL (GitHub Pages or guardianlabs) + Zenodo DOI per release does ~90%. Clean Markdown already in our favor. `llms.txt` = cheap optional add once the canonical URL is set. ARD/`.well-known`/MCP = later, and for the **converter/validator service**, not the spec text.
- *Protocol-native discovery (important):* a stable, versioned schema/resolution endpoint mapping `{version, messageType}` → JSON Schema. Design with the schemas; implement on guardianlabs. This is what ARD would later point at.

---

## 4. The consolidation that saves you a workstream

Your **"guardianlabs standardization service"** and your **"IFI → standard repackager for IP Lounge"** are the **same service**. Build it once:

1. Stand it up on the **guardianlabs Coolify** environment — isolated from anything Dennemeyer touches.
2. Develop the mapping against **guardao's EPO OPS + JPO sample data** (free, already connected).
3. Once the mapping is trusted, point it at **IFI Claims** for the IP Lounge use case.

One effort yields: a safe sandbox, a real conformance corpus, and the IP Lounge build.

### Data-safety protocol for the IP Lounge (your flagged risk)

The "read raw → repackage → store back" pattern is safe **only if it writes to a new sidecar store and never mutates the existing Dennemeyer backbone.** Phase it:

- **Phase A — read-only.** Produce standard-format output, validate against schemas, diff against what IP Lounge already computes, for a *small* asset sample. Zero write-back.
- **Phase B — sidecar write.** Enable write-back only to a new/separate store, once the mapping earns trust.
- **Never** touch the shared backbone; other Dennemeyer services depend on it.

This sequencing is your insurance and doubles as conformance testing.

---

## 5. Decision queue (you are the ratifier now)

### 5.1 License — *decided 2026-06-22*
**CC-BY-4.0** for the prose spec, **Apache-2.0** for schemas/reference implementation.
**Status:** ☑ decided.

### 5.2 Governance narrative — *applied 2026-06-22 (recommended)*
"Independent expert, open license, governance to be opened to a consortium as adoption grows." No claim that a consortium exists. Applied as the natural consequence of your §5.1/§5.3 calls — flag if you want it framed differently.
**Status:** ☑ narrative set + encoded in `README.md`/`GOVERNANCE.md`. ☑ WIPO-facing softening done (Relationship to WIPO, spec index README, Open Questions banner). ☐ remaining: sweep in-passing "consortium" mentions in Actor Reference, Entity Reference, User Context, Identity Resolution Dispute, Conventions, Non-Scope, Deferred.

### 5.3 The six Open Questions — *ratified as recommended 2026-06-22*
All six ratified as the recommended v0.1 defaults. Reopen when a governance body forms.

1. **UserContext MUST vs SHOULD** → SHOULD; members calibrate bilaterally. ☑
2. **crossActorReferences in v0.1** → keep, marked out-of-protocol-validation. ☑
3. **WIPO liaison designation** → you, for now; time-bound when consortium forms. ☑
4. **Custom milestone category registry** → lightweight, opt-in, not enforced. ☑
5. **Dispute escalation beyond peer** → out of scope for v0.1; contracts handle it. ☑
6. **Hybrid subscription cadence standardization** → defer to v1.x; non-normative guidance only. ☑

**Status:** ☑ ratified.

### 5.4 Dennemeyer disclosure — *hygiene*
Put your authorship/ownership of the standard in writing to Dennemeyer before the recommendation lands as an implementation decision.
**Status:** ☐ pending.

---

## 6. Risk register (live)

| Risk | Severity | Mitigation | Status |
|---|---|---|---|
| IP Lounge data corruption | High | §4 phased read-only-first protocol; sidecar store only | Mitigation defined, not yet enforced in code |
| Claiming a consortium that doesn't exist (WIPO/public optics) | Medium | §5.2 governance narrative + spec edit pass | Decided + applied to public-facing text; in-passing sweep pending |
| Conflict/independence optics (recommending self-owned standard to a client) | Medium | §5.4 written disclosure | Pending |
| WIPO engagement becomes a time sink | Medium | Lead with finished doc + position note, not live walkthroughs | Depends on §3 item 1 |
| Attention as the real bottleneck | High | Delegate schema gen / converter build; reserve your time for design, relationships, the §5 calls | Ongoing |
| **Live GitHub repo is behind local artifacts** | **High** | Only the first commit was pushed; schemas, types, validator, and the profile exist only in the latest zip. **Re-upload the latest zip to GitHub before any agent builds against the repo.** | Open — action in §7 |

---

## 7. What I need from you next

To keep moving without overloading you, here's what's next.

**Shipped:** the complete schema set — envelope + 12 foundationals + **all 26 messages** (`@ipproto/schemas`), validated, with full TypeScript types and a reference validator — plus `law-firm-adoption-brief.md`. The law firm has the whole contract; it can never block on a missing schema. Converter and IP Lounge are unblocked.

**I can do these without anything from you — just say go:**
- **Full license texts** + **governance sweep** of remaining in-passing "consortium" mentions — the last two pre-public-tag cleanups, after which the repo is genuinely public-ready.
- **Converter scaffolding** on guardianlabs — needs the access shape (how guardao's EPO OPS / JPO access is exposed + the Coolify setup).

**These need you when ready (no rush):**
- **Public flip + first Release** (tags `v0.1.0`, mints the Zenodo DOI). Natural moment: the WIPO conversation.
- **WIPO position note** — 1-page note + repo link.

**Asset identification (added 2026-06-22).** ✅ `Asset Identification and Resolution` profile shipped in the spec (`spec/02 - Foundational Structures/`) + standalone copy for review/forwarding. Decisions ratified: seed+open scheme vocab; confidence+method required on resolutions; DOCDB backbone + national enrichment. ✅ **Resolution Provenance + Resolved Asset schemas added** (the resolver's emission validates in one call). **Next build:** the lookup-based resolver as this profile's reference implementation — and the converter's first working core.

**⚠️ Do this before the resolver build: push the latest zip to GitHub.** The live repo is at the first commit only — `schemas/` is still the placeholder, and the profile isn't there. Re-upload the current `ip-operations-protocol-v0.1.zip` contents to the repo (replace existing files; add new). Then the resolver agent can build against a true `main`.

**Resolver build note (from Claude Code's investigation):** the resolver must NOT open its own EPO client — route EPO/JPO through patent-kraken's existing gateway (AIMD + circuit breaker + token sidecar) to avoid the Fair-Use incident pattern. Use the DOCDB family (not INPADOC) per the profile's backbone decision.

With the schemas complete, the standard's machine contract is whole. The remaining work is deployment (converter, IP Lounge) and outreach (WIPO) — building on the foundation, not extending it.

You don't have to pick now. Tell me when you've done the three render checks above, and we go from there.

---

*Maintained as our working board. Tell me what changed and I update it; you don't track state, I do.*

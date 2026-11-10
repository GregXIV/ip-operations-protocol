# Contributing

Implementation feedback, defect reports and proposals are welcome. This page says how to
send them and on what terms they are accepted.

## Before you start

- **Scope.** A change is weighed against the single scoping principle in
  [Non-Scope](spec/01%20-%20Front%20Matter/Non-Scope.md): the protocol standardizes the
  IP-operations data layer and nothing else.
- **Questions and defects** go in an issue. Say which version you read (the tag, for
  example `v0.9.0`) and which page or schema.
- **Security reports** never go in a public issue; see [SECURITY.md](SECURITY.md).

## Making a change

1. **The specification comes first.** A change to behaviour is written in the
   specification pages under `spec/`. The schemas under `schemas/` follow the pages and
   never define behaviour the pages do not state.
2. **Versioning.** [VERSIONING.md](VERSIONING.md) decides whether a change is a MAJOR, a
   MINOR or a PATCH. A change to what a sender or a receiver does is never a PATCH. Add an
   entry to [CHANGELOG.md](CHANGELOG.md).
3. **Examples stay neutral.** Use placeholder actors and `.example` domains, as the
   existing examples do. Do not name real organizations, clients or matters.
4. **Checks.** From `schemas/`, run:

   ```bash
   npm ci
   node validate.mjs
   node generate-types.mjs --check
   ```

   If you changed a schema, regenerate the types with `npm run generate-types` and commit
   the result. Every check on the pull request must pass before it is merged.

## Developer Certificate of Origin

Every commit in a pull request carries a sign-off: a line
`Signed-off-by: Your Name <you@example.org>` at the end of the commit message, with the
name and email of the commit's author. `git commit -s` adds it. By signing off you certify
the [Developer Certificate of Origin 1.1](https://developercertificate.org/) for that
commit. The `dco` check verifies the sign-off on every commit of a pull request.

The maintainer holds the copyright in the existing text and made the patent commitment in
[PATENTS.md](PATENTS.md) directly, so the check does not ask for a sign-off on pull
requests the maintainer opens.

## Licensing of contributions

- A contribution is licensed under the licence of the part it changes: specification text
  under CC-BY-4.0 ([LICENSE](LICENSE)), and everything under `schemas/`, `scripts/` and
  `.github/` under Apache-2.0 ([schemas/LICENSE](schemas/LICENSE)). See [NOTICE](NOTICE).
- **Specification text carries a patent commitment.** A pull request that changes text
  under `spec/` states in its description:

  > I make the OWF Contributor License Agreement 1.0 (Copyright and Patent) for this
  > contribution.

  The agreement:
  <https://www.openwebfoundation.org/the-agreements/the-owf-1-0-agreements-granted-claims/owf-contributor-license-agreement-1-0-copyright-and-patent>.
  It keeps the specification royalty free for implementers, as the maintainer's own
  commitment in [PATENTS.md](PATENTS.md) does. A pull request that changes specification
  text without this statement is not merged.

## Decisions

Substantive changes are decided by the maintainer and recorded under
[`spec/05 - Decisions/`](spec/05%20-%20Decisions/), as [GOVERNANCE.md](GOVERNANCE.md)
describes.

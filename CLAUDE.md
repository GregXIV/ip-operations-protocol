# ip-operations-protocol: notes for coding agents

The IP Operations Protocol: the specification under `spec/` and the JSON Schemas, examples,
generated types and reference validator under `schemas/` (`@ipproto/schemas`). The
repository is public and every release is archived with a DOI.

## Before every push

1. **Identity.** `git config user.name` prints `GregXIV`. If it prints anything else, stop.
2. **Banned terms in the tree.** Run
   `git grep -n -i -f ~/.config/banned-terms/terms.txt` and expect no output.
3. **Banned terms in the commits.** Run
   `git log origin/main..HEAD --format='%an %ae %cn %ce%n%B' | grep -c -i -f ~/.config/banned-terms/terms.txt`
   and expect `0`. Read your commit messages and the pull request text as well.
4. **Never bypass the hook.** The pre-push hook runs the same check and refuses the push on a
   hit. Never use `--no-verify`. Remove the term, rewrite the unpushed commit, push again.
5. Never print a matched term, and never write a term from that list anywhere: not in a file,
   a file name, a commit message, a pull request, an issue, a release note or an example.
6. **Local gate**, the same steps as the required `validate` check:

   ```bash
   cd schemas && npm ci --ignore-scripts && node validate.mjs && node generate-types.mjs --check && cd ..
   node scripts/check-release-metadata.mjs
   ```

7. Sign off every commit (`git commit -s`), as [CONTRIBUTING.md](CONTRIBUTING.md) asks.

If `~/.config/banned-terms/terms.txt` does not exist on your machine (a cloud session, for
example), you cannot run steps 2 and 3. Push only to a branch, open a pull request, and treat
the `banned-terms` check on the pull request as the only gate: nothing merges until it passes.

## Changing the protocol

- **Spec first.** Behaviour is written in `spec/`; the schemas follow the pages and never
  define behaviour the pages do not state.
- **Every change gets a `CHANGELOG.md` entry** under `## [Unreleased]`, and
  [VERSIONING.md](VERSIONING.md) decides its bump. A change to what a sender or a receiver
  does is never a PATCH.
- A page whose text you change gets `changed: unreleased` in its metadata block
  ([spec/README.md](spec/README.md), *Page metadata*).
- Schema `$id`s are `urn:ipproto:schema:<MAJOR.MINOR>:<name>`, never reused across versions.
  `additionalProperties` stays open on published schemas.
- Examples use neutral placeholders (*Office*, *Applicant*, *Service Provider*,
  *Orchestrator*) and `.example` domains. No real organizations, clients or matters.
- `main` requires `validate` and `banned-terms`, strict, admins included. Agents open pull
  requests and never merge them.

## Releases: the maintainer's step

Tags, GitHub Releases, version bumps and anything else that publishes are made only on the
maintainer's explicit go. Agents prepare them and hand over the exact commands.

1. A release pull request sets one version in `VERSION`, `schemas/package.json`,
   `schemas/package-lock.json` and `CITATION.cff` (`version`, `date-released`), turns
   `[Unreleased]` into the dated version header, replaces `changed: unreleased` on every page
   with the version, and adds the version to `PATENTS.md`.
2. After it merges: `git tag -a v<x.y.z> -m "IP Operations Protocol <x.y.z>" <merge sha>` and
   `git push origin v<x.y.z>`. Then `sh scripts/release-checksums.sh v<x.y.z>` prints the
   manifest followed by one line `# release <tag> <commit> <digest>`. Save the manifest
   without that last line as `SHA256SUMS`; its SHA-256 is the digest.
3. `gh release create v<x.y.z> --verify-tag --title "IP Operations Protocol <x.y.z> (working draft)" --notes-file <notes> SHA256SUMS`,
   with the changelog section, the commit and the digest as notes.
4. A follow-up pull request adds `v<x.y.z> <commit> <digest>` to `RELEASES.sha256`.

Released tags are never moved or deleted. Every published Release gets a Zenodo DOI, and a DOI
cannot be withdrawn: never publish a Release to try something out.

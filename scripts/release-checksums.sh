#!/bin/sh
# Release checksums for the IP Operations Protocol (VERSIONING.md, "Release checksums").
#
# Usage: scripts/release-checksums.sh <tag>
#
# Prints a SHA256SUMS manifest of every file in the tagged tree (one line per
# file, "<sha256>  <path>", paths sorted bytewise), then a last line
# "# release <tag> <commit> <sha256 of the manifest>".
#
# The manifest depends only on the file contents and paths of the tag, not on
# the git version or a tar format, so anyone can recompute it from a checkout
# or an extracted archive of the tag. The manifest goes to the GitHub Release;
# the last line goes to RELEASES.sha256.
set -eu

tag="${1:?usage: release-checksums.sh <tag>}"
commit="$(git rev-list -n 1 "$tag")"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

git archive --format=tar "$tag" | tar -x -C "$tmp"
manifest="$(cd "$tmp" && find . -type f -print | sed 's|^\./||' | LC_ALL=C sort |
  while IFS= read -r f; do shasum -a 256 "$f"; done)"

printf '%s\n' "$manifest"
digest="$(printf '%s\n' "$manifest" | shasum -a 256 | cut -d' ' -f1)"
printf '# release %s %s %s\n' "$tag" "$commit" "$digest"

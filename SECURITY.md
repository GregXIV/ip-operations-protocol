# Security

## Reporting a problem

Report a security problem privately, never in a public issue: open the repository's
**Security** tab and choose **Report a vulnerability**. The report reaches only the
maintainer.

A security problem here is, for example, a schema or the reference validator accepting a
message that the specification forbids in a way a receiver could be misled by, or a rule in
the specification that lets one actor make a binding statement in another actor's name.

The maintainer acknowledges the report, agrees a disclosure date with you, and records the
fix in the changelog of the release that carries it.

## Supported versions

Fixes are made in the next release. Earlier releases are not changed: a released tag is
never moved ([VERSIONING.md](VERSIONING.md)).

# 0004 - Static Data Contract

## Status

Accepted

## Context

Mode A has no server-generated data. The important contract is the portable evidence bundle that users export and later verify offline.

## Decision

Use versioned JSON evidence bundles. The v1 bundle contains:

- `schemaVersion`
- `exportedAt`
- `publicKey`
- `selectedEventId`
- `merkleRoot`
- `attestations[]`

Each attestation contains its unsigned payload, event hash, detached Ed25519 signature, and public key. Breaking schema changes bump `schemaVersion`.

## Consequences

Evidence files are human inspectable and easy to verify with the static app. Bundle exports are user-controlled downloads, never remote uploads.

## Alternatives Considered

- SQLite/Parquet artifacts: rejected because there is no shared public dataset in v1.
- Binary evidence bundles: deferred until a compact archival format is needed.

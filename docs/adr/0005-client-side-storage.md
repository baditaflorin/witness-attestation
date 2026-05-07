# 0005 - Client-Side Storage Strategy

## Status

Accepted

## Context

Witness needs durable local storage for private keys and attestations without a backend.

## Decision

Use IndexedDB through the `idb` package. Store one local key record and a chronological attestation chain. Do not use `localStorage` for private key material.

## Consequences

- Data persists offline and across reloads.
- Export/import remains explicit.
- Browser profile deletion or site data clearing can remove evidence, so the UI must encourage bundle export.

## Alternatives Considered

- OPFS: powerful but less necessary for small JSON records.
- `localStorage`: rejected for private key material and structured records.

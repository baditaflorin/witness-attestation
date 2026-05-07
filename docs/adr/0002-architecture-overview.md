# 0002 - Architecture Overview and Module Boundaries

## Status

Accepted

## Context

The project needs a clear split between UI, cryptography, local storage, verification, and optional map context. These concerns must remain testable without a browser permission prompt.

## Decision

Use feature-oriented modules:

- `features/keys`: local Ed25519 key management.
- `features/attestations`: capture, canonical payloads, hashchain, Merkle roots, export bundles.
- `features/verification`: offline bundle validation.
- `features/geolocation`: browser GPS and manual/demo fallback.
- `features/geocontext`: map context adapter with a libosmscout-compatible boundary.
- `shared`: UI and build metadata.

## Consequences

Each module exposes typed functions and schemas. UI components call feature services rather than reaching directly into crypto or IndexedDB internals.

## Alternatives Considered

- Layer-only folders such as `components`, `utils`, `services`: rejected because evidence flows are easier to reason about by domain.

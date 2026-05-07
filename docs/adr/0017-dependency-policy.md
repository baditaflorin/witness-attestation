# 0017 - Dependency Policy

## Status

Accepted

## Context

Witness handles high-trust evidence artifacts. Dependencies should be boring, maintained, and limited.

## Decision

Use production-ready libraries for cryptography, storage, schemas, querying, and browser tests:

- `libsodium-wrappers-sumo`
- `idb`
- `zod`
- `@tanstack/react-query`
- `vite`, `vitest`, `playwright`

Do not add unmaintained crypto, GPS, or evidence-format libraries.

## Consequences

Dependency additions require a clear ADR or README rationale when they affect core evidence handling.

## Alternatives Considered

- Custom crypto primitives: rejected categorically.

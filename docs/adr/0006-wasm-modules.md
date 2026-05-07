# 0006 - WASM Modules Used and Why

## Status

Accepted

## Context

The project requested libsodium, Ed25519, Merkle trees, and libosmscout. GitHub Pages cannot set cross-origin isolation headers, and the asset budget requires lazy loading.

## Decision

Use `libsodium-wrappers-sumo` as a lazy-loaded crypto provider for Ed25519 signatures and BLAKE2b hashing. Implement Merkle tree composition in TypeScript using libsodium hashes. Keep a `geocontext` adapter boundary for libosmscout-compatible offline context, but do not bundle libosmscout WASM in v1 because there is no maintained browser npm package and compiling/shipping global OSM data would break the static asset budget.

Upstream references:

- https://github.com/Framstag/libosmscout
- https://wiki.openstreetmap.org/wiki/Libosmscout
- https://www.npmjs.com/package/libsodium-wrappers-sumo

## Consequences

Crypto stays production-grade and lazy-loaded. Map context remains optional and deterministic in v1, with a clear future replacement point for a vetted libosmscout WASM artifact.

## Alternatives Considered

- Web Crypto Ed25519: rejected because browser support remains inconsistent for this use case.
- Bundling a self-compiled libosmscout WASM artifact: rejected for v1 due build complexity, data size, and Pages header constraints.

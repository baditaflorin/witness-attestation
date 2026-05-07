# 0013 - Testing Strategy

## Status

Accepted

## Context

Evidence validation needs deterministic tests. Pages deployment needs a fast browser smoke test.

## Decision

Use Vitest for unit tests and Playwright for smoke/e2e. `make test` runs unit tests. `make smoke` builds `docs/`, serves it with Vite preview, and verifies the homepage plus one happy path.

## Consequences

Tests remain local and hook-friendly. Crypto and bundle verification logic must have unit coverage before release.

## Alternatives Considered

- GitHub Actions: rejected by project constraints.
- Manual browser-only testing: rejected because verification logic needs deterministic coverage.

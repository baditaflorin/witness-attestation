# 0011 - Logging Strategy

## Status

Accepted

## Context

Mode A has no server logs. Console output can leak sensitive context if used carelessly.

## Decision

Do not log attestations, coordinates, private keys, evidence bundle contents, or verification payloads in production. User-facing failures are displayed in the UI.

## Consequences

Debugging relies on tests and explicit user reports rather than passive logs.

## Alternatives Considered

- Verbose browser console logging: rejected due privacy risk.

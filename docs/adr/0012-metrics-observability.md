# 0012 - Metrics and Observability

## Status

Accepted

## Context

Usage analytics can be sensitive for an app about presence at events or protests.

## Decision

Do not include analytics in v1.

## Consequences

There is no telemetry, no beacons, and no third-party analytics script. Project adoption is measured externally through GitHub stars, issues, and user feedback.

## Alternatives Considered

- Plausible analytics: privacy-respecting, but still unnecessary for v1.
- Custom beacon: rejected because Mode A should avoid runtime collection.

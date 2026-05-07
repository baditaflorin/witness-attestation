# 0007 - Data Generation Pipeline

## Status

Accepted

## Context

Mode B would require offline or scheduled data generation. Mode A does not.

## Decision

Do not create a data generation pipeline for v1.

## Consequences

`make data` is intentionally absent. The app has no committed generated datasets beyond the built Pages bundle in `docs/`.

## Alternatives Considered

- Generate OSM extracts for common cities: rejected because sensitive users may need arbitrary places and the dataset would be too large for v1.

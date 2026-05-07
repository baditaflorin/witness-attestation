# 0008 - Go Backend Project Layout

## Status

Accepted

## Context

The bootstrap rules require Go layout only for Mode B or Mode C.

## Decision

Do not include a Go backend in v1.

## Consequences

There is no `cmd/`, `internal/`, `api/`, Dockerfile, or compose stack. If a future runtime API is added, it must start with a new ADR and follow the Go layout requirements.

## Alternatives Considered

- Add an empty Go backend skeleton: rejected because it would imply an unused deployment surface.

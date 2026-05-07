# 0014 - Error Handling Conventions

## Status

Accepted

## Context

Users need clear, non-technical recovery paths when GPS permissions, storage, imports, or verification fail.

## Decision

Feature services return typed results or throw `Error` instances with safe messages. UI catches errors and renders concise status panels. Production code does not `alert`, `panic`, or log sensitive payloads.

## Consequences

Failures are visible without exposing private data in logs.

## Alternatives Considered

- Global exception-only handling: rejected because capture and verification need contextual recovery messages.

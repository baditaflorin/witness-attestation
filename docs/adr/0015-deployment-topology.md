# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode A uses GitHub Pages only.

## Decision

Deploy only the static app at:

https://baditaflorin.github.io/witness-attestation/

There is no Docker backend, nginx, Prometheus, or server runbook in v1.

## Consequences

Operational risk is low. Runtime availability depends on GitHub Pages and the user's browser.

## Alternatives Considered

- Docker backend on port 25342: rejected because no runtime API is needed.

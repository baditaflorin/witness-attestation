# 0009 - Configuration and Secrets Management

## Status

Accepted

## Context

The frontend is public static code. Any value shipped in it is visible to everyone.

## Decision

Use only public build-time configuration:

- repository owner
- repository name
- repository URL
- PayPal URL
- app version
- build commit

No secrets are accepted in frontend environment variables. `.env.example` contains placeholders only.

## Consequences

There is no secret-management surface in v1. Hooks and `.gitignore` block common secret files.

## Alternatives Considered

- Encrypted frontend secrets: rejected because they are still client-side secrets.

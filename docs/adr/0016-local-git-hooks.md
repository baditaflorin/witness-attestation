# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project uses local hooks instead of GitHub Actions.

## Decision

Use plain `.githooks/` scripts wired with `git config core.hooksPath .githooks`.

Hooks:

- pre-commit: format check, lint, typecheck, gitleaks staged scan
- commit-msg: Conventional Commits validation
- pre-push: tests, build, smoke
- post-merge and post-checkout: reserved for generated-code refreshes

## Consequences

Contributors can run the same hooks through Make targets. Missing local tools fail with an install hint.

## Alternatives Considered

- lefthook: viable, but plain shell scripts are enough for this v1 repo.

# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live URL is a first-class deliverable. The project must avoid GitHub Actions and still publish reliably.

## Decision

Serve GitHub Pages from `main:/docs`. Vite builds directly into `docs/`, copies `index.html` to `404.html` for SPA fallback, writes `.nojekyll`, and uses base path `/witness-attestation/`.

Production URL:

https://baditaflorin.github.io/witness-attestation/

## Consequences

- Built assets are committed.
- `.gitignore` ignores `dist/` but intentionally does not ignore `docs/`.
- Rollback is a normal git revert of the publishing commit.

## Alternatives Considered

- `gh-pages` branch: rejected because `main:/docs` is simpler without CI.
- `main:/`: rejected because source and generated files would be mixed at repo root.

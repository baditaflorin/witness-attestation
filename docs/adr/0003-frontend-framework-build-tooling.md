# 0003 - Frontend Framework and Build Tooling

## Status

Accepted

## Context

The app needs a small, accessible, static-friendly UI with strict TypeScript and fast local checks.

## Decision

Use React, TypeScript strict mode, Vite, Vitest, Playwright, and vite-plugin-pwa. CSS is authored directly in `src/styles.css` to avoid adding a large styling framework for v1.

## Consequences

- Builds are fast and emit static files into `docs/`.
- React keeps the capture and verification flows ergonomic.
- CSS remains explicit and small.

## Alternatives Considered

- Tailwind CSS: deferred because v1 needs a small bespoke interface and no design-system scale yet.
- Svelte: viable, but React has stronger ecosystem coverage for this repo's expected contributors.

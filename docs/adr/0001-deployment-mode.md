# 0001 - Deployment Mode

## Status

Accepted

## Context

Witness Attestation captures sensitive personal location claims. The v1 product needs GPS access, local cryptographic signing, local persistence, and offline verification. It does not require accounts, cross-device sync, shared server state, runtime secrets, or privileged APIs.

## Decision

Use Mode A: Pure GitHub Pages.

The app is a static PWA served from https://baditaflorin.github.io/witness-attestation/. Runtime work happens in the browser with Web APIs, IndexedDB, and lazy-loaded WASM/JavaScript libraries. There is no backend and no server-side storage.

## Consequences

- Private keys and event history stay on the user's device by default.
- GitHub Pages is the only production hosting surface.
- Large optional map-context features must be lazy-loaded or user-supplied.
- GitHub Pages cannot provide custom COOP/COEP headers, so WASM modules must work without requiring cross-origin isolation.

## Alternatives Considered

- Mode B: rejected for v1 because there is no shared dataset that must be regenerated.
- Mode C: rejected because auth, mutations, secrets, and runtime APIs are not needed for v1.

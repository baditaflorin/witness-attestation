# Postmortem

Date:

2026-05-08

## What Was Built

Witness Attestation v0.1.0 is a pure GitHub Pages PWA at:

https://baditaflorin.github.io/witness-attestation/

It implements local Ed25519 key generation, browser GPS/manual/demo location capture, canonical payload hashing, detached signatures, hashchain continuity, Merkle root export, IndexedDB storage, JSON evidence bundle download, and offline bundle verification.

The live page includes:

- repository link: https://github.com/baditaflorin/witness-attestation
- PayPal link: https://www.paypal.com/paypalme/florinbadita
- app version and live public commit display

## Was Mode A Correct?

Yes. Mode A was the right choice in hindsight. The v1 requirements did not need server-side auth, shared writes, runtime secrets, cross-device sync, or private APIs. Keeping the app static avoided creating a custody risk for users' location history and private keys.

Mode B may become useful later if the project ships signed public OSM extracts or reproducible map-context datasets. Mode C still looks unnecessary unless the product adds account sync, third-party notarization, or managed timestamp anchoring.

## What Worked

- GitHub Pages from `main:/docs` was simple and public on day one.
- libsodium could be lazy-loaded, keeping the initial app bundle under the 200 KB gzip target.
- JSON evidence bundles made verification transparent and easy to test.
- Local hooks caught a real smoke-test failure before push.

## What Did Not Work

- Building directly into `docs/` initially deleted ADR/source documentation. The build script now cleans only generated Pages artifacts and preserves human docs.
- The first smoke-test port was too common and accidentally hit another local preview server. The smoke script now uses a less common strict port.
- Embedding the git SHA into the bundled JS created endless Pages asset churn. The app now fetches the live public commit from GitHub and uses a stable static fallback.

## What Surprised Us

GitHub Pages plus Vite is straightforward until the publish directory is also the documentation directory. Preserving docs while still cleaning stale hashed assets needs an explicit build script.

## Accepted Tech Debt

- libosmscout is represented by a deterministic adapter boundary, not a bundled WASM build. There is no maintained browser npm package, and shipping map data in v1 would break the static asset budget.
- Device time and GPS readings are signed but not independently trusted. The bundle proves key-controlled signing and internal integrity, not physical impossibility of spoofing.
- Private key storage is local IndexedDB without passphrase encryption in v1.

## Next Three Improvements

1. Add optional passphrase-wrapped key export/import using libsodium secretbox or a Web Crypto KDF.
2. Add optional public timestamp anchoring, such as user-controlled OpenTimestamps or signed release-note anchoring.
3. Add a vetted libosmscout WASM/static dataset integration path for offline reverse-geographic context.

## Time Spent vs Estimate

Estimated:

4-6 hours for a solid Mode A v1.

Actual:

About 4 hours of implementation, documentation, test wiring, Pages publishing, and smoke-test hardening.

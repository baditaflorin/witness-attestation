# Witness Attestation

Live site: https://baditaflorin.github.io/witness-attestation/

Repository: https://github.com/baditaflorin/witness-attestation

Support: https://www.paypal.com/paypalme/florinbadita

Witness Attestation is a client-side PWA for signing GPS/time observations into verifiable, portable presence attestations.

## Quickstart

```sh
npm install
npm run dev
npm run build
npm test
npm run smoke
```

## Project Shape

- Pure GitHub Pages deployment from `main:/docs`.
- Runtime cryptography stays in the browser.
- Private keys and attestations stay in IndexedDB unless the user exports a bundle.

## Documentation

- Architecture decisions: docs/adr/
- Architecture overview: docs/architecture.md
- Deployment guide: docs/deploy.md
- Privacy notes: docs/privacy.md

## Development

Install local hooks:

```sh
make install-hooks
```

No GitHub Actions are used. Checks run locally through Make targets and git hooks.

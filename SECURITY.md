# Security Policy

Please report security issues privately to baditaflorin@gmail.com.

Do not open a public issue for vulnerabilities involving private key handling, bundle verification bypasses, data loss, or evidence tampering.

## Scope

Witness Attestation is a client-side application. The project does not operate a runtime backend and does not receive user location history or private keys.

## Baseline

- No secrets are committed to the repository.
- Private keys are generated locally in the browser.
- Evidence bundles are exported only when the user explicitly downloads them.

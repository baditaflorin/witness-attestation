# Contributing

Thanks for helping improve Witness Attestation.

## Local Setup

```sh
npm install
make install-hooks
make dev
```

## Commit Style

Use Conventional Commits:

- `feat: add bundle verifier`
- `fix: preserve hashchain order`
- `docs: record Pages publishing strategy`
- `test: cover canonical hashing`

## Checks

Run these before pushing:

```sh
make fmt
make lint
make test
make build
make smoke
```

Do not commit secrets, private keys, `.env` files, GPS history exports, or personal evidence bundles.

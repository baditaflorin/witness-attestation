# Evidence Bundle Contract

Schema version:

`witness.bundle.v1`

## Bundle Fields

- `schemaVersion`: bundle schema literal.
- `exportedAt`: ISO-8601 export timestamp.
- `publicKey`: Ed25519 public key, base64 without padding.
- `selectedEventId`: UUID of the exported focal event.
- `merkleRoot`: BLAKE2b-256 Merkle root over attestation event hashes.
- `attestations`: signed attestation chain.

## Attestation Fields

- `payload`: canonical signed payload.
- `eventHash`: BLAKE2b-256 hash of canonical payload JSON.
- `signature`: detached Ed25519 signature over `eventHash`.
- `publicKey`: public key used for verification.
- `signedAt`: ISO-8601 signing timestamp.

## Verification Checks

The verifier checks:

- bundle JSON schema
- selected event presence
- public key consistency
- payload hash recomputation
- Ed25519 signatures
- hashchain previous-hash continuity
- continuous chain indexes
- Merkle root recomputation

The verifier does not claim independent truth of GPS sensor input or device time.

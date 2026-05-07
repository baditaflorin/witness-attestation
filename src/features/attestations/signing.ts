import type { KeyRecord } from '../crypto/keys';
import { hashCanonical, hashText } from '../crypto/hash';
import { getSodium } from '../crypto/sodium';
import { createOsmScoutContext } from '../geocontext/osmScoutAdapter';
import type { AttestationPayload, LocationReading, SignedAttestation } from './types';
import { payloadSchemaVersion } from './types';

export type CreateAttestationInput = {
  statement: string;
  location: LocationReading;
  chainIndex: number;
  previousHash: string | null;
  key: KeyRecord;
};

export async function createSignedAttestation(
  input: CreateAttestationInput,
): Promise<SignedAttestation> {
  const sodium = await getSodium();
  const variant = sodium.base64_variants.ORIGINAL_NO_PADDING;
  const createdAt = new Date().toISOString();
  const payload: AttestationPayload = {
    schemaVersion: payloadSchemaVersion,
    id: crypto.randomUUID(),
    statement: input.statement.trim(),
    capturedAt: input.location.capturedAt,
    createdAt,
    location: input.location,
    context: createOsmScoutContext(input.location),
    chain: {
      index: input.chainIndex,
      previousHash: input.previousHash,
    },
    client: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgentHash: await hashText(navigator.userAgent),
    },
  };

  const eventHash = await hashCanonical(payload);
  const signature = sodium.to_base64(
    sodium.crypto_sign_detached(
      sodium.from_hex(eventHash),
      sodium.from_base64(input.key.privateKey, variant),
    ),
    variant,
  );

  return {
    payload,
    eventHash,
    signature,
    publicKey: input.key.publicKey,
    signedAt: createdAt,
  };
}

export async function verifyAttestationSignature(
  attestation: SignedAttestation,
): Promise<boolean> {
  const sodium = await getSodium();
  const variant = sodium.base64_variants.ORIGINAL_NO_PADDING;
  const eventHash = await hashCanonical(attestation.payload);

  if (eventHash !== attestation.eventHash) {
    return false;
  }

  return sodium.crypto_sign_verify_detached(
    sodium.from_base64(attestation.signature, variant),
    sodium.from_hex(attestation.eventHash),
    sodium.from_base64(attestation.publicKey, variant),
  );
}

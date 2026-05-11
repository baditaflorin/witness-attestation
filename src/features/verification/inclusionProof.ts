import { z } from 'zod';
import { hashCanonical } from '../crypto/hash';
import {
  buildMerkleTree,
  verifyMerkleProof,
  type MerkleProofStep,
} from '../crypto/merkle';
import {
  evidenceBundleSchema,
  signedAttestationSchema,
  type EvidenceBundle,
} from '../attestations/types';
import { verifyAttestationSignature } from '../attestations/signing';

export const inclusionProofSchemaVersion = 'witness.inclusion-proof.v1';

const merkleProofStepSchema = z.object({
  position: z.enum(['left', 'right']),
  hash: z.string().length(64),
});

export const inclusionProofSchema = z.object({
  schemaVersion: z.literal(inclusionProofSchemaVersion),
  exportedAt: z.string().datetime(),
  publicKey: z.string().min(40),
  merkleRoot: z.string().length(64),
  attestation: signedAttestationSchema,
  merklePath: z.array(merkleProofStepSchema),
});

export type InclusionProof = z.infer<typeof inclusionProofSchema>;

/**
 * Build a minimal disclosure for a single event in the bundle: the selected
 * attestation, the Merkle path connecting its eventHash to the bundle root,
 * and the bundle's public key. The other attestations in the bundle are
 * never copied into the proof, so a witness can share evidence of one
 * observation without leaking every other observation in their chain.
 */
export async function createInclusionProof(
  bundle: EvidenceBundle,
  eventId: string,
  exportedAt: string = new Date().toISOString(),
): Promise<InclusionProof> {
  const ordered = [...bundle.attestations].sort(
    (left, right) => left.payload.chain.index - right.payload.chain.index,
  );
  const target = ordered.find((attestation) => attestation.payload.id === eventId);
  if (!target) {
    throw new Error(`Event ${eventId} is not present in the bundle.`);
  }
  const merkle = await buildMerkleTree(
    ordered.map((attestation) => attestation.eventHash),
  );
  const path = merkle.proofs.get(target.eventHash) ?? [];
  return {
    schemaVersion: inclusionProofSchemaVersion,
    exportedAt,
    publicKey: bundle.publicKey,
    merkleRoot: bundle.merkleRoot,
    attestation: target,
    merklePath: path,
  };
}

export type InclusionProofCheck = {
  label: string;
  passed: boolean;
};

export type InclusionProofReport = {
  valid: boolean;
  proof: InclusionProof | null;
  checks: InclusionProofCheck[];
  summary: string;
};

/**
 * Verify a single-event inclusion proof without needing the rest of the
 * chain. Performs:
 *  1. Schema validation.
 *  2. The attestation's eventHash matches the canonical hash of its
 *     payload (catches payload tampering).
 *  3. The attestation's Ed25519 signature verifies against the bundled
 *     public key.
 *  4. The attestation's public key matches the bundle public key (so a
 *     hostile re-signer can't substitute their own key).
 *  5. Replaying the Merkle path from the event hash produces the same
 *     root recorded in the proof.
 */
export async function verifyInclusionProofJson(
  rawJson: string,
): Promise<InclusionProofReport> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return failedReport('Inclusion proof is not valid JSON.');
  }

  const parseResult = inclusionProofSchema.safeParse(parsed);
  if (!parseResult.success) {
    return failedReport('Inclusion proof does not match the v1 schema.');
  }

  const proof = parseResult.data;
  const checks: InclusionProofCheck[] = [];

  const recomputed = await hashCanonical(proof.attestation.payload);
  checks.push({
    label: 'attestation payload hash matches eventHash',
    passed: recomputed === proof.attestation.eventHash,
  });

  checks.push({
    label: 'attestation public key matches proof key',
    passed: proof.attestation.publicKey === proof.publicKey,
  });

  checks.push({
    label: 'Ed25519 signature verifies',
    passed: await verifyAttestationSignature(proof.attestation),
  });

  const merkleOk = await verifyMerkleProof(
    proof.attestation.eventHash,
    proof.merklePath as MerkleProofStep[],
    proof.merkleRoot,
  );
  checks.push({
    label: 'Merkle path anchors event to root',
    passed: merkleOk,
  });

  const valid = checks.every((check) => check.passed);
  return {
    valid,
    proof,
    checks,
    summary: valid
      ? 'Inclusion proof verified: one event anchored to the chain root.'
      : 'Inclusion proof failed one or more checks.',
  };
}

/**
 * Cross-check that the proof carries the same public key and Merkle root as
 * a known bundle — useful when a verifier has the originating bundle and
 * wants to confirm the proof references the same evidence chain.
 */
export function inclusionProofMatchesBundle(
  proof: InclusionProof,
  bundle: EvidenceBundle,
): boolean {
  const bundleParseResult = evidenceBundleSchema.safeParse(bundle);
  if (!bundleParseResult.success) return false;
  return (
    proof.publicKey === bundle.publicKey &&
    proof.merkleRoot === bundle.merkleRoot &&
    bundle.attestations.some((entry) => entry.payload.id === proof.attestation.payload.id)
  );
}

function failedReport(summary: string): InclusionProofReport {
  return {
    valid: false,
    proof: null,
    checks: [{ label: 'schema', passed: false }],
    summary,
  };
}

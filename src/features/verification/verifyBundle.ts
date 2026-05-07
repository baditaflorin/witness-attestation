import { hashCanonical } from '../crypto/hash';
import { buildMerkleTree } from '../crypto/merkle';
import type { EvidenceBundle } from '../attestations/types';
import { evidenceBundleSchema } from '../attestations/types';
import { verifyAttestationSignature } from '../attestations/signing';

export type VerificationCheck = {
  label: string;
  passed: boolean;
};

export type VerificationReport = {
  valid: boolean;
  bundle: EvidenceBundle | null;
  checks: VerificationCheck[];
  summary: string;
};

export async function verifyBundleJson(rawJson: string): Promise<VerificationReport> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return invalidReport('Bundle is not valid JSON.');
  }

  const schemaResult = evidenceBundleSchema.safeParse(parsed);
  if (!schemaResult.success) {
    return invalidReport('Bundle does not match the v1 evidence schema.');
  }

  const bundle = schemaResult.data;
  const checks: VerificationCheck[] = [];
  const attestations = [...bundle.attestations].sort(
    (left, right) => left.payload.chain.index - right.payload.chain.index,
  );

  checks.push({
    label: 'selected event is present',
    passed: attestations.some(
      (attestation) => attestation.payload.id === bundle.selectedEventId,
    ),
  });

  checks.push({
    label: 'all attestations use bundle public key',
    passed: attestations.every(
      (attestation) => attestation.publicKey === bundle.publicKey,
    ),
  });

  for (const attestation of attestations) {
    checks.push({
      label: `hash matches event ${attestation.payload.chain.index}`,
      passed: (await hashCanonical(attestation.payload)) === attestation.eventHash,
    });
    checks.push({
      label: `signature verifies event ${attestation.payload.chain.index}`,
      passed: await verifyAttestationSignature(attestation),
    });
  }

  checks.push({
    label: 'hashchain links are continuous',
    passed: attestations.every((attestation, index) => {
      if (index === 0) {
        return attestation.payload.chain.previousHash === null;
      }

      return attestation.payload.chain.previousHash === attestations[index - 1].eventHash;
    }),
  });

  checks.push({
    label: 'hashchain indexes are continuous',
    passed: attestations.every(
      (attestation, index) => attestation.payload.chain.index === index,
    ),
  });

  const merkleTree = await buildMerkleTree(
    attestations.map((attestation) => attestation.eventHash),
  );
  checks.push({
    label: 'Merkle root matches exported chain',
    passed: merkleTree.root === bundle.merkleRoot,
  });

  const valid = checks.every((check) => check.passed);
  return {
    valid,
    bundle,
    checks,
    summary: valid
      ? 'Bundle is internally consistent and signatures verify.'
      : 'Bundle failed one or more verification checks.',
  };
}

function invalidReport(summary: string): VerificationReport {
  return {
    valid: false,
    bundle: null,
    checks: [{ label: 'schema', passed: false }],
    summary,
  };
}

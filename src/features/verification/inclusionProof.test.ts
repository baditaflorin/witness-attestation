import { describe, expect, it, vi } from 'vitest';

import { createEvidenceBundle } from '../attestations/bundle';
import { createSignedAttestation } from '../attestations/signing';
import { generateKeyRecord } from '../crypto/keys';
import { createManualLocation } from '../geolocation/location';
import {
  createInclusionProof,
  inclusionProofMatchesBundle,
  verifyInclusionProofJson,
} from './inclusionProof';

vi.stubGlobal('navigator', { userAgent: 'vitest' });

describe('inclusion proof', () => {
  it('verifies a single-event inclusion proof end-to-end', async () => {
    const bundle = await makeBundle();
    const proof = await createInclusionProof(bundle, bundle.attestations[1].payload.id);

    expect(proof.attestation.payload.id).toBe(bundle.attestations[1].payload.id);
    expect(proof.merklePath.length).toBeGreaterThan(0);

    const report = await verifyInclusionProofJson(JSON.stringify(proof));
    expect(report.valid).toBe(true);
    expect(report.checks.every((check) => check.passed)).toBe(true);
  });

  it('does not include the other attestations from the bundle', async () => {
    const bundle = await makeBundle();
    const proof = await createInclusionProof(bundle, bundle.attestations[0].payload.id);
    const serialized = JSON.stringify(proof);

    // The other event's statement and id must not appear in the proof.
    expect(serialized).not.toContain(bundle.attestations[1].payload.statement);
    expect(serialized).not.toContain(bundle.attestations[1].payload.id);
  });

  it('fails verification when the attestation payload is tampered after export', async () => {
    const bundle = await makeBundle();
    const proof = await createInclusionProof(bundle, bundle.attestations[0].payload.id);
    proof.attestation.payload.statement = 'lie';
    const report = await verifyInclusionProofJson(JSON.stringify(proof));
    expect(report.valid).toBe(false);
    expect(
      report.checks.some(
        (check) => check.label.includes('eventHash') || check.label.includes('signature'),
      ),
    ).toBe(true);
  });

  it('fails verification when the Merkle path is truncated', async () => {
    const bundle = await makeBundle();
    const proof = await createInclusionProof(bundle, bundle.attestations[0].payload.id);
    proof.merklePath = [];
    const report = await verifyInclusionProofJson(JSON.stringify(proof));
    expect(report.valid).toBe(false);
    expect(report.checks.find((check) => check.label.includes('Merkle'))?.passed).toBe(
      false,
    );
  });

  it('fails when the attestation key is swapped to a hostile signer', async () => {
    const bundle = await makeBundle();
    const proof = await createInclusionProof(bundle, bundle.attestations[0].payload.id);
    const otherKey = await generateKeyRecord(new Date('2026-06-01T00:00:00.000Z'));
    proof.attestation.publicKey = otherKey.publicKey;
    const report = await verifyInclusionProofJson(JSON.stringify(proof));
    expect(report.valid).toBe(false);
    expect(
      report.checks.find((check) => check.label.includes('public key'))?.passed,
    ).toBe(false);
  });

  it('cross-checks a proof against its originating bundle', async () => {
    const bundle = await makeBundle();
    const proof = await createInclusionProof(bundle, bundle.attestations[0].payload.id);
    expect(inclusionProofMatchesBundle(proof, bundle)).toBe(true);

    const otherBundle = await makeBundle();
    expect(inclusionProofMatchesBundle(proof, otherBundle)).toBe(false);
  });

  it('rejects an unknown event id when building a proof', async () => {
    const bundle = await makeBundle();
    await expect(
      createInclusionProof(bundle, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ).rejects.toThrow(/not present/);
  });
});

async function makeBundle() {
  const key = await generateKeyRecord(new Date('2026-05-08T00:00:00.000Z'));
  const first = await createSignedAttestation({
    statement: 'first event',
    location: createManualLocation(44.439663, 26.096306, 25, 'demo'),
    chainIndex: 0,
    previousHash: null,
    key,
  });
  const second = await createSignedAttestation({
    statement: 'second event',
    location: createManualLocation(44.4399, 26.0967, 20, 'demo'),
    chainIndex: 1,
    previousHash: first.eventHash,
    key,
  });
  const third = await createSignedAttestation({
    statement: 'third event',
    location: createManualLocation(44.4401, 26.0972, 15, 'demo'),
    chainIndex: 2,
    previousHash: second.eventHash,
    key,
  });

  return createEvidenceBundle([first, second, third], second.payload.id);
}

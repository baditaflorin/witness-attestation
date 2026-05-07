import { describe, expect, it, vi } from 'vitest';

import { createEvidenceBundle } from '../attestations/bundle';
import { createSignedAttestation } from '../attestations/signing';
import { generateKeyRecord } from '../crypto/keys';
import { createManualLocation } from '../geolocation/location';
import { verifyBundleJson } from './verifyBundle';

vi.stubGlobal('navigator', { userAgent: 'vitest' });

describe('verifyBundleJson', () => {
  it('accepts a valid signed hashchain bundle', async () => {
    const bundle = await makeBundle();

    await expect(verifyBundleJson(JSON.stringify(bundle))).resolves.toMatchObject({
      valid: true,
    });
  });

  it('rejects a tampered payload', async () => {
    const bundle = await makeBundle();
    bundle.attestations[0].payload.statement = 'changed after signing';

    await expect(verifyBundleJson(JSON.stringify(bundle))).resolves.toMatchObject({
      valid: false,
    });
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

  return createEvidenceBundle([first, second], second.payload.id);
}

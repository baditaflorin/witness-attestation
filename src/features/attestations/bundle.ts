import { buildMerkleTree } from '../crypto/merkle';
import type { EvidenceBundle, SignedAttestation } from './types';
import { schemaVersion } from './types';

export async function createEvidenceBundle(
  attestations: SignedAttestation[],
  selectedEventId: string,
): Promise<EvidenceBundle> {
  if (attestations.length === 0) {
    throw new Error('No attestations are available to export.');
  }

  const selected = attestations.find(
    (attestation) => attestation.payload.id === selectedEventId,
  );

  if (!selected) {
    throw new Error('Selected attestation was not found in the chain.');
  }

  const tree = await buildMerkleTree(
    attestations.map((attestation) => attestation.eventHash),
  );

  return {
    schemaVersion,
    exportedAt: new Date().toISOString(),
    publicKey: selected.publicKey,
    selectedEventId,
    merkleRoot: tree.root,
    attestations,
  };
}

export function downloadEvidenceBundle(bundle: EvidenceBundle): void {
  const timestamp = bundle.exportedAt.replaceAll(':', '-');
  const blob = new Blob([`${JSON.stringify(bundle, null, 2)}\n`], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `witness-${timestamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

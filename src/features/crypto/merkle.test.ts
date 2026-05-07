import { describe, expect, it } from 'vitest';

import { hashText } from './hash';
import { buildMerkleTree, verifyMerkleProof } from './merkle';

describe('Merkle tree', () => {
  it('builds a verifiable proof for a leaf', async () => {
    const leaves = await Promise.all(['one', 'two', 'three'].map(hashText));
    const tree = await buildMerkleTree(leaves);
    const proof = tree.proofs.get(leaves[1]);

    expect(proof).toBeDefined();
    await expect(verifyMerkleProof(leaves[1], proof ?? [], tree.root)).resolves.toBe(
      true,
    );
  });
});

import { concatBytes, utf8Bytes } from './encoding';
import { getSodium } from './sodium';

export type MerkleProofStep = {
  position: 'left' | 'right';
  hash: string;
};

export type MerkleTree = {
  root: string;
  proofs: Map<string, MerkleProofStep[]>;
};

export async function buildMerkleTree(leaves: string[]): Promise<MerkleTree> {
  const sodium = await getSodium();

  if (leaves.length === 0) {
    const emptyRoot = sodium.to_hex(sodium.crypto_generichash(32, 'witness:empty:v1'));
    return { root: emptyRoot, proofs: new Map() };
  }

  type Node = {
    hash: string;
    leafIndexes: number[];
  };

  let level = leaves.map<Node>((hash, index) => ({ hash, leafIndexes: [index] }));
  const proofByIndex = new Map<number, MerkleProofStep[]>();
  leaves.forEach((_, index) => proofByIndex.set(index, []));

  while (level.length > 1) {
    const nextLevel: Node[] = [];

    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const hasRight = index + 1 < level.length;
      const right = hasRight ? level[index + 1] : left;
      const parentHash = hashNode(left.hash, right.hash, sodium);

      for (const leafIndex of left.leafIndexes) {
        proofByIndex.get(leafIndex)?.push({ position: 'right', hash: right.hash });
      }

      if (hasRight) {
        for (const leafIndex of right.leafIndexes) {
          proofByIndex.get(leafIndex)?.push({ position: 'left', hash: left.hash });
        }
      }

      nextLevel.push({
        hash: parentHash,
        leafIndexes: hasRight
          ? [...left.leafIndexes, ...right.leafIndexes]
          : left.leafIndexes,
      });
    }

    level = nextLevel;
  }

  return {
    root: level[0].hash,
    proofs: new Map(
      leaves.map((hash, index) => [hash, proofByIndex.get(index) ?? []] as const),
    ),
  };
}

export async function verifyMerkleProof(
  leaf: string,
  proof: MerkleProofStep[],
  expectedRoot: string,
): Promise<boolean> {
  const sodium = await getSodium();
  let current = leaf;

  for (const step of proof) {
    current =
      step.position === 'left'
        ? hashNode(step.hash, current, sodium)
        : hashNode(current, step.hash, sodium);
  }

  return current === expectedRoot;
}

function hashNode(
  leftHex: string,
  rightHex: string,
  sodium: Awaited<ReturnType<typeof getSodium>>,
): string {
  return sodium.to_hex(
    sodium.crypto_generichash(
      32,
      concatBytes([
        utf8Bytes('witness:merkle-node:v1'),
        sodium.from_hex(leftHex),
        sodium.from_hex(rightHex),
      ]),
    ),
  );
}

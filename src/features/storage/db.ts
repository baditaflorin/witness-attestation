import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { KeyRecord } from '../crypto/keys';
import type { SignedAttestation } from '../attestations/types';

type AttestationRecord = {
  id: string;
  chainIndex: number;
  createdAt: string;
  attestation: SignedAttestation;
};

interface WitnessDb extends DBSchema {
  keys: {
    key: 'primary';
    value: KeyRecord;
  };
  attestations: {
    key: string;
    value: AttestationRecord;
    indexes: {
      by_chain_index: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<WitnessDb>> | undefined;

function getDb(): Promise<IDBPDatabase<WitnessDb>> {
  dbPromise ??= openDB<WitnessDb>('witness-attestation-v1', 1, {
    upgrade(db) {
      db.createObjectStore('keys', { keyPath: 'id' });
      const attestations = db.createObjectStore('attestations', { keyPath: 'id' });
      attestations.createIndex('by_chain_index', 'chainIndex');
    },
  });

  return dbPromise;
}

export async function getKeyRecord(): Promise<KeyRecord | undefined> {
  return (await getDb()).get('keys', 'primary');
}

export async function saveKeyRecord(key: KeyRecord): Promise<void> {
  await (await getDb()).put('keys', key);
}

export async function listAttestations(): Promise<SignedAttestation[]> {
  const records = await (await getDb()).getAllFromIndex('attestations', 'by_chain_index');
  return records.map((record) => record.attestation);
}

export async function saveAttestation(attestation: SignedAttestation): Promise<void> {
  await (
    await getDb()
  ).put('attestations', {
    id: attestation.payload.id,
    chainIndex: attestation.payload.chain.index,
    createdAt: attestation.payload.createdAt,
    attestation,
  });
}

export async function clearAttestations(): Promise<void> {
  await (await getDb()).clear('attestations');
}

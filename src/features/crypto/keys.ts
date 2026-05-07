import { getSodium } from './sodium';

export type KeyRecord = {
  id: 'primary';
  createdAt: string;
  fingerprint: string;
  publicKey: string;
  privateKey: string;
};

export async function generateKeyRecord(now = new Date()): Promise<KeyRecord> {
  const sodium = await getSodium();
  const keys = sodium.crypto_sign_keypair();
  const variant = sodium.base64_variants.ORIGINAL_NO_PADDING;
  const publicKey = sodium.to_base64(keys.publicKey, variant);
  const privateKey = sodium.to_base64(keys.privateKey, variant);
  const fingerprint = sodium
    .to_hex(sodium.crypto_generichash(32, keys.publicKey))
    .slice(0, 24);

  return {
    id: 'primary',
    createdAt: now.toISOString(),
    fingerprint,
    publicKey,
    privateKey,
  };
}

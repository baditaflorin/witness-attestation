import type { CanonicalValue } from './canonical';
import { canonicalize } from './canonical';
import { getSodium } from './sodium';

export async function hashCanonical(value: CanonicalValue): Promise<string> {
  const sodium = await getSodium();
  return sodium.to_hex(sodium.crypto_generichash(32, canonicalize(value)));
}

export async function hashText(value: string): Promise<string> {
  const sodium = await getSodium();
  return sodium.to_hex(sodium.crypto_generichash(32, value));
}

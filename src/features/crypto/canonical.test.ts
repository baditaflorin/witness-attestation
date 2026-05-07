import { describe, expect, it } from 'vitest';

import { canonicalize } from './canonical';

describe('canonicalize', () => {
  it('sorts object keys recursively', () => {
    expect(canonicalize({ z: 1, a: { y: true, b: 'ok' } })).toBe(
      '{"a":{"b":"ok","y":true},"z":1}',
    );
  });

  it('rejects non-finite numbers', () => {
    expect(() => canonicalize({ value: Number.NaN })).toThrow(/non-finite/);
  });
});

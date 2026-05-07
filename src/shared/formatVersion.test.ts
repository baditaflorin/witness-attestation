import { describe, expect, it } from 'vitest';

import { formatVersionLabel } from './formatVersion';

describe('formatVersionLabel', () => {
  it('renders the version and commit in the public footer format', () => {
    expect(formatVersionLabel('0.1.0', 'abc123')).toBe('v0.1.0 · commit abc123');
  });
});

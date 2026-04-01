import { describe, it, expect } from 'vitest';
import { formatRelativeTime, formatDateLong } from '@/lib/dateUtils';

describe('dateUtils', () => {
  it('returns Just now for current date', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('Just now');
  });

  it('returns days ago for older dates', () => {
    const twoDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toMatch(/2 days ago|2d ago|2 days ago/);
  });

  it('formats long date', () => {
    const date = new Date('2023-04-01T12:00:00Z').toISOString();
    const out = formatDateLong(date);
    expect(out).toMatch(/2023/);
  });
});

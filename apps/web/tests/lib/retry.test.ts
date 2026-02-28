/**
 * Unit tests for retry utility
 */

import { describe, it, expect, vi } from 'vitest';
import { retry, retryFirebase, retryApi } from '../../src/lib/retry';

interface MockHttpError extends Error {
  status: number;
}

describe('retry', () => {
  it('returns result on first successful call', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce('success');

    const result = await retry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  }, 10000);

  it('stops retrying after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(retry(fn, { maxAttempts: 2 })).rejects.toThrow('Network error');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('respects retry condition', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Client error'));
    const retryCondition = vi.fn().mockReturnValue(false);

    await expect(retry(fn, { retryCondition })).rejects.toThrow('Client error');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(retryCondition).toHaveBeenCalledWith(new Error('Client error'));
  });
});

describe('retryFirebase', () => {
  it('retries on Firebase unavailable errors', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('unavailable'))
      .mockResolvedValueOnce('success');

    const result = await retryFirebase(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry on permission errors', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('permission-denied'));

    await expect(retryFirebase(fn)).rejects.toThrow('permission-denied');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('retryApi', () => {
  it('retries on network errors', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Network request failed'))
      .mockResolvedValueOnce('success');

    const result = await retryApi(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry on 4xx errors', async () => {
    const error = new Error('Bad request');
    (error as MockHttpError).status = 400;
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retryApi(fn)).rejects.toThrow('Bad request');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on 5xx errors', async () => {
    const error = new Error('Server error');
    (error as MockHttpError).status = 500;
    const fn = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success');

    const result = await retryApi(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
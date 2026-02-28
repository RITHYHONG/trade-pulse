import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recordView } from '../../src/hooks/use-view-count';

describe('recordView', () => {
  beforeEach(() => {
    // Provide simple global objects expected by the hook
    // @ts-ignore
    global.localStorage = {
      store: {},
      getItem(key: string) { return this.store[key] ?? null; },
      setItem(key: string, value: string) { this.store[key] = String(value); },
      removeItem(key: string) { delete this.store[key]; },
      clear() { this.store = {}; }
    };
    // Ensure `window` is defined so the hook thinks it's running client-side
    // @ts-ignore
    global.window = global;

    vi.restoreAllMocks();
  });

  it('should call fetch and set localStorage on first call', async () => {
    const fakeFetch = vi.fn(() => Promise.resolve({ 
      ok: true,
      json: () => Promise.resolve({ success: true })
    })) as unknown as typeof fetch;
    // @ts-ignore
    global.fetch = fakeFetch;

    await recordView('post-1', { ttlHours: 1, requireConsent: false });

    expect(fakeFetch).toHaveBeenCalledTimes(1);
    const item = localStorage.getItem('post_view_post-1');
    expect(item).toBeTruthy();
  });

  it('should not call fetch again if within TTL', async () => {
    const fakeFetch = vi.fn(() => Promise.resolve({ ok: true })) as unknown as typeof fetch;
    // @ts-ignore
    global.fetch = fakeFetch;

    const now = Date.now();
    localStorage.setItem('post_view_post-2', String(now));

    await recordView('post-2', { ttlHours: 1, requireConsent: false });

    expect(fakeFetch).not.toHaveBeenCalled();
  });
});
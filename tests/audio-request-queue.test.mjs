import { describe, expect, it } from 'vitest';
import { runAudioRequestQueue } from '../scripts/lib/audio-request-queue.mjs';

const delay = () => new Promise(resolve => setTimeout(resolve, 2));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

describe('offline audio request queue', () => {
  it('bounds network concurrency, journals before sending, and serializes durable writes', async () => {
    const prepared = new Set(), completed = new Set(), sent = [];
    const firstWave = deferred();
    let requests = 0, peak = 0, writes = 0, peakWrites = 0;
    const write = async action => {
      writes++; peakWrites = Math.max(peakWrites, writes);
      await delay(); action(); writes--;
    };
    await runAudioRequestQueue([1, 2, 3, 4, 5, 6, 7], {
      concurrency: 3,
      prepare: item => write(() => prepared.add(item)),
      request: async item => {
        expect(prepared.has(item)).toBe(true);
        sent.push(item); requests++; peak = Math.max(peak, requests);
        if (sent.length === 3) firstWave.resolve();
        await firstWave.promise;
        await delay();
        requests--; return `audio-${item}`;
      },
      complete: (item, result) => write(() => {
        expect(result).toBe(`audio-${item}`); completed.add(item);
      }),
      fail: () => { throw new Error('Unexpected request failure'); },
    });
    expect(peak).toBe(3);
    expect(peakWrites).toBe(1);
    expect(sent.sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(completed.size).toBe(7);
  });

  it('stops new requests after an error and waits for every in-flight receipt to be saved', async () => {
    const first = deferred(), second = deferred(), bothStarted = deferred(), failed = deferred();
    const sent = [], saved = [];
    let settled = false;
    const result = runAudioRequestQueue([1, 2, 3, 4], {
      concurrency: 2, prepare: async () => {},
      request: item => {
        sent.push(item); if (sent.length === 2) bothStarted.resolve();
        return item === 1 ? first.promise : second.promise;
      },
      complete: async item => { saved.push(item); },
      fail: async (item, error) => { expect(item).toBe(1); expect(error.message).toBe('provider failed'); failed.resolve(); },
    }).then(() => { settled = true; return null; }, error => { settled = true; return error; });
    await bothStarted.promise;
    first.reject(new Error('provider failed'));
    await failed.promise;
    expect(settled).toBe(false);
    expect(sent).toEqual([1, 2]);
    second.resolve('valid audio');
    expect((await result).message).toBe('provider failed');
    expect(saved).toEqual([2]);
    expect(sent).toEqual([1, 2]);
  });

  it('never sends a paid request if its initial journal checkpoint failed', async () => {
    const sent = [];
    await expect(runAudioRequestQueue([1, 2, 3], {
      concurrency: 3,
      prepare: async () => { throw new Error('disk full'); },
      request: async item => { sent.push(item); },
      complete: async () => {}, fail: async () => {},
    })).rejects.toThrow('disk full');
    expect(sent).toEqual([]);
  });

  it('records reconciliation after a local save fails without repeating synthesis', async () => {
    const sent = [], failed = [];
    await expect(runAudioRequestQueue([1, 2], {
      prepare: async () => {}, request: async item => { sent.push(item); return 'audio'; },
      complete: async () => { throw new Error('rename failed'); },
      fail: async item => { failed.push(item); },
    })).rejects.toThrow('rename failed');
    expect(sent).toEqual([1]); expect(failed).toEqual([1]);
  });

  it('rejects unbounded or unsupported concurrency before doing work', async () => {
    for (const concurrency of [0, 4, 1.5, Infinity]) {
      await expect(runAudioRequestQueue([1], {concurrency})).rejects.toThrow('1 to 3');
    }
  });
});

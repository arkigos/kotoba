/** Overlap network requests, but serialize all durable request/catalog updates.
 * On failure, stop admitting work and settle every in-flight request before the
 * caller releases its writer lock. No request is retried by this queue.
 */
export async function runAudioRequestQueue(items, { concurrency = 1, prepare, request, complete, fail }) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 3) {
    throw new Error('Audio concurrency must be an integer from 1 to 3.');
  }
  let next = 0, firstError;
  let writes = Promise.resolve();
  const serialize = operation => {
    const result = writes.then(operation);
    writes = result.catch(() => {});
    return result;
  };
  async function worker() {
    for (;;) {
      const item = await serialize(async () => {
        if (firstError || next === items.length) return undefined;
        const candidate = items[next++];
        try { await prepare(candidate); return candidate; }
        catch (error) { firstError ??= error; return undefined; }
      });
      if (item === undefined) return;
      try {
        const result = await request(item);
        await serialize(async () => {
          try { await complete(item, result); }
          catch (error) { firstError ??= error; throw error; }
        });
      } catch (error) {
        firstError ??= error;
        try { await serialize(() => fail(item, error)); }
        catch (saveError) {
          firstError = new AggregateError([firstError, saveError], 'Audio request failed and its reconciliation record could not be saved.');
        }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  if (firstError) throw firstError;
}

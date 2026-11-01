const MAX_CACHED_PHRASES = 50;

export type CacheTouch = { order: string[]; evicted: string[] };

// Most recently used last; anything past the limit falls off the front.
export function touchCache(
  order: readonly string[],
  key: string,
  limit = MAX_CACHED_PHRASES,
): CacheTouch {
  const next = [...order.filter((cached) => cached !== key), key];
  const overflow = Math.max(next.length - limit, 0);
  return { order: next.slice(overflow), evicted: next.slice(0, overflow) };
}

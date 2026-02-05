/**
 * Tiny in-memory TTL cache.
 * Key = user input (lowercased). Value = suggestions array.
 */
const store = new Map();

function getCache(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value;
}

function setCache(key, value, ttlMs) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

module.exports = { getCache, setCache };

const cache = new Map();
export const getCached = async (key, fetcher) => {
  if (cache.has(key)) return cache.get(key);
  const result = await fetcher();
  cache.set(key, result);
  return result;
};
export const clearCache = () => cache.clear();

const createStorage = (getStore) => ({
  get(key, fallback = null) {
    try {
      const raw = getStore().getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      getStore().setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable (private mode, quota); the app keeps working in memory.
    }
  },
  remove(key) {
    try {
      getStore().removeItem(key);
    } catch {
      // Ignore unavailable storage.
    }
  },
});

export const local = createStorage(() => window.localStorage);
export const session = createStorage(() => window.sessionStorage);

/**
 * Persistence abstraction for ReleaseHub
 */

const STORAGE_VERSION = '1.0';
const PERSISTENCE_PREFIX = 'releasehub_';

export interface PersistencePayload<T> {
  data: T;
  _version: string;
  _updatedAt: string;
}

export const persistence = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(`${PERSISTENCE_PREFIX}${key}`);
      if (!item) return defaultValue;
      
      const parsed = JSON.parse(item) as PersistencePayload<T>;
      
      // Handle legacy records without payload wrapper
      if (!parsed || parsed._version === undefined) {
        return (parsed as unknown) as T;
      }

      // Version Migration Logic (Skeleton)
      if (parsed._version !== STORAGE_VERSION) {
        console.warn(`[Persistence] Version mismatch for ${key}. Expected ${STORAGE_VERSION}, got ${parsed._version}.`);
        // Add migration logic if needed in future
        return defaultValue;
      }
      
      return parsed.data;
    } catch (error) {
      console.error(`[Persistence] Failed to parse key "${key}". Storage may be corrupted.`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      const payload: PersistencePayload<T> = {
        data: value,
        _version: STORAGE_VERSION,
        _updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`${PERSISTENCE_PREFIX}${key}`, JSON.stringify(payload));
    } catch (error) {
      console.error(`[Persistence] Failed to set key "${key}"`, error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(`${PERSISTENCE_PREFIX}${key}`);
  },

  clear: (): void => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PERSISTENCE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },

  /**
   * Diagnostics for hardened production monitoring
   */
  getDiagnostics: () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PERSISTENCE_PREFIX));
    return {
      totalKeys: keys.length,
      prefix: PERSISTENCE_PREFIX,
      version: STORAGE_VERSION,
      keys: keys.map(k => k.replace(PERSISTENCE_PREFIX, '')),
    };
  }
};


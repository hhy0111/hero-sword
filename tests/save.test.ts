import { describe, expect, it } from 'vitest';
import { loadSnapshot } from '../src/game/services/save';

const SAVE_KEY = 'hero-sword-save-v1';

describe('save normalization', () => {
  it('migrates legacy 1000 point fatigue saves onto the 100 point scale', () => {
    const storage = createMemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: storage,
      configurable: true,
      writable: true,
    });

    storage.setItem(
      SAVE_KEY,
      JSON.stringify({
        schemaVersion: 3,
        createdAt: Date.UTC(2026, 3, 3, 0, 0, 0),
        updatedAt: Date.UTC(2026, 3, 3, 0, 0, 0),
        profile: {
          fatigue: 970,
          maxFatigue: 1000,
        },
      }),
    );

    const snapshot = loadSnapshot();

    expect(snapshot.profile.fatigue).toBe(97);
    expect(snapshot.profile.maxFatigue).toBe(100);
  });

  it('caps full legacy fatigue at the new maximum', () => {
    const storage = createMemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: storage,
      configurable: true,
      writable: true,
    });

    storage.setItem(
      SAVE_KEY,
      JSON.stringify({
        schemaVersion: 3,
        createdAt: Date.UTC(2026, 3, 3, 0, 0, 0),
        updatedAt: Date.UTC(2026, 3, 3, 0, 0, 0),
        profile: {
          fatigue: 1000,
          maxFatigue: 1000,
        },
      }),
    );

    const snapshot = loadSnapshot();

    expect(snapshot.profile.fatigue).toBe(100);
    expect(snapshot.profile.maxFatigue).toBe(100);
  });
});

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.get(key) ?? null;
    },
    key(index) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key) {
      store.delete(key);
    },
    setItem(key, value) {
      store.set(key, value);
    },
  };
}

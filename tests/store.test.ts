import { describe, expect, it } from 'vitest';
import { createInitialSnapshot } from '../src/game/core/state';
import { applyPurchasedProduct } from '../src/platform/store';
import { loadSnapshot, saveSnapshot } from '../src/game/services/save';

describe('store grants', () => {
  it('applies the starter pack once and records ownership', () => {
    const now = Date.UTC(2026, 3, 4, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    const goldBefore = snapshot.profile.gold;
    const gemsBefore = snapshot.profile.premiumCurrency;

    const applied = applyPurchasedProduct(snapshot, 'hs_pack_beginner_01', now);

    expect(applied.applied).toBe(true);
    expect(applied.snapshot.profile.gold).toBe(goldBefore + 500);
    expect(applied.snapshot.profile.premiumCurrency).toBe(gemsBefore + 300);
    expect(applied.snapshot.profile.ownedProductIds).toContain('hs_pack_beginner_01');

    const duplicate = applyPurchasedProduct(applied.snapshot, 'hs_pack_beginner_01', now);
    expect(duplicate.applied).toBe(false);
  });

  it('caps fatigue rewards from consumable products at max fatigue', () => {
    const now = Date.UTC(2026, 3, 4, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    snapshot.profile.fatigue = 90;

    const applied = applyPurchasedProduct(snapshot, 'hs_fatigue_small_01', now);

    expect(applied.applied).toBe(true);
    expect(applied.snapshot.profile.fatigue).toBe(100);
  });

  it('applies the large paid fatigue pack on the new scale', () => {
    const now = Date.UTC(2026, 3, 4, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    snapshot.profile.fatigue = 12;

    const applied = applyPurchasedProduct(snapshot, 'hs_fatigue_large_01', now);

    expect(applied.applied).toBe(true);
    expect(applied.snapshot.profile.fatigue).toBe(57);
  });

  it('keeps purchased product grants after save and load', () => {
    const storage = createMemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: storage,
      configurable: true,
      writable: true,
    });

    const now = Date.UTC(2026, 3, 4, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    const applied = applyPurchasedProduct(snapshot, 'hs_pack_beginner_01', now);

    expect(applied.applied).toBe(true);
    saveSnapshot(applied.snapshot);

    const reloaded = loadSnapshot();
    expect(reloaded.profile.ownedProductIds).toContain('hs_pack_beginner_01');
    expect(reloaded.profile.gold).toBe(applied.snapshot.profile.gold);
    expect(reloaded.profile.premiumCurrency).toBe(applied.snapshot.profile.premiumCurrency);
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

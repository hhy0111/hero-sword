import { describe, expect, it } from 'vitest';
import { runtimeConfig } from '../src/config/runtime';
import { CASH_PRODUCTS } from '../src/game/data/cashProducts';
import { applyPurchasedProduct } from '../src/platform/store';
import { createInitialSnapshot } from '../src/game/core/state';

const REGISTERED_PRODUCT_IDS = [
  'hs_pack_beginner_01',
  'hs_fatigue_small_01',
  'hs_paid_ten_summon_01',
  'hs_fatigue_large_01',
  'hs_gem_bundle_01',
] as const;

describe('registered monetization products', () => {
  it('keeps the runtime product list aligned with Google Play product IDs', () => {
    expect(runtimeConfig.iap.products.map((product) => product.id)).toEqual(REGISTERED_PRODUCT_IDS);
  });

  it('applies the registered gem bundle grant', () => {
    const snapshot = createInitialSnapshot(Date.UTC(2026, 4, 19));
    const before = snapshot.profile.premiumCurrency;

    const applied = applyPurchasedProduct(snapshot, 'hs_gem_bundle_01');

    expect(applied.applied).toBe(true);
    expect(applied.snapshot.profile.premiumCurrency).toBe(before + 980);
  });

  it('shows every registered store product except paid ten summon in the cash shop', () => {
    expect(CASH_PRODUCTS.map((product) => product.id)).toEqual([
      'hs_pack_beginner_01',
      'hs_fatigue_small_01',
      'hs_fatigue_large_01',
      'hs_gem_bundle_01',
    ]);
  });
});

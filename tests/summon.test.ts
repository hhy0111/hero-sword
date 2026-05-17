import { describe, expect, it } from 'vitest';
import { canPerformAdTenSummon, performAdTenSummon, performPaidTenSummon, performSummon } from '../src/game/core/summon';
import { createInitialSnapshot } from '../src/game/core/state';

describe('summon flow', () => {
  it('consumes premium currency and grants ten-pull high rarity guarantee', () => {
    const snapshot = createInitialSnapshot();
    const rolls = [0.8, 0.1, 0.8, 0.2, 0.8, 0.3, 0.8, 0.4, 0.8, 0.5, 0.18, 0.2];
    let index = 0;
    const random = () => {
      const value = rolls[index] ?? 0.1;
      index += 1;
      return value;
    };

    const result = performSummon(snapshot, 'ten', 'featured_hero', random);

    expect(result.ok).toBe(true);
    expect(result.results).toHaveLength(10);
    expect(result.results.some((entry) => entry.rarity >= 4)).toBe(true);
    expect(result.snapshot.profile.premiumCurrency).toBe(snapshot.profile.premiumCurrency - 1500);
  });

  it('rejects summon when currency is low', () => {
    const snapshot = createInitialSnapshot();
    snapshot.profile.premiumCurrency = 0;

    const result = performSummon(snapshot, 'single', 'featured_hero');

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('currency_low');
  });

  it('runs paid ten-pull without consuming premium currency', () => {
    const snapshot = createInitialSnapshot();
    snapshot.profile.premiumCurrency = 0;
    const rolls = [0.8, 0.1, 0.8, 0.2, 0.8, 0.3, 0.8, 0.4, 0.8, 0.5, 0.18, 0.2];
    let index = 0;
    const random = () => {
      const value = rolls[index] ?? 0.1;
      index += 1;
      return value;
    };

    const result = performPaidTenSummon(snapshot, 'featured_hero', random);

    expect(result.ok).toBe(true);
    expect(result.results).toHaveLength(10);
    expect(result.cost).toBe(0);
    expect(result.snapshot.profile.premiumCurrency).toBe(0);
    expect(result.results.some((entry) => entry.rarity >= 4)).toBe(true);
  });

  it('uses banner pickup pool when featured roll succeeds', () => {
    const snapshot = createInitialSnapshot();
    const rolls = [0.01, 0.01, 0.01];
    let index = 0;
    const random = () => {
      const value = rolls[index] ?? 0.01;
      index += 1;
      return value;
    };

    const result = performSummon(snapshot, 'single', 'featured_hero', random);

    expect(result.ok).toBe(true);
    expect(result.results[0].id).toBe('seraphin');
  });

  it('runs ad ten-pull as a weaker once-per-day reward', () => {
    const now = new Date(2026, 4, 12, 10, 0, 0).getTime();
    const snapshot = createInitialSnapshot(now);
    const random = () => 0.99;

    const result = performAdTenSummon(snapshot, 'featured_hero', now, random);

    expect(result.ok).toBe(true);
    expect(result.results).toHaveLength(10);
    expect(result.cost).toBe(0);
    expect(result.snapshot.profile.premiumCurrency).toBe(snapshot.profile.premiumCurrency);
    expect(result.results.every((entry) => entry.rarity <= 4)).toBe(true);
    expect(result.results.every((entry) => entry.rarity === 3)).toBe(true);
    expect(canPerformAdTenSummon(result.snapshot, now)).toBe(false);
  });

  it('rejects ad ten-pull after it was used on the same day', () => {
    const now = new Date(2026, 4, 12, 10, 0, 0).getTime();
    const tomorrow = new Date(2026, 4, 13, 10, 0, 0).getTime();
    const first = performAdTenSummon(createInitialSnapshot(now), 'featured_hero', now, () => 0.99);

    expect(first.ok).toBe(true);

    const second = performAdTenSummon(first.snapshot, 'featured_hero', now, () => 0.99);
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('daily_ad_used');

    const nextDay = performAdTenSummon(first.snapshot, 'featured_hero', tomorrow, () => 0.99);
    expect(nextDay.ok).toBe(true);
  });
});

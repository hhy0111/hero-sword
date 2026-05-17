import { describe, expect, it } from 'vitest';
import { resolveAdUnitForConfig, TEST_AD_UNITS } from '../src/platform/ads';

describe('ad unit resolution', () => {
  it('uses official Google test ids when placeholders remain in test mode', () => {
    const config: Parameters<typeof resolveAdUnitForConfig>[1] = {
      useTestAds: true,
      units: {
        banner: 'YOUR_VALUE_HERE_BANNER_UNIT_ID',
        interstitial: 'YOUR_VALUE_HERE_INTERSTITIAL_UNIT_ID',
        rewardedFatigue: 'YOUR_VALUE_HERE_REWARDED_FATIGUE_UNIT_ID',
        rewardedGacha: 'YOUR_VALUE_HERE_REWARDED_GACHA_UNIT_ID',
        rewardedFatigueAdTenSummon: 'YOUR_VALUE_HERE_REWARDED_FATIGUE_AD_TEN_SUMMON_UNIT_ID',
      },
    };

    expect(resolveAdUnitForConfig('banner', config)).toBe(TEST_AD_UNITS.banner);
    expect(resolveAdUnitForConfig('interstitial', config)).toBe(TEST_AD_UNITS.interstitial);
    expect(resolveAdUnitForConfig('rewardedFatigue', config)).toBe(TEST_AD_UNITS.rewardedFatigue);
    expect(resolveAdUnitForConfig('rewardedGacha', config)).toBe(TEST_AD_UNITS.rewardedGacha);
    expect(resolveAdUnitForConfig('rewardedFatigueAdTenSummon', config)).toBe(TEST_AD_UNITS.rewardedFatigueAdTenSummon);
  });

  it('uses official Google test ids in test mode even when live ids are configured', () => {
    const config: Parameters<typeof resolveAdUnitForConfig>[1] = {
      useTestAds: true,
      units: {
        banner: 'ca-app-pub-live/banner',
        interstitial: 'ca-app-pub-live/interstitial',
        rewardedFatigue: 'ca-app-pub-live/rewarded-fatigue',
        rewardedGacha: 'ca-app-pub-live/rewarded-gacha',
        rewardedFatigueAdTenSummon: 'ca-app-pub-live/rewarded-fatigue-ad-ten-summon',
      },
    };

    expect(resolveAdUnitForConfig('banner', config)).toBe(TEST_AD_UNITS.banner);
    expect(resolveAdUnitForConfig('interstitial', config)).toBe(TEST_AD_UNITS.interstitial);
    expect(resolveAdUnitForConfig('rewardedFatigue', config)).toBe(TEST_AD_UNITS.rewardedFatigue);
    expect(resolveAdUnitForConfig('rewardedGacha', config)).toBe(TEST_AD_UNITS.rewardedGacha);
    expect(resolveAdUnitForConfig('rewardedFatigueAdTenSummon', config)).toBe(TEST_AD_UNITS.rewardedFatigueAdTenSummon);
  });

  it('preserves configured live ids when test mode is disabled', () => {
    const config: Parameters<typeof resolveAdUnitForConfig>[1] = {
      useTestAds: false,
      units: {
        banner: 'ca-app-pub-live/banner',
        interstitial: 'ca-app-pub-live/interstitial',
        rewardedFatigue: 'ca-app-pub-live/rewarded-fatigue',
        rewardedGacha: 'ca-app-pub-live/rewarded-gacha',
        rewardedFatigueAdTenSummon: 'ca-app-pub-live/rewarded-fatigue-ad-ten-summon',
      },
    };

    expect(resolveAdUnitForConfig('banner', config)).toBe('ca-app-pub-live/banner');
    expect(resolveAdUnitForConfig('interstitial', config)).toBe('ca-app-pub-live/interstitial');
    expect(resolveAdUnitForConfig('rewardedFatigue', config)).toBe('ca-app-pub-live/rewarded-fatigue');
    expect(resolveAdUnitForConfig('rewardedGacha', config)).toBe('ca-app-pub-live/rewarded-gacha');
    expect(resolveAdUnitForConfig('rewardedFatigueAdTenSummon', config)).toBe('ca-app-pub-live/rewarded-fatigue-ad-ten-summon');
  });
});

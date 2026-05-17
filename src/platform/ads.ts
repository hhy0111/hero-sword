import { runtimeConfig } from '../config/runtime';
import { isNativeAndroid } from './capacitor';

export interface RewardedAdResult {
  granted: boolean;
  rewardType: string;
  amount: number;
  source: 'native' | 'web-fallback';
}

export const TEST_AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewardedFatigue: 'ca-app-pub-3940256099942544/5224354917',
  rewardedGacha: 'ca-app-pub-3940256099942544/5224354917',
  rewardedFatigueAdTenSummon: 'ca-app-pub-3940256099942544/5224354917',
} as const;

type AdUnitKind = keyof typeof runtimeConfig.ads.units;
export interface ResolvableAdsConfig {
  useTestAds: boolean;
  units: Record<AdUnitKind, string>;
}

let adsInitialized = false;

export async function initializeAds(): Promise<void> {
  if (!isNativeAndroid() || adsInitialized) {
    return;
  }

  const { AdMob, MaxAdContentRating } = await import('@capacitor-community/admob');

  await AdMob.initialize({
    initializeForTesting: runtimeConfig.ads.useTestAds,
    testingDevices: [...runtimeConfig.ads.testDeviceIds],
    tagForChildDirectedTreatment: false,
    tagForUnderAgeOfConsent: false,
    maxAdContentRating: MaxAdContentRating.Teen,
  });

  adsInitialized = true;
}

export async function showVillageBanner(): Promise<void> {
  if (!isNativeAndroid()) {
    return;
  }

  const { AdMob, BannerAdPosition, BannerAdSize } = await import('@capacitor-community/admob');

  await initializeAds();
  await AdMob.showBanner({
    adId: resolveAdUnit('banner'),
    adSize: BannerAdSize.BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: runtimeConfig.ads.useTestAds,
  });
}

export async function hideVillageBanner(): Promise<void> {
  if (!isNativeAndroid()) {
    return;
  }

  const { AdMob } = await import('@capacitor-community/admob');
  await AdMob.hideBanner();
}

export async function showResultInterstitial(): Promise<void> {
  if (!isNativeAndroid()) {
    return;
  }

  const { AdMob } = await import('@capacitor-community/admob');

  await initializeAds();
  await AdMob.prepareInterstitial({
    adId: resolveAdUnit('interstitial'),
    isTesting: runtimeConfig.ads.useTestAds,
  });
  await AdMob.showInterstitial();
}

export async function showRewardedFatigueAd(): Promise<RewardedAdResult> {
  return showRewardedAd('rewardedFatigue', runtimeConfig.ads.reward.type, runtimeConfig.ads.reward.amount);
}

export async function showRewardedGachaAd(): Promise<RewardedAdResult> {
  return showRewardedAd('rewardedGacha', 'ad_ten_summon', 10);
}

async function showRewardedAd(
  unitKind: Extract<AdUnitKind, 'rewardedFatigue' | 'rewardedGacha'>,
  fallbackRewardType: string,
  fallbackAmount: number,
): Promise<RewardedAdResult> {
  if (!isNativeAndroid()) {
    return {
      granted: true,
      rewardType: fallbackRewardType,
      amount: fallbackAmount,
      source: 'web-fallback',
    };
  }

  const { AdMob } = await import('@capacitor-community/admob');

  await initializeAds();
  await AdMob.prepareRewardVideoAd({
    adId: resolveAdUnit(unitKind),
    isTesting: runtimeConfig.ads.useTestAds,
  });

  const reward = await AdMob.showRewardVideoAd();

  return {
    granted: true,
    rewardType: reward.type || fallbackRewardType,
    amount: Number(reward.amount ?? fallbackAmount),
    source: 'native',
  };
}

function resolveAdUnit(kind: keyof typeof runtimeConfig.ads.units): string {
  return resolveAdUnitForConfig(kind, runtimeConfig.ads);
}

export function resolveAdUnitForConfig(kind: AdUnitKind, adsConfig: ResolvableAdsConfig): string {
  const configured = adsConfig.units[kind];

  if (adsConfig.useTestAds) {
    return TEST_AD_UNITS[kind];
  }

  return configured;
}

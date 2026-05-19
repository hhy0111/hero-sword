import { appMetadata } from './appMetadata';

function isLocalDebugHost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
}

const enableLocalDevTools =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' || isLocalDebugHost();
const useTestAds = import.meta.env.DEV || import.meta.env.VITE_USE_TEST_ADS === 'true';
const useMockStoreResults =
  import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_STORE_RESULTS === 'true';

export const runtimeConfig = {
  app: appMetadata,
  devTools: {
    showAnimationViewerMenu: enableLocalDevTools,
    showAssetStatusMenu: enableLocalDevTools,
  },
  ads: {
    sdk: '@capacitor-community/admob',
    appId: 'ca-app-pub-4402708884038037~1307706218',
    units: {
      banner: 'ca-app-pub-4402708884038037/9732991146',
      interstitial: 'ca-app-pub-4402708884038037/8162705869',
      rewardedFatigue: 'ca-app-pub-4402708884038037/1122654798',
      rewardedGacha: 'ca-app-pub-4402708884038037/7909378821',
      rewardedFatigueAdTenSummon: 'ca-app-pub-4402708884038037/4329455374',
    },
    reward: {
      type: 'fatigue',
      amount: 6,
    },
    useTestAds,
    testDeviceIds: ['TEST_DEVICE_ID'],
  },
  iap: {
    provider: '@revenuecat/purchases-capacitor',
    androidApiKey: import.meta.env.VITE_REVENUECAT_ANDROID_API_KEY ?? 'YOUR_VALUE_HERE_REVENUECAT_ANDROID_API_KEY',
    mockWebResults: useMockStoreResults,
    products: [
      {
        id: 'hs_pack_beginner_01',
        category: 'NON_SUBSCRIPTION',
        priceLabel: '₩1,500',
        grant: {
          gold: 500,
          premiumCurrency: 300,
          fatigue: 9,
          onceOnly: true,
        },
      },
      {
        id: 'hs_fatigue_small_01',
        category: 'NON_SUBSCRIPTION',
        priceLabel: '₩1,200',
        grant: {
          gold: 0,
          premiumCurrency: 0,
          fatigue: 18,
          onceOnly: false,
        },
      },
      {
        id: 'hs_paid_ten_summon_01',
        category: 'NON_SUBSCRIPTION',
        priceLabel: '₩1,500',
        grant: {
          gold: 0,
          premiumCurrency: 0,
          fatigue: 0,
          onceOnly: false,
        },
      },
      {
        id: 'hs_fatigue_large_01',
        category: 'NON_SUBSCRIPTION',
        priceLabel: '₩2,400',
        grant: {
          gold: 0,
          premiumCurrency: 0,
          fatigue: 45,
          onceOnly: false,
        },
      },
      {
        id: 'hs_gem_bundle_01',
        category: 'NON_SUBSCRIPTION',
        priceLabel: '₩7,900',
        grant: {
          gold: 0,
          premiumCurrency: 980,
          fatigue: 0,
          onceOnly: false,
        },
      },
    ],
  },
} as const;

export type RuntimeConfig = typeof runtimeConfig;

export function isAnimationViewerMenuEnabled(): boolean {
  return runtimeConfig.devTools.showAnimationViewerMenu;
}

export function isAssetStatusMenuEnabled(): boolean {
  return runtimeConfig.devTools.showAssetStatusMenu;
}

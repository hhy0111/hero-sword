import { runtimeConfig } from '../config/runtime';
import type { SaveSnapshot } from '../game/types';
import { isNativeAndroid } from './capacitor';

export interface StoreProductView {
  id: string;
  title: string;
  priceLabel: string;
  source: 'native' | 'config';
}

export interface PurchaseOutcome {
  ok: boolean;
  productId: string;
  source: 'native' | 'web-fallback';
  message: string;
}

interface ProductGrantResult {
  snapshot: SaveSnapshot;
  applied: boolean;
  message: string;
}

let purchasesConfigured = false;

export async function initializePurchases(): Promise<void> {
  if (!isNativeAndroid() || purchasesConfigured) {
    return;
  }

  if (runtimeConfig.iap.androidApiKey.startsWith('YOUR_VALUE_HERE')) {
    return;
  }

  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  await Purchases.configure({
    apiKey: runtimeConfig.iap.androidApiKey,
  });
  purchasesConfigured = true;
}

export async function listStoreProducts(): Promise<StoreProductView[]> {
  if (!isNativeAndroid()) {
    return runtimeConfig.iap.products.map((product) => ({
      id: product.id,
      title: mapProductTitle(product.id),
      priceLabel: product.priceLabel,
      source: 'config',
    }));
  }

  await initializePurchases();

  if (!purchasesConfigured) {
    return runtimeConfig.iap.products.map((product) => ({
      id: product.id,
      title: mapProductTitle(product.id),
      priceLabel: product.priceLabel,
      source: 'config',
    }));
  }

  const { Purchases, PRODUCT_CATEGORY } = await import('@revenuecat/purchases-capacitor');
  const { products } = await Purchases.getProducts({
    productIdentifiers: runtimeConfig.iap.products.map((product) => product.id),
    type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
  });

  return runtimeConfig.iap.products.map((product) => {
    const storeProduct = products.find((entry) => entry.identifier === product.id);

    return {
      id: product.id,
      title: storeProduct?.title ?? mapProductTitle(product.id),
      priceLabel: storeProduct?.priceString ?? product.priceLabel,
      source: storeProduct ? 'native' : 'config',
    };
  });
}

export async function purchaseConfiguredProduct(productId: string): Promise<PurchaseOutcome> {
  if (!isNativeAndroid()) {
    return {
      ok: true,
      productId,
      source: 'web-fallback',
      message: '웹 개발 환경 모의 구매가 적용되었습니다.',
    };
  }

  await initializePurchases();

  if (!purchasesConfigured) {
    return {
      ok: false,
      productId,
      source: 'native',
      message: 'RevenueCat Android API Key가 비어 있어 구매를 시작하지 않았습니다.',
    };
  }

  const { Purchases, PRODUCT_CATEGORY } = await import('@revenuecat/purchases-capacitor');
  const { products } = await Purchases.getProducts({
    productIdentifiers: [productId],
    type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
  });
  const target = products[0];

  if (!target) {
    return {
      ok: false,
      productId,
      source: 'native',
      message: 'Google Play/RevenueCat 상품을 찾지 못했습니다.',
    };
  }

  await Purchases.purchaseStoreProduct({ product: target });

  return {
    ok: true,
    productId,
    source: 'native',
    message: '실구매가 완료되어 보상을 적용했습니다.',
  };
}

export async function restorePurchasesFromStore(): Promise<PurchaseOutcome> {
  if (!isNativeAndroid()) {
    return {
      ok: true,
      productId: 'restore',
      source: 'web-fallback',
      message: '웹 개발 환경에서는 복원할 결제 내역이 없습니다.',
    };
  }

  await initializePurchases();

  if (!purchasesConfigured) {
    return {
      ok: false,
      productId: 'restore',
      source: 'native',
      message: 'RevenueCat Android API Key가 비어 있어 복원을 시작하지 않았습니다.',
    };
  }

  const { Purchases } = await import('@revenuecat/purchases-capacitor');
  await Purchases.restorePurchases();

  return {
    ok: true,
    productId: 'restore',
    source: 'native',
    message: '스토어 복원 요청을 완료했습니다.',
  };
}

export function applyPurchasedProduct(
  snapshot: SaveSnapshot,
  productId: string,
  now = Date.now(),
): ProductGrantResult {
  const product = runtimeConfig.iap.products.find((entry) => entry.id === productId);

  if (!product) {
    return {
      snapshot,
      applied: false,
      message: '설정된 상품 정의를 찾지 못했습니다.',
    };
  }

  if (product.grant.onceOnly && snapshot.profile.ownedProductIds.includes(productId)) {
    return {
      snapshot,
      applied: false,
      message: '이미 지급된 1회성 상품입니다.',
    };
  }

  return {
    applied: true,
    message: product.grant.onceOnly
      ? '1회성 상품 보상을 적용했습니다.'
      : '소모성 상품 보상을 적용했습니다.',
    snapshot: {
      ...snapshot,
      updatedAt: now,
      profile: {
        ...snapshot.profile,
        gold: snapshot.profile.gold + product.grant.gold,
        premiumCurrency: snapshot.profile.premiumCurrency + product.grant.premiumCurrency,
        fatigue: Math.min(snapshot.profile.maxFatigue, snapshot.profile.fatigue + product.grant.fatigue),
        ownedProductIds: product.grant.onceOnly
          ? [...snapshot.profile.ownedProductIds, productId]
          : snapshot.profile.ownedProductIds,
      },
    },
  };
}

function mapProductTitle(productId: string): string {
  switch (productId) {
    case 'hs_pack_beginner_01':
      return '스타터 패키지';
    case 'hs_fatigue_small_01':
      return '피로도 팩 소형';
    case 'hs_fatigue_large_01':
      return '피로도 팩 대형';
    case 'hs_gem_bundle_01':
      return '젬 묶음 1';
    case 'hs_paid_ten_summon_01':
      return '10회 유료 소환';
    default:
      return productId;
  }
}

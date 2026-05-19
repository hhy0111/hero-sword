import { SHOP_RUNTIME_IMAGE_KEYS } from './shopRuntimeArt';

export type CashProductId =
  | 'hs_pack_beginner_01'
  | 'hs_fatigue_small_01'
  | 'hs_fatigue_large_01'
  | 'hs_gem_bundle_01';

export interface CashProductDefinition {
  id: CashProductId;
  title: string;
  subtitle: string;
  description: string;
  grantLines: readonly string[];
  thumbKey: string;
  detailKey: string;
  defaultPrice: string;
}

export const CASH_PRODUCTS: readonly CashProductDefinition[] = [
  {
    id: 'hs_pack_beginner_01',
    title: '스타터 팩',
    subtitle: '계정 1회 | 초반 성장 보급',
    description: '초반 진행에 필요한 기본 재화를 한 번에 지급하는 유료 상품입니다.',
    grantLines: ['골드 +500', '보석 +300', '피로도 +9'],
    thumbKey: SHOP_RUNTIME_IMAGE_KEYS.cashStarterPackThumb,
    detailKey: SHOP_RUNTIME_IMAGE_KEYS.cashStarterPackDetail,
    defaultPrice: '₩1,500',
  },
  {
    id: 'hs_fatigue_small_01',
    title: '피로도 팩 소형',
    subtitle: '반복 구매 | 6회 입장분',
    description: '출정을 더 이어가고 싶을 때 피로도를 즉시 회복하는 유료 상품입니다.',
    grantLines: ['피로도 +18'],
    thumbKey: SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackThumb,
    detailKey: SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackDetail,
    defaultPrice: '₩1,200',
  },
  {
    id: 'hs_fatigue_large_01',
    title: '피로도 팩 대형',
    subtitle: '반복 구매 | 15회 입장분',
    description: '긴 플레이를 이어가고 싶을 때 피로도를 크게 회복하는 유료 상품입니다.',
    grantLines: ['피로도 +45'],
    thumbKey: SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackThumb,
    detailKey: SHOP_RUNTIME_IMAGE_KEYS.cashFatiguePackDetail,
    defaultPrice: '₩2,400',
  },
  {
    id: 'hs_gem_bundle_01',
    title: '프리미엄 보석 묶음 1',
    subtitle: '반복 구매 | 소환 재화',
    description: '소환과 성장 준비에 사용하는 프리미엄 보석을 지급하는 유료 상품입니다.',
    grantLines: ['보석 +980'],
    thumbKey: SHOP_RUNTIME_IMAGE_KEYS.currencyGem,
    detailKey: SHOP_RUNTIME_IMAGE_KEYS.currencyGem,
    defaultPrice: '₩7,900',
  },
] as const;

export const CASH_PRODUCT_BY_ID = new Map<CashProductId, CashProductDefinition>(
  CASH_PRODUCTS.map((product) => [product.id, product]),
);

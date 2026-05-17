import { AtlasFrame } from './atlas';
import { getArmorDefinition, getWeaponDefinition } from './equipment';
import { createArmorVisualRef, createOfferVisualRef, createWeaponVisualRef, type ShopVisualRef } from './shopArt';
import type { TownShopId } from './town';
import type { SaveSnapshot } from '../types';

export interface ShopOfferDefinition {
  id: string;
  name: string;
  currency: 'gold' | 'heroStone';
  price: number;
  iconFrame: number;
  effectText: string;
  grantFatigue?: number;
  grantWeaponId?: string;
  grantArmorId?: string;
  unlockStageId?: string;
  unlockFurnitureId?: string;
  description: string;
  shopIds: TownShopId[];
  visual: ShopVisualRef;
}

interface EquipmentOfferInput {
  id: string;
  itemId: string;
  name: string;
  currency?: 'gold' | 'heroStone';
  price: number;
  effectText?: string;
  unlockStageId?: string;
  description: string;
  shopIds: TownShopId[];
}

function createWeaponOffer(input: EquipmentOfferInput): ShopOfferDefinition {
  const weapon = getWeaponDefinition(input.itemId);
  return {
    id: input.id,
    name: input.name,
    currency: input.currency ?? 'gold',
    price: input.price,
    iconFrame: AtlasFrame.SwordIcon,
    effectText: input.effectText ?? `Lv.${weapon.levelRequirement} ${weapon.rarity}성 무기`,
    grantWeaponId: input.itemId,
    unlockStageId: input.unlockStageId,
    description: input.description,
    shopIds: input.shopIds,
    visual: createWeaponVisualRef(weapon.id, weapon.weaponClass, AtlasFrame.SwordIcon),
  };
}

function createArmorOffer(input: EquipmentOfferInput): ShopOfferDefinition {
  const armor = getArmorDefinition(input.itemId);
  return {
    id: input.id,
    name: input.name,
    currency: input.currency ?? 'gold',
    price: input.price,
    iconFrame: AtlasFrame.BagIcon,
    effectText: input.effectText ?? `Lv.${armor.levelRequirement} ${armor.rarity}성 방어구`,
    grantArmorId: input.itemId,
    unlockStageId: input.unlockStageId,
    description: input.description,
    shopIds: input.shopIds,
    visual: createArmorVisualRef(armor.id, armor.armorClass, AtlasFrame.BagIcon),
  };
}

export const SHOP_OFFERS: ShopOfferDefinition[] = [
  createWeaponOffer({
    id: 'weapon_lumen_patrol_blade',
    itemId: 'wp_lumen_patrol_blade',
    name: '루멘 순찰검',
    price: 420,
    description: '초반 평원 루트에 맞춘 균형형 한손검입니다. 공격과 생존을 동시에 조금 올립니다.',
    shopIds: ['weapon_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_bramble_wall_sword',
    itemId: 'wp_bramble_wall_sword',
    name: '브램블 방벽검',
    price: 460,
    description: '검방 수호자용 기본 장비입니다. 방어와 막기 확률을 먼저 챙깁니다.',
    shopIds: ['weapon_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_pathfinder_longbow',
    itemId: 'wp_pathfinder_longbow',
    name: '길잡이 장궁',
    price: 480,
    description: '원거리 딜러가 초반 사냥 루트를 안정적으로 밀 수 있게 해 주는 활입니다.',
    shopIds: ['weapon_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_gatewatch_lance',
    itemId: 'wp_gatewatch_lance',
    name: '성문 감시 랜스',
    price: 680,
    description: '성문 주변 방어 임무에 맞춘 랜스입니다. 돌진 피해와 체력을 보강합니다.',
    shopIds: ['weapon_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_iron_pass_greatsword',
    itemId: 'wp_iron_pass_greatsword',
    name: '철길목 대검',
    price: 980,
    unlockStageId: 'stage_01_06',
    description: '1장 중반 이후 쓰기 좋은 대검입니다. 광역 딜러의 첫 교체 장비로 설계했습니다.',
    shopIds: ['weapon_shop', 'forge_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_tidewatch_pistol',
    itemId: 'wp_tidewatch_pistol',
    name: '조수 감시 권총',
    price: 1500,
    unlockStageId: 'stage_02_06',
    description: '해안 루트 진입 후 열리는 권총입니다. 명중과 치명타 확률을 보강합니다.',
    shopIds: ['weapon_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_blackstep_daggers',
    itemId: 'wp_blackstep_daggers',
    name: '흑보 단검',
    price: 2100,
    unlockStageId: 'stage_03_05',
    description: '암살자용 중반 장비입니다. 치명타와 관통 수치를 높여 단일 대상 압박을 강화합니다.',
    shopIds: ['weapon_shop'],
  }),
  createWeaponOffer({
    id: 'weapon_palace_knight_sword',
    itemId: 'wp_palace_knight_sword',
    name: '궁정 기사검',
    currency: 'heroStone',
    price: 34,
    unlockStageId: 'stage_04_06',
    description: '궁궐 전선 이후 해금되는 고급 기사검입니다. 공격과 방어를 모두 크게 올립니다.',
    shopIds: ['weapon_shop'],
  }),
  createArmorOffer({
    id: 'armor_militia_plate',
    itemId: 'ar_militia_plate',
    name: '민병대 판금갑',
    price: 430,
    description: '초반 전열 캐릭터에게 맞춘 판금갑입니다. 체력과 방어를 안정적으로 보강합니다.',
    shopIds: ['armor_shop'],
  }),
  createArmorOffer({
    id: 'armor_militia_chainmail',
    itemId: 'ar_militia_chainmail',
    name: '민병대 사슬갑',
    price: 470,
    description: '수호자와 중갑 전열용 기본 방어구입니다. 초반 피해를 버티는 데 초점을 둡니다.',
    shopIds: ['armor_shop'],
  }),
  createArmorOffer({
    id: 'armor_travel_leather',
    itemId: 'ar_travel_leather',
    name: '여행자 가죽갑',
    price: 430,
    description: '궁수와 암살자에게 맞는 경갑입니다. 회피와 명중을 가볍게 챙깁니다.',
    shopIds: ['armor_shop'],
  }),
  createArmorOffer({
    id: 'armor_field_vestment',
    itemId: 'ar_field_vestment',
    name: '야전 예복',
    price: 440,
    description: '치유사 초반 방어구입니다. 회복력과 상태 저항을 함께 올립니다.',
    shopIds: ['armor_shop'],
  }),
  createArmorOffer({
    id: 'armor_scout_battlewear',
    itemId: 'ar_scout_battlewear',
    name: '정찰 전투복',
    price: 620,
    description: '기동형 전열과 창병에게 맞춘 전투복입니다. 체력과 회피를 보강합니다.',
    shopIds: ['armor_shop'],
  }),
  createArmorOffer({
    id: 'armor_apprentice_robe',
    itemId: 'ar_apprentice_robe',
    name: '견습 로브',
    price: 620,
    description: '마도서와 기록서 계열 캐릭터를 위한 초반 로브입니다.',
    shopIds: ['armor_shop', 'relic_shop'],
  }),
  createArmorOffer({
    id: 'armor_granforge_heavy_mail',
    itemId: 'ar_granforge_heavy_mail',
    name: '그랜포지 중갑',
    price: 1180,
    unlockStageId: 'stage_01_12',
    description: '1장 후반부터 쓰는 중갑입니다. 전열 생존력을 확실히 끌어올립니다.',
    shopIds: ['armor_shop', 'forge_shop'],
  }),
  createArmorOffer({
    id: 'armor_coast_runner_coat',
    itemId: 'ar_coast_runner_coat',
    name: '해안 주자 코트',
    price: 1420,
    unlockStageId: 'stage_02_01',
    description: '해안 루트 이후 기동형 캐릭터에게 맞는 중반 방어구입니다.',
    shopIds: ['armor_shop'],
  }),
  createArmorOffer({
    id: 'armor_frost_guard_plate',
    itemId: 'ar_frost_guard_plate',
    name: '서리수비 판금갑',
    currency: 'heroStone',
    price: 32,
    unlockStageId: 'stage_03_12',
    description: '고난도 전열 운용을 위한 판금갑입니다. 방어와 막기 확률을 크게 올립니다.',
    shopIds: ['armor_shop'],
  }),
  createWeaponOffer({
    id: 'forge_granforge_hammer',
    itemId: 'wp_granforge_hammer',
    name: '그랜포지 망치',
    price: 1200,
    unlockStageId: 'stage_01_12',
    description: '대장간에서 직접 조율한 망치입니다. 방어와 상태 명중을 함께 챙깁니다.',
    shopIds: ['forge_shop'],
  }),
  createWeaponOffer({
    id: 'forge_runeforge_mallet',
    itemId: 'wp_runeforge_mallet',
    name: '룬포지 말렛',
    price: 1280,
    unlockStageId: 'stage_01_18',
    description: '룬 장인이 쓰기 좋은 보조형 망치입니다. 버프와 체력 보강에 초점을 둡니다.',
    shopIds: ['forge_shop'],
  }),
  createWeaponOffer({
    id: 'forge_runebound_cannon',
    itemId: 'wp_runebound_cannon',
    name: '룬결속 캐논',
    price: 1680,
    unlockStageId: 'stage_02_04',
    description: '포격형 영웅을 위한 중반 장비입니다. 관통과 공격력을 크게 올립니다.',
    shopIds: ['forge_shop'],
  }),
  createArmorOffer({
    id: 'forge_rune_apron',
    itemId: 'ar_rune_apron',
    name: '룬 작업 앞치마',
    price: 1100,
    unlockStageId: 'stage_01_12',
    description: '룬 작업자와 지원형 캐릭터를 위한 방어구입니다. 버프 성능을 보강합니다.',
    shopIds: ['forge_shop'],
  }),
  createWeaponOffer({
    id: 'relic_apprentice_star_tome',
    itemId: 'wp_apprentice_star_tome',
    name: '견습 별마도서',
    price: 520,
    description: '마법 딜러가 초반부터 사용할 수 있는 기본 마도서입니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_sanctuary_oak_staff',
    itemId: 'wp_sanctuary_oak_staff',
    name: '성역 참나무 지팡이',
    price: 540,
    description: '치유사 초반 장비입니다. 회복력과 생존을 같이 올립니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_tidecall_staff',
    itemId: 'wp_tidecall_staff',
    name: '조수소환 지팡이',
    price: 1480,
    unlockStageId: 'stage_02_06',
    description: '해안 루트 이후 해금되는 치유 지팡이입니다. 스킬 회전을 빠르게 만듭니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_archive_record_book',
    itemId: 'wp_archive_record_book',
    name: '기록관 장부',
    price: 1580,
    unlockStageId: 'stage_02_12',
    description: '기록서 계열 지원가를 위한 중반 장비입니다. 마법과 상태 명중을 보강합니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_survey_staff',
    itemId: 'wp_relic_survey_staff',
    name: '유물 탐사 지팡이',
    price: 1900,
    unlockStageId: 'stage_03_01',
    description: '유물 학자용 장비입니다. 관통과 스킬 회전을 함께 올립니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_sunscar_scimitar',
    itemId: 'wp_sunscar_scimitar',
    name: '태양흉터 시미터',
    price: 2200,
    unlockStageId: 'stage_03_12',
    description: '회피형 전열과 암살자에게 맞춘 중후반 곡도입니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_lumina_holy_blade',
    itemId: 'wp_lumina_holy_blade',
    name: '루미나 성검',
    currency: 'heroStone',
    price: 38,
    unlockStageId: 'stage_04_06',
    description: '성기사와 치유 전열이 쓰는 고급 성검입니다.',
    shopIds: ['relic_shop'],
  }),
  createWeaponOffer({
    id: 'relic_chorus_reliquary_staff',
    itemId: 'wp_chorus_reliquary_staff',
    name: '성가 유물 지팡이',
    currency: 'heroStone',
    price: 38,
    unlockStageId: 'stage_04_06',
    description: '후반 치유사를 위한 고급 지팡이입니다. 회복력과 저항을 크게 올립니다.',
    shopIds: ['relic_shop'],
  }),
  createArmorOffer({
    id: 'relic_archive_rune_coat',
    itemId: 'ar_archive_rune_coat',
    name: '기록관 룬 코트',
    price: 1500,
    unlockStageId: 'stage_02_12',
    description: '마법형 지원가에게 맞춘 로브입니다. 마법과 상태 명중을 보강합니다.',
    shopIds: ['relic_shop'],
  }),
  createArmorOffer({
    id: 'relic_sunscar_light_armor',
    itemId: 'ar_sunscar_light_armor',
    name: '태양흉터 경갑',
    currency: 'heroStone',
    price: 34,
    unlockStageId: 'stage_04_01',
    description: '후반 암살자와 궁수에게 맞는 고급 경갑입니다.',
    shopIds: ['relic_shop'],
  }),
  createArmorOffer({
    id: 'relic_lumina_cleric_robe',
    itemId: 'ar_lumina_cleric_robe',
    name: '루미나 성직 로브',
    currency: 'heroStone',
    price: 36,
    unlockStageId: 'stage_04_06',
    description: '후반 치유사 전용 로브입니다. 회복력과 상태 저항을 크게 올립니다.',
    shopIds: ['relic_shop'],
  }),
  {
    id: 'item_field_ration_bundle',
    name: '야전 보급 꾸러미',
    currency: 'gold',
    price: 320,
    iconFrame: AtlasFrame.BagIcon,
    effectText: '피로도 +9',
    grantFatigue: 9,
    description: '초반 루트 반복 전투에 맞춘 식량과 응급품 묶음입니다.',
    shopIds: ['item_shop'],
    visual: createOfferVisualRef('item_field_ration_bundle', AtlasFrame.BagIcon, 0x82a86b),
  },
  {
    id: 'item_route_guard_supplies',
    name: '루트 경비 보급품',
    currency: 'gold',
    price: 560,
    iconFrame: AtlasFrame.BagIcon,
    effectText: '피로도 +12',
    grantFatigue: 12,
    unlockStageId: 'stage_01_06',
    description: '안정화된 루트 경비병들이 쓰는 중형 보급품입니다.',
    shopIds: ['item_shop'],
    visual: createOfferVisualRef('item_route_guard_supplies', AtlasFrame.BagIcon, 0x7d9c6b),
  },
  {
    id: 'item_frontline_recovery_case',
    name: '전선 회복 상자',
    currency: 'heroStone',
    price: 32,
    iconFrame: AtlasFrame.BagIcon,
    effectText: '피로도 +24',
    grantFatigue: 24,
    unlockStageId: 'stage_02_01',
    description: '긴 전투 루트 공략 전에 준비하는 고급 회복 상자입니다.',
    shopIds: ['item_shop'],
    visual: createOfferVisualRef('item_frontline_recovery_case', AtlasFrame.BagIcon, 0x6d8ec7),
  },
  {
    id: 'weapon_edge_oil',
    name: '검날 관리 키트',
    currency: 'gold',
    price: 220,
    iconFrame: AtlasFrame.SwordIcon,
    effectText: '피로도 +6',
    grantFatigue: 6,
    description: '무기 상점에서 바로 꺼내 쓸 수 있는 현장 정비용 소모품 묶음입니다.',
    shopIds: ['weapon_shop'],
    visual: createOfferVisualRef('weapon_edge_oil', AtlasFrame.SwordIcon, 0xb68758),
  },
  {
    id: 'weapon_banner_rack',
    name: '무기관 배너',
    currency: 'heroStone',
    price: 18,
    iconFrame: AtlasFrame.HomeIcon,
    effectText: '가구 해금',
    unlockFurnitureId: 'weapon_hall_banner',
    description: '무기 진열 구역에 걸 수 있는 전용 배너 장식입니다.',
    shopIds: ['weapon_shop'],
    visual: createOfferVisualRef('weapon_banner_rack', AtlasFrame.HomeIcon, 0x8c6f54),
  },
  {
    id: 'armor_padding_roll',
    name: '방어구 패딩 롤',
    currency: 'gold',
    price: 230,
    iconFrame: AtlasFrame.HomeIcon,
    effectText: '피로도 +6',
    grantFatigue: 6,
    description: '방어구 안감을 보강할 때 쓰는 패딩 천 묶음입니다.',
    shopIds: ['armor_shop'],
    visual: createOfferVisualRef('armor_padding_roll', AtlasFrame.HomeIcon, 0xa8845f),
  },
  {
    id: 'armor_cloak_stand',
    name: '워드키퍼 망토 거치대',
    currency: 'heroStone',
    price: 20,
    iconFrame: AtlasFrame.MapIcon,
    effectText: '가구 해금',
    unlockFurnitureId: 'wardkeeper_cloak_stand',
    description: '방어구 상점에서 쓰는 망토와 외투를 걸어 둘 수 있는 거치대입니다.',
    shopIds: ['armor_shop'],
    visual: createOfferVisualRef('armor_cloak_stand', AtlasFrame.MapIcon, 0x8f7b63),
  },
  {
    id: 'fatigue_tonic_small',
    name: '피로 회복제 S',
    currency: 'gold',
    price: 180,
    iconFrame: AtlasFrame.BagIcon,
    effectText: '피로도 +12',
    grantFatigue: 12,
    description: '짧은 출정 전후에 마시기 좋은 소형 피로 회복제입니다.',
    shopIds: ['item_shop'],
    visual: createOfferVisualRef('fatigue_tonic_small', AtlasFrame.BagIcon, 0x6f9dbb),
  },
  {
    id: 'fatigue_tonic_large',
    name: '피로 회복제 L',
    currency: 'heroStone',
    price: 24,
    iconFrame: AtlasFrame.BagIcon,
    effectText: '피로도 +30',
    grantFatigue: 30,
    description: '긴 전투 루트 공략 전에 준비하는 대형 피로 회복제입니다.',
    shopIds: ['item_shop'],
    visual: createOfferVisualRef('fatigue_tonic_large', AtlasFrame.BagIcon, 0x7896ce),
  },
  {
    id: 'forge_repair_box',
    name: '대장간 수리 상자',
    currency: 'gold',
    price: 260,
    iconFrame: AtlasFrame.Star,
    effectText: '피로도 +9',
    grantFatigue: 9,
    description: '수리 도구와 예비 부품을 묶어 둔 대장간 보급 상자입니다.',
    shopIds: ['forge_shop'],
    visual: createOfferVisualRef('forge_repair_box', AtlasFrame.Star, 0xb0724d),
  },
  {
    id: 'forge_anvil_display',
    name: '대장간 모루 장식',
    currency: 'heroStone',
    price: 22,
    iconFrame: AtlasFrame.HomeIcon,
    effectText: '가구 해금',
    unlockFurnitureId: 'forge_anvil_display',
    description: '작업대 분위기를 살려 주는 대장간 전용 모루 장식입니다.',
    shopIds: ['forge_shop'],
    visual: createOfferVisualRef('forge_anvil_display', AtlasFrame.HomeIcon, 0x93674a),
  },
  {
    id: 'relic_sigil_bundle',
    name: '고요한 문양 꾸러미',
    currency: 'gold',
    price: 280,
    iconFrame: AtlasFrame.MapIcon,
    effectText: '피로도 +6',
    grantFatigue: 6,
    description: '유물 상점에서 준비한 진정 문양과 봉인 부적 꾸러미입니다.',
    shopIds: ['relic_shop'],
    visual: createOfferVisualRef('relic_sigil_bundle', AtlasFrame.MapIcon, 0x8477be),
  },
  {
    id: 'relic_archive_lamp',
    name: '기록관 램프',
    currency: 'heroStone',
    price: 18,
    iconFrame: AtlasFrame.Star,
    effectText: '가구 해금',
    unlockFurnitureId: 'archive_lamp',
    description: '기록 보관 구역에 두는 조용한 유물 상점 전용 램프입니다.',
    shopIds: ['relic_shop'],
    visual: createOfferVisualRef('relic_archive_lamp', AtlasFrame.Star, 0x9b85d1),
  },
];

export function isShopOfferUnlocked(snapshot: SaveSnapshot | undefined, offer: ShopOfferDefinition): boolean {
  if (!snapshot || !offer.unlockStageId) {
    return true;
  }

  return (snapshot.world.stageStars[offer.unlockStageId]?.normal ?? 0) >= 1;
}

export function getShopOffersForShop(
  shopId: TownShopId | undefined,
  snapshot?: SaveSnapshot,
): ShopOfferDefinition[] {
  if (!shopId) {
    return SHOP_OFFERS.filter((offer) => isShopOfferUnlocked(snapshot, offer));
  }

  const filtered = SHOP_OFFERS.filter((offer) => offer.shopIds.includes(shopId));
  const scopedOffers = filtered.length > 0 ? filtered : SHOP_OFFERS;
  return scopedOffers.filter((offer) => isShopOfferUnlocked(snapshot, offer));
}

import { SHOP_OFFERS, isShopOfferUnlocked } from '../data/shop';
import { FATIGUE_MAX } from './state';
import { getCharacter, getOwnedCharacterIds } from '../data/characters';
import { getArmorDefinition, getWeaponDefinition } from '../data/equipment';
import {
  calculateEquipmentPowerFromStats,
  ensureEquipmentState,
  getAvailableArmorCopies,
  getAvailableWeaponCopies,
  getCharacterEquipment,
} from './equipment';
import { getCharacterProgress } from './progression';
import type { EquipmentStats, SaveSnapshot } from '../types';

export interface ShopPurchaseResult {
  ok: boolean;
  snapshot: SaveSnapshot;
  message: string;
}

export interface ShopOfferEquipmentPowerChange {
  characterId: string;
  characterName: string;
  currentPower: number;
  candidatePower: number;
  delta: number;
  currentLevel: number;
  requiredLevel: number;
  levelLocked: boolean;
}

export function getShopOfferById(offerId: string) {
  return SHOP_OFFERS.find((entry) => entry.id === offerId) ?? null;
}

export function isConsumableShopOffer(offer: { grantFatigue?: number; grantWeaponId?: string; grantArmorId?: string; unlockFurnitureId?: string }): boolean {
  return Boolean(offer.grantFatigue && !offer.grantWeaponId && !offer.grantArmorId && !offer.unlockFurnitureId);
}

export function getShopOfferEquipmentPowerChange(
  snapshot: SaveSnapshot,
  offer: { grantWeaponId?: string; grantArmorId?: string },
): ShopOfferEquipmentPowerChange | null {
  const normalized = ensureEquipmentState(snapshot);
  const ownedCharacterIds = getOwnedCharacterIds(normalized);
  const candidates: ShopOfferEquipmentPowerChange[] = [];

  for (const characterId of ownedCharacterIds) {
    const character = getCharacter(characterId);
    const equipment = getCharacterEquipment(normalized, characterId);
    const progress = getCharacterProgress(normalized, characterId);

    if (offer.grantWeaponId) {
      const weapon = getWeaponDefinition(offer.grantWeaponId);
      if (character.weaponClass !== weapon.weaponClass) {
        continue;
      }

      const candidatePower = calculateEquipmentPowerFromStats(addStats(weapon.stats, equipment.armor?.stats ?? {}));
      candidates.push({
        characterId,
        characterName: character.name,
        currentPower: equipment.powerBonus,
        candidatePower,
        delta: candidatePower - equipment.powerBonus,
        currentLevel: progress.level,
        requiredLevel: weapon.levelRequirement,
        levelLocked: progress.level < weapon.levelRequirement,
      });
      continue;
    }

    if (offer.grantArmorId) {
      const armor = getArmorDefinition(offer.grantArmorId);
      if (character.armorClass !== armor.armorClass) {
        continue;
      }

      const candidatePower = calculateEquipmentPowerFromStats(addStats(equipment.weapon?.stats ?? {}, armor.stats));
      candidates.push({
        characterId,
        characterName: character.name,
        currentPower: equipment.powerBonus,
        candidatePower,
        delta: candidatePower - equipment.powerBonus,
        currentLevel: progress.level,
        requiredLevel: armor.levelRequirement,
        levelLocked: progress.level < armor.levelRequirement,
      });
    }
  }

  if (candidates.length <= 0) {
    return null;
  }

  return candidates.sort((left, right) => {
    if (left.levelLocked !== right.levelLocked) {
      return left.levelLocked ? 1 : -1;
    }

    if (right.delta !== left.delta) {
      return right.delta - left.delta;
    }

    return left.characterName.localeCompare(right.characterName);
  })[0] ?? null;
}

export function purchaseShopOffer(
  snapshot: SaveSnapshot,
  offerId: string,
  now = Date.now(),
): ShopPurchaseResult {
  const offer = SHOP_OFFERS.find((entry) => entry.id === offerId);

  if (!offer) {
    return { ok: false, snapshot, message: '상점 상품 정보를 찾지 못했습니다.' };
  }

  const normalized = ensureEquipmentState(snapshot);

  if (!isShopOfferUnlocked(normalized, offer)) {
    return { ok: false, snapshot: normalized, message: '아직 판매가 열리지 않은 상품입니다.' };
  }

  if (offer.currency === 'gold' && normalized.profile.gold < offer.price) {
    return { ok: false, snapshot: normalized, message: '골드가 부족합니다.' };
  }

  if (offer.currency === 'heroStone' && normalized.profile.heroStones < offer.price) {
    return { ok: false, snapshot: normalized, message: '영웅석이 부족합니다.' };
  }

  if (offer.unlockFurnitureId && normalized.housing.ownedFurnitureIds.includes(offer.unlockFurnitureId)) {
    return { ok: false, snapshot: normalized, message: '이미 보유한 장식입니다.' };
  }

  const consumable = isConsumableShopOffer(offer);
  const itemCopies = normalized.collection.itemCopies ?? {};

  return {
    ok: true,
    message: consumable ? `${offer.name} 구매를 완료했습니다. 창고에 보관했습니다.` : `${offer.name} 구매를 완료했습니다.`,
    snapshot: {
      ...normalized,
      updatedAt: now,
      profile: {
        ...normalized.profile,
        gold: offer.currency === 'gold' ? normalized.profile.gold - offer.price : normalized.profile.gold,
        heroStones:
          offer.currency === 'heroStone'
            ? normalized.profile.heroStones - offer.price
            : normalized.profile.heroStones,
        fatigue: consumable
          ? normalized.profile.fatigue
          : Math.min(
              FATIGUE_MAX,
              normalized.profile.fatigue + (offer.grantFatigue ?? 0),
            ),
      },
      collection: {
        ...normalized.collection,
        itemCopies: consumable
          ? {
              ...itemCopies,
              [offer.id]: (itemCopies[offer.id] ?? 0) + 1,
            }
          : itemCopies,
        weaponCopies: offer.grantWeaponId
          ? {
              ...normalized.collection.weaponCopies,
              [offer.grantWeaponId]: (normalized.collection.weaponCopies[offer.grantWeaponId] ?? 0) + 1,
            }
          : normalized.collection.weaponCopies,
        armorCopies: offer.grantArmorId
          ? {
              ...normalized.collection.armorCopies,
              [offer.grantArmorId]: (normalized.collection.armorCopies[offer.grantArmorId] ?? 0) + 1,
            }
          : normalized.collection.armorCopies,
      },
      housing: offer.unlockFurnitureId
        ? {
            ...normalized.housing,
            ownedFurnitureIds: [...normalized.housing.ownedFurnitureIds, offer.unlockFurnitureId],
          }
        : normalized.housing,
    },
  };
}

function addStats(left: EquipmentStats, right: EquipmentStats): EquipmentStats {
  const next: EquipmentStats = {};
  const keys = new Set<keyof EquipmentStats>([
    ...Object.keys(left),
    ...Object.keys(right),
  ] as Array<keyof EquipmentStats>);

  for (const key of keys) {
    next[key] = (left[key] ?? 0) + (right[key] ?? 0);
  }

  return next;
}

export function useConsumableItem(
  snapshot: SaveSnapshot,
  itemId: string,
  now = Date.now(),
): ShopPurchaseResult {
  const normalized = ensureEquipmentState(snapshot);
  const offer = getShopOfferById(itemId);
  const itemCopies = normalized.collection.itemCopies ?? {};
  const ownedCopies = itemCopies[itemId] ?? 0;

  if (!offer || !isConsumableShopOffer(offer)) {
    return { ok: false, snapshot: normalized, message: '사용할 수 있는 소모품이 아닙니다.' };
  }

  if (ownedCopies <= 0) {
    return { ok: false, snapshot: normalized, message: '보유 수량이 없습니다.' };
  }

  if (normalized.profile.fatigue >= normalized.profile.maxFatigue) {
    return { ok: false, snapshot: normalized, message: '피로도가 이미 가득 차 있습니다.' };
  }

  const nextFatigue = Math.min(normalized.profile.maxFatigue, normalized.profile.fatigue + (offer.grantFatigue ?? 0));

  if (nextFatigue <= normalized.profile.fatigue) {
    return { ok: false, snapshot: normalized, message: '현재 사용할 효과가 없습니다.' };
  }

  return {
    ok: true,
    message: `${offer.name} 사용: 피로도 +${nextFatigue - normalized.profile.fatigue}`,
    snapshot: {
      ...normalized,
      updatedAt: now,
      profile: {
        ...normalized.profile,
        fatigue: nextFatigue,
      },
      collection: {
        ...normalized.collection,
        itemCopies: {
          ...itemCopies,
          [itemId]: ownedCopies - 1,
        },
      },
    },
  };
}

export function sellShopInventoryEntry(
  snapshot: SaveSnapshot,
  item: { kind: 'weapon' | 'armor'; itemId: string; price: number },
  now = Date.now(),
): ShopPurchaseResult {
  const normalized = ensureEquipmentState(snapshot);

  if (item.price <= 0) {
    return { ok: false, snapshot: normalized, message: '판매할 수 없는 물품입니다.' };
  }

  if (item.kind === 'weapon') {
    if (getAvailableWeaponCopies(normalized, item.itemId) <= 0) {
      return { ok: false, snapshot: normalized, message: '장착 중인 무기만 남아 있어 판매할 수 없습니다.' };
    }

    return {
      ok: true,
      snapshot: {
        ...normalized,
        updatedAt: now,
        profile: {
          ...normalized.profile,
          gold: normalized.profile.gold + item.price,
        },
        collection: {
          ...normalized.collection,
          weaponCopies: {
            ...normalized.collection.weaponCopies,
            [item.itemId]: Math.max(0, (normalized.collection.weaponCopies[item.itemId] ?? 0) - 1),
          },
        },
      },
      message: `장비를 판매해 골드 ${item.price}을 획득했습니다.`,
    };
  }

  if (getAvailableArmorCopies(normalized, item.itemId) <= 0) {
    return { ok: false, snapshot: normalized, message: '장착 중인 방어구만 남아 있어 판매할 수 없습니다.' };
  }

  return {
    ok: true,
    snapshot: {
      ...normalized,
      updatedAt: now,
      profile: {
        ...normalized.profile,
        gold: normalized.profile.gold + item.price,
      },
      collection: {
        ...normalized.collection,
        armorCopies: {
          ...normalized.collection.armorCopies,
          [item.itemId]: Math.max(0, (normalized.collection.armorCopies[item.itemId] ?? 0) - 1),
        },
      },
    },
    message: `장비를 판매해 골드 ${item.price}을 획득했습니다.`,
  };
}

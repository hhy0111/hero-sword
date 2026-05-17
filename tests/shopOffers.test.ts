import { describe, expect, it } from 'vitest';
import { createInitialSnapshot } from '../src/game/core/state';
import { getShopOfferById, getShopOfferEquipmentPowerChange, purchaseShopOffer } from '../src/game/core/shop';
import { getShopOffersForShop, SHOP_OFFERS } from '../src/game/data/shop';
import { getArmorDefinition, getWeaponDefinition } from '../src/game/data/equipment';

describe('shop offer routing', () => {
  it('returns a focused offer list for each town shop', () => {
    const weaponOffers = getShopOffersForShop('weapon_shop');
    const armorOffers = getShopOffersForShop('armor_shop');
    const itemOffers = getShopOffersForShop('item_shop');
    const forgeOffers = getShopOffersForShop('forge_shop');
    const relicOffers = getShopOffersForShop('relic_shop');

    expect(weaponOffers.length).toBeGreaterThan(0);
    expect(armorOffers.length).toBeGreaterThan(0);
    expect(itemOffers.length).toBeGreaterThan(0);
    expect(forgeOffers.length).toBeGreaterThan(0);
    expect(relicOffers.length).toBeGreaterThan(0);

    expect(weaponOffers.every((offer) => offer.shopIds.includes('weapon_shop'))).toBe(true);
    expect(armorOffers.every((offer) => offer.shopIds.includes('armor_shop'))).toBe(true);
    expect(itemOffers.every((offer) => offer.shopIds.includes('item_shop'))).toBe(true);
    expect(forgeOffers.every((offer) => offer.shopIds.includes('forge_shop'))).toBe(true);
    expect(relicOffers.every((offer) => offer.shopIds.includes('relic_shop'))).toBe(true);
  });

  it('keeps a full fallback list when no shop context is provided', () => {
    expect(getShopOffersForShop(undefined)).toHaveLength(SHOP_OFFERS.length);
  });

  it('allows buying a shop-specific local offer', () => {
    const now = Date.UTC(2026, 3, 7, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    const beforeGold = snapshot.profile.gold;
    const beforeFatigue = snapshot.profile.fatigue;

    const result = purchaseShopOffer(snapshot, 'fatigue_tonic_small', now);

    expect(result.ok).toBe(true);
    expect(result.snapshot.profile.gold).toBe(beforeGold - 180);
    expect(result.snapshot.profile.fatigue).toBeGreaterThanOrEqual(beforeFatigue);
  });

  it('adds purchased weapons and armors to the player inventory', () => {
    const now = Date.UTC(2026, 3, 7, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);

    const weaponResult = purchaseShopOffer(snapshot, 'weapon_lumen_patrol_blade', now);
    expect(weaponResult.ok).toBe(true);
    expect(weaponResult.snapshot.collection.weaponCopies.wp_lumen_patrol_blade).toBe(1);

    const armorResult = purchaseShopOffer(weaponResult.snapshot, 'armor_militia_plate', now);
    expect(armorResult.ok).toBe(true);
    expect(armorResult.snapshot.collection.armorCopies.ar_militia_plate).toBe(1);
  });

  it('reveals later shop stock from stage progress', () => {
    const snapshot = createInitialSnapshot(Date.UTC(2026, 3, 7, 0, 0, 0));
    const earlyWeaponOffers = getShopOffersForShop('weapon_shop', snapshot);

    expect(earlyWeaponOffers.some((offer) => offer.id === 'weapon_iron_pass_greatsword')).toBe(false);

    const progressed = {
      ...snapshot,
      world: {
        ...snapshot.world,
        stageStars: {
          ...snapshot.world.stageStars,
          stage_01_06: { normal: 3, hard: 0, hell: 0 },
        },
      },
    };

    const progressedWeaponOffers = getShopOffersForShop('weapon_shop', progressed);
    expect(progressedWeaponOffers.some((offer) => offer.id === 'weapon_iron_pass_greatsword')).toBe(true);
  });

  it('keeps shop equipment offers linked to valid equipment definitions', () => {
    SHOP_OFFERS.forEach((offer) => {
      if (offer.grantWeaponId) {
        expect(getWeaponDefinition(offer.grantWeaponId).source).toBe('shop');
      }
      if (offer.grantArmorId) {
        expect(getArmorDefinition(offer.grantArmorId).source).toBe('shop');
      }
    });
  });

  it('compares shop equipment offers against the matching character current loadout', () => {
    const snapshot = createInitialSnapshot();
    const offer = getShopOfferById('weapon_lumen_patrol_blade');

    if (!offer) {
      throw new Error('expected weapon offer');
    }

    const comparison = getShopOfferEquipmentPowerChange(snapshot, offer);

    expect(comparison).not.toBeNull();
    expect(comparison?.characterId).toBe('hero');
    expect(comparison?.delta).toBeGreaterThan(0);
    expect(comparison?.currentLevel).toBe(1);
    expect(comparison?.requiredLevel).toBe(3);
    expect(comparison?.levelLocked).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import { cycleHousingSlot } from '../src/game/core/housing';
import { purchaseShopOffer, useConsumableItem } from '../src/game/core/shop';
import { createInitialSnapshot } from '../src/game/core/state';

describe('meta systems', () => {
  it('purchases local shop offers with the correct currency', () => {
    const snapshot = createInitialSnapshot();
    const result = purchaseShopOffer(snapshot, 'fatigue_tonic_small');

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.snapshot.profile.gold).toBe(snapshot.profile.gold - 180);
      expect(result.snapshot.profile.fatigue).toBe(snapshot.profile.maxFatigue);
      expect(result.snapshot.collection.itemCopies.fatigue_tonic_small).toBe(1);
    }
  });

  it('uses stored consumables only when they have an effect', () => {
    const snapshot = createInitialSnapshot();
    snapshot.profile.fatigue = 82;
    const purchased = purchaseShopOffer(snapshot, 'fatigue_tonic_small');
    expect(purchased.ok).toBe(true);

    const used = useConsumableItem(purchased.snapshot, 'fatigue_tonic_small');
    expect(used.ok).toBe(true);
    expect(used.snapshot.profile.fatigue).toBe(94);
    expect(used.snapshot.collection.itemCopies.fatigue_tonic_small).toBe(0);
  });

  it('cycles housing furniture only through owned choices', () => {
    const snapshot = createInitialSnapshot();
    snapshot.housing.ownedFurnitureIds.push('knight_banner');

    const result = cycleHousingSlot(snapshot, 'left', 1);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.snapshot.housing.slots.left).toBe('knight_banner');
    }
  });
});

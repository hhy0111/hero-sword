import { getFurniture, getFurnitureBySlot } from '../data/housing';
import type { HousingSlots, SaveSnapshot } from '../types';

export type HousingSlotKey = keyof HousingSlots;

export interface HousingUpdateResult {
  ok: boolean;
  snapshot: SaveSnapshot;
  reason?: 'not_owned';
}

export function cycleHousingSlot(
  snapshot: SaveSnapshot,
  slot: HousingSlotKey,
  direction: 1 | -1,
): HousingUpdateResult {
  const ownedChoices = getFurnitureBySlot(slot).filter((entry) =>
    snapshot.housing.ownedFurnitureIds.includes(entry.id),
  );

  if (ownedChoices.length === 0) {
    return { ok: false, snapshot, reason: 'not_owned' };
  }

  const currentId = snapshot.housing.slots[slot];
  const currentIndex = Math.max(
    0,
    ownedChoices.findIndex((entry) => entry.id === currentId),
  );
  const nextIndex = (currentIndex + direction + ownedChoices.length) % ownedChoices.length;

  return {
    ok: true,
    snapshot: {
      ...snapshot,
      updatedAt: Date.now(),
      housing: {
        ...snapshot.housing,
        slots: {
          ...snapshot.housing.slots,
          [slot]: ownedChoices[nextIndex].id,
        },
      },
    },
  };
}

export function describeHousingSlot(snapshot: SaveSnapshot, slot: HousingSlotKey): string {
  return getFurniture(snapshot.housing.slots[slot]).name;
}

import { getGachaBanner } from '../data/gachaBanners';
import { getCharacterCopies } from '../data/characters';
import { getSummonPoolByRarity, type SummonPoolEntry } from '../data/summonPool';
import { ensureEquipmentState } from './equipment';
import type { CharacterRarity, SaveSnapshot, SummonResultEntry } from '../types';

export interface SummonResult {
  ok: boolean;
  snapshot: SaveSnapshot;
  results: SummonResultEntry[];
  cost: number;
  reason?: 'currency_low' | 'daily_ad_used';
}

const SINGLE_COST = 150;
const TEN_COST = 1500;
const DUPLICATE_STONE_GAIN: Record<CharacterRarity, number> = {
  3: 6,
  4: 16,
  5: 40,
};

export function performSummon(
  snapshot: SaveSnapshot,
  mode: 'single' | 'ten',
  bannerId: string,
  random = Math.random,
): SummonResult {
  const drawCount = mode === 'single' ? 1 : 10;
  const cost = mode === 'single' ? SINGLE_COST : TEN_COST;

  if (snapshot.profile.premiumCurrency < cost) {
    return {
      ok: false,
      snapshot,
      results: [],
      cost,
      reason: 'currency_low',
    };
  }

  const nextSnapshot: SaveSnapshot = {
    ...snapshot,
    updatedAt: Date.now(),
    profile: {
      ...snapshot.profile,
      premiumCurrency: snapshot.profile.premiumCurrency - cost,
    },
  };

  return performSummonDraws(nextSnapshot, mode, bannerId, cost, random);
}

export function performPaidTenSummon(
  snapshot: SaveSnapshot,
  bannerId: string,
  random = Math.random,
): SummonResult {
  return performSummonDraws(
    {
      ...snapshot,
      updatedAt: Date.now(),
    },
    'ten',
    bannerId,
    0,
    random,
  );
}

export function performAdTenSummon(
  snapshot: SaveSnapshot,
  bannerId: string,
  now = Date.now(),
  random = Math.random,
): SummonResult {
  if (!canPerformAdTenSummon(snapshot, now)) {
    return {
      ok: false,
      snapshot,
      results: [],
      cost: 0,
      reason: 'daily_ad_used',
    };
  }

  let nextSnapshot: SaveSnapshot = {
    ...snapshot,
    updatedAt: now,
    profile: {
      ...snapshot.profile,
      lastAdTenSummonDate: getAdTenSummonDateKey(now),
    },
  };
  const results: SummonResultEntry[] = [];

  for (let index = 0; index < 10; index += 1) {
    const rarity = rollAdRarity(random);
    const pull = pickSummonEntryWithFeaturedRate(
      bannerId,
      rarity,
      random,
      rarity === 4 ? 0.1 : 0.04,
    );
    const applied = applySummonEntry(nextSnapshot, pull);

    nextSnapshot = applied.snapshot;
    results.push(applied.result);
  }

  return {
    ok: true,
    snapshot: nextSnapshot,
    results,
    cost: 0,
  };
}

export function canPerformAdTenSummon(snapshot: SaveSnapshot, now = Date.now()): boolean {
  return snapshot.profile.lastAdTenSummonDate !== getAdTenSummonDateKey(now);
}

export function getAdTenSummonDateKey(now = Date.now()): string {
  const date = new Date(now);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function performSummonDraws(
  snapshot: SaveSnapshot,
  mode: 'single' | 'ten',
  bannerId: string,
  cost: number,
  random: () => number,
): SummonResult {
  const drawCount = mode === 'single' ? 1 : 10;
  let nextSnapshot = snapshot;
  const results: SummonResultEntry[] = [];

  for (let index = 0; index < drawCount; index += 1) {
    const guaranteeHighRarity = mode === 'ten' && index === drawCount - 1 && !results.some((entry) => entry.rarity >= 4);
    const rarity = guaranteeHighRarity ? rollGuaranteedRarity(random) : rollRarity(random);
    const pull = pickSummonEntry(bannerId, rarity, random);
    const applied = applySummonEntry(nextSnapshot, pull);

    nextSnapshot = applied.snapshot;
    results.push(applied.result);
  }

  return {
    ok: true,
    snapshot: nextSnapshot,
    results,
    cost,
  };
}

function pickSummonEntry(
  bannerId: string,
  rarity: CharacterRarity,
  random: () => number,
): SummonPoolEntry {
  return pickSummonEntryWithFeaturedRate(
    bannerId,
    rarity,
    random,
    rarity === 5 ? 0.5 : rarity === 4 ? 0.32 : 0.12,
  );
}

function pickSummonEntryWithFeaturedRate(
  bannerId: string,
  rarity: CharacterRarity,
  random: () => number,
  featuredRate: number,
): SummonPoolEntry {
  const pool = getSummonPoolByRarity(rarity);
  const banner = getGachaBanner(bannerId);
  const featuredPool = pool.filter((entry) => banner.featuredIds.includes(entry.id));
  const useFeatured = featuredPool.length > 0 && random() < featuredRate;
  const sourcePool = useFeatured ? featuredPool : pool;

  return sourcePool[Math.floor(random() * sourcePool.length)];
}

function applySummonEntry(
  snapshot: SaveSnapshot,
  entry: SummonPoolEntry,
): { snapshot: SaveSnapshot; result: SummonResultEntry } {
  if (entry.kind === 'weapon') {
    const nextCopies = (snapshot.collection.weaponCopies[entry.id] ?? 0) + 1;

    return {
      snapshot: {
        ...snapshot,
        collection: {
          ...snapshot.collection,
          weaponCopies: {
            ...snapshot.collection.weaponCopies,
            [entry.id]: nextCopies,
          },
        },
      },
      result: {
        kind: 'weapon',
        id: entry.id,
        name: entry.name,
        rarity: entry.rarity,
        isNew: nextCopies === 1,
        copies: nextCopies,
        convertedHeroStones: 0,
      },
    };
  }

  const previousCopies = getCharacterCopies(snapshot, entry.id);
  const nextCopies = previousCopies + 1;
  const cappedCopies = Math.min(6, nextCopies);
  const convertedHeroStones = nextCopies > 6 ? DUPLICATE_STONE_GAIN[entry.rarity] : 0;

  return {
    snapshot: ensureEquipmentState({
      ...snapshot,
      profile: {
        ...snapshot.profile,
        heroStones: snapshot.profile.heroStones + convertedHeroStones,
      },
      roster: {
        ...snapshot.roster,
        ownedCharacters: {
          ...snapshot.roster.ownedCharacters,
          [entry.id]: { copies: cappedCopies },
        },
      },
    }),
    result: {
      kind: 'character',
      id: entry.id,
      name: entry.name,
      rarity: entry.rarity,
      isNew: previousCopies === 0,
      copies: cappedCopies,
      convertedHeroStones,
    },
  };
}

function rollRarity(random: () => number): CharacterRarity {
  const roll = random();

  if (roll < 0.02) {
    return 5;
  }

  if (roll < 0.12) {
    return 4;
  }

  return 3;
}

function rollGuaranteedRarity(random: () => number): CharacterRarity {
  return random() < 0.05 ? 5 : 4;
}

function rollAdRarity(random: () => number): CharacterRarity {
  return random() < 0.05 ? 4 : 3;
}

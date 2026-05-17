import type {
  SaveSnapshot,
  StageCompleteRequest,
  StageDifficulty,
  StageEntryRequest,
  StageProgress,
} from '../types';
import { getAllCharacters } from '../data/characters';
import { STORY_FLAG_STARTER_COMPANION_RECRUITED, hasStoryFlag, markStoryFlag } from '../data/storyFlags';
import { getAllStageStoryEventIds } from '../data/stageStoryEvents';
import { FINAL_REGION_ID, STAGES, TOTAL_CONTINENTS, isFinalStageOfContinent } from '../data/world';
import { ensureEquipmentState } from './equipment';
import { ensureValidParty } from './party';

export const FATIGUE_MAX = 100;
export const FATIGUE_COST_PER_STAGE = 3;
export const FATIGUE_RECOVERY_INTERVAL_MS = 5 * 60 * 1000;
export const AD_REWARD_FATIGUE = 6;
export const AD_FALLBACK_FATIGUE = 3;

const DEFAULT_STAGE_PROGRESS: StageProgress = {
  normal: 0,
  hard: 0,
  hell: 0,
};

function cloneProgress(progress?: StageProgress): StageProgress {
  return progress ? { ...progress } : { ...DEFAULT_STAGE_PROGRESS };
}

export function createInitialSnapshot(now = Date.now()): SaveSnapshot {
  return ensureEquipmentState({
    schemaVersion: 3,
    createdAt: now,
    updatedAt: now,
    profile: {
      gold: 1200,
      premiumCurrency: 1800,
      heroStones: 30,
      fatigue: FATIGUE_MAX,
      maxFatigue: FATIGUE_MAX,
      lastFatigueTickAt: now,
      lastAdTenSummonDate: null,
      ownedProductIds: [],
    },
    world: {
      unlockedContinents: ['continent_01'],
      stageStars: {
        stage_01_01: { ...DEFAULT_STAGE_PROGRESS },
      },
    },
    roster: {
      ownedCharacters: {
        hero: { copies: 1 },
      },
      selectedPartyIds: ['hero'],
      characterProgress: {
        hero: { level: 1, exp: 0 },
      },
    },
    collection: {
      weaponCopies: {},
      armorCopies: {},
      itemCopies: {},
      equipmentLoadouts: {},
    },
    housing: {
      ownedFurnitureIds: ['wood_crate', 'training_dummy', 'small_plant'],
      slots: {
        left: 'wood_crate',
        center: 'training_dummy',
        right: 'small_plant',
      },
    },
    story: {
      seenCutsceneIds: [],
      seenStageStoryEventIds: [],
      flags: [],
    },
  });
}

export function createShowcaseSnapshot(now = Date.now()): SaveSnapshot {
  const snapshot = createInitialSnapshot(now);

  return ensureEquipmentState({
    ...snapshot,
    createdAt: now,
    updatedAt: now,
    profile: {
      ...snapshot.profile,
      gold: 58000,
      premiumCurrency: 12000,
      heroStones: 420,
      fatigue: FATIGUE_MAX,
      maxFatigue: FATIGUE_MAX,
      lastFatigueTickAt: now,
      lastAdTenSummonDate: null,
      ownedProductIds: ['hs_pack_beginner_01'],
    },
    world: {
      unlockedContinents: [
        'continent_01',
        'continent_02',
        'continent_03',
        'continent_04',
        'continent_05',
        'continent_06',
        FINAL_REGION_ID,
      ],
      stageStars: Object.fromEntries(
        STAGES.map((stage) => [
          stage.id,
          {
            normal: 3,
            hard: stage.order <= 8 ? 3 : 2,
            hell: stage.order <= 4 ? 3 : 1,
          },
        ]),
      ),
    },
    roster: {
      ownedCharacters: Object.fromEntries(
        getAllCharacters().map((character) => [character.id, { copies: character.rarity >= 5 ? 2 : 1 }]),
      ),
      selectedPartyIds: ['hero', 'seraphin', 'laila', 'lucian'],
      characterProgress: Object.fromEntries(
        getAllCharacters().map((character, index) => [
          character.id,
          {
            level: character.rarity >= 5 ? 8 : Math.max(2, 6 - (index % 3)),
            exp: 20 + (index % 4) * 18,
          },
        ]),
      ),
    },
    collection: {
      weaponCopies: {
        wp_oath_blade: 2,
        wp_black_moon_daggers: 1,
        wp_greenwind_bow: 3,
        wp_sand_relic_staff: 2,
        wp_frost_greatsword: 1,
        wp_dawn_holy_blade: 1,
      },
      armorCopies: {
        ar_rift_knight_plate: 1,
        ar_paladin_solar_mail: 1,
        ar_black_moon_leather: 1,
        ar_ruin_oracle_robe: 1,
      },
      itemCopies: {
        fatigue_tonic_small: 2,
        item_field_ration_bundle: 1,
      },
      equipmentLoadouts: {
        hero: {
          weaponId: 'wp_oath_blade',
          armorId: 'ar_rift_knight_plate',
        },
        seraphin: {
          weaponId: 'wp_dawn_holy_blade',
          armorId: 'ar_paladin_solar_mail',
        },
        laila: {
          weaponId: 'wp_sand_relic_staff',
          armorId: 'ar_ruin_oracle_robe',
        },
        lucian: {
          weaponId: 'wp_black_moon_daggers',
          armorId: 'ar_black_moon_leather',
        },
      },
    },
    housing: {
      ownedFurnitureIds: [
        'wood_crate',
        'training_dummy',
        'small_plant',
        'knight_banner',
        'hero_sword_rack',
        'lumen_lamp',
      ],
      slots: {
        left: 'knight_banner',
        center: 'hero_sword_rack',
        right: 'lumen_lamp',
      },
    },
    story: {
      seenCutsceneIds: [
        'video_01_opening_lumen_fall',
        'after_stage_01_10',
        'after_stage_02_10',
        'after_stage_03_10',
        'after_stage_04_09_or_04_10',
        'after_stage_05_10',
        'after_stage_06_09',
        'after_stage_06_10',
      ],
      seenStageStoryEventIds: getAllStageStoryEventIds(),
      flags: [STORY_FLAG_STARTER_COMPANION_RECRUITED],
    },
  });
}

export function recoverFatigue(snapshot: SaveSnapshot, now: number): SaveSnapshot {
  const elapsed = Math.max(0, now - snapshot.profile.lastFatigueTickAt);
  const recovered = Math.floor(elapsed / FATIGUE_RECOVERY_INTERVAL_MS);

  if (recovered <= 0 || snapshot.profile.fatigue >= snapshot.profile.maxFatigue) {
    return snapshot;
  }

  const nextFatigue = Math.min(snapshot.profile.maxFatigue, snapshot.profile.fatigue + recovered);
  const consumedRecoveryMs = recovered * FATIGUE_RECOVERY_INTERVAL_MS;

  return {
    ...snapshot,
    updatedAt: now,
    profile: {
      ...snapshot.profile,
      fatigue: nextFatigue,
      lastFatigueTickAt: snapshot.profile.lastFatigueTickAt + consumedRecoveryMs,
    },
  };
}

export function canAccessDifficulty(progress: StageProgress, difficulty: StageDifficulty): boolean {
  if (difficulty === 'normal') {
    return true;
  }

  if (difficulty === 'hard') {
    return progress.normal >= 3;
  }

  return progress.hard >= 3;
}

export function canEnterStage(snapshot: SaveSnapshot, request: StageEntryRequest): boolean {
  const recovered = recoverFatigue(snapshot, request.now);
  const progress = cloneProgress(recovered.world.stageStars[request.stageId]);

  return (
    hasStarterCompanionUnlocked(recovered) &&
    recovered.world.unlockedContinents.includes(request.continentId) &&
    isStageUnlocked(recovered, request.stageId) &&
    recovered.profile.fatigue >= FATIGUE_COST_PER_STAGE &&
    canAccessDifficulty(progress, request.difficulty)
  );
}

export function enterStage(
  snapshot: SaveSnapshot,
  request: StageEntryRequest,
): { ok: true; snapshot: SaveSnapshot } | { ok: false; reason: string } {
  const recovered = recoverFatigue(snapshot, request.now);

  if (!hasStarterCompanionUnlocked(recovered)) {
    return { ok: false, reason: 'starter_companion_locked' };
  }

  if (!recovered.world.unlockedContinents.includes(request.continentId)) {
    return { ok: false, reason: 'continent_locked' };
  }

  if (!isStageUnlocked(recovered, request.stageId)) {
    return { ok: false, reason: 'stage_locked' };
  }

  if (recovered.profile.fatigue < FATIGUE_COST_PER_STAGE) {
    return { ok: false, reason: 'fatigue_low' };
  }

  const progress = cloneProgress(recovered.world.stageStars[request.stageId]);

  if (!canAccessDifficulty(progress, request.difficulty)) {
    return { ok: false, reason: 'difficulty_locked' };
  }

  return {
    ok: true,
    snapshot: {
      ...recovered,
      updatedAt: request.now,
      profile: {
        ...recovered.profile,
        fatigue: recovered.profile.fatigue - FATIGUE_COST_PER_STAGE,
      },
    },
  };
}

export function hasStarterCompanionUnlocked(snapshot: SaveSnapshot): boolean {
  return hasStoryFlag(snapshot, STORY_FLAG_STARTER_COMPANION_RECRUITED);
}

export function grantOwnedCharacter(
  snapshot: SaveSnapshot,
  characterId: string,
  now = Date.now(),
  addToParty = false,
): SaveSnapshot {
  const currentCopies = snapshot.roster.ownedCharacters[characterId]?.copies ?? 0;
  const nextOwnedCharacters = {
    ...snapshot.roster.ownedCharacters,
    [characterId]: { copies: Math.max(1, currentCopies) },
  };

  let nextParty = snapshot.roster.selectedPartyIds;
  if (addToParty && !nextParty.includes(characterId)) {
    nextParty = [...nextParty, characterId].slice(0, 4);
  }

  return ensureValidParty({
    ...snapshot,
    updatedAt: now,
    roster: {
      ...snapshot.roster,
      ownedCharacters: nextOwnedCharacters,
      selectedPartyIds: nextParty,
    },
  });
}

export function unlockStarterCompanion(snapshot: SaveSnapshot, now = Date.now()): SaveSnapshot {
  const granted = grantOwnedCharacter(snapshot, 'bram', now, true);
  return markStoryFlag(granted, STORY_FLAG_STARTER_COMPANION_RECRUITED, now);
}

export function completeStage(
  snapshot: SaveSnapshot,
  request: StageCompleteRequest,
): SaveSnapshot {
  const current = cloneProgress(snapshot.world.stageStars[request.stageId]);
  const nextStars = Math.max(current[request.difficulty], clampStars(request.starsEarned));
  const nextProgress: StageProgress = {
    ...current,
    [request.difficulty]: nextStars,
  };

  const unlockedContinents = [...snapshot.world.unlockedContinents];
  const currentContinentIndex = parseContinentNumber(request.stageId);

  if (isFinalStageOfContinent(request.stageId) && nextStars >= 1) {
    if (currentContinentIndex < TOTAL_CONTINENTS) {
      const candidate = `continent_${String(currentContinentIndex + 1).padStart(2, '0')}`;

      if (!unlockedContinents.includes(candidate)) {
        unlockedContinents.push(candidate);
      }
    } else if (!unlockedContinents.includes(FINAL_REGION_ID)) {
      unlockedContinents.push(FINAL_REGION_ID);
    }
  }

  return {
    ...snapshot,
    updatedAt: request.now,
    world: {
      unlockedContinents,
      stageStars: {
        ...snapshot.world.stageStars,
        [request.stageId]: nextProgress,
      },
    },
  };
}

export function claimAdReward(snapshot: SaveSnapshot, now: number): SaveSnapshot {
  const recovered = recoverFatigue(snapshot, now);
  const nextFatigue = Math.min(recovered.profile.maxFatigue, recovered.profile.fatigue + AD_REWARD_FATIGUE);

  return {
    ...recovered,
    updatedAt: now,
    profile: {
      ...recovered.profile,
      fatigue: nextFatigue,
      lastFatigueTickAt: now,
    },
  };
}

export function claimAdFallbackReward(snapshot: SaveSnapshot, now: number): SaveSnapshot {
  const recovered = recoverFatigue(snapshot, now);
  const nextFatigue = Math.min(recovered.profile.maxFatigue, recovered.profile.fatigue + AD_FALLBACK_FATIGUE);

  return {
    ...recovered,
    updatedAt: now,
    profile: {
      ...recovered.profile,
      fatigue: nextFatigue,
      lastFatigueTickAt: now,
    },
  };
}

export function isStageUnlocked(snapshot: SaveSnapshot, stageId: string): boolean {
  const order = parseStageOrder(stageId);

  if (order <= 1) {
    return true;
  }

  const previousStageId = buildStageId(parseContinentNumber(stageId), order - 1);
  return (snapshot.world.stageStars[previousStageId]?.normal ?? 0) >= 1;
}

function clampStars(stars: number): number {
  return Math.max(0, Math.min(3, Math.floor(stars)));
}

function parseContinentNumber(stageId: string): number {
  const continentToken = stageId.split('_')[1];
  return Number.parseInt(continentToken, 10);
}

function parseStageOrder(stageId: string): number {
  const stageToken = stageId.split('_')[2];
  return Number.parseInt(stageToken, 10);
}

function buildStageId(continentNumber: number, stageOrder: number): string {
  return `stage_${String(continentNumber).padStart(2, '0')}_${String(stageOrder).padStart(2, '0')}`;
}

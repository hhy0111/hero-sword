import { FATIGUE_MAX, createInitialSnapshot } from '../core/state';
import { ensureEquipmentState } from '../core/equipment';
import { normalizeStoryFlags } from '../data/storyFlags';
import type { SaveSnapshot } from '../types';

const SAVE_KEY = 'hero-sword-save-v1';

export function loadSnapshot(): SaveSnapshot {
  const raw = localStorage.getItem(SAVE_KEY);

  if (!raw) {
    return createInitialSnapshot();
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown> & Partial<SaveSnapshot>;
    const schemaVersion = Number(parsed.schemaVersion ?? 0);

    if (schemaVersion !== 1 && schemaVersion !== 2 && schemaVersion !== 3) {
      return createInitialSnapshot();
    }

    return normalizeSnapshot(parsed);
  } catch {
    return createInitialSnapshot();
  }
}

export function saveSnapshot(snapshot: SaveSnapshot): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
}

function normalizeSnapshot(snapshot: Partial<SaveSnapshot>): SaveSnapshot {
  const initial = createInitialSnapshot(snapshot.updatedAt ?? Date.now());
  const normalizedPartyIds = sanitizePartyIds(
    snapshot.roster?.selectedPartyIds ?? initial.roster.selectedPartyIds,
    snapshot.roster?.ownedCharacters ?? initial.roster.ownedCharacters,
  );
  const normalizedProfile = normalizeProfileFatigue({
    ...initial.profile,
    ...(snapshot.profile ?? {}),
    heroStones: snapshot.profile?.heroStones ?? initial.profile.heroStones,
    lastAdTenSummonDate: snapshot.profile?.lastAdTenSummonDate ?? initial.profile.lastAdTenSummonDate,
    ownedProductIds: snapshot.profile?.ownedProductIds ?? initial.profile.ownedProductIds,
  });

  const normalized = ensureEquipmentState({
    schemaVersion: 3,
    createdAt: snapshot.createdAt ?? initial.createdAt,
    updatedAt: snapshot.updatedAt ?? initial.updatedAt,
    profile: normalizedProfile,
    world: {
      ...initial.world,
      ...(snapshot.world ?? {}),
      unlockedContinents: snapshot.world?.unlockedContinents ?? initial.world.unlockedContinents,
      stageStars: snapshot.world?.stageStars ?? initial.world.stageStars,
    },
    roster: {
      ...initial.roster,
      ...(snapshot.roster ?? {}),
      ownedCharacters: {
        ...initial.roster.ownedCharacters,
        ...(snapshot.roster?.ownedCharacters ?? {}),
      },
      selectedPartyIds: normalizedPartyIds,
      characterProgress: {
        ...initial.roster.characterProgress,
        ...(snapshot.roster?.characterProgress ?? {}),
      },
    },
    collection: {
      ...initial.collection,
      ...(snapshot.collection ?? {}),
      weaponCopies: snapshot.collection?.weaponCopies ?? initial.collection.weaponCopies,
      armorCopies: snapshot.collection?.armorCopies ?? initial.collection.armorCopies,
      itemCopies: snapshot.collection?.itemCopies ?? initial.collection.itemCopies,
      equipmentLoadouts: snapshot.collection?.equipmentLoadouts ?? initial.collection.equipmentLoadouts,
    },
    housing: {
      ...initial.housing,
      ...(snapshot.housing ?? {}),
      ownedFurnitureIds: snapshot.housing?.ownedFurnitureIds ?? initial.housing.ownedFurnitureIds,
      slots: {
        ...initial.housing.slots,
        ...(snapshot.housing?.slots ?? {}),
      },
    },
    story: {
      ...initial.story,
      ...(snapshot.story ?? {}),
      seenCutsceneIds: snapshot.story?.seenCutsceneIds ?? initial.story.seenCutsceneIds,
      seenStageStoryEventIds: snapshot.story?.seenStageStoryEventIds ?? initial.story.seenStageStoryEventIds,
      flags: snapshot.story?.flags ?? initial.story.flags,
    },
  });

  return normalizeStoryFlags(normalized, snapshot.story?.flags);
}

function normalizeProfileFatigue(profile: SaveSnapshot['profile']): SaveSnapshot['profile'] {
  const rawFatigue = Number.isFinite(profile.fatigue) ? Math.max(0, Math.floor(profile.fatigue)) : FATIGUE_MAX;
  const rawMaxFatigue = Number.isFinite(profile.maxFatigue)
    ? Math.max(1, Math.floor(profile.maxFatigue))
    : FATIGUE_MAX;
  const fatigue = rawMaxFatigue > FATIGUE_MAX
    ? Math.floor((rawFatigue / rawMaxFatigue) * FATIGUE_MAX)
    : rawFatigue;

  return {
    ...profile,
    fatigue: Math.max(0, Math.min(FATIGUE_MAX, fatigue)),
    maxFatigue: FATIGUE_MAX,
  };
}

function sanitizePartyIds(
  partyIds: string[],
  ownedCharacters: Record<string, { copies: number }>,
): string[] {
  const next: string[] = [];

  for (const partyId of partyIds) {
    if ((ownedCharacters[partyId]?.copies ?? 0) <= 0 || next.includes(partyId)) {
      continue;
    }

    next.push(partyId);
    if (next.length >= 4) {
      break;
    }
  }

  if (next.length > 0) {
    return next;
  }

  const fallback = Object.entries(ownedCharacters).find(([, owned]) => owned.copies > 0);
  return fallback ? [fallback[0]] : ['hero'];
}

import type { SaveSnapshot } from '../types';

export const STORY_FLAG_STARTER_COMPANION_RECRUITED = 'story:starter-companion:bram';
export const STORY_FLAG_VILLAGE_MAYOR_INTRO_SEEN = 'story:village:intro:mayor';
export const STORY_FLAG_VILLAGE_SUPPLY_EVENT = 'story:village:event:supply-wagon';
export const STORY_FLAG_VILLAGE_HARBOR_EVENT = 'story:village:event:harbor-rumor';
export const STORY_FLAG_VILLAGE_ARCHIVE_EVENT = 'story:village:event:archive-warning';
export const STORY_FLAG_PALACE_FIRST_AUDIENCE = 'story:palace:first-audience';

export function hasStoryFlag(snapshot: SaveSnapshot, flag: string): boolean {
  return snapshot.story.flags.includes(flag);
}

export function markStoryFlag(snapshot: SaveSnapshot, flag: string, now = Date.now()): SaveSnapshot {
  if (hasStoryFlag(snapshot, flag)) {
    return snapshot;
  }

  return {
    ...snapshot,
    updatedAt: now,
    story: {
      ...snapshot.story,
      flags: [...snapshot.story.flags, flag],
    },
  };
}

export function normalizeStoryFlags(
  snapshot: SaveSnapshot,
  flags: readonly string[] | undefined,
): SaveSnapshot {
  const next = new Set(flags ?? snapshot.story.flags);

  if ((snapshot.roster.ownedCharacters.bram?.copies ?? 0) > 0) {
    next.add(STORY_FLAG_STARTER_COMPANION_RECRUITED);
  }

  if (next.size === snapshot.story.flags.length && snapshot.story.flags.every((entry) => next.has(entry))) {
    return snapshot;
  }

  return {
    ...snapshot,
    story: {
      ...snapshot.story,
      flags: [...next],
    },
  };
}

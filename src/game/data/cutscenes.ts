import type { SaveSnapshot } from '../types';

export interface CutsceneDefinition {
  id: string;
  label: string;
  path: string;
}

export const OPENING_CUTSCENE_ID = 'video_01_opening_lumen_fall';

export const CUTSCENE_DEFINITIONS: readonly CutsceneDefinition[] = [
  { id: 'video_01_opening_lumen_fall', label: 'Opening', path: 'assets/cutscenes/video_01_opening_lumen_fall.mp4' },
  { id: 'after_stage_01_10', label: 'After Stage 01-24', path: 'assets/cutscenes/after_stage_01_10.mp4' },
  { id: 'after_stage_02_10', label: 'After Stage 02-24', path: 'assets/cutscenes/after_stage_02_10.mp4' },
  { id: 'after_stage_03_10', label: 'After Stage 03-24', path: 'assets/cutscenes/after_stage_03_10.mp4' },
  { id: 'after_stage_04_09_or_04_10', label: 'After Stage 04-18', path: 'assets/cutscenes/after_stage_04_09_or_04_10.mp4' },
  { id: 'after_stage_05_10', label: 'After Stage 05-24', path: 'assets/cutscenes/after_stage_05_10.mp4' },
  { id: 'after_stage_06_09', label: 'After Stage 06-23', path: 'assets/cutscenes/after_stage_06_09.mp4' },
  { id: 'after_stage_06_10', label: 'After Stage 06-24', path: 'assets/cutscenes/after_stage_06_10.mp4' },
] as const;

const CUTSCENE_MAP = new Map(CUTSCENE_DEFINITIONS.map((entry) => [entry.id, entry]));

export function getCutsceneDefinition(id: string): CutsceneDefinition | null {
  return CUTSCENE_MAP.get(id) ?? null;
}

export function getStageClearCutsceneId(stageId: string): string | null {
  switch (stageId) {
    case 'stage_01_24':
      return 'after_stage_01_10';
    case 'stage_02_24':
      return 'after_stage_02_10';
    case 'stage_03_24':
      return 'after_stage_03_10';
    case 'stage_04_18':
      return 'after_stage_04_09_or_04_10';
    case 'stage_05_24':
      return 'after_stage_05_10';
    case 'stage_06_23':
      return 'after_stage_06_09';
    case 'stage_06_24':
      return 'after_stage_06_10';
    default:
      return null;
  }
}

export function hasSeenCutscene(snapshot: SaveSnapshot, cutsceneId: string): boolean {
  return snapshot.story.seenCutsceneIds.includes(cutsceneId);
}

export function markCutsceneSeen(snapshot: SaveSnapshot, cutsceneId: string, now = Date.now()): SaveSnapshot {
  if (hasSeenCutscene(snapshot, cutsceneId)) {
    return snapshot;
  }

  return {
    ...snapshot,
    updatedAt: now,
    story: {
      ...snapshot.story,
      seenCutsceneIds: [...snapshot.story.seenCutsceneIds, cutsceneId],
    },
  };
}

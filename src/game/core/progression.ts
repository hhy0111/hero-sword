import { getCharacter } from '../data/characters';
import type {
  BattleExpReward,
  CharacterProgressState,
  SaveSnapshot,
  StageDefinition,
  StageDifficulty,
} from '../types';

const DEFAULT_PROGRESS: CharacterProgressState = {
  level: 1,
  exp: 0,
};

export const REPEAT_CLEAR_REWARD_RATE = 0.5;

export function getExpToNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  return 140 + (safeLevel - 1) * 55 + Math.floor((safeLevel - 1) ** 2 * 2);
}

export function getCharacterProgress(snapshot: SaveSnapshot, characterId: string): CharacterProgressState {
  const current = snapshot.roster.characterProgress[characterId] ?? DEFAULT_PROGRESS;
  const level = Math.max(1, Math.floor(current.level || 1));
  const cap = getExpToNextLevel(level);
  const exp = Math.max(0, Math.min(cap - 1, Math.floor(current.exp || 0)));

  return { level, exp };
}

export function calculateStageExpReward(
  stage: StageDefinition,
  difficulty: StageDifficulty,
  outcome: 'clear' | 'fail',
  rewardRate = 1,
): number {
  const baseReward = Math.round(34 + stage.order * 4 + stage.recommendedPower * 0.017);
  const difficultyScale = difficulty === 'hell' ? 1.8 : difficulty === 'hard' ? 1.35 : 1;
  const outcomeScale = outcome === 'clear' ? 1 : 0.35;
  const replayScale = outcome === 'clear' ? rewardRate : 1;
  return Math.max(8, Math.round(baseReward * difficultyScale * outcomeScale * replayScale));
}

export function getStageClearRewardRate(
  snapshot: SaveSnapshot,
  stageId: string,
  difficulty: StageDifficulty,
): number {
  return (snapshot.world.stageStars[stageId]?.[difficulty] ?? 0) >= 1 ? REPEAT_CLEAR_REWARD_RATE : 1;
}

export function grantStageExperience(
  snapshot: SaveSnapshot,
  stage: StageDefinition,
  difficulty: StageDifficulty,
  outcome: 'clear' | 'fail',
  now = Date.now(),
  rewardRate = 1,
): { snapshot: SaveSnapshot; rewards: BattleExpReward[] } {
  const expGained = calculateStageExpReward(stage, difficulty, outcome, rewardRate);
  const partyIds = snapshot.roster.selectedPartyIds.slice(0, 4);
  const nextProgress = { ...snapshot.roster.characterProgress };
  const rewards: BattleExpReward[] = [];

  for (const characterId of partyIds) {
    const before = getCharacterProgress(snapshot, characterId);
    const after = addExperience(before, expGained);
    nextProgress[characterId] = after;

    rewards.push({
      characterId,
      characterName: getCharacterDisplayName(characterId),
      levelBefore: before.level,
      levelAfter: after.level,
      expBefore: before.exp,
      expAfter: after.exp,
      expToNextBefore: getExpToNextLevel(before.level),
      expToNextAfter: getExpToNextLevel(after.level),
      expGained,
    });
  }

  return {
    rewards,
    snapshot: {
      ...snapshot,
      updatedAt: now,
      roster: {
        ...snapshot.roster,
        characterProgress: nextProgress,
      },
    },
  };
}

function addExperience(progress: CharacterProgressState, amount: number): CharacterProgressState {
  let level = Math.max(1, Math.floor(progress.level || 1));
  let exp = Math.max(0, Math.floor(progress.exp || 0)) + Math.max(0, Math.floor(amount));
  let cap = getExpToNextLevel(level);

  while (exp >= cap) {
    exp -= cap;
    level += 1;
    cap = getExpToNextLevel(level);
  }

  return { level, exp };
}

function getCharacterDisplayName(characterId: string): string {
  try {
    return getCharacter(characterId).name;
  } catch {
    return characterId;
  }
}

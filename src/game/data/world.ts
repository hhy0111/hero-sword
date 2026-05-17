import type { ContinentDefinition, StageDefinition, StageDifficulty } from '../types';
import { STAGE_SEEDS, STAGES_PER_CONTINENT, getContinentStageCount } from './stageSeeds';

export const TOTAL_CONTINENTS = 6;
export const FINAL_REGION_ID = 'final_01';

export const CONTINENTS: ContinentDefinition[] = [
  {
    id: 'continent_01',
    order: 1,
    name: '그린헤이븐 평원',
    townName: '브램블 마을',
    storyAct: '제1막',
    summary: '초원과 수로를 되살리며 첫 동맹을 얻는 재건의 대륙',
    accentColor: 0x6fa850,
  },
  {
    id: 'continent_02',
    order: 2,
    name: '아이언리치 산맥',
    townName: '그란포지',
    storyAct: '제1막',
    summary: '광산과 대장간 길드를 구하며 검 복원의 길을 여는 대륙',
    accentColor: 0x8b7b6a,
  },
  {
    id: 'continent_03',
    order: 3,
    name: '블루미스트 해안',
    townName: '블루하버',
    storyAct: '제2막',
    summary: '항구와 성소를 되찾으며 수호자 의지의 정체를 밝히는 대륙',
    accentColor: 0x4c8fcf,
  },
  {
    id: 'continent_04',
    order: 4,
    name: '프로스트벨 고원',
    townName: '윈터가드',
    storyAct: '제2막',
    summary: '설원의 기록과 영웅단의 진실을 찾는 대륙',
    accentColor: 0x8fb4d5,
  },
  {
    id: 'continent_05',
    order: 5,
    name: '선스카 사막',
    townName: '솔카자르',
    storyAct: '제3막',
    summary: '고대 유적과 봉인의 비밀을 파헤치는 대륙',
    accentColor: 0xd79d47,
  },
  {
    id: 'continent_06',
    order: 6,
    name: '루미나 성역',
    townName: '루미나 성도',
    storyAct: '제3막',
    summary: '성도와 균열의 중심에서 최후의 선택을 맞이하는 대륙',
    accentColor: 0xcdbd8b,
  },
];

export const STAGES: StageDefinition[] = CONTINENTS.flatMap((continent) =>
  STAGE_SEEDS[continent.id].map(([name, stageType, baseTimeSeconds, storyBeat], index) => ({
    id: `stage_${String(continent.order).padStart(2, '0')}_${String(index + 1).padStart(2, '0')}`,
    continentId: continent.id,
    order: index + 1,
    name,
    stageType,
    storyBeat,
    baseTimeSeconds,
    rewardGold: 120 + (continent.order - 1) * 45 + index * 18 + (stageType === 'final_boss' ? 80 : 0),
    recommendedPower: 700 + (continent.order - 1) * 250 + index * 70,
  })),
);

const CONTINENT_MAP = new Map(CONTINENTS.map((continent) => [continent.id, continent]));
const STAGE_MAP = new Map(STAGES.map((stage) => [stage.id, stage]));

export function getContinents(): ContinentDefinition[] {
  return CONTINENTS;
}

export function getContinent(continentId: string): ContinentDefinition {
  const continent = CONTINENT_MAP.get(continentId);

  if (!continent) {
    throw new Error(`Unknown continent: ${continentId}`);
  }

  return continent;
}

export function getStagesForContinent(continentId: string): StageDefinition[] {
  return STAGES.filter((stage) => stage.continentId === continentId);
}

export function getStageCountForContinent(continentId: string): number {
  return getContinentStageCount(continentId);
}

export function getFinalStageOrderForContinent(continentId: string): number {
  return getContinentStageCount(continentId) || STAGES_PER_CONTINENT;
}

export function getStage(stageId: string): StageDefinition {
  const stage = STAGE_MAP.get(stageId);

  if (!stage) {
    throw new Error(`Unknown stage: ${stageId}`);
  }

  return stage;
}

export function getNextStage(stageId: string): StageDefinition | null {
  const index = STAGES.findIndex((stage) => stage.id === stageId);
  if (index < 0 || index >= STAGES.length - 1) {
    return null;
  }
  return STAGES[index + 1] ?? null;
}

export function isFinalStageOfContinent(stageId: string): boolean {
  const stage = getStage(stageId);
  return stage.order >= getFinalStageOrderForContinent(stage.continentId);
}

export function getDifficultyLabel(difficulty: StageDifficulty): string {
  switch (difficulty) {
    case 'normal':
      return 'Normal';
    case 'hard':
      return 'Hard';
    case 'hell':
      return 'Hell';
  }
}

export function getDifficultyMultiplier(difficulty: StageDifficulty): number {
  switch (difficulty) {
    case 'normal':
      return 1;
    case 'hard':
      return 1.45;
    case 'hell':
      return 1.9;
  }
}

export function getStageRewardGold(stageId: string, difficulty: StageDifficulty, rewardRate = 1): number {
  return Math.round(getStage(stageId).rewardGold * getDifficultyMultiplier(difficulty) * rewardRate);
}

export function getUnlockTargetLabel(targetId: string | null): string | null {
  if (!targetId) {
    return null;
  }

  if (targetId === FINAL_REGION_ID) {
    return '검은문 전진캠프';
  }

  return getContinent(targetId).name;
}

export function getStageBackgroundKey(stageId: string): string {
  return `battle-bg:${stageId}`;
}

export function getStageBackgroundAssetPath(stageId: string): string {
  return `assets/world/battle-backgrounds/${stageId}.png`;
}

export function hasStageBackgroundAsset(stageId: string): boolean {
  return getStage(stageId).order <= 10;
}

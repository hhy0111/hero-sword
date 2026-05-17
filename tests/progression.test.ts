import { describe, expect, it } from 'vitest';
import {
  REPEAT_CLEAR_REWARD_RATE,
  calculateStageExpReward,
  getExpToNextLevel,
  getStageClearRewardRate,
  grantStageExperience,
} from '../src/game/core/progression';
import { createInitialSnapshot, unlockStarterCompanion } from '../src/game/core/state';
import { STAGES, getStage, getStageRewardGold } from '../src/game/data/world';

describe('progression balance', () => {
  it('uses the slower level curve and first-stage exp target', () => {
    const firstStage = getStage('stage_01_01');

    expect(getExpToNextLevel(1)).toBe(140);
    expect(getExpToNextLevel(8)).toBe(623);
    expect(calculateStageExpReward(firstStage, 'normal', 'clear')).toBe(50);
    expect(calculateStageExpReward(firstStage, 'hard', 'clear')).toBe(68);
    expect(calculateStageExpReward(firstStage, 'normal', 'fail')).toBe(18);
  });

  it('keeps a full normal story pass near level twenty', () => {
    let snapshot = unlockStarterCompanion(createInitialSnapshot(Date.UTC(2026, 3, 3, 0, 0, 0)));
    snapshot = {
      ...snapshot,
      roster: {
        ...snapshot.roster,
        selectedPartyIds: ['hero'],
      },
    };

    for (const stage of STAGES) {
      snapshot = grantStageExperience(snapshot, stage, 'normal', 'clear', Date.UTC(2026, 3, 3, 0, 0, 0)).snapshot;
    }

    const heroProgress = snapshot.roster.characterProgress.hero;
    expect(heroProgress.level).toBeGreaterThanOrEqual(19);
    expect(heroProgress.level).toBeLessThanOrEqual(20);
  });

  it('halves gold and exp for already-cleared stage difficulties', () => {
    const fresh = createInitialSnapshot(Date.UTC(2026, 3, 3, 0, 0, 0));
    const repeated = {
      ...fresh,
      world: {
        ...fresh.world,
        stageStars: {
          ...fresh.world.stageStars,
          stage_01_01: { normal: 1, hard: 0, hell: 0 },
        },
      },
    };
    const stage = getStage('stage_01_01');
    const fullGold = getStageRewardGold(stage.id, 'normal');
    const fullExp = calculateStageExpReward(stage, 'normal', 'clear');

    expect(getStageClearRewardRate(fresh, stage.id, 'normal')).toBe(1);
    expect(getStageClearRewardRate(repeated, stage.id, 'normal')).toBe(REPEAT_CLEAR_REWARD_RATE);
    expect(getStageRewardGold(stage.id, 'normal', REPEAT_CLEAR_REWARD_RATE)).toBe(Math.round(fullGold * 0.5));
    expect(calculateStageExpReward(stage, 'normal', 'clear', REPEAT_CLEAR_REWARD_RATE)).toBe(Math.round(fullExp * 0.5));
  });
});

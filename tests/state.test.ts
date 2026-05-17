import { describe, expect, it } from 'vitest';
import {
  AD_REWARD_FATIGUE,
  AD_FALLBACK_FATIGUE,
  FATIGUE_COST_PER_STAGE,
  FATIGUE_RECOVERY_INTERVAL_MS,
  canEnterStage,
  claimAdFallbackReward,
  claimAdReward,
  completeStage,
  createInitialSnapshot,
  createShowcaseSnapshot,
  enterStage,
  isStageUnlocked,
  recoverFatigue,
  unlockStarterCompanion,
} from '../src/game/core/state';

describe('hero sword state helpers', () => {
  it('recovers fatigue every five minutes', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    snapshot.profile.fatigue = 95;
    snapshot.profile.lastFatigueTickAt = now;

    const recovered = recoverFatigue(snapshot, now + FATIGUE_RECOVERY_INTERVAL_MS * 3);

    expect(recovered.profile.fatigue).toBe(98);
  });

  it('starts the fatigue economy on a one hundred point scale', () => {
    const snapshot = createInitialSnapshot(Date.UTC(2026, 3, 3, 0, 0, 0));

    expect(snapshot.profile.fatigue).toBe(100);
    expect(snapshot.profile.maxFatigue).toBe(100);
    expect(FATIGUE_COST_PER_STAGE).toBe(3);
  });

  it('blocks stage entry when fatigue is low', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = unlockStarterCompanion(createInitialSnapshot(now), now);
    snapshot.profile.fatigue = FATIGUE_COST_PER_STAGE - 1;

    expect(
      canEnterStage(snapshot, {
        continentId: 'continent_01',
        stageId: 'stage_01_01',
        difficulty: 'normal',
        now,
      }),
    ).toBe(false);
  });

  it('consumes fatigue on successful stage entry', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = unlockStarterCompanion(createInitialSnapshot(now), now);
    const result = enterStage(snapshot, {
      continentId: 'continent_01',
      stageId: 'stage_01_01',
      difficulty: 'normal',
      now,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.snapshot.profile.fatigue).toBe(snapshot.profile.fatigue - FATIGUE_COST_PER_STAGE);
    }
  });

  it('locks later stages until previous normal clear exists', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = unlockStarterCompanion(createInitialSnapshot(now), now);

    expect(
      canEnterStage(snapshot, {
        continentId: 'continent_01',
        stageId: 'stage_01_02',
        difficulty: 'normal',
        now,
      }),
    ).toBe(false);

    const unlocked = completeStage(snapshot, {
      continentId: 'continent_01',
      stageId: 'stage_01_01',
      difficulty: 'normal',
      starsEarned: 1,
      clearTimeSeconds: 95,
      now,
    });

    expect(isStageUnlocked(unlocked, 'stage_01_02')).toBe(true);
  });

  it('unlocks hard after normal 3-star clear', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = unlockStarterCompanion(createInitialSnapshot(now), now);
    const cleared = completeStage(snapshot, {
      continentId: 'continent_01',
      stageId: 'stage_01_01',
      difficulty: 'normal',
      starsEarned: 3,
      clearTimeSeconds: 110,
      now,
    });

    expect(
      canEnterStage(cleared, {
        continentId: 'continent_01',
        stageId: 'stage_01_01',
        difficulty: 'hard',
        now,
      }),
    ).toBe(true);
  });

  it('grants ad reward fatigue without exceeding max', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    snapshot.profile.fatigue = 92;

    const rewarded = claimAdReward(snapshot, now);

    expect(rewarded.profile.fatigue).toBe(98);

    const capped = claimAdReward(rewarded, now);
    expect(capped.profile.fatigue).toBe(100);
    expect(AD_REWARD_FATIGUE).toBe(6);
  });

  it('grants fallback fatigue without exceeding max', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    snapshot.profile.fatigue = 97;

    const rewarded = claimAdFallbackReward(snapshot, now);

    expect(rewarded.profile.fatigue).toBe(100);
    expect(AD_FALLBACK_FATIGUE).toBe(3);
  });

  it('unlocks final camp after clearing the sixth continent boss', () => {
    const now = Date.UTC(2026, 3, 3, 0, 0, 0);
    const snapshot = createInitialSnapshot(now);
    snapshot.world.unlockedContinents = [
      'continent_01',
      'continent_02',
      'continent_03',
      'continent_04',
      'continent_05',
      'continent_06',
    ];

    const cleared = completeStage(snapshot, {
      continentId: 'continent_06',
      stageId: 'stage_06_24',
      difficulty: 'normal',
      starsEarned: 1,
      clearTimeSeconds: 170,
      now,
    });

    expect(cleared.world.unlockedContinents).toContain('final_01');
    expect(cleared.world.unlockedContinents).not.toContain('continent_07');
  });

  it('creates a showcase snapshot with unlocked content for capture flows', () => {
    const snapshot = createShowcaseSnapshot(Date.UTC(2026, 3, 3, 0, 0, 0));

    expect(snapshot.world.unlockedContinents).toContain('continent_06');
    expect(snapshot.world.unlockedContinents).toContain('final_01');
    expect(Object.keys(snapshot.roster.ownedCharacters).length).toBeGreaterThan(10);
    expect(snapshot.profile.premiumCurrency).toBeGreaterThan(5000);
  });
});

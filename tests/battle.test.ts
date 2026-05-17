import { describe, expect, it } from 'vitest';
import {
  calculateBattleStars,
  canCastLeaderSkill,
  castLeaderSkill,
  createBattleSimulation,
  stepBattleSimulation,
} from '../src/game/core/battle';
import { createInitialSnapshot, createShowcaseSnapshot, unlockStarterCompanion } from '../src/game/core/state';
import { getStage } from '../src/game/data/world';

function runBattleUntilResolved(maxMs: number) {
  const stage = getStage('stage_01_01');
  let state = createBattleSimulation(stage, 'normal', createShowcaseSnapshot());

  for (let elapsed = 0; elapsed < maxMs; elapsed += 100) {
    state = stepBattleSimulation(state, 100);

    if (state.result !== 'fighting') {
      break;
    }
  }

  return { stage, state };
}

describe('battle simulation', () => {
  it('clears the first stage with auto battle', () => {
    const { stage, state } = runBattleUntilResolved(15000);

    expect(state.result).toBe('clear');
    expect(state.elapsedMs).toBeLessThan(15000);
    expect(calculateBattleStars(stage, state)).toBeGreaterThanOrEqual(1);
  });

  it('charges and consumes the manual leader skill', () => {
    const stage = getStage('stage_01_01');
    let state = createBattleSimulation(stage, 'normal', unlockStarterCompanion(createInitialSnapshot(), Date.now()));

    for (let elapsed = 0; elapsed < 4500; elapsed += 100) {
      state = stepBattleSimulation({ ...state, autoPlayer: false }, 100);
    }

    expect(canCastLeaderSkill(state)).toBe(true);
    const hpBefore = state.enemy.hp;
    const next = castLeaderSkill(state, true);

    expect(next.enemy.hp).toBeLessThan(hpBefore);
    expect(next.manualSkillUses).toBe(1);
    expect(next.leaderSkillChargeMs).toBe(0);
  });

  it('lets the enemy deal damage to the party over time', () => {
    const stage = getStage('stage_06_24');
    let state = createBattleSimulation(stage, 'hell', unlockStarterCompanion(createInitialSnapshot(), Date.now()));

    for (let elapsed = 0; elapsed < 3000; elapsed += 100) {
      state = stepBattleSimulation({ ...state, autoPlayer: false }, 100);
    }

    expect(state.totalDamageTaken).toBeGreaterThan(0);
    expect(state.party.some((member) => member.hp < member.maxHp)).toBe(true);
  });

  it('builds mixed encounter patterns for field stages', () => {
    const stage = getStage('stage_03_02');
    const state = createBattleSimulation(stage, 'normal', unlockStarterCompanion(createInitialSnapshot(), Date.now()));
    const patterns = new Set(state.enemies.map((enemy) => enemy.pattern));

    expect(patterns.has('ranged')).toBe(true);
    expect(patterns.has('melee')).toBe(true);
  });

  it('emits telegraph or projectile effects during boss combat', () => {
    const stage = getStage('stage_06_24');
    let state = createBattleSimulation(stage, 'hell', createInitialSnapshot());

    for (let elapsed = 0; elapsed < 5200; elapsed += 100) {
      state = stepBattleSimulation({ ...state, autoPlayer: false }, 100);

      if (state.effects.some((effect) => effect.kind === 'telegraph' || effect.kind === 'projectile' || effect.kind === 'burst')) {
        break;
      }
    }

    expect(state.effects.some((effect) => effect.kind === 'telegraph' || effect.kind === 'projectile' || effect.kind === 'burst')).toBe(true);
  });

  it('lets support roles apply a timed damage boost to an ally', () => {
    const snapshot = createShowcaseSnapshot(Date.UTC(2026, 3, 4, 0, 0, 0));
    snapshot.roster.selectedPartyIds = ['hero', 'helma', 'laila', 'luna'];
    const stage = getStage('stage_03_05');
    let state = createBattleSimulation(stage, 'normal', snapshot);

    state.party = state.party.map((member) =>
      member.id === 'helma'
        ? {
            ...member,
            attackTimerMs: member.attackIntervalMs,
          }
        : member,
    );
    state.enemies = state.enemies.map((enemy) => ({
      ...enemy,
      active: true,
      spawnAtMs: 0,
    }));

    state = stepBattleSimulation({ ...state, autoPlayer: false }, 100);

    expect(state.party.some((member) => member.id !== 'helma' && member.damageBoostMs > 0)).toBe(true);
  });

  it('lets guardians taunt ranged threats and grant a shield', () => {
    const snapshot = createShowcaseSnapshot(Date.UTC(2026, 3, 4, 0, 0, 0));
    snapshot.roster.selectedPartyIds = ['seraphin', 'hero', 'laila', 'lucian'];
    const stage = getStage('stage_06_24');
    let state = createBattleSimulation(stage, 'normal', snapshot);

    state.party = state.party.map((member) =>
      member.id === 'seraphin'
        ? {
            ...member,
            attackTimerMs: member.attackIntervalMs,
          }
        : member,
    );
    state.enemies = state.enemies.map((enemy) => ({
      ...enemy,
      active: true,
      spawnAtMs: 0,
    }));

    state = stepBattleSimulation({ ...state, autoPlayer: false }, 100);

    expect(state.party.some((member) => member.shieldHp > 0)).toBe(true);
    expect(state.party.some((member) => member.id === 'seraphin' && member.guardTauntMs > 0)).toBe(true);
  });

  it('lets mage attacks splash across clustered enemies', () => {
    const snapshot = createInitialSnapshot(Date.UTC(2026, 3, 4, 0, 0, 0));
    snapshot.roster.ownedCharacters = { sera: { copies: 1 } };
    snapshot.roster.selectedPartyIds = ['sera'];
    const stage = getStage('stage_03_02');
    let state = createBattleSimulation(stage, 'normal', snapshot);

    state.party = state.party.map((member) => ({
      ...member,
      attackTimerMs: member.attackIntervalMs,
      x: 150,
      homeX: 150,
      range: 220,
    }));
    state.enemies = state.enemies.map((enemy) => ({
      ...enemy,
      active: true,
      spawnAtMs: 0,
    }));

    state = stepBattleSimulation({ ...state, autoPlayer: false }, 100);

    expect(state.enemies.filter((enemy) => enemy.hp < enemy.maxHp).length).toBeGreaterThan(1);
  });
});

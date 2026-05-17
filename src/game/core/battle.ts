import { getPartySummary, getRolePreset } from './party';
import { getBattleEquipmentBonus } from './equipment';
import { getStageMonsterEncounterPlan } from '../data/monsters';
import type { BattleRole, SaveSnapshot, StageDefinition, StageDifficulty } from '../types';

export type EnemyPattern = 'melee' | 'ranged' | 'charger' | 'caster' | 'boss';
export type BattleEffectKind =
  | 'slash'
  | 'impact'
  | 'heal'
  | 'buff'
  | 'projectile'
  | 'telegraph'
  | 'burst'
  | 'charge';

export interface BattleEffectState {
  id: string;
  kind: BattleEffectKind;
  source: 'party' | 'enemy';
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  size: number;
  color: number;
  ttlMs: number;
  maxTtlMs: number;
}

export interface PartyMemberBattleState {
  id: string;
  name: string;
  role: BattleRole;
  power: number;
  lane: number;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  range: number;
  moveSpeed: number;
  maxHp: number;
  hp: number;
  attackPower: number;
  attackIntervalMs: number;
  attackTimerMs: number;
  highlightMs: number;
  shieldHp: number;
  damageBoostMs: number;
  damageBoostRatio: number;
  guardTauntMs: number;
}

export interface EnemyUnitBattleState {
  id: string;
  name: string;
  subjectId?: string;
  kind: 'grunt' | 'elite' | 'boss';
  pattern: EnemyPattern;
  lane: number;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  range: number;
  moveSpeed: number;
  spawnAtMs: number;
  active: boolean;
  maxHp: number;
  hp: number;
  attackPower: number;
  attackIntervalMs: number;
  attackTimerMs: number;
  castLeadMs: number;
  castingMs: number;
  highlightMs: number;
  projectileColor: number;
  attackFxColor: number;
  shotSpeed: number;
}

export interface EnemyBattleState {
  name: string;
  maxHp: number;
  hp: number;
  attackPower: number;
  attackIntervalMs: number;
  attackTimerMs: number;
  castLeadMs: number;
  castingMs: number;
  highlightMs: number;
}

export interface BattleSimulationState {
  elapsedMs: number;
  result: 'fighting' | 'clear' | 'fail';
  autoPlayer: boolean;
  leaderSkillChargeMs: number;
  leaderSkillMaxMs: number;
  leaderCommandSkillChargeMs: number;
  leaderCommandSkillMaxMs: number;
  manualSkillUses: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  lastEvent: string;
  party: PartyMemberBattleState[];
  enemies: EnemyUnitBattleState[];
  enemy: EnemyBattleState;
  effects: BattleEffectState[];
}

const DAMAGE_FLASH_MS = 220;
const LEADER_SKILL_DAMAGE = 94;
const LEADER_SKILL_CHARGE_MS = 4200;
const LEADER_COMMAND_SKILL_CHARGE_MS = 2600;
const PARTY_LANE_Y = [258, 324, 390, 456] as const;
const ENEMY_LANE_Y = [242, 308, 374, 440] as const;
const FIELD_LEFT_X = 94;
const FIELD_RIGHT_X = 278;
const PARTY_CONTROL_LEFT_X = 72;
const PARTY_CONTROL_RIGHT_X = 252;
const FIELD_TOP_Y = 228;
const FIELD_BOTTOM_Y = 482;
const MAX_EFFECTS = 40;
const SHIELD_CAP_RATIO = 0.55;
const GUARDIAN_SHIELD_AMOUNT = 92;
const GUARDIAN_TAUNT_MS = 2400;
const SUPPORT_BUFF_MS = 2600;
const SUPPORT_BUFF_RATIO = 0.36;

const DIFFICULTY_SCALARS: Record<StageDifficulty, { enemyHp: number; enemyDamage: number; enemySpeed: number }> = {
  normal: { enemyHp: 1, enemyDamage: 1, enemySpeed: 1 },
  hard: { enemyHp: 1.45, enemyDamage: 1.35, enemySpeed: 1.15 },
  hell: { enemyHp: 1.95, enemyDamage: 1.72, enemySpeed: 1.3 },
};

const ROLE_TUNING: Record<BattleRole, { range: number; moveSpeed: number; offsetX: number }> = {
  leader: { range: 44, moveSpeed: 104, offsetX: 10 },
  guardian: { range: 34, moveSpeed: 86, offsetX: 20 },
  mage: { range: 116, moveSpeed: 94, offsetX: -8 },
  healer: { range: 118, moveSpeed: 90, offsetX: -18 },
  ranger: { range: 126, moveSpeed: 104, offsetX: -10 },
  support: { range: 104, moveSpeed: 92, offsetX: -12 },
  warrior: { range: 40, moveSpeed: 98, offsetX: 6 },
  assassin: { range: 30, moveSpeed: 118, offsetX: 18 },
};

const ENEMY_KIND_TUNING = {
  grunt: { hpWeight: 1, attackMult: 0.92, intervalMult: 0.92 },
  elite: { hpWeight: 1.75, attackMult: 1.15, intervalMult: 1.06 },
  boss: { hpWeight: 2.45, attackMult: 1.35, intervalMult: 1.18 },
} as const;

const ENEMY_PATTERN_TUNING: Record<
  EnemyPattern,
  {
    hpWeight: number;
    range: number;
    moveSpeed: number;
    attackMult: number;
    intervalMult: number;
    castLeadMs: number;
    projectileColor: number;
    attackFxColor: number;
    shotSpeed: number;
  }
> = {
  melee: {
    hpWeight: 1,
    range: 28,
    moveSpeed: 74,
    attackMult: 1,
    intervalMult: 1,
    castLeadMs: 320,
    projectileColor: 0xe58d6a,
    attackFxColor: 0xf6d28a,
    shotSpeed: 0,
  },
  ranged: {
    hpWeight: 0.94,
    range: 126,
    moveSpeed: 62,
    attackMult: 0.95,
    intervalMult: 1.08,
    castLeadMs: 420,
    projectileColor: 0xffd27d,
    attackFxColor: 0xffefb8,
    shotSpeed: 340,
  },
  charger: {
    hpWeight: 1.08,
    range: 34,
    moveSpeed: 100,
    attackMult: 1.16,
    intervalMult: 1.14,
    castLeadMs: 360,
    projectileColor: 0xf58a6c,
    attackFxColor: 0xffb27d,
    shotSpeed: 0,
  },
  caster: {
    hpWeight: 1.12,
    range: 144,
    moveSpeed: 56,
    attackMult: 1.03,
    intervalMult: 1.22,
    castLeadMs: 560,
    projectileColor: 0x9dd5ff,
    attackFxColor: 0xc6b5ff,
    shotSpeed: 280,
  },
  boss: {
    hpWeight: 1.32,
    range: 132,
    moveSpeed: 68,
    attackMult: 1.28,
    intervalMult: 1.3,
    castLeadMs: 620,
    projectileColor: 0xff9c73,
    attackFxColor: 0xffd27d,
    shotSpeed: 260,
  },
};

let effectSerial = 0;

export function createBattleSimulation(
  stage: StageDefinition,
  difficulty: StageDifficulty,
  snapshot: SaveSnapshot,
): BattleSimulationState {
  const scale = DIFFICULTY_SCALARS[difficulty];
  const targetBattleScale = Math.max(1.8, Math.min(2.8, stage.baseTimeSeconds / 40));
  const encounterPower = Math.round(
    (
      360 +
      stage.recommendedPower * 1.72 +
      stage.order * 42 +
      getStageBonusHp(stage.stageType) * 1.8
    ) *
      scale.enemyHp *
      targetBattleScale,
  );
  const enemyAttackPower = Math.round(
    (18 + stage.recommendedPower * 0.032 + stage.order * 1.4) * scale.enemyDamage,
  );
  const enemyAttackIntervalMs = Math.max(1500, Math.round((2650 - stage.order * 18) / scale.enemySpeed));
  const enemies = buildEncounter(stage, encounterPower, enemyAttackPower, enemyAttackIntervalMs);

  return summarizeEncounter({
    elapsedMs: 0,
    result: 'fighting',
    autoPlayer: true,
    leaderSkillChargeMs: 0,
    leaderSkillMaxMs: LEADER_SKILL_CHARGE_MS,
    leaderCommandSkillChargeMs: 0,
    leaderCommandSkillMaxMs: LEADER_COMMAND_SKILL_CHARGE_MS,
    manualSkillUses: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    lastEvent: '파티가 전장에 진입했습니다.',
    party: buildPartyMembers(snapshot),
    enemies,
    enemy: {
      name: '적군',
      maxHp: 1,
      hp: 1,
      attackPower: 0,
      attackIntervalMs: 0,
      attackTimerMs: 0,
      castLeadMs: 0,
      castingMs: 0,
      highlightMs: 0,
    },
    effects: [],
  });
}

export function stepBattleSimulation(
  state: BattleSimulationState,
  deltaMs: number,
): BattleSimulationState {
  if (state.result !== 'fighting') {
    return state;
  }

  const nextElapsed = state.elapsedMs + deltaMs;
  let next: BattleSimulationState = {
    ...state,
    elapsedMs: nextElapsed,
    leaderSkillChargeMs: Math.min(state.leaderSkillMaxMs, state.leaderSkillChargeMs + deltaMs),
    leaderCommandSkillChargeMs: Math.min(
      state.leaderCommandSkillMaxMs,
      state.leaderCommandSkillChargeMs + deltaMs,
    ),
    party: state.party.map((member) => ({
      ...member,
      attackTimerMs: member.attackTimerMs + deltaMs,
      highlightMs: Math.max(0, member.highlightMs - deltaMs),
      damageBoostMs: Math.max(0, member.damageBoostMs - deltaMs),
      damageBoostRatio: member.damageBoostMs > deltaMs ? member.damageBoostRatio : 0,
      guardTauntMs: Math.max(0, member.guardTauntMs - deltaMs),
    })),
    enemies: state.enemies.map((enemy) => ({
      ...enemy,
      attackTimerMs: enemy.attackTimerMs + deltaMs,
      castingMs: Math.max(0, enemy.castingMs - deltaMs),
      highlightMs: Math.max(0, enemy.highlightMs - deltaMs),
      active: enemy.active || nextElapsed >= enemy.spawnAtMs,
    })),
    enemy: { ...state.enemy },
    effects: advanceEffects(state.effects, deltaMs),
  };

  next = activateEnemyAnnouncementsV2(next);

  if (next.autoPlayer && canCastLeaderSkill(next)) {
    next = castLeaderSkill(next, false);
  }

  for (const member of next.party) {
    if (next.result !== 'fighting' || member.hp <= 0) {
      continue;
    }

    const supported = trySupportActionV2(next, member.id);
    if (supported !== next) {
      next = supported;
      continue;
    }

    const guarded = tryGuardianActionV2(next, member.id);
    if (guarded !== next) {
      next = guarded;
      continue;
    }

    next = stepPartyMemberV2(next, member.id, deltaMs, !(member.role === 'leader' && !next.autoPlayer));
  }

  for (const enemy of next.enemies) {
    if (next.result !== 'fighting' || enemy.hp <= 0 || !enemy.active) {
      continue;
    }

    next = stepEnemyUnitV2(next, enemy.id, deltaMs);
  }

  next = summarizeEncounter(next);

  if (next.enemies.every((enemy) => enemy.hp <= 0)) {
    return {
      ...next,
      result: 'clear',
      lastEvent: '적 부대를 모두 격파했습니다.',
    };
  }

  if (next.party.every((member) => member.hp <= 0)) {
    return {
      ...next,
      result: 'fail',
      lastEvent: '파티가 전멸했습니다.',
    };
  }

  return next;
}

export function canCastLeaderSkill(state: BattleSimulationState): boolean {
  const leader = state.party.find((member) => member.role === 'leader');
  return Boolean(leader && leader.hp > 0 && state.leaderSkillChargeMs >= state.leaderSkillMaxMs);
}

export function castLeaderSkill(
  state: BattleSimulationState,
  manualCast: boolean,
): BattleSimulationState {
  if (state.result !== 'fighting' || !canCastLeaderSkill(state)) {
    return state;
  }

  const leader = state.party.find((member) => member.role === 'leader');
  const livingEnemies = getLivingEnemies(state);
  if (!leader || livingEnemies.length === 0) {
    return state;
  }

  let totalDamage = 0;
  const nextEnemies = state.enemies.map((enemy) => {
    if (!enemy.active || enemy.hp <= 0) {
      return enemy;
    }

    const damage = enemy.kind === 'boss' ? Math.round(LEADER_SKILL_DAMAGE * 1.2) : LEADER_SKILL_DAMAGE;
    totalDamage += damage;
    return {
      ...enemy,
      hp: Math.max(0, enemy.hp - damage),
      highlightMs: DAMAGE_FLASH_MS,
    };
  });

  return summarizeEncounter({
    ...state,
    leaderSkillChargeMs: 0,
    manualSkillUses: manualCast ? state.manualSkillUses + 1 : state.manualSkillUses,
    totalDamageDealt: state.totalDamageDealt + totalDamage,
    lastEvent: manualCast
      ? `카인의 수동 스킬이 적 전열 전체에 ${totalDamage} 피해를 줬습니다.`
      : `카인의 자동 스킬이 적 전열 전체에 ${totalDamage} 피해를 줬습니다.`,
    party: state.party.map((member) =>
      member.role === 'leader' ? { ...member, highlightMs: DAMAGE_FLASH_MS } : member,
    ),
    enemies: nextEnemies,
    enemy: { ...state.enemy },
    effects: appendEffects(state.effects, [
      createEffect('burst', 'party', leader.x, leader.y, leader.x, leader.y, 26, 0xffe08f, 420),
      ...livingEnemies.map((enemy) =>
        createEffect(
          'burst',
          'party',
          leader.x,
          leader.y,
          enemy.x,
          enemy.y,
          enemy.kind === 'boss' ? 24 : 18,
          0xffd27d,
          420,
        ),
      ),
    ]),
  });
}

export function canCastLeaderCommandSkill(state: BattleSimulationState): boolean {
  const leader = state.party.find((member) => member.role === 'leader');
  return Boolean(
    leader &&
      leader.hp > 0 &&
      state.leaderCommandSkillChargeMs >= state.leaderCommandSkillMaxMs &&
      getLivingEnemies(state).length > 0,
  );
}

export function castLeaderCommandSkill(state: BattleSimulationState): BattleSimulationState {
  if (state.result !== 'fighting' || !canCastLeaderCommandSkill(state)) {
    return state;
  }

  const leaderIndex = state.party.findIndex((member) => member.role === 'leader');
  const leader = state.party[leaderIndex];
  const target = leader ? findEnemyTarget(state, leader) : null;

  if (!leader || !target) {
    return state;
  }

  const mainDamage = Math.max(48, Math.round(leader.attackPower * 1.85));
  const sideTarget = getLivingEnemies(state)
    .filter((enemy) => enemy.id !== target.id && Math.abs(enemy.lane - target.lane) <= 1)
    .sort((left, right) => Math.abs(left.y - target.y) - Math.abs(right.y - target.y) || left.x - right.x)[0];
  const hits = [{ enemyId: target.id, damage: mainDamage }];
  if (sideTarget) {
    hits.push({ enemyId: sideTarget.id, damage: Math.max(18, Math.round(mainDamage * 0.44)) });
  }

  const attacked = dealEnemyHits(
    state,
    leader.id,
    hits,
    `${leader.name} cut through the line for ${hits.reduce((sum, hit) => sum + hit.damage, 0)}.`,
  );
  const snappedX = clamp(target.x - Math.max(18, leader.range - 10), PARTY_CONTROL_LEFT_X, PARTY_CONTROL_RIGHT_X);
  const snappedY = clamp(target.y, FIELD_TOP_Y, FIELD_BOTTOM_Y);

  return summarizeEncounter({
    ...attacked,
    leaderCommandSkillChargeMs: 0,
    manualSkillUses: attacked.manualSkillUses + 1,
    party: attacked.party.map((member, index) =>
      index !== leaderIndex
        ? member
        : {
            ...member,
            x: snappedX,
            y: snappedY,
            lane: getNearestLaneIndex(snappedY, PARTY_LANE_Y),
            attackTimerMs: 0,
            highlightMs: DAMAGE_FLASH_MS,
          },
    ),
    effects: appendEffects(attacked.effects, [
      createEffect('charge', 'party', leader.x, leader.y, target.x, target.y, 18, 0xffd27d, 180),
      createEffect('slash', 'party', target.x - 12, target.y, target.x, target.y, 22, 0xfff0ba, 220),
      createEffect('impact', 'party', target.x, target.y, target.x, target.y, 18, 0xf6c46d, 320),
      ...(sideTarget
        ? [createEffect('impact', 'party', sideTarget.x, sideTarget.y, sideTarget.x, sideTarget.y, 14, 0xf6c46d, 260)]
        : []),
    ]),
  });
}

export function applyLeaderManualMovement(
  state: BattleSimulationState,
  inputX: number,
  inputY: number,
  deltaMs: number,
): BattleSimulationState {
  if (state.result !== 'fighting') {
    return state;
  }

  const leaderIndex = state.party.findIndex((member) => member.role === 'leader');
  if (leaderIndex < 0) {
    return state;
  }

  const leader = state.party[leaderIndex];
  if (leader.hp <= 0) {
    return state;
  }

  const magnitude = Math.hypot(inputX, inputY);
  if (magnitude <= 0.08) {
    return state;
  }

  const speed = leader.moveSpeed * 1.18 * (deltaMs / 1000);
  const normalizedX = inputX / magnitude;
  const normalizedY = inputY / magnitude;
  const nextX = clamp(leader.x + normalizedX * speed, PARTY_CONTROL_LEFT_X, PARTY_CONTROL_RIGHT_X);
  const nextY = clamp(leader.y + normalizedY * speed, FIELD_TOP_Y, FIELD_BOTTOM_Y);

  return updatePartyMember(state, leaderIndex, {
    x: nextX,
    y: nextY,
  });
}

export function setAutoBattleMode(state: BattleSimulationState, enabled: boolean): BattleSimulationState {
  if (state.autoPlayer === enabled) {
    return state;
  }

  return {
    ...state,
    autoPlayer: enabled,
    lastEvent: enabled ? 'Auto battle resumed.' : 'Manual leader control engaged.',
  };
}

export function toggleAutoBattle(state: BattleSimulationState): BattleSimulationState {
  return {
    ...state,
    autoPlayer: !state.autoPlayer,
    lastEvent: !state.autoPlayer
      ? '조작 캐릭터 자동 전투를 켰습니다.'
      : '조작 캐릭터 자동 전투를 껐습니다.',
  };
}

export function calculateBattleStars(
  stage: StageDefinition,
  result: BattleSimulationState,
): number {
  if (result.result !== 'clear') {
    return 0;
  }

  const clearSeconds = Math.max(1, Math.round(result.elapsedMs / 1000));

  if (clearSeconds <= stage.baseTimeSeconds) {
    return 3;
  }

  if (clearSeconds <= Math.round(stage.baseTimeSeconds * 1.25)) {
    return 2;
  }

  return 1;
}

export function getPartyHpRatio(state: BattleSimulationState): number {
  const totalHp = state.party.reduce((sum, member) => sum + member.hp, 0);
  const totalMaxHp = state.party.reduce((sum, member) => sum + member.maxHp, 0);
  return totalMaxHp <= 0 ? 0 : totalHp / totalMaxHp;
}

function buildPartyMembers(snapshot: SaveSnapshot): PartyMemberBattleState[] {
  return getPartySummary(snapshot).map((entry, index) => {
    const preset = getRolePreset(entry.role);
    const tuning = ROLE_TUNING[entry.role];
    const powerScale = 1 + Math.max(0, entry.power - 800) / 2800;
    const equipmentBonus = getBattleEquipmentBonus(snapshot, entry.id, entry.role);

    return createMember(
      entry.id,
      entry.name,
      entry.role,
      entry.power,
      index,
      FIELD_LEFT_X + tuning.offsetX,
      PARTY_LANE_Y[index % PARTY_LANE_Y.length],
      FIELD_LEFT_X + tuning.offsetX,
      PARTY_LANE_Y[index % PARTY_LANE_Y.length],
      tuning.range,
      tuning.moveSpeed,
      Math.round(preset.maxHp * powerScale) + equipmentBonus.maxHp,
      Math.round(preset.attackPower * powerScale) + equipmentBonus.attackPower,
      Math.max(
        560,
        Math.round(
          preset.attackIntervalMs -
            (entry.rarity - 3) * 28 -
            entry.transcendence * 14 -
            equipmentBonus.attackIntervalReductionMs,
        ),
      ),
    );
  });
}

function createMember(
  id: string,
  name: string,
  role: PartyMemberBattleState['role'],
  power: number,
  lane: number,
  x: number,
  y: number,
  homeX: number,
  homeY: number,
  range: number,
  moveSpeed: number,
  maxHp: number,
  attackPower: number,
  attackIntervalMs: number,
): PartyMemberBattleState {
  return {
    id,
    name,
    role,
    power,
    lane,
    x,
    y,
    homeX,
    homeY,
    range,
    moveSpeed,
    maxHp,
    hp: maxHp,
    attackPower,
    attackIntervalMs,
    attackTimerMs: 0,
    highlightMs: 0,
    shieldHp: 0,
    damageBoostMs: 0,
    damageBoostRatio: 0,
    guardTauntMs: 0,
  };
}

function buildEncounter(
  stage: StageDefinition,
  encounterPower: number,
  baseAttackPower: number,
  baseAttackIntervalMs: number,
): EnemyUnitBattleState[] {
  const plan = getEncounterPlanV2(stage);
  const totalWeight = plan.reduce((sum, entry) => {
    return sum + ENEMY_KIND_TUNING[entry.kind].hpWeight * ENEMY_PATTERN_TUNING[entry.pattern].hpWeight;
  }, 0);

  return plan.map((entry, index) => {
    const kindTuning = ENEMY_KIND_TUNING[entry.kind];
    const patternTuning = ENEMY_PATTERN_TUNING[entry.pattern];
    const hpWeight = kindTuning.hpWeight * patternTuning.hpWeight;
    const maxHp = Math.round(encounterPower * (hpWeight / totalWeight));
    const interval = Math.round(baseAttackIntervalMs * kindTuning.intervalMult * patternTuning.intervalMult);

    return {
      id: `enemy_${index + 1}`,
      name: entry.name,
      subjectId: entry.subjectId,
      kind: entry.kind,
      pattern: entry.pattern,
      lane: entry.lane,
      x: FIELD_RIGHT_X + 18 + (index % 2) * 12,
      y: ENEMY_LANE_Y[entry.lane],
      homeX: FIELD_RIGHT_X - entry.lane * 10,
      homeY: ENEMY_LANE_Y[entry.lane],
      range: patternTuning.range,
      moveSpeed: patternTuning.moveSpeed,
      spawnAtMs: Math.round(entry.spawnAtMs * 1.6),
      active: entry.spawnAtMs === 0,
      maxHp,
      hp: maxHp,
      attackPower: Math.round(baseAttackPower * kindTuning.attackMult * patternTuning.attackMult),
      attackIntervalMs: interval,
      attackTimerMs: 0,
      castLeadMs: patternTuning.castLeadMs,
      castingMs: 0,
      highlightMs: 0,
      projectileColor: patternTuning.projectileColor,
      attackFxColor: patternTuning.attackFxColor,
      shotSpeed: patternTuning.shotSpeed,
    };
  });
}

function getEncounterPlan(stage: StageDefinition): Array<{
  kind: 'grunt' | 'elite' | 'boss';
  name: string;
  spawnAtMs: number;
  lane: number;
}> {
  switch (stage.stageType) {
    case 'intro':
      return [
        { kind: 'grunt', name: '초원 잔당', spawnAtMs: 0, lane: 0 },
        { kind: 'grunt', name: '가시늑대', spawnAtMs: 0, lane: 2 },
        { kind: 'elite', name: '균열 도적', spawnAtMs: 1700, lane: 1 },
      ];
    case 'field':
    case 'pursuit':
      return [
        { kind: 'grunt', name: '야전병', spawnAtMs: 0, lane: 0 },
        { kind: 'grunt', name: '돌진수', spawnAtMs: 0, lane: 2 },
        { kind: 'grunt', name: '사수', spawnAtMs: 1400, lane: 3 },
        { kind: 'elite', name: '정예 추적병', spawnAtMs: 2800, lane: 1 },
      ];
    case 'dungeon':
    case 'stronghold':
    case 'defense':
    case 'crisis':
      return [
        { kind: 'grunt', name: '전열병', spawnAtMs: 0, lane: 0 },
        { kind: 'grunt', name: '전열병', spawnAtMs: 0, lane: 2 },
        { kind: 'elite', name: '경비대장', spawnAtMs: 1400, lane: 1 },
        { kind: 'grunt', name: '후방 사수', spawnAtMs: 2200, lane: 3 },
        { kind: 'elite', name: '균열 지휘관', spawnAtMs: 3200, lane: 1 },
      ];
    case 'mid_boss':
      return [
        { kind: 'grunt', name: '호위병', spawnAtMs: 0, lane: 0 },
        { kind: 'grunt', name: '호위병', spawnAtMs: 0, lane: 2 },
        { kind: 'boss', name: stage.name, spawnAtMs: 1800, lane: 1 },
      ];
    case 'pre_boss':
      return [
        { kind: 'grunt', name: '봉인 수호병', spawnAtMs: 0, lane: 0 },
        { kind: 'elite', name: '균열 수문장', spawnAtMs: 1200, lane: 2 },
        { kind: 'elite', name: '전위 지휘관', spawnAtMs: 2400, lane: 1 },
      ];
    case 'final_boss':
      return [
        { kind: 'grunt', name: '보스 호위병', spawnAtMs: 0, lane: 0 },
        { kind: 'grunt', name: '보스 호위병', spawnAtMs: 0, lane: 3 },
        { kind: 'elite', name: '균열 친위대', spawnAtMs: 1600, lane: 2 },
        { kind: 'boss', name: stage.name, spawnAtMs: 2800, lane: 1 },
      ];
  }
}

function activateEnemyAnnouncements(state: BattleSimulationState): BattleSimulationState {
  const activated = state.enemies.find(
    (enemy) => enemy.active && enemy.highlightMs <= 0 && state.elapsedMs >= enemy.spawnAtMs && state.elapsedMs - enemy.spawnAtMs < 50,
  );

  if (!activated) {
    return state;
  }

  return {
    ...state,
    lastEvent: `${activated.name}이 전장에 등장했습니다.`,
  };
}

function trySupportAction(state: BattleSimulationState, memberId: string): BattleSimulationState {
  const memberIndex = state.party.findIndex((member) => member.id === memberId);
  const member = state.party[memberIndex];

  if (
    member.hp <= 0 ||
    member.attackTimerMs < member.attackIntervalMs ||
    (member.role !== 'healer' && member.role !== 'support')
  ) {
    return state;
  }

  const target = [...state.party]
    .filter((entry) => entry.hp > 0)
    .sort((left, right) => left.hp / left.maxHp - right.hp / right.maxHp)[0];

  if (!target || target.hp / target.maxHp > (member.role === 'healer' ? 0.82 : 0.7)) {
    return state;
  }

  const healAmount = member.role === 'healer' ? 68 : 48;

  return {
    ...state,
    lastEvent: `${member.name}가 ${target.name}을 ${healAmount} 회복했습니다.`,
    party: state.party.map((entry) => {
      if (entry.id === memberId) {
        return { ...entry, attackTimerMs: 0, highlightMs: DAMAGE_FLASH_MS };
      }

      if (entry.id !== target.id) {
        return entry;
      }

      return {
        ...entry,
        hp: Math.min(entry.maxHp, entry.hp + healAmount),
        highlightMs: DAMAGE_FLASH_MS,
      };
    }),
  };
}

function stepPartyMember(
  state: BattleSimulationState,
  memberId: string,
  deltaMs: number,
): BattleSimulationState {
  const memberIndex = state.party.findIndex((entry) => entry.id === memberId);
  const member = state.party[memberIndex];
  const target = findEnemyTarget(state, member);

  if (!target) {
    return movePartyMemberTowardHome(state, memberIndex, deltaMs);
  }

  const distance = target.x - member.x;

  if (distance > member.range) {
    return updatePartyMember(state, memberIndex, {
      x: Math.min(target.x - member.range, member.x + member.moveSpeed * (deltaMs / 1000)),
    });
  }

  if (member.attackTimerMs < member.attackIntervalMs) {
    return state;
  }

  const damage = Math.round(member.attackPower * getRoleDamageMultiplier(member.role));
  return dealEnemyDamage(state, member.id, target.id, damage, `${member.name}의 공격 ${damage}`);
}

function stepEnemyUnit(
  state: BattleSimulationState,
  enemyId: string,
  deltaMs: number,
): BattleSimulationState {
  const enemyIndex = state.enemies.findIndex((entry) => entry.id === enemyId);
  const enemy = state.enemies[enemyIndex];
  const target = findPartyTarget(state, enemy);

  if (!target) {
    return updateEnemy(state, enemyIndex, { x: enemy.homeX });
  }

  const distance = enemy.x - target.x;

  if (distance > enemy.range) {
    return updateEnemy(state, enemyIndex, {
      x: Math.max(target.x + enemy.range, enemy.x - enemy.moveSpeed * (deltaMs / 1000)),
    });
  }

  if (enemy.attackTimerMs >= enemy.attackIntervalMs - enemy.castLeadMs && enemy.castingMs <= 0) {
    return updateEnemy(state, enemyIndex, {
      castingMs: enemy.castLeadMs,
      highlightMs: DAMAGE_FLASH_MS,
      attackTimerMs: enemy.attackTimerMs,
      x: enemy.x,
    }, `${enemy.name}이 ${target.name}을 노리고 강공을 준비합니다.`);
  }

  if (enemy.attackTimerMs < enemy.attackIntervalMs) {
    return state;
  }

  return dealPartyDamage(
    state,
    target.id,
    enemy.attackPower,
    `${enemy.name}의 공격이 ${target.name}에게 ${enemy.attackPower} 피해를 줬습니다.`,
    enemyIndex,
  );
}

function dealEnemyDamage(
  state: BattleSimulationState,
  attackerId: string,
  enemyId: string,
  damage: number,
  eventText: string,
): BattleSimulationState {
  return dealEnemyHits(state, attackerId, [{ enemyId, damage }], eventText);
}

function dealEnemyHits(
  state: BattleSimulationState,
  attackerId: string,
  hits: Array<{ enemyId: string; damage: number }>,
  eventText: string,
): BattleSimulationState {
  const damageByEnemyId = new Map<string, number>();
  for (const hit of hits) {
    if (hit.damage <= 0) {
      continue;
    }

    damageByEnemyId.set(hit.enemyId, (damageByEnemyId.get(hit.enemyId) ?? 0) + hit.damage);
  }

  const attackerIndex = state.party.findIndex((member) => member.id === attackerId);
  const totalDamage = [...damageByEnemyId.values()].reduce((sum, value) => sum + value, 0);

  const next = {
    ...state,
    totalDamageDealt: state.totalDamageDealt + totalDamage,
    lastEvent: eventText,
    enemies: state.enemies.map((enemy) =>
      !damageByEnemyId.has(enemy.id)
        ? enemy
        : {
            ...enemy,
            hp: Math.max(0, enemy.hp - (damageByEnemyId.get(enemy.id) ?? 0)),
            highlightMs: DAMAGE_FLASH_MS,
          },
    ),
    party: state.party.map((member, index) =>
      index !== attackerIndex
        ? member
        : {
            ...member,
            attackTimerMs: 0,
            highlightMs: DAMAGE_FLASH_MS,
          },
    ),
    enemy: { ...state.enemy },
  };

  return summarizeEncounter(next);
}

function dealPartyDamage(
  state: BattleSimulationState,
  targetId: string,
  damage: number,
  eventText: string,
  enemyIndex: number,
  splashDamage = state.enemies[enemyIndex].kind === 'boss' ? Math.max(8, Math.round(damage * 0.28)) : 0,
  splashLaneDistance = splashDamage > 0 ? 1 : 0,
): BattleSimulationState {
  let totalDamageTaken = 0;
  const targetLane = state.party.find((entry) => entry.id === targetId)?.lane ?? 0;

  const nextParty = state.party.map((member) => {
    if (member.hp <= 0) {
      return member;
    }

    if (member.id === targetId) {
      const applied = applyIncomingDamage(member, damage);
      totalDamageTaken += applied.hpDamage;
      return {
        ...applied.member,
        highlightMs: DAMAGE_FLASH_MS,
      };
    }

    if (splashDamage > 0 && Math.abs(member.lane - targetLane) <= splashLaneDistance) {
      const applied = applyIncomingDamage(member, splashDamage);
      totalDamageTaken += applied.hpDamage;
      return {
        ...applied.member,
        highlightMs: DAMAGE_FLASH_MS,
      };
    }

    return member;
  });

  return summarizeEncounter({
    ...state,
    totalDamageTaken: state.totalDamageTaken + totalDamageTaken,
    lastEvent: eventText,
    party: nextParty,
    enemies: state.enemies.map((enemy, index) =>
      index !== enemyIndex
        ? enemy
        : {
            ...enemy,
            attackTimerMs: 0,
            castingMs: 0,
            highlightMs: DAMAGE_FLASH_MS,
          },
    ),
    enemy: { ...state.enemy },
  });
}

function applyIncomingDamage(
  member: PartyMemberBattleState,
  rawDamage: number,
): { member: PartyMemberBattleState; hpDamage: number; absorbedDamage: number } {
  let damage = rawDamage;

  if (member.role === 'guardian') {
    damage = Math.round(damage * (member.guardTauntMs > 0 ? 0.8 : 0.88));
  }

  if (member.role === 'leader') {
    damage = Math.round(damage * 0.94);
  }

  const absorbedDamage = Math.min(member.shieldHp, damage);
  const remainingDamage = Math.max(0, damage - absorbedDamage);

  return {
    member: {
      ...member,
      shieldHp: Math.max(0, member.shieldHp - absorbedDamage),
      hp: Math.max(0, member.hp - remainingDamage),
    },
    hpDamage: remainingDamage,
    absorbedDamage,
  };
}

function movePartyMemberTowardHome(
  state: BattleSimulationState,
  memberIndex: number,
  deltaMs: number,
): BattleSimulationState {
  const member = state.party[memberIndex];
  if (Math.abs(member.x - member.homeX) <= 1 && Math.abs(member.y - member.homeY) <= 1) {
    return state;
  }

  return updatePartyMember(
    state,
    memberIndex,
    moveTowardPoint(member.x, member.y, member.homeX, member.homeY, member.moveSpeed * 0.8, deltaMs),
  );
}

function moveEnemyTowardHome(
  state: BattleSimulationState,
  enemyIndex: number,
  deltaMs: number,
): BattleSimulationState {
  const enemy = state.enemies[enemyIndex];
  if (Math.abs(enemy.x - enemy.homeX) <= 1 && Math.abs(enemy.y - enemy.homeY) <= 1) {
    return state;
  }

  return updateEnemy(
    state,
    enemyIndex,
    moveTowardPoint(enemy.x, enemy.y, enemy.homeX, enemy.homeY, enemy.moveSpeed * 0.72, deltaMs),
  );
}

function updatePartyMember(
  state: BattleSimulationState,
  memberIndex: number,
  patch: Partial<PartyMemberBattleState>,
): BattleSimulationState {
  const nextParty = [...state.party];
  const nextMember = { ...nextParty[memberIndex], ...patch };
  if (patch.y !== undefined) {
    nextMember.y = clamp(nextMember.y, FIELD_TOP_Y, FIELD_BOTTOM_Y);
    nextMember.lane = getNearestLaneIndex(nextMember.y, PARTY_LANE_Y);
  }
  nextParty[memberIndex] = nextMember;
  return { ...state, party: nextParty };
}

function updateEnemy(
  state: BattleSimulationState,
  enemyIndex: number,
  patch: Partial<EnemyUnitBattleState>,
  eventText?: string,
): BattleSimulationState {
  const nextEnemies = [...state.enemies];
  const nextEnemy = { ...nextEnemies[enemyIndex], ...patch };
  if (patch.y !== undefined) {
    nextEnemy.y = clamp(nextEnemy.y, FIELD_TOP_Y, FIELD_BOTTOM_Y);
    nextEnemy.lane = getNearestLaneIndex(nextEnemy.y, ENEMY_LANE_Y);
  }
  nextEnemies[enemyIndex] = nextEnemy;
  return {
    ...state,
    enemies: nextEnemies,
    lastEvent: eventText ?? state.lastEvent,
  };
}

function moveTowardPoint(
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  speed: number,
  deltaMs: number,
): { x: number; y: number } {
  const dx = targetX - x;
  const dy = targetY - y;
  const distance = Math.hypot(dx, dy);
  if (distance <= 0.001) {
    return { x: targetX, y: targetY };
  }

  const maxStep = speed * (deltaMs / 1000);
  if (distance <= maxStep) {
    return { x: targetX, y: targetY };
  }

  const ratio = maxStep / distance;
  return {
    x: x + dx * ratio,
    y: y + dy * ratio,
  };
}

function getNearestLaneIndex(y: number, laneYs: readonly number[]): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < laneYs.length; index += 1) {
    const distance = Math.abs(y - laneYs[index]);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function getPartyAttackVerticalTolerance(member: PartyMemberBattleState): number {
  switch (member.role) {
    case 'leader':
    case 'guardian':
    case 'warrior':
    case 'assassin':
      return 26;
    case 'ranger':
    case 'mage':
      return 66;
    case 'healer':
    case 'support':
      return 60;
    default:
      return 36;
  }
}

function getEnemyAttackVerticalTolerance(enemy: EnemyUnitBattleState): number {
  switch (enemy.pattern) {
    case 'melee':
    case 'charger':
      return 26;
    case 'ranged':
      return 62;
    case 'caster':
    case 'boss':
      return 72;
    default:
      return 36;
  }
}

function findEnemyTarget(
  state: BattleSimulationState,
  member: PartyMemberBattleState,
): EnemyUnitBattleState | null {
  const living = getLivingEnemies(state);
  if (living.length === 0) {
    return null;
  }

  if (member.role === 'assassin') {
    return [...living].sort((left, right) => {
      const leftScore =
        getAssassinTargetPriority(left) * 100 +
        (1 - left.hp / left.maxHp) * 20 -
        left.x * 0.01 -
        Math.abs(left.y - member.y) * 0.12;
      const rightScore =
        getAssassinTargetPriority(right) * 100 +
        (1 - right.hp / right.maxHp) * 20 -
        right.x * 0.01 -
        Math.abs(right.y - member.y) * 0.12;
      return rightScore - leftScore;
    })[0];
  }

  if (member.role === 'mage') {
    return [...living].sort((left, right) => {
      const leftScore =
        getMageClusterScore(living, left) * 100 +
        kindPriority(left.kind) * 10 +
        left.hp / left.maxHp -
        Math.abs(left.y - member.y) * 0.08;
      const rightScore =
        getMageClusterScore(living, right) * 100 +
        kindPriority(right.kind) * 10 +
        right.hp / right.maxHp -
        Math.abs(right.y - member.y) * 0.08;
      return rightScore - leftScore;
    })[0];
  }

  return [...living].sort((left, right) => {
    const leftScore = Math.abs(left.y - member.y) * 1.6 + left.x * 0.22 - kindPriority(left.kind) * 8;
    const rightScore = Math.abs(right.y - member.y) * 1.6 + right.x * 0.22 - kindPriority(right.kind) * 8;
    return leftScore - rightScore;
  })[0];
}

function findPartyTarget(
  state: BattleSimulationState,
  enemy: EnemyUnitBattleState,
): PartyMemberBattleState | null {
  const living = state.party.filter((member) => member.hp > 0);
  if (living.length === 0) {
    return null;
  }

  const guardian = living.find((member) => member.role === 'guardian');
  if (guardian) {
    return guardian;
  }

  const sameLane = living
    .filter((member) => member.lane === enemy.lane)
    .sort((left, right) => right.x - left.x);

  if (sameLane.length > 0) {
    return sameLane[0];
  }

  return [...living].sort((left, right) => right.x - left.x)[0];
}

function getLivingEnemies(state: BattleSimulationState): EnemyUnitBattleState[] {
  return state.enemies.filter((enemy) => enemy.active && enemy.hp > 0);
}

function summarizeEncounter(state: BattleSimulationState): BattleSimulationState {
  const living = getLivingEnemies(state);
  const totalHp = Math.max(0, state.enemies.reduce((sum, enemy) => sum + enemy.hp, 0));
  const totalMaxHp = Math.max(1, state.enemies.reduce((sum, enemy) => sum + enemy.maxHp, 0));
  const focusEnemy =
    [...living].sort((left, right) => {
      if (right.kind !== left.kind) {
        return kindPriority(right.kind) - kindPriority(left.kind);
      }

      return left.x - right.x;
    })[0] ?? state.enemies[state.enemies.length - 1];

  return {
    ...state,
    enemy: {
      name: totalHp > 0 ? focusEnemy.name : '전장 정리 완료',
      maxHp: totalMaxHp,
      hp: totalHp,
      attackPower: focusEnemy?.attackPower ?? 0,
      attackIntervalMs: focusEnemy?.attackIntervalMs ?? 0,
      attackTimerMs: focusEnemy?.attackTimerMs ?? 0,
      castLeadMs: focusEnemy?.castLeadMs ?? 0,
      castingMs: focusEnemy?.castingMs ?? 0,
      highlightMs: focusEnemy?.highlightMs ?? 0,
    },
  };
}

function kindPriority(kind: EnemyUnitBattleState['kind']): number {
  switch (kind) {
    case 'grunt':
      return 1;
    case 'elite':
      return 2;
    case 'boss':
      return 3;
  }
}

function getEncounterPlanV2(stage: StageDefinition): Array<{
  kind: 'grunt' | 'elite' | 'boss';
  pattern: EnemyPattern;
  name: string;
  subjectId?: string;
  spawnAtMs: number;
  lane: number;
}> {
  return getStageMonsterEncounterPlan(stage).map((entry) => ({
    kind: entry.kind,
    pattern: entry.pattern,
    name: entry.name,
    subjectId: entry.runtimeSubjectId,
    spawnAtMs: entry.spawnAtMs,
    lane: entry.lane,
  }));
}

function activateEnemyAnnouncementsV2(state: BattleSimulationState): BattleSimulationState {
  const activated = state.enemies.find(
    (enemy) =>
      enemy.active &&
      enemy.highlightMs <= 0 &&
      state.elapsedMs >= enemy.spawnAtMs &&
      state.elapsedMs - enemy.spawnAtMs < 50,
  );

  if (!activated) {
    return state;
  }

  return {
    ...state,
    lastEvent: `${activated.name} entered lane ${activated.lane + 1}.`,
  };
}

function trySupportActionV2(state: BattleSimulationState, memberId: string): BattleSimulationState {
  const memberIndex = state.party.findIndex((member) => member.id === memberId);
  const member = state.party[memberIndex];

  if (
    member.hp <= 0 ||
    member.attackTimerMs < member.attackIntervalMs ||
    (member.role !== 'healer' && member.role !== 'support')
  ) {
    return state;
  }

  const healTarget = [...state.party]
    .filter((entry) => entry.hp > 0)
    .sort((left, right) => left.hp / left.maxHp - right.hp / right.maxHp)[0];

  if (member.role === 'healer') {
    if (!healTarget || healTarget.hp / healTarget.maxHp > 0.82) {
      return state;
    }

    const healAmount = Math.max(56, Math.round(34 + member.attackPower * 1.3));

    return {
      ...state,
      lastEvent: `${member.name} healed ${healTarget.name} for ${healAmount}.`,
      party: state.party.map((entry) => {
        if (entry.id === memberId) {
          return { ...entry, attackTimerMs: 0, highlightMs: DAMAGE_FLASH_MS };
        }

        if (entry.id !== healTarget.id) {
          return entry;
        }

        return {
          ...entry,
          hp: Math.min(entry.maxHp, entry.hp + healAmount),
          highlightMs: DAMAGE_FLASH_MS,
        };
      }),
      effects: appendEffects(state.effects, [
        createEffect('heal', 'party', member.x, member.y, healTarget.x, healTarget.y, 18, 0x8fe4a3, 420),
        createEffect('buff', 'party', healTarget.x, healTarget.y, healTarget.x, healTarget.y, 24, 0x8fe4a3, 460),
      ]),
    };
  }

  if (healTarget && healTarget.hp / healTarget.maxHp <= 0.46) {
    const healAmount = Math.max(40, Math.round(22 + member.attackPower * 1.05));

    return {
      ...state,
      lastEvent: `${member.name} stabilized ${healTarget.name} for ${healAmount}.`,
      party: state.party.map((entry) => {
        if (entry.id === memberId) {
          return { ...entry, attackTimerMs: 0, highlightMs: DAMAGE_FLASH_MS };
        }

        if (entry.id !== healTarget.id) {
          return entry;
        }

        return {
          ...entry,
          hp: Math.min(entry.maxHp, entry.hp + healAmount),
          highlightMs: DAMAGE_FLASH_MS,
        };
      }),
      effects: appendEffects(state.effects, [
        createEffect('heal', 'party', member.x, member.y, healTarget.x, healTarget.y, 16, 0x8fe4a3, 380),
        createEffect('buff', 'party', healTarget.x, healTarget.y, healTarget.x, healTarget.y, 20, 0xb3f7c0, 420),
      ]),
    };
  }

  const buffTarget = [...state.party]
    .filter((entry) => entry.hp > 0 && entry.id !== memberId)
    .sort((left, right) => {
      const leftScore = left.attackPower + left.power * 0.04 - left.damageBoostMs * 0.01;
      const rightScore = right.attackPower + right.power * 0.04 - right.damageBoostMs * 0.01;
      return rightScore - leftScore;
    })[0];

  if (!buffTarget || buffTarget.damageBoostMs > 900) {
    return state;
  }

  return {
    ...state,
    lastEvent: `${member.name} boosted ${buffTarget.name}'s attack tempo.`,
    party: state.party.map((entry) => {
      if (entry.id === memberId) {
        return { ...entry, attackTimerMs: 0, highlightMs: DAMAGE_FLASH_MS };
      }

      if (entry.id !== buffTarget.id) {
        return entry;
      }

      return {
        ...entry,
        damageBoostMs: SUPPORT_BUFF_MS,
        damageBoostRatio: SUPPORT_BUFF_RATIO,
        shieldHp: Math.min(Math.round(entry.maxHp * SHIELD_CAP_RATIO), entry.shieldHp + 18),
        highlightMs: DAMAGE_FLASH_MS,
      };
    }),
    effects: appendEffects(state.effects, [
      createEffect('buff', 'party', member.x, member.y, buffTarget.x, buffTarget.y, 18, 0x8fe4a3, 420),
      createEffect('buff', 'party', buffTarget.x, buffTarget.y, buffTarget.x, buffTarget.y, 24, 0xffdf8f, 520),
    ]),
  };
}

function tryGuardianActionV2(state: BattleSimulationState, memberId: string): BattleSimulationState {
  const memberIndex = state.party.findIndex((member) => member.id === memberId);
  const member = state.party[memberIndex];

  if (member.hp <= 0 || member.role !== 'guardian' || member.attackTimerMs < member.attackIntervalMs) {
    return state;
  }

  const protectTarget = [...state.party]
    .filter((entry) => entry.hp > 0)
    .sort((left, right) => {
      const leftScore = left.hp / left.maxHp + left.shieldHp / Math.max(1, left.maxHp);
      const rightScore = right.hp / right.maxHp + right.shieldHp / Math.max(1, right.maxHp);
      return leftScore - rightScore;
    })[0];
  const rangedThreat = state.enemies.some(
    (enemy) => enemy.active && enemy.hp > 0 && (enemy.pattern === 'ranged' || enemy.pattern === 'caster' || enemy.pattern === 'boss'),
  );

  if (!protectTarget || (protectTarget.hp / protectTarget.maxHp > 0.74 && protectTarget.shieldHp >= 20 && !rangedThreat)) {
    return state;
  }

  return {
    ...state,
    lastEvent: `${member.name} raised a guard line for ${protectTarget.name}.`,
    party: state.party.map((entry) => {
      if (entry.id === memberId) {
        return {
          ...entry,
          attackTimerMs: 0,
          highlightMs: DAMAGE_FLASH_MS,
          guardTauntMs: GUARDIAN_TAUNT_MS,
          shieldHp: Math.min(Math.round(entry.maxHp * SHIELD_CAP_RATIO), entry.shieldHp + 24),
        };
      }

      if (entry.id !== protectTarget.id) {
        return entry;
      }

      return {
        ...entry,
        shieldHp: Math.min(Math.round(entry.maxHp * SHIELD_CAP_RATIO), entry.shieldHp + GUARDIAN_SHIELD_AMOUNT),
        highlightMs: DAMAGE_FLASH_MS,
      };
    }),
    effects: appendEffects(state.effects, [
      createEffect('buff', 'party', member.x, member.y, member.x, member.y, 24, 0x8ec7ff, 460),
      createEffect('buff', 'party', member.x, member.y, protectTarget.x, protectTarget.y, 18, 0x8ec7ff, 420),
      createEffect('telegraph', 'party', protectTarget.x, protectTarget.y, protectTarget.x, protectTarget.y, 24, 0x8ec7ff, 460),
    ]),
  };
}

function stepPartyMemberV2(
  state: BattleSimulationState,
  memberId: string,
  deltaMs: number,
  allowMovement = true,
): BattleSimulationState {
  const memberIndex = state.party.findIndex((entry) => entry.id === memberId);
  const member = state.party[memberIndex];
  const target = findEnemyTarget(state, member);

  if (!target) {
    return allowMovement ? movePartyMemberTowardHome(state, memberIndex, deltaMs) : state;
  }

  const distance = target.x - member.x;
  const verticalGap = target.y - member.y;
  const verticalTolerance = getPartyAttackVerticalTolerance(member);
  const withinAttackWindow = distance <= member.range && Math.abs(verticalGap) <= verticalTolerance;

  if (!withinAttackWindow) {
    if (!allowMovement) {
      return state;
    }

    const desiredX = distance <= member.range ? member.x : Math.min(target.x - member.range, PARTY_CONTROL_RIGHT_X);
    const desiredY = Math.abs(verticalGap) <= verticalTolerance * 0.55 ? member.y : target.y;
    const nextPosition = moveTowardPoint(member.x, member.y, desiredX, desiredY, member.moveSpeed, deltaMs);
    return updatePartyMember(state, memberIndex, nextPosition);
  }

  if (member.attackTimerMs < member.attackIntervalMs) {
    return state;
  }

  const primaryMultiplier = getRoleDamageMultiplier(member.role) * getRoleBuffMultiplier(member);
  const primaryDamage = Math.round(
    member.attackPower *
      primaryMultiplier *
      getAssassinExecuteMultiplier(member, target) *
      getGuardianCounterMultiplier(member),
  );
  const hits = buildPartyAttackHits(state, member, target, primaryDamage);
  const attacked = dealEnemyHits(state, member.id, hits, describePartyHitEvent(member, target, hits));
  return {
    ...attacked,
    effects: appendEffects(attacked.effects, createPartyAttackEffects(member, target)),
  };
}

function stepEnemyUnitV2(
  state: BattleSimulationState,
  enemyId: string,
  deltaMs: number,
): BattleSimulationState {
  const enemyIndex = state.enemies.findIndex((entry) => entry.id === enemyId);
  const enemy = state.enemies[enemyIndex];
  const target = findPartyTargetV2(state, enemy);

  if (!target) {
    return moveEnemyTowardHome(state, enemyIndex, deltaMs);
  }

  const distance = enemy.x - target.x;
  const verticalGap = target.y - enemy.y;
  const verticalTolerance = getEnemyAttackVerticalTolerance(enemy);
  const withinAttackWindow = distance <= enemy.range && Math.abs(verticalGap) <= verticalTolerance;

  if (!withinAttackWindow) {
    const desiredX = distance <= enemy.range ? enemy.x : Math.max(target.x + enemy.range, FIELD_LEFT_X + 18);
    const desiredY = Math.abs(verticalGap) <= verticalTolerance * 0.55 ? enemy.y : target.y;
    const nextPosition = moveTowardPoint(enemy.x, enemy.y, desiredX, desiredY, enemy.moveSpeed, deltaMs);
    return updateEnemy(state, enemyIndex, nextPosition);
  }

  if (enemy.attackTimerMs >= enemy.attackIntervalMs - enemy.castLeadMs && enemy.castingMs <= 0) {
    return {
      ...updateEnemy(state, enemyIndex, { castingMs: enemy.castLeadMs, highlightMs: DAMAGE_FLASH_MS }),
      lastEvent: `${enemy.name} is preparing ${enemy.pattern}.`,
      effects: appendEffects(state.effects, createEnemyTelegraphEffects(enemy, target)),
    };
  }

  if (enemy.attackTimerMs < enemy.attackIntervalMs) {
    return state;
  }

  switch (enemy.pattern) {
    case 'melee': {
      const attacked = dealPartyDamage(
        state,
        target.id,
        enemy.attackPower,
        `${enemy.name} struck ${target.name} for ${enemy.attackPower}.`,
        enemyIndex,
        0,
        0,
      );
      return {
        ...attacked,
        effects: appendEffects(attacked.effects, createEnemyAttackEffects(enemy, target)),
      };
    }
    case 'charger': {
      const chargeDamage = Math.round(enemy.attackPower * 1.18);
      const attacked = dealPartyDamage(
        state,
        target.id,
        chargeDamage,
        `${enemy.name} charged into ${target.name} for ${chargeDamage}.`,
        enemyIndex,
        0,
        0,
      );
      const lunged = updateEnemy(attacked, enemyIndex, {
        x: Math.max(enemy.homeX - 24, target.x + Math.max(18, enemy.range - 18)),
        y: clamp(target.y, FIELD_TOP_Y, FIELD_BOTTOM_Y),
        highlightMs: DAMAGE_FLASH_MS,
      });
      return {
        ...lunged,
        effects: appendEffects(lunged.effects, createEnemyAttackEffects(enemy, target)),
      };
    }
    case 'ranged': {
      const attacked = dealPartyDamage(
        state,
        target.id,
        enemy.attackPower,
        `${enemy.name} shot ${target.name} for ${enemy.attackPower}.`,
        enemyIndex,
        0,
        0,
      );
      return {
        ...attacked,
        effects: appendEffects(attacked.effects, createEnemyAttackEffects(enemy, target)),
      };
    }
    case 'caster': {
      const splashDamage = Math.max(8, Math.round(enemy.attackPower * 0.48));
      const attacked = dealPartyDamage(
        state,
        target.id,
        enemy.attackPower,
        `${enemy.name} burst lane ${target.lane + 1} for ${enemy.attackPower}.`,
        enemyIndex,
        splashDamage,
        1,
      );
      return {
        ...attacked,
        effects: appendEffects(attacked.effects, createEnemyAttackEffects(enemy, target)),
      };
    }
    case 'boss': {
      const mainDamage = Math.round(enemy.attackPower * 1.08);
      const splashDamage = Math.max(10, Math.round(mainDamage * 0.42));
      const attacked = dealPartyDamage(
        state,
        target.id,
        mainDamage,
        `${enemy.name} unleashed a boss burst for ${mainDamage}.`,
        enemyIndex,
        splashDamage,
        3,
      );
      return {
        ...attacked,
        effects: appendEffects(attacked.effects, createEnemyAttackEffects(enemy, target)),
      };
    }
  }
}

function findPartyTargetV2(
  state: BattleSimulationState,
  enemy: EnemyUnitBattleState,
): PartyMemberBattleState | null {
  const living = state.party.filter((member) => member.hp > 0);
  if (living.length === 0) {
    return null;
  }

  const tauntingGuardian = living.find((member) => member.role === 'guardian' && member.guardTauntMs > 0);
  if (tauntingGuardian) {
    return tauntingGuardian;
  }

  if (enemy.pattern === 'melee' || enemy.pattern === 'charger') {
    const guardian = living.find((member) => member.role === 'guardian');
    if (guardian) {
      return guardian;
    }
  }

  if (enemy.pattern === 'ranged' || enemy.pattern === 'caster' || enemy.pattern === 'boss') {
    const backline = [...living]
      .filter((member) => member.role !== 'guardian' && member.role !== 'warrior')
      .sort(
        (left, right) =>
          left.hp / left.maxHp - right.hp / right.maxHp ||
          Math.abs(left.y - enemy.y) - Math.abs(right.y - enemy.y) ||
          right.x - left.x,
      );

    if (backline.length > 0) {
      return backline[0];
    }
  }

  return [...living].sort((left, right) => {
    const leftScore = Math.abs(left.y - enemy.y) * 1.5 - left.x * 0.18;
    const rightScore = Math.abs(right.y - enemy.y) * 1.5 - right.x * 0.18;
    return leftScore - rightScore;
  })[0];
}

function buildPartyAttackHits(
  state: BattleSimulationState,
  member: PartyMemberBattleState,
  target: EnemyUnitBattleState,
  primaryDamage: number,
): Array<{ enemyId: string; damage: number }> {
  const hits: Array<{ enemyId: string; damage: number }> = [{ enemyId: target.id, damage: primaryDamage }];
  const living = getLivingEnemies(state).filter((enemy) => enemy.id !== target.id);

  switch (member.role) {
    case 'leader': {
      const cleaveTarget = living
        .filter((enemy) => Math.abs(enemy.lane - target.lane) <= 1)
        .sort((left, right) => left.x - right.x)[0];
      if (cleaveTarget) {
        hits.push({ enemyId: cleaveTarget.id, damage: Math.max(10, Math.round(primaryDamage * 0.24)) });
      }
      break;
    }
    case 'mage': {
      const splashTargets = living
        .filter((enemy) => Math.abs(enemy.lane - target.lane) <= 1)
        .sort((left, right) => left.x - right.x)
        .slice(0, 2);
      for (const splashTarget of splashTargets) {
        hits.push({ enemyId: splashTarget.id, damage: Math.max(12, Math.round(primaryDamage * 0.44)) });
      }
      break;
    }
    case 'ranger': {
      const pierceTarget = living
        .filter((enemy) => enemy.lane === target.lane || enemy.x >= target.x - 12)
        .sort((left, right) => left.x - right.x)[0];
      if (pierceTarget) {
        hits.push({ enemyId: pierceTarget.id, damage: Math.max(10, Math.round(primaryDamage * 0.58)) });
      }
      break;
    }
    case 'warrior': {
      const sweepTarget = living
        .filter((enemy) => Math.abs(enemy.lane - target.lane) <= 1)
        .sort((left, right) => left.x - right.x)[0];
      if (sweepTarget) {
        hits.push({ enemyId: sweepTarget.id, damage: Math.max(10, Math.round(primaryDamage * 0.3)) });
      }
      break;
    }
    case 'assassin': {
      const chainTarget = living
        .filter((enemy) => enemy.pattern === 'ranged' || enemy.pattern === 'caster' || enemy.hp / enemy.maxHp <= 0.45)
        .sort((left, right) => left.hp / left.maxHp - right.hp / right.maxHp)[0];
      if (chainTarget) {
        hits.push({ enemyId: chainTarget.id, damage: Math.max(12, Math.round(primaryDamage * 0.35)) });
      }
      break;
    }
  }

  return hits;
}

function describePartyHitEvent(
  member: PartyMemberBattleState,
  target: EnemyUnitBattleState,
  hits: Array<{ enemyId: string; damage: number }>,
): string {
  const totalDamage = hits.reduce((sum, hit) => sum + hit.damage, 0);

  switch (member.role) {
    case 'mage':
      return `${member.name} detonated ${target.name} for ${totalDamage}.`;
    case 'ranger':
      return `${member.name} pierced the line for ${totalDamage}.`;
    case 'guardian':
      return `${member.name} countered ${target.name} for ${totalDamage}.`;
    case 'assassin':
      return `${member.name} executed a rush combo for ${totalDamage}.`;
    case 'warrior':
      return `${member.name} swept through the front for ${totalDamage}.`;
    default:
      return `${member.name} hit ${target.name} for ${totalDamage}.`;
  }
}

function getRoleBuffMultiplier(member: PartyMemberBattleState): number {
  return member.damageBoostMs > 0 ? 1 + member.damageBoostRatio : 1;
}

function getAssassinTargetPriority(enemy: EnemyUnitBattleState): number {
  switch (enemy.pattern) {
    case 'boss':
      return 5;
    case 'caster':
      return 4;
    case 'ranged':
      return 3;
    case 'charger':
      return 2;
    case 'melee':
      return 1;
  }
}

function getMageClusterScore(
  living: EnemyUnitBattleState[],
  candidate: EnemyUnitBattleState,
): number {
  return living.filter((enemy) => Math.abs(enemy.lane - candidate.lane) <= 1).length;
}

function getAssassinExecuteMultiplier(
  member: PartyMemberBattleState,
  target: EnemyUnitBattleState,
): number {
  if (member.role !== 'assassin') {
    return 1;
  }

  return target.hp / target.maxHp <= 0.4 || target.pattern === 'ranged' || target.pattern === 'caster' ? 1.48 : 1.12;
}

function getGuardianCounterMultiplier(member: PartyMemberBattleState): number {
  return member.role === 'guardian' && member.guardTauntMs > 0 ? 1.18 : 1;
}

function createPartyAttackEffects(
  member: PartyMemberBattleState,
  target: EnemyUnitBattleState,
): BattleEffectState[] {
  switch (member.role) {
    case 'leader':
      return [
        createEffect('charge', 'party', member.x, member.y, target.x, target.y, 14, 0xffd27d, 220),
        createEffect('slash', 'party', member.x, member.y, target.x, target.y, 20, 0xffedaa, 220),
        createEffect('impact', 'party', target.x, target.y, target.x, target.y, 14, 0xf6c46d, 280),
      ];
    case 'guardian':
      return [
        createEffect('slash', 'party', member.x, member.y, target.x, target.y, 16, 0x8ec7ff, 220),
        createEffect('impact', 'party', target.x, target.y, target.x, target.y, 16, 0xb8dcff, 300),
      ];
    case 'mage':
      return [
        createEffect('projectile', 'party', member.x, member.y, target.x, target.y, 7, 0xaedbff, 240),
        createEffect('burst', 'party', target.x, target.y, target.x, target.y, 18, 0xc6b5ff, 320),
      ];
    case 'ranger':
      return [
        createEffect('projectile', 'party', member.x, member.y, target.x, target.y, 6, 0xffd27d, 220),
        createEffect('impact', 'party', target.x, target.y, target.x, target.y, 10, 0xffd27d, 260),
      ];
    case 'healer':
    case 'support':
      return [
        createEffect('projectile', 'party', member.x, member.y, target.x, target.y, 6, 0x8fe4a3, 240),
        createEffect('impact', 'party', target.x, target.y, target.x, target.y, 10, 0xb7ffd0, 260),
      ];
    case 'assassin':
      return [
        createEffect('charge', 'party', member.x, member.y, target.x, target.y, 14, 0xf8df8e, 180),
        createEffect('slash', 'party', member.x, member.y, target.x, target.y, 18, 0xffc98a, 200),
        createEffect('impact', 'party', target.x, target.y, target.x, target.y, 12, 0xf6c46d, 240),
      ];
    default:
      return [
        createEffect('slash', 'party', member.x, member.y, target.x, target.y, 18, 0xf8df8e, 200),
        createEffect('impact', 'party', target.x, target.y, target.x, target.y, 12, 0xf6c46d, 260),
      ];
  }
}

function createEnemyTelegraphEffects(
  enemy: EnemyUnitBattleState,
  target: PartyMemberBattleState,
): BattleEffectState[] {
  const telegraphSize =
    enemy.pattern === 'boss' ? 58 : enemy.pattern === 'caster' ? 46 : enemy.pattern === 'charger' ? 36 : 28;

  return [
    createEffect('telegraph', 'enemy', enemy.x, enemy.y, target.x, target.y, telegraphSize, enemy.attackFxColor, enemy.castLeadMs),
  ];
}

function createEnemyAttackEffects(
  enemy: EnemyUnitBattleState,
  target: PartyMemberBattleState,
): BattleEffectState[] {
  switch (enemy.pattern) {
    case 'ranged':
      return [
        createEffect('projectile', 'enemy', enemy.x, enemy.y, target.x, target.y, 7, enemy.projectileColor, 260),
        createEffect('impact', 'enemy', target.x, target.y, target.x, target.y, 12, enemy.attackFxColor, 280),
      ];
    case 'caster':
      return [
        createEffect('projectile', 'enemy', enemy.x, enemy.y, target.x, target.y, 8, enemy.projectileColor, 320),
        createEffect('burst', 'enemy', target.x, target.y, target.x, target.y, 28, enemy.attackFxColor, 360),
      ];
    case 'charger':
      return [
        createEffect('charge', 'enemy', enemy.x, enemy.y, target.x, target.y, 16, enemy.attackFxColor, 220),
        createEffect('impact', 'enemy', target.x, target.y, target.x, target.y, 16, enemy.attackFxColor, 280),
      ];
    case 'boss':
      return [
        createEffect('projectile', 'enemy', enemy.x, enemy.y, target.x, target.y, 10, enemy.projectileColor, 340),
        createEffect('burst', 'enemy', target.x, target.y, target.x, target.y, 38, enemy.attackFxColor, 420),
      ];
    case 'melee':
      return [
        createEffect('slash', 'enemy', enemy.x, enemy.y, target.x, target.y, 18, enemy.attackFxColor, 220),
        createEffect('impact', 'enemy', target.x, target.y, target.x, target.y, 12, enemy.attackFxColor, 260),
      ];
  }
}

function advanceEffects(effects: BattleEffectState[], deltaMs: number): BattleEffectState[] {
  return effects
    .map((effect) => {
      const ttlMs = effect.ttlMs - deltaMs;
      const progress = 1 - Math.max(0, ttlMs) / effect.maxTtlMs;

      return {
        ...effect,
        ttlMs,
        x: effect.kind === 'projectile' || effect.kind === 'charge' ? lerp(effect.fromX, effect.toX, progress) : effect.toX,
        y: effect.kind === 'projectile' || effect.kind === 'charge' ? lerp(effect.fromY, effect.toY, progress) : effect.toY,
      };
    })
    .filter((effect) => effect.ttlMs > 0);
}

function appendEffects(
  current: BattleEffectState[],
  next: BattleEffectState[],
): BattleEffectState[] {
  return [...current, ...next].slice(-MAX_EFFECTS);
}

function createEffect(
  kind: BattleEffectKind,
  source: 'party' | 'enemy',
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  size: number,
  color: number,
  maxTtlMs: number,
): BattleEffectState {
  effectSerial += 1;

  return {
    id: `fx_${effectSerial}`,
    kind,
    source,
    x: fromX,
    y: fromY,
    fromX,
    fromY,
    toX,
    toY,
    size,
    color,
    ttlMs: maxTtlMs,
    maxTtlMs,
  };
}

function lerp(start: number, end: number, progress: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, progress));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getRoleDamageMultiplier(role: BattleRole): number {
  switch (role) {
    case 'guardian':
      return 0.9;
    case 'healer':
      return 0.82;
    case 'support':
      return 0.88;
    case 'mage':
      return 1.08;
    case 'assassin':
      return 1.16;
    default:
      return 1;
  }
}

function getStageBonusHp(stageType: StageDefinition['stageType']): number {
  switch (stageType) {
    case 'intro':
      return 0;
    case 'field':
      return 20;
    case 'dungeon':
      return 48;
    case 'defense':
      return 60;
    case 'mid_boss':
      return 86;
    case 'pursuit':
      return 54;
    case 'stronghold':
      return 78;
    case 'crisis':
      return 92;
    case 'pre_boss':
      return 118;
    case 'final_boss':
      return 156;
  }
}

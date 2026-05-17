import { AtlasFrame } from './atlas';
import { getAllCharacters } from './characters';
import type { BattleRole } from '../types';

export type AnimationViewerCategory = 'character' | 'enemy' | 'npc' | 'effect';
export type AnimationLoopMode = 'loop' | 'once' | 'hold';
export type AnimationPreviewKind =
  | 'idle'
  | 'walk'
  | 'run'
  | 'attack'
  | 'heavy'
  | 'cast'
  | 'cast_loop'
  | 'cast_release'
  | 'heal'
  | 'buff'
  | 'hit'
  | 'dash'
  | 'victory'
  | 'down'
  | 'guard'
  | 'charge'
  | 'aim'
  | 'shoot'
  | 'reload'
  | 'taunt'
  | 'talk'
  | 'interact'
  | 'pray'
  | 'stealth'
  | 'fx_slash'
  | 'fx_impact'
  | 'fx_projectile'
  | 'fx_burst'
  | 'fx_telegraph'
  | 'fx_charge'
  | 'fx_heal'
  | 'fx_buff'
  | 'fx_shield';

export interface AnimationClipDefinition {
  id: string;
  name: string;
  frameCount: number;
  fps: number;
  loopMode: AnimationLoopMode;
  previewKind: AnimationPreviewKind;
  note?: string;
}

export interface AnimationSubjectDefinition {
  id: string;
  name: string;
  category: AnimationViewerCategory;
  tint: number;
  atlasFrame: number;
  role?: BattleRole;
  actions: AnimationClipDefinition[];
}

export interface AnimationViewerSelection {
  category: AnimationViewerCategory;
  subjectId: string;
  actionId: string;
}

const CHARACTER_BASE_ACTION_IDS = [
  'idle',
  'walk',
  'run',
  'attack_basic_01',
  'attack_basic_02',
  'skill_cast',
  'hit_react',
  'dash_or_dodge',
  'victory',
  'down_or_death',
] as const;

const ROLE_EXTRA_ACTION_IDS: Record<BattleRole, string[]> = {
  leader: ['attack_basic_03', 'guard_or_block', 'charge', 'town_idle', 'talk', 'interact'],
  guardian: ['heavy_attack', 'guard_or_block', 'taunt_or_command', 'town_idle', 'talk', 'interact'],
  mage: ['cast_start', 'cast_loop', 'cast_release', 'town_idle', 'talk'],
  healer: ['heal_cast', 'buff_cast', 'pray_idle', 'town_idle', 'talk'],
  ranger: ['aim', 'shoot_loop', 'reload_or_reset', 'town_idle', 'talk'],
  support: ['buff_cast', 'summon_or_rune', 'town_idle', 'talk', 'interact'],
  warrior: ['attack_basic_03', 'heavy_attack', 'charge', 'town_idle', 'talk', 'interact'],
  assassin: ['attack_basic_03', 'stealth_entry', 'charge', 'town_idle', 'talk', 'interact'],
};

const ACTION_LIBRARY: Record<string, AnimationClipDefinition> = {
  idle: { id: 'idle', name: 'idle', frameCount: 6, fps: 8, loopMode: 'loop', previewKind: 'idle' },
  walk: { id: 'walk', name: 'walk', frameCount: 8, fps: 10, loopMode: 'loop', previewKind: 'walk' },
  run: { id: 'run', name: 'run', frameCount: 8, fps: 12, loopMode: 'loop', previewKind: 'run' },
  attack_basic_01: {
    id: 'attack_basic_01',
    name: 'attack_basic_01',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'attack',
  },
  attack_basic_02: {
    id: 'attack_basic_02',
    name: 'attack_basic_02',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'attack',
  },
  attack_basic_03: {
    id: 'attack_basic_03',
    name: 'attack_basic_03',
    frameCount: 7,
    fps: 13,
    loopMode: 'once',
    previewKind: 'attack',
  },
  heavy_attack: {
    id: 'heavy_attack',
    name: 'heavy_attack',
    frameCount: 8,
    fps: 10,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  skill_cast: {
    id: 'skill_cast',
    name: 'skill_cast',
    frameCount: 7,
    fps: 10,
    loopMode: 'once',
    previewKind: 'cast',
  },
  cast_start: {
    id: 'cast_start',
    name: 'cast_start',
    frameCount: 4,
    fps: 10,
    loopMode: 'once',
    previewKind: 'cast',
  },
  cast_loop: {
    id: 'cast_loop',
    name: 'cast_loop',
    frameCount: 4,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'cast_loop',
  },
  cast_release: {
    id: 'cast_release',
    name: 'cast_release',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'cast_release',
  },
  heal_cast: {
    id: 'heal_cast',
    name: 'heal_cast',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'heal',
  },
  buff_cast: {
    id: 'buff_cast',
    name: 'buff_cast',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'buff',
  },
  summon_or_rune: {
    id: 'summon_or_rune',
    name: 'summon_or_rune',
    frameCount: 7,
    fps: 9,
    loopMode: 'once',
    previewKind: 'cast_release',
  },
  hit_react: {
    id: 'hit_react',
    name: 'hit_react',
    frameCount: 4,
    fps: 10,
    loopMode: 'once',
    previewKind: 'hit',
  },
  dash_or_dodge: {
    id: 'dash_or_dodge',
    name: 'dash_or_dodge',
    frameCount: 6,
    fps: 15,
    loopMode: 'once',
    previewKind: 'dash',
  },
  victory: {
    id: 'victory',
    name: 'victory',
    frameCount: 8,
    fps: 10,
    loopMode: 'loop',
    previewKind: 'victory',
  },
  down_or_death: {
    id: 'down_or_death',
    name: 'down_or_death',
    frameCount: 6,
    fps: 8,
    loopMode: 'hold',
    previewKind: 'down',
  },
  guard_or_block: {
    id: 'guard_or_block',
    name: 'guard_or_block',
    frameCount: 4,
    fps: 8,
    loopMode: 'hold',
    previewKind: 'guard',
  },
  charge: { id: 'charge', name: 'charge', frameCount: 6, fps: 14, loopMode: 'once', previewKind: 'charge' },
  aim: { id: 'aim', name: 'aim', frameCount: 4, fps: 8, loopMode: 'hold', previewKind: 'aim' },
  shoot_loop: {
    id: 'shoot_loop',
    name: 'shoot_loop',
    frameCount: 5,
    fps: 12,
    loopMode: 'loop',
    previewKind: 'shoot',
  },
  reload_or_reset: {
    id: 'reload_or_reset',
    name: 'reload_or_reset',
    frameCount: 5,
    fps: 9,
    loopMode: 'once',
    previewKind: 'reload',
  },
  taunt_or_command: {
    id: 'taunt_or_command',
    name: 'taunt_or_command',
    frameCount: 6,
    fps: 9,
    loopMode: 'once',
    previewKind: 'taunt',
  },
  charge_start: {
    id: 'charge_start',
    name: 'charge_start',
    frameCount: 5,
    fps: 10,
    loopMode: 'once',
    previewKind: 'charge',
  },
  charge_impact: {
    id: 'charge_impact',
    name: 'charge_impact',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  horn_sweep: {
    id: 'horn_sweep',
    name: 'horn_sweep',
    frameCount: 8,
    fps: 9,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  slam_burst: {
    id: 'slam_burst',
    name: 'slam_burst',
    frameCount: 8,
    fps: 10,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  roar_or_enrage: {
    id: 'roar_or_enrage',
    name: 'roar_or_enrage',
    frameCount: 6,
    fps: 8,
    loopMode: 'once',
    previewKind: 'taunt',
  },
  burst_release: {
    id: 'burst_release',
    name: 'burst_release',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'cast_release',
  },
  float: { id: 'float', name: 'float', frameCount: 8, fps: 8, loopMode: 'loop', previewKind: 'walk' },
  crusher_slam: {
    id: 'crusher_slam',
    name: 'crusher_slam',
    frameCount: 8,
    fps: 10,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  charge_burst: {
    id: 'charge_burst',
    name: 'charge_burst',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'charge',
  },
  evade_step: {
    id: 'evade_step',
    name: 'evade_step',
    frameCount: 5,
    fps: 13,
    loopMode: 'once',
    previewKind: 'dash',
  },
  tidal_burst: {
    id: 'tidal_burst',
    name: 'tidal_burst',
    frameCount: 8,
    fps: 10,
    loopMode: 'once',
    previewKind: 'cast_release',
  },
  tidal_sweep: {
    id: 'tidal_sweep',
    name: 'tidal_sweep',
    frameCount: 8,
    fps: 10,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  stomp_burst: {
    id: 'stomp_burst',
    name: 'stomp_burst',
    frameCount: 8,
    fps: 9,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  charge_step: {
    id: 'charge_step',
    name: 'charge_step',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'charge',
  },
  stealth_step: {
    id: 'stealth_step',
    name: 'stealth_step',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'dash',
  },
  leap_strike: {
    id: 'leap_strike',
    name: 'leap_strike',
    frameCount: 8,
    fps: 10,
    loopMode: 'once',
    previewKind: 'heavy',
  },
  judgment_burst: {
    id: 'judgment_burst',
    name: 'judgment_burst',
    frameCount: 7,
    fps: 10,
    loopMode: 'once',
    previewKind: 'cast_release',
  },
  judgment_wave: {
    id: 'judgment_wave',
    name: 'judgment_wave',
    frameCount: 7,
    fps: 10,
    loopMode: 'once',
    previewKind: 'cast_release',
  },
  roar_or_command: {
    id: 'roar_or_command',
    name: 'roar_or_command',
    frameCount: 6,
    fps: 8,
    loopMode: 'once',
    previewKind: 'taunt',
  },
  town_idle: {
    id: 'town_idle',
    name: 'town_idle',
    frameCount: 6,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'idle',
  },
  talk: { id: 'talk', name: 'talk', frameCount: 5, fps: 8, loopMode: 'loop', previewKind: 'talk' },
  interact: {
    id: 'interact',
    name: 'interact',
    frameCount: 5,
    fps: 8,
    loopMode: 'once',
    previewKind: 'interact',
  },
  pray_idle: {
    id: 'pray_idle',
    name: 'pray_idle',
    frameCount: 6,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'pray',
  },
  stealth_entry: {
    id: 'stealth_entry',
    name: 'stealth_entry',
    frameCount: 6,
    fps: 11,
    loopMode: 'once',
    previewKind: 'stealth',
  },
  greet: {
    id: 'greet',
    name: 'greet',
    frameCount: 4,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'interact',
  },
  counter_stand: {
    id: 'counter_stand',
    name: 'counter_stand',
    frameCount: 4,
    fps: 6,
    loopMode: 'loop',
    previewKind: 'idle',
  },
  turn_short_rotation: {
    id: 'turn_short_rotation',
    name: 'turn_short_rotation',
    frameCount: 8,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'walk',
  },
  patrol_walk: {
    id: 'patrol_walk',
    name: 'patrol_walk',
    frameCount: 4,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'walk',
  },
  halt: {
    id: 'halt',
    name: 'halt',
    frameCount: 1,
    fps: 6,
    loopMode: 'hold',
    previewKind: 'guard',
  },
  fx_slash_arc: {
    id: 'fx_slash_arc',
    name: 'slash_arc',
    frameCount: 5,
    fps: 14,
    loopMode: 'once',
    previewKind: 'fx_slash',
  },
  fx_impact_burst: {
    id: 'fx_impact_burst',
    name: 'impact_burst',
    frameCount: 5,
    fps: 12,
    loopMode: 'once',
    previewKind: 'fx_impact',
  },
  fx_projectile_arcane: {
    id: 'fx_projectile_arcane',
    name: 'projectile_arcane',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'fx_projectile',
  },
  fx_projectile_enemy: {
    id: 'fx_projectile_enemy',
    name: 'projectile_enemy',
    frameCount: 6,
    fps: 11,
    loopMode: 'once',
    previewKind: 'fx_projectile',
  },
  fx_burst_arcane: {
    id: 'fx_burst_arcane',
    name: 'burst_arcane',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'fx_burst',
  },
  fx_burst_boss: {
    id: 'fx_burst_boss',
    name: 'burst_boss',
    frameCount: 7,
    fps: 10,
    loopMode: 'once',
    previewKind: 'fx_burst',
  },
  fx_telegraph_ring: {
    id: 'fx_telegraph_ring',
    name: 'telegraph_ring',
    frameCount: 6,
    fps: 8,
    loopMode: 'loop',
    previewKind: 'fx_telegraph',
  },
  fx_charge_trail: {
    id: 'fx_charge_trail',
    name: 'charge_trail',
    frameCount: 6,
    fps: 12,
    loopMode: 'once',
    previewKind: 'fx_charge',
  },
  fx_heal_wave: {
    id: 'fx_heal_wave',
    name: 'heal_wave',
    frameCount: 6,
    fps: 10,
    loopMode: 'once',
    previewKind: 'fx_heal',
  },
  fx_buff_halo: {
    id: 'fx_buff_halo',
    name: 'buff_halo',
    frameCount: 6,
    fps: 9,
    loopMode: 'once',
    previewKind: 'fx_buff',
  },
  fx_guardian_shield: {
    id: 'fx_guardian_shield',
    name: 'guardian_shield',
    frameCount: 6,
    fps: 9,
    loopMode: 'loop',
    previewKind: 'fx_shield',
  },
} as const;

const EFFECT_SUBJECTS: AnimationSubjectDefinition[] = [
  {
    id: 'party_melee',
    name: 'Party Melee',
    category: 'effect',
    tint: 0xf6c46d,
    atlasFrame: AtlasFrame.SwordIcon,
    actions: resolveActionIds(['fx_slash_arc', 'fx_impact_burst', 'fx_charge_trail']),
  },
  {
    id: 'party_magic',
    name: 'Party Magic',
    category: 'effect',
    tint: 0xc6b5ff,
    atlasFrame: AtlasFrame.Star,
    actions: resolveActionIds(['fx_projectile_arcane', 'fx_burst_arcane', 'fx_buff_halo']),
  },
  {
    id: 'support_magic',
    name: 'Support Magic',
    category: 'effect',
    tint: 0x8fe4a3,
    atlasFrame: AtlasFrame.BagIcon,
    actions: resolveActionIds(['fx_heal_wave', 'fx_buff_halo', 'fx_guardian_shield']),
  },
  {
    id: 'enemy_ranged',
    name: 'Enemy Ranged',
    category: 'effect',
    tint: 0xff9c73,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds(['fx_telegraph_ring', 'fx_projectile_enemy', 'fx_impact_burst']),
  },
  {
    id: 'boss_battle',
    name: 'Boss Battle',
    category: 'effect',
    tint: 0xffb27d,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds(['fx_telegraph_ring', 'fx_burst_boss', 'fx_charge_trail']),
  },
];

const ENEMY_SUBJECTS: AnimationSubjectDefinition[] = [
  {
    id: 'thorn_wolf',
    name: 'Thorn Wolf',
    category: 'enemy',
    tint: 0xb1d57b,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'corrupted_wild_boar',
    name: 'Corrupted Wild Boar',
    category: 'enemy',
    tint: 0xd99e73,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'charge_start',
      'charge_impact',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'grassland_raider_vanguard',
    name: 'Grassland Raider Vanguard',
    category: 'enemy',
    tint: 0xf0c57b,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'blackhorn_chieftain',
    name: 'Blackhorn Chieftain',
    category: 'enemy',
    tint: 0xffb37f,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'heavy_attack',
      'horn_sweep',
      'charge_start',
      'charge_impact',
      'taunt_or_command',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'morgan',
    name: 'Morgan',
    category: 'enemy',
    tint: 0xff996d,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'slam_burst',
      'charge_start',
      'charge_impact',
      'roar_or_enrage',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'ash_mine_worker',
    name: 'Ash-Mine Worker',
    category: 'enemy',
    tint: 0xd1b497,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'slag_automaton',
    name: 'Slag Automaton',
    category: 'enemy',
    tint: 0xc4b6a4,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'attack_basic_01',
      'heavy_attack',
      'burst_release',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'ember_heavy_trooper',
    name: 'Ember Heavy Trooper',
    category: 'enemy',
    tint: 0xe0a17a,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'heavy_attack',
      'guard_or_block',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'bares',
    name: 'Bares',
    category: 'enemy',
    tint: 0xffa66d,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'crusher_slam',
      'burst_release',
      'taunt_or_command',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'dravorn',
    name: 'Dravorn',
    category: 'enemy',
    tint: 0xff8f5a,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'cast_start',
      'cast_release',
      'charge_burst',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'mist_raider',
    name: 'Mist Raider',
    category: 'enemy',
    tint: 0x8fd2c7,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'evade_step',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'coastal_horror',
    name: 'Coastal Horror',
    category: 'enemy',
    tint: 0x79c2b1,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'corrupted_sanctuary_guardian',
    name: 'Corrupted Sanctuary Guardian',
    category: 'enemy',
    tint: 0xa6c5d9,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'attack_basic_01',
      'cast_start',
      'cast_release',
      'guard_or_block',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'elrent',
    name: 'Elrent',
    category: 'enemy',
    tint: 0x7bc6de,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'cast_start',
      'cast_loop',
      'cast_release',
      'tidal_burst',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'nereph',
    name: 'Nereph',
    category: 'enemy',
    tint: 0x6faee0,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'heavy_attack',
      'tidal_sweep',
      'cast_start',
      'cast_release',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'frost_hound',
    name: 'Frost Hound',
    category: 'enemy',
    tint: 0xd9ecff,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'frozen_legion_trooper',
    name: 'Frozen Legion Trooper',
    category: 'enemy',
    tint: 0xc9def6,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'guard_or_block',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'barrow_wraith',
    name: 'Barrow Wraith',
    category: 'enemy',
    tint: 0xe4d7ff,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'float',
      'attack_basic_01',
      'cast_start',
      'cast_loop',
      'cast_release',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'hrod',
    name: 'Hrod',
    category: 'enemy',
    tint: 0xd4efff,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'stomp_burst',
      'charge_step',
      'roar_or_enrage',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'valtern',
    name: 'Valtern',
    category: 'enemy',
    tint: 0xe7f4ff,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'cast_start',
      'cast_loop',
      'cast_release',
      'taunt_or_command',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'sand_tracker_beast',
    name: 'Sand Tracker Beast',
    category: 'enemy',
    tint: 0xe6c37e,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'charge_start',
      'charge_impact',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'ruin_automaton',
    name: 'Ruin Automaton',
    category: 'enemy',
    tint: 0xd2c89f,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'aim',
      'cast_start',
      'cast_release',
      'heavy_attack',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'mirage_raider',
    name: 'Mirage Raider',
    category: 'enemy',
    tint: 0xf0c98d,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'stealth_step',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'setra',
    name: 'Setra',
    category: 'enemy',
    tint: 0xf1c27b,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'heavy_attack',
      'leap_strike',
      'charge_start',
      'charge_impact',
      'roar_or_command',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'kazer',
    name: 'Kazer',
    category: 'enemy',
    tint: 0xf3d29a,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'cast_start',
      'cast_loop',
      'cast_release',
      'judgment_burst',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'fallen_holy_knight',
    name: 'Fallen Holy Knight',
    category: 'enemy',
    tint: 0xd5c6b4,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'heavy_attack',
      'guard_or_block',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'black_moon_inquisitor',
    name: 'Black Moon Inquisitor',
    category: 'enemy',
    tint: 0xcfa8ff,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'attack_basic_01',
      'cast_start',
      'cast_loop',
      'cast_release',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'black_moon_vanguard',
    name: 'Black Moon Vanguard',
    category: 'enemy',
    tint: 0xbfc5d8,
    atlasFrame: AtlasFrame.StageNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'attack_basic_01',
      'attack_basic_02',
      'guard_or_block',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'cardinal_serdin',
    name: 'Cardinal Serdin',
    category: 'enemy',
    tint: 0xf7ddb0,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'heavy_attack',
      'cast_start',
      'cast_loop',
      'cast_release',
      'judgment_wave',
      'taunt_or_command',
      'hit_react',
      'down_or_death',
    ]),
  },
  {
    id: 'varkan',
    name: 'Varkan',
    category: 'enemy',
    tint: 0xe3b8ff,
    atlasFrame: AtlasFrame.BossNode,
    actions: resolveActionIds([
      'idle',
      'walk',
      'run',
      'heavy_attack',
      'cast_start',
      'cast_loop',
      'cast_release',
      'charge_burst',
      'taunt_or_command',
      'hit_react',
      'down_or_death',
    ]),
  },
];

const NPC_SUBJECTS: AnimationSubjectDefinition[] = [
  {
    id: 'weapon_merchant',
    name: 'Weapon Merchant',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'talk', 'greet', 'counter_stand', 'turn_short_rotation']),
  },
  {
    id: 'item_merchant',
    name: 'Item Merchant',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'talk', 'greet', 'counter_stand', 'turn_short_rotation']),
  },
  {
    id: 'relic_merchant',
    name: 'Relic Merchant',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'talk', 'greet', 'counter_stand', 'turn_short_rotation']),
  },
  {
    id: 'villager',
    name: 'Civilian Villager',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'walk', 'talk', 'greet']),
  },
  {
    id: 'traveler',
    name: 'Traveler',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'walk', 'talk', 'greet']),
  },
  {
    id: 'child',
    name: 'Child',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'walk', 'talk', 'greet']),
  },
  {
    id: 'guard_spear',
    name: 'Spear Guard',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'patrol_walk', 'halt', 'talk', 'greet']),
  },
  {
    id: 'guard_sword',
    name: 'Sword Guard',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'patrol_walk', 'halt', 'talk', 'greet']),
  },
  {
    id: 'guard_crossbow',
    name: 'Crossbow Guard',
    category: 'npc',
    tint: 0xffffff,
    atlasFrame: AtlasFrame.Hero,
    actions: resolveActionIds(['idle', 'patrol_walk', 'halt', 'talk', 'greet']),
  },
];

const CHARACTER_TINTS: Record<BattleRole, number> = {
  leader: 0xffd27d,
  guardian: 0x8ec7ff,
  mage: 0xc6b5ff,
  healer: 0x8fe4a3,
  ranger: 0xffdf8f,
  support: 0xb7ffd0,
  warrior: 0xffbf8f,
  assassin: 0xf4cf9f,
};

const CHARACTER_ACTION_OVERRIDES: Partial<Record<string, string[]>> = {
  hero: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'attack_basic_03', 'skill_cast', 'hit_react', 'dash_or_dodge', 'guard_or_block', 'charge', 'town_idle', 'talk', 'victory', 'down_or_death'],
  bram: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heavy_attack', 'skill_cast', 'hit_react', 'dash_or_dodge', 'guard_or_block', 'taunt_or_command', 'town_idle', 'interact', 'victory', 'down_or_death'],
  sera: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'cast_start', 'cast_loop', 'cast_release', 'hit_react', 'dash_or_dodge', 'town_idle', 'talk', 'victory', 'down_or_death'],
  luna: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heal_cast', 'buff_cast', 'pray_idle', 'hit_react', 'dash_or_dodge', 'town_idle', 'talk', 'victory', 'down_or_death'],
  ria: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heal_cast', 'buff_cast', 'hit_react', 'dash_or_dodge', 'town_idle', 'interact', 'talk', 'victory', 'down_or_death'],
  theo: ['idle', 'walk', 'run', 'aim', 'shoot_loop', 'reload_or_reset', 'skill_cast', 'hit_react', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  dorgan: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heavy_attack', 'skill_cast', 'charge', 'hit_react', 'guard_or_block', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  kiera: ['idle', 'walk', 'run', 'aim', 'shoot_loop', 'reload_or_reset', 'charge', 'skill_cast', 'hit_react', 'dash_or_dodge', 'town_idle', 'victory', 'down_or_death'],
  helma: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'buff_cast', 'summon_or_rune', 'charge', 'hit_react', 'guard_or_block', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  marin: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'attack_basic_03', 'charge', 'skill_cast', 'hit_react', 'dash_or_dodge', 'town_idle', 'talk', 'victory', 'down_or_death'],
  serena: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heal_cast', 'buff_cast', 'cast_loop', 'hit_react', 'dash_or_dodge', 'town_idle', 'pray_idle', 'victory', 'down_or_death'],
  fin: ['idle', 'walk', 'run', 'aim', 'shoot_loop', 'reload_or_reset', 'skill_cast', 'hit_react', 'dash_or_dodge', 'town_idle', 'talk', 'victory', 'down_or_death'],
  iris: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'attack_basic_03', 'charge', 'skill_cast', 'hit_react', 'guard_or_block', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  wolf: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heavy_attack', 'charge', 'taunt_or_command', 'hit_react', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  erin: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'cast_start', 'cast_loop', 'summon_or_rune', 'hit_react', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  nazir: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'attack_basic_03', 'charge', 'skill_cast', 'stealth_entry', 'hit_react', 'dash_or_dodge', 'town_idle', 'talk', 'victory', 'down_or_death'],
  laila: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'cast_start', 'cast_release', 'summon_or_rune', 'hit_react', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
  hakan: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heavy_attack', 'charge', 'skill_cast', 'hit_react', 'guard_or_block', 'dash_or_dodge', 'town_idle', 'taunt_or_command', 'victory', 'down_or_death'],
  seraphin: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'heavy_attack', 'skill_cast', 'heal_cast', 'hit_react', 'guard_or_block', 'dash_or_dodge', 'pray_idle', 'town_idle', 'victory', 'down_or_death'],
  micaela: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'cast_start', 'heal_cast', 'buff_cast', 'pray_idle', 'hit_react', 'dash_or_dodge', 'town_idle', 'victory', 'down_or_death'],
  lucian: ['idle', 'walk', 'run', 'attack_basic_01', 'attack_basic_02', 'attack_basic_03', 'charge', 'skill_cast', 'stealth_entry', 'hit_react', 'dash_or_dodge', 'town_idle', 'interact', 'victory', 'down_or_death'],
};

export function getAnimationViewerCategories(): Array<{
  id: AnimationViewerCategory;
  name: string;
}> {
  return [
    { id: 'character', name: 'Character' },
    { id: 'enemy', name: 'Enemy' },
    { id: 'npc', name: 'NPC' },
    { id: 'effect', name: 'Effect' },
  ];
}

export function getAnimationViewerSubjects(
  category: AnimationViewerCategory,
): AnimationSubjectDefinition[] {
  if (category === 'character') {
    return buildCharacterSubjects();
  }

  if (category === 'enemy') {
    return ENEMY_SUBJECTS;
  }

  if (category === 'npc') {
    return NPC_SUBJECTS;
  }

  return EFFECT_SUBJECTS;
}

export function getAnimationViewerSubject(
  category: AnimationViewerCategory,
  subjectId: string,
): AnimationSubjectDefinition {
  const subject = getAnimationViewerSubjects(category).find((entry) => entry.id === subjectId);

  if (!subject) {
    throw new Error(`Unknown animation viewer subject: ${category}/${subjectId}`);
  }

  return subject;
}

export function getAnimationViewerAction(
  category: AnimationViewerCategory,
  subjectId: string,
  actionId: string,
): AnimationClipDefinition {
  const action = getAnimationViewerSubject(category, subjectId).actions.find((entry) => entry.id === actionId);

  if (!action) {
    throw new Error(`Unknown animation viewer action: ${category}/${subjectId}/${actionId}`);
  }

  return action;
}

export function getDefaultAnimationViewerSelection(): AnimationViewerSelection {
  const subject = getAnimationViewerSubjects('character')[0];
  const preferredActionId = subject.id === 'hero' && subject.actions.some((entry) => entry.id === 'talk')
    ? 'talk'
    : subject.actions[0].id;
  return {
    category: 'character',
    subjectId: subject.id,
    actionId: preferredActionId,
  };
}

function buildCharacterSubjects(): AnimationSubjectDefinition[] {
  return getAllCharacters().map((character) => ({
    id: character.id,
    name: character.name,
    category: 'character',
    tint: CHARACTER_TINTS[character.role],
    atlasFrame: AtlasFrame.Hero,
    role: character.role,
    actions: resolveActionIds(
      uniqueActionIds(
        CHARACTER_ACTION_OVERRIDES[character.id] ??
          [...CHARACTER_BASE_ACTION_IDS, ...(ROLE_EXTRA_ACTION_IDS[character.role] ?? [])],
      ),
    ),
  }));
}

function uniqueActionIds(actionIds: readonly string[]): string[] {
  return [...new Set(actionIds)];
}

function resolveActionIds(actionIds: readonly string[]): AnimationClipDefinition[] {
  return actionIds.map((actionId) => {
    const action = ACTION_LIBRARY[actionId];

    if (!action) {
      throw new Error(`Unknown animation action id: ${actionId}`);
    }

    return action;
  });
}

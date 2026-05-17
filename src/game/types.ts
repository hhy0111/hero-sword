export type StageDifficulty = 'normal' | 'hard' | 'hell';
export type SaveSchemaVersion = 3;
export type StageKind =
  | 'intro'
  | 'field'
  | 'dungeon'
  | 'defense'
  | 'mid_boss'
  | 'pursuit'
  | 'stronghold'
  | 'crisis'
  | 'pre_boss'
  | 'final_boss';

export interface StageProgress {
  normal: number;
  hard: number;
  hell: number;
}

export interface WorldState {
  unlockedContinents: string[];
  stageStars: Record<string, StageProgress>;
}

export interface ContinentDefinition {
  id: string;
  order: number;
  name: string;
  townName: string;
  storyAct: string;
  summary: string;
  accentColor: number;
}

export interface StageDefinition {
  id: string;
  continentId: string;
  order: number;
  name: string;
  stageType: StageKind;
  storyBeat: string;
  baseTimeSeconds: number;
  rewardGold: number;
  recommendedPower: number;
}

export interface PlayerProfile {
  gold: number;
  premiumCurrency: number;
  heroStones: number;
  fatigue: number;
  maxFatigue: number;
  lastFatigueTickAt: number;
  lastAdTenSummonDate: string | null;
  ownedProductIds: string[];
}

export type BattleRole =
  | 'leader'
  | 'guardian'
  | 'mage'
  | 'healer'
  | 'ranger'
  | 'support'
  | 'warrior'
  | 'assassin';

export type CharacterRarity = 3 | 4 | 5;
export type WeaponClass =
  | 'sword'
  | 'shield_sword'
  | 'tome'
  | 'staff'
  | 'bow'
  | 'war_hammer'
  | 'cannon'
  | 'rune_hammer'
  | 'spear'
  | 'sea_staff'
  | 'pistol'
  | 'knight_sword'
  | 'greatsword'
  | 'record_book'
  | 'scimitar'
  | 'relic_staff'
  | 'lance'
  | 'holy_blade'
  | 'hymn_staff'
  | 'daggers';
export type ArmorClass = 'plate' | 'heavy' | 'mobile' | 'light' | 'robe' | 'cleric' | 'runic';

export interface EquipmentStats {
  attack?: number;
  magic?: number;
  hp?: number;
  defense?: number;
  critRate?: number;
  critDamage?: number;
  skillHaste?: number;
  healPower?: number;
  accuracy?: number;
  blockRate?: number;
  evadeRate?: number;
  buffPower?: number;
  pierce?: number;
  statusResist?: number;
  statusAccuracy?: number;
  chargeDamage?: number;
}

export interface OwnedCharacterState {
  copies: number;
}

export interface CharacterProgressState {
  level: number;
  exp: number;
}

export interface RosterState {
  ownedCharacters: Record<string, OwnedCharacterState>;
  selectedPartyIds: string[];
  characterProgress: Record<string, CharacterProgressState>;
}

export interface CollectionState {
  weaponCopies: Record<string, number>;
  armorCopies: Record<string, number>;
  itemCopies: Record<string, number>;
  equipmentLoadouts: Record<string, CharacterEquipmentState>;
}

export interface CharacterEquipmentState {
  weaponId: string | null;
  armorId: string | null;
}

export interface HousingSlots {
  left: string;
  center: string;
  right: string;
}

export interface HousingState {
  ownedFurnitureIds: string[];
  slots: HousingSlots;
}

export interface StoryState {
  seenCutsceneIds: string[];
  seenStageStoryEventIds: string[];
  flags: string[];
}

export interface SaveSnapshot {
  schemaVersion: SaveSchemaVersion;
  createdAt: number;
  updatedAt: number;
  profile: PlayerProfile;
  world: WorldState;
  roster: RosterState;
  collection: CollectionState;
  housing: HousingState;
  story: StoryState;
}

export interface StageEntryRequest {
  continentId: string;
  stageId: string;
  difficulty: StageDifficulty;
  now: number;
}

export interface StageCompleteRequest {
  continentId: string;
  stageId: string;
  difficulty: StageDifficulty;
  starsEarned: number;
  clearTimeSeconds: number;
  now: number;
}

export interface StageSelection {
  continentId: string;
  stageId: string;
  difficulty: StageDifficulty;
}

export type DialogueSpeakerCategory = 'character' | 'npc' | 'enemy';

export interface DialogueSpeaker {
  category: DialogueSpeakerCategory;
  subjectId: string;
  name: string;
}

export interface DialogueLine {
  speaker: DialogueSpeaker;
  text: string;
}

export interface BattleResult {
  continentId: string;
  continentName: string;
  stageId: string;
  stageName: string;
  difficulty: StageDifficulty;
  outcome: 'clear' | 'fail';
  starsEarned: number;
  clearTimeSeconds: number;
  rewardGold: number;
  rewardRate: number;
  unlockedTarget: string | null;
  totalDamageDealt: number;
  totalDamageTaken: number;
  manualSkillUses: number;
  partyHpRatio: number;
  autoBattleUsed: boolean;
  recruitedCharacterId: string | null;
  expRewards: BattleExpReward[];
}

export interface BattleExpReward {
  characterId: string;
  characterName: string;
  levelBefore: number;
  levelAfter: number;
  expBefore: number;
  expAfter: number;
  expToNextBefore: number;
  expToNextAfter: number;
  expGained: number;
}

export interface SummonResultEntry {
  kind: 'character' | 'weapon';
  id: string;
  name: string;
  rarity: CharacterRarity;
  isNew: boolean;
  copies: number;
  convertedHeroStones: number;
}
